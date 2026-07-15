import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopFormActions } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const QC_PROCEDURE_DATALIST_PATH = '/supplychain/qc-procedure';
export const QC_PROCEDURE_EDIT_PATH_PATTERN =
  /\/supplychain\/qc-procedure\/edit\/\d+/;

export type QcProcedureFormData = {
  code: string;
  name: string;
  description?: string;
};

/**
 * POM QC Procedure (ReceivingInspectionTemplate).
 * Selector: tests/pom-registry/qc-procedure.yaml
 *
 * Fungsi: master checklist QC (header + sequenced activities).
 */
export class QcProcedurePage {
  readonly datalist: OlshopDatalist;
  private readonly form: OlshopFormActions;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
    this.form = new OlshopFormActions(page);
  }

  get codeInput(): Locator {
    return this.page.getByPlaceholder('QCCHK');
  }

  get nameInput(): Locator {
    return this.page.getByPlaceholder(
      'Default checking instruction untuk checker',
    );
  }

  get descriptionInput(): Locator {
    return this.page
      .locator('#BasicInformation textarea')
      .or(this.page.locator('textarea').first())
      .first();
  }

  get activeSwitch(): Locator {
    return this.page
      .locator('div.flex')
      .filter({ has: this.page.getByText('Active', { exact: true }) })
      .locator('input[type="checkbox"]')
      .first();
  }

  get sequenceInput(): Locator {
    return this.page.getByPlaceholder('Sequence', { exact: true });
  }

  get activityInput(): Locator {
    return this.page.getByPlaceholder('Input Activity name');
  }

  get addActivityButton(): Locator {
    return this.page
      .locator('button')
      .filter({ has: this.page.locator('.fa-file-circle-plus, [data-icon="file-circle-plus"]') })
      .or(
        this.page
          .locator('#ProcedureDetail button[variant], #ProcedureDetail button')
          .filter({ has: this.page.locator('svg, i, .svg-inline--fa') })
          .first(),
      )
      .first();
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(QC_PROCEDURE_DATALIST_PATH, 'auto');
  }

  async openCreateForm(): Promise<void> {
    await this.datalist.clickCreate('auto');
    await this.page.waitForURL(/\/supplychain\/qc-procedure\/create/, {
      timeout: 45_000,
    });
    await dismissStagingBanner(this.page);
    await this.expandBasicInformation();
    await expect(this.codeInput).toBeVisible({ timeout: 30_000 });
  }

  private async expandBasicInformation(): Promise<void> {
    await this.form.expandAccordion('Basic Information');
  }

  async expandProcedureDetail(): Promise<void> {
    await this.form.expandAccordion('Procedure Detail');
  }

  async fillCreateForm(data: QcProcedureFormData): Promise<void> {
    await this.codeInput.fill(data.code);
    await this.nameInput.fill(data.name);
    if (data.description) {
      await this.descriptionInput.fill(data.description);
    }
    await this.ensureActiveOn();
  }

  async ensureActiveOn(): Promise<void> {
    const sw = this.activeSwitch;
    await expect(sw).toBeVisible({ timeout: 15_000 });
    if (!(await sw.isChecked().catch(() => false))) {
      await sw.click({ force: true });
      await expect(sw).toBeChecked({ timeout: 10_000 });
    }
  }

  async clickSaveAndWaitForEdit(): Promise<void> {
    const saveResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        const pathname = new URL(response.url()).pathname.replace(/\/$/, '');
        return (
          pathname === '/api/supplychain/qc-procedure' ||
          pathname.endsWith('/supplychain/qc-procedure')
        );
      },
      { timeout: 90_000 },
    );

    await this.form.clickSave();

    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number | string; message?: string };
    } | null;

    if (!response.ok() || Number(body?.status?.error ?? 0)) {
      throw new Error(
        `Save QC Procedure gagal: ${body?.status?.message ?? JSON.stringify(body) ?? `HTTP ${response.status()}`}`,
      );
    }

    await this.page.waitForURL(QC_PROCEDURE_EDIT_PATH_PATTERN, {
      timeout: 45_000,
    });
    await waitForSuccessToast(this.page, 5_000).catch(() => undefined);
    await dismissStagingBanner(this.page);
    await this.expandBasicInformation();
  }

  async openEditFromDatalistByCode(code: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.searchInput.fill('');
    await this.page.waitForTimeout(800);
    await this.datalist.search(code, 1_500);

    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Baris QC ${code}`).toBeVisible({ timeout: 45_000 });

    const editBtn = this.datalist.editButton(row).first();
    await expect(editBtn).toBeVisible({ timeout: 30_000 });
    await editBtn.click();

    await this.page.waitForURL(QC_PROCEDURE_EDIT_PATH_PATTERN, {
      timeout: 45_000,
    });
    await dismissStagingBanner(this.page);
    await this.expandBasicInformation();
    await expect(this.codeInput).toHaveValue(code, { timeout: 30_000 });
  }

  async updateBasicFields(data: {
    name: string;
    description?: string;
  }): Promise<void> {
    await this.nameInput.fill(data.name);
    if (data.description !== undefined) {
      await this.descriptionInput.fill(data.description);
    }
  }

  async clickSaveAllAndWait(): Promise<void> {
    const saveResponse = this.page.waitForResponse(
      (response) =>
        /\/supplychain\/qc-procedure\/\d+/.test(response.url()) &&
        ['PUT', 'POST'].includes(response.request().method()) &&
        !response.url().includes('detail'),
      { timeout: 90_000 },
    );

    await this.form.clickSaveAll();
    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number | string; message?: string };
    } | null;

    if (!response.ok() || Number(body?.status?.error ?? 0)) {
      throw new Error(
        `Update QC Procedure gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await waitForSuccessToast(this.page, 8_000).catch(() => undefined);
    await this.page.waitForTimeout(500);
  }

  async addProcedureActivity(
    sequence: string,
    activity: string,
  ): Promise<void> {
    await this.expandProcedureDetail();
    await expect(this.sequenceInput).toBeVisible({ timeout: 30_000 });
    await this.sequenceInput.fill(sequence);
    await this.activityInput.fill(activity);

    const addBtn = this.page
      .getByPlaceholder('Input Activity name')
      .locator('xpath=following::button[1]');
    await expect(addBtn).toBeVisible({ timeout: 15_000 });

    const [response] = await Promise.all([
      this.page.waitForResponse(
        (res) => {
          if (res.request().method() !== 'POST') return false;
          const url = res.url();
          return (
            url.includes('qc-procedure-detail') &&
            !url.includes('primevue') &&
            !url.includes('select2')
          );
        },
        { timeout: 90_000 },
      ),
      addBtn.click(),
    ]);

    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number | string; message?: string };
    } | null;
    if (!response.ok() || Number(body?.status?.error ?? 0)) {
      throw new Error(
        `Add activity gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(1_200);
    // PrimeVue editable cells — value di input (getByDisplayValue mungkin unavailable di version lama)
    const activityInputInTable = this.page.locator(
      `#ProcedureDetail .p-datatable input, #ProcedureDetail input`,
    ).filter({ hasNot: this.page.getByPlaceholder('Input Activity name') });

    await expect
      .poll(
        async () => {
          const count = await activityInputInTable.count();
          for (let i = 0; i < count; i++) {
            const val = await activityInputInTable.nth(i).inputValue().catch(() => '');
            if (val.includes(activity.slice(0, 10))) return true;
          }
          return false;
        },
        { timeout: 45_000, message: `Activity ${activity} belum di table` },
      )
      .toBeTruthy();
  }

  async assertDetailHasActivity(activityToken: string): Promise<void> {
    await this.expandProcedureDetail();
    const token = activityToken.slice(0, 10).trim();
    const inputs = this.page.locator(
      `#ProcedureDetail .p-datatable input, #ProcedureDetail input`,
    ).filter({ hasNot: this.page.getByPlaceholder('Input Activity name') });

    await expect
      .poll(
        async () => {
          const count = await inputs.count();
          for (let i = 0; i < count; i++) {
            const val = await inputs.nth(i).inputValue().catch(() => '');
            if (val.includes(token)) return true;
          }
          return false;
        },
        { timeout: 45_000, message: `Activity ${token} harus ada di Procedure Detail` },
      )
      .toBeTruthy();
  }

  async assertInDatalist(code: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(code, 2_000);
    await expect(
      this.page.getByRole('row').filter({ hasText: code }).first(),
    ).toBeVisible({ timeout: 30_000 });
  }
}
