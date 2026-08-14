import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopFormActions, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const ASSEMBLY_DATALIST_PATH = '/supplychain/assembly';
export const ASSEMBLY_EDIT_PATH_PATTERN =
  /\/supplychain\/assembly\/edit\/\d+/;

/**
 * POM Assembly (SCM) — UI `/supplychain/assembly`, API `supplychain/work-order`.
 * Selector: tests/pom-registry/assembly.yaml
 * FE source: D:/olshoperp/olshoperp-frontend/src/pages/SCM/master/Assembly
 *
 * AS-IS: Form.fetchDefaultValues() isi warehouse_id lalu submit() otomatis.
 * Type default = 'Assembly'; prefix code AS*.
 * Open membutuhkan minimal 1 detail FG (Header BOM) — jangan Open sebelum detail.
 */
export class AssemblyPage {
  readonly datalist: OlshopDatalist;
  private readonly form: OlshopFormActions;
  private readonly multiselect: OlshopMultiselect;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
    this.form = new OlshopFormActions(page);
    this.multiselect = new OlshopMultiselect(page);
  }

  // ─── Locators — Basic / status / detail ───────────────────────────────

  get codeInput(): Locator {
    return this.page.locator('#code');
  }

  get buildingCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose Building Origin');
  }

  get typeCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose type');
  }

  get descriptionInput(): Locator {
    return this.page.getByPlaceholder('Add description or notes...');
  }

  get progressStatusInput(): Locator {
    return this.page
      .locator('div')
      .filter({ has: this.page.getByText('Progress Status', { exact: false }) })
      .locator('input')
      .first();
  }

  get draftRadio(): Locator {
    return this.page.locator('#draft');
  }

  get openRadio(): Locator {
    return this.page.locator('#open');
  }

  get selectProductCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Select Product');
  }

  get productDetailsSection(): Locator {
    return this.page.locator('#ProductDetails').first();
  }

  /** Icon check-double di samping Save All (Tippy "Approve") — Form.vue. */
  get approveButton(): Locator {
    return this.page
      .locator('button')
      .filter({ has: this.page.locator('[data-tippy-content="Approve"], .tippy') })
      .or(
        this.page
          .locator('button')
          .filter({ has: this.page.locator('svg, .fa-check-double, [data-icon="check-double"]') })
          .filter({ hasNotText: /Save/i }),
      )
      .or(this.page.getByRole('button', { name: /^Approve$/i }))
      .last();
  }

  get printDetailControl(): Locator {
    return this.page
      .locator('[data-tippy-content="Print Detail"]')
      .or(this.page.locator('font-awesome-icon[icon="print"], .fa-print').first())
      .first();
  }

  get approvalModalDescription(): Locator {
    return this.page.getByPlaceholder(
      'Add information about why you are approving this transaction.',
    );
  }

  get approvalModalApproveButton(): Locator {
    return this.page.getByRole('button', { name: /^Approve$/i }).last();
  }

  get approvalModalRejectButton(): Locator {
    return this.page.getByRole('button', { name: /^Reject$/i });
  }

  get approveNowButton(): Locator {
    return this.page.getByRole('button', { name: /Approve Now/i });
  }

  get stockReservedBanner(): Locator {
    return this.page.getByText(
      'Stock has been reserved and all related documents have been generated.',
    );
  }

  get detailModalProduct(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose Product');
  }

  get detailModalUnit(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose Unit');
  }

  get detailModalSave(): Locator {
    return this.page.locator('[data-modal-save]');
  }

  // ─── Locators — Datalist toolbar ──────────────────────────────────────

  get advancedFilterButton(): Locator {
    return this.page.getByRole('button', { name: /Advanced Filter/i });
  }

  get exportButton(): Locator {
    return this.page.getByRole('button', { name: /^Export$/i });
  }

  get bulkApproveButton(): Locator {
    return this.page.locator('button.bulk-approve');
  }

  get bulkDeleteButton(): Locator {
    return this.page.locator('button.delete-bulk');
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(ASSEMBLY_DATALIST_PATH, 'link');
  }

  async openCreateForm(): Promise<'create' | 'edit'> {
    await this.datalist.clickCreate('link');

    const raced = await Promise.race([
      this.page
        .waitForURL(ASSEMBLY_EDIT_PATH_PATTERN, { timeout: 60_000 })
        .then(() => 'edit' as const),
      this.page
        .waitForURL(/\/supplychain\/assembly\/create$/, { timeout: 60_000 })
        .then(() => 'create' as const),
    ]);

    await dismissStagingBanner(this.page);

    if (raced === 'edit') {
      await this.expandBasicInformation();
      await expect(this.codeInput).not.toHaveValue('', { timeout: 30_000 });
      return 'edit';
    }

    await this.expandBasicInformation();
    await expect(
      this.buildingCombobox.or(
        this.page.locator('.multiselect').filter({
          has: this.page.locator('[aria-placeholder="Choose Building Origin"]'),
        }),
      ).first(),
    ).toBeVisible({ timeout: 45_000 });

    const autoEdit = await this.page
      .waitForURL(ASSEMBLY_EDIT_PATH_PATTERN, { timeout: 8_000 })
      .then(() => true)
      .catch(() => false);
    if (autoEdit) {
      await this.expandBasicInformation();
      return 'edit';
    }

    return 'create';
  }

  private async expandBasicInformation(): Promise<void> {
    const basic = this.page.getByRole('button', {
      name: 'Basic Information',
      exact: true,
    });
    await expect(basic).toBeVisible({ timeout: 45_000 });
    if ((await basic.getAttribute('aria-expanded')) !== 'true') {
      await basic.click();
      await this.page.waitForTimeout(700);
    }
  }

  async expandAssemblyDetail(): Promise<void> {
    const btn = this.page.getByRole('button', {
      name: 'Assembly Detail',
      exact: true,
    });
    await expect(btn).toBeVisible({ timeout: 45_000 });
    if ((await btn.getAttribute('aria-expanded')) !== 'true') {
      await btn.click();
      await this.page.waitForTimeout(700);
    }
  }

  async ensureBuildingOriginSelected(): Promise<string> {
    const root = this.page
      .locator('div')
      .filter({
        has: this.page.getByText('Building Origin', { exact: false }),
      })
      .locator('.multiselect')
      .first();

    const single = root.locator('.multiselect-single-label');
    if (await single.isVisible({ timeout: 3_000 }).catch(() => false)) {
      const label = ((await single.textContent()) ?? '').trim();
      if (label && !/^choose/i.test(label)) {
        return label;
      }
    }

    let combobox = this.buildingCombobox;
    if (!(await combobox.isVisible().catch(() => false))) {
      await root.click();
      combobox = root.locator('.multiselect-search').first();
      await expect(combobox).toBeVisible({ timeout: 10_000 });
    }

    const current = await this.multiselect.selectedLabel(combobox);
    if (current && !/^choose/i.test(current)) {
      return current;
    }

    await this.multiselect.open(combobox);
    await this.page.waitForTimeout(600);
    const option = this.page
      .locator('.multiselect-option:visible')
      .filter({ hasNotText: 'No results found' })
      .first();
    await expect(option, 'Minimal 1 Building Origin').toBeVisible({
      timeout: 25_000,
    });
    const text = ((await option.textContent()) ?? '').trim();
    await option.click();
    await this.page.waitForTimeout(500);
    return text;
  }

  async ensureTypeSelected(preferred = 'Assembly'): Promise<void> {
    let combobox = this.typeCombobox;
    if (!(await combobox.isVisible({ timeout: 5_000 }).catch(() => false))) {
      const root = this.page
        .locator('#BasicInformation .multiselect')
        .filter({
          has: this.page.locator('[aria-placeholder="Choose type"]'),
        })
        .first();
      await root.click();
      combobox = root.locator('.multiselect-search').first();
      await expect(combobox).toBeVisible({ timeout: 10_000 });
    }

    const current = await this.multiselect.selectedLabel(combobox);
    if (new RegExp(`^${preferred}$`, 'i').test(current.trim())) {
      return;
    }

    // Selalu paksa pilih — AS-IS edit kadang type kosong meski create pakai default
    await this.multiselect.open(combobox);
    await this.page.waitForTimeout(400);
    const option = this.page
      .locator('.multiselect-option:visible')
      .filter({ hasText: new RegExp(`^\\s*${preferred}\\s*$`, 'i') })
      .first();
    if (await option.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await option.click();
    } else {
      await this.multiselect.selectOption(combobox, preferred, {
        exact: true,
        typeToFilter: preferred,
      });
    }
    await this.page.waitForTimeout(400);
  }

  async fillDescription(text: string): Promise<void> {
    await this.descriptionInput.fill(text);
  }

  async clickSaveAndNextAndWaitForEdit(): Promise<void> {
    const saveResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        const pathname = new URL(response.url()).pathname.replace(/\/$/, '');
        return (
          pathname === '/api/supplychain/work-order' ||
          pathname.endsWith('/supplychain/work-order')
        );
      },
      { timeout: 90_000 },
    );

    await this.form.clickSaveAndNext();

    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number | string; message?: string };
    } | null;
    if (!response.ok() || Number(body?.status?.error ?? 0)) {
      throw new Error(
        `Save Assembly gagal: ${body?.status?.message ?? JSON.stringify(body) ?? `HTTP ${response.status()}`}`,
      );
    }

    await this.page.waitForURL(ASSEMBLY_EDIT_PATH_PATTERN, { timeout: 45_000 });
    await waitForSuccessToast(this.page, 5_000).catch(() => undefined);
    await dismissStagingBanner(this.page);
    await this.expandBasicInformation();
  }

  async readGeneratedCode(): Promise<string> {
    await expect(this.codeInput).not.toHaveValue('', { timeout: 30_000 });
    return (await this.codeInput.inputValue()).trim();
  }

  async openEditFromDatalistByCode(code: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.searchInput.fill('');
    await this.page.waitForTimeout(800);
    await this.datalist.search(code, 2_000);

    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Baris Assembly ${code}`).toBeVisible({
      timeout: 45_000,
    });

    const editBtn = this.datalist.editButton(row).first();
    await expect(editBtn).toBeVisible({ timeout: 30_000 });
    await editBtn.click();

    await this.page.waitForURL(ASSEMBLY_EDIT_PATH_PATTERN, { timeout: 45_000 });
    await dismissStagingBanner(this.page);
    await this.expandBasicInformation();
    await expect(this.codeInput).toHaveValue(code, { timeout: 30_000 });
  }

  async gotoEditUrl(editUrl: string): Promise<void> {
    await this.page.goto(editUrl, { waitUntil: 'domcontentloaded' });
    await dismissStagingBanner(this.page);
    const loaded = await this.codeInput
      .isVisible({ timeout: 30_000 })
      .catch(() => false);
    if (!loaded) {
      await this.page.reload({ waitUntil: 'domcontentloaded' });
      await dismissStagingBanner(this.page);
    }
    await this.expandBasicInformation();
  }

  async clickSaveAllAndWait(): Promise<void> {
    const saveResponse = this.page
      .waitForResponse(
        (response) =>
          /\/work-order\/\d+/.test(response.url()) &&
          ['PUT', 'POST'].includes(response.request().method()) &&
          !response.url().includes('detail') &&
          !response.url().includes('bulk'),
        { timeout: 90_000 },
      )
      .catch(() => null);

    await this.form.clickSaveAll();

    const response = await saveResponse;
    if (response) {
      const body = (await response.json().catch(() => null)) as {
        status?: { error?: number | string; message?: string };
      } | null;
      if (!response.ok() || Number(body?.status?.error ?? 0)) {
        throw new Error(
          `Update Assembly gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
        );
      }
    }

    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(1_000);
  }

  async assertInDatalist(code: string, descriptionSnippet?: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.searchInput.fill('');
    await this.page.waitForTimeout(800);
    await this.datalist.search(code, 2_000);

    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Assembly ${code} harus tampil di datalist`).toBeVisible({
      timeout: 45_000,
    });
    if (descriptionSnippet) {
      await expect(row).toContainText(descriptionSnippet);
    }
  }

  /**
   * Pilih FG Header BOM pertama via Select Product → bulk-fifo.
   * Return SKU atau null jika tidak ada BOM tersedia di company.
   */
  async tryAddFirstFinishGoodsProduct(): Promise<string | null> {
    await this.expandAssemblyDetail();

    // Sudah ada baris dari run sebelumnya / late response
    const existing = await this.readFirstDetailSku();
    if (existing) {
      return existing;
    }

    let combobox = this.selectProductCombobox;
    if (!(await combobox.isVisible({ timeout: 8_000 }).catch(() => false))) {
      const root = this.page
        .locator('#ProductDetails')
        .locator('.multiselect')
        .filter({
          has: this.page.locator('[aria-placeholder="Select Product"]'),
        })
        .first();
      if (!(await root.isVisible({ timeout: 5_000 }).catch(() => false))) {
        return null;
      }
      await root.click();
      combobox = root.locator('.multiselect-search').first();
    }

    await this.multiselect.open(combobox);
    await this.page.waitForTimeout(1_200);

    const options = this.page
      .locator('.multiselect-option:visible')
      .filter({ hasNotText: 'No results found' });

    if ((await options.count()) === 0) {
      await this.page.keyboard.press('Escape').catch(() => undefined);
      return null;
    }

    const option = options.first();
    const strongSku = (
      (await option.locator('strong').first().textContent().catch(() => '')) ??
      ''
    ).trim();
    const sku =
      strongSku ||
      ((await option.textContent()) ?? '').replace(/\s+/g, ' ').trim().slice(0, 40);

    const bulkResponsePromise = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        const url = response.url();
        return (
          /\/work-order\/\d+\/bulk-fifo/.test(url) ||
          (/\/work-order\/\d+/.test(url) && url.includes('bulk'))
        );
      },
      { timeout: 45_000 },
    );

    await option.click();

    const response = await bulkResponsePromise.catch(() => null);
    if (response) {
      const body = (await response.json().catch(() => null)) as {
        status?: { error?: number | string; message?: string };
      } | null;
      if (!response.ok() || Number(body?.status?.error ?? 0)) {
        throw new Error(
          `Add Assembly detail gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
        );
      }
      await waitForSuccessToast(this.page, 15_000).catch(() => undefined);
    }

    await this.page.waitForTimeout(2_000);
    const added = await this.readFirstDetailSku();
    return added ?? sku;
  }

  async readFirstDetailSku(): Promise<string | null> {
    await this.expandAssemblyDetail();
    const section = this.page.locator('#ProductDetails').first();
    const row = section
      .locator('.p-datatable-tbody tr')
      .filter({ hasNotText: /no (records|data)|empty/i })
      .first();
    if (!(await row.isVisible({ timeout: 5_000 }).catch(() => false))) {
      return null;
    }
    const strong = (
      (await row.locator('strong, a').first().textContent().catch(() => '')) ??
      ''
    ).trim();
    if (strong) return strong;
    const text = ((await row.textContent()) ?? '').replace(/\s+/g, ' ').trim();
    const match = text.match(/([A-Z][A-Z0-9._-]{3,})/);
    return match?.[1] ?? null;
  }

  async assertDetailHasProduct(skuToken: string): Promise<void> {
    await this.expandAssemblyDetail();
    const section = this.page.locator('#ProductDetails').first();
    const row = section
      .locator('.p-datatable-tbody tr, tbody tr')
      .filter({
        hasText: new RegExp(
          skuToken.slice(0, 20).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
          'i',
        ),
      })
      .first();
    await expect(
      row,
      `FG ${skuToken} harus ada di Assembly Detail`,
    ).toBeVisible({ timeout: 45_000 });
  }

  /**
   * Inline edit kolom QTY di baris detail pertama (atau filter skuToken).
   * AS-IS: integer-only; PUT work-order/{id}/work-order-detail.
   */
  async setQtyOnDetailRow(
    qty: string | number,
    skuToken?: string,
  ): Promise<string> {
    await this.expandAssemblyDetail();
    const section = this.page.locator('#ProductDetails').first();

    let row = section
      .locator('.p-datatable-tbody tr')
      .filter({ hasNotText: /no (records|data)|empty/i })
      .first();

    if (skuToken) {
      row = section
        .locator('.p-datatable-tbody tr')
        .filter({
          hasText: new RegExp(
            skuToken.slice(0, 20).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
            'i',
          ),
        })
        .first();
    }

    await expect(row, 'Baris Assembly Detail').toBeVisible({ timeout: 30_000 });

    const sku =
      (
        (await row.locator('strong, a').first().textContent().catch(() => '')) ??
        ''
      ).trim() ||
      (await this.readFirstDetailSku()) ||
      skuToken ||
      '';

    let input = row
      .locator('input.p-inputtext, input[type="text"]:not([type="checkbox"])')
      .first();
    if (!(await input.isVisible({ timeout: 3_000 }).catch(() => false))) {
      const cells = row.locator('td');
      const count = await cells.count();
      for (let i = 0; i < count; i++) {
        await cells.nth(i).dblclick().catch(() => cells.nth(i).click());
        input = row
          .locator('input.p-inputtext, input[type="text"]')
          .filter({ hasNot: this.page.locator('[type="checkbox"]') })
          .first();
        if (await input.isVisible({ timeout: 1_000 }).catch(() => false)) {
          break;
        }
      }
    }

    await expect(input, 'QTY input').toBeVisible({ timeout: 10_000 });

    const put = this.page
      .waitForResponse(
        (response) =>
          /\/work-order\/\d+\/work-order-detail/.test(response.url()) &&
          ['PUT', 'POST', 'PATCH'].includes(response.request().method()),
        { timeout: 60_000 },
      )
      .catch(() => null);

    await input.click({ clickCount: 3 });
    await input.fill(String(qty));
    await input.press('Tab');
    const response = await put;
    if (response) {
      const body = (await response.json().catch(() => null)) as {
        status?: { error?: number | string; message?: string };
      } | null;
      if (!response.ok() || Number(body?.status?.error ?? 0)) {
        throw new Error(
          `Update QTY gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
        );
      }
    }
    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(1_500);

    // Verifikasi: jangan pakai checkbox — assert teks QTY di baris / input text
    const qtyInput = row.locator('input.p-inputtext, input[type="text"]').first();
    if (await qtyInput.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await expect(qtyInput).toHaveValue(String(qty), { timeout: 10_000 });
    } else {
      await expect(row.getByText(String(qty), { exact: true }).first()).toBeVisible({
        timeout: 10_000,
      });
    }

    return sku;
  }

  // ─── Datalist toolbar ─────────────────────────────────────────────────

  async clickAdvancedFilterButton(): Promise<void> {
    await this.advancedFilterButton.click();
  }

  async clickExportButton(): Promise<void> {
    await this.exportButton.click();
  }

  async clickBulkApproveButton(): Promise<void> {
    await this.bulkApproveButton.click();
  }

  async clickBulkDeleteButton(): Promise<void> {
    await this.bulkDeleteButton.click();
  }

  // ─── Sidebar panels ───────────────────────────────────────────────────

  async openSidebarApproval(): Promise<void> {
    await this.page
      .locator('li')
      .filter({ hasText: /^Approval/i })
      .or(this.page.getByText('Approval', { exact: true }))
      .first()
      .click();
    await expect(
      this.page.getByRole('heading', { name: /Approval/i }).or(this.approveNowButton),
    )
      .first()
      .toBeVisible({ timeout: 15_000 })
      .catch(() => undefined);
  }

  async openSidebarAuditLog(): Promise<void> {
    await this.page
      .locator('li')
      .filter({ hasText: /Audit Log/i })
      .first()
      .click();
  }

  async openSidebarHistories(): Promise<void> {
    await this.page
      .locator('li')
      .filter({ hasText: /^Histories$/i })
      .first()
      .click();
    await expect(this.page.getByRole('heading', { name: /Histories/i })).toBeVisible({
      timeout: 15_000,
    });
  }

  // ─── Status / Approve / Print ─────────────────────────────────────────

  /**
   * Set status radio Draft|Open — tunggu PUT work-order sebelum aksi berikutnya
   * (radio memicu auto-save + re-render).
   */
  async setTransactionStatus(status: 'draft' | 'open'): Promise<void> {
    const radio = status === 'open' ? this.openRadio : this.draftRadio;
    await expect(radio).toBeVisible({ timeout: 15_000 });

    const put = this.page
      .waitForResponse(
        (response) =>
          /\/work-order\/\d+\/?$/.test(new URL(response.url()).pathname) &&
          response.request().method() === 'PUT',
        { timeout: 60_000 },
      )
      .catch(() => null);

    await radio.check();
    const response = await put;
    if (response) {
      const body = (await response.json().catch(() => null)) as {
        status?: { error?: number | string; message?: string };
      } | null;
      if (!response.ok() || Number(body?.status?.error ?? 0)) {
        throw new Error(
          `Set status ${status} gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
        );
      }
    }
    await waitForSuccessToast(this.page, 8_000).catch(() => undefined);
    await this.page.waitForTimeout(800);
  }

  async clickApproveIcon(): Promise<void> {
    const btn = this.page
      .locator('button')
      .filter({ has: this.page.locator('.fa-check-double, [data-icon="check-double"]') })
      .or(this.page.locator('button[class*="bg-info"]').filter({ hasNotText: /Save/i }))
      .last();
    await expect(btn, 'Tombol Approve (icon check-double)').toBeVisible({
      timeout: 20_000,
    });
    await btn.click();
  }

  async fillApprovalDescription(text: string): Promise<void> {
    await expect(this.approvalModalDescription).toBeVisible({ timeout: 15_000 });
    await this.approvalModalDescription.fill(text);
  }

  /**
   * Approve dari form edit: icon → modal description → Approve.
   * API: POST work-order/{id}/approve
   */
  async approveFromEditForm(description = 'Approved by automation'): Promise<void> {
    await this.clickApproveIcon();
    await this.fillApprovalDescription(description);

    const approveResponse = this.page.waitForResponse(
      (response) =>
        /\/work-order\/\d+\/approve/.test(response.url()) &&
        response.request().method() === 'POST',
      { timeout: 90_000 },
    );

    await this.approvalModalApproveButton.click();
    const response = await approveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number | string; message?: string };
    } | null;
    if (!response.ok() || Number(body?.status?.error ?? 0)) {
      throw new Error(
        `Approve Assembly gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }
    await waitForSuccessToast(this.page, 15_000).catch(() => undefined);
  }

  async assertProgressStatusVisible(): Promise<void> {
    await this.expandBasicInformation();
    await expect(this.progressStatusInput).toBeVisible({ timeout: 15_000 });
  }

  async assertStockReservedBannerVisible(): Promise<void> {
    await this.expandAssemblyDetail();
    await expect(this.stockReservedBanner).toBeVisible({ timeout: 20_000 });
  }

  async assertDetailColumnVisible(headerSnippet: string): Promise<void> {
    await this.expandAssemblyDetail();
    await expect(
      this.productDetailsSection.getByText(headerSnippet, { exact: false }).first(),
    ).toBeVisible({ timeout: 20_000 });
  }

  /** Assert kolom Transfer muncul (status Open/Approved). */
  async assertTransferColumnVisible(): Promise<void> {
    await this.assertDetailColumnVisible('Transfer');
  }

  /** Assert kolom Inbound muncul (status Approved). */
  async assertInboundColumnVisible(): Promise<void> {
    await this.assertDetailColumnVisible('Inbound');
  }

  async assertMaxAssemblyQtyColumnVisible(): Promise<void> {
    await this.assertDetailColumnVisible('Max assembly Qty');
  }

  async readProgressStatus(): Promise<string> {
    await this.expandBasicInformation();
    return (await this.progressStatusInput.inputValue()).trim();
  }

  // ─── ETM-15525 — Max Qty / Unit / QTY conversion ──────────────────────

  private detailRow(skuToken?: string): Locator {
    const section = this.productDetailsSection;
    const rows = section
      .locator('.p-datatable-tbody tr')
      .filter({ hasNotText: /no (records|data)|empty/i });
    if (skuToken) {
      return rows
        .filter({
          hasText: new RegExp(
            skuToken.slice(0, 24).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
            'i',
          ),
        })
        .first();
    }
    return rows.first();
  }

  /**
   * Select Product by SKU (type filter → bulk-fifo). Return SKU label or null.
   */
  async addFinishGoodsBySku(sku: string): Promise<string | null> {
    await this.expandAssemblyDetail();

    const existing = await this.readFirstDetailSku();
    if (existing && new RegExp(sku, 'i').test(existing)) {
      return existing;
    }
    if (existing) {
      // Baris lain sudah ada — cari baris SKU target
      const row = this.detailRow(sku);
      if (await row.isVisible({ timeout: 3_000 }).catch(() => false)) {
        return sku;
      }
    }

    let combobox = this.selectProductCombobox;
    if (!(await combobox.isVisible({ timeout: 8_000 }).catch(() => false))) {
      const root = this.page
        .locator('#ProductDetails')
        .locator('.multiselect')
        .filter({
          has: this.page.locator('[aria-placeholder="Select Product"]'),
        })
        .first();
      if (!(await root.isVisible({ timeout: 5_000 }).catch(() => false))) {
        return null;
      }
      await root.click();
      combobox = root.locator('.multiselect-search').first();
    }

    await this.multiselect.open(combobox);
    await combobox.fill(sku);
    await this.page.waitForTimeout(1_200);

    const option = this.page
      .locator('.multiselect-option:visible')
      .filter({ hasText: new RegExp(sku, 'i') })
      .filter({ hasNotText: 'No results found' })
      .first();

    if (!(await option.isVisible({ timeout: 15_000 }).catch(() => false))) {
      await this.page.keyboard.press('Escape').catch(() => undefined);
      return null;
    }

    const bulkResponsePromise = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'POST' &&
        /\/work-order\/\d+\/bulk-fifo/.test(response.url()),
      { timeout: 45_000 },
    );

    await option.click();
    const response = await bulkResponsePromise.catch(() => null);
    if (response) {
      const body = (await response.json().catch(() => null)) as {
        status?: { error?: number | string; message?: string };
      } | null;
      if (!response.ok() || Number(body?.status?.error ?? 0)) {
        throw new Error(
          `Add FG ${sku} gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
        );
      }
      await waitForSuccessToast(this.page, 15_000).catch(() => undefined);
    }

    await this.page.waitForTimeout(2_000);
    await this.assertDetailHasProduct(sku);
    return sku;
  }

  /**
   * Baca angka Max Assembly Qty dari baris detail (kolom "Max assembly Qty").
   */
  async readMaxAssemblyQty(skuToken?: string): Promise<number | null> {
    await this.expandAssemblyDetail();
    const section = this.productDetailsSection;
    const row = this.detailRow(skuToken);
    await expect(row).toBeVisible({ timeout: 30_000 });

    const headers = section.locator('.p-datatable-thead th, thead th');
    const headerCount = await headers.count();
    let maxIdx = -1;
    for (let i = 0; i < headerCount; i++) {
      const h = ((await headers.nth(i).innerText()) ?? '').replace(/\s+/g, ' ');
      if (/max\s*assembly\s*qty/i.test(h)) {
        maxIdx = i;
        break;
      }
    }

    if (maxIdx >= 0) {
      const cell = row.locator('td').nth(maxIdx);
      const text = ((await cell.innerText()) ?? '').replace(/\s+/g, ' ').trim();
      const match = text.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
      if (match) return Number(match[1]);
    }

    // Fallback: cell ke-2 setelah product (index ~2 bila ada checkbox)
    const cells = row.locator('td');
    for (const idx of [2, 1, 3]) {
      if (idx >= (await cells.count())) continue;
      const text = ((await cells.nth(idx).innerText()) ?? '').trim();
      const match = text.replace(/,/g, '').match(/^(\d+(?:\.\d+)?)$/);
      if (match) return Number(match[1]);
    }
    return null;
  }

  async readQtyFromDetailRow(skuToken?: string): Promise<number | null> {
    await this.expandAssemblyDetail();
    const row = this.detailRow(skuToken);
    await expect(row).toBeVisible({ timeout: 30_000 });

    const input = row.locator('input.p-inputtext, input[type="text"]').first();
    if (await input.isVisible({ timeout: 3_000 }).catch(() => false)) {
      const raw = (await input.inputValue()).replace(/[^\d.]/g, '');
      return raw ? Number(raw) : null;
    }

    // Aktifkan edit QTY lalu baca
    const cells = row.locator('td');
    const count = await cells.count();
    for (let i = 0; i < count; i++) {
      await cells.nth(i).dblclick().catch(() => undefined);
      const edit = row.locator('input.p-inputtext, input[type="text"]').first();
      if (await edit.isVisible({ timeout: 800 }).catch(() => false)) {
        const raw = (await edit.inputValue()).replace(/[^\d.]/g, '');
        await this.page.keyboard.press('Escape').catch(() => undefined);
        return raw ? Number(raw) : null;
      }
    }
    return null;
  }

  /**
   * Ubah UNIT **inline** di baris Assembly Detail (kolom `unit`).
   * Opsi & label = primary + alternate unit System Product FG (bukan hardcode Pieces/Box).
   * `unitLabel` = teks yang tampil di dropdown untuk SKU tersebut (contoh ETM-15525 ASS-R: "Box").
   */
  async setUnitOnDetailRow(
    unitLabel: string,
    skuToken?: string,
  ): Promise<void> {
    await this.expandAssemblyDetail();
    const section = this.productDetailsSection;
    const row = this.detailRow(skuToken);
    await expect(row, `Baris detail ${skuToken ?? ''}`).toBeVisible({
      timeout: 30_000,
    });

    const headers = section.locator('.p-datatable-thead th, thead th');
    const headerCount = await headers.count();
    let unitIdx = -1;
    for (let i = 0; i < headerCount; i++) {
      const h = ((await headers.nth(i).innerText()) ?? '').replace(/\s+/g, ' ').trim();
      if (/^unit$/i.test(h)) {
        unitIdx = i;
        break;
      }
    }
    expect(unitIdx, 'Kolom header UNIT di Assembly Detail').toBeGreaterThanOrEqual(0);

    const unitCell = row.locator('td').nth(unitIdx);
    await unitCell.scrollIntoViewIfNeeded();

    // Combobox UNIT di cell baris (label UI: Pieces / Box) — PrimeVue 4 Select/Dropdown
    const unitCombo = unitCell
      .getByRole('combobox')
      .or(unitCell.locator('.p-dropdown, .p-select'))
      .first();
    await expect(unitCombo, 'Combobox UNIT inline di baris ASS-R').toBeVisible({
      timeout: 15_000,
    });

    const put = this.page
      .waitForResponse(
        (response) =>
          /\/work-order\/\d+\/work-order-detail/.test(response.url()) &&
          ['PUT', 'POST', 'PATCH'].includes(response.request().method()),
        { timeout: 60_000 },
      )
      .catch(() => null);

    await unitCombo.click();
    await this.page.waitForTimeout(500);

    // Overlay di body: PV4 = .p-select-overlay; fallback option role
    const overlay = this.page.locator(
      '.p-select-overlay:visible, .p-dropdown-panel:visible, [data-pc-section="overlay"]:visible, [role="listbox"]:visible',
    ).last();

    if (!(await overlay.isVisible({ timeout: 3_000 }).catch(() => false))) {
      // Trigger lewat keyboard jika click belum buka panel
      await unitCombo.focus();
      await unitCombo.press('Alt+ArrowDown').catch(() => unitCombo.press('ArrowDown'));
      await this.page.waitForTimeout(400);
    }

    if (await overlay.isVisible({ timeout: 5_000 }).catch(() => false)) {
      const filterInput = overlay.locator('input').first();
      if (await filterInput.isVisible({ timeout: 1_500 }).catch(() => false)) {
        await filterInput.fill(unitLabel);
        await this.page.waitForTimeout(400);
      }
    }

    const option = this.page
      .getByRole('option', { name: new RegExp(`^\\s*${unitLabel}\\s*$`, 'i') })
      .or(this.page.getByRole('option', { name: new RegExp(unitLabel, 'i') }))
      .or(
        this.page
          .locator(
            '.p-select-option:visible, .p-dropdown-item:visible, [data-pc-section="option"]:visible',
          )
          .filter({ hasText: new RegExp(unitLabel, 'i') }),
      )
      .first();
    await expect(option, `Opsi unit inline "${unitLabel}"`).toBeVisible({
      timeout: 15_000,
    });
    await option.click();

    const response = await put;
    if (response) {
      const body = (await response.json().catch(() => null)) as {
        status?: { error?: number | string; message?: string };
      } | null;
      if (!response.ok() || Number(body?.status?.error ?? 0)) {
        throw new Error(
          `Ganti unit inline ke ${unitLabel} gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
        );
      }
    }
    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(1_500);

    // Pastikan label unit di cell sudah berubah (Pieces → Box, dll.)
    const after = ((await unitCell.innerText()) ?? '').replace(/\s+/g, ' ');
    expect(
      after,
      `UNIT inline harus mengandung "${unitLabel}" setelah pilih. actual="${after}"`,
    ).toMatch(new RegExp(unitLabel, 'i'));
  }

  /** Baca label UNIT inline di baris detail (teks dari master unit produk, mis. Pieces / Box / Pack). */
  async readUnitLabelFromDetailRow(skuToken?: string): Promise<string> {
    await this.expandAssemblyDetail();
    const section = this.productDetailsSection;
    const row = this.detailRow(skuToken);
    await expect(row).toBeVisible({ timeout: 30_000 });

    const headers = section.locator('.p-datatable-thead th, thead th');
    const headerCount = await headers.count();
    let unitIdx = -1;
    for (let i = 0; i < headerCount; i++) {
      const h = ((await headers.nth(i).innerText()) ?? '').replace(/\s+/g, ' ').trim();
      if (/^unit$/i.test(h)) {
        unitIdx = i;
        break;
      }
    }
    if (unitIdx < 0) return '';
    return ((await row.locator('td').nth(unitIdx).innerText()) ?? '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Coba set Open — return hasil tanpa throw (untuk TC validasi gagal).
   */
  async trySetOpen(): Promise<{
    ok: boolean;
    message: string;
    draftChecked: boolean;
  }> {
    await expect(this.openRadio).toBeVisible({ timeout: 15_000 });

    const put = this.page
      .waitForResponse(
        (response) =>
          /\/work-order\/\d+\/?$/.test(new URL(response.url()).pathname) &&
          response.request().method() === 'PUT',
        { timeout: 60_000 },
      )
      .catch(() => null);

    await this.openRadio.check();
    const response = await put;
    let message = '';
    let ok = true;

    if (response) {
      const body = (await response.json().catch(() => null)) as {
        status?: { error?: number | string; message?: string };
        message?: string;
      } | null;
      message =
        body?.status?.message ??
        body?.message ??
        (await response.text().catch(() => '')) ??
        '';
      if (!response.ok() || Number(body?.status?.error ?? 0)) {
        ok = false;
      }
    }

    // Toast error sering muncul meski HTTP 200 dengan status.error
    const errorToast = this.page
      .locator('.toast, .Toastify, [class*="notification"]')
      .filter({ hasText: /stock|stok|BoM|bom|tidak|not enough|insufficient|fail|error/i })
      .first();
    if (await errorToast.isVisible({ timeout: 5_000 }).catch(() => false)) {
      const toastText = ((await errorToast.innerText()) ?? '').trim();
      if (toastText) {
        message = message || toastText;
        ok = false;
      }
    }

    await this.page.waitForTimeout(1_200);
    const draftChecked = await this.draftRadio.isChecked().catch(() => false);
    if (draftChecked) {
      ok = false;
    }

    return { ok, message, draftChecked };
  }
}
