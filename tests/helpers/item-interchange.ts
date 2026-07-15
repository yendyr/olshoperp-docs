import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopFormActions, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const ITEM_INTERCHANGE_DATALIST_PATH = '/supplychain/item-interchange';
export const ITEM_INTERCHANGE_EDIT_PATH_PATTERN =
  /\/supplychain\/item-interchange\/edit\/\d+/;

export type ItemInterchangeCreateData = {
  firstSku: string;
  secondSku: string;
  description?: string;
  showForAllCompany?: boolean;
};

/**
 * POM Product Interchange — SCM Master Data (route: item-interchange).
 * Selector dari pom-registry/item-interchange.yaml + Form.vue.
 */
export class ItemInterchangePage {
  readonly datalist: OlshopDatalist;
  private readonly form: OlshopFormActions;
  private readonly multiselect: OlshopMultiselect;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
    this.form = new OlshopFormActions(page);
    this.multiselect = new OlshopMultiselect(page);
  }

  get firstProductCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose First Product');
  }

  get secondProductCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose Second Product');
  }

  get descriptionInput(): Locator {
    return this.page.locator('#description');
  }

  get showForAllCompanySwitch(): Locator {
    return this.page
      .locator('#ProductInterchange div.flex, .flex')
      .filter({
        has: this.page.getByText('Show for all company', { exact: true }),
      })
      .locator('input[type="checkbox"]')
      .first();
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(ITEM_INTERCHANGE_DATALIST_PATH, 'link');
  }

  async openCreateForm(): Promise<void> {
    await this.datalist.clickCreate('link');
    await this.page.waitForURL(/\/supplychain\/item-interchange\/create/, {
      timeout: 45_000,
    });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Product Interchange');
    await expect(this.firstProductCombobox).toBeVisible({ timeout: 30_000 });
  }

  async selectProductBySku(
    combobox: Locator,
    sku: string,
  ): Promise<void> {
    // Multiselect delay:700 — ketik SKU lalu pilih opsi (label: "sku | name")
    await this.multiselect.open(combobox);
    await combobox.fill('').catch(() => undefined);
    await combobox.pressSequentially(sku, { delay: 40 });
    await this.page.waitForTimeout(1_200);

    const option = this.page
      .locator('.multiselect-option:visible')
      .filter({ hasNotText: 'No results found' })
      .filter({ hasText: sku })
      .first();

    await expect(
      option,
      `Opsi product dengan SKU "${sku}" harus ada di dropdown`,
    ).toBeVisible({ timeout: 25_000 });
    await option.click();
    await this.page.waitForTimeout(500);

    const selected = await this.multiselect.selectedLabel(combobox);
    expect(
      selected,
      `Multiselect harus terisi SKU ${sku}`,
    ).toMatch(new RegExp(sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }

  async ensureShowForAllCompanyOn(): Promise<void> {
    const sw = this.showForAllCompanySwitch;
    await expect(sw, 'Toggle Show for all company').toBeVisible({
      timeout: 15_000,
    });
    if (!(await sw.isChecked().catch(() => false))) {
      await sw.click({ force: true });
      await expect(sw).toBeChecked({ timeout: 10_000 });
    }
  }

  async fillCreateForm(data: ItemInterchangeCreateData): Promise<void> {
    await this.selectProductBySku(this.firstProductCombobox, data.firstSku);
    await this.selectProductBySku(this.secondProductCombobox, data.secondSku);

    if (data.description) {
      await this.descriptionInput.fill(data.description);
    }

    if (data.showForAllCompany !== false) {
      await this.ensureShowForAllCompanyOn();
    }
  }

  async clickSaveAndNextAndWaitForEdit(): Promise<void> {
    const saveResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        const pathname = new URL(response.url()).pathname.replace(/\/$/, '');
        return (
          pathname === '/api/supplychain/item-interchange' ||
          pathname.endsWith('/supplychain/item-interchange')
        );
      },
      { timeout: 90_000 },
    );

    await this.form.clickSaveAndNext();

    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number | string; message?: string };
      data?: { id?: number };
    } | null;

    const errFlag = Number(body?.status?.error ?? 0);
    if (!response.ok() || errFlag) {
      throw new Error(
        `Save Product Interchange gagal: ${body?.status?.message ?? JSON.stringify(body) ?? `HTTP ${response.status()}`}`,
      );
    }

    await this.page.waitForURL(ITEM_INTERCHANGE_EDIT_PATH_PATTERN, {
      timeout: 45_000,
    });
    await waitForSuccessToast(this.page, 5_000).catch(() => undefined);
    await dismissStagingBanner(this.page);
  }

  async assertEditShowsFirstSku(firstSku: string): Promise<void> {
    await expect(
      this.page.getByText(firstSku, { exact: false }).first(),
      `Edit form harus menampilkan First Product SKU ${firstSku}`,
    ).toBeVisible({ timeout: 30_000 });
  }

  async gotoEditUrl(editUrl: string, firstSku: string): Promise<void> {
    await this.page.goto(editUrl, { waitUntil: 'domcontentloaded' });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Product Interchange');
    await this.assertEditShowsFirstSku(firstSku);
  }

  async openEditFromDatalistByFirstSku(firstSku: string): Promise<void> {
    await this.gotoDatalist();
    // DataTables tip: search matches from beginning only — jangan filter string panjang di tengah cell.
    await this.datalist.searchInput.fill('');
    await this.page.waitForTimeout(2_000);

    const row = this.page
      .getByRole('row')
      .filter({ hasText: firstSku })
      .first();
    await expect(
      row,
      `Baris Product Interchange first SKU ${firstSku}`,
    ).toBeVisible({ timeout: 45_000 });

    const editBtn = this.datalist.editButton(row).first();
    await expect(editBtn).toBeVisible({ timeout: 30_000 });
    await editBtn.click();

    await this.page.waitForURL(ITEM_INTERCHANGE_EDIT_PATH_PATTERN, {
      timeout: 45_000,
    });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Product Interchange');
    await this.assertEditShowsFirstSku(firstSku);
  }

  async updateSecondProductAndDescription(
    secondSku: string,
    description: string,
  ): Promise<void> {
    // Edit: First Product read-only; Second Product Multiselect (placeholder hilang jika terisi)
    let combobox = this.secondProductCombobox;
    if (!(await combobox.isVisible().catch(() => false))) {
      const secondRoot = this.page
        .locator('label')
        .filter({ hasText: /^Second Product/ })
        .locator(
          'xpath=ancestor::div[contains(@class,"col-span") or contains(@class,"grid")][1]//div[contains(@class,"multiselect")][1]',
        );
      await secondRoot.click();
      combobox = secondRoot.locator('.multiselect-search').first();
      await expect(combobox).toBeVisible({ timeout: 10_000 });
    }

    // FE watch second_item_id → auto PUT; tunggu selesai sebelum isi description
    const autoPut = this.page.waitForResponse(
      (response) =>
        /\/supplychain\/item-interchange\/\d+/.test(response.url()) &&
        response.request().method() === 'PUT',
      { timeout: 90_000 },
    );

    await this.selectProductBySku(combobox, secondSku);

    const putRes = await autoPut;
    const putBody = (await putRes.json().catch(() => null)) as {
      status?: { error?: number | string; message?: string };
    } | null;
    if (!putRes.ok() || Number(putBody?.status?.error ?? 0)) {
      throw new Error(
        `Auto-update Second Product gagal: ${putBody?.status?.message ?? `HTTP ${putRes.status()}`}`,
      );
    }
    await waitForSuccessToast(this.page, 8_000).catch(() => undefined);
    await this.page.waitForTimeout(800);

    // Pastikan UI masih gold (bukan revert)
    const secondRoot = this.page.locator('.multiselect').nth(0);
    await expect(secondRoot).toContainText(secondSku, { timeout: 15_000 });

    await this.descriptionInput.fill(description);
  }

  async clickSaveAllAndWait(): Promise<void> {
    const saveResponse = this.page
      .waitForResponse(
        (response) =>
          /\/supplychain\/item-interchange\/\d+/.test(response.url()) &&
          ['PUT', 'POST'].includes(response.request().method()),
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
          `Update Product Interchange gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
        );
      }
    }

    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(1_000);
  }

  async assertInDatalist(firstSku: string, secondSku?: string): Promise<void> {
    await this.gotoDatalist();
    // Search datalist match from start — clear filter lalu scan baris (total biasanya kecil)
    await this.datalist.searchInput.fill('');
    await this.page.waitForTimeout(2_000);

    const row = this.page
      .getByRole('row')
      .filter({ hasText: firstSku })
      .first();
    await expect(
      row,
      `Interchange first SKU ${firstSku} harus tampil di datalist`,
    ).toBeVisible({ timeout: 45_000 });

    if (secondSku) {
      await expect(row).toContainText(secondSku);
    }
  }
}
