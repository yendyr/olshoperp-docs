import { Locator, Page, expect } from '@playwright/test';
import { dismissStagingBanner } from './company-access';
import {
  PURCHASE_REQUISITION_CREATE_PATH,
  PURCHASE_REQUISITION_EDIT_PATH_PATTERN,
} from './purchase-requisition';

export type PurchaseRequisitionCreateFormData = {
  /** Input `name` / `#pr_name`; di OlshopERP fallback = Transaction Code (auto PR-*). */
  name?: string;
  /** Custom select / combobox Department — diisi hanya jika elemen terlihat di halaman. */
  department?: string;
  description?: string;
};

/**
 * POM halaman Create Purchase Requisition — Basic Information.
 *
 * Catatan mapping UI OlshopERP (staging):
 * - "Nama/ID PR" → Transaction Code (auto-generate, sering disabled setelah save header)
 * - Department → tidak terdokumentasi di requirement PR; selector disiapkan + skip jika tidak ada
 * - Deskripsi → textarea / placeholder "Add description or notes..."
 * - Save → tombol "Save & Next" (bukan type=submit generik)
 */
export class PurchaseRequisitionCreatePage {
  constructor(private readonly page: Page) {}

  // ─── Navigation ─────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.page.goto(PURCHASE_REQUISITION_CREATE_PATH, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);
    await expect(this.saveButton).toBeVisible({ timeout: 45_000 });
  }

  // ─── Form fill ──────────────────────────────────────────────────────────

  async fillForm(data: PurchaseRequisitionCreateFormData): Promise<void> {
    if (data.name !== undefined) {
      await this.fillPrName(data.name);
    }

    if (data.department !== undefined) {
      await this.selectDepartment(data.department);
    }

    if (data.description !== undefined) {
      await this.fillDescription(data.description);
    }
  }

  async fillPrName(value: string): Promise<void> {
    const input = this.prNameInput;
    await input.scrollIntoViewIfNeeded();

    if (!(await input.isVisible({ timeout: 10_000 }).catch(() => false))) {
      throw new Error(
        'Field Nama/ID PR tidak ditemukan (input[name="name"], #pr_name, atau Transaction Code).',
      );
    }

    if (await input.isDisabled().catch(() => false)) {
      // Transaction Code auto-generate — tidak bisa diisi manual setelah terisi sistem
      return;
    }

    await input.fill(value);
  }

  async selectDepartment(label: string): Promise<void> {
    const dropdown = this.departmentDropdown;
    if (!(await dropdown.isVisible({ timeout: 5_000 }).catch(() => false))) {
      return;
    }

    const tagName = await dropdown.evaluate((el) => el.tagName.toLowerCase());

    if (tagName === 'select') {
      await dropdown.selectOption({ label });
      return;
    }

    await dropdown.click();
    const option = this.page.getByRole('option', { name: label, exact: true });
    if (await option.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await option.click();
      return;
    }

    await this.page.getByText(label, { exact: true }).first().click();
  }

  async fillDescription(value: string): Promise<void> {
    const field = this.descriptionField;
    await field.scrollIntoViewIfNeeded();
    await expect(field).toBeVisible({ timeout: 30_000 });
    await field.fill(value);
  }

  // ─── Actions ────────────────────────────────────────────────────────────

  async clickSaveButton(): Promise<void> {
    await this.saveButton.scrollIntoViewIfNeeded();
    await this.saveButton.click();
  }

  /**
   * Save & Next dengan fail-fast response API (fiscal period, validasi backend).
   */
  async clickSaveAndWaitForHeaderSaved(): Promise<void> {
    await this.saveButton.scrollIntoViewIfNeeded();

    const saveResponse = this.page.waitForResponse(
      (response) =>
        /\/api\/supplychain\/purchase-requisition\/?$/.test(
          new URL(response.url()).pathname,
        ) && response.request().method() === 'POST',
      { timeout: 90_000 },
    );

    await this.saveButton.click();

    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
    } | null;

    if (!response.ok() || body?.status?.error) {
      throw new Error(
        `Save PR header gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }
  }

  async clickCancelButton(): Promise<void> {
    await this.cancelButton.scrollIntoViewIfNeeded();
    await this.cancelButton.click();
  }

  async assertTransactionDateAutoFilled(): Promise<void> {
    const combobox = this.transactionDateCombobox;
    await expect(combobox).toBeVisible();
    const value =
      (await combobox.inputValue().catch(() => '')) ||
      ((await combobox.textContent())?.trim() ?? '');
    expect(value.length).toBeGreaterThan(0);
    expect(value).toMatch(/\d{2}-\d{2}-\d{4}/);
  }

  async getTransactionCode(): Promise<string> {
    const input = this.prNameInput;
    await expect(input).toBeVisible({ timeout: 10_000 });
    const value = (await input.inputValue()).trim();
    if (/^PR-[A-F0-9]+$/i.test(value)) {
      return value.toUpperCase();
    }
    throw new Error('Transaction code PR-* belum tergenerate di field Nama/ID PR.');
  }

  async waitForEditOrDetailReady(): Promise<void> {
    const onEdit = this.page
      .waitForURL(PURCHASE_REQUISITION_EDIT_PATH_PATTERN, { timeout: 30_000 })
      .then(() => true)
      .catch(() => false);

    const detailSection = expect(
      this.page.getByRole('button', { name: /Purchase Requisition Detail/i }),
    )
      .toBeVisible({ timeout: 30_000 })
      .then(() => true)
      .catch(() => false);

    const [editReady, detailReady] = await Promise.all([onEdit, detailSection]);
    expect(editReady || detailReady).toBeTruthy();
  }

  // ─── Locators ───────────────────────────────────────────────────────────

  /**
   * Field Nama/ID PR:
   * 1) input[name='name'] / #pr_name (sesuai permintaan)
   * 2) fallback OlshopERP: Transaction Code auto-generate
   */
  get prNameInput(): Locator {
    return this.page
      .locator("input[name='name'], #pr_name")
      .or(
        this.page.getByRole('textbox', {
          name: 'Automatically generate by system',
        }),
      )
      .first();
  }

  /** Department — native select atau custom combobox. */
  get departmentDropdown(): Locator {
    return this.page
      .locator(
        [
          "select[name*='department' i]",
          '#department',
          '[id*="department" i][role="combobox"]',
          '[aria-label*="Department" i]',
        ].join(', '),
      )
      .or(
        this.page
          .locator('div')
          .filter({ has: this.page.getByText(/^Department$/i) })
          .getByRole('combobox')
          .first(),
      )
      .first();
  }

  get descriptionField(): Locator {
    return this.page
      .locator('textarea')
      .or(this.page.getByRole('textbox', { name: /Add description or notes/i }))
      .first();
  }

  /**
   * Save — type=submit atau teks Save;
   * fallback OlshopERP create: "Save & Next".
   */
  get saveButton(): Locator {
    return this.page
      .locator('button[type="submit"]')
      .or(this.page.getByRole('button', { name: /^Save$/i }))
      .or(this.page.getByRole('button', { name: /Save & Next/i }))
      .first();
  }

  get cancelButton(): Locator {
    return this.page
      .getByRole('button', { name: /^Cancel$/i })
      .or(this.page.getByRole('link', { name: /^Cancel$/i }))
      .first();
  }

  private get transactionDateCombobox(): Locator {
    return this.page
      .locator('div')
      .filter({ has: this.page.getByText('Transaction Code', { exact: false }) })
      .filter({ has: this.page.getByText('Transaction Date', { exact: false }) })
      .getByRole('combobox')
      .first();
  }
}
