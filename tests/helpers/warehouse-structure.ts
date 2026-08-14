import { Page, expect, Locator } from '@playwright/test';
import { getApiUrl, readAuthFromPage } from './company-access';
import { OlshopDatalist, OlshopFormActions, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const WAREHOUSE_STRUCTURE_DATALIST_PATH = '/supplychain/warehouse-structure';
export const WAREHOUSE_STRUCTURE_EDIT_PATH_PATTERN =
  /\/supplychain\/warehouse-structure\/edit\/\d+/;

export type WarehouseStructureFormData = {
  code: string;
  name: string;
  typeLabel: string;
  /** Optional; biarkan kosong agar toggle Show for all company tampil. */
  parentLabel?: string;
};

export type GeneratorPrefixType = 'Numeric' | 'Alphabet';

export type GeneratorRowData = {
  levelSearch: string;
  prefix: string;
  amount: string;
  prefixType: GeneratorPrefixType;
};

/**
 * POM Warehouse Structure — SCM Master Data.
 * Selector dari pom-registry/warehouse-structure.yaml.
 */
export class WarehouseStructurePage {
  readonly datalist: OlshopDatalist;
  private readonly form: OlshopFormActions;
  private readonly multiselect: OlshopMultiselect;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
    this.form = new OlshopFormActions(page);
    this.multiselect = new OlshopMultiselect(page);
  }

  get codeInput(): Locator {
    return this.page.locator('#code');
  }

  get nameInput(): Locator {
    return this.page.locator('#name');
  }

  get parentCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose Parent');
  }

  get typeCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose Type');
  }

  async readTypeSelectedLabel(): Promise<string> {
    return this.multiselect.selectedLabel(this.typeCombobox);
  }

  get dropOffSwitch(): Locator {
    return this.page
      .locator('#BasicInformation div.flex, form div.flex')
      .filter({ has: this.page.getByText('Drop Off', { exact: true }) })
      .locator('input[type="checkbox"]')
      .first();
  }

  get activeSwitch(): Locator {
    return this.page
      .locator('#BasicInformation div.flex, form div.flex')
      .filter({ has: this.page.getByText('Active', { exact: true }) })
      .locator('input[type="checkbox"]')
      .first();
  }

  get showForAllCompanySwitch(): Locator {
    return this.page
      .locator('#BasicInformation div.flex, form div.flex')
      .filter({ has: this.page.getByText('Show for all company', { exact: true }) })
      .locator('input[type="checkbox"]')
      .first();
  }

  async gotoDatalist(): Promise<void> {
    // Halaman WH Structure sering me-redirect ulang (tree fetch) — retry jika navigation interrupted
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await this.datalist.gotoAndWait(WAREHOUSE_STRUCTURE_DATALIST_PATH, 'link');
        return;
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        if (
          attempt < 2 &&
          (msg.includes('interrupted by another navigation') ||
            msg.includes('Execution context was destroyed'))
        ) {
          await this.page.waitForTimeout(1_500);
          continue;
        }
        throw error;
      }
    }
  }

  /** Search di datalist yang sudah terbuka (hindari double goto setelah prepareSession). */
  async searchDatalist(query: string, settleMs = 2_000): Promise<void> {
    await expect(this.datalist.table).toBeVisible({ timeout: 45_000 });
    await this.datalist.search(query, settleMs);
  }

  async openCreateForm(): Promise<void> {
    await this.datalist.clickCreate('link');
    await this.page.waitForURL(/\/supplychain\/warehouse-structure\/create/, {
      timeout: 45_000,
    });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Basic Information');
    await expect(this.codeInput).toBeVisible({ timeout: 30_000 });
  }

  async isCodeVisibleInDatalist(
    code: string,
    options?: { alreadyOnDatalist?: boolean },
  ): Promise<boolean> {
    if (!options?.alreadyOnDatalist) {
      await this.gotoDatalist();
    } else {
      await this.searchDatalist(code);
    }
    if (!options?.alreadyOnDatalist) {
      await this.datalist.search(code, 2_000);
    }
    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    return row.isVisible({ timeout: 5_000 }).catch(() => false);
  }

  async selectType(typeLabel: string): Promise<void> {
    const combobox = this.typeCombobox;
    await this.multiselect.open(combobox);

    const searchToken = typeLabel.replace(/^\d+\.\s*/, '').trim() || typeLabel;
    await combobox.fill(searchToken).catch(async () => {
      await combobox.pressSequentially(searchToken, { delay: 40 });
    });
    // select2 delay=700 + refetch — tunggu opsi settle
    await this.page.waitForTimeout(1_200);

    const pattern = new RegExp(
      `^${typeLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
      'i',
    );

    for (let attempt = 0; attempt < 3; attempt++) {
      const option = this.page
        .locator('.multiselect-option:visible')
        .filter({ hasText: pattern })
        .first();

      if (await option.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await option.click({ force: true });
        await this.page.waitForTimeout(400);
        const selected = await this.multiselect.selectedLabel(combobox);
        if (pattern.test(selected)) {
          return;
        }
      }

      await this.multiselect.open(combobox);
      await combobox.fill(searchToken).catch(async () => {
        await combobox.pressSequentially(searchToken, { delay: 40 });
      });
      await this.page.waitForTimeout(1_200);
    }

    throw new Error(`Gagal memilih Type "${typeLabel}"`);
  }

  async fillCreateForm(data: WarehouseStructureFormData): Promise<void> {
    await this.codeInput.fill(data.code);
    await this.nameInput.fill(data.name);

    if (data.parentLabel) {
      await this.multiselect.ensureValue(this.parentCombobox, data.parentLabel);
    }

    await this.selectType(data.typeLabel);

    await this.ensureDropOffOn();
    await this.ensureActiveOn();
    // Tanpa parent → Show for all company tampil
    await this.ensureShowForAllCompanyOn();
  }

  async ensureDropOffOn(): Promise<void> {
    const sw = this.dropOffSwitch;
    await expect(sw, 'Toggle Drop Off (create only)').toBeVisible({ timeout: 15_000 });
    if (!(await sw.isChecked().catch(() => false))) {
      await sw.click({ force: true });
      await expect(sw).toBeChecked({ timeout: 10_000 });
    }
  }

  async ensureActiveOn(): Promise<void> {
    const sw = this.activeSwitch;
    await expect(sw).toBeVisible({ timeout: 15_000 });
    if (!(await sw.isChecked().catch(() => false))) {
      await sw.click({ force: true });
      await expect(sw).toBeChecked({ timeout: 10_000 });
    }
  }

  async ensureShowForAllCompanyOn(): Promise<void> {
    const sw = this.showForAllCompanySwitch;
    await expect(sw, 'Toggle Show for all company (butuh parent kosong)').toBeVisible({
      timeout: 15_000,
    });
    if (!(await sw.isChecked().catch(() => false))) {
      await sw.click({ force: true });
      await expect(sw).toBeChecked({ timeout: 10_000 });
    }
  }

  async clickSaveAndNextAndWaitForEdit(): Promise<number> {
    const saveResponse = this.page.waitForResponse(
      (response) =>
        /\/supplychain\/warehouse\/?$/.test(new URL(response.url()).pathname) &&
        response.request().method() === 'POST',
      { timeout: 120_000 },
    );

    await this.form.clickSaveAndNext();

    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
      data?: { id?: number; code?: string };
    } | null;

    if (!response.ok() || body?.status?.error) {
      throw new Error(
        `Save Warehouse Structure gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await this.page.waitForURL(WAREHOUSE_STRUCTURE_EDIT_PATH_PATTERN, {
      timeout: 60_000,
    });
    await waitForSuccessToast(this.page, 5_000).catch(() => undefined);
    await dismissStagingBanner(this.page);

    const idMatch = this.page.url().match(/\/edit\/(\d+)/);
    const id = idMatch ? Number(idMatch[1]) : body?.data?.id;
    if (!id) {
      throw new Error('Tidak mendapat warehouse id setelah create');
    }
    return id;
  }

  /**
   * Verifikasi child DROPOFF via select2 API + Parent dropdown tidak menampilkannya.
   * Catatan: treeById hanya level >= 59 — tidak cocok untuk Rack/drop-off.
   */
  async assertDropOffChildCreated(parentId: number, code: string): Promise<void> {
    const dropOffCode = `${code}DROPOFF`;
    const auth = await readAuthFromPage(this.page);
    const api = getApiUrl();

    // 1) Drop-off ada di DB (select2 dengan flag is_drop_off)
    const withDropOff = await this.page.request.get(
      `${api}/supplychain/warehouse/select2?q=${encodeURIComponent(dropOffCode)}&is_drop_off=1`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      },
    );
    expect(withDropOff.ok(), `API select2 drop-off untuk ${dropOffCode}`).toBeTruthy();
    const withBody = (await withDropOff.json().catch(() => null)) as {
      data?: Array<{ code?: string; name?: string; id?: number }>;
    } | null;
    const found = (withBody?.data ?? []).some(
      (row) =>
        String(row.code ?? '').toUpperCase() === dropOffCode.toUpperCase() ||
        String(row.name ?? '')
          .toUpperCase()
          .includes('DROPOFF'),
    );
    expect(
      found,
      `Child drop-off ${dropOffCode} harus tercipta (parent id ${parentId})`,
    ).toBeTruthy();

    // 2) Drop-off terkunci dari opsi Parent Group Name (default select2 exclude is_drop_off)
    await this.openCreateForm();
    await this.multiselect.open(this.parentCombobox);
    await this.parentCombobox.fill(dropOffCode).catch(async () => {
      await this.parentCombobox.pressSequentially(dropOffCode, { delay: 40 });
    });
    await this.page.waitForTimeout(1_200);

    const matching = this.multiselect
      .visibleOptions()
      .filter({
        hasText: new RegExp(dropOffCode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      });
    expect(
      await matching.count(),
      `Drop-off ${dropOffCode} tidak boleh muncul sebagai opsi Parent Group Name`,
    ).toBe(0);

    await this.page.keyboard.press('Escape').catch(() => undefined);
    await this.gotoDatalist();
  }

  async openEditFromDatalistByCode(code: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(code, 2_000);

    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Baris Warehouse Structure ${code}`).toBeVisible({
      timeout: 45_000,
    });

    const editBtn = this.datalist.editButton(row).first();
    await expect(editBtn).toBeVisible({ timeout: 30_000 });
    await editBtn.click();

    await this.page.waitForURL(WAREHOUSE_STRUCTURE_EDIT_PATH_PATTERN, {
      timeout: 45_000,
    });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Basic Information');
    await expect(this.codeInput).toHaveValue(code, { timeout: 30_000 });
  }

  async updateCode(code: string): Promise<void> {
    await this.codeInput.fill(code);
  }

  async clickSaveAllAndWait(): Promise<void> {
    const saveResponse = this.page
      .waitForResponse(
        (response) =>
          /\/supplychain\/warehouse\/\d+/.test(response.url()) &&
          ['PUT', 'POST'].includes(response.request().method()),
        { timeout: 120_000 },
      )
      .catch(() => null);

    await this.form.clickSaveAll();

    const response = await saveResponse;
    if (response) {
      const body = (await response.json().catch(() => null)) as {
        status?: { error?: number; message?: string };
      } | null;
      if (!response.ok() || body?.status?.error) {
        throw new Error(
          `Update Warehouse Structure gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
        );
      }
    }

    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(1_000);
  }

  async assertInDatalist(code: string, name?: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(code, 2_000);
    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Warehouse ${code} harus tampil di datalist`).toBeVisible({
      timeout: 45_000,
    });
    if (name) {
      await expect(row).toContainText(name);
    }
  }

  get generatorSection(): Locator {
    return this.page.locator('#WarehouseGenerator');
  }

  get generatorRows(): Locator {
    return this.generatorSection.locator('.grid.grid-cols-12');
  }

  /**
   * Code, Name, Type wajib terisi sebelum Child Warehouse Generator bisa dipakai.
   * Indikator UI: ikon circle-check hijau di sidebar "Basic Information".
   */
  async ensureBasicInformationFilled(): Promise<void> {
    await expect(this.codeInput, 'Code wajib diisi sebelum generator').not.toHaveValue('');
    await expect(this.nameInput, 'Name wajib diisi sebelum generator').not.toHaveValue('');
    await this.multiselect.assertFilled(this.typeCombobox, 'Type');

    const basicCheck = this.page
      .locator('li')
      .filter({ hasText: /Basic Information/i })
      .locator('.text-green-500')
      .first();
    await expect(
      basicCheck,
      'Basic Information belum lengkap (Code, Name, Type)',
    ).toBeVisible({ timeout: 15_000 });
  }

  async ensureGeneratorFieldsEnabled(): Promise<void> {
    const prefixInput = this.generatorSection.locator('[placeholder="Prefix"]').first();
    await expect(
      prefixInput,
      'Prefix generator harus enabled setelah Basic Information terisi',
    ).toBeEnabled({ timeout: 15_000 });
  }

  async expandChildWarehouseGenerator(): Promise<void> {
    await this.ensureBasicInformationFilled();
    await this.page
      .locator('li')
      .filter({ hasText: /Warehouse Generator/i })
      .first()
      .click({ timeout: 8_000 })
      .catch(() => undefined);
    await this.form.expandAccordion('Child Warehouse Generator');
    await expect(this.generatorSection).toBeVisible({ timeout: 20_000 });
    await this.ensureGeneratorFieldsEnabled();
  }

  async assertGeneratorHiddenOnEdit(): Promise<void> {
    await expect(
      this.page.getByRole('button', { name: 'Child Warehouse Generator', exact: true }),
    ).toHaveCount(0);
    await expect(this.generatorSection).toHaveCount(0);
  }

  async fillCreateHeaderWithoutDropOff(data: WarehouseStructureFormData): Promise<void> {
    await this.codeInput.fill(data.code);
    await this.nameInput.fill(data.name);
    if (data.parentLabel) {
      await this.multiselect.ensureValue(this.parentCombobox, data.parentLabel);
    }
    await this.selectType(data.typeLabel);
    await this.nameInput.click();
    await this.page.waitForTimeout(400);
    await this.ensureDropOffOff();
    await this.ensureActiveOn();
    await this.ensureShowForAllCompanyOn();
    await this.ensureBasicInformationFilled();
  }

  async ensureDropOffOff(): Promise<void> {
    const sw = this.dropOffSwitch;
    if (!(await sw.isVisible({ timeout: 5_000 }).catch(() => false))) {
      return;
    }
    if (await sw.isChecked().catch(() => false)) {
      await sw.click({ force: true });
      await expect(sw).not.toBeChecked({ timeout: 10_000 });
    }
  }

  async addGeneratorRow(): Promise<void> {
    const addBtn = this.generatorRows.first().locator('button[type="button"]').first();
    await expect(addBtn, 'Tombol tambah baris generator').toBeVisible({ timeout: 15_000 });
    await addBtn.click();
    await this.page.waitForTimeout(400);
  }

  async fillGeneratorRow(index: number, data: GeneratorRowData): Promise<void> {
    const row = this.generatorRows.nth(index);
    await expect(row, `Baris generator ${index + 1}`).toBeVisible({ timeout: 15_000 });

    const level = row.locator('[aria-placeholder="Warehouse Level"]');
    await this.selectGeneratorLevel(level, data.levelSearch);
    await this.page.waitForTimeout(400);

    await row.locator('[placeholder="Prefix"]').fill(data.prefix);
    await row.locator('[placeholder="Amount"]').fill(data.amount);

    await this.selectGeneratorPrefixType(row, data.prefixType);
  }

  /** Multiselect Prefix Type di kolom kanan baris generator (Numeric / Alphabet). */
  generatorPrefixTypeMultiselect(row: Locator): Locator {
    return row.locator('.multiselect').last();
  }

  async selectGeneratorPrefixType(
    row: Locator,
    prefixType: GeneratorPrefixType,
  ): Promise<void> {
    const multiselect = this.generatorPrefixTypeMultiselect(row);
    await expect(
      multiselect,
      'Prefix Type multiselect harus tampil di baris generator',
    ).toBeVisible({ timeout: 15_000 });
    await expect(multiselect).toBeEnabled({ timeout: 15_000 });

    const singleLabel = multiselect.locator('.multiselect-single-label');
    const current = (await singleLabel.textContent().catch(() => ''))?.trim() ?? '';
    const already =
      new RegExp(`^${prefixType}$`, 'i').test(current) ||
      (prefixType === 'Numeric' && /^numeric$/i.test(current));
    if (already && !/prefix type|choose/i.test(current)) {
      return;
    }

    // Buka dropdown via area kontrol multiselect (caret/label di kiri field search)
    const openTarget = multiselect
      .locator('.multiselect-caret, .multiselect-single-label, .multiselect-placeholder')
      .first();
    await openTarget.click({ force: true });
    await this.page.waitForTimeout(600);

    const combobox = multiselect.locator('[aria-placeholder="Prefix Type"]');
    if (await combobox.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await combobox.click({ force: true }).catch(() => undefined);
    }

    const option = this.page
      .locator('.multiselect-dropdown:visible .multiselect-option:visible')
      .filter({ hasText: new RegExp(`^${prefixType}$`, 'i') })
      .first();
    await expect(option, `Opsi Prefix Type ${prefixType}`).toBeVisible({ timeout: 10_000 });
    await option.click();
    await this.page.waitForTimeout(300);

    const after = (await singleLabel.textContent())?.trim() ?? '';
    expect(
      after,
      `Prefix Type baris harus ${prefixType} (sekarang: "${after}")`,
    ).toMatch(new RegExp(prefixType, 'i'));
    expect(after, 'Prefix Type tidak boleh kosong/placeholder').not.toMatch(
      /prefix type|^choose/i,
    );
  }

  /**
   * Pilih Warehouse Level di baris generator tanpa ketik search
   * (q search sering mengosongkan list). Jika label tidak ketemu, ambil opsi enabled pertama.
   */
  async selectGeneratorLevel(combobox: Locator, levelSearch: string): Promise<void> {
    await this.multiselect.open(combobox);
    await this.page.waitForTimeout(1_200);

    const options = this.multiselect.visibleOptions();
    await expect(options.first(), 'Opsi Warehouse Level generator').toBeVisible({
      timeout: 15_000,
    });

    const named = options
      .filter({ hasNotText: /drop\s*off/i })
      .filter({ hasText: new RegExp(levelSearch, 'i') })
      .first();
    if (await named.isVisible().catch(() => false)) {
      await named.click({ force: true });
      return;
    }

    const firstUsable = options.filter({ hasNotText: /drop\s*off/i }).first();
    await firstUsable.click({ force: true });
  }

  /** Ambil pesan error dari response API (status.message atau Laravel errors bag). */
  static extractApiErrorMessage(body: unknown): string {
    if (!body || typeof body !== 'object') {
      return '';
    }
    const b = body as {
      status?: { error?: number | boolean; message?: string; errors?: Record<string, string[]> };
      message?: string;
      errors?: Record<string, string[]>;
      data?: { id?: number };
    };
    if (b.status?.message) {
      return String(b.status.message);
    }
    if (typeof b.message === 'string' && b.message.trim()) {
      return b.message.trim();
    }
    const bag = b.errors ?? b.status?.errors;
    if (bag && typeof bag === 'object') {
      return Object.values(bag)
        .flat()
        .map(String)
        .join(' | ');
    }
    return '';
  }

  async clickSaveAndNextCaptureBody(): Promise<{
    ok: boolean;
    status: number;
    message: string;
    id?: number;
  }> {
    const saveResponse = this.page.waitForResponse(
      (response) =>
        /\/supplychain\/warehouse\/?$/.test(new URL(response.url()).pathname) &&
        response.request().method() === 'POST',
      { timeout: 120_000 },
    );

    await this.form.clickSaveAndNext();
    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number | boolean; message?: string };
      data?: { id?: number };
    } | null;

    const message = WarehouseStructurePage.extractApiErrorMessage(body);
    const hasError = Boolean(body?.status?.error) || !response.ok();
    return {
      ok: !hasError,
      status: response.status(),
      message,
      id: body?.data?.id,
    };
  }

  /**
   * Isi Code + Name saja (Type opsional). Untuk TC validasi Type kosong.
   */
  async fillCreateHeaderCodeName(
    data: { code: string; name: string; typeLabel?: string },
    options?: { dropOffOff?: boolean },
  ): Promise<void> {
    await this.codeInput.fill(data.code);
    await this.nameInput.fill(data.name);
    if (data.typeLabel) {
      await this.selectType(data.typeLabel);
      await this.nameInput.click();
      await this.page.waitForTimeout(400);
    }
    if (options?.dropOffOff !== false && data.typeLabel) {
      await this.ensureDropOffOff();
    }
    await this.ensureActiveOn();
    if (data.typeLabel) {
      await this.ensureShowForAllCompanyOn().catch(() => undefined);
    }
  }

  async setGeneratorPrefix(rowIndex: number, prefix: string): Promise<void> {
    const row = this.generatorRows.nth(rowIndex);
    await row.locator('[placeholder="Prefix"]').fill(prefix);
  }

  async waitForGeneratedChildByPrefix(
    prefix: string,
    parentCode: string,
    timeoutMs = 180_000,
  ): Promise<void> {
    const auth = await readAuthFromPage(this.page);
    const api = getApiUrl();
    const query = `${prefix}-`;
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
      const res = await this.page.request.get(
        `${api}/supplychain/warehouse/select2?q=${encodeURIComponent(query)}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
        },
      );
      const body = (await res.json().catch(() => null)) as {
        data?: Array<{ code?: string }>;
      } | null;
      const found = (body?.data ?? []).some((row) => {
        const code = String(row.code ?? '').toUpperCase();
        return (
          code.startsWith(`${prefix.toUpperCase()}-`) &&
          code.includes(parentCode.toUpperCase())
        );
      });
      if (found) {
        return;
      }
      await this.page.waitForTimeout(5_000);
    }

    throw new Error(
      `Child generator prefix ${prefix} untuk parent ${parentCode} belum muncul dalam ${timeoutMs}ms`,
    );
  }

  async countSelect2ByQuery(query: string): Promise<number> {
    const auth = await readAuthFromPage(this.page);
    const api = getApiUrl();
    const res = await this.page.request.get(
      `${api}/supplychain/warehouse/select2?q=${encodeURIComponent(query)}`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      },
    );
    const body = (await res.json().catch(() => null)) as {
      data?: Array<{ code?: string }>;
    } | null;
    return (body?.data ?? []).filter((row) =>
      String(row.code ?? '')
        .toUpperCase()
        .includes(query.toUpperCase()),
    ).length;
  }
}
