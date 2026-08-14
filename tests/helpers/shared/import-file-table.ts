import { Locator, Page, expect } from '@playwright/test';

export type ImportFailureAssertOptions = {
  /** Default 90_000 — tunggu history/notif + baris error log */
  timeoutMs?: number;
  /** Buka panel Import (slideover) jika belum terbuka */
  ensurePanelOpen?: boolean;
};

/**
 * POM panel ImportFileTable (slideover) — tab Import History & View Error Logs.
 * Sumber UI: olshoperp-frontend ImportFileTable.vue
 *
 * Alur assert error (QA manual / ETM-15529):
 * 1. Tunggu entri Import History muncul dan/atau toast notifikasi gagal import
 * 2. Klik tab "View Error Logs" (tanpa klik baris history)
 * 3. Assert kolom Message berisi exact English expected
 */
export class ImportFileTablePanel {
  constructor(private readonly page: Page) {}

  get importHistoryTab(): Locator {
    return this.page.getByRole('button', { name: 'Import History', exact: true });
  }

  get viewErrorLogsTab(): Locator {
    return this.page.getByRole('button', { name: 'View Error Logs', exact: true });
  }

  /** Tombol toolbar datalist yang membuka slideover Import */
  get openImportPanelButton(): Locator {
    return this.page
      .locator('button.dt-btn-import-history')
      .or(this.page.getByRole('button', { name: /^Import$/i }).first());
  }

  /** Tabel View Error Logs — kolom SKU Product + Message */
  get errorLogsTable(): Locator {
    return this.page.getByRole('table').filter({
      has: this.page.getByRole('columnheader', { name: /^Message$/i }),
    });
  }

  get errorLogMessageCells(): Locator {
    return this.errorLogsTable.locator('tbody tr td').filter({
      hasNot: this.page.locator('th'),
    });
  }

  async isPanelOpen(): Promise<boolean> {
    return this.viewErrorLogsTab.isVisible().catch(() => false);
  }

  /** Buka slideover Import jika belum tampil */
  async openImportPanel(): Promise<void> {
    if (await this.isPanelOpen()) {
      return;
    }

    await this.openImportPanelButton.scrollIntoViewIfNeeded();
    await expect(this.openImportPanelButton).toBeVisible({ timeout: 30_000 });
    await this.openImportPanelButton.click();

    await expect(this.viewErrorLogsTab).toBeVisible({ timeout: 30_000 });
  }

  /**
   * Tunggu sinyal import selesai/gagal: toast import fail **atau** tabel Import History terisi.
   * Tidak perlu klik baris history.
   */
  async waitForImportHistoryOrFailureNotification(
    options?: Pick<ImportFailureAssertOptions, 'timeoutMs'>,
  ): Promise<void> {
    const timeoutMs = options?.timeoutMs ?? 90_000;

    const failureToast = this.page
      .locator('.toastify, [class*="toast"]')
      .filter({ hasText: /import|failed|fail|error|gagal/i });

    const historyStatusCell = this.page
      .getByRole('table')
      .locator('tbody tr')
      .filter({ hasText: /Failed|Success|Processing|Queue/i })
      .first();

    await expect(async () => {
      const toastOk = await failureToast.first().isVisible().catch(() => false);
      const historyOk = await historyStatusCell.isVisible().catch(() => false);
      if (!toastOk && !historyOk) {
        throw new Error(
          'Menunggu Import History atau notifikasi gagal import',
        );
      }
    }).toPass({ timeout: timeoutMs });
  }

  /** Klik tab View Error Logs — tanpa memilih baris Import History */
  async openViewErrorLogsTab(): Promise<void> {
    await this.viewErrorLogsTab.scrollIntoViewIfNeeded();
    await this.viewErrorLogsTab.click();
    await expect(this.errorLogsTable.first()).toBeVisible({ timeout: 30_000 });
  }

  /**
   * Assert pesan English di kolom Message (tab View Error Logs).
   * Poll sampai baris error muncul (job async / refresh tabel).
   */
  async assertViewErrorLogMessage(
    expected: string | RegExp,
    options?: Pick<ImportFailureAssertOptions, 'timeoutMs'>,
  ): Promise<void> {
    const timeoutMs = options?.timeoutMs ?? 90_000;
    const pattern =
      expected instanceof RegExp
        ? expected
        : new RegExp(
            expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
            'i',
          );

    await this.openViewErrorLogsTab();

    await expect(async () => {
      const table = this.errorLogsTable.first();
      await expect(table).toBeVisible({ timeout: 5_000 });

      const bodyText = ((await table.locator('tbody').textContent()) ?? '').trim();
      if (!pattern.test(bodyText)) {
        // Trigger redraw — ImportFileTable refresh setelah toast import
        await this.page.waitForTimeout(1_000);
        throw new Error(
          `View Error Logs belum berisi "${expected}". Isi saat ini: ${bodyText.slice(0, 200) || '(kosong)'}`,
        );
      }
    }).toPass({ timeout: timeoutMs });
  }

  /**
   * Flow lengkap QA: tunggu history/notif gagal → View Error Logs → assert Message.
   */
  async waitForImportFailureAndAssertErrorLog(
    expected: string | RegExp,
    options: ImportFailureAssertOptions = {},
  ): Promise<void> {
    const { timeoutMs = 90_000, ensurePanelOpen = true } = options;

    if (ensurePanelOpen) {
      await this.openImportPanel();
    }

    await this.waitForImportHistoryOrFailureNotification({ timeoutMs });
    await this.assertViewErrorLogMessage(expected, { timeoutMs });
  }
}
