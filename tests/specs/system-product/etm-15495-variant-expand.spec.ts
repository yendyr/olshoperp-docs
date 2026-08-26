import { test, expect, type Page } from '@playwright/test';
import { AdjustmentAdditionPage } from '../../helpers/adjustment-addition';
import { prepareSession } from '../../helpers/company-access';
import {
  SYSTEM_PRODUCT_DATALIST_PATH,
  SystemProductPage,
} from '../../helpers/system-product';

const COMPANY_CODE = 'DEV-STG';
const CLR_TYPE = 'CLR-SP';
const CLR_OPTIONS = ['biru', 'hijau'] as const;
const MOTIF_TYPE = 'Motif';
const MOTIF_OPTIONS = ['doraemon', 'pikachu'] as const;
const STOCK_LOCATION = 'Seruni Drop Off';
const STOCK_QTY = 10;

function parentSku(userSku: string): string {
  return `${userSku}-(PARENT)`;
}

function clrChildren(userSku: string): string[] {
  return CLR_OPTIONS.map((opt) => `${userSku}-${opt}`);
}

function motifChildren(userSku: string): string[] {
  return CLR_OPTIONS.flatMap((color) =>
    MOTIF_OPTIONS.map((motif) => `${userSku}-${color}-${motif}`),
  );
}

async function waitForSkus(
  systemProduct: SystemProductPage,
  query: string,
  skus: string[],
  message: string,
): Promise<void> {
  await expect
    .poll(
      async () => {
        await systemProduct.gotoDatalist();
        await systemProduct.searchDatalist(query);
        return systemProduct.areSkusVisibleInDatalist(skus);
      },
      { timeout: 90_000, message },
    )
    .toBe(true);
}

async function createDefaultOriginSku(
  systemProduct: SystemProductPage,
  userSku: string,
): Promise<void> {
  const name = `ETM15495 ${userSku}`;
  const parent = parentSku(userSku);
  const mode = await systemProduct.openCreateOrEditBySku(userSku);

  if (mode === 'create') {
    await systemProduct.fillBasicInformation(userSku, name);
    await systemProduct.assertSalesCategoryAutoFilled();
    await systemProduct.clickSave();
  }

  await waitForSkus(
    systemProduct,
    userSku,
    [parent, userSku],
    `Default-origin ${parent} + child ${userSku} harus tampil setelah create`,
  );
}

async function addClrSpIfNeeded(
  page: Page,
  systemProduct: SystemProductPage,
  userSku: string,
): Promise<boolean> {
  const parent = parentSku(userSku);
  const children = clrChildren(userSku);
  const motifs = motifChildren(userSku);

  await systemProduct.gotoDatalist();
  await systemProduct.searchDatalist(userSku);
  if (await systemProduct.areSkusVisibleInDatalist(motifs)) {
    return false;
  }
  if (await systemProduct.areSkusVisibleInDatalist(children)) {
    return false;
  }

  await systemProduct.openCreateOrEditBySku(parent);
  await systemProduct.scrollToProductDetails();
  await systemProduct.addVariantGroup(CLR_TYPE, [...CLR_OPTIONS]);
  const hadPopup = await systemProduct.clickSaveAllWithExpandConfirm();

  const blockerToast = page
    .locator('.toastify, [class*="toast"]')
    .filter({ hasText: /cannot add variant|already have relations|fiscal period/i });
  if (await blockerToast.isVisible({ timeout: 3_000 }).catch(() => false)) {
    const msg = await blockerToast.first().textContent();
    throw new Error(`BLOCKER setelah tambah ${CLR_TYPE}: ${msg?.trim() ?? 'validasi backend'}`);
  }

  await waitForSkus(
    systemProduct,
    userSku,
    children,
    `Setelah ${CLR_TYPE}, child ${children.join(', ')} harus tampil`,
  );
  await systemProduct.assertSkuNotInDatalist(userSku);

  return hadPopup;
}

