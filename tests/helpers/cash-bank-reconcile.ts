import { Page, expect, Locator } from '@playwright/test';
import { readFileSync } from 'fs';
import { getApiUrl, readAuthFromPage } from './company-access';
import { OlshopDatalist, OlshopFormActions, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const CASH_BANK_RECONCILE_DATALIST_PATH = '/accounting/cash-bank-reconcile';
export const CASH_BANK_RECONCILE_CREATE_PATH =
  '/accounting/cash-bank-reconcile/create';
export const CASH_BANK_RECONCILE_EDIT_PATH_PATTERN =
  /\/accounting\/cash-bank-reconcile\/edit\/\d+/;

/**
 * POM Cash/Bank Reconcile (CBR) — FA.
 * Selector: tests/pom-registry/cash-bank-reconcile.yaml
 */
export class CashBankReconcilePage {
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

  get periodInput(): Locator {
    return this.page
      .getByPlaceholder(/Choose Period Date/i)
      .or(
        this.page.locator(
          'input.olshoperp-datepicker-input, input.p-datepicker-input',
        ),
      )
      .first();
  }

  get cashBankCombobox(): Locator {
    return this.multiselect.comboboxByPlaceholderFragment('Cash Bank Account');
  }

  get cashBankMultiselectRoot(): Locator {
    return this.page
      .locator('.multiselect.custom-multiselect, .multiselect')
      .filter({
        has: this.page.locator(
          '[aria-placeholder*="Cash Bank"], [placeholder*="Cash Bank"]',
        ),
      })
      .or(
        this.page
          .locator('.multiselect')
          .filter({ hasText: /Choose Cash Bank Account/i }),
      )
      .first();
  }

  get openRadio(): Locator {
    return this.page.locator('#open');
  }

  get draftRadio(): Locator {
    return this.page.locator('#draft');
  }

  get saveAndNextButton(): Locator {
    return this.page
      .getByRole('button', { name: /Save\s*&\s*Next/i })
      .or(this.page.locator('button').filter({ hasText: /Save\s*&\s*Next/i }))
      .first();
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(CASH_BANK_RECONCILE_DATALIST_PATH, 'auto');
  }

  /** Hapus draft/open automation agar period bank tidak overlap. */
  async deleteAutomationDrafts(): Promise<void> {
    await this.gotoDatalist();
    const auth = await readAuthFromPage(this.page);
    const api = getApiUrl();
    if (!auth.token) {
      console.warn('[cash-bank-reconcile] skip deleteAutomationDrafts: no token');
      return;
    }

    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${auth.token}`,
    };

    const searches = ['automation playwright', 'BR-5TW', 'Bank BCA 001'];
    const ids = new Set<number>();

    for (const q of searches) {
      const url =
        `${api}/accounting/cash-bank-reconcile` +
        `?draw=1&start=0&length=100` +
        `&search[value]=${encodeURIComponent(q)}`;
      const res = await this.page.request.get(url, { headers });
      if (!res.ok()) continue;

      const body = (await res.json().catch(() => null)) as {
        data?: Array<{
          id?: number | string;
          DT_RowId?: string;
          code?: string;
          description?: string;
          transaction_status?: string;
          transaction_status_label?: string;
        }>;
      } | null;

      for (const row of body?.data ?? []) {
        const id = Number(row.id ?? String(row.DT_RowId ?? '').replace(/\D/g, ''));
        if (!id) continue;
        const status = String(
          row.transaction_status_label ?? row.transaction_status ?? '',
        );
        const desc = String(row.description ?? '');
        const code = String(row.code ?? '');
        const isAutomation =
          /automation\s*playwright/i.test(desc) || /^BR-5TW/i.test(code);
        if (!isAutomation || /approved/i.test(status)) continue;
        ids.add(id);
      }
    }

    for (const id of ids) {
      await this.page.request.delete(
        `${api}/accounting/cash-bank-reconcile/${id}`,
        { headers },
      );
    }

    if (ids.size > 0) {
      console.log(
        JSON.stringify({
          deletedReconcileIds: [...ids],
          note: 'release overlapping period for same cash/bank',
        }),
      );
      await this.page.waitForTimeout(1_000);
    }
  }

  async openCreateForm(): Promise<void> {
    await this.datalist.clickCreate('auto');
    await this.page.waitForURL(/\/accounting\/cash-bank-reconcile\/create/, {
      timeout: 60_000,
    });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Basic Information').catch(() => undefined);
    await expect(this.periodInput).toBeVisible({ timeout: 45_000 });
    await expect(this.cashBankCombobox).toBeVisible({ timeout: 30_000 });
  }

  /**
   * Pilih Period range via PrimeVue DatePicker (selectionMode=range).
   * dayStart/dayEnd = nomor hari di bulan pertama panel (multi-calendars = 2 bulan).
   */
  async setPeriodByCalendarDays(
    dayStart: number,
    dayEnd: number = dayStart,
  ): Promise<void> {
    await expect(this.periodInput).toBeVisible({ timeout: 30_000 });
    await this.periodInput.click();

    const panel = this.page
      .locator('.p-datepicker-panel')
      .filter({ visible: true })
      .first();
    await expect(panel, 'Period datepicker panel').toBeVisible({
      timeout: 15_000,
    });

    // multi-calendars: pakai table bulan pertama saja (hindari day dobel di bulan berikutnya)
    const monthTable = panel.locator('table').first();

    const dayInMonth = (day: number) =>
      monthTable.getByLabel(String(day), { exact: true }).first();

    await expect(dayInMonth(dayStart), `Day ${dayStart}`).toBeVisible({
      timeout: 15_000,
    });
    await dayInMonth(dayStart).click();
    await this.page.waitForTimeout(400);

    await expect(dayInMonth(dayEnd), `Day ${dayEnd}`).toBeVisible({
      timeout: 15_000,
    });
    await dayInMonth(dayEnd).click();
    await this.page.waitForTimeout(800);

    await this.page.keyboard.press('Escape').catch(() => undefined);
    await this.page.waitForTimeout(400);

    const shown = (await this.periodInput.inputValue().catch(() => '')).trim();
    if (!shown || shown.length < 8) {
      throw new Error(
        `Period belum terisi setelah pilih kalender (day ${dayStart}-${dayEnd})`,
      );
    }
  }

  async selectCashBankAccount(label: string): Promise<void> {
    const combobox = this.cashBankCombobox;
    await expect(combobox, 'Cash Bank Account combobox').toBeVisible({
      timeout: 30_000,
    });

    const pattern = new RegExp(
      label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      'i',
    );

    // Klik placeholder / combobox area
    const placeholder = this.page.getByText('Choose Cash Bank Account', {
      exact: true,
    });
    if (await placeholder.isVisible().catch(() => false)) {
      await placeholder.click({ force: true });
    } else {
      await combobox.click({ force: true });
    }
    await this.page.waitForTimeout(400);

    await combobox.fill('').catch(() => undefined);
    await combobox.fill(label).catch(async () => {
      await combobox.pressSequentially(label, { delay: 40 });
    });
    // Multiselect :delay="700"
    await this.page.waitForTimeout(1_800);

    const option = this.page
      .locator('.multiselect-option:visible, [role="option"]:visible')
      .filter({ hasText: pattern })
      .first();
    await expect(option, `Opsi Cash Bank ${label}`).toBeVisible({
      timeout: 45_000,
    });
    await option.click();
    await this.page.waitForTimeout(800);

    const root = this.page
      .locator('.multiselect')
      .filter({ hasText: pattern })
      .first();
    await expect(root, `Cash Bank terisi ${label}`).toBeVisible({
      timeout: 15_000,
    });
    await expect(root).not.toContainText(/Choose Cash Bank Account/i);
  }

  async fillDescription(text = 'automation playwright'): Promise<void> {
    if (
      await this.descriptionInput.isVisible({ timeout: 5_000 }).catch(() => false)
    ) {
      await this.descriptionInput.fill(text);
    }
  }

  async clickSaveAndNextAndWaitForEdit(): Promise<string> {
    const createResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        const url = response.url();
        return (
          /\/accounting\/cash-bank-reconcile\/?$/.test(
            url.replace(/\?.*$/, ''),
          ) || /\/accounting\/cash-bank-reconcile$/.test(url.split('?')[0])
        );
      },
      { timeout: 90_000 },
    );

    await expect(this.saveAndNextButton).toBeVisible({ timeout: 30_000 });
    await this.saveAndNextButton.click();

    const response = await createResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
      data?: { id?: number; code?: string };
    } | null;

    if (!response.ok() || body?.status?.error) {
      throw new Error(
        `Create CBR gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await this.page.waitForURL(CASH_BANK_RECONCILE_EDIT_PATH_PATTERN, {
      timeout: 90_000,
    });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Basic Information').catch(() => undefined);
    await this.page.waitForTimeout(1_000);

    let code = (await this.codeInput.inputValue().catch(() => '')).trim();
    if (!/^BR-/i.test(code)) {
      code = String(body?.data?.code ?? '').trim();
    }
    if (!/^BR-/i.test(code)) {
      const shown = await this.page
        .getByText(/^BR-/i)
        .first()
        .textContent()
        .catch(() => '');
      code = (shown ?? '').trim();
    }
    if (!/^BR-/i.test(code)) {
      throw new Error('Kode BR tidak ditemukan setelah Save & Next');
    }
    return code;
  }

  async setOpenAndWait(): Promise<void> {
    if (await this.openRadio.isChecked().catch(() => false)) {
      return;
    }

    await expect(this.openRadio).toBeEnabled({ timeout: 30_000 });

    const updateResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'PUT') return false;
        const url = response.url();
        return (
          /\/accounting\/cash-bank-reconcile\/\d+/.test(url) &&
          !url.includes('/approve')
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
        `Set Open CBR gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await expect(this.openRadio).toBeChecked({ timeout: 15_000 });
    await this.page.waitForTimeout(800);
  }

  async assertInDatalist(
    code: string,
    opts?: { status?: RegExp; bankHint?: string },
  ): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(code, 2_000);
    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `CBR ${code} harus tampil`).toBeVisible({
      timeout: 45_000,
    });
    if (opts?.status) {
      await expect(row).toContainText(opts.status);
    }
    if (opts?.bankHint) {
      await expect(row).toContainText(
        new RegExp(
          opts.bankHint.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
          'i',
        ),
      );
    }
  }

  async openEditFromDatalistByCode(code: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(code, 2_000);
    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Baris CBR ${code}`).toBeVisible({ timeout: 45_000 });

    const editBtn = this.datalist.editButton(row).first();
    await expect(editBtn).toBeVisible({ timeout: 30_000 });
    await editBtn.click();

    await this.page.waitForURL(CASH_BANK_RECONCILE_EDIT_PATH_PATTERN, {
      timeout: 60_000,
    });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Basic Information').catch(() => undefined);
    await this.page.waitForTimeout(1_000);
  }

  async expandBankStatement(): Promise<void> {
    await this.form.expandAccordion('Bank Statement').catch(() => undefined);
    const section = this.page.locator('#BankStatement');
    await expect(section).toBeVisible({ timeout: 30_000 });
    await section.scrollIntoViewIfNeeded();
    // Tunggu DataTables Bank Statement + tombol Import
    await expect(
      section.getByText(/Import/i).first(),
    ).toBeVisible({ timeout: 45_000 });
    await this.page.waitForTimeout(1_000);
  }

  get bankStatementFileInput(): Locator {
    // Input di sibling ImportFileTable / BankStatement root (bukan selalu descendant #BankStatement)
    return this.page.locator('input[type="file"][accept*="sheet"]').first();
  }

  /**
   * Upload file bank statement (xlsx).
   * Prefer API (stabil); UI setInputFiles sebagai opsi sekunder di spec.
   */
  async importBankStatementFile(filePath: string): Promise<void> {
    await this.expandBankStatement();

    // Buka panel Import History bila perlu (has_import_history)
    const importBtn = this.page
      .locator('#BankStatement')
      .getByText(/^Import$/i)
      .first();
    if (await importBtn.isVisible().catch(() => false)) {
      await importBtn.click();
      await this.page.waitForTimeout(800);
    }

    const input = this.bankStatementFileInput;
    await expect(input, 'File input import (.xlsx)').toBeAttached({
      timeout: 30_000,
    });

    const uploadResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        return /general-ledger-bank-statement\/upload/.test(response.url());
      },
      { timeout: 60_000 },
    );

    await input.setInputFiles(filePath);

    const response = await uploadResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
    } | null;
    if (!response.ok() || body?.status?.error) {
      throw new Error(
        `Import bank statement gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await waitForSuccessToast(this.page, 15_000).catch(() => undefined);
    await this.page.waitForTimeout(2_000);
  }

  /**
   * Upload via API (sama endpoint FE), poll progress, reload form.
   */
  async importBankStatementViaApi(filePath: string): Promise<void> {
    const reconcileId = this.page.url().match(/edit\/(\d+)/)?.[1];
    if (!reconcileId) throw new Error('CBR edit id tidak ditemukan');

    const auth = await readAuthFromPage(this.page);
    const api = getApiUrl();
    const res = await this.page.request.post(
      `${api}/accounting/cash-bank-reconcile/${reconcileId}/general-ledger-bank-statement/upload?type=general`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        multipart: {
          file_attachment: {
            name: filePath.split(/[/\\]/).pop() ?? 'bank-statement.xlsx',
            mimeType:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            buffer: readFileSync(filePath),
          },
        },
      },
    );
    const body = (await res.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
      data?: unknown;
    } | null;
    if (!res.ok() || body?.status?.error) {
      throw new Error(
        `API import bank statement gagal: ${body?.status?.message ?? `HTTP ${res.status()}`}`,
      );
    }

    for (let i = 0; i < 45; i++) {
      const prog = await this.page.request.get(
        `${api}/accounting/cash-bank-reconcile-detail/${reconcileId}/import-progress`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
        },
      );
      const progBody = (await prog.json().catch(() => null)) as {
        data?: { percent?: number | null; on_queue?: boolean };
      } | null;
      const percent = progBody?.data?.percent;
      const onQueue = progBody?.data?.on_queue;
      if ((percent == null || percent >= 100) && !onQueue) break;
      await this.page.waitForTimeout(1_000);
    }

    await this.page.reload({ waitUntil: 'domcontentloaded' });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Basic Information').catch(() => undefined);
    await this.expandBankStatement();
  }

  async assertBankStatementRow(opts: {
    dateHint?: string | RegExp;
    amountHint?: string | RegExp;
    descriptionHint?: string | RegExp;
  }): Promise<void> {
    await this.expandBankStatement();

    const section = this.page.locator('#BankStatement');
    await section.scrollIntoViewIfNeeded();

    // WAJIB scope ke #BankStatement saja — jangan `table tbody tr` global
    // (Internal Transaction juga punya 16.000 + Not Reconciled).
    const row = section
      .locator('tbody tr')
      .filter({ visible: true })
      .filter({
        hasText: opts.amountHint ?? opts.dateHint ?? /16\.?000|16000/i,
      })
      .first();

    for (let i = 0; i < 40; i++) {
      if (await row.isVisible().catch(() => false)) break;
      await this.page.waitForTimeout(1_500);
      if (i % 5 === 4) {
        await this.page.reload({ waitUntil: 'domcontentloaded' });
        await dismissStagingBanner(this.page);
        await this.expandBankStatement();
      }
    }

    await expect(
      row,
      'Baris Bank Statement setelah import (scope #BankStatement)',
    ).toBeVisible({ timeout: 60_000 });

    if (opts.dateHint) {
      await expect(row).toContainText(opts.dateHint);
    }
    if (opts.amountHint) {
      await expect(row).toContainText(opts.amountHint);
    }
    if (opts.descriptionHint) {
      await expect(row).toContainText(opts.descriptionHint);
    }
  }
}
