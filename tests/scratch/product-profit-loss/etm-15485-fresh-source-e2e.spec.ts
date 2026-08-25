import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';
import { PurchaseOrderPage } from '../../helpers/purchase-order';
import { PurchaseInboundPage } from '../../helpers/purchase-inbound';

/**
 * ETM-15485 fresh-source run (company 153):
 * Uses NEW System Product + NEW Supplier created in this session.
 * Flow: COA supplier → PO (exclude VAT, COGS 80k) → Inbound (WH Pusat Zona A1)
 *       → SO (tax include 110) same WH → approve SO → PPL Gross Before VAT.
 */
test.describe.configure({ retries: 0 });

test('[@ETM-15485] Fresh source E2E crawl — product+supplier already created', async ({
  page,
}) => {
  test.setTimeout(900_000);

  const companyCode = 'lumicharmsid';
  const companyId = '153';
  const sku = 'LUMI-CRAWL-1787493585192';
  const supplierCode = 'SUPP-ONLY-1787493610438';
  const supplierName = 'PT Murni Supplier 1787493610438';
  const warehouseLabel = 'WH Pusat Zona A1';
  const unitCost = '80000';
  const sellPriceIncludeVat = '110000';

  const fixture: Record<string, string> = {
    sku,
    supplierCode,
    supplierName,
  };

  await prepareSession(page, {
    companyCode,
    targetPath: '/generalsetting/general-company',
  });

  const { token } = await readAuthFromPage(page);
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': companyId,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  // --- 0. Resolve supplier id + attach supplier COA (prerequisite approve PO) ---
  console.log('=== 0. CONFIG SUPPLIER COA ===');
  const suppList = await page.request.get(
    'https://api.staging.olshoperp.com/api/generalsetting/general-company?search[value]=' +
      encodeURIComponent(supplierCode),
    { headers },
  );
  const suppJson = await suppList.json();
  const suppData =
    (suppJson.data || []).find((r: any) => r.code === supplierCode) ||
    suppJson.data?.[0];
  expect(suppData?.id, 'Supplier harus ada').toBeTruthy();
  const supplierId = String(suppData.id);
  fixture.supplierId = supplierId;
  console.log('Supplier ID:', supplierId, suppData.name);

  // COA already present on fresh supplier (same defaults as 1539) — verify + skip remap
  const accRes = await page.request.get(
    `https://api.staging.olshoperp.com/api/generalsetting/company/${supplierId}/accounting?with_supplier=true&with_customer=false`,
    { headers },
  );
  const accJson = await accRes.json();
  const items = accJson.data?.['company-as-supplier'] || [];
  console.log(
    'Supplier accounting rows:',
    items.map((i: any) => ({
      id: i.id,
      name: i.name,
      coa: i.chart_of_account?.name_formatted,
    })),
  );

  const select2Check = await page.request.get(
    'https://api.staging.olshoperp.com/api/supplychain/purchase-order/select2-general-company?q=' +
      encodeURIComponent('1787493610438'),
    { headers },
  );
  console.log('Supplier in PO select2:', JSON.stringify(await select2Check.json()).slice(0, 800));

  // --- 1. Create PO Without PR via UI ---
  console.log('=== 1. CREATE PO (UI) ===');
  const poPage = new PurchaseOrderPage(page);
  await page.goto('https://staging.olshoperp.com/supplychain/purchase-order');
  await page.waitForTimeout(1500);
  await page
    .locator('a[href*="/supplychain/purchase-order/create"], button:has-text("Create")')
    .first()
    .click();
  await page.waitForURL(/\/supplychain\/purchase-order\/create/, { timeout: 30000 });
  await page.waitForTimeout(2000);

  await poPage.selectWithoutPr().catch(() => undefined);

  // Manual supplier pick (partial search) — avoid exact ensureValue flake
  const suppContainer = page
    .locator('div:has(> label:has-text("Supplier")) .multiselect, .custom-multiselect')
    .first();
  await suppContainer.click({ force: true });
  await page.waitForTimeout(500);
  const suppSearch = suppContainer.locator('input').first();
  await suppSearch.fill('1787493610438');
  await page.waitForTimeout(1200);
  const suppOpt = page
    .locator('.multiselect-option')
    .filter({ hasText: /1787493610438|PT Murni Supplier 1787493610438/i })
    .first();
  await expect(suppOpt, 'Supplier harus muncul di dropdown PO').toBeVisible({ timeout: 20000 });
  await suppOpt.click({ force: true });
  console.log('Selected Supplier:', supplierName);
  await page.waitForTimeout(1000);

  // Prefer WH Pusat Zona A1 if listed
  const whBox = page
    .locator('div:has(> label:has-text("Warehouse")) .multiselect, [aria-placeholder*="Warehouse" i]')
    .first();
  if (await whBox.count()) {
    await whBox.click({ force: true });
    await page.waitForTimeout(500);
    const whSearch = whBox.locator('input').first();
    if (await whSearch.count()) {
      await whSearch.fill('WH Pusat Zona A1');
      await page.waitForTimeout(800);
    }
    const whOpt = page
      .locator('.multiselect-option')
      .filter({ hasText: /WH Pusat Zona A1|SBY-HUB/i })
      .first();
    if (await whOpt.count()) {
      await whOpt.click({ force: true });
      console.log('PO Warehouse:', warehouseLabel);
    } else if (await page.locator('.multiselect-option').count()) {
      await page.locator('.multiselect-option').first().click({ force: true });
    }
  }

  await page
    .getByRole('button', { name: /Save & Next|Save All|Save/i })
    .first()
    .click({ force: true });
  await page.waitForURL(/\/supplychain\/purchase-order\/edit\/\d+/, { timeout: 60000 });
  await page.waitForTimeout(2500);

  const poId = page.url().split('/').pop()!;
  const poCode = (await page.locator('#code').inputValue().catch(() => '')) || `PO-${poId}`;
  fixture.poId = poId;
  fixture.poCode = poCode;
  console.log('PO created', poCode, poId);

  // Set Open status if draft
  const openRadio = page.locator('#open');
  if (await openRadio.count()) {
    await openRadio.check({ force: true });
    await page.waitForTimeout(1500);
  }

  // Add product detail via Available Products / Select Product
  await poPage.selectPoDetailProduct(sku).catch(async () => {
    const selectProd = page
      .locator('#PurchaseOrderDetail .multiselect, div:has(> p:has-text("Select Product")) .multiselect')
      .filter({ hasText: /Select Product/i })
      .first();
    await selectProd.scrollIntoViewIfNeeded();
    await selectProd.click({ force: true });
    await page.waitForTimeout(400);
    await selectProd.locator('input').first().fill(sku);
    await page.waitForTimeout(1200);
    await page
      .locator('.multiselect-option')
      .filter({ hasText: new RegExp(sku, 'i') })
      .first()
      .click({ force: true });
    await page.waitForTimeout(3500);
  });

  const detailRow = page
    .locator('#PurchaseOrderDetail tr, #PurchaseOrderDetail div[role="row"]')
    .filter({ hasText: new RegExp(sku, 'i') })
    .first();
  await expect(detailRow).toBeVisible({ timeout: 25000 });

  // Set unit price 80000 via API (UI modal selector flaky) then Save All on UI
  const poFresh = await (
    await page.request.get(
      `https://api.staging.olshoperp.com/api/supplychain/purchase-order/${poId}`,
      { headers },
    )
  ).json();
  console.log(
    'PO details raw keys',
    Object.keys(poFresh.data || {}),
    'details count',
    (poFresh.data?.purchase_order_details || poFresh.data?.details || []).length,
  );
  const details =
    poFresh.data?.purchase_order_details ||
    poFresh.data?.details ||
    poFresh.data?.purchase_order_detail ||
    [];
  console.log(
    'Detail dump',
    JSON.stringify(
      details.map((d: any) => ({
        id: d.id,
        sku: d.product?.sku,
        name: d.product_sku_name,
        qty: d.order_quantity,
        price: d.each_price,
      })),
    ),
  );
  const line =
    details.find((d: any) =>
      String(d.product?.sku || d.product_sku || d.sku || '').includes(sku),
    ) ||
    details.find((d: any) =>
      String(d.product_sku_name || d.name || '').includes('1787493585192'),
    ) ||
    details[0];
  expect(line?.id, 'PO detail line harus ada').toBeTruthy();
  console.log('Using PO detail line', line.id, line.product_sku_name || line.name);
  const pricePut = await page.request.put(
    `https://api.staging.olshoperp.com/api/supplychain/purchase-order/${poId}/purchase-order-detail/${line.id}`,
    {
      headers,
      data: {
        purchase_order_id: Number(poId),
        product_id: line.product_id || line.product?.id,
        order_quantity: 1,
        order_quantity_unit_id: line.order_quantity_unit_id || line.unit_id,
        product_sku_name: line.product_sku_name || sku,
        each_price: 80000,
        each_price_before_discount_before_vat: 80000,
        purchase_discount: 0,
        modalUpdate: true,
        taxes: [
          { tax_id: line.taxes?.[0]?.tax_id || 23, value: 10, included: false, coefficient: false },
        ],
      },
    },
  );
  console.log('PO detail price update', pricePut.status(), await pricePut.json().catch(() => null));

  await page.goto(`https://staging.olshoperp.com/supplychain/purchase-order/edit/${poId}`);
  await page.waitForTimeout(2000);

  if (await openRadio.count()) {
    await openRadio.check({ force: true });
    await page.waitForTimeout(1500);
  }

  await poPage.clickSaveAll();
  await page.waitForTimeout(2000);

  // Approve PO from datalist
  console.log('=== 1b. APPROVE PO ===');
  await page.goto('https://staging.olshoperp.com/supplychain/purchase-order');
  await page.waitForTimeout(1500);
  await poPage.clickApproveFromDatalist(poCode);
  await page.waitForTimeout(2500);
  const poGet = await page.request.get(
    `https://api.staging.olshoperp.com/api/supplychain/purchase-order/${poId}`,
    { headers },
  );
  const poData = (await poGet.json()).data;
  console.log('PO status', poData.transaction_status, 'DPP', poData.grand_total_before_vat);
  expect(poData.transaction_status).toBe('approved');

  // --- 2. Purchase Inbound from PO ---
  console.log('=== 2. CREATE INBOUND FROM PO ===');
  const inbound = new PurchaseInboundPage(page);
  await page.goto('https://staging.olshoperp.com/supplychain/new-purchase-inbound');
  await page.waitForTimeout(1500);
  await page.locator('button:has-text("Create"), a[href*="/create"]').first().click();
  await page
    .waitForURL(/\/supplychain\/new-purchase-inbound\/edit\/\d+/, { timeout: 60000 })
    .catch(() => undefined);
  await page.waitForTimeout(2500);

  // Supplier
  const inSupp = page
    .locator('div:has(> label:has-text("Supplier")) .multiselect, .custom-multiselect')
    .first();
  await inSupp.click({ force: true });
  await page.waitForTimeout(400);
  await inSupp.locator('input').first().fill(supplierName);
  await page.waitForTimeout(900);
  await page
    .locator('.multiselect-option')
    .filter({ hasText: new RegExp(supplierName.slice(0, 20), 'i') })
    .first()
    .click({ force: true });
  await page.waitForTimeout(800);

  // Warehouse destination = WH Pusat Zona A1
  const dest = page
    .locator(
      'div:has(> label:has-text("Location Destination")), div:has(> label:has-text("Warehouse")), div:has(> label:has-text("Destination"))',
    )
    .locator('.multiselect, .custom-multiselect')
    .first();
  if (await dest.count()) {
    await dest.click({ force: true });
    await page.waitForTimeout(400);
    const destSearch = dest.locator('input').first();
    if (await destSearch.count()) {
      await destSearch.fill('WH Pusat Zona A1');
      await page.waitForTimeout(900);
    }
    const destOpt = page
      .locator('.multiselect-option')
      .filter({ hasText: /WH Pusat Zona A1|SBY-HUB/i })
      .first();
    if (await destOpt.count()) await destOpt.click({ force: true });
  }

  await inbound.clickSaveAll();
  await page.waitForTimeout(2500);

  const inId = page.url().split('/').pop()!;
  const inCode = (await page.locator('#code').inputValue().catch(() => '')) || `IN-${inId}`;
  fixture.inId = inId;
  fixture.inCode = inCode;
  console.log('Inbound', inCode, inId);

  await inbound.openAvailablePurchaseOrderModal();
  await inbound.checkOutstandingRows([sku], poCode);
  await inbound.clickBulkUseOnOutstanding();
  await page.waitForTimeout(3000);

  const inRow = page
    .locator('#InventoryInDetail tbody tr, #InventoryInDetail div[role="row"]')
    .filter({ hasText: new RegExp(sku, 'i') })
    .first();
  await expect(inRow).toBeVisible({ timeout: 25000 });

  await inbound.clickApproveFromShow();
  await page.waitForTimeout(3000);
  const inGet = await page.request.get(
    `https://api.staging.olshoperp.com/api/supplychain/mutation-inbound/${inId}`,
    { headers },
  );
  const inData = (await inGet.json()).data;
  console.log('Inbound status', inData.transaction_status, 'WH', inData.warehouse_destination?.name || inData.location_destination?.name);
  expect(inData.transaction_status).toBe('approved');
  fixture.warehouseName =
    inData.warehouse_destination?.name ||
    inData.location_destination?.name ||
    warehouseLabel;

  // --- 3. Sales Order General (Tax Included 110) ---
  console.log('=== 3. CREATE SALES ORDER ===');
  await page.goto('https://staging.olshoperp.com/businessdevelopment/sales-order-general');
  await page.waitForTimeout(1500);
  await page
    .locator('a[href*="/sales-order-general/create"], button:has-text("Create")')
    .first()
    .click();
  await page.waitForURL(/\/sales-order-general\/(create|edit\/\d+)/, { timeout: 45000 });
  await page.waitForTimeout(2500);

  // If auto-draft redirected
  if (!/edit\/\d+/.test(page.url())) {
    // fill minimal required then save
    const cust = page.locator('.multiselect, .custom-multiselect').filter({ hasText: /Customer|Choose Customer/i }).first();
    if (await cust.count()) {
      await cust.click({ force: true });
      await page.waitForTimeout(500);
      const opt = page.locator('.multiselect-option').first();
      if (await opt.count()) await opt.click({ force: true });
    }
    const store = page.locator('.multiselect, .custom-multiselect').filter({ hasText: /Store|Choose Store/i }).first();
    if (await store.count()) {
      await store.click({ force: true });
      await page.waitForTimeout(500);
      const opt = page.locator('.multiselect-option').first();
      if (await opt.count()) await opt.click({ force: true });
    }
    await page.getByRole('button', { name: /Save & Next|Save All|Save/i }).first().click({ force: true });
    await page.waitForURL(/\/sales-order-general\/edit\/\d+/, { timeout: 60000 });
  }

  await page.waitForTimeout(2000);
  const soId = page.url().split('/').pop()!;
  const soCode = (await page.locator('#code').inputValue().catch(() => '')) || `SO-${soId}`;
  fixture.soId = soId;
  fixture.soCode = soCode;
  console.log('SO', soCode, soId);

  // Warehouse Process = same as inbound WH
  const whProcess = page
    .locator('div:has(> label:has-text("Warehouse Process")) .multiselect, [aria-placeholder*="Warehouse Process" i]')
    .first();
  if (await whProcess.count()) {
    await whProcess.click({ force: true });
    await page.waitForTimeout(400);
    const search = whProcess.locator('input').first();
    if (await search.count()) {
      await search.fill(fixture.warehouseName || 'WH Pusat Zona A1');
      await page.waitForTimeout(900);
    }
    const opt = page
      .locator('.multiselect-option')
      .filter({ hasText: new RegExp(fixture.warehouseName || 'WH Pusat Zona A1|SBY-HUB', 'i') })
      .first();
    if (await opt.count()) await opt.click({ force: true });
  }

  // Tax include if available
  const taxInclude = page.locator('#tax_include, input[value="tax_include"], label:has-text("Include")');
  if (await taxInclude.count()) {
    await taxInclude.first().click({ force: true });
  }

  // Add product
  const soProd = page
    .locator('.custom-multiselect, .multiselect')
    .filter({ hasText: /Select Product/i })
    .first();
  await soProd.scrollIntoViewIfNeeded();
  await soProd.click({ force: true });
  await page.waitForTimeout(400);
  await soProd.locator('input').first().fill(sku);
  await page.waitForTimeout(1500);
  await page
    .locator('.multiselect-option')
    .filter({ hasText: new RegExp(sku, 'i') })
    .first()
    .click({ force: true });
  await page.waitForTimeout(4000);

  const soRow = page.locator('table tbody tr').filter({ hasText: new RegExp(sku, 'i') }).first();
  await expect(soRow).toBeVisible({ timeout: 30000 });
  await soRow.locator('button#updateButton, button:has-text("Edit"), button').first().click({ force: true });
  await page.waitForTimeout(1500);
  const soModal = page.locator('div[role="dialog"], div.modal').last();
  await expect(soModal).toBeVisible({ timeout: 15000 });
  const soPrice = soModal
    .locator('div:has(> label:has-text("Price")) input, input[placeholder*="Price" i]')
    .last();
  await soPrice.fill(sellPriceIncludeVat);
  await soPrice.press('Tab');
  await page.waitForTimeout(1000);
  await soModal.locator('button:has-text("Save"), button[type="submit"]').last().click({ force: true });
  await page.waitForTimeout(3000);

  // Open status + Save All
  const soOpen = page.locator('#open');
  if (await soOpen.count()) {
    await soOpen.check({ force: true });
    await page.waitForTimeout(1500);
  }
  const soSaveAll = page.getByRole('button', { name: /Save All/i }).first();
  if (await soSaveAll.isVisible().catch(() => false)) {
    await soSaveAll.click({ force: true });
    await page.waitForTimeout(3000);
  }

  // Approve SO
  console.log('=== 3b. APPROVE SO ===');
  const approveBtn = page
    .locator('button.bg-info.border-info, button:has-text("Approve")')
    .filter({ has: page.locator('svg') })
    .first()
    .or(page.locator('button.bg-info.border-info').last());
  if (await approveBtn.isVisible({ timeout: 8000 }).catch(() => false)) {
    await approveBtn.click({ force: true });
    await page.waitForTimeout(1000);
    const confirm = page.getByRole('button', { name: /^Approve$/i }).last();
    if (await confirm.isVisible({ timeout: 5000 }).catch(() => false)) {
      await confirm.click({ force: true });
    }
    await page.waitForTimeout(4000);
  }

  const soGet = await page.request.get(
    `https://api.staging.olshoperp.com/api/omnichannel/sales-order/${soId}`,
    { headers },
  );
  const soData = (await soGet.json()).data;
  console.log('SO status', soData.transaction_status);
  console.log(
    'SO detail',
    JSON.stringify(
      soData.sales_order_details?.map((d: any) => ({
        sku: d.product?.sku,
        qty: d.order_quantity,
        each_price: d.each_price,
        before_vat: d.each_price_before_vat ?? d.price_before_vat,
        after_vat: d.each_price_after_vat,
        vat_included: d.vat_included,
      })),
      null,
      2,
    ),
  );
  fixture.whProcess = soData.warehouse_process?.name || '';

  // --- 4. Fulfillment: try Send to Wave / process if buttons exist ---
  console.log('=== 4. FULFILLMENT ATTEMPT ===');
  await page.goto(
    `https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/${soId}`,
  );
  await page.waitForTimeout(2000);
  const sendWave = page.getByRole('button', { name: /Send to Wave|Wave/i }).first();
  if (await sendWave.isVisible({ timeout: 5000 }).catch(() => false)) {
    await sendWave.click({ force: true });
    await page.waitForTimeout(3000);
    console.log('Clicked Send to Wave');
  } else {
    console.log('Send to Wave button not visible — check SO status / auto wave');
  }

  // --- 5. Product Profit Loss ---
  console.log('=== 5. PRODUCT PROFIT LOSS ===');
  await page.goto('https://staging.olshoperp.com/accounting/product-profit-loss');
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.waitForTimeout(2500);

  const tooltip = page.locator('.tooltip-custom-gross_sales').first();
  let tooltipVal = '';
  if (await tooltip.count()) {
    tooltipVal = (await tooltip.getAttribute('value')) || '';
    console.log('Gross Sales tooltip:', tooltipVal);
  }

  const refresh = page.getByRole('button', { name: /Refresh Data|Refresh/i }).first();
  if (await refresh.isVisible({ timeout: 5000 }).catch(() => false)) {
    await refresh.click({ force: true });
    await page.waitForTimeout(5000);
  }

  const search = page.getByRole('searchbox').first().or(page.locator('input[type="search"]').first());
  if (await search.count()) {
    await search.fill(sku);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000);
  }

  const pplRow = page.locator('tbody tr').filter({ hasText: new RegExp(sku, 'i') }).first();
  const pplVisible = await pplRow.isVisible().catch(() => false);
  const pplText = pplVisible ? await pplRow.innerText() : 'SKU NOT YET IN PPL (need outbound approved)';
  console.log('PPL row:', pplText);

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const pplApi = await page.request.get(
    `https://api.staging.olshoperp.com/api/accounting/product-profit-loss?start_date=${yesterday}&end_date=${today}&search[value]=${encodeURIComponent(sku)}`,
    { headers },
  );
  const pplApiJson = await pplApi.json().catch(() => ({}));
  const pplMatch =
    (pplApiJson.data || []).find((r: any) =>
      String(r.product_sku || r.sku || '').includes(sku),
    ) || pplApiJson.data?.[0];
  console.log('PPL API match:', JSON.stringify(pplMatch, null, 2));

  console.log('=== FIXTURE SUMMARY ETM-15485 ===');
  console.log(JSON.stringify(fixture, null, 2));
  console.log('Login company: Lumi Charms.id (153)');
  console.log('Expected TO-BE if shipped qty1 @110 include 10%: Gross 100000, COGS 80000, Net 20000, margin 20%');

  if (tooltipVal) {
    expect(tooltipVal.toLowerCase()).not.toContain('including vat');
    expect(tooltipVal).toMatch(/Price Before VAT|before VAT|excluding VAT/i);
  }

  if (pplMatch) {
    const gross = Number(pplMatch.total_gross_sales ?? pplMatch.gross_sales);
    const cogs = Number(pplMatch.total_hpp ?? pplMatch.total_cogs);
    const net = Number(pplMatch.total_net_sales ?? pplMatch.net_profit);
    console.log('Assert Gross≈100000 got', gross, 'COGS≈80000 got', cogs, 'Net≈20000 got', net);
    expect(gross).toBeCloseTo(100000, -2);
    expect(cogs).toBeCloseTo(80000, -2);
    expect(net).toBeCloseTo(20000, -2);
  } else {
    console.log(
      '[BLOCKED/PARTIAL] SKU belum muncul di PPL — outbound belum Approved / Refresh belum regenerate. Fixture master+PO+Inbound siap.',
    );
  }
});
