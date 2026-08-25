import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { PURCHASE_REQUISITION_DATALIST_PATH } from '../../helpers/purchase-requisition';
import { PURCHASE_ORDER_DATALIST_PATH } from '../../helpers/purchase-order';
import { createPrOpen, approvePrFromDatalist } from '../../scenarios/purchase-requisition.scenario';
import { createPoWithPrOpen, approvePoFromDatalist } from '../../scenarios/purchase-order.scenario';
import { assertInboundQtyCannotExceedOutstanding } from '../../scenarios/purchase-inbound.scenario';

/**
 * NEGATIVE TEST — over-receive dicegah: Inbound Qty tidak bisa melebihi Outstanding PO.
 * TC: qa-docs/supplychain-new-purchase-inbound/test-cases/TC-PI-DRAFT-20260826101500.md
 *
 * Contoh kanonik alur "guard backend → TC negative → scenario → spec":
 * skenario digali lewat `npm run guard:scan -- --menu supplychain-new-purchase-inbound`
 * (guard ★ "Input Quantity exceeds Outstanding PO"), aturannya terverifikasi di
 * requirement §6 tabel *Qty vs PO*.
 *
 * ARRANGE memakai scenario happy path (PR → PO approved) supaya outstanding-nya
 * fresh dan nilainya diketahui — bukan dokumen statis yang bisa berubah.
 * Company: lumicharmsid (153)
 */
test.describe.serial('Purchase Inbound — guard qty vs outstanding PO', () => {
  const supplierName = 'PT. SUPPLIER IDR';
  const warehouseDestination = 'WH Pusat Zona A1';
  const outstandingQty = 5;
  const productLines = [{ sku: 'SKU-RAINCOAT-hitam', qty: outstandingQty }];

  let poCode = '';

  test('[@TC-PI-QTY-EXCEEDS][arrange] Siapkan PO approved dengan outstanding diketahui', async ({
    page,
  }) => {
    test.setTimeout(300_000);

    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: PURCHASE_REQUISITION_DATALIST_PATH,
    });

    const { prCode } = await createPrOpen(page, productLines);
    await approvePrFromDatalist(page, prCode);

    await page.goto(PURCHASE_ORDER_DATALIST_PATH, { waitUntil: 'domcontentloaded' });
    ({ poCode } = await createPoWithPrOpen(page, supplierName, productLines));
    await approvePoFromDatalist(page, poCode);
  });

  test('[@TC-PI-QTY-EXCEEDS] Inbound Qty > outstanding PO tidak tersimpan (dibatasi ke outstanding)', async ({
    page,
  }, testInfo) => {
    test.setTimeout(300_000);
    test.skip(!poCode, 'Arrange gagal — tidak ada PO approved untuk diuji');

    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: PURCHASE_ORDER_DATALIST_PATH,
    });

    const attemptedQty = outstandingQty + 1;
    const { piCode, savedQty } = await assertInboundQtyCannotExceedOutstanding(
      page,
      supplierName,
      productLines[0].sku,
      poCode,
      attemptedQty,
      warehouseDestination,
    );

    // Expected result (requirement §6 Qty vs PO): over-receive tidak mungkin.
    // AS-IS: sistem membatasi ke outstanding (clamp), bukan menampilkan error.
    expect(
      savedQty,
      `Qty tersimpan harus dibatasi ke outstanding (${outstandingQty}), bukan qty yang diinput (${attemptedQty})`,
    ).toBe(outstandingQty);

    await testInfo.attach('guard-evidence', {
      body: JSON.stringify({
        po_code: poCode,
        pi_code: piCode,
        outstanding_qty: outstandingQty,
        attempted_qty: attemptedQty,
        saved_qty: savedQty,
        behaviour: 'clamp ke outstanding (tanpa pesan error) — guard backend tidak terpicu dari UI',
      }),
      contentType: 'application/json',
    });
  });
});