async function expandMotifAndAssertSoftDelete(
  systemProduct: SystemProductPage,
  userSku: string,
  oldChildSkus: string[],
): Promise<boolean> {
  const parent = parentSku(userSku);
  const expectedNew = motifChildren(userSku);

  await systemProduct.gotoDatalist();
  await systemProduct.searchDatalist(userSku);
  if (await systemProduct.areSkusVisibleInDatalist(expectedNew)) {
    for (const oldSku of oldChildSkus) {
      await systemProduct.assertSkuNotInDatalist(oldSku);
    }
    return false;
  }

  const oldChildIds: string[] = [];
  for (const childSku of oldChildSkus) {
    await systemProduct.openCreateOrEditBySku(childSku);
    oldChildIds.push(await systemProduct.readProductIdFromUrl());
  }

  await systemProduct.openCreateOrEditBySku(parent);
  await systemProduct.scrollToProductDetails();
  await systemProduct.addVariantGroup(MOTIF_TYPE, [...MOTIF_OPTIONS]);
  const hadPopup = await systemProduct.clickSaveAllWithExpandConfirm();

  for (const oldSku of oldChildSkus) {
    await systemProduct.assertSkuNotInDatalist(oldSku);
  }

  await waitForSkus(
    systemProduct,
    userSku,
    expectedNew,
    `Setelah Motif, kombinasi ${expectedNew.join(', ')} harus tampil`,
  );

  for (const newSku of expectedNew) {
    await systemProduct.openCreateOrEditBySku(newSku);
    const newId = await systemProduct.readProductIdFromUrl();
    expect(
      oldChildIds,
      `${newSku} harus punya product ID baru (bukan reuse child lama)`,
    ).not.toContain(newId);
  }

  return hadPopup;
}

test.describe('ETM-15495 — variant expand soft delete', () => {
  test.setTimeout(420_000);

  test('[@TC-ETM-15495-06] Zero-relation child → soft delete + regenerate saat expand Motif', async ({
    page,
  }) => {
    const userSku = 'BBB';

    await prepareSession(page, {
      companyCode: COMPANY_CODE,
      targetPath: SYSTEM_PRODUCT_DATALIST_PATH,
    });

    const systemProduct = new SystemProductPage(page);
    await createDefaultOriginSku(systemProduct, userSku);
    const clrPopup = await addClrSpIfNeeded(page, systemProduct, userSku);
    expect(
      clrPopup,
      'TC-06 CLR-SP: popup leftover tidak diharapkan (child BBB zero-relation)',
    ).toBe(false);

    const motifPopup = await expandMotifAndAssertSoftDelete(
      systemProduct,
      userSku,
      clrChildren(userSku),
    );
    expect(
      motifPopup,
      'TC-06 Motif: popup leftover tidak diharapkan (child CLR-SP zero-relation)',
    ).toBe(false);
  });

  test('[@TC-ETM-15495-07] Stok tanpa relasi dokumen → soft delete (bukan leftover)', async ({
    page,
  }) => {
    const userSku = 'CCC';
    const childWithStock = `${userSku}-biru`;

    await prepareSession(page, {
      companyCode: COMPANY_CODE,
      targetPath: SYSTEM_PRODUCT_DATALIST_PATH,
    });

    const systemProduct = new SystemProductPage(page);
    const adjustment = new AdjustmentAdditionPage(page);

    await createDefaultOriginSku(systemProduct, userSku);
    await addClrSpIfNeeded(page, systemProduct, userSku);

    await page.waitForTimeout(3_000);
    await adjustment.seedApprovedStockAtLocation({
      locationFragment: STOCK_LOCATION,
      skus: [childWithStock],
      qty: STOCK_QTY,
      description: 'ETM15495-TC07 CCC-biru Seruni Drop Off',
    });

    await systemProduct.gotoDatalist();
    await systemProduct.searchDatalist(childWithStock);
    await systemProduct.assertSkuVisibleInDatalist(childWithStock);

    const motifPopup = await expandMotifAndAssertSoftDelete(
      systemProduct,
      userSku,
      clrChildren(userSku),
    );

    if (motifPopup) {
      throw new Error(
        'TEMUAN AC: popup leftover muncul setelah Stock Addition di CCC-biru. Stock Addition kemungkinan terhitung relasi dokumen (bukan stok-only). TC-07 expected: soft delete tanpa leftover.',
      );
    }

    await systemProduct.assertSkuNotInDatalist(childWithStock);
  });
});
