import { Page, expect, Locator } from '@playwright/test';
import { dismissStagingBanner } from './shared/staging-banner';
import { OlshopFormActions } from './shared';
import {
  assertDetailRowOrder,
  enableShowDeletedInSection,
  getDetailDataRowTexts,
  identifierPattern,
  pickMultiselectOptionExact,
  selectAllDetailRows,
  selectFromSectionMultiselect,
  waitForIdentifierCountInSection,
  waitForIdentifierInSection,
} from './shared/detail-table';

export type DetailSortingMenuConfig = {
  name: string;
  editPath: string;
  trxCode: string;
  sectionId: string;
  accordionTitle: string;
  accordionFallbacks?: string[];
  identifiers: string[];
  multiselectPlaceholder?: RegExp;
  addMode: 'multiselect' | 'po-detail' | 'inbound-outstanding' | 'outbound-so-modal';
  /** Hapus semua baris detail sebelum mulai (default true untuk reverseSecondPass) */
  clearDetailBeforeRun?: boolean;
  /** Assembly: jalankan kedua pass dengan urutan dibalik */
  reverseSecondPass?: boolean;
};

export class DetailSortingPage {
  private readonly form: OlshopFormActions;

  constructor(private readonly page: Page) {
    this.form = new OlshopFormActions(page);
  }

  async gotoEdit(editPath: string, trxCode: string): Promise<void> {
    await this.page.goto(editPath, { waitUntil: 'domcontentloaded' });
    await dismissStagingBanner(this.page);

    const codeInput = this.page
      .locator('#code')
      .or(this.page.getByPlaceholder(/automatically generate by system/i))
      .or(this.page.getByRole('textbox', { name: /transaction code/i }))
      .first();

    await expect(codeInput).toBeVisible({ timeout: 45_000 });

    const value = (await codeInput.inputValue().catch(() => '')).trim();
    if (value) {
      await expect(codeInput).toHaveValue(trxCode, { timeout: 15_000 });
      return;
    }

    // Beberapa form menampilkan code sebagai text (bukan value input yang terbaca cepat)
    await expect(this.page.getByText(trxCode, { exact: true }).first()).toBeVisible({
      timeout: 30_000,
    });
  }

  section(sectionId: string): Locator {
    return this.page.locator(`#${sectionId}`);
  }

