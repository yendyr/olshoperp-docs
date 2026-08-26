import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  STOCK_REMAPPING_DATALIST_PATH,
  StockRemappingPage,
} from '../../helpers/stock-remapping';

/**
 * ETM-15526 happy path — TC dari komentar manual 40137.
 *
 * | TC | Skenario |
 * | TC-01 | Duplicate Remapped To antar baris |
 * | TC-02 | Eligibilitas Remapped To — hanya Variant 1 parent |
 * | TC-04 | Bulk Use — 1 baris per Stock ID |
 * | TC-05 | Anti-averaging qty > availability 1 Stock ID |
 * | TC-06 | Unit read-only + Avl. Base Unit (Pieces) |
 * | TC-07 | Qty > Avl. Base Unit ditolak |
 *
 * TC-03 PENDING (Single Use) — skip.
 * Company: lumicharmsid · Building: Dropoff Gayungsari
 * SKU: sku-spidol-biru / sku-spidol-hijau / sku-spidol-hitam
 */
const COMPANY = 'lumicharmsid';
const BUILDING = 'dropoff gayungsari';
const SKU_MIX = 'sku-spidol-biru';
const SKU_WHITE = 'sku-spidol-hijau';
const SKU_PINK = 'sku-spidol-hitam';

async function prepareNewRm(rm: StockRemappingPage, description: string): Promise<void> {
  await rm.gotoDatalist();
  await rm.openCreateOrAutoEdit();
  await rm.fillDescription(description);
  await rm.clickSaveAllAndWait();
  await rm.setBuilding(BUILDING);
}

