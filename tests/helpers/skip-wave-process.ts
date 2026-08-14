import { Locator, Page, expect } from '@playwright/test';
import { dismissStagingBanner } from './shared/staging-banner';

export const SKIP_WAVE_PROCESS_PATH = '/omni/skip-wave-process';

/** Wording resmi Request Data ETM-15532 (bukan contoh Indonesia di Latar Belakang). */
export const ETM_15532_CONFIRM_TEXT =
  'Processing Order Date is empty. All transaction dates for the imported sales orders will automatically use the current date and time. Are you sure you want to proceed?';

/**
 * POM Skip Wave Process — fokus ETM-15532.
 * Selector dari live staging a11y tree (14 Aug 2026):
 * date = combobox name "Default to current time"
 * import = button "Import"
 */
export class SkipWaveProcessPage {
  constructor(private readonly page: Page) {}

  async gotoDatalist(): Promise<void> {
    await this.page.goto(SKIP_WAVE_PROCESS_PATH, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);
    await expect(this.page.locator('.topbar')).toBeVisible({ timeout: 45_000 });
    await expect(this.importControl).toBeVisible({ timeout: 45_000 });
    await expect(this.processingOrderDateInput).toBeVisible({ timeout: 20_000 });
  }

  get processingOrderDateInput(): Locator {
    return this.page.getByRole('combobox', {
      name: 'Default to current time',
    });
  }

  get importControl(): Locator {
    return this.page.getByRole('button', { name: 'Import', exact: true });
  }

  get fileInput(): Locator {
    return this.page.locator('input[type="file"]');
  }

  get confirmDialogBody(): Locator {
    return this.page.getByText(ETM_15532_CONFIRM_TEXT, { exact: false });
  }

  async readProcessingOrderDateValue(): Promise<string> {
    const input = this.processingOrderDateInput;
    const value = (await input.inputValue().catch(() => '')).trim();
    if (value) return value;
    return ((await input.textContent()) ?? '').trim();
  }

  async isProcessingOrderDateEmpty(): Promise<boolean> {
    const value = await this.readProcessingOrderDateValue();
    return value.length === 0;
  }

  async clearProcessingOrderDate(): Promise<void> {
    const input = this.processingOrderDateInput;
    await expect(input).toBeVisible({ timeout: 20_000 });

    const wrapper = input.locator('xpath=ancestor::div[contains(@class,"flex") or contains(@class,"relative")][1]');
    const clearBtn = wrapper.locator('img, button, svg, span').nth(1);
    if (await clearBtn.isVisible().catch(() => false)) {
      await clearBtn.click({ force: true }).catch(() => undefined);
      await this.page.waitForTimeout(300);
    }

    if (!(await this.isProcessingOrderDateEmpty())) {
      await input.click({ force: true });
      await this.page.keyboard.press('Control+A');
      await this.page.keyboard.press('Backspace');
      await this.page.keyboard.press('Delete');
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(400);
    }

    if (!(await this.isProcessingOrderDateEmpty())) {
      await input.fill('');
      await input.blur().catch(() => undefined);
      await this.page.waitForTimeout(400);
    }
  }

  async ensureProcessingOrderDateFilled(): Promise<string> {
    let value = await this.readProcessingOrderDateValue();
    if (value) return value;

    const input = this.processingOrderDateInput;
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const stamp = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} 23:59:59`;
    await input.click({ force: true });
    await input.fill(stamp);
    await this.page.keyboard.press('Enter').catch(() => undefined);
    await this.page.waitForTimeout(500);
    value = await this.readProcessingOrderDateValue();
    return value;
  }

  async triggerImport(filePath: string): Promise<void> {
    const hiddenInput = this.fileInput.first();
    if ((await hiddenInput.count()) > 0) {
      await hiddenInput.setInputFiles(filePath);
      await this.page.waitForTimeout(1_000);
      return;
    }

    const chooserPromise = this.page
      .waitForEvent('filechooser', { timeout: 8_000 })
      .catch(() => null);
    await this.importControl.click();
    const chooser = await chooserPromise;
    if (chooser) {
      await chooser.setFiles(filePath);
      await this.page.waitForTimeout(1_000);
    }
  }

  /**
   * Klik Import dulu (dialog empty-date bisa muncul sebelum file picker).
   * Return true jika dialog empty-date sudah terlihat.
   */
  async clickImportThenMaybeAttach(filePath: string): Promise<boolean> {
    const chooserPromise = this.page
      .waitForEvent('filechooser', { timeout: 5_000 })
      .catch(() => null);

    await this.importControl.click();

    if (await this.waitForEmptyDateConfirmation(2_500)) {
      return true;
    }

    const chooser = await chooserPromise;
    if (chooser) {
      await chooser.setFiles(filePath);
      await this.page.waitForTimeout(800);
      return this.waitForEmptyDateConfirmation(5_000);
    }

    const hiddenInput = this.fileInput.first();
    if ((await hiddenInput.count()) > 0) {
      await hiddenInput.setInputFiles(filePath);
      await this.page.waitForTimeout(800);
      return this.waitForEmptyDateConfirmation(5_000);
    }

    return this.waitForEmptyDateConfirmation(5_000);
  }

  async waitForEmptyDateConfirmation(timeoutMs = 8_000): Promise<boolean> {
    return this.confirmDialogBody
      .first()
      .isVisible({ timeout: timeoutMs })
      .catch(() => false);
  }

  async dismissConfirmation(): Promise<void> {
    const cancel = this.page
      .getByRole('button', { name: /cancel|no|tutup|close|batal/i })
      .first();
    if (await cancel.isVisible().catch(() => false)) {
      await cancel.click();
      return;
    }
    await this.page.keyboard.press('Escape');
  }

  async dumpToolbarSnapshot(): Promise<string> {
    const dateValue = await this.readProcessingOrderDateValue();
    const importVisible = await this.importControl.isVisible().catch(() => false);
    const inputs = await this.page.locator('input, [role="combobox"]').evaluateAll((nodes) =>
      nodes.slice(0, 40).map((node) => {
        const el = node as HTMLInputElement;
        return {
          tag: el.tagName,
          type: el.type,
          id: el.id,
          name: el.name,
          role: el.getAttribute('role'),
          aria: el.getAttribute('aria-label'),
          placeholder: el.placeholder,
          value: el.value,
        };
      }),
    );
    return JSON.stringify({ dateValue, importVisible, inputs }, null, 2);
  }
}