  async expandSection(accordionTitle: string, fallbacks: string[] = []): Promise<void> {
    const titles = [accordionTitle, ...fallbacks];
    let lastError: unknown;

    for (const title of titles) {
      try {
        await this.form.expandAccordion(title);
        await this.page.waitForTimeout(500);
        return;
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;
  }

  async deleteAllDetailRows(section: Locator): Promise<void> {
    // 1) Coba bulk delete (pilih semua header → tombol trash bulk)
    for (let attempt = 0; attempt < 6; attempt++) {
      const dataRows = section.locator('tbody tr').filter({ hasNotText: /no data available/i });
      if ((await dataRows.count().catch(() => 0)) === 0) {
        return;
      }

      await selectAllDetailRows(section);
      await this.page.waitForTimeout(500);

      // Toolbar bulk muncul saat ada baris terpilih ("N rows selected").
      const bulkToolbar = section
        .locator('div,span')
        .filter({ hasText: /\d+\s+rows?\s+selected/i })
        .last();

      let bulkDelete = section
        .locator('button.delete-bulk, button.tooltip-delete-bulk, button.bulk-delete')
        .first();

      if (!(await bulkDelete.isVisible({ timeout: 1_500 }).catch(() => false))) {
        // Tombol ikon trash (Lucide/FontAwesome) di toolbar bulk
        bulkDelete = section
          .locator('button')
          .filter({
            has: this.page.locator(
              '[data-icon*="trash"], svg[class*="trash"], .lucide-trash-2, .fa-trash, .fa-trash-can',
            ),
          })
          .first();
      }

      if (!(await bulkDelete.isVisible({ timeout: 1_500 }).catch(() => false))) {
        // Fallback: 2 tombol ikon sebelum teks "rows selected" → yang kedua = delete
        const toolbarButtons = bulkToolbar.locator('xpath=ancestor::*[1]').locator('button');
        if ((await toolbarButtons.count().catch(() => 0)) >= 2) {
          bulkDelete = toolbarButtons.nth(1);
        }
      }

      if (!(await bulkDelete.isVisible({ timeout: 1_500 }).catch(() => false))) {
        break;
      }

      await bulkDelete.scrollIntoViewIfNeeded();
      await bulkDelete.click();

      const confirmDelete = this.page.getByRole('button', { name: /^Delete$/i }).last();
      if (await confirmDelete.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await confirmDelete.click();
        await expect(confirmDelete).toBeHidden({ timeout: 60_000 }).catch(() => undefined);
      }
      await this.page.waitForTimeout(1_500);
    }

    // 2) Fallback: hapus baris satu per satu
    for (let attempt = 0; attempt < 30; attempt++) {
      const deleteBtn = section
        .locator('button.tooltip-delete, button#deleteButton, button.delete-button')
        .first();

      if (!(await deleteBtn.isVisible({ timeout: 2_000 }).catch(() => false))) {
        break;
      }

      await deleteBtn.scrollIntoViewIfNeeded();
      await deleteBtn.click();

      const confirmDelete = this.page.getByRole('button', { name: /^Delete$/i }).last();
      if (await confirmDelete.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await confirmDelete.click();
        await expect(confirmDelete).toBeHidden({ timeout: 60_000 });
      }

      await this.page.waitForTimeout(1_200);
    }
  }

  async prepareDetailSection(config: DetailSortingMenuConfig): Promise<Locator> {
    await this.expandSection(config.accordionTitle, config.accordionFallbacks ?? []);
    const section = this.section(config.sectionId);
    await expect(section).toBeVisible({ timeout: 30_000 });
    await enableShowDeletedInSection(section);
    await selectAllDetailRows(section);

    // Selalu kosongkan detail dulu agar outstanding/SKU tersedia lagi & urutan baseline bersih
    if (config.clearDetailBeforeRun !== false) {
      await this.deleteAllDetailRows(section);
    }

    return section;
  }

  private outstandingPanel(): Locator {
    return this.page
      .locator('div.fixed.rounded, div.bg-\\[\\#F1F5F9\\].fixed')
      .filter({ has: this.page.getByText(/Showing \d+ to \d+ of \d+ entries|Max Inbound|PO Qty/i) })
      .last();
  }

  private outstandingSearch(): Locator {
    return this.outstandingPanel()
      .getByPlaceholder(/find something/i)
      .or(this.outstandingPanel().getByRole('searchbox'))
      .first();
  }

  async openAvailablePurchaseOrderModal(section: Locator): Promise<void> {
    const panel = this.outstandingPanel();
    if (await panel.isVisible({ timeout: 2_000 }).catch(() => false)) {
      return;
    }

    const link = section
      .getByText('Available Purchase Order', { exact: true })
      .or(this.page.getByText('Available Purchase Order', { exact: true }))
      .first();

    await link.scrollIntoViewIfNeeded();
    await link.click();
    await expect(this.outstandingPanel()).toBeVisible({ timeout: 45_000 });
  }

  async setOutstandingPageSize(size = '100'): Promise<void> {
    const panel = this.outstandingPanel();
    const select = panel.locator('select').first();
    if (await select.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await select.selectOption(size).catch(() => undefined);
      await this.page.waitForTimeout(2_000);
    }
  }

  async addInboundOutstandingSku(sku: string): Promise<void> {
    const panel = this.outstandingPanel();

    // Outstanding search TIDAK mencari kolom SKU — pakai page size besar + scan baris.
    await this.setOutstandingPageSize('100');

    let row = panel.locator('tbody tr').filter({ hasText: identifierPattern(sku) }).first();

    // Coba halaman berikutnya bila belum terlihat
    for (let pageIdx = 0; pageIdx < 6; pageIdx++) {
      if (await row.isVisible({ timeout: 3_000 }).catch(() => false)) {
        break;
      }
      const nextBtn = panel
        .getByRole('button', { name: /next|›|»/i })
        .or(panel.locator('button.paginate_button.next, a.paginate_button.next'))
        .first();
      if (!(await nextBtn.isEnabled({ timeout: 1_500 }).catch(() => false))) {
        break;
      }
      await nextBtn.click();
      await this.page.waitForTimeout(1_500);
      row = panel.locator('tbody tr').filter({ hasText: identifierPattern(sku) }).first();
    }

    await row.scrollIntoViewIfNeeded().catch(() => undefined);
    await expect(row, `Outstanding inbound untuk ${sku}`).toBeVisible({ timeout: 30_000 });

    const useBtn = row.locator('button[class*="use-button"]').first();
    if (await useBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await useBtn.click();
      await this.confirmInboundUseModal();
      await this.page.waitForTimeout(1_500);
      return;
    }

    const checkbox = row.locator('input[type="checkbox"]').first();
    if (!(await checkbox.isChecked().catch(() => false))) {
      await checkbox.check({ force: true });
    }

    const bulkUse = panel.locator('button.tooltip-use').first();
    await expect(bulkUse).toBeVisible({ timeout: 10_000 });
    await bulkUse.click();
    await this.confirmInboundUseModal();
    await this.page.waitForTimeout(1_500);
  }

  /** Legacy mutation-inbound: "Use" membuka modal "Create Inbound Product" → klik Save. */
  private async confirmInboundUseModal(): Promise<void> {
    const modalHeading = this.page
      .getByRole('heading', { name: /create inbound product|use this product/i })
      .or(this.page.getByText(/create inbound product/i))
      .first();

    if (await modalHeading.isVisible({ timeout: 5_000 }).catch(() => false)) {
      const saveBtn = this.page
        .getByRole('button', { name: /^Save$/i })
        .or(this.page.getByRole('button', { name: /^Use$/i }))
        .last();
      await expect(saveBtn).toBeVisible({ timeout: 10_000 });
      await saveBtn.click();
      await expect(modalHeading).toBeHidden({ timeout: 60_000 }).catch(() => undefined);
      return;
    }

    // Modal konfirmasi sederhana (Use)
    const confirmUse = this.page.getByRole('button', { name: /^Use$/i }).last();
    if (await confirmUse.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await confirmUse.click();
    }
  }

  async openAvailableSoModal(section: Locator): Promise<void> {
    const link = section.getByText('Available SO', { exact: true }).first();
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await this.page.waitForTimeout(1_500);

    const panel = this.page
      .locator('div.bg-\\[\\#F1F5F9\\].fixed')
      .filter({ has: this.page.getByText(/Trx\. Code|Trx Code/i) })
      .last();
    await expect(panel).toBeVisible({ timeout: 30_000 });
  }

  async addOutboundSoFromModal(soCode: string): Promise<void> {
    const panel = this.page
      .locator('div.bg-\\[\\#F1F5F9\\].fixed, div.fixed.rounded')
      .filter({ has: this.page.getByText(/Trx\. Code|Trx Code/i) })
      .last();

    const search = panel.getByPlaceholder(/find something/i).or(panel.getByRole('searchbox')).first();
    if (await search.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await search.fill(soCode);
      await this.page.waitForTimeout(1_500);
    }

    const row = panel.getByRole('row').filter({ hasText: soCode }).first();
    await expect(row, `Available SO row ${soCode}`).toBeVisible({ timeout: 30_000 });

    const useBtn = row.locator('button[class*="use-button"], button.use-button').first();
    if (await useBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await useBtn.click();
      await this.page.waitForTimeout(2_000);
      return;
    }

    await row.click();
    await this.page.waitForTimeout(2_000);
  }

  async addPoDetailExact(section: Locator, sku: string): Promise<void> {
    const createResponse = this.page
      .waitForResponse(
        (response) =>
          response.url().includes('purchase-order-detail') &&
          response.url().includes('bulk-use') &&
          response.request().method() === 'POST',
        { timeout: 90_000 },
      )
      .catch(() => null);

    const combobox = section.locator('.multiselect').first().getByRole('combobox');
    await pickMultiselectOptionExact(this.page, combobox, sku);
    await createResponse;
    await this.page.waitForTimeout(1_000);
  }

  async addLine(
    config: DetailSortingMenuConfig,
    section: Locator,
    identifier: string,
  ): Promise<boolean> {
    const rowTexts = await getDetailDataRowTexts(section);
    const alreadyPresent = rowTexts.some((text) =>
      identifierPattern(identifier).test(text.replace(/\s+/g, ' ')),
    );
    if (alreadyPresent) {
      return false;
    }

    switch (config.addMode) {
      case 'po-detail': {
        await this.addPoDetailExact(section, identifier);
        break;
      }
      case 'inbound-outstanding': {
        await this.openAvailablePurchaseOrderModal(section);
        await this.addInboundOutstandingSku(identifier);
        break;
      }
      case 'outbound-so-modal': {
        await this.openAvailableSoModal(section);
        await this.addOutboundSoFromModal(identifier);
        break;
      }
      case 'multiselect':
      default: {
        await selectFromSectionMultiselect(
          this.page,
          section,
          identifier,
          config.multiselectPlaceholder ?? /select product|select sales order/i,
        );
        break;
      }
    }

    await waitForIdentifierInSection(section, identifier, 90_000);
    return true;
  }

  async runSortingRegression(config: DetailSortingMenuConfig): Promise<void> {
    const passes = config.reverseSecondPass
      ? [config.identifiers, [...config.identifiers].reverse()]
      : [config.identifiers];

    for (let passIndex = 0; passIndex < passes.length; passIndex++) {
      const identifiers = passes[passIndex];
      const passLabel =
        config.reverseSecondPass && passIndex === 1
          ? `${config.name} — pass 2 (urutan dibalik)`
          : config.name;

      await this.gotoEdit(config.editPath, config.trxCode);
      const section = await this.prepareDetailSection(config);

      const added: string[] = [];

      for (const identifier of identifiers) {
        const created = await this.addLine(config, section, identifier);
        expect(created, `${passLabel}: gagal menambah ${identifier}`).toBe(true);
        added.push(identifier);
        await waitForIdentifierCountInSection(section, added, 90_000);

        await assertDetailRowOrder(
          section,
          added,
          `${passLabel} — setelah tambah ${identifier}`,
        );
      }

      await assertDetailRowOrder(section, identifiers, `${passLabel} — final`);
    }
  }
}
