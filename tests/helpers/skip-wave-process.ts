import { Locator, Page, expect } from '@playwright/test';
import { dismissStagingBanner } from './shared/staging-banner';

export const SKIP_WAVE_PROCESS_PATH = '/omni/skip-wave-process';

/** Wording resmi Request Data ETM-15532 (bukan contoh Indonesia di Latar Belakang). */
export const ETM_15532_CONFIRM_TEXT =
  'Processing Order Date is empty. All transaction dates for the imported sales orders will automatically use the current date and time. Are you sure you want to proceed?';

/**
 * POM Skip Wave Process — fokus ETM-15532 (confirmation import saat tanggal kosong).
 * Selector diverifikasi di staging; repo olshoperp-frontend tidak tersedia di environment ini.
 */
export class SkipWaveProcessPage {
  constructor(private readonly page: Page) {}

  async gotoDatalist(): Promise<void> {
    await this.page.goto(SKIP_WAVE_PROCESS_PATH, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);
    await expect(this.page.locator('.topbar')).toBeVisible({ timeout: 45_000 });
    await expect(
      this.page.getByRole('table').first().or(this.importControl),
    ).toBeVisible({ timeout: 45_000 });
  }

  get processingOrderDateLabel(): Locator {
    return this.page.getByText(/Processing Order Date/i).first();
  }

  /** Input tanggal — id/name bervariasi; coba beberapa pola FE Olshop. */
  get processingOrderDateInput(): Locator {
    return this.page
      .locator(
        [
          '#processing_order_date',
          'input[name="processing_order_date"]',
          'input[id*="processing_order_date" i]',
          'input[name*="processing_order_date" i]',
        ].join(', '),
      )
      .or(
        this.page
          .locator('label, span, p, div')
          .filter({ hasText: /^Processing Order Date$/i })
          .locator(
            'xpath=ancestor::*[self::label or self::div][1]//input[not(@type="hidden")]',
          ),
      )
      .or(this.page.locator('.topbar ~ * input[type="text"]').first())
      .first();
  }

  get importControl(): Locator {
    return this.page
      .getByRole('button', { name: /^Import$/i })
      .or(this.page.getByRole('link', { name: /^Import$/i }))
      .or(this.page.getByText(/^Import$/i))
      .first();
  }

  get fileInput(): Locator {
    return this.page.locator('input[type="file"]').first();
  }

  confirmationDialog(text = ETM_15532_CONFIRM_TEXT): Locator {
    const snippet = text.slice(0, 40);
    return this.page
      .locator('[role="dialog"], .swal2-popup, .modal, .vfm, body')
      .filter({ hasText: snippet })
      .first();
  }

  get confirmDialogBody(): Locator {
    return this.page.getByText(ETM_15532_CONFIRM_TEXT, { exact: false });
  }

  async readProcessingOrderDateValue(): Promise<string> {
    const input = this.processingOrderDateInput;
    if (await input.count()) {
      const value = await input.inputValue().catch(() => '');
      if (value.trim()) return value.trim();
    }

    const labelled = this.page
      .locator('div, label, span')
      .filter({ hasText: /Processing Order Date/i })
      .first();
    const nearbyText = ((await labelled.textContent()) ?? '').trim();
    return nearbyText.replace(/Processing Order Date/i, '').trim();
  }

  async isProcessingOrderDateEmpty(): Promise<boolean> {
    const value = await this.readProcessingOrderDateValue();
    if (!value) return true;
    return /^(null|empty|-|select|choose|dd[\/-]|mm[\/-])/i.test(value);
  }

  async clearProcessingOrderDate(): Promise<void> {
    const input = this.processingOrderDateInput;
    await expect(
      this.processingOrderDateLabel.or(input),
      'Field Processing Order Date harus terlihat di toolbar Skip Wave Process',
    ).toBeVisible({ timeout: 20_000 });

    const dateGroup = this.page
      .locator('div, label')
      .filter({ hasText: /Processing Order Date/i })
      .first();
    const clearIcon = dateGroup.getByRole('button').or(
      dateGroup.locator('[class*="clear"], [aria-label*="clear" i]'),
    ).first();
    if (await clearIcon.isVisible().catch(() => false)) {
      await clearIcon.click();
      await this.page.waitForTimeout(400);
    }

    if (await input.count()) {
      await input.click({ force: true }).catch(() => undefined);
      await input.fill('');
      await input.press('Control+A').catch(() => undefined);
      await input.press('Backspace').catch(() => undefined);
      await input.blur().catch(() => undefined);
      await this.page.waitForTimeout(400);
    }
  }

  async ensureProcessingOrderDateFilled(): Promise<string> {
    let value = await this.readProcessingOrderDateValue();
    if (value && !/^(null|empty|-)$/i.test(value)) {
      return value;
    }

    const input = this.processingOrderDateInput;
    if (await input.count()) {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const stamp = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} 23:59:59`;
      await input.click({ force: true });
      await input.fill(stamp);
      await input.press('Enter').catch(() => undefined);
      await input.blur().catch(() => undefined);
      await this.page.waitForTimeout(800);
      value = await this.readProcessingOrderDateValue();
    }

    return value;
  }

  async triggerImport(filePath: string): Promise<void> {
    const input = this.fileInput;
    if (await input.count()) {
      await input.setInputFiles(filePath);
      await this.page.waitForTimeout(1_000);
      return;
    }

    const importBtn = this.importControl;
    await expect(importBtn, 'Kontrol Import di toolbar Skip Wave Process').toBeVisible({
      timeout: 20_000,
    });

    const chooserPromise = this.page.waitForEvent('filechooser', { timeout: 5_000 }).catch(() => null);
    await importBtn.click();
    const chooser = await chooserPromise;
    if (chooser) {
      await chooser.setFiles(filePath);
      await this.page.waitForTimeout(1_000);
      return;
    }

    const afterClickInput = this.fileInput;
    if (await afterClickInput.count()) {
      await afterClickInput.setInputFiles(filePath);
      await this.page.waitForTimeout(1_000);
    }
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
    const texts = await this.page.locator('.topbar, header, [class*="toolbar"], [class*="TopBar"]').allInnerTexts();
    const inputs = await this.page.locator('input').evaluateAll((nodes) =>
      nodes.slice(0, 30).map((node) => {
        const el = node as HTMLInputElement;
        return {
          type: el.type,
          id: el.id,
          name: el.name,
          placeholder: el.placeholder,
          value: el.value,
          aria: el.getAttribute('aria-label'),
        };
      }),
    );
    return JSON.stringify({ toolbarTexts: texts.slice(0, 8), inputs }, null, 2);
  }
}