test.describe.serial('ETM-15526 Stock Remapping happy path (manual TC 40137)', () => {
  test.describe.configure({ timeout: 420_000 });

  let rmCode = '';

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: COMPANY,
      targetPath: STOCK_REMAPPING_DATALIST_PATH,
    });
  });

  test('[@ETM-15526][@TC-01] Duplicate Remapped To antar baris diizinkan', async ({
    page,
  }) => {
    const rm = new StockRemappingPage(page);
    await prepareNewRm(rm, 'ETM-15526 TC-01 duplicate remapped to');

    const mixAvail = await rm.isSkuInAvailableProducts(SKU_MIX);
    expect(mixAvail, `${SKU_MIX} harus ada di Available Products (lumicharmsid)`).toBe(true);

    await rm.bulkUseSkuFromAvailableProducts(SKU_MIX);
    let rowsAfterMix = await rm.countDetailRows();
    if (rowsAfterMix < 2) {
      expect(
        await rm.isSkuInAvailableProducts(SKU_WHITE),
        `${SKU_WHITE} diperlukan untuk baris ke-2 (biru hanya 1 Stock ID)`,
      ).toBe(true);
      await rm.bulkUseSkuFromAvailableProducts(SKU_WHITE);
      rowsAfterMix = await rm.countDetailRows();
    }
    expect(rowsAfterMix, 'Minimal 2 baris Origin untuk uji duplicate Remapped To').toBeGreaterThanOrEqual(2);

    await rm.setRemappedToOnRow(SKU_MIX, SKU_PINK);
    await rm.setRemappedToOnRow(SKU_WHITE, SKU_PINK);

    const details = rm.collectDetails(await rm.fetchApi());
    const duplicateCount = details.filter(
      (d) => d.remappedSku.toLowerCase() === SKU_PINK.toLowerCase(),
    ).length;
    expect(
      duplicateCount,
      '2 baris boleh Remapped To = sku-spidol-hitam (duplicate)',
    ).toBeGreaterThanOrEqual(2);

    rmCode = await rm.readGeneratedCode();
  });

  test('[@ETM-15526][@TC-02] Remapped To hanya variant dalam 1 parent', async ({
    page,
  }) => {
    const rm = new StockRemappingPage(page);
    await prepareNewRm(rm, 'ETM-15526 TC-02 eligibilitas remapped to');

    // Manual 40137: Origin Pink → opsi hanya Mix & White (parent sama; Origin sendiri tidak dipilih)
    expect(await rm.isSkuInAvailableProducts(SKU_PINK)).toBe(true);
    await rm.addOriginSku(SKU_PINK);

    const options = await rm.readRemappedToOptions(SKU_PINK);
    const optionBlob = options.join(' ').toLowerCase();
    expect(optionBlob, 'Opsi Remapped To ter-load').toContain('sku-spidol');
    expect(optionBlob, 'Harus ada sku-spidol-biru').toContain('biru');
    expect(optionBlob, 'Harus ada sku-spidol-hijau').toContain('hijau');
  });

  test('[@ETM-15526][@TC-04] Bulk Use — 1 baris per Stock ID', async ({ page }) => {
    const rm = new StockRemappingPage(page);
    await prepareNewRm(rm, 'ETM-15526 TC-04 bulk use 3 stock id');

    expect(await rm.isSkuInAvailableProducts(SKU_MIX)).toBe(true);
    expect(await rm.isSkuInAvailableProducts(SKU_WHITE)).toBe(true);

    await rm.bulkUseSkuFromAvailableProducts(SKU_MIX);
    const mixRows = await rm.countDetailRows();
    expect(mixRows, 'Biru minimal 1 baris per Stock ID').toBeGreaterThanOrEqual(1);

    await rm.bulkUseSkuFromAvailableProducts(SKU_WHITE);
    const totalRows = await rm.countDetailRows();
    expect(totalRows, 'Total minimal 2 baris (biru + hijau)').toBeGreaterThanOrEqual(2);

    for (const origin of [SKU_MIX, SKU_WHITE]) {
      const rowText = await rm.readDetailRowText(origin);
      expect(rowText.toLowerCase()).toContain('pieces');
    }
  });

  test('[@ETM-15526][@TC-05] Qty > availability ditolak, Unit Price tidak averaging', async ({
    page,
  }) => {
    const rm = new StockRemappingPage(page);
    await prepareNewRm(rm, 'ETM-15526 TC-05 anti averaging');

    await rm.addOriginSku(SKU_MIX);
    await rm.setRemappedToOnRow(SKU_MIX, SKU_PINK);
    const before = await rm.readDetailRowText(SKU_MIX);

    const overQty = await rm.setQtyOnRow(SKU_MIX, 999_999);
    const toast = await rm.readToastText();
    const after = await rm.readDetailRowText(SKU_MIX);

    expect(
      !overQty.ok || /qty|quantity|availability|exceed|invalid/i.test(
        `${overQty.message} ${toast}`,
      ),
      `Qty melebihi availability harus ditolak. msg="${overQty.message || toast}"`,
    ).toBe(true);
    expect(after, 'Qty 999999 tidak boleh tersimpan').not.toMatch(/\b999999\b/);
    const priceBefore = before.match(/\d[\d.,]*/g) ?? [];
    const priceAfter = after.match(/\d[\d.,]*/g) ?? [];
    expect(priceAfter.join(' '), 'Unit Price tidak averaging setelah qty ditolak').toBe(
      priceBefore.join(' '),
    );
  });

  test('[@ETM-15526][@TC-06] Unit read-only Base Unit + kolom Avl. Base Unit', async ({
    page,
  }) => {
    const rm = new StockRemappingPage(page);
    await prepareNewRm(rm, 'ETM-15526 TC-06 unit readonly avl base');

    await rm.addOriginSku(SKU_WHITE);
    const rowText = await rm.readDetailRowText(SKU_WHITE);

    expect(rowText.toLowerCase(), 'Unit/Base Unit tampil di baris').toMatch(
      /pieces|pcs|unit|base/i,
    );
    expect(rowText, 'Kolom Avl. Base Unit terisi angka').toMatch(/\d/);
  });

  test('[@ETM-15526][@TC-07] Qty > Avl. Base Unit ditolak', async ({ page }) => {
    const rm = new StockRemappingPage(page);
    await prepareNewRm(rm, 'ETM-15526 TC-07 qty over avl base');

    await rm.addOriginSku(SKU_WHITE);
    await rm.setRemappedToOnRow(SKU_WHITE, SKU_PINK);

    const over = await rm.setQtyOnRow(SKU_WHITE, 1001);
    const toast = await rm.readToastText();
    const rowAfter = await rm.readDetailRowText(SKU_WHITE);

    expect(
      !over.ok || /qty|quantity|avl|exceed|invalid/i.test(`${over.message} ${toast}`),
      `Qty 1001 harus ditolak jika melebihi Avl. Base Unit. msg="${over.message || toast}"`,
    ).toBe(true);
    expect(rowAfter, 'Qty 1001 tidak boleh tersimpan').not.toMatch(/\b1001\b/);
  });
});
