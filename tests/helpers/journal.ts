import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopFormActions, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const JOURNAL_DATALIST_PATH = '/accounting/journal';
export const JOURNAL_EDIT_PATH_PATTERN = /\/accounting\/journal\/edit\/\d+/;

/**
 * POM Journal — FA.
 * Selector: tests/pom-registry/journal.yaml
 */
export class JournalPage {
  readonly datalist: OlshopDatalist;
  private readonly form: OlshopFormActions;
  private readonly multiselect: OlshopMultiselect;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
    this.form = new OlshopFormActions(page);
    this.multiselect = new OlshopMultiselect(page);
  }

  get codeInput(): Locator {
    return this.page.locator('#code');
  }

  get descriptionInput(): Locator {
    return this.page.locator('#description');
  }

  get storeMultiselect(): Locator {
    return this.page.locator('#store_id').or(
      this.page
        .locator('#BasicInformation .p-multiselect')
        .filter({
          has: this.page.getByText(/Choose Store|Store/i),
        })
        .or(this.page.locator('#BasicInformation .p-multiselect').first()),
    );
  }

  /** Lebih stabil: .p-multiselect di bawah label Store. */
  get storePrime(): Locator {
    return this.page
      .locator('#BasicInformation')
      .locator('.p-multiselect')
      .first();
  }

  get openRadio(): Locator {
    return this.page.locator('#open');
  }

  get draftRadio(): Locator {
    return this.page.locator('#draft');
  }

  get accountCombobox(): Locator {
    return this.page.locator(
      '#LedgerDetail [aria-placeholder="Choose Account"]',
    );
  }

  get debitInput(): Locator {
    return this.page.locator('#debit_create');
  }

  get creditInput(): Locator {
    return this.page.locator('#credit_create');
  }

  get ledgerSaveButton(): Locator {
    return this.page
      .locator('#LedgerDetail')
      .locator('.col-span-1 button[type="button"]')
      .last();
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(JOURNAL_DATALIST_PATH, 'link');
  }

  async assertDatalistShell(): Promise<void> {
    await expect(this.datalist.createButton('link')).toBeVisible({
      timeout: 30_000,
    });
    await expect(this.datalist.table).toBeVisible({ timeout: 30_000 });
  }

  /**
   * Create → auto-POST draft → land on edit with Ledger Detail.
   */
  async openCreateAndWaitForEdit(): Promise<string> {
    await this.datalist.clickCreate('link');

    await this.page.waitForURL(JOURNAL_EDIT_PATH_PATTERN, { timeout: 90_000 });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Basic Information');
    await this.form.expandAccordion('Ledger Detail');

    await expect(this.codeInput).not.toHaveValue('', { timeout: 45_000 });
    await expect(this.debitInput).toBeVisible({ timeout: 45_000 });

    return (await this.codeInput.inputValue()).trim();
  }

  private async selectPrimeStoreOption(searchTerm: string): Promise<void> {
    const multiselect = this.storePrime;
    await expect(multiselect).toBeVisible({ timeout: 20_000 });
    await multiselect.click();
    await this.page.waitForTimeout(400);

    const filterInput = this.page
      .locator(
        [
          '.p-multiselect-overlay input[type="text"]',
          '.p-multiselect-filter-container input[type="text"]',
          'input.p-multiselect-filter',
        ].join(', '),
      )
      .locator('visible=true')
      .first();

    if (await filterInput.isVisible().catch(() => false)) {
      await filterInput.fill(searchTerm);
      await this.page.waitForTimeout(800);
    }

    const byRole = this.page.getByRole('option', {
      name: new RegExp(searchTerm, 'i'),
    });
    const byCss = this.page
      .locator(
        '.p-multiselect-option:visible, .p-multiselect-items .p-multiselect-item:visible, [role="option"]:visible',
      )
      .filter({ hasText: new RegExp(searchTerm, 'i') })
      .first();

    const option = (await byRole.first().isVisible().catch(() => false))
      ? byRole.first()
      : byCss;

    await expect(option, `Store "${searchTerm}"`).toBeVisible({
      timeout: 45_000,
    });
    await option.click({ force: true });
    await this.page.waitForTimeout(300);
    await this.page.keyboard.press('Escape').catch(() => undefined);
    await this.page.waitForTimeout(200);
  }

  async selectStores(storeNames: string[]): Promise<void> {
    for (const name of storeNames) {
      const already = await this.page
        .locator('#BasicInformation .p-chip, #BasicInformation .p-multiselect-token')
        .filter({ hasText: new RegExp(name, 'i') })
        .count()
        .catch(() => 0);

      if (already > 0) continue;

      await this.selectPrimeStoreOption(name);
    }

    for (const name of storeNames) {
      await expect(
        this.page
          .locator('#BasicInformation')
          .getByText(new RegExp(name, 'i'))
          .first(),
      ).toBeVisible({ timeout: 15_000 });
    }
  }

  async fillDescription(text = 'automation playwright'): Promise<void> {
    await expect(this.descriptionInput).toBeVisible({ timeout: 15_000 });
    await this.descriptionInput.fill(text);
  }

  async addLedgerLine(data: {
    account: string;
    debit?: string;
    credit?: string;
    description?: string;
  }): Promise<void> {
    await expect(this.accountCombobox).toBeVisible({ timeout: 30_000 });
    await this.multiselect.selectOption(this.accountCombobox, data.account, {
      exact: false,
      typeToFilter: data.account,
    });
    await this.page.waitForTimeout(400);

    if (data.debit) {
      await this.debitInput.click({ clickCount: 3 });
      await this.debitInput.fill(data.debit);
      await this.debitInput.blur();
    }
    if (data.credit) {
      await this.creditInput.click({ clickCount: 3 });
      await this.creditInput.fill(data.credit);
      await this.creditInput.blur();
    }
    if (data.description) {
      await this.page.locator('#description_create').fill(data.description);
    }

    const saveResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        const path = new URL(response.url()).pathname.replace(/\/$/, '');
        return /\/accounting\/journal-detail$/.test(path);
      },
      { timeout: 90_000 },
    );

    await expect(this.ledgerSaveButton).toBeVisible({ timeout: 15_000 });
    await this.ledgerSaveButton.click();

    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
    } | null;

    if (!response.ok() || body?.status?.error) {
      throw new Error(
        `Save ledger gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await waitForSuccessToast(this.page, 5_000).catch(() => undefined);
    await this.page.waitForTimeout(600);
  }

  async setOpenAndWait(): Promise<void> {
    await expect(this.openRadio).toBeEnabled({ timeout: 30_000 });

    const updateResponse = this.page.waitForResponse(
      (response) => {
        const method = response.request().method();
        if (!['PUT', 'POST'].includes(method)) return false;
        return /\/accounting\/journal\/\d+/.test(response.url());
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
        `Set Open gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await expect(this.openRadio).toBeChecked({ timeout: 15_000 });
  }

  async assertInDatalist(code: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(code, 1_500);
    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Journal ${code} harus tampil`).toBeVisible({
      timeout: 45_000,
    });
  }

  async openEditFromDatalistByCode(code: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(code, 2_000);
    const row = this.rowByCode(code);
    await expect(row, `Baris Journal ${code}`).toBeVisible({ timeout: 45_000 });

    const editBtn = this.datalist.editButton(row).first();
    await expect(editBtn).toBeVisible({ timeout: 30_000 });
    await editBtn.click();

    await this.page.waitForURL(JOURNAL_EDIT_PATH_PATTERN, { timeout: 45_000 });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Basic Information').catch(() => undefined);
    await this.form.expandAccordion('Ledger Detail').catch(() => undefined);
  }

  async assertApprovedInDatalist(code: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(code, 2_000);
    const row = this.rowByCode(code);
    await expect(row, `Journal ${code} harus tampil`).toBeVisible({
      timeout: 45_000,
    });
    await expect(row).toContainText(/approved/i);
  }

  /**
   * TYPE di datalist = transaction_reference_text (Payment from Customer / Payment to Supplier).
   * UI sering truncate (ellipsis) → cocokkan prefix saja.
   */
  async assertTypeInDatalist(code: string, typeText: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(code, 2_000);
    const row = this.rowByCode(code);
    await expect(row, `Journal ${code}`).toBeVisible({ timeout: 45_000 });

    // Truncate di datalist: "Payment from Custome..." — pakai ≥12 char pertama
    const prefix = typeText.slice(0, Math.min(18, typeText.length));
    await expect(row).toContainText(
      new RegExp(prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
    );
  }

  async assertTransactionReferenceOnForm(expectedRef: string): Promise<void> {
    await this.form.expandAccordion('Basic Information').catch(() => undefined);
    const refInput = this.page.locator('#transaction_reference_code');
    await expect(refInput, 'Transaction Reference').toBeVisible({
      timeout: 30_000,
    });
    await expect(refInput).toHaveValue(
      new RegExp(expectedRef.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
    );
  }

  /** Ledger Detail — baris COA cash/bank (mis. Bank BCA 001 / 1-10015). */
  async assertLedgerHasAccount(accountHint: string): Promise<void> {
    await this.form.expandAccordion('Ledger Detail').catch(() => undefined);
    const hintRe = new RegExp(
      accountHint.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      'i',
    );
    const row = this.page
      .locator('#LedgerDetail tbody tr, [id*="LedgerDetail"] tbody tr, table tbody tr')
      .filter({ visible: true })
      .filter({ hasText: hintRe })
      .first();
    await expect(
      row,
      `Ledger harus memuat akun ${accountHint}`,
    ).toBeVisible({ timeout: 45_000 });
  }

  rowByCode(code: string): Locator {
    return this.page.getByRole('row').filter({ hasText: code }).first();
  }

  /**
   * Approve dari datalist depan: search → klik action Approve di baris → confirm modal.
   */
  async approveFromDatalist(
    code: string,
    description = 'automation playwright',
  ): Promise<{ message?: string; statusText?: string }> {
    await this.gotoDatalist();
    await this.datalist.search(code, 2_000);

    const row = this.rowByCode(code);
    await expect(row, `Baris Journal ${code}`).toBeVisible({ timeout: 45_000 });

    const approveBtn = row.locator('button.approve-button, button.tooltip-approve').first();
    await expect(approveBtn, `Tombol Approve untuk ${code}`).toBeVisible({
      timeout: 30_000,
    });

    const approveResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        const url = response.url();
        return (
          url.includes('/bulk-approve') ||
          /\/accounting\/journal\/\d+\/approve/.test(url)
        );
      },
      { timeout: 120_000 },
    );

    await approveBtn.click();

    // Modal BulkApproveDialog / ApprovalModal
    const descField = this.page.getByPlaceholder(
      /approving this transaction|Add information/i,
    );
    if (await descField.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await descField.fill(description);
    }

    const confirmApprove = this.page
      .getByRole('button', { name: /^Approve$/i })
      .last();
    await expect(confirmApprove).toBeVisible({ timeout: 15_000 });
    await confirmApprove.click();

    const response = await approveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
      data?: {
        error_count?: number;
        error_details?: Array<{ message?: string }>;
        success_count?: number;
      };
    } | null;

    if (!response.ok() || body?.status?.error) {
      const detail =
        body?.data?.error_details?.[0]?.message ??
        body?.status?.message ??
        `HTTP ${response.status()}`;
      throw new Error(`Approve Journal ${code} gagal: ${detail}`);
    }

    if ((body?.data?.error_count ?? 0) > 0) {
      const detail =
        body?.data?.error_details?.[0]?.message ?? 'bulk approve error';
      throw new Error(`Approve Journal ${code} gagal: ${detail}`);
    }

    await waitForSuccessToast(this.page, 15_000).catch(() => undefined);
    await this.page.waitForTimeout(1_500);

    // Refresh search — status harus Approved
    await this.datalist.search(code, 2_000);
    const rowAfter = this.rowByCode(code);
    await expect(rowAfter).toBeVisible({ timeout: 45_000 });
    const statusText = ((await rowAfter.textContent()) ?? '').trim();

    return {
      message: body?.status?.message,
      statusText,
    };
  }
}
