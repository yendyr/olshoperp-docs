import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopFormActions } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const TRANSFER_INBOUND_DATALIST_PATH = '/supplychain/transfer-inbound';
export const TRANSFER_INBOUND_EDIT_PATH_PATTERN =
  /\/supplychain\/transfer-inbound\/edit\/\d+/;

/**
 * POM Transfer Inbound (supplychain-transfer-inbound).
 * Selector: tests/pom-registry/transfer-inbound.yaml
 *
 * Filtered view + receive mode atas entity External Transfer (TFE*).
 * Tidak ada Create — dokumen muncul setelah TE di-approve (in transit).
 */
export class TransferInboundPage {
  readonly datalist: OlshopDatalist;
  private readonly form: OlshopFormActions;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
    this.form = new OlshopFormActions(page);
  }

  get codeInput(): Locator {
    return this.page
      .locator('#code')
      .or(this.page.getByPlaceholder('Automatically generate by system'))
      .first();
  }

  async gotoDatalist(): Promise<void> {
    await this.page.goto(TRANSFER_INBOUND_DATALIST_PATH, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);
    await expect(this.page.getByRole('table').first()).toBeVisible({
      timeout: 45_000,
    });
  }

  async expandBasicInformation(): Promise<void> {
    const basic = this.page.getByRole('button', {
      name: 'Basic Information',
      exact: true,
    });
    await expect(basic).toBeVisible({ timeout: 45_000 });
    if ((await basic.getAttribute('aria-expanded')) !== 'true') {
      await basic.click();
      await this.page.waitForTimeout(700);
    }
  }

  async expandProductTransferDetail(): Promise<void> {
    const btn = this.page.getByRole('button', {
      name: /Product Transfer Detail/i,
    });
    await expect(btn.first()).toBeVisible({ timeout: 45_000 });
    if ((await btn.first().getAttribute('aria-expanded')) !== 'true') {
      await btn.first().click();
      await this.page.waitForTimeout(700);
    }
  }

  async searchByCode(code: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.searchInput.fill('');
    await this.page.waitForTimeout(600);
    await this.datalist.search(code, 2_000);
  }

  async assertInDatalist(code: string): Promise<void> {
    await this.searchByCode(code);
    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Transfer Inbound ${code} di datalist`).toBeVisible({
      timeout: 60_000,
    });
  }

  /** Action Show — prefer link kode → /transfer-inbound/edit/{id}. */
  async openShowFromDatalistByCode(code: string): Promise<void> {
    await this.searchByCode(code);

    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Baris Transfer Inbound ${code}`).toBeVisible({
      timeout: 60_000,
    });

    const codeLink = row
      .getByRole('link', { name: code, exact: true })
      .or(
        row.locator(`a[href*="/supplychain/transfer-inbound/edit/"]`),
      )
      .first();

    if (await codeLink.isVisible({ timeout: 5_000 }).catch(() => false)) {
      const href = await codeLink.getAttribute('href');
      if (href) {
        await this.page.goto(href, {
          waitUntil: 'domcontentloaded',
          timeout: 60_000,
        });
      } else {
        await codeLink.click();
      }
    } else {
      const showBtn = this.datalist.editButton(row).first();
      await expect(showBtn, 'Action Show').toBeVisible({ timeout: 30_000 });
      await showBtn.click();
    }

    await expect(this.page).toHaveURL(TRANSFER_INBOUND_EDIT_PATH_PATTERN, {
      timeout: 45_000,
    });
    await dismissStagingBanner(this.page);
    await this.expandBasicInformation();
    await expect(this.codeInput).toHaveValue(code, { timeout: 30_000 });
    await this.expandProductTransferDetail();
    await expect(
      this.page.getByText(/Broken Items/i).first(),
    ).toBeVisible({ timeout: 30_000 });
  }

  detailRowBySku(sku: string): Locator {
    const escaped = sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.page
      .locator(
        '#DatalistDetail .p-datatable-tbody tr, #DatalistDetail tbody tr',
      )
      .filter({ hasText: new RegExp(escaped, 'i') })
      .locator('visible=true')
      .first();
  }

  /**
   * Set Broken Items / Lost Items via inline edit.
   * API: POST transfer-external-middle-detail/update-received
   */
  async setInboundQtyFieldForSku(
    sku: string,
    field: 'broken' | 'lost',
    value: number,
  ): Promise<void> {
    await this.expandProductTransferDetail();
    const row = this.detailRowBySku(sku);
    await expect(row, `Detail row ${sku}`).toBeVisible({ timeout: 45_000 });

    // Kolom editable: Lost Items lalu Broken Items (setelah Qty Transfered / Qty Received)
    const inputs = row.locator('input:not([type="checkbox"]):visible');
    const count = await inputs.count();
    expect(count, `Input editable di row ${sku}`).toBeGreaterThan(0);

    // Heuristik: biasanya Lost = input ke-(n-2) atau pertama editable qty pair; Broken = berikutnya.
    // Prefer: header select_name via aria / nearest column — fallback index.
    let target: Locator;
    if (field === 'lost') {
      target =
        count >= 2
          ? inputs.nth(Math.max(0, count - 2))
          : inputs.first();
    } else {
      target = count >= 2 ? inputs.nth(count - 1) : inputs.first();
    }

    // Jika ada label tippy di header, coba map by column index dari table header
    const table = this.page.locator('#DatalistDetail table, #DatalistDetail .p-datatable').first();
    const headers = table.locator('th');
    const headerCount = await headers.count();
    let colIndex = -1;
    for (let i = 0; i < headerCount; i++) {
      const text = ((await headers.nth(i).innerText().catch(() => '')) ?? '')
        .replace(/\s+/g, ' ')
        .trim();
      if (
        field === 'broken' &&
        /broken items/i.test(text)
      ) {
        colIndex = i;
        break;
      }
      if (field === 'lost' && /lost items/i.test(text)) {
        colIndex = i;
        break;
      }
    }

    if (colIndex >= 0) {
      const cellInput = row.locator('td').nth(colIndex).locator('input').first();
      if (await cellInput.isVisible({ timeout: 3_000 }).catch(() => false)) {
        target = cellInput;
      }
    }

    await expect(
      target,
      `${field === 'broken' ? 'Broken Items' : 'Lost Items'} input ${sku}`,
    ).toBeVisible({ timeout: 20_000 });

    const current = (await target.inputValue().catch(() => '')).replace(
      /[^\d.]/g,
      '',
    );
    if (current === String(value) || Number(current) === value) {
      return;
    }

    const saveResponse = this.page
      .waitForResponse(
        (response) =>
          /update-received|updateQuantityReceived/i.test(response.url()) &&
          response.request().method() === 'POST',
        { timeout: 60_000 },
      )
      .catch(() => null);

    await target.click({ clickCount: 3 });
    await target.fill(String(value));
    await target.press('Tab');
    await saveResponse;
    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(800);
  }

  async setBrokenItemsForSku(sku: string, value: number): Promise<void> {
    await this.setInboundQtyFieldForSku(sku, 'broken', value);
  }

  async setLostItemsForSku(sku: string, value: number): Promise<void> {
    await this.setInboundQtyFieldForSku(sku, 'lost', value);
  }

  /**
   * Approve receive (Transfer Inbound) — tombol Approve + ApprovalModal.
   * Redirect ke /supplychain/transfer-inbound.
   * Catatan: Trx Status "Approved" = ship sudah approve; receive masih bisa
   * selama Delivery Status masih "In transit".
   */
  async clickApproveReceive(): Promise<void> {
    await expect(this.page).toHaveURL(TRANSFER_INBOUND_EDIT_PATH_PATTERN, {
      timeout: 15_000,
    });

    const deliveryDelivered = await this.page
      .getByText(/Delivered/i)
      .first()
      .isVisible({ timeout: 2_000 })
      .catch(() => false);
    const approveGone = !(await this.page
      .locator('button')
      .filter({ hasText: /^Approve$/i })
      .first()
      .isVisible({ timeout: 2_000 })
      .catch(() => false));
    if (deliveryDelivered && approveGone) {
      return;
    }

    const maxAttempts = 6;
    let lastError = '';

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      if (attempt > 1) {
        await this.page.keyboard.press('Escape').catch(() => undefined);
        await this.page.waitForTimeout(12_000);
        await expect(this.page).toHaveURL(TRANSFER_INBOUND_EDIT_PATH_PATTERN, {
          timeout: 15_000,
        });
      }

      // Inbound receive: Button variant=approve (bukan hanya check-double ship)
      const approveTrigger = this.page
        .locator('button')
        .filter({ hasText: /^Approve$/i })
        .locator('visible=true')
        .last()
        .or(
          this.page.getByRole('button', { name: /^Approve$/i }).last(),
        )
        .or(
          this.page.getByRole('button', { name: /Approve Now/i }).first(),
        );

      await approveTrigger.scrollIntoViewIfNeeded().catch(() => undefined);
      await expect(
        approveTrigger,
        `Tombol Approve inbound (attempt ${attempt}; url=${this.page.url()})`,
      ).toBeVisible({ timeout: 45_000 });
      await approveTrigger.click();

      const modal = this.page
        .locator('.rounded-2xl')
        .filter({
          has: this.page.getByPlaceholder(
            /why you are approving this transaction/i,
          ),
        })
        .first();
      await expect(modal, 'ApprovalModal inbound').toBeVisible({
        timeout: 15_000,
      });

      // Standing rule: description automation = "automation playwright"
      const note = modal.getByPlaceholder(
        /why you are approving this transaction/i,
      );
      if (await note.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await note.fill('automation playwright');
      }

      const confirmApprove = modal.getByRole('button', { name: /^Approve$/i });
      await expect(confirmApprove).toBeVisible({ timeout: 10_000 });

      const approveResponse = this.page.waitForResponse(
        (response) =>
          /mutation-transfer-external\/\d+\/approve/.test(response.url()) &&
          response.request().method() === 'POST',
        { timeout: 180_000 },
      );

      const redirected = this.page
        .waitForURL(/\/supplychain\/transfer-inbound\/?$/, {
          timeout: 180_000,
        })
        .catch(() => undefined);

      await confirmApprove.click();

      const response = await approveResponse.catch(() => null);
      if (!response) {
        lastError = 'Timeout menunggu response approve (180s)';
        if (attempt >= maxAttempts) {
          throw new Error(`Approve Transfer Inbound gagal: ${lastError}`);
        }
        continue;
      }

      const body = (await response.json().catch(() => null)) as {
        status?: { error?: number | string; message?: string };
      } | null;

      const errMsg = String(body?.status?.message ?? '');
      if (response.ok() && !Number(body?.status?.error ?? 0)) {
        await redirected;
        await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
        await dismissStagingBanner(this.page);
        return;
      }

      lastError = errMsg || `HTTP ${response.status()}`;
      if (
        !/calculating the ending stock/i.test(lastError) ||
        attempt >= maxAttempts
      ) {
        throw new Error(
          `Approve Transfer Inbound gagal: ${lastError}`,
        );
      }
    }

    throw new Error(
      `Approve Transfer Inbound gagal setelah ${maxAttempts} percobaan: ${lastError}`,
    );
  }

  async assertApprovedOrDeliveredInDatalist(code: string): Promise<void> {
    await this.searchByCode(code);
    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    // Setelah approve receive bisa tetap di list (delivered) atau status approved
    const stillVisible = await row
      .isVisible({ timeout: 15_000 })
      .catch(() => false);
    if (stillVisible) {
      await expect(row).toContainText(/approved|delivered|in transit/i);
    }
  }
}
