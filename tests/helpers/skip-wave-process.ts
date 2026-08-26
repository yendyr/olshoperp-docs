import fs from 'fs';
import path from 'path';
import { Locator, Page, expect } from '@playwright/test';
import { dismissStagingBanner } from './shared/staging-banner';

export const SKIP_WAVE_PROCESS_PATH = '/omni/skip-wave-process';

export const ETM_15532_RESULTS_DIR = path.join(
  process.cwd(),
  'Automate Testing Card QA Review',
  'ETM-15532',
);

export const EMPTY_DATE_CONFIRM_PATTERN =
  /Processing Order Date is empty|Tanggal belum diisi|current date and time|menggunakan tanggal hari ini/i;

/**
 * POM Skip Wave Process — fokus ETM-15532 (import + Processing Order Date empty).
 * Selector: tests/pom-registry/skip-wave-process.yaml
 */
export class SkipWaveProcessPage {
  constructor(private readonly page: Page) {}

  get processingDateInput(): Locator {
    const emptyState = this.page.getByRole('combobox', {
      name: 'Default to current time',
    });
    const dated = this.page.getByRole('combobox').filter({
      hasText: /\d{2}-\d{2}-\d{4}/,
    });
    const picker = this.page.locator(
      'input.olshoperp-datepicker-input, input.p-datepicker-input',
    );
    return emptyState.or(dated).or(picker).first();
  }

  get importButton(): Locator {
    return this.page
      .getByRole('button', { name: /^Import$/i })
      .or(this.page.getByRole('link', { name: /^Import$/i }))
      .first();
  }

  get confirmDialog(): Locator {
    return this.page
      .getByRole('dialog')
      .or(this.page.locator('.swal2-popup, .p-dialog, [role="alertdialog"]'))
      .filter({ hasText: EMPTY_DATE_CONFIRM_PATTERN })
      .first();
  }

  get confirmText(): Locator {
    return this.page.getByText('Processing Order Date is empty');
  }

  async gotoList(): Promise<void> {
    await this.page.goto(SKIP_WAVE_PROCESS_PATH, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);
    await expect(this.page.locator('.topbar')).toBeVisible({ timeout: 45_000 });
    await expect(this.importButton).toBeVisible({ timeout: 45_000 });
    await this.page.waitForTimeout(800);
  }

  async dismissOverlays(): Promise<void> {
    const dateDialog = this.page.getByRole('dialog', { name: 'Choose Date' });
    for (let i = 0; i < 3; i++) {
      if (!(await dateDialog.isVisible().catch(() => false))) {
        break;
      }
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(300);
    }
    await dateDialog.waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => undefined);

    const toast = this.page.locator('.toastify.on, .toastify').first();
    if (await toast.isVisible().catch(() => false)) {
      await toast.waitFor({ state: 'hidden', timeout: 12_000 }).catch(() => undefined);
    }
  }

  async isDateEmpty(): Promise<boolean> {
    return this.page
      .getByRole('combobox', { name: 'Default to current time' })
      .isVisible()
      .catch(() => false);
  }

  async screenshot(fileName: string): Promise<string> {
    fs.mkdirSync(path.join(ETM_15532_RESULTS_DIR, 'screenshots'), {
      recursive: true,
    });
    const filePath = path.join(ETM_15532_RESULTS_DIR, 'screenshots', fileName);
    await this.page.screenshot({ path: filePath });
    return filePath;
  }

  async readProcessingDate(): Promise<string> {
    const input = this.processingDateInput;
    if (!(await input.isVisible().catch(() => false))) {
      return '';
    }
    return (await input.inputValue().catch(() => '')).trim();
  }

  async clearProcessingDate(): Promise<void> {
    const input = this.processingDateInput;
    await expect(input, 'Processing Order Date harus terlihat').toBeVisible({
      timeout: 20_000,
    });
    await input.click({ clickCount: 3 });
    await this.page.keyboard.press('Backspace');
    await input.fill('');
    await this.page.keyboard.press('Escape');
    await this.dismissOverlays();
    await this.page.waitForTimeout(500);
  }

  async setProcessingDate(displayValue: string): Promise<void> {
    const input = this.processingDateInput;
    await expect(input).toBeVisible({ timeout: 20_000 });
    await input.click({ clickCount: 3 });
    await input.fill(displayValue);
    await input.press('Enter');
    await input.blur();
    await this.dismissOverlays();
  }

  async clickImport(): Promise<void> {
    await this.dismissOverlays();
    await this.importButton.scrollIntoViewIfNeeded();
    await this.importButton.click({ force: true });
    await this.page.waitForTimeout(700);

    const uploadItem = this.page
      .getByRole('menuitem', { name: /upload file/i })
      .or(this.page.getByText('Upload File', { exact: true }));
    await expect(uploadItem, 'Menu Import → Upload File').toBeVisible({
      timeout: 8_000,
    });
    await uploadItem.click();
    await this.page.waitForTimeout(800);
  }

  async attachDummyFileIfChooser(filePath: string): Promise<boolean> {
    const fileInput = this.page.locator('input[type="file"]').last();
    await expect(fileInput, 'Input file upload Skip Wave').toBeAttached({
      timeout: 15_000,
    });
    await fileInput.setInputFiles({
      name: path.basename(filePath),
      mimeType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buffer: fs.readFileSync(filePath),
    });
    await this.page.waitForTimeout(1_200);
    return true;
  }

  async isEmptyDateConfirmVisible(timeoutMs = 4_000): Promise<boolean> {
    return this.confirmText.isVisible({ timeout: timeoutMs }).catch(() => false);
  }

  async cancelConfirm(): Promise<void> {
    const cancel = this.page.getByRole('button', {
      name: /^(cancel|no|tidak|close)$/i,
    });
    if (await cancel.first().isVisible().catch(() => false)) {
      await cancel.first().click();
      await this.page.waitForTimeout(400);
      return;
    }

    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(400);
    if (await this.confirmText.isVisible().catch(() => false)) {
      await this.page
        .locator('#headlessui-portal-root .fixed.inset-0')
        .first()
        .click({ position: { x: 8, y: 8 }, force: true })
        .catch(() => undefined);
      await this.page.waitForTimeout(400);
    }
    await this.confirmText
      .waitFor({ state: 'hidden', timeout: 8_000 })
      .catch(() => undefined);
  }

  async closeImportChrome(): Promise<void> {
    await this.page.keyboard.press('Escape').catch(() => undefined);
    const close = this.page.getByRole('button', { name: /^(close|cancel)$/i });
    if (await close.first().isVisible().catch(() => false)) {
      await close.first().click().catch(() => undefined);
    }
    await this.page.waitForTimeout(300);
  }
}
