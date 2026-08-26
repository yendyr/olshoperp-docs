import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopFormActions } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const GENERAL_COMPANY_DATALIST_PATH =
  '/generalsetting/general-company';
export const GENERAL_COMPANY_EDIT_PATH_PATTERN =
  /\/generalsetting\/general-company\/edit\/\d+/;

export type GeneralCompanyRole =
  | 'Customer'
  | 'Supplier'
  | 'Shipper'
  | 'Manufacturer';

export type GeneralCompanyCreateData = {
  code: string;
  name: string;
  description?: string;
  supplier: boolean;
  customer?: boolean;
  shipper?: boolean;
  manufacturer?: boolean;
};

/**
 * POM General Company — master partner (Customer / Supplier / Shipper / Manufacturer).
 * Selector: tests/pom-registry/general-company.yaml
 */
export class GeneralCompanyPage {
  readonly datalist: OlshopDatalist;
  private readonly form: OlshopFormActions;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
    this.form = new OlshopFormActions(page);
  }

  get codeInput(): Locator {
    return this.page.locator('#code');
  }

  get nameInput(): Locator {
    return this.page.locator('#name');
  }

  get descriptionInput(): Locator {
    return this.page
      .locator('#description, textarea#description, textarea[name="description"]')
      .first();
  }

  roleSwitch(role: GeneralCompanyRole): Locator {
    return this.page
      .locator('#BasicInformation div.flex')
      .filter({ has: this.page.getByText(role, { exact: true }) })
      .locator('input[type="checkbox"]')
      .first();
  }

  rowByText(text: string): Locator {
    return this.page.getByRole('row').filter({ hasText: text }).first();
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(GENERAL_COMPANY_DATALIST_PATH, 'link');
  }

  async expandBasicInformation(): Promise<void> {
    for (const name of ['Basic Information', 'General Company']) {
      const section = this.form.accordionSection(name);
      if (await section.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await this.form.expandAccordion(name).catch(() => undefined);
        return;
      }
    }
  }

  async findExistingByNameOrCode(
    name: string,
    code: string,
  ): Promise<{ found: boolean; editUrl: string | null }> {
    await this.gotoDatalist();
    await this.datalist.search(name, 2_000);

    let row = this.rowByText(name);
    if (!(await row.isVisible({ timeout: 5_000 }).catch(() => false))) {
      await this.datalist.search(code, 2_000);
      row = this.rowByText(code);
    }

    if (!(await row.isVisible({ timeout: 5_000 }).catch(() => false))) {
      return { found: false, editUrl: null };
    }

    const editBtn = this.datalist.editButton(row).first();
    if (await editBtn.isVisible().catch(() => false)) {
      await editBtn.click();
    } else {
      const link = row.getByRole('link').first();
      await link.click();
    }

    await this.page.waitForURL(GENERAL_COMPANY_EDIT_PATH_PATTERN, {
      timeout: 45_000,
    });
    await dismissStagingBanner(this.page);
    return { found: true, editUrl: this.page.url() };
  }

  async openCreateForm(): Promise<void> {
    await this.datalist.clickCreate('link');
    await this.page.waitForURL(/\/generalsetting\/general-company\/create/, {
      timeout: 45_000,
    });
    await dismissStagingBanner(this.page);
    await this.expandBasicInformation();
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

  async fillCreateForm(data: GeneralCompanyCreateData): Promise<void> {
    await this.codeInput.fill(data.code);
    await this.nameInput.fill(data.name);

    const desc = this.descriptionInput;
    if (await desc.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await desc.fill(data.description ?? 'automation playwright');
    }

    await this.ensureSwitch(this.roleSwitch('Supplier'), data.supplier);
    await this.ensureSwitch(
      this.roleSwitch('Customer'),
      data.customer ?? false,
    );
    await this.ensureSwitch(this.roleSwitch('Shipper'), data.shipper ?? false);
    await this.ensureSwitch(
      this.roleSwitch('Manufacturer'),
      data.manufacturer ?? false,
    );
  }

  async confirmIncompleteIfPresent(): Promise<void> {
    const dialog = this.page
      .getByRole('dialog')
      .or(this.page.locator('.p-dialog, [role="alertdialog"], .modal'))
      .first();

    if (!(await dialog.isVisible({ timeout: 4_000 }).catch(() => false))) {
      return;
    }

    const confirm = dialog
      .getByRole('button', { name: /^(Proceed|Continue|Yes|OK|Save)$/i })
      .or(
        this.page.getByRole('button', {
          name: /^(Proceed|Continue|Yes|OK)$/i,
        }),
      )
      .first();

    if (await confirm.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await confirm.click();
    }
  }

  async clickSaveAndNextAndWaitForEdit(): Promise<string> {
    const saveResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        const path = new URL(response.url()).pathname;
        return /\/general-company\/?$/.test(path);
      },
      { timeout: 90_000 },
    );

    await this.form.clickSaveAndNext();
    await this.confirmIncompleteIfPresent();

    const response = await saveResponse.catch(() => null);
    if (response) {
      const body = (await response.json().catch(() => null)) as {
        status?: { error?: number; message?: string };
      } | null;

      if (!response.ok() || body?.status?.error) {
        throw new Error(
          `Save General Company gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
        );
      }
    }

    await this.confirmIncompleteIfPresent();
    await this.page.waitForURL(GENERAL_COMPANY_EDIT_PATH_PATTERN, {
      timeout: 45_000,
    });
    await waitForSuccessToast(this.page, 5_000).catch(() => undefined);
    await dismissStagingBanner(this.page);
    return this.page.url();
  }
}
