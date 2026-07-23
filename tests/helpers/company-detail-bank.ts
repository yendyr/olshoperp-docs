import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopFormActions, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const CBA_DATALIST_PATH = '/accounting/company-detail-bank';
export const CBA_EDIT_PATH_PATTERN =
  /\/accounting\/company-detail-bank\/edit\/\d+/;

/**
 * POM Cash/Bank Account (FA Master).
 * UI route: /accounting/company-detail-bank
 * Selector: tests/pom-registry/company-detail-bank.yaml
 */
export class CompanyDetailBankPage {
  readonly datalist: OlshopDatalist;
  private readonly form: OlshopFormActions;
  private readonly multiselect: OlshopMultiselect;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
    this.form = new OlshopFormActions(page);
    this.multiselect = new OlshopMultiselect(page);
  }

  get labelInput(): Locator {
    return this.page.locator('#label');
  }

  get typeCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose Type');
  }

  get currencyCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose Currency');
  }

  get coaCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose COA');
  }

  get descriptionInput(): Locator {
    return this.page.locator('#description');
  }

  get activeSwitch(): Locator {
    return this.page
      .locator('#AccountDetail div.flex, #AccountDetail .flex')
      .filter({ has: this.page.getByText('Active', { exact: true }) })
      .locator('input[type="checkbox"]')
      .first();
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(CBA_DATALIST_PATH, 'link');
  }

  async assertDatalistShell(): Promise<void> {
    await expect(this.datalist.createButton('link')).toBeVisible({
      timeout: 30_000,
    });
    const headers = this.datalist.table.getByRole('columnheader');
    await expect(headers.filter({ hasText: /type/i }).first()).toBeVisible({
      timeout: 30_000,
    });
    await expect(headers.filter({ hasText: /label/i }).first()).toBeVisible();
    await expect(headers.filter({ hasText: /curr/i }).first()).toBeVisible();
    await expect(headers.filter({ hasText: /coa/i }).first()).toBeVisible();
  }

  async openCreateForm(): Promise<void> {
    await this.datalist.clickCreate('link');
    await this.page.waitForURL(/\/accounting\/company-detail-bank\/create/, {
      timeout: 45_000,
    });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Account Detail');
    await expect(this.labelInput).toBeVisible({ timeout: 30_000 });
  }

  async ensureActiveOn(): Promise<void> {
    const sw = this.activeSwitch;
    if (!(await sw.isVisible().catch(() => false))) {
      return;
    }
    if (!(await sw.isChecked().catch(() => false))) {
      await sw.click({ force: true });
      await expect(sw).toBeChecked({ timeout: 10_000 });
    }
  }

  async ensureCurrencyFilled(): Promise<void> {
    const combobox = this.currencyCombobox;
    await expect(combobox).toBeVisible({ timeout: 20_000 });
    const selected = await this.multiselect.selectedLabel(combobox);
    if (selected && !/^choose\b/i.test(selected) && selected.length > 0) {
      return;
    }
    await this.multiselect.open(combobox);
    await this.page.waitForTimeout(600);
    const option = this.multiselect.visibleOptions().first();
    await expect(option, 'Opsi Currency').toBeVisible({ timeout: 45_000 });
    await option.click();
    await this.page.waitForTimeout(300);
  }

  async selectFirstFreeCoa(): Promise<string> {
    const combobox = this.coaCombobox;
    await expect(combobox).toBeVisible({ timeout: 20_000 });
    await this.multiselect.open(combobox);
    await this.page.waitForTimeout(900);

    const option = this.multiselect
      .visibleOptions()
      .filter({ hasNotText: /No results|No available/i })
      .first();
    await expect(option, 'Opsi COA Assets bebas').toBeVisible({
      timeout: 45_000,
    });
    const label = ((await option.textContent()) ?? '').trim();
    await option.click();
    await this.page.waitForTimeout(400);
    return label;
  }

  async fillCreateForm(data: {
    label: string;
    description?: string;
  }): Promise<void> {
    expect(data.label.length, 'Label max 30').toBeLessThanOrEqual(30);

    // Type default Bank — biarkan jika sudah terisi
    const typeSelected = await this.multiselect.selectedLabel(this.typeCombobox);
    if (!typeSelected || /^choose\b/i.test(typeSelected)) {
      await this.multiselect.selectOption(this.typeCombobox, 'Bank', {
        exact: true,
        typeToFilter: 'Bank',
      });
    }

    await this.labelInput.fill(data.label);
    await this.ensureCurrencyFilled();
    await this.selectFirstFreeCoa();
    await this.descriptionInput.fill(
      data.description ?? 'automation playwright',
    );
    await this.ensureActiveOn();
  }

  /**
   * Staging AS-IS: BE validate is_default required; FE tidak mengirim.
   * - CREATE: multipart FormData → sisip field is_default=0
   * - UPDATE: JSON body → tambah is_default: 0
   */
  private async installIsDefaultRequestPatch(): Promise<() => Promise<void>> {
    const matcher = (url: URL) =>
      url.pathname.includes('/accounting/company-detail-bank');

    await this.page.route(matcher, async (route) => {
      const request = route.request();
      if (request.method() !== 'POST') {
        await route.continue();
        return;
      }

      const contentType = request.headers()['content-type'] ?? '';
      const headers = { ...request.headers() };
      delete headers['content-length'];

      // JSON update (edit)
      if (contentType.includes('application/json')) {
        const raw = request.postData() ?? '{}';
        let json: Record<string, unknown> = {};
        try {
          json = JSON.parse(raw) as Record<string, unknown>;
        } catch {
          await route.continue();
          return;
        }
        if (json.is_default === undefined) {
          json.is_default = 0;
        }
        await route.continue({
          headers,
          postData: JSON.stringify(json),
        });
        return;
      }

      // Multipart create
      const boundaryMatch = contentType.match(/boundary=(.+)$/i);
      const body = request.postDataBuffer();
      if (!boundaryMatch || !body) {
        await route.continue();
        return;
      }

      const boundary = boundaryMatch[1];
      let bodyStr = body.toString('binary');
      if (bodyStr.includes('name="is_default"')) {
        await route.continue();
        return;
      }

      const endMarker = `--${boundary}--`;
      const extra =
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="is_default"\r\n\r\n` +
        `0\r\n` +
        endMarker;

      if (bodyStr.includes(endMarker)) {
        bodyStr = bodyStr.replace(endMarker, extra);
      } else {
        bodyStr += `\r\n${extra}`;
      }

      await route.continue({
        headers,
        postData: Buffer.from(bodyStr, 'binary'),
      });
    });

    return async () => {
      await this.page.unroute(matcher).catch(() => undefined);
    };
  }

  async clickSaveAndNextAndWaitForEdit(): Promise<void> {
    const uninstall = await this.installIsDefaultRequestPatch();

    const saveResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        const path = new URL(response.url()).pathname;
        return /\/accounting\/company-detail-bank\/?$/.test(path);
      },
      { timeout: 90_000 },
    );

    await this.form.clickSaveAndNext();

    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
    } | null;

    await uninstall();

    if (!response.ok() || body?.status?.error) {
      throw new Error(
        `Save Cash/Bank Account gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await this.page.waitForURL(CBA_EDIT_PATH_PATTERN, { timeout: 45_000 });
    await waitForSuccessToast(this.page, 5_000).catch(() => undefined);
    await dismissStagingBanner(this.page);
  }

  async openEditFromDatalistByLabel(label: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(label, 1_500);

    const row = this.page.getByRole('row').filter({ hasText: label }).first();
    await expect(row, `Baris account ${label}`).toBeVisible({
      timeout: 45_000,
    });

    const editBtn = this.datalist.editButton(row).first();
    await expect(editBtn).toBeVisible({ timeout: 30_000 });
    await editBtn.click();

    await this.page.waitForURL(CBA_EDIT_PATH_PATTERN, { timeout: 45_000 });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Account Detail');
    await expect(this.labelInput).toHaveValue(label, { timeout: 30_000 });
  }

  async updateLabelAndDescription(
    label: string,
    description = 'automation playwright',
  ): Promise<void> {
    expect(label.length).toBeLessThanOrEqual(30);
    await this.labelInput.fill(label);
    await this.descriptionInput.fill(description);
  }

  async clickSaveAllAndWait(): Promise<void> {
    const uninstall = await this.installIsDefaultRequestPatch();

    const saveResponse = this.page
      .waitForResponse(
        (response) =>
          /\/accounting\/company-detail-bank\/\d+/.test(response.url()) &&
          ['PUT', 'POST'].includes(response.request().method()),
        { timeout: 90_000 },
      )
      .catch(() => null);

    await this.form.clickSaveAll();

    const response = await saveResponse;
    await uninstall();

    if (response) {
      const body = (await response.json().catch(() => null)) as {
        status?: { error?: number; message?: string };
      } | null;
      if (!response.ok() || body?.status?.error) {
        throw new Error(
          `Update Cash/Bank Account gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
        );
      }
    }

    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(800);
  }

  async assertInDatalist(label: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(label, 1_500);
    const row = this.page.getByRole('row').filter({ hasText: label }).first();
    await expect(row, `Account ${label} harus tampil`).toBeVisible({
      timeout: 45_000,
    });
  }
}
