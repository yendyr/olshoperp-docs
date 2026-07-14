import { test } from '@playwright/test';
import { prepareSession } from '../../../helpers/company-access';
import {
  DetailSortingMenuConfig,
  DetailSortingPage,
} from '../../../helpers/detail-sorting';

/**
 * ETM-15214 — Regresi urutan baris detail transaksi SCM.
 * Company: DEV-STG (13) | staging.olshoperp.com
 *
 * PASS: last-in-first-row — baris terakhir ditambahkan muncul di paling atas.
 *       Setelah add [A,B,C], expected atas→bawah = [C,B,A].
 * FAIL: actual order + posisi last-added dicatat di pesan assertion.
 */
test.describe('ETM-15214 — Detail table row sorting regression', () => {
  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'DEV-STG',
      targetPath: '/supplychain/purchase-order',
    });
  });

  const menus: DetailSortingMenuConfig[] = [
    {
      name: '1. Purchase Order',
      editPath: '/supplychain/purchase-order/edit/2350',
      trxCode: 'PO-6A437282',
      sectionId: 'PurchaseOrderDetail',
      accordionTitle: 'Purchase Order Detail',
      // Clarified: SKU112 (bukan SKU122)
      identifiers: ['SKU112', 'SKU66200', 'BIP-HJOV9', 'SKU-0708', 'SKU1', 'SKU6620'],
      addMode: 'po-detail',
    },
    {
      name: '2. Outbound External',
      editPath: '/supplychain/mutation-outbound/edit/87075',
      trxCode: 'OT-6A4E1B87',
      sectionId: 'DatalistDetail',
      accordionTitle: 'Outbound External Detail By SO',
      accordionFallbacks: ['Outbound External Detail'],
      identifiers: [
        'SO-6JJHMV4V',
        'SO-7F1FYJKV',
        'SO-6JJIEUN9',
        'SO-6JJIP4DS',
        'SO-6JJHJUOR',
      ],
      multiselectPlaceholder: /select sales order/i,
      addMode: 'multiselect',
    },
    {
      name: '3. Purchase Inbound',
      editPath: '/supplychain/mutation-inbound/edit/86830',
      trxCode: 'IN-6A461222',
      sectionId: 'InventoryInDetail',
      accordionTitle: 'Inbound Detail',
      // Test data ada typo/zero-pad; SKU aktual staging: sku-testing-0NN
      identifiers: [
        'sku-testing-041',
        'sku-testing-046',
        'sku-testing-033',
        'sku-testing-037',
        'sku-testing-028',
      ],
      addMode: 'inbound-outstanding',
    },
    {
      name: '4. BETA New Purchase Inbound',
      editPath: '/supplychain/new-purchase-inbound/edit/86830',
      trxCode: 'IN-6A461222',
      sectionId: 'InventoryInDetail',
      accordionTitle: 'Inbound Detail',
      identifiers: [
        'sku-testing-041',
        'sku-testing-046',
        'sku-testing-033',
        'sku-testing-037',
        'sku-testing-028',
      ],
      addMode: 'inbound-outstanding',
    },
    {
      name: '5. Transfer Internal',
      editPath: '/supplychain/mutation-transfer-internal/edit/86886',
      trxCode: 'TFI-6A472C53',
      sectionId: 'DatalistDetail',
      accordionTitle: 'Product Transfer Detail',
      identifiers: ['SKU-0708', 'SKU112', 'SKU1', 'PRL-NKL-24006'],
      addMode: 'multiselect',
    },
    {
      name: '6. Transfer External',
      editPath: '/supplychain/mutation-transfer-external/edit/87039',
      trxCode: 'TFE-6A4DA2E2',
      sectionId: 'DatalistDetail',
      accordionTitle: 'Product Transfer Detail',
      identifiers: [
        'JOGGER485',
        'JOGGER500',
        'SKU-Rok-087',
        'JOGGER691',
        'JOGGER689',
      ],
      addMode: 'multiselect',
    },
    {
      name: '7. Assembly',
      editPath: '/supplychain/assembly/edit/302',
      trxCode: 'AS-6A4C78DD',
      sectionId: 'ProductDetails',
      accordionTitle: 'Assembly Detail',
      identifiers: ['MTRS-WTR', 'DRAWKIT-KIDZ'],
      addMode: 'multiselect',
      reverseSecondPass: true,
    },
  ];

  for (const menu of menus) {
    test(`[@ETM-15214] ${menu.name} — urutan baris detail`, async ({ page }) => {
      test.setTimeout(600_000);

      const sorting = new DetailSortingPage(page);
      await sorting.runSortingRegression(menu);
    });
  }
});
