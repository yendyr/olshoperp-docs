import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopFormActions, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const PURCHASE_INVOICE_DATALIST_PATH = '/accounting/supplier-invoice';
export const PURCHASE_INVOICE_EDIT_PATH_PATTERN =
  /\/accounting\/supplier-invoice\/edit\/\d+/;

/**
 * POM Purchase Invoice (Supplier Invoice) — FA AP.
 * Selector: tests/pom-registry/purchase-invoice.yaml
 */
export class PurchaseInvoicePage {
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

  get supplierCombobox(): Locator {
    return this.page
      .locator('#BasicInformation [aria-placeholder="Choose Supplier"]')
      .or(
        this.page
          .locator('#BasicInformation')
          .getByText(/^Supplier$/i)
          .locator('..')
          .locator('.multiselect [role="combobox"], .multiselect-search')
          .first(),
      )
      .first();
  }

  get inboundTransactionLink(): Locator {
    return this.page.getByText('Inbound Transaction', { exact: true });
  }

  get outstandingModal(): Locator {
    return this.page.locator('[child-modal]');
  }

  get draftRadio(): Locator {
    return this.page.locator('#draft');
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(PURCHASE_INVOICE_DATALIST_PATH, 'link');
  }

  /**
   * Create → mungkin auto-submit default → edit, atau stay create.
   */
  async openCreateForm(): Promise<'create' | 'edit'> {
    await this.datalist.clickCreate('link');

    const raced = await Promise.race([
      this.page
        .waitForURL(PURCHASE_INVOICE_EDIT_PATH_PATTERN, { timeout: 90_000 })
        .then(() => 'edit' as const),
      this.page
        .waitForURL(/\/accounting\/supplier-invoice\/create$/, {
          timeout: 90_000,
        })
        .then(() => 'create' as const),
    ]);

    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Basic Information').catch(() => undefined);

    // Tunggu Basic Information siap (supplier field / code)
    await expect(
      this.page.locator('#BasicInformation').first(),
    ).toBeVisible({ timeout: 45_000 });
    await this.page.waitForTimeout(1_000);
    return raced;
  }

  async selectSupplier(supplierName: string): Promise<void> {
    const combobox = this.page
      .locator('#BasicInformation [aria-placeholder="Choose Supplier"]')
      .first();
    await expect(combobox, 'Choose Supplier').toBeVisible({ timeout: 30_000 });

    const selected = (
      (await this.page
        .locator('#BasicInformation .multiselect')
        .filter({ has: combobox })
        .locator('.multiselect-single-label')
        .textContent()
        .catch(() => '')) ?? ''
    ).trim();
    if (/^PT\.?\s*Supplier\s*IDR$/i.test(selected)) {
      return;
    }

    await combobox.click();
    await this.page.waitForTimeout(400);
    // API filter: q=IDR → "PT. Supplier IDR"
    await combobox.fill('IDR');
    await this.page.waitForTimeout(1_800);

    const exact = this.page
      .locator('.multiselect-option:visible')
      .filter({ hasText: /^PT\.?\s*Supplier\s*IDR$/i })
      .first();
    const fallback = this.page
      .locator('.multiselect-option:visible')
      .filter({ hasText: /PT\.?\s*Supplier\s*IDR/i })
      .filter({ hasNotText: /Foreign|002/i })
      .first();

    const option = (await exact.isVisible().catch(() => false))
      ? exact
      : fallback;

    await expect(option, `Supplier "${supplierName}" → PT. Supplier IDR`).toBeVisible({
      timeout: 30_000,
    });
    await option.click();
    await this.page.waitForTimeout(1_000);
  }

  async fillDescription(text = 'automation playwright'): Promise<void> {
    await expect(this.descriptionInput).toBeVisible({ timeout: 15_000 });
    await this.descriptionInput.fill(text);
  }

