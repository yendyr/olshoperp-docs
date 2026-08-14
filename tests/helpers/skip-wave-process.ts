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
    const input = this.processingOrderDateInput;
    await expect(input).toBeVisible({ timeout: 20_000 });

    const now = new Date(Date.now() - 60 * 60 * 1000);
    const pad = (n: number) => String(n).padStart(2, '0');
    const stamp = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:00`;

    const putPromise = this.page
      .waitForResponse(
        (response) =>
          /processing-order-date/i.test(response.url()) &&
          response.request().method() === 'PUT',
        { timeout: 12_000 },
      )
      .catch(() => null);

    await input.click({ force: true });
    await input.fill(stamp);
    await this.page.keyboard.press('Enter').catch(() => undefined);
    await input.blur().catch(() => undefined);
    await this.page.waitForTimeout(800);
    await putPromise;

    const futureToast = this.page.getByText(
      /cannot set to future time/i,
    );
    if (await futureToast.isVisible().catch(() => false)) {
      throw new Error(
        `Gagal set Processing Order Date "${stamp}": toast future time. Pilih waktu yang sudah lewat.`,
      );
    }

    return this.readProcessingOrderDateValue();
  }

  get uploadFileItem(): Locator {
    return this.page.getByRole('button', { name: 'Upload File', exact: true });
  }

  get downloadTemplateItem(): Locator {
    return this.page.getByRole('button', {
      name: 'Download Template',
      exact: true,
    });
  }

  lastNativeDialogMessage = '';

  private armNativeDialogCapture(): void {
    this.lastNativeDialogMessage = '';
    this.page.once('dialog', async (dialog) => {
      this.lastNativeDialogMessage = dialog.message();
      await dialog.dismiss().catch(() => undefined);
    });
  }

  async clickImportThenMaybeAttach(filePath: string): Promise<boolean> {
    this.armNativeDialogCapture();

    await this.importControl.click();
    const uploadItem = this.uploadFileItem;
    await expect(uploadItem, 'Menu Import → Upload File').toBeVisible({
      timeout: 8_000,
    });

    const chooserPromise = this.page
      .waitForEvent('filechooser', { timeout: 8_000 })
      .catch(() => null);

    await uploadItem.click();

    if (await this.hasEmptyDateConfirmation(2_000)) {
      return true;
    }

    const chooser = await chooserPromise;
    if (chooser) {
      await chooser.setFiles(filePath);
    } else {
      const fileInputs = this.fileInput;
      const count = await fileInputs.count();
      if (count > 0) {
        await fileInputs.nth(count - 1).setInputFiles(filePath);
      }
    }

    await this.page.waitForTimeout(1_200);
    return this.hasEmptyDateConfirmation(6_000);
  }

  async hasEmptyDateConfirmation(timeoutMs = 8_000): Promise<boolean> {
    if (this.nativeDialogLooksLikeEmptyDateConfirm()) {
      return true;
    }
    const htmlVisible = await this.confirmDialogBody
      .first()
      .isVisible({ timeout: timeoutMs })
      .catch(() => false);
    return htmlVisible || this.nativeDialogLooksLikeEmptyDateConfirm();
  }

  nativeDialogLooksLikeEmptyDateConfirm(): boolean {
    const msg = this.lastNativeDialogMessage.replace(/\s+/g, ' ');
    return (
      /Processing Order Date is empty/i.test(msg) ||
      /tanggal belum diisi/i.test(msg)
    );
  }

  async waitForEmptyDateConfirmation(timeoutMs = 8_000): Promise<boolean> {
    return this.hasEmptyDateConfirmation(timeoutMs);
  }

  async dismissConfirmation(): Promise<void> {
    const cancel = this.page
      .getByRole('button', { name: /cancel|no|tutup|close|batal/i })
      .or(this.page.locator('.swal2-cancel, button.btn-close'))
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
