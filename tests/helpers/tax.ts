import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopFormActions, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const TAX_DATALIST_PATH = '/accounting/tax';
export const TAX_EDIT_PATH_PATTERN = /\/accounting\/tax\/edit\/\d+/;

/**
 * POM Tax — FA Master.
 * Selector: tests/pom-registry/tax.yaml
 */
export class TaxPage {
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

  get tariffInput(): Locator {
    return this.page.locator('#Tax input[type="number"]').first();
  }

  get descriptionInput(): Locator {
    return this.page.locator('#description');
  }

  /** Kedua Choose COA di form: [0]=Purchase Activa, [1]=Sales Passiva. */
  coaCombobox(index: 0 | 1): Locator {
    return this.page.locator('#Tax [aria-placeholder="Choose COA"]').nth(index);
  }

  get purchaseCoaCombobox(): Locator {
    return this.coaCombobox(0);
  }

  get salesCoaCombobox(): Locator {
    return this.coaCombobox(1);
  }

  get coefficientSwitch(): Locator {
    return this.page
      .locator('#Tax div.flex')
      .filter({ has: this.page.getByText(/Coefficient 11\/12/i) })
      .locator('input[type="checkbox"]')
      .first();
  }

  get activeSwitch(): Locator {
    return this.page
      .locator('#Tax div.flex')
      .filter({ has: this.page.getByText('Active', { exact: true }) })
      .locator('input[type="checkbox"]')
      .first();
  }

  get defaultPosCheckbox(): Locator {
    return this.page
      .locator('#Tax')
      .getByText(/Default Tax POS/i)
      .locator('..')
      .locator('input[type="checkbox"]')
      .first()
      .or(
        this.page
          .locator('#Tax label')
          .filter({ hasText: /Default Tax POS/i })
          .locator('xpath=preceding-sibling::*[1]//input[@type="checkbox"]')
          .or(
            this.page
              .locator('#Tax')
              .locator('input[type="checkbox"]')
              .nth(0),
          ),
      );
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(TAX_DATALIST_PATH, 'link');
  }

  async assertDatalistShell(): Promise<void> {
    await expect(this.datalist.createButton('link')).toBeVisible({
      timeout: 30_000,
    });
    const headers = this.datalist.table.getByRole('columnheader');
    await expect(headers.filter({ hasText: /code/i }).first()).toBeVisible({
      timeout: 30_000,
    });
    await expect(headers.filter({ hasText: /name/i }).first()).toBeVisible();
    await expect(headers.filter({ hasText: /tariff/i }).first()).toBeVisible();
  }

  async openCreateForm(): Promise<void> {
    await this.datalist.clickCreate('link');
    await this.page.waitForURL(/\/accounting\/tax\/create/, {
      timeout: 45_000,
    });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Tax');
    await expect(this.codeInput).toBeVisible({ timeout: 30_000 });
  }

  async ensureSwitch(sw: Locator, checked: boolean): Promise<void> {
    await expect(sw).toBeVisible({ timeout: 15_000 });
    const isOn = await sw.isChecked().catch(() => false);
    if (isOn !== checked) {
      await sw.click({ force: true });
      if (checked) {
        await expect(sw).toBeChecked({ timeout: 10_000 });
      } else {
        await expect(sw).not.toBeChecked({ timeout: 10_000 });
      }
    }
  }

  async selectFirstCoa(combobox: Locator, label: string): Promise<string> {
    await expect(combobox, label).toBeVisible({ timeout: 30_000 });
    await this.multiselect.open(combobox);
    await this.page.waitForTimeout(800);

    const option = this.multiselect
      .visibleOptions()
      .filter({ hasNotText: /No results|No available/i })
      .first();
    await expect(option, `Opsi ${label}`).toBeVisible({ timeout: 45_000 });
    const text = ((await option.textContent()) ?? '').trim();
    await option.click();
    await this.page.waitForTimeout(400);
    return text;
  }

  async fillCreateForm(data: {
    code: string;
    name: string;
    tariff?: string;
    description?: string;
  }): Promise<void> {
    await this.codeInput.fill(data.code);
    await this.nameInput.fill(data.name);

    await this.ensureSwitch(this.coefficientSwitch, false);
    await this.tariffInput.fill(data.tariff ?? '11');

    await this.selectFirstCoa(this.purchaseCoaCombobox, 'Purchase COA');
    await this.selectFirstCoa(this.salesCoaCombobox, 'Sales COA');

    await this.descriptionInput.fill(
      data.description ?? 'automation playwright',
    );
    await this.ensureSwitch(this.activeSwitch, true);
  }

  async clickSaveAndNextAndWaitForEdit(): Promise<void> {
    const saveResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        const path = new URL(response.url()).pathname;
        return /\/accounting\/tax\/?$/.test(path);
      },
      { timeout: 90_000 },
    );

    await this.form.clickSaveAndNext();

    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
    } | null;

    if (!response.ok() || body?.status?.error) {
      throw new Error(
        `Save Tax gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await this.page.waitForURL(TAX_EDIT_PATH_PATTERN, { timeout: 45_000 });
    await waitForSuccessToast(this.page, 5_000).catch(() => undefined);
    await dismissStagingBanner(this.page);
  }

  async openEditFromDatalistByCode(code: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(code, 1_500);

    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Baris Tax ${code}`).toBeVisible({ timeout: 45_000 });

    const editBtn = this.datalist.editButton(row).first();
    await expect(editBtn).toBeVisible({ timeout: 30_000 });
    await editBtn.click();

    await this.page.waitForURL(TAX_EDIT_PATH_PATTERN, { timeout: 45_000 });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Tax');
    await expect(this.codeInput).toHaveValue(code, { timeout: 30_000 });
  }

  async updateNameAndDescription(
    name: string,
    description = 'automation playwright',
  ): Promise<void> {
    await this.nameInput.fill(name);
    await this.descriptionInput.fill(description);
  }

  async clickSaveAllAndWait(): Promise<void> {
    const saveResponse = this.page
      .waitForResponse(
        (response) =>
          /\/accounting\/tax\/\d+/.test(response.url()) &&
          ['PUT', 'POST'].includes(response.request().method()),
        { timeout: 90_000 },
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
          `Update Tax gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
        );
      }
    }

    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(800);
  }

  async assertInDatalist(code: string, name?: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(code, 1_500);
    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Tax ${code} harus tampil`).toBeVisible({
      timeout: 45_000,
    });
    if (name) {
      await expect(row).toContainText(name);
    }
  }
}
