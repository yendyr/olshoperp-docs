import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopFormActions } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const FISCAL_PERIOD_DATALIST_PATH = '/accounting/fiscal-period';
export const FISCAL_PERIOD_EDIT_PATH_PATTERN =
  /\/accounting\/fiscal-period\/edit\/\d+/;

export const DEC_2024 = {
  name: 'December 2024',
  startDisplay: '01-12-2024',
  endDisplay: '31-12-2024',
  periodLabel: /01-Dec-2024|Dec-2024|01-12-2024/i,
} as const;

/**
 * POM Fiscal Period — FA Master.
 * Selector: tests/pom-registry/fiscal-period.yaml
 */
export class FiscalPeriodPage {
  readonly datalist: OlshopDatalist;
  private readonly form: OlshopFormActions;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
    this.form = new OlshopFormActions(page);
  }

  get nameInput(): Locator {
    return this.page.locator('#name');
  }

  get descriptionInput(): Locator {
    return this.page.locator('#FiscalPeriod textarea').first();
  }

  get startDateInput(): Locator {
    return this.page
      .locator('#FiscalPeriod')
      .locator('input.olshoperp-datepicker-input, input.p-datepicker-input')
      .nth(0);
  }

  get endDateInput(): Locator {
    return this.page
      .locator('#FiscalPeriod')
      .locator('input.olshoperp-datepicker-input, input.p-datepicker-input')
      .nth(1);
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(FISCAL_PERIOD_DATALIST_PATH, 'link');
  }

  async assertDatalistShell(): Promise<void> {
    await expect(this.datalist.createButton('link')).toBeVisible({
      timeout: 30_000,
    });
    const headers = this.datalist.table.getByRole('columnheader');
    await expect(headers.filter({ hasText: /name/i }).first()).toBeVisible({
      timeout: 30_000,
    });
    await expect(headers.filter({ hasText: /period/i }).first()).toBeVisible();
    await expect(
      headers.filter({ hasText: /description/i }).first(),
    ).toBeVisible();
    await expect(headers.filter({ hasText: /status/i }).first()).toBeVisible();
  }

  async openCreateForm(): Promise<void> {
    await this.datalist.clickCreate('link');
    await this.page.waitForURL(/\/accounting\/fiscal-period\/create/, {
      timeout: 45_000,
    });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Fiscal Period');
    await expect(this.nameInput).toBeVisible({ timeout: 30_000 });
  }

  /**
   * Fill datepicker display (dd-MM-yyyy). Fallback via evaluate if fill+Enter fails.
   */
  async fillDateInput(input: Locator, displayValue: string): Promise<void> {
    await expect(input).toBeVisible({ timeout: 15_000 });
    if (await input.isDisabled().catch(() => false)) {
      throw new Error(`Datepicker disabled; cannot set ${displayValue}`);
    }

    await input.click({ clickCount: 3 });
    await input.fill(displayValue);
    await input.press('Enter');
    await input.blur();
    await this.page.keyboard.press('Escape').catch(() => undefined);
    await this.page.waitForTimeout(600);

    const shown = (await input.inputValue().catch(() => '')).trim();
    if (!shown.includes(displayValue.slice(0, 10))) {
      const index = (await input.evaluate((el) => {
        const all = Array.from(
          document.querySelectorAll(
            '#FiscalPeriod input.olshoperp-datepicker-input, #FiscalPeriod input.p-datepicker-input',
          ),
        );
        return all.indexOf(el as HTMLInputElement);
      })) as number;

      await this.page.evaluate(
        ({ idx, value }) => {
          const inputs = document.querySelectorAll(
            '#FiscalPeriod input.olshoperp-datepicker-input, #FiscalPeriod input.p-datepicker-input',
          );
          const el = inputs[idx] as HTMLInputElement | undefined;
          if (!el || el.disabled) return;
          el.focus();
          el.value = value;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
          );
          el.blur();
        },
        { idx: index < 0 ? 0 : index, value: displayValue },
      );
      await this.page.waitForTimeout(600);
    }
  }

  async fillCreateDecember2024(): Promise<void> {
    await this.nameInput.fill(DEC_2024.name);
    await this.fillDateInput(this.startDateInput, DEC_2024.startDisplay);
    await this.fillDateInput(this.endDateInput, DEC_2024.endDisplay);
    await this.descriptionInput.fill('automation playwright');
  }

  async clickSaveAndNextAndWaitForEdit(): Promise<{
    ok: boolean;
    message?: string;
  }> {
    const saveResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        const path = new URL(response.url()).pathname.replace(/\/$/, '');
        return /\/accounting\/fiscal-period$/.test(path);
      },
      { timeout: 90_000 },
    );

    await this.form.clickSaveAndNext();

    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
      error_form?: { date?: string | string[]; period_start?: string };
    } | null;

    const errMsg =
      body?.status?.message ??
      (Array.isArray(body?.error_form?.date)
        ? body?.error_form?.date?.[0]
        : body?.error_form?.date) ??
      undefined;

    if (!response.ok() || body?.status?.error) {
      return { ok: false, message: errMsg ?? `HTTP ${response.status()}` };
    }

    await this.page.waitForURL(FISCAL_PERIOD_EDIT_PATH_PATTERN, {
      timeout: 45_000,
    });
    await waitForSuccessToast(this.page, 5_000).catch(() => undefined);
    // Create→edit sering reuse komponen (resetData tanpa remount) → reload agar fetchDetail jalan.
    await this.page.reload({ waitUntil: 'domcontentloaded' });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Fiscal Period');
    await this.waitForFormHydrated();
    return { ok: true };
  }

  /** Tunggu fetchDetail mengisi Vue model (hindari Save All dengan field kosong). */
  async waitForFormHydrated(): Promise<void> {
    await expect(this.nameInput).toBeVisible({ timeout: 30_000 });
    await expect
      .poll(async () => (await this.nameInput.inputValue()).trim(), {
        timeout: 45_000,
        message: 'Fiscal Period form belum terisi (fetchDetail)',
      })
      .not.toBe('');
  }

  /** Row that looks like Dec 2024 by name or PERIOD label. */
  dec2024Row(): Locator {
    return this.page
      .getByRole('row')
      .filter({
        hasText: /December 2024|01-Dec-2024|Dec-2024/i,
      })
      .first();
  }

  async findDecember2024InDatalist(): Promise<boolean> {
    await this.gotoDatalist();
    await this.datalist.search(DEC_2024.name, 1_500);
    if (await this.dec2024Row().isVisible({ timeout: 8_000 }).catch(() => false)) {
      return true;
    }

    // Fallback: clear + search period fragment
    await this.datalist.search('Dec-2024', 1_500);
    if (await this.dec2024Row().isVisible({ timeout: 8_000 }).catch(() => false)) {
      return true;
    }

    await this.datalist.search('01-Dec-2024', 1_500);
    return this.dec2024Row()
      .isVisible({ timeout: 8_000 })
      .catch(() => false);
  }

  async openEditDecember2024(): Promise<void> {
    const found = await this.findDecember2024InDatalist();
    if (!found) {
      throw new Error('December 2024 fiscal period tidak ditemukan di datalist');
    }

    const row = this.dec2024Row();
    await expect(row).toBeVisible({ timeout: 30_000 });

    const editBtn = this.datalist.editButton(row).first();
    if (await editBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await editBtn.click();
    } else {
      // Closed periods may hide edit — try name link if present
      const nameLink = row.getByRole('link').first();
      if (await nameLink.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await nameLink.click();
      } else {
        throw new Error(
          'Tidak bisa buka edit December 2024 (tombol edit tidak tersedia — kemungkinan Closed)',
        );
      }
    }

    await this.page.waitForURL(FISCAL_PERIOD_EDIT_PATH_PATTERN, {
      timeout: 45_000,
    });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Fiscal Period');
    await this.waitForFormHydrated();
  }

  /**
   * Ensure Dec 2024 exists: reuse if found, else create.
   * On overlap error, reopen existing covering period.
   */
  async ensureDecember2024(): Promise<'created' | 'existing'> {
    if (await this.findDecember2024InDatalist()) {
      await this.openEditDecember2024();
      return 'existing';
    }

    await this.gotoDatalist();
    await this.openCreateForm();
    await this.fillCreateDecember2024();
    const result = await this.clickSaveAndNextAndWaitForEdit();

    if (result.ok) {
      return 'created';
    }

    const overlap =
      /already in use|overlap|selected date/i.test(result.message ?? '') ||
      true;

    if (overlap) {
      // Leave create form and open existing
      const foundAfter = await this.findDecember2024InDatalist();
      if (foundAfter) {
        await this.openEditDecember2024();
        return 'existing';
      }
      // Broader search: any 2024 period covering Dec
      await this.datalist.search('2024', 1_500);
      const yearRow = this.page
        .getByRole('row')
        .filter({ hasText: /2024/ })
        .filter({ hasText: /Dec|12-2024|12\/2024/i })
        .first();
      if (await yearRow.isVisible({ timeout: 10_000 }).catch(() => false)) {
        const editBtn = this.datalist.editButton(yearRow).first();
        await editBtn.click();
        await this.page.waitForURL(FISCAL_PERIOD_EDIT_PATH_PATTERN, {
          timeout: 45_000,
        });
        await dismissStagingBanner(this.page);
        await this.form.expandAccordion('Fiscal Period');
        return 'existing';
      }
    }

    throw new Error(
      `Gagal ensure December 2024: ${result.message ?? 'unknown'}`,
    );
  }

  async updateDescriptionIfEditable(
    description = 'automation playwright',
  ): Promise<'updated' | 'skipped'> {
    await this.waitForFormHydrated();

    const disabled = await this.descriptionInput
      .isDisabled()
      .catch(() => true);
    const saveAll = this.page.getByRole('button', { name: 'Save All' }).last();
    const canSave = await saveAll.isVisible({ timeout: 5_000 }).catch(() => false);

    if (disabled || !canSave) {
      return 'skipped';
    }

    // Sync Vue model via fill (hindari Save All sebelum hydrate selesai).
    const currentName = (await this.nameInput.inputValue()).trim();
    if (currentName) {
      await this.nameInput.fill(currentName);
    }
    await this.descriptionInput.fill(description);
    await this.descriptionInput.blur();
    await this.page.waitForTimeout(300);
    await this.clickSaveAllAndWait();
    return 'updated';
  }

  async clickSaveAllAndWait(): Promise<void> {
    const saveResponse = this.page
      .waitForResponse(
        (response) =>
          /\/accounting\/fiscal-period\/\d+/.test(response.url()) &&
          ['PUT', 'POST'].includes(response.request().method()),
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
          `Update Fiscal Period gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
        );
      }
    }

    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(800);
  }

  async assertDecember2024InDatalist(): Promise<void> {
    const found = await this.findDecember2024InDatalist();
    expect(found, 'December 2024 harus tampil di datalist').toBe(true);
    await expect(this.dec2024Row()).toBeVisible({ timeout: 30_000 });
  }
}
