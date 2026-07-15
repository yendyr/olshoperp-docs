import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const OTHER_INBOUND_DATALIST_PATH = '/supplychain/other-inbound';
export const OTHER_INBOUND_EDIT_PATH_PATTERN =
  /\/supplychain\/other-inbound\/edit\/\d+/;

/**
 * POM Other Inbound (supplychain-other-inbound).
 * Selector: tests/pom-registry/other-inbound.yaml
 *
 * Fungsi: GRN tanpa supplier/PO — stok masuk non-pembelian (sering auto dari Assembly).
 * Prefix IN*. Detail/approve via mutation-inbound*.
 *
 * AS-IS create: Form semua field disabled + no submit() — CREATE = smoke + bind existing.
 * AS-IS detail: Select Product slot sering absen di InventoryOther (beda InventoryIn).
 */
export class OtherInboundPage {
  readonly datalist: OlshopDatalist;
  private readonly multiselect: OlshopMultiselect;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
    this.multiselect = new OlshopMultiselect(page);
  }

  get codeInput(): Locator {
    return this.page
      .locator('#code')
      .or(this.page.getByPlaceholder('Automatically generate by system'))
      .first();
  }

  get locationCombobox(): Locator {
    // Disabled Multiselect sering tanpa aria-placeholder di search input
    return this.multiselect
      .comboboxByAriaPlaceholder(
        'e.g: Seruni --> Lantai 1 --> Lorong A --> Rak A-001',
      )
      .or(this.multiselect.comboboxByPlaceholderFragment('Seruni'))
      .or(
        this.page
          .locator('#BasicInformation .custom-multiselect, #BasicInformation .multiselect')
          .first(),
      );
  }

  get descriptionInput(): Locator {
    return this.page
      .locator('#description')
      .or(this.page.getByPlaceholder('Add description or notes...'))
      .first();
  }

  get selectProductCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Select Product');
  }

  get transactionDateInput(): Locator {
    return this.page
      .locator('input.olshoperp-datepicker-input, input.p-datepicker-input')
      .first()
      .or(
        this.page
          .getByRole('combobox')
          .filter({ hasText: /\d{2}-\d{2}-\d{4}/ })
          .first(),
      );
  }

  async gotoDatalist(): Promise<void> {
    await this.page.goto(OTHER_INBOUND_DATALIST_PATH, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);
    await expect(this.datalist.table).toBeVisible({ timeout: 45_000 });
  }

  /** Smoke create page — header disabled, no Save. */
  async openCreateFormSmoke(): Promise<void> {
    await this.page.goto(`${OTHER_INBOUND_DATALIST_PATH}/create`, {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });
    await dismissStagingBanner(this.page);
    await expect(this.page).toHaveURL(
      /\/supplychain\/other-inbound\/create$/,
      { timeout: 45_000 },
    );
    await this.expandBasicInformation();

    await expect(this.codeInput).toBeVisible({ timeout: 30_000 });
    await expect(this.codeInput).toBeDisabled();

    await expect(
      this.page.getByText('Location Destination', { exact: false }).first(),
    ).toBeVisible({ timeout: 30_000 });

    const destMs = this.page
      .locator(
        '#BasicInformation .custom-multiselect, #BasicInformation .multiselect',
      )
      .first();
    await expect(destMs).toBeVisible({ timeout: 30_000 });
    const destClass = (await destMs.getAttribute('class')) ?? '';
    expect(
      /is-disabled|disabled/.test(destClass),
      `Location Destination Multiselect should be disabled (class=${destClass})`,
    ).toBeTruthy();

    await expect(this.descriptionInput).toBeVisible({ timeout: 15_000 });
    await expect(this.descriptionInput).toBeDisabled();

    // No Save & Next / Save All on create (no submit method)
    const saveCount = await this.page
      .locator('button')
      .filter({ hasText: /Save & Next|Save All/i })
      .count();
    expect(saveCount, 'Create form harus tanpa tombol Save').toBe(0);
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

  async expandInboundDetail(): Promise<void> {
    const btn = this.page.getByRole('button', {
      name: /Inbound Detail/i,
    });
    await expect(btn.first()).toBeVisible({ timeout: 45_000 });
    if ((await btn.first().getAttribute('aria-expanded')) !== 'true') {
      await btn.first().click();
      await this.page.waitForTimeout(700);
    }
  }

  /**
   * Bind dokumen existing dari datalist (prefer Open/Draft, else first IN*).
   */
  async openFirstEditableFromDatalist(): Promise<string> {
    await this.gotoDatalist();

    const search = this.datalist.searchInput;
    if (await search.isVisible({ timeout: 10_000 }).catch(() => false)) {
      await search.fill('');
      await this.page.waitForTimeout(1_200);
    }

    let bodyRows = this.page.locator('tbody tr').filter({
      hasNotText: /no data available/i,
    });
    let count = await bodyRows.count();

    if (count === 0) {
      throw new Error(
        'Datalist Other Inbound kosong di lumicharmsid (tidak ada fixture IN*)',
      );
    }

    let row = bodyRows.filter({ hasText: /Open|Draft/i }).first();
    if (!(await row.isVisible({ timeout: 2_000 }).catch(() => false))) {
      row = bodyRows.first();
    }

    const codeLink = row
      .locator(`a[href*="/supplychain/other-inbound/edit/"]`)
      .first();

    if (await codeLink.isVisible({ timeout: 5_000 }).catch(() => false)) {
      const href = await codeLink.getAttribute('href');
      if (href) {
        await this.page.goto(href, {
          waitUntil: 'domcontentloaded',
          timeout: 60_000,
        });
      } else {
        await codeLink.click();
      }
    } else {
      const editBtn = this.datalist.editButton(row).first();
      await expect(editBtn, 'Tombol edit Other Inbound').toBeVisible({
        timeout: 15_000,
      });
      await editBtn.click();
    }

    await expect(this.page).toHaveURL(OTHER_INBOUND_EDIT_PATH_PATTERN, {
      timeout: 45_000,
    });
    await dismissStagingBanner(this.page);
    await this.expandBasicInformation();
    const generated = await this.readGeneratedCode();
    expect(generated.length).toBeGreaterThan(0);
    return generated;
  }

  async readGeneratedCode(): Promise<string> {
    await expect(this.codeInput).not.toHaveValue('', { timeout: 30_000 });
    return (await this.codeInput.inputValue()).trim();
  }

  async gotoEditUrl(editUrl: string): Promise<void> {
    await this.page.goto(editUrl, { waitUntil: 'domcontentloaded' });
    await dismissStagingBanner(this.page);
    await this.expandBasicInformation();
  }

  async assertBasicInformationFilled(): Promise<void> {
    await this.expandBasicInformation();
    const code = await this.readGeneratedCode();
    expect(code.toUpperCase()).toMatch(/^IN/);

    const destMs = this.page
      .locator('#BasicInformation .custom-multiselect, #BasicInformation .multiselect')
      .first();
    await expect(destMs).toBeVisible({ timeout: 15_000 });
    const singleLabel = destMs.locator('.multiselect-single-label');
    const locLabel = (
      (await singleLabel.textContent().catch(() => '')) ??
      (await destMs.textContent()) ??
      ''
    ).trim();
    expect(
      locLabel.length > 2 && !/^e\.g:|^choose/i.test(locLabel),
      `Location Destination harus terisi (got: ${locLabel})`,
    ).toBeTruthy();
  }

  async assertInboundDetailSectionReady(): Promise<void> {
    await this.expandInboundDetail();
    await expect(
      this.page.locator('.p-datatable, table').first(),
    ).toBeVisible({ timeout: 45_000 });
  }

  /** Returns true if Select Product Multiselect is rendered. */
  async hasSelectProduct(): Promise<boolean> {
    await this.expandInboundDetail();
    return this.selectProductCombobox
      .isVisible({ timeout: 5_000 })
      .catch(() => false);
  }

  async selectFirstAvailableProduct(): Promise<string> {
    await this.expandInboundDetail();
    const combobox = this.selectProductCombobox;
    await expect(combobox).toBeVisible({ timeout: 45_000 });

    const bulkResponse = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'POST' &&
        /mutation-inbound-detail\/bulk-fifo|mutation-inbound-detail$/.test(
          response.url(),
        ),
      { timeout: 90_000 },
    );

    await this.multiselect.open(combobox);
    await this.page.waitForTimeout(800);
    const option = this.multiselect.visibleOptions().first();
    await expect(option, 'Opsi Select Product').toBeVisible({
      timeout: 45_000,
    });

    const strong = option.locator('strong').first();
    const sku = (
      (await strong.textContent().catch(() => '')) ??
      (await option.textContent()) ??
      ''
    ).trim();
    await option.click();

    const response = await bulkResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number | string; message?: string };
    } | null;
    if (!response.ok() || Number(body?.status?.error ?? 0)) {
      throw new Error(
        `Select Product gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await waitForSuccessToast(this.page, 15_000).catch(() => undefined);
    await this.page.keyboard.press('Escape').catch(() => undefined);
    await this.page.mouse.click(8, 8).catch(() => undefined);
    await this.page.waitForTimeout(1_200);
    return sku.split(/\s+/)[0] || sku.slice(0, 32);
  }

  async assertDetailHasProduct(skuToken: string): Promise<void> {
    await this.expandInboundDetail();
    const token = skuToken.slice(0, 32).trim();
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const tableRow = this.page
      .locator('.p-datatable-tbody tr, tbody tr')
      .filter({ hasText: new RegExp(escaped, 'i') })
      .locator('visible=true')
      .first();
    await expect(
      tableRow,
      `Product ${token} harus ada di Inbound Detail table`,
    ).toBeVisible({ timeout: 45_000 });
  }

  /** Assert detail table has at least one non-empty product row (Assembly FG). */
  async assertDetailHasAnyProductRow(): Promise<void> {
    await this.expandInboundDetail();
    const rows = this.page
      .locator('.p-datatable-tbody tr, #InventoryInDetail tbody tr')
      .filter({ hasNotText: /no (records|data)/i })
      .locator('visible=true');
    await expect(
      rows.first(),
      'Inbound Detail harus punya minimal 1 baris produk (fixture Assembly)',
    ).toBeVisible({ timeout: 45_000 });
  }
}
