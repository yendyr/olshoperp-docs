import { Page, expect, Locator } from '@playwright/test';
import path from 'path';
import { mkdirSync } from 'fs';
import { getApiUrl, readAuthFromPage } from './company-access';
import { OlshopDatalist, OlshopFormActions, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const ACCOUNT_RECEIVE_DATALIST_PATH = '/accounting/customer-payment';
export const ACCOUNT_RECEIVE_EDIT_PATH_PATTERN =
  /\/accounting\/customer-payment\/edit\/\d+/;

/**
 * POM Account Receive (Customer Payment) — create/edit + datalist bulk approve.
 * Selector: tests/pom-registry/account-receive.yaml
 *
 * PENTING (bulk approve): DataTablesV3 menghapus selectedRowsIds saat baris keluar
 * dari filter — jangan ganti search antar-centang.
 */
export class AccountReceivePage {
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
      .locator('#BasicInformation')
      .getByRole('textbox')
      .first();
  }

  get descriptionInput(): Locator {
    return this.page.getByPlaceholder(/Add description or notes/i);
  }

  get customerCombobox(): Locator {
    return this.page
      .locator('#BasicInformation [aria-placeholder="Select Customer"]')
      .first();
  }

  get availableSiLink(): Locator {
    return this.page.getByText('Available Sales Invoice', { exact: true });
  }

  get cashBankTrigger(): Locator {
    return this.page
      .locator('#receiveDestination [aria-placeholder="Select Cash/Bank"]')
      .first();
  }

  get openRadio(): Locator {
    return this.page.locator('#open');
  }

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

  get bulkApproveButton(): Locator {
    return this.page.locator('button.bulk-approve').first();
  }

  get selectInfo(): Locator {
    return this.page.locator('.select-item').filter({ hasText: /row/i }).first();
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(ACCOUNT_RECEIVE_DATALIST_PATH, 'auto');
  }

  /** Hapus draft AR automation agar reserved fund Cash/Bank ter-release. */
  async deleteAutomationDrafts(): Promise<void> {
    await this.gotoDatalist();
    const auth = await readAuthFromPage(this.page);
    const api = getApiUrl();
    if (!auth.token) {
      console.warn('[account-receive] skip deleteAutomationDrafts: no token');
      return;
    }

    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${auth.token}`,
    };

    const searches = ['automation playwright', 'RC-5TV', 'Supplier China'];
    const ids = new Set<number>();

    for (const q of searches) {
      const url =
        `${api}/accounting/customer-payment` +
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
        const id = Number(row.id ?? row.DT_RowId?.replace(/\D/g, ''));
        if (!id) continue;
        const status = String(
          row.transaction_status_label ?? row.transaction_status ?? '',
        );
        const desc = String(row.description ?? '');
        const code = String(row.code ?? '');
        const isAutomation =
          /automation\s*playwright/i.test(desc) || /^RC-5TV/i.test(code);
        if (!isAutomation || /approved/i.test(status)) continue;
        ids.add(id);
      }
    }

    for (const id of ids) {
      await this.page.request.delete(
        `${api}/accounting/customer-payment/${id}`,
        { headers },
      );
    }

    if (ids.size > 0) {
      console.log(
        JSON.stringify({
          deletedReceiveIds: [...ids],
          note: 'release reserved Cash/Bank + SI prepared qty',
        }),
      );
      await this.page.waitForTimeout(1_500);
    }
  }

  /** Create auto-POST default values → redirect edit. */
  async openCreateAndWaitForEdit(): Promise<string> {
    await this.datalist.clickCreate('auto');
    await this.page.waitForURL(ACCOUNT_RECEIVE_EDIT_PATH_PATTERN, {
      timeout: 90_000,
    });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Basic Information').catch(() => undefined);
    await expect(this.customerCombobox).toBeVisible({ timeout: 45_000 });

    // Tunggu kode ter-generate (FormField disabled / bukan selalu #code)
    const codeFromUrl = this.page.url().match(/edit\/(\d+)/)?.[1];
    await this.page.waitForTimeout(1_000);

    let code = '';
    for (let i = 0; i < 20; i++) {
      const raw =
        (await this.codeInput.inputValue().catch(() => '')) ||
        ((await this.page
          .locator('#BasicInformation')
          .getByText(/^RC-/i)
          .first()
          .textContent()
          .catch(() => '')) ?? '');
      code = raw.trim();
      if (/^RC-/i.test(code)) break;
      await this.page.waitForTimeout(500);
    }

    if (!/^RC-/i.test(code)) {
      // Fallback: ambil dari API by id
      if (codeFromUrl) {
        const auth = await readAuthFromPage(this.page);
        const api = getApiUrl();
        const res = await this.page.request.get(
          `${api}/accounting/customer-payment/${codeFromUrl}`,
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${auth.token}`,
            },
          },
        );
        const body = (await res.json().catch(() => null)) as {
          data?: { code?: string };
        } | null;
        code = String(body?.data?.code ?? '').trim();
      }
    }

    if (!/^RC-/i.test(code)) {
      throw new Error(
        `Kode Account Receive belum ter-generate (url id=${codeFromUrl ?? '-'})`,
      );
    }
    return code;
  }

  async selectCustomer(customerLabel: string): Promise<void> {
    const combobox = this.customerCombobox;
    await expect(combobox).toBeVisible({ timeout: 30_000 });

    const pattern = new RegExp(
      customerLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      'i',
    );
    const selected = (
      (await this.multiselect.selectedLabel(combobox).catch(() => '')) ?? ''
    ).trim();
    if (pattern.test(selected)) return;

    const queries = [
      customerLabel,
      customerLabel.replace(/^pt\.?\s*/i, '').trim(),
      customerLabel.split(/\s+/).slice(-2).join(' '),
    ].filter((q, i, arr) => Boolean(q) && arr.indexOf(q) === i);

    for (const query of queries) {
      await this.multiselect.open(combobox);
      await combobox.fill('');
      await combobox.fill(query).catch(async () => {
        await combobox.pressSequentially(query, { delay: 40 });
      });
      // CustomerSelect debounce 300ms + SWRV fetch
      await this.page.waitForTimeout(2_500);

      // append-to-body: opsi di body; group General/Platform
      const option = this.page
        .locator('.multiselect-option:visible, [role="option"]:visible')
        .filter({ hasText: pattern })
        .first();
      if (await option.isVisible({ timeout: 8_000 }).catch(() => false)) {
        const saveResponse = this.page
          .waitForResponse(
            (response) =>
              /\/accounting\/customer-payment\/\d+/.test(response.url()) &&
              ['PUT', 'POST'].includes(response.request().method()) &&
              !response.url().includes('detail') &&
              !response.url().includes('bulk') &&
              !response.url().includes('cash-bank'),
            { timeout: 90_000 },
          )
          .catch(() => null);

        await option.click();
        await this.page.waitForTimeout(500);

        const response = await saveResponse;
        if (response) {
          const body = (await response.json().catch(() => null)) as {
            status?: { error?: number; message?: string };
          } | null;
          if (!response.ok() || body?.status?.error) {
            throw new Error(
              `Update customer gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
            );
          }
        }
        await waitForSuccessToast(this.page, 8_000).catch(() => undefined);
        return;
      }
    }

    throw new Error(`Customer tidak ditemukan: ${customerLabel}`);
  }

  async selectCurrency(code = 'IDR'): Promise<void> {
    const combobox = this.page
      .locator('#BasicInformation [aria-placeholder="Select currency"]')
      .first();
    if (!(await combobox.isVisible({ timeout: 5_000 }).catch(() => false))) {
      return;
    }

    const selected = (
      (await this.multiselect.selectedLabel(combobox).catch(() => '')) ?? ''
    ).trim();
    if (new RegExp(code, 'i').test(selected)) return;

    await this.multiselect.open(combobox);
    await combobox.fill(code);
    await this.page.waitForTimeout(1_000);
    const option = this.page
      .locator('.multiselect-option:visible, [role="option"]:visible')
      .filter({ hasText: new RegExp(code, 'i') })
      .first();
    if (await option.isVisible({ timeout: 5_000 }).catch(() => false)) {
      const saveResponse = this.page
        .waitForResponse(
          (response) =>
            /\/accounting\/customer-payment\/\d+/.test(response.url()) &&
            ['PUT', 'POST'].includes(response.request().method()) &&
            !response.url().includes('detail') &&
            !response.url().includes('bulk'),
          { timeout: 90_000 },
        )
        .catch(() => null);
      await option.click();
      await saveResponse;
      await waitForSuccessToast(this.page, 5_000).catch(() => undefined);
    }
  }

  async fillDescription(text = 'automation playwright'): Promise<void> {
    if (
      await this.descriptionInput
        .isVisible({ timeout: 5_000 })
        .catch(() => false)
    ) {
      await this.descriptionInput.fill(text);
    }
  }

  async clickSaveAllAndWait(): Promise<void> {
    await this.page.waitForTimeout(3_500);

    const updateResponse = this.page.waitForResponse(
      (response) => {
        if (!['PUT', 'POST'].includes(response.request().method())) return false;
        const url = response.url();
        return (
          /\/accounting\/customer-payment\/\d+/.test(url) &&
          !url.includes('detail') &&
          !url.includes('bulk') &&
          !url.includes('/approve') &&
          !url.includes('cash-bank')
        );
      },
      { timeout: 90_000 },
    );

    await this.form.clickSaveAll();
    const response = await updateResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
    } | null;
    if (!response.ok() || body?.status?.error) {
      const message = body?.status?.message ?? `HTTP ${response.status()}`;
      if (/duplicate request/i.test(message)) {
        await this.page.waitForTimeout(3_500);
        return;
      }
      throw new Error(`Save All AR gagal: ${message}`);
    }
    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(800);
  }

  /**
   * Modal Available Sales Invoice → ceklis 1+ SI → Use (bulk full amount).
   * Jika `siCodes` kosong: pilih baris pertama yang punya kode SI- dan outstanding > 0.
   */
  async useAvailableSalesInvoices(siCodes: string[] = []): Promise<string[]> {
    await this.form
      .expandAccordion('Detail Account Receive')
      .catch(() => undefined);

    const link = this.availableSiLink;
    await expect(link).toBeVisible({ timeout: 45_000 });

    const outstandingLoad = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' &&
        /outstanding-customer-invoice/.test(response.url()),
      { timeout: 90_000 },
    );

    await link.click();
    const loadResponse = await outstandingLoad.catch(() => null);
    await this.page.waitForTimeout(1_500);

    // Scope panel dari tombol Use yang muncul di modal OutstandingSalesInvoice
    const useBtn = this.page
      .locator('button.tooltip-use')
      .filter({ visible: true })
      .first();
    await expect(useBtn, 'Use Available SI').toBeVisible({ timeout: 30_000 });

    const panel = this.page
      .locator('div')
      .filter({ visible: true })
      .filter({ has: useBtn })
      .filter({ has: this.page.locator('table tbody tr') })
      .last();

    await expect(panel, 'Available SI modal').toBeVisible({ timeout: 15_000 });

    if (loadResponse) {
      const body = (await loadResponse.json().catch(() => null)) as {
        recordsTotal?: number;
      } | null;
      console.log(
        JSON.stringify({
          outstandingSiTotal: body?.recordsTotal ?? null,
        }),
      );
    }

    const used: string[] = [];

    const pickRow = async (hint?: string) => {
      if (hint) {
        const search = panel
          .getByRole('searchbox')
          .or(panel.getByPlaceholder(/find something/i))
          .first();
        if (await search.isVisible().catch(() => false)) {
          await search.fill(hint);
          await this.page.waitForTimeout(2_000);
        }
        return panel.locator('tbody tr').filter({ hasText: hint }).first();
      }

      const rows = panel
        .locator('tbody tr')
        .filter({ visible: true })
        .filter({ hasText: /SI-/i })
        .filter({ hasNotText: /no data available/i });
      const count = await rows.count();
      for (let i = 0; i < count; i++) {
        const row = rows.nth(i);
        const text = ((await row.textContent()) ?? '').replace(/\s+/g, ' ');
        // Skip baris outstanding 0: cari amount IDR > 0 selain yang hanya Prepared
        const amounts = [...text.matchAll(/([\d.]+,\d{2})/g)].map((m) =>
          Number(m[1].replace(/\./g, '').replace(',', '.')),
        );
        const positive = amounts.filter((n) => n > 0);
        if (positive.length >= 1 && /SI-[A-Z0-9]+/i.test(text)) {
          // Prefer baris yang punya outstanding non-zero: biasanya ada 2 amount (total + outstanding)
          if (positive.length >= 2 || !/Prepared:\s*IDR\s*[\d.]+,\d{2}[\s\S]*Paid:\s*IDR\s*0/i.test(text)) {
            return row;
          }
        }
      }
      return rows.first();
    };

    const targets = siCodes.length > 0 ? siCodes : [undefined];
    for (const hint of targets) {
      const row = await pickRow(hint);
      await expect(
        row,
        hint
          ? `Outstanding SI ${hint}`
          : 'Harus ada minimal 1 SI outstanding',
      ).toBeVisible({ timeout: 60_000 });

      const code =
        ((await row.textContent()) ?? '').match(/SI-[A-Z0-9]+/i)?.[0] ??
        hint ??
        '';
      if (code) used.push(code);

      const checkbox = row.locator('input[type="checkbox"]').first();
      await expect(checkbox).toBeVisible({ timeout: 15_000 });
      if (!(await checkbox.isChecked().catch(() => false))) {
        await checkbox.check({ force: true });
      }
      await this.page.waitForTimeout(400);
    }

    const useResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        return /customer-payment-detail-bulk/.test(response.url());
      },
      { timeout: 120_000 },
    );

    await useBtn.click();

    const response = await useResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
    } | null;
    if (!response.ok() || body?.status?.error) {
      throw new Error(
        `Use Available SI gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }
    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(1_500);
    await this.page.keyboard.press('Escape').catch(() => undefined);
    await this.page.waitForTimeout(500);
    return used.filter(Boolean);
  }

  async useCashBankByLabel(label: string): Promise<void> {
    await this.form
      .expandAccordion('Receiving Destination')
      .catch(() => undefined);

    const trigger = this.page
      .locator('#receiveDestination [aria-placeholder="Select Cash/Bank"]')
      .first();

    await expect(trigger).toBeVisible({ timeout: 30_000 });
    await trigger.click({ force: true });
    await this.page.waitForTimeout(800);

    const labelRe = new RegExp(
      label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      'i',
    );

    const openPanel = this.page
      .locator('div.fixed')
      .filter({ visible: true })
      .filter({ has: this.page.locator('table') })
      .filter({ hasText: /Bank|Cash|Label|Account/i })
      .last();

    await expect(openPanel, 'Cash/Bank modal').toBeVisible({ timeout: 30_000 });

    const cashSearch = openPanel.getByRole('searchbox').first();
    if (await cashSearch.isVisible().catch(() => false)) {
      await cashSearch.fill(label);
      await this.page.waitForTimeout(1_500);
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

    const useBtn = openPanel.locator('button.tooltip-use').first();
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
   * Samakan amount Receiving Destination (prefer Bank BCA 001) dengan paid amount detail SI.
   * Hapus baris fund lain agar total source = total detail.
   * List fund memakai endpoint `/primevue` (bukan DataTables klasik).
   */
  async syncDestinationAmountWithSiDetail(siHint?: string): Promise<void> {
    await this.form
      .expandAccordion('Detail Account Receive')
      .catch(() => undefined);
    await this.form
      .expandAccordion('Receiving Destination')
      .catch(() => undefined);

    let detailRow = this.page
      .locator('#detailReceive tbody tr, [id*="detailReceive"] tbody tr')
      .filter({ visible: true })
      .filter({ hasText: /SI-/i })
      .first();

    if (siHint) {
      detailRow = this.page
        .locator('tr')
        .filter({ visible: true })
        .filter({ hasText: siHint })
        .first();
    }

    await expect(detailRow, 'Detail SI di AR').toBeVisible({ timeout: 30_000 });

    const paidInput = detailRow
      .locator('input[type="text"], input.p-inputtext')
      .first();
    let paidAmount = '';
    if (await paidInput.isVisible({ timeout: 3_000 }).catch(() => false)) {
      paidAmount = (await paidInput.inputValue()).trim();
    }
    if (!paidAmount) {
      const paidCell = detailRow
        .locator('td')
        .filter({ hasText: /\d{1,3}(\.\d{3})*,\d{2}/ })
        .last();
      paidAmount = ((await paidCell.textContent()) ?? '')
        .replace(/IDR/gi, '')
        .trim();
    }
    if (!paidAmount) {
      throw new Error('Tidak menemukan paid amount di detail AR');
    }

    const paidNumeric = paidAmount
      .replace(/\./g, '')
      .replace(/,/g, '.')
      .replace(/[^\d.]/g, '');
    const paymentId = this.page.url().match(/edit\/(\d+)/)?.[1];
    if (!paymentId) throw new Error('AR edit id tidak ditemukan');

    const auth = await readAuthFromPage(this.page);
    const api = getApiUrl();
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${auth.token}`,
    };

    const listFunds = async () => {
      const listRes = await this.page.request.get(
        `${api}/accounting/customer-payment/${paymentId}/customer-payment-detail-fund/primevue`,
        {
          headers,
          params: {
            draw: 1,
            start: 0,
            length: 50,
            id_menu: paymentId,
            with_deleted: false,
            'search[value]': '',
            'search[regex]': false,
          },
        },
      );
      const body = (await listRes.json().catch(() => null)) as {
        data?: Array<{
          id?: number | string;
          DT_RowId?: string;
          type?: string;
          coa_bank_formatted?: string;
          bank_account_bank_name_formatted?: string;
        }>;
        status?: { error?: number; message?: string };
      } | null;
      if (!listRes.ok()) {
        throw new Error(
          `List fund gagal: HTTP ${listRes.status()} ${body?.status?.message ?? ''}`,
        );
      }
      return body?.data ?? [];
    };

    const funds = await listFunds();
    let keepId: number | null = null;
    for (const fund of funds) {
      const id = Number(fund.id ?? String(fund.DT_RowId ?? '').replace(/\D/g, ''));
      if (!id) continue;
      const label = `${fund.coa_bank_formatted ?? ''} ${fund.bank_account_bank_name_formatted ?? ''}`;
      if (/Bank BCA 001|1-10015/i.test(label)) {
        keepId = id;
        continue;
      }
      await this.page.request.delete(
        `${api}/accounting/customer-payment/${paymentId}/customer-payment-detail-fund/${id}`,
        { headers },
      );
    }

    if (!keepId) {
      const funds2 = await listFunds();
      keepId = Number(
        funds2[0]?.id ?? String(funds2[0]?.DT_RowId ?? '').replace(/\D/g, ''),
      );
    }

    if (!keepId) {
      throw new Error('Tidak ada Receiving Destination fund untuk di-sync');
    }

    const putRes = await this.page.request.put(
      `${api}/accounting/customer-payment/${paymentId}/customer-payment-detail-fund/${keepId}`,
      {
        headers: { ...headers, 'Content-Type': 'application/json' },
        data: { fund_amount: paidNumeric, source_type: 'Cash/Bank' },
      },
    );
    const putBody = (await putRes.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
    } | null;
    if (!putRes.ok() || putBody?.status?.error) {
      throw new Error(
        `Sync amount destination gagal: ${putBody?.status?.message ?? `HTTP ${putRes.status()}`}`,
      );
    }

    await this.page.reload({ waitUntil: 'domcontentloaded' });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Detail Account Receive').catch(() => undefined);
    await this.form.expandAccordion('Receiving Destination').catch(() => undefined);
    await this.page.waitForTimeout(1_000);
  }

  async setOpenAndWait(): Promise<void> {
    await expect(this.openRadio).toBeEnabled({ timeout: 30_000 });

    const updateResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        const url = response.url();
        return (
          /\/accounting\/customer-payment\/\d+/.test(url) &&
          !url.includes('/approve') &&
          !url.includes('bulk') &&
          !url.includes('detail') &&
          !url.includes('cash-bank')
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
        `Set Open Account Receive gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
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
        /\/accounting\/customer-payment\/\d+\/approve/.test(response.url()),
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
            `Approve Account Receive gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
          );
        }
        return { message: body?.status?.message };
      }),
      this.page
        .waitForURL(/\/accounting\/customer-payment\/?$/, { timeout: 120_000 })
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
    await expect(row, `AR ${code} harus tampil`).toBeVisible({
      timeout: 45_000,
    });
    await expect(row).toContainText(/approved/i);
  }

  /**
   * Ambil kode journal auto dari kolom Journal di datalist AR (link ke /journal/edit/:id).
   */
  async getLinkedJournalCodeFromDatalist(arCode: string): Promise<string> {
    await this.gotoDatalist();
    await this.datalist.search(arCode, 2_000);
    const row = this.page.getByRole('row').filter({ hasText: arCode }).first();
    await expect(row, `AR ${arCode}`).toBeVisible({ timeout: 45_000 });
    await expect(row).toContainText(/approved/i);

    const journalLink = row
      .locator('a[href*="/accounting/journal/edit/"]')
      .first();
    await expect(
      journalLink,
      `Link journal untuk ${arCode} (auto-journal setelah approve)`,
    ).toBeVisible({ timeout: 45_000 });

    const raw = ((await journalLink.textContent()) ?? '').trim();
    const code = raw.match(/[A-Z]{2,}-\w+/i)?.[0] ?? raw;
    if (!code || code === '-' || code.length < 3) {
      throw new Error(
        `Journal code tidak terbaca dari datalist AR ${arCode}: "${raw}"`,
      );
    }
    return code;
  }

  async assertReceiveHasBankAndSi(
    bankLabel: string,
    siCode: string,
  ): Promise<void> {
    await expect(
      this.page
        .getByText(
          new RegExp(bankLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
        )
        .filter({ visible: true })
        .first(),
    ).toBeVisible({ timeout: 30_000 });
    await expect(
      this.page
        .getByText(siCode, { exact: false })
        .filter({ visible: true })
        .first(),
    ).toBeVisible({ timeout: 30_000 });
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
