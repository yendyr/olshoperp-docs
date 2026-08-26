import fs from 'fs';
import path from 'path';
import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopFormActions } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const COLLI_TYPE_DATALIST_PATH = '/supplychain/colli-type';
export const COLLI_TYPE_EDIT_PATH_PATTERN =
  /\/supplychain\/colli-type\/edit\/\d+/;

export const ETM_15549_RESULTS_DIR = path.join(
  process.cwd(),
  'Automate Testing Card QA Review',
  'ETM-15549',
);

export type ColliTypeFormData = {
  code: string;
  name: string;
  description?: string;
};

export type SaveResult = {
  ok: boolean;
  httpStatus: number | null;
  message: string;
  editUrl: string | null;
  toast: string;
};

export type DeletedRowState = {
  visible: boolean;
  actionText: string;
  hasAlreadyDeleted: boolean;
  hasDeletedLink: boolean;
  deletedHref: string | null;
};

/**
 * POM Colli Type — SCM Master.
 * Selector: tests/pom-registry/colli-type.yaml
 */
export class ColliTypePage {
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
      .locator('#ColliType textarea, textarea#description, textarea[name="description"]')
      .first()
      .or(this.page.locator('textarea').first());
  }

  get showDeletedSwitch(): Locator {
    return this.page
      .locator('#show_deleted_switch')
      .or(
        this.page
          .getByText(/Show deleted data/i)
          .locator('xpath=ancestor::*[self::label or self::div][1]//input[@type="checkbox"]')
          .first(),
      )
      .or(this.page.getByRole('checkbox', { name: /Show deleted/i }))
      .first();
  }

  rowByCode(code: string): Locator {
    return this.page.getByRole('row').filter({ hasText: code }).first();
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(COLLI_TYPE_DATALIST_PATH, 'link');
  }

  async expandFormSection(): Promise<void> {
    for (const name of ['Colli Type', 'Basic Information']) {
      const section = this.form.accordionSection(name);
      if (await section.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await this.form.expandAccordion(name).catch(() => undefined);
        return;
      }
    }
  }

  async openCreateForm(): Promise<void> {
    await this.datalist.clickCreate('link');
    await this.page.waitForURL(/\/supplychain\/colli-type\/create/, {
      timeout: 45_000,
    });
    await dismissStagingBanner(this.page);
    await this.expandFormSection();
    await expect(this.codeInput).toBeVisible({ timeout: 30_000 });
  }

  async fillCreateForm(data: ColliTypeFormData): Promise<void> {
    await this.codeInput.fill(data.code);
    await this.nameInput.fill(data.name);
    const desc = this.descriptionInput;
    if (await desc.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await desc.fill(data.description ?? 'automation playwright');
    }
  }

  async readToastText(timeoutMs = 8_000): Promise<string> {
    const toast = this.page.locator('.toastify, [class*="toast"]').first();
    if (!(await toast.isVisible({ timeout: timeoutMs }).catch(() => false))) {
      return '';
    }
    return ((await toast.innerText().catch(() => '')) ?? '').trim();
  }

  private isColliTypeWrite(url: string, method: string): boolean {
    if (!/colli-type/i.test(url)) return false;
    return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
  }

  async clickPrimarySave(): Promise<void> {
    const saveAndNext = this.form.saveAndNextButton;
    if (await saveAndNext.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await this.form.clickSaveAndNext();
      return;
    }
    await this.form.clickSaveAll();
  }

  async saveCreate(): Promise<SaveResult> {
    const pending = this.page.waitForResponse(
      (response) =>
        this.isColliTypeWrite(response.url(), response.request().method()) &&
        response.request().method() === 'POST',
      { timeout: 90_000 },
    );

    await this.clickPrimarySave();

    const response = await pending.catch(() => null);
    const toast = await this.readToastText(8_000);
    const body = (await response?.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
      message?: string;
    } | null;
    const apiMessage =
      body?.status?.message ?? body?.message ?? toast ?? '';
    const httpStatus = response?.status() ?? null;
    const apiError = Boolean(body?.status?.error) || (httpStatus !== null && httpStatus >= 400);
    const conflict =
      /data conflict|already been taken|already exists/i.test(`${apiMessage} ${toast}`);
    const onEdit = COLLI_TYPE_EDIT_PATH_PATTERN.test(this.page.url());

    if (onEdit) {
      await waitForSuccessToast(this.page, 5_000).catch(() => undefined);
      await dismissStagingBanner(this.page);
    }

    return {
      ok: onEdit && !apiError && !conflict,
      httpStatus,
      message: apiMessage || toast,
      editUrl: onEdit ? this.page.url() : null,
      toast,
    };
  }

  async setShowDeletedData(on: boolean): Promise<void> {
    const sw = this.showDeletedSwitch;
    await expect(sw, 'Show deleted data').toBeVisible({ timeout: 15_000 });
    const checked = await sw.isChecked().catch(() => false);
    if (checked !== on) {
      await sw.click({ force: true });
      await this.page.waitForTimeout(1_500);
    }
  }

  async searchCode(code: string): Promise<void> {
    await this.datalist.search(code, 1_800);
  }

  async isCodeVisible(code: string): Promise<boolean> {
    const row = this.rowByCode(code);
    return row.isVisible({ timeout: 8_000 }).catch(() => false);
  }

  async softDeleteByCode(code: string): Promise<SaveResult> {
    await this.gotoDatalist();
    await this.setShowDeletedData(false);
    await this.searchCode(code);

    const row = this.rowByCode(code);
    await expect(row, `Baris Colli Type ${code} untuk Delete`).toBeVisible({
      timeout: 45_000,
    });

    const actionCell = row.locator('td').last();
    const deleteControl = actionCell
      .locator('button[class*="delete-button"]')
      .or(actionCell.getByRole('button', { name: /Show Delete Modal|Delete/i }))
      .or(actionCell.locator('button').last())
      .first();
    await expect(deleteControl, `Ikon Delete (trash) baris ${code}`).toBeVisible({
      timeout: 15_000,
    });
    await deleteControl.click();

    await expect(this.page.getByText(/Are you sure/i).first()).toBeVisible({
      timeout: 15_000,
    });
    const confirmDelete = this.page
      .getByRole('button', { name: /^Delete$/i })
      .last();
    await expect(confirmDelete).toBeVisible({ timeout: 15_000 });

    const deleteResponse = this.page.waitForResponse(
      (response) => {
        const method = response.request().method();
        const url = response.url();
        if (!/colli-type/i.test(url) && !/bulk-delete/i.test(url)) {
          return false;
        }
        return ['DELETE', 'POST'].includes(method);
      },
      { timeout: 90_000 },
    );

    await confirmDelete.click();
    const response = await deleteResponse.catch(() => null);
    const toast = await this.readToastText(10_000);
    await waitForSuccessToast(this.page, 8_000).catch(() => undefined);
    await this.page.waitForTimeout(800);

    const httpStatus = response?.status() ?? null;
    const ok =
      (httpStatus === null || httpStatus < 400) &&
      /success deleted|successfully deleted|has been success deleted/i.test(toast || 'ok');

    return {
      ok: httpStatus !== null ? httpStatus < 400 : /success/i.test(toast),
      httpStatus,
      message: toast,
      editUrl: null,
      toast,
    };
  }

  async readDeletedRow(code: string): Promise<DeletedRowState> {
    await this.gotoDatalist();
    await this.setShowDeletedData(true);
    await this.searchCode(code);

    const row = this.rowByCode(code);
    const visible = await row.isVisible({ timeout: 20_000 }).catch(() => false);
    if (!visible) {
      return {
        visible: false,
        actionText: '',
        hasAlreadyDeleted: false,
        hasDeletedLink: false,
        deletedHref: null,
      };
    }

    const actionText = ((await row.innerText().catch(() => '')) ?? '').trim();
    const deletedLink = row.getByRole('link', { name: /^Deleted$/i }).first();
    const hasDeletedLink = await deletedLink
      .isVisible({ timeout: 2_000 })
      .catch(() => false);
    const deletedHref = hasDeletedLink
      ? await deletedLink.getAttribute('href')
      : null;

    return {
      visible: true,
      actionText,
      hasAlreadyDeleted: /already deleted/i.test(actionText),
      hasDeletedLink,
      deletedHref,
    };
  }

  async screenshot(filename: string): Promise<string> {
    const dir = path.join(ETM_15549_RESULTS_DIR, 'screenshots');
    fs.mkdirSync(dir, { recursive: true });
    const target = path.join(dir, filename);
    await this.page.screenshot({ path: target, fullPage: true });
    return target;
  }
}