  async clickSaveAndNextAndWaitForEdit(): Promise<string> {
    const saveResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        const path = new URL(response.url()).pathname.replace(/\/$/, '');
        return /\/accounting\/supplier-invoice$/.test(path);
      },
      { timeout: 90_000 },
    );

    await this.form.clickSaveAndNext();

    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
    } | null;

    if (!response.ok() || body?.status?.error) {
      throw new Error(
        `Save Purchase Invoice gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await this.page.waitForURL(PURCHASE_INVOICE_EDIT_PATH_PATTERN, {
      timeout: 45_000,
    });
    await waitForSuccessToast(this.page, 5_000).catch(() => undefined);
    await dismissStagingBanner(this.page);
    await this.page.reload({ waitUntil: 'domcontentloaded' });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Basic Information').catch(() => undefined);
    await expect(this.codeInput).not.toHaveValue('', { timeout: 45_000 });
    return (await this.codeInput.inputValue()).trim();
  }

  /**
   * Pastikan ada di edit dengan supplier terisi (create path atau edit setelah autosave).
   */
  async ensureEditWithSupplier(supplierName: string): Promise<string> {
    await this.openCreateForm();
    await this.selectSupplier(supplierName);
    await this.fillDescription('automation playwright');

    // Autosave create sering redirect ke edit sebelum Save & Next diklik
    if (PURCHASE_INVOICE_EDIT_PATH_PATTERN.test(this.page.url())) {
      await this.clickSaveAllAndWait();
      await expect(this.codeInput).not.toHaveValue('', { timeout: 30_000 });
      return (await this.codeInput.inputValue()).trim();
    }

    return this.clickSaveAndNextAndWaitForEdit();
  }

  async openInboundTransactionModal(): Promise<void> {
    // Section Purchase Invoice Detail
    await this.page
      .getByText('Purchase Invoice Detail', { exact: false })
      .first()
      .scrollIntoViewIfNeeded()
      .catch(() => undefined);

    await expect(this.inboundTransactionLink).toBeVisible({ timeout: 45_000 });
    await this.inboundTransactionLink.click();
    await expect(this.outstandingModal).toBeVisible({ timeout: 30_000 });
    await expect(
      this.outstandingModal.getByRole('searchbox').first(),
    ).toBeVisible({ timeout: 30_000 });
  }

  async useInboundByPoCode(poCode: string): Promise<void> {
    const modal = this.outstandingModal;
    const search = modal.getByRole('searchbox').first();
    await search.fill(poCode);
    await this.page.waitForTimeout(2_000);

    const row = modal
      .getByRole('row')
      .filter({ hasText: poCode })
      .first();
    await expect(row, `Baris outstanding ${poCode}`).toBeVisible({
      timeout: 60_000,
    });

    // Ceklis semua baris yang match PO (bisa multi-line)
    const rows = modal.getByRole('row').filter({ hasText: poCode });
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      const r = rows.nth(i);
      // skip header
      if (await r.locator('th').count()) continue;
      const checkbox = r.locator('input[type="checkbox"]').first();
      if (await checkbox.isVisible().catch(() => false)) {
        if (!(await checkbox.isChecked().catch(() => false))) {
          await checkbox.check({ force: true });
          await this.page.waitForTimeout(300);
        }
      }
    }

    const useResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        return /\/accounting\/supplier-invoice\/\d+\/details\/bulk/.test(
          response.url(),
        );
      },
      { timeout: 90_000 },
    );

    // Bulk Use di toolbar modal (teks Use)
    const bulkUse = modal
      .locator('button.tooltip-use')
      .filter({ hasText: /^Use$/i })
      .first()
      .or(modal.getByRole('button', { name: /^Use$/i }).first());

    await expect(bulkUse, 'Tombol Use (bulk)').toBeVisible({ timeout: 20_000 });
    await bulkUse.click();

    const response = await useResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
    } | null;

    if (!response.ok() || body?.status?.error) {
      throw new Error(
        `Use inbound gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    // Modal biasanya tertutup setelah refresh
    await this.page.waitForTimeout(1_000);
  }

  async clickSaveAllAndWait(): Promise<void> {
    const saveResponse = this.page
      .waitForResponse(
        (response) =>
          /\/accounting\/supplier-invoice\/\d+/.test(response.url()) &&
          ['PUT', 'POST'].includes(response.request().method()) &&
          !response.url().includes('/details'),
        { timeout: 90_000 },
      )
      .catch(() => null);

    await this.form.clickSaveAll();

    const response = await saveResponse;
    if (response) {
      const body = (await response.json().catch(() => null)) as {
        status?: { error?: number; message?: string };
      } | null;
      if (!response.ok() || body?.status?.error) {
        throw new Error(
          `Save All PI gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
        );
      }
    }

    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(800);
  }

  async assertDraftInDatalist(code: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(code, 2_000);
    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `PI ${code} harus tampil`).toBeVisible({
      timeout: 45_000,
    });
    await expect(row).toContainText(/draft/i);
  }

  get openRadio(): Locator {
    return this.page.locator('#open');
  }

  /** Tombol Approve di form (ikon check-double, Tippy Approve). */
  get formApproveButton(): Locator {
    return this.page
      .locator('button')
      .filter({
        has: this.page.locator(
          '.fa-check-double, [data-icon="check-double"], .fa-check-double',
        ),
      })
      .first();
  }

  async openEditFromDatalistByCode(code: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(code, 2_000);
    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Baris PI ${code}`).toBeVisible({ timeout: 45_000 });

    const editBtn = this.datalist.editButton(row).first();
    await expect(editBtn).toBeVisible({ timeout: 30_000 });
    await editBtn.click();

    await this.page.waitForURL(PURCHASE_INVOICE_EDIT_PATH_PATTERN, {
      timeout: 45_000,
    });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Basic Information').catch(() => undefined);
    await expect(this.codeInput).toHaveValue(code, { timeout: 45_000 });
  }

  async setOpenAndWait(): Promise<void> {
    await expect(this.openRadio).toBeEnabled({ timeout: 30_000 });

    const updateResponse = this.page.waitForResponse(
      (response) => {
        const method = response.request().method();
        if (!['PUT', 'POST'].includes(method)) return false;
        const url = response.url();
        return (
          /\/accounting\/supplier-invoice\/\d+/.test(url) &&
          !url.includes('/details') &&
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
        `Set Open PI gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await expect(this.openRadio).toBeChecked({ timeout: 15_000 });
    await this.page.waitForTimeout(1_500);
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
        response.url().includes('/approve'),
      { timeout: 120_000 },
    );

    await approveBtn.click();

    // ApprovalModal: jika ada textarea, isi + klik Approve; jika auto-approve (tanpa modal), skip.
    const descField = this.page.getByPlaceholder(
      /approving this transaction|Add information/i,
    );
    if (await descField.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await descField.fill(description);
      const confirmApprove = this.page
        .locator('[role="dialog"]')
        .getByRole('button')
        .filter({ has: this.page.locator('.fa-check, [data-icon="check"]') })
        .or(
          this.page
            .locator('[role="dialog"]')
            .getByRole('button', { name: /^Approve$/i }),
        )
        .last();

      // Modal kecil: tombol Approve sering icon-only (success/check)
      const dialogApprove = this.page.locator(
        '[role="dialog"] button.bg-success, [role="dialog"] button[class*="success"]',
      ).last();

      if (await dialogApprove.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await dialogApprove.click();
      } else if (
        await confirmApprove.isVisible({ timeout: 3_000 }).catch(() => false)
      ) {
        await confirmApprove.click();
      }
    }

    // Sukses: response approve ATAU redirect ke datalist
    const outcome = await Promise.race([
      approveResponsePromise.then(async (response) => {
        const body = (await response.json().catch(() => null)) as {
          status?: { error?: number; message?: string };
        } | null;
        if (!response.ok() || body?.status?.error) {
          throw new Error(
            `Approve PI gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
          );
        }
        return { message: body?.status?.message };
      }),
      this.page
        .waitForURL(/\/accounting\/supplier-invoice\/?$/, { timeout: 120_000 })
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
    await expect(row, `PI ${code} harus tampil`).toBeVisible({
      timeout: 45_000,
    });
    await expect(row).toContainText(/approved/i);
  }
}
