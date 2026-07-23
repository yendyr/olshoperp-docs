import { Page, expect, Locator } from '@playwright/test';
import { getApiUrl, readAuthFromPage } from './company-access';
import { OlshopDatalist, OlshopFormActions, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const ACCOUNT_PAYMENT_DATALIST_PATH = '/accounting/supplier-payment';
export const ACCOUNT_PAYMENT_EDIT_PATH_PATTERN =
  /\/accounting\/supplier-payment\/edit\/\d+/;

/**
 * POM Account Payment (Supplier Payment) — FA AP.
 * Selector: tests/pom-registry/account-payment.yaml
 */
export class AccountPaymentPage {
  readonly datalist: OlshopDatalist;
  private readonly form: OlshopFormActions;
  private readonly multiselect: OlshopMultiselect;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
    this.form = new OlshopFormActions(page);
    this.multiselect = new OlshopMultiselect(page);
  }

  get codeInput(): Locator {
    return this.page
      .getByPlaceholder(/Automatically generate by system/i)
      .or(this.page.locator('#code'))
      .first();
  }

  get descriptionInput(): Locator {
    return this.page.getByPlaceholder(/Add description or notes/i);
  }

  get supplierCombobox(): Locator {
    return this.page
      .locator('#BasicInformation [aria-placeholder="Select supplier"]')
      .first();
  }

  get cashBankTrigger(): Locator {
    return this.page
      .locator('#receiveSource [aria-placeholder="Select Cash/Bank"]')
      .first();
  }

  get outstandingPiLink(): Locator {
    return this.page.getByText('Outstanding Purchase Invoice', {
      exact: true,
    });
  }

  /** Panel CashBank fixed overlay (z-index tinggi). */
  get cashBankPanel(): Locator {
    return this.page
      .locator('div.fixed')
      .filter({ has: this.page.locator('table') })
      .filter({ hasText: /Label|Bank|Cash/i })
      .last();
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(ACCOUNT_PAYMENT_DATALIST_PATH, 'link');
  }

  /**
   * Hapus draft payment automation via API agar reserved fund Cash/Bank ter-release
   * (bulk-use = available − reserved non-approved PaymentDetailFund).
   */
  async deleteAutomationDrafts(): Promise<void> {
    await this.gotoDatalist();
    const auth = await readAuthFromPage(this.page);
    const api = getApiUrl();
    if (!auth.token) {
      console.warn('[account-payment] skip deleteAutomationDrafts: no token');
      return;
    }

    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${auth.token}`,
    };

    const searches = ['automation playwright', 'PY-5TV'];
    const ids = new Set<number>();

    for (const q of searches) {
      const url =
        `${api}/accounting/supplier-payment` +
        `?draw=1&start=0&length=100` +
        `&search[value]=${encodeURIComponent(q)}`;
      const res = await this.page.request.get(url, { headers });
      if (!res.ok()) {
        console.warn(`[account-payment] list failed ${q}: HTTP ${res.status()}`);
        continue;
      }
      const body = (await res.json().catch(() => null)) as {
        data?: Array<{
          id?: number | string;
          DT_RowId?: string;
          code?: string;
          transaction_status?: string;
          transaction_status_label?: string;
          description?: string;
        }>;
      } | null;

      for (const row of body?.data ?? []) {
        const idRaw = row.id ?? row.DT_RowId?.replace(/\D/g, '');
        const id = Number(idRaw);
        if (!id) continue;
        const status = String(
          row.transaction_status_label ?? row.transaction_status ?? '',
        );
        const code = String(row.code ?? '');
        const desc = String(row.description ?? '');
        // Hanya automation / kode run hari ini — jangan hapus data bisnis lain
        const isAutomation =
          /automation\s*playwright/i.test(desc) ||
          /^PY-5TV/i.test(code) ||
          /automation\s*playwright/i.test(JSON.stringify(row));
        if (!isAutomation) continue;
        if (/approved/i.test(status)) continue;
        ids.add(id);
      }
    }

    for (const id of ids) {
      const del = await this.page.request.delete(
        `${api}/accounting/supplier-payment/${id}`,
        { headers },
      );
      const body = (await del.json().catch(() => null)) as {
        status?: { error?: number; message?: string };
      } | null;
      if (!del.ok() || body?.status?.error) {
        console.warn(
          `[account-payment] delete ${id} failed:`,
          body?.status?.message ?? del.status(),
        );
      }
    }

    console.log(
      JSON.stringify({
        deletedPaymentIds: [...ids],
        note: 'release reserved Bank BCA',
      }),
    );
    await this.page.waitForTimeout(1_000);
  }

  async openCreateAndWaitForEdit(): Promise<string> {
    await this.datalist.clickCreate('link');
    await this.page.waitForURL(ACCOUNT_PAYMENT_EDIT_PATH_PATTERN, {
      timeout: 90_000,
    });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Basic Information').catch(() => undefined);
    await expect(this.supplierCombobox).toBeVisible({ timeout: 45_000 });
    await expect(this.codeInput).not.toHaveValue('', { timeout: 45_000 });
    return (await this.codeInput.inputValue()).trim();
  }

  async selectSupplier(supplierName: string): Promise<void> {
    const combobox = this.supplierCombobox;
    await expect(combobox).toBeVisible({ timeout: 30_000 });

    const selected = (
      (await this.page
        .locator('#BasicInformation .multiselect')
        .filter({ has: combobox })
        .locator('.multiselect-single-label')
        .textContent()
        .catch(() => '')) ?? ''
    ).trim();
    if (/unbilled\s*goods/i.test(selected)) {
      return;
    }

    const saveResponse = this.page
      .waitForResponse(
        (response) =>
          /\/accounting\/supplier-payment\/\d+/.test(response.url()) &&
          ['PUT', 'POST'].includes(response.request().method()) &&
          !response.url().includes('bulk') &&
          !response.url().includes('cash-bank') &&
          !response.url().includes('detail'),
        { timeout: 90_000 },
      )
      .catch(() => null);

    await combobox.click();
    await this.page.waitForTimeout(400);
    const token = supplierName.replace(/^pt\.?\s*/i, '').trim() || supplierName;
    await combobox.fill(token);
    await this.page.waitForTimeout(1_800);

    const option = this.page
      .locator('.multiselect-option:visible')
      .filter({ hasText: /Unbilled\s*Goods/i })
      .first();
    await expect(option, `Supplier ${supplierName}`).toBeVisible({
      timeout: 45_000,
    });
    await option.click();
    await this.page.waitForTimeout(500);

    const response = await saveResponse;
    if (response) {
      const body = (await response.json().catch(() => null)) as {
        status?: { error?: number; message?: string };
      } | null;
      if (!response.ok() || body?.status?.error) {
        throw new Error(
          `Update supplier gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
        );
      }
    }
    await waitForSuccessToast(this.page, 8_000).catch(() => undefined);
    await this.page.waitForTimeout(800);
  }

  async fillDescription(text = 'automation playwright'): Promise<void> {
    if (await this.descriptionInput.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await this.descriptionInput.fill(text);
    }
  }

  async useCashBankByLabel(label: string): Promise<void> {
    await this.form
      .expandAccordion('Account Payment Source')
      .catch(() => undefined);

    const trigger = this.page
      .locator('#receiveSource .multiselect')
      .filter({
        has: this.page.locator('[aria-placeholder="Select Cash/Bank"]'),
      })
      .first();

    await expect(trigger).toBeVisible({ timeout: 30_000 });

    const labelRe = new RegExp(
      label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      'i',
    );
    const bankCell = this.page.getByText(labelRe).first();

    for (let attempt = 0; attempt < 4; attempt++) {
      if (await bankCell.isVisible().catch(() => false)) break;
      await trigger.click({ force: true });
      try {
        await expect(bankCell).toBeVisible({ timeout: 8_000 });
        break;
      } catch {
        // Toggle / click-outside bisa menutup — coba lagi
        await this.page.waitForTimeout(500);
      }
    }

    await expect(bankCell, `Cash/Bank label ${label}`).toBeVisible({
      timeout: 30_000,
    });

    // Scope ke panel visible saja (hindari sibling v-show=false)
    const openPanel = this.page
      .locator('div.fixed.drop-shadow-md')
      .filter({ visible: true })
      .filter({ hasText: labelRe })
      .first();

    const cashSearch = openPanel.getByRole('searchbox').first();
    if (await cashSearch.isVisible().catch(() => false)) {
      await cashSearch.fill(label);
      await this.page.waitForTimeout(1_500);
      await expect(bankCell).toBeVisible({ timeout: 30_000 });
    }

    const row = openPanel.locator('tr').filter({ hasText: labelRe }).first();
    await expect(row, `Baris Cash/Bank ${label}`).toBeVisible({
      timeout: 45_000,
    });

    const checkbox = row.locator('input[type="checkbox"]').first();
    await expect(checkbox).toBeVisible({ timeout: 15_000 });
    if (!(await checkbox.isChecked().catch(() => false))) {
      await checkbox.check({ force: true });
    }
    await this.page.waitForTimeout(500);

    const useResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        return /\/cash-bank-account\/bulk-use/.test(response.url());
      },
      { timeout: 90_000 },
    );

    const useBtn = openPanel
      .locator('button.tooltip-use')
      .first()
      .or(
        this.page
          .locator('button.tooltip-use')
          .filter({ visible: true })
          .filter({ hasText: /^Use$/i })
          .first(),
      );

    await expect(useBtn, 'Use Cash/Bank').toBeVisible({ timeout: 20_000 });
    await useBtn.click();

    const response = await useResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
    } | null;
    if (!response.ok() || body?.status?.error) {
      throw new Error(
        `Use Cash/Bank gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }
    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(1_000);
    await this.page.keyboard.press('Escape').catch(() => undefined);
    await this.page.waitForTimeout(500);
  }

  /**
   * Samakan Amount di Account Payment Source dengan Paid Amount di detail PI.
   * Wajib sebelum approve (total source = total detail).
   */
  async syncSourceAmountWithPiDetail(piCode: string): Promise<void> {
    await this.form
      .expandAccordion('Detail Account Payment')
      .catch(() => undefined);
    await this.form
      .expandAccordion('Account Payment Source')
      .catch(() => undefined);

    const detailRow = this.page
      .locator('#detailPayment tr')
      .filter({ visible: true })
      .filter({ hasText: piCode })
      .first();
    await expect(detailRow, `Detail PI ${piCode}`).toBeVisible({
      timeout: 30_000,
    });

    const paidInput = detailRow.locator('input[type="text"], input.p-inputtext').first();
    let paidAmount = '';
    if (await paidInput.isVisible({ timeout: 3_000 }).catch(() => false)) {
      paidAmount = (await paidInput.inputValue()).trim();
    }
    if (!paidAmount) {
      const paidCell = detailRow
        .locator('td')
        .filter({ hasText: /\d{1,3}(\.\d{3})*,\d{2}/ })
        .first();
      paidAmount = ((await paidCell.textContent()) ?? '').trim();
    }
    if (!paidAmount) {
      throw new Error(`Tidak menemukan paid amount untuk ${piCode}`);
    }

    await this.setSourceAmount(paidAmount);
  }

  /** Inline-edit amount di kolom AMOUNT tabel Account Payment Source. */
  async setSourceAmount(amount: string): Promise<void> {
    await this.form
      .expandAccordion('Account Payment Source')
      .catch(() => undefined);

    const row = this.page
      .locator('#receiveSource tbody tr')
      .filter({ visible: true })
      .filter({ hasText: /Bank BCA|1-10015/i })
      .first();
    await expect(row, 'Baris payment source').toBeVisible({
      timeout: 30_000,
    });

    const input = row.locator('input[type="text"][lang="nl"]').first();

    const putResponse = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'PUT' &&
        /supplier-payment-detail-fund/.test(response.url()),
      { timeout: 90_000 },
    );

    await expect(input, 'Input Amount source').toBeVisible({ timeout: 15_000 });
    await input.scrollIntoViewIfNeeded();
    await input.click({ clickCount: 3 });
    await input.fill(amount);
    await input.press('Enter');

    const response = await putResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
    } | null;
    if (!response.ok() || body?.status?.error) {
      throw new Error(
        `Update amount source gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await waitForSuccessToast(this.page, 8_000).catch(() => undefined);
    await this.page.waitForTimeout(800);
  }

  async useOutstandingPurchaseInvoice(piCode: string): Promise<void> {
    await this.form
      .expandAccordion('Detail Account Payment')
      .catch(() => undefined);

    const link = this.page
      .getByText(/Outstanding Purchase Invoice/i)
      .first();
    await expect(link).toBeVisible({ timeout: 45_000 });

    const openPanel = this.page
      .locator('div.fixed')
      .filter({ visible: true })
      .filter({ has: this.page.getByRole('searchbox') })
      .filter({ has: this.page.locator('button.tooltip-use') })
      .last();

    for (let attempt = 0; attempt < 4; attempt++) {
      if (await openPanel.isVisible().catch(() => false)) break;
      await link.click();
      try {
        await expect(openPanel).toBeVisible({ timeout: 10_000 });
        break;
      } catch {
        await this.page.waitForTimeout(500);
      }
    }

    await expect(openPanel, 'Outstanding PI modal').toBeVisible({
      timeout: 30_000,
    });

    const search = openPanel.getByRole('searchbox').first();
    if (await search.isVisible().catch(() => false)) {
      await search.fill(piCode);
      await this.page.waitForTimeout(2_000);
    }

    const row = openPanel.locator('tr').filter({ hasText: piCode }).first();
    await expect(row, `Outstanding PI ${piCode}`).toBeVisible({
      timeout: 60_000,
    });

    const checkbox = row.locator('input[type="checkbox"]').first();
    await expect(checkbox).toBeVisible({ timeout: 15_000 });
    if (!(await checkbox.isChecked().catch(() => false))) {
      await checkbox.check({ force: true });
    }
    await this.page.waitForTimeout(400);

    const useResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        return /supplier-payment-detail-bulk/.test(response.url());
      },
      { timeout: 90_000 },
    );

    const useBtn = openPanel.locator('button.tooltip-use').first();
    await expect(useBtn, 'Use Outstanding PI').toBeVisible({ timeout: 20_000 });
    await useBtn.click();

    const response = await useResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
    } | null;
    if (!response.ok() || body?.status?.error) {
      throw new Error(
        `Use Outstanding PI gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }
    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(1_000);
  }

  async assertPaymentHasBankAndPi(
    bankLabel: string,
    piCode: string,
  ): Promise<void> {
    // Hindari teks di modal CashBank (v-show=false) — pakai yang visible di form
    await expect(
      this.page
        .getByText(new RegExp(bankLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'))
        .filter({ visible: true })
        .first(),
    ).toBeVisible({ timeout: 30_000 });
    await expect(
      this.page
        .getByText(piCode, { exact: false })
        .filter({ visible: true })
        .first(),
    ).toBeVisible({ timeout: 30_000 });
  }

  get openRadio(): Locator {
    return this.page.locator('#open');
  }

  /** Tombol Approve di sidebar form (ikon check-double). */
  get formApproveButton(): Locator {
    return this.page
      .locator('button')
      .filter({
        has: this.page.locator(
          '.fa-check-double, [data-icon="check-double"]',
        ),
      })
      .first();
  }

  /** Radio Open → auto POST update (transaction_status=open). */
  async setOpenAndWait(): Promise<void> {
    await expect(this.openRadio).toBeEnabled({ timeout: 30_000 });

    const updateResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        const url = response.url();
        return (
          /\/accounting\/supplier-payment\/\d+/.test(url) &&
          !url.includes('/approve') &&
          !url.includes('bulk') &&
          !url.includes('detail')
        );
      },
      { timeout: 90_000 },
    );

    await this.openRadio.check({ force: true });

    const response = await updateResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
    } | null;

    if (!response.ok() || body?.status?.error) {
      throw new Error(
        `Set Open Account Payment gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await expect(this.openRadio).toBeChecked({ timeout: 15_000 });
    await expect(this.formApproveButton).toBeVisible({ timeout: 30_000 });
    await this.page.waitForTimeout(1_000);
  }

  async approveFromForm(
    description = 'automation playwright',
  ): Promise<{ message?: string }> {
    const approveBtn = this.formApproveButton;
    await expect(approveBtn, 'Tombol Approve di form').toBeVisible({
      timeout: 45_000,
    });

    const approveResponsePromise = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'POST' &&
        /\/accounting\/supplier-payment\/\d+\/approve/.test(response.url()),
      { timeout: 120_000 },
    );

    await approveBtn.click();

    const descField = this.page.getByPlaceholder(
      /approving this transaction|Add information/i,
    );
    if (await descField.isVisible({ timeout: 8_000 }).catch(() => false)) {
      await descField.fill(description);
      const dialogApprove = this.page
        .locator('[role="dialog"]')
        .getByRole('button', { name: /^Approve$/i })
        .last();
      await expect(dialogApprove).toBeVisible({ timeout: 15_000 });
      await dialogApprove.click();
    }

    const outcome = await Promise.race([
      approveResponsePromise.then(async (response) => {
        const body = (await response.json().catch(() => null)) as {
          status?: { error?: number; message?: string };
        } | null;
        if (!response.ok() || body?.status?.error) {
          throw new Error(
            `Approve Account Payment gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
          );
        }
        return { message: body?.status?.message };
      }),
      this.page
        .waitForURL(/\/accounting\/supplier-payment\/?$/, { timeout: 120_000 })
        .then(() => ({ message: 'redirected to datalist after approve' })),
    ]);

    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(800);
    return outcome;
  }

  async assertApprovedInDatalist(code: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(code, 2_000);
    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Payment ${code} harus tampil`).toBeVisible({
      timeout: 45_000,
    });
    await expect(row).toContainText(/approved/i);
  }
}
