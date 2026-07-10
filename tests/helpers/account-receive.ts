import { Page, expect, Locator } from '@playwright/test';
import path from 'path';
import { mkdirSync } from 'fs';
import { OlshopDatalist } from './shared';

export const ACCOUNT_RECEIVE_DATALIST_PATH = '/accounting/customer-payment';

/**
 * POM Account Receive (Customer Payment) — datalist + bulk approve.
 * Selector dari DataList.vue + DataTablesV3 (bulk_approve).
 *
 * PENTING: DataTablesV3 menghapus selectedRowsIds saat baris keluar dari filter
 * (event deselect). Jangan ganti search antar-centang — tampilkan semua target
 * dalam satu filter (prefix bersama) lalu centang sekaligus.
 */
export class AccountReceivePage {
  private readonly datalist: OlshopDatalist;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
  }

  get bulkApproveButton(): Locator {
    return this.page.locator('button.bulk-approve').first();
  }

  get selectInfo(): Locator {
    return this.page.locator('.select-item').filter({ hasText: /row/i }).first();
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(ACCOUNT_RECEIVE_DATALIST_PATH, 'button');
  }

  async searchDatalist(query: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(query, 2_000);
  }

  async fillDatalistSearch(query: string): Promise<void> {
    await this.datalist.search(query, 2_000);
  }

  async setPageLength(length: number | 'all'): Promise<void> {
    const lengthSelect = this.page.locator('select.dt-input, select[name*="length"]').first();
    if (!(await lengthSelect.isVisible({ timeout: 5_000 }).catch(() => false))) {
      return;
    }

    if (length === 'all') {
      const options = await lengthSelect.locator('option').allTextContents();
      const allOption = options.find((text) => /all|-1/i.test(text));
      if (allOption) {
        const value =
          (await lengthSelect.locator('option', { hasText: allOption }).getAttribute('value')) ??
          '-1';
        await lengthSelect.selectOption(value);
      } else {
        await lengthSelect.selectOption({ index: (await lengthSelect.locator('option').count()) - 1 });
      }
    } else {
      await lengthSelect.selectOption(String(length));
    }
    await this.page.waitForTimeout(2_000);
  }

  /**
   * Centang trx tanpa ganti search — tampilkan sebanyak mungkin baris di satu halaman.
   * Wajib: semua target harus terlihat bersamaan (DataTables deselect saat baris keluar DOM).
   */
  async checkRowsVisibleTogether(trxCodes: string[], sharedFilter?: string): Promise<void> {
    await this.gotoDatalist();
    await this.setPageLength('all');
    if (sharedFilter) {
      await this.fillDatalistSearch(sharedFilter);
    } else {
      await this.fillDatalistSearch('');
    }

    for (const code of trxCodes) {
      const row = this.rowByTrxCode(code);
      await row.scrollIntoViewIfNeeded();
      await expect(row, `Baris ${code} harus terlihat untuk bulk select`).toBeVisible({
        timeout: 60_000,
      });
      const checkbox = row.locator('input[type="checkbox"]').first();
      await expect(checkbox).toBeVisible({ timeout: 15_000 });
      if (!(await checkbox.isChecked().catch(() => false))) {
        await checkbox.check({ force: true });
      }
      await this.page.waitForTimeout(400);
    }

    await expect(this.selectInfo).toContainText(String(trxCodes.length), {
      timeout: 15_000,
    });
  }

  /**
   * @deprecated Prefer checkRowsVisibleTogether — shared filter pendek bisa melewatkan baris di luar page length.
   */
  async checkRowsUnderSharedFilter(
    sharedFilter: string,
    trxCodes: string[],
  ): Promise<void> {
    await this.checkRowsVisibleTogether(trxCodes, sharedFilter);
  }

  rowByTrxCode(trxCode: string): Locator {
    return this.page.getByRole('row').filter({ hasText: trxCode }).first();
  }

  async assertRowStatus(trxCode: string, statusPattern: RegExp): Promise<void> {
    await this.fillDatalistSearch(trxCode);
    const row = this.rowByTrxCode(trxCode);
    await expect(row, `Baris ${trxCode}`).toBeVisible({ timeout: 45_000 });
    await expect(row).toContainText(statusPattern);
  }

  async assertRowsStatus(trxCodes: string[], statusPattern: RegExp): Promise<void> {
    for (const code of trxCodes) {
      await this.assertRowStatus(code, statusPattern);
    }
  }

  async getRowStatusText(trxCode: string): Promise<string> {
    await this.fillDatalistSearch(trxCode);
    const row = this.rowByTrxCode(trxCode);
    await expect(row, `Baris ${trxCode}`).toBeVisible({ timeout: 45_000 });
    return ((await row.textContent()) ?? '').trim();
  }

  async checkRowByTrxCode(trxCode: string): Promise<void> {
    await this.fillDatalistSearch(trxCode);
    const row = this.rowByTrxCode(trxCode);
    await expect(row, `Baris ${trxCode} harus ada`).toBeVisible({ timeout: 45_000 });

    const checkbox = row.locator('input[type="checkbox"]').first();
    await expect(checkbox).toBeVisible({ timeout: 15_000 });
    if (!(await checkbox.isChecked().catch(() => false))) {
      await checkbox.check({ force: true });
    }
    await this.page.waitForTimeout(500);
  }

  /** Ambil numeric id dari link edit `/accounting/customer-payment/edit/{id}`. */
  async getRowIdByTrxCode(trxCode: string): Promise<number> {
    await this.fillDatalistSearch(trxCode);
    const row = this.rowByTrxCode(trxCode);
    await expect(row, `Baris ${trxCode}`).toBeVisible({ timeout: 45_000 });
    const href =
      (await row.getByRole('link', { name: trxCode, exact: true }).getAttribute('href')) ?? '';
    const match = href.match(/\/edit\/(\d+)/);
    if (!match) {
      throw new Error(`Tidak menemukan edit id untuk ${trxCode} (href="${href}")`);
    }
    return Number(match[1]);
  }

  async collectRowIds(trxCodes: string[]): Promise<number[]> {
    const ids: number[] = [];
    for (const code of trxCodes) {
      ids.push(await this.getRowIdByTrxCode(code));
    }
    return ids;
  }

  /**
   * Bulk approve via UI tombol + rewrite data_ids di request.
   * Dipakai saat target tidak bisa dicentang bersamaan (DataTables deselect saat filter berubah).
   * x_class diambil dari payload asli UI (FQCN controller), bukan hardcode.
   */
  async bulkApproveViaUiWithIds(ids: number[], seedOpenTrxCode: string): Promise<{
    responseStatus: number;
    body: {
      status?: { error?: number; message?: string };
      data?: {
        error_count?: number;
        error_details?: Array<{ data_id?: string | number; message?: string }>;
        success_count?: number;
      };
    } | null;
  }> {
    await this.checkRowByTrxCode(seedOpenTrxCode);
    await this.assertBulkApproveActive();

    let capturedBody: {
      status?: { error?: number; message?: string };
      data?: {
        error_count?: number;
        error_details?: Array<{ data_id?: string | number; message?: string }>;
        success_count?: number;
      };
    } | null = null;
    let capturedStatus = 0;

    await this.page.route('**/bulk-approve', async (route) => {
      const request = route.request();
      if (request.method() !== 'POST') {
        await route.continue();
        return;
      }

      const raw = request.postData() ?? '';
      const xClass =
        raw.match(/name="x_class"\r\n\r\n([^\r\n]+)/)?.[1]?.trim() ||
        raw.match(/name="x_class"\r\n\r\n(.+?)(?:\r\n--)/s)?.[1]?.trim() ||
        '';

      if (!xClass) {
        await route.continue();
        return;
      }

      const apiResponse = await this.page.request.post(request.url(), {
        headers: {
          Accept: 'application/json',
          Authorization: request.headers()['authorization'] ?? '',
          ...(request.headers()['company-id']
            ? { 'Company-Id': request.headers()['company-id'] }
            : {}),
          ...(request.headers()['x-company-id']
            ? { 'X-Company-Id': request.headers()['x-company-id'] }
            : {}),
        },
        multipart: {
          description: '',
          approval_status: 'approved',
          data_ids: ids.join(','),
          x_class: xClass,
        },
      });

      capturedStatus = apiResponse.status();
      capturedBody = (await apiResponse.json().catch(() => null)) as typeof capturedBody;
      await route.fulfill({
        status: capturedStatus,
        contentType: 'application/json',
        body: JSON.stringify(capturedBody ?? {}),
      });
    });

    await this.clickBulkApproveAndConfirm();
    await this.page.waitForTimeout(3_000);
    await this.page.unroute('**/bulk-approve').catch(() => undefined);

    if (!capturedStatus) {
      throw new Error(
        'Bulk approve rewrite gagal menangkap response (x_class mungkin tidak ter-parse dari multipart).',
      );
    }

    return { responseStatus: capturedStatus, body: capturedBody };
  }

  /**
   * Tombol bulk approve: UI menyembunyikan (display:none) jika tidak ada baris Open terpilih.
   * TC menyebut disabled/enabled — assert via visibility + enabled state.
   */
  async assertBulkApproveInactive(): Promise<void> {
    const btn = this.bulkApproveButton;
    const visible = await btn.isVisible().catch(() => false);
    if (visible) {
      await expect(btn).toBeDisabled();
    } else {
      await expect(btn).toBeHidden();
    }
  }

  async assertBulkApproveActive(): Promise<void> {
    const btn = this.bulkApproveButton;
    await expect(btn).toBeVisible({ timeout: 15_000 });
    await expect(btn).toBeEnabled({ timeout: 10_000 });
  }

  async clickBulkApproveAndConfirm(): Promise<void> {
    await this.assertBulkApproveActive();
    await this.bulkApproveButton.scrollIntoViewIfNeeded();
    await this.bulkApproveButton.click();

    const confirmApprove = this.page.getByRole('button', { name: /^Approve$/i }).last();
    await expect(confirmApprove).toBeVisible({ timeout: 15_000 });
    await confirmApprove.click();
  }

  async waitForBulkApproveResponse(timeoutMs = 120_000) {
    return this.page.waitForResponse(
      (response) =>
        response.url().includes('/bulk-approve') &&
        response.request().method() === 'POST',
      { timeout: timeoutMs },
    );
  }

  toastLocator(pattern: RegExp): Locator {
    return this.page.locator('.toastify, [class*="toast"]').filter({ hasText: pattern });
  }

  bulkErrorDialog(): Locator {
    return this.page
      .getByText(/Bulk Approve Error Details|Bulk Action Error Details/i)
      .first();
  }

  async closeBulkErrorDialogIfOpen(): Promise<void> {
    const closeBtn = this.page.getByRole('button', { name: /^Close$|^OK$|^Tutup$/i }).last();
    if (await closeBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await closeBtn.click();
      await this.page.waitForTimeout(1_000);
    }
  }

  async captureEvidence(filename: string): Promise<string> {
    const dir = path.join(process.cwd(), 'test-results', 'account-receive-bulk-approve');
    mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, filename);
    await this.page.screenshot({ path: filePath, fullPage: true });
    return filePath;
  }
}
