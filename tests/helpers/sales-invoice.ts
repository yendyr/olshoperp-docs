import { Page, expect, Locator } from '@playwright/test';
import { getApiUrl, readAuthFromPage } from './company-access';
import { OlshopDatalist, OlshopFormActions, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const SALES_INVOICE_DATALIST_PATH = '/accounting/customer-invoice';
export const SALES_INVOICE_EDIT_PATH_PATTERN =
  /\/accounting\/customer-invoice\/edit\/\d+/;

/**
 * POM Sales Invoice (Customer Invoice) — FA AR.
 * Selector: tests/pom-registry/sales-invoice.yaml
 */
export class SalesInvoicePage {
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

  get customerCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose Customer');
  }

  get outstandingSoLink(): Locator {
    return this.page.getByText('Outstanding Sales Order', { exact: true });
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(SALES_INVOICE_DATALIST_PATH, 'link');
  }

  /** Hapus draft SI automation agar outstanding SO qty ter-release. */
  async deleteAutomationDrafts(): Promise<void> {
    await this.gotoDatalist();
    const auth = await readAuthFromPage(this.page);
    const api = getApiUrl();
    if (!auth.token) return;

    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${auth.token}`,
    };

    const searches = ['automation playwright', 'SI-5TVB', 'Supplier China'];
    const ids = new Set<number>();

    for (const q of searches) {
      const url =
        `${api}/accounting/customer-invoice` +
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
          transaction_status_label?: string;
          transaction_status?: string;
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
          /automation\s*playwright/i.test(desc) ||
          /^SI-5TVB/i.test(code);
        if (!isAutomation || /approved/i.test(status)) continue;
        ids.add(id);
      }
    }

    for (const id of ids) {
      await this.page.request.delete(`${api}/accounting/customer-invoice/${id}`, {
        headers,
      });
    }

    if (ids.size > 0) {
      console.log(
        JSON.stringify({
          deletedInvoiceIds: [...ids],
          note: 'release outstanding SO SKUs',
        }),
      );
      await this.page.waitForTimeout(1_500);
    }
  }

  /** Create auto-POST default values → redirect edit. */
  async openCreateAndWaitForEdit(): Promise<string> {
    await this.datalist.clickCreate('link');
    await this.page.waitForURL(SALES_INVOICE_EDIT_PATH_PATTERN, {
      timeout: 90_000,
    });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Basic Information').catch(() => undefined);
    await expect(this.customerCombobox).toBeVisible({ timeout: 45_000 });
    await expect(this.codeInput).not.toHaveValue('', { timeout: 45_000 });
    return (await this.codeInput.inputValue()).trim();
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
    if (pattern.test(selected)) {
      return;
    }

    const queries = [
      customerLabel,
      customerLabel.replace(/^supplier\s*/i, '').trim(),
      'china',
      'supplier china',
    ].filter((q, i, arr) => Boolean(q) && arr.indexOf(q) === i);

    for (const query of queries) {
      await this.multiselect.open(combobox);
      await combobox.fill('');
      await combobox.fill(query).catch(async () => {
        await combobox.pressSequentially(query, { delay: 40 });
      });
      await this.page.waitForTimeout(1_500);

      const option = this.page
        .locator('.multiselect-option:visible')
        .filter({ hasText: pattern })
        .first();
      if (await option.isVisible({ timeout: 5_000 }).catch(() => false)) {
        const saveResponse = this.page
          .waitForResponse(
            (response) =>
              /\/accounting\/customer-invoice\/\d+/.test(response.url()) &&
              ['PUT', 'POST'].includes(response.request().method()) &&
              !response.url().includes('detail') &&
              !response.url().includes('bulk'),
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

  async fillDescription(text = 'automation playwright'): Promise<void> {
    if (await this.descriptionInput.isVisible({ timeout: 5_000 }).catch(() => false)) {
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
          /\/accounting\/customer-invoice\/\d+/.test(url) &&
          !url.includes('detail') &&
          !url.includes('bulk') &&
          !url.includes('/approve')
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
      throw new Error(`Save All SI gagal: ${message}`);
    }
    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(800);
  }

  async useOutstandingSalesOrderSkus(skus: string[]): Promise<void> {
    await this.form
      .expandAccordion('Sales Invoice Detail')
      .catch(() => undefined);

    const link = this.outstandingSoLink;
    await expect(link).toBeVisible({ timeout: 45_000 });

    const invoiceId = this.page.url().match(/edit\/(\d+)/)?.[1];
    if (!invoiceId) {
      throw new Error('Sales Invoice edit URL tidak ditemukan');
    }

    const panel = this.page.locator('div.fixed[child-modal]').filter({ visible: true });

    if (await panel.isVisible().catch(() => false)) {
      await link.click();
      await expect(panel).toBeHidden({ timeout: 10_000 }).catch(() => undefined);
      await this.page.waitForTimeout(400);
    }

    const outstandingLoad = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'GET') return false;
        return new RegExp(
          `customer-invoice-detail/${invoiceId}/outstanding-sales-order`,
        ).test(response.url());
      },
      { timeout: 90_000 },
    );

    await link.click();
    await expect(panel, 'Outstanding SO modal').toBeVisible({ timeout: 30_000 });

    const loadResponse = await outstandingLoad.catch(() => null);
    if (loadResponse) {
      const loadBody = (await loadResponse.json().catch(() => null)) as {
        recordsTotal?: number;
      } | null;
      if ((loadBody?.recordsTotal ?? 0) === 0) {
        await this.page.waitForTimeout(2_000);
      }
    } else {
      await this.page.waitForTimeout(2_500);
    }

    const search = panel.getByRole('searchbox').first();
    if (await search.isVisible().catch(() => false)) {
      await search.fill('');
      await this.page.waitForTimeout(1_500);
    }

    for (const sku of skus) {
      let row = panel.locator('tbody tr').filter({ hasText: sku }).first();

      if (!(await row.isVisible().catch(() => false))) {
        if (await search.isVisible().catch(() => false)) {
          await search.fill('');
          await this.page.waitForTimeout(400);
          await search.fill(sku);
          await this.page.waitForTimeout(2_000);
        }
        row = panel.locator('tbody tr').filter({ hasText: sku }).first();
      }

      await expect(
        row,
        `Outstanding SO baris ${sku} harus ada (cek SO outstanding customer)`,
      ).toBeVisible({
        timeout: 60_000,
      });

      const checkbox = row.locator('input[type="checkbox"]').first();
      await expect(checkbox).toBeVisible({ timeout: 15_000 });
      if (!(await checkbox.isChecked().catch(() => false))) {
        await checkbox.check({ force: true });
      }
      await this.page.waitForTimeout(400);
    }

    const detailReload = this.page
      .waitForResponse(
        (response) =>
          response.request().method() === 'GET' &&
          /customer-invoice-detail/.test(response.url()),
        { timeout: 120_000 },
      )
      .catch(() => null);

    const useResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        return /bulk-use-outstanding-sales-order/.test(response.url());
      },
      { timeout: 120_000 },
    );

    const useBtn = panel.locator('button.tooltip-use').first();
    await expect(useBtn, 'Use Outstanding SO').toBeVisible({ timeout: 20_000 });
    await useBtn.click();

    const response = await useResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
    } | null;
    if (!response.ok() || body?.status?.error) {
      throw new Error(
        `Use Outstanding SO gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }
    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await detailReload;
    await this.page.waitForTimeout(1_500);
    await this.page.keyboard.press('Escape').catch(() => undefined);
    await this.page.waitForTimeout(500);
  }

  async assertSkusInDetail(skus: string[]): Promise<void> {
    await this.form
      .expandAccordion('Sales Invoice Detail')
      .catch(() => undefined);

    const detailTable = this.page
      .locator('#customerInvoiceDetail')
      .locator('tbody tr')
      .filter({ visible: true });

    for (const sku of skus) {
      await expect(
        detailTable.filter({ hasText: sku }).first(),
        `Detail SI harus memuat ${sku}`,
      ).toBeVisible({ timeout: 45_000 });
    }
  }

  async assertInvoiceInDatalist(code: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(code, 2_000);
    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `SI ${code} harus tampil di datalist`).toBeVisible({
      timeout: 45_000,
    });
  }

  get openRadio(): Locator {
    return this.page.locator('#open');
  }

  /** Tombol Approve di form (ikon check-double). */
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

  async openEditFromDatalistByCode(code: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(code, 2_000);
    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Baris SI ${code}`).toBeVisible({ timeout: 45_000 });

    const editBtn = this.datalist.editButton(row).first();
    await expect(editBtn).toBeVisible({ timeout: 30_000 });
    await editBtn.click();

    await this.page.waitForURL(SALES_INVOICE_EDIT_PATH_PATTERN, {
      timeout: 45_000,
    });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Basic Information').catch(() => undefined);
  }

  async setOpenAndWait(): Promise<void> {
    // Sudah Open → skip
    if (await this.openRadio.isChecked().catch(() => false)) {
      await expect(this.formApproveButton).toBeVisible({ timeout: 30_000 });
      return;
    }

    await expect(this.openRadio).toBeEnabled({ timeout: 30_000 });

    const updateResponse = this.page.waitForResponse(
      (response) => {
        if (!['PUT', 'POST'].includes(response.request().method())) return false;
        const url = response.url();
        return (
          /\/accounting\/customer-invoice\/\d+/.test(url) &&
          !url.includes('/approve') &&
          !url.includes('detail') &&
          !url.includes('bulk')
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
        `Set Open Sales Invoice gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
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
    await expect(approveBtn, 'Tombol Approve di form SI').toBeVisible({
      timeout: 45_000,
    });

    const approveResponsePromise = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'POST' &&
        /\/accounting\/customer-invoice\/\d+\/approve/.test(response.url()),
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
        .or(
          this.page.locator(
            '[role="dialog"] button.bg-success, [role="dialog"] button[class*="success"]',
          ),
        )
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
            `Approve Sales Invoice gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
          );
        }
        return { message: body?.status?.message };
      }),
      this.page
        .waitForURL(/\/accounting\/customer-invoice\/?$/, { timeout: 120_000 })
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
    await expect(row, `SI ${code} harus tampil`).toBeVisible({
      timeout: 45_000,
    });
    await expect(row).toContainText(/approved/i);
  }
}
