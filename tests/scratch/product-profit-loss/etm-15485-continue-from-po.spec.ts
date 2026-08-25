import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';
import { PurchaseOrderPage } from '../../helpers/purchase-order';
import { PurchaseInboundPage } from '../../helpers/purchase-inbound';

/**
 * Continue ETM-15485 after fresh product+supplier created.
 * Reuses open PO-6A8AFDEE (2638) for SKU LUMI-CRAWL-1787493585192.
 */
test.describe.configure({ retries: 0 });

test('[@ETM-15485-CONT] Set PO price → approve → inbound WH level-20 → SO tax include → PPL', async ({
  page,
}) => {
  test.setTimeout(900_000);

  const companyCode = 'lumicharmsid';
  const companyId = '153';
  const sku = 'LUMI-CRAWL-1787493585192';
  const supplierName = 'PT Murni Supplier 1787493610438';
  const poId = '2638';
  const poCode = 'PO-6A8AFDEE';
  const warehouseLabel = 'WH Pusat Zona A1';

  await prepareSession(page, {
    companyCode,
    targetPath: `/supplychain/purchase-order/edit/${poId}`,
  });
  const { token } = await readAuthFromPage(page);
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': companyId,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const poPage = new PurchaseOrderPage(page);
  const inbound = new PurchaseInboundPage(page);

  // --- 1. Set PO price 80000 via API (confirmed working endpoint) ---
  console.log('=== 1. SET PO PRICE VIA API ===');
  await page.goto(`https://staging.olshoperp.com/supplychain/purchase-order/edit/${poId}`);
  await page.waitForTimeout(2000);

  await poPage.selectOpenStatus().catch(() => undefined);

  const poFresh = await (
    await page.request.get(
      `https://api.staging.olshoperp.com/api/supplychain/purchase-order/${poId}`,
      { headers },
    )
  ).json();
  const line = poFresh.data.purchase_order_details[0];
  expect(line?.id).toBeTruthy();

  if (Number(poFresh.data.grand_total_before_vat) <= 0) {
    const pricePut = await page.request.put(
      `https://api.staging.olshoperp.com/api/supplychain/purchase-order-detail/${line.id}`,
      {
        headers,
        data: {
          purchase_order_id: Number(poId),
          product_id: line.product_id,
          order_quantity: 1,
          order_quantity_unit_id: line.order_quantity_unit_id,
          product_sku_name: line.product_sku_name,
          each_price: 80000,
          each_price_before_discount_before_vat: 80000,
          purchase_discount: 0,
          modalUpdate: true,
          taxes: [
            {
              tax_id: line.taxes?.[0]?.tax_id || 23,
              value: 10,
              included: false,
              coefficient: false,
            },
          ],
        },
      },
    );
    console.log('Price PUT', pricePut.status());
  } else {
    console.log('Price already set DPP', poFresh.data.grand_total_before_vat);
  }

  await page.goto(`https://staging.olshoperp.com/supplychain/purchase-order/edit/${poId}`);
  await page.waitForTimeout(1500);
  await poPage.clickSaveAll().catch(() => undefined);
  await page.waitForTimeout(1500);

  let poData = (
    await (
      await page.request.get(
        `https://api.staging.olshoperp.com/api/supplychain/purchase-order/${poId}`,
        { headers },
      )
    ).json()
  ).data;
  console.log('PO before approve DPP', poData.grand_total_before_vat, 'status', poData.transaction_status);
  expect(Number(poData.grand_total_before_vat)).toBeGreaterThan(0);

  // --- 2. Approve PO ---
  console.log('=== 2. APPROVE PO ===');
  await page.goto('https://staging.olshoperp.com/supplychain/purchase-order');
  await page.waitForTimeout(1500);
  await poPage.clickApproveFromDatalist(poCode);
  await page.waitForTimeout(3000);
  poData = (
    await (
      await page.request.get(
        `https://api.staging.olshoperp.com/api/supplychain/purchase-order/${poId}`,
        { headers },
      )
    ).json()
  ).data;
  console.log('PO after approve', poData.transaction_status, poData.grand_total_before_vat);
  expect(poData.transaction_status).toBe('approved');

  // --- 3. Inbound with WH Pusat Zona A1 ---
  console.log('=== 3. CREATE + APPROVE INBOUND ===');
  await page.goto('https://staging.olshoperp.com/supplychain/new-purchase-inbound');
  await page.waitForTimeout(1500);
  await page.locator('button:has-text("Create"), a[href*="/create"]').first().click();
  await page.waitForURL(/\/supplychain\/new-purchase-inbound\/edit\/\d+/, { timeout: 60000 });
  await page.waitForTimeout(2500);

  await inbound.selectSupplier(supplierName);

  const whCombobox = inbound.locationDestinationCombobox;
  await expect(whCombobox).toBeVisible({ timeout: 15000 });
  await whCombobox.click({ force: true });
  await page.waitForTimeout(500);
  const whSearch = whCombobox.locator('input').first();
  if (await whSearch.count()) {
    await whSearch.fill(warehouseLabel);
    await page.waitForTimeout(1000);
  }
  const whOpt = page
    .locator('.multiselect-option')
    .filter({ hasText: /WH Pusat Zona A1|SBY-HUB/i })
    .first();
  await expect(whOpt, 'WH level-20 harus ada').toBeVisible({ timeout: 15000 });
  await whOpt.click({ force: true });
  console.log('Selected WH', warehouseLabel);

  await inbound.clickSaveAll();
  await page.waitForTimeout(2500);

  const inId = page.url().split('/').pop()!;
  const inCode = (await page.locator('#code').inputValue().catch(() => '')) || `IN-${inId}`;
  console.log('Inbound', inCode, inId);

  await inbound.openAvailablePurchaseOrderModal();
  await inbound.checkOutstandingRows([sku], poCode);
  await inbound.clickBulkUseOnOutstanding();
  await page.waitForTimeout(3000);

  await expect(
    page
      .locator('#InventoryInDetail tbody tr, #InventoryInDetail [role="row"]')
      .filter({ hasText: /1787493585192|LUMI-CRAWL/i })
      .first(),
  ).toBeVisible({ timeout: 25000 });

  await inbound.clickApproveFromShow();
  await page.waitForTimeout(3000);

  const inData = (
    await (
      await page.request.get(
        `https://api.staging.olshoperp.com/api/supplychain/mutation-inbound/${inId}`,
        { headers },
      )
    ).json()
  ).data;
  console.log(
    'Inbound approved?',
    inData.transaction_status,
    'dest',
    inData.destination?.name || inData.warehouse_destination?.name,
  );
  expect(inData.transaction_status).toBe('approved');

  // --- 4. Sales Order tax include 110000 ---
  console.log('=== 4. CREATE SO ===');
  await page.goto('https://staging.olshoperp.com/businessdevelopment/sales-order-general');
  await page.waitForTimeout(1500);
  await page
    .locator('a[href*="/sales-order-general/create"], button:has-text("Create")')
    .first()
    .click();
  await page.waitForTimeout(3000);
  await page
    .waitForURL(/\/sales-order-general\/(create|edit\/\d+)/, { timeout: 45000 })
    .catch(() => undefined);

  // Fill customer/store if still on create
  async function pickFirst(label: RegExp) {
    const box = page.locator('.multiselect, .custom-multiselect').filter({ hasText: label }).first();
    if (!(await box.count())) return;
    await box.click({ force: true });
    await page.waitForTimeout(500);
    const opt = page.locator('.multiselect-option').first();
    if (await opt.count()) await opt.click({ force: true });
    await page.waitForTimeout(500);
  }
  if (!/edit\/\d+/.test(page.url())) {
    await pickFirst(/Customer|Choose Customer/i);
    await pickFirst(/Store|Choose Store/i);
    await page.getByRole('button', { name: /Save & Next|Save All|Save/i }).first().click({ force: true });
    await page.waitForURL(/\/sales-order-general\/edit\/\d+/, { timeout: 60000 });
  }
  await page.waitForTimeout(2000);
  const soId = page.url().split('/').pop()!;
  const soCode = (await page.locator('#code').inputValue().catch(() => '')) || `SO-${soId}`;
  console.log('SO', soCode, soId);

  // Warehouse Process
  const whProcess = page
    .locator('div:has(> label:has-text("Warehouse Process")) .multiselect, [aria-placeholder*="Warehouse Process" i]')
    .first();
  if (await whProcess.count()) {
    await whProcess.click({ force: true });
    await page.waitForTimeout(400);
    const s = whProcess.locator('input').first();
    if (await s.count()) {
      await s.fill(warehouseLabel);
      await page.waitForTimeout(900);
    }
    const opt = page
      .locator('.multiselect-option')
      .filter({ hasText: /WH Pusat Zona A1|SBY-HUB/i })
      .first();
    if (await opt.count()) await opt.click({ force: true });
  }

  // Tax include
  const taxInc = page.locator('#tax_include, label:has-text("Include")').first();
  if (await taxInc.count()) await taxInc.click({ force: true });

  // Add SKU
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
  await soRow.locator('button#updateButton, button').first().click({ force: true });
  await page.waitForTimeout(1500);
  const soModal = page
    .locator('.modal.show, div[role="dialog"]:visible, .fixed.inset-0:visible')
    .last();
  await expect(soModal).toBeVisible({ timeout: 20000 });
  const soPrice = soModal
    .locator('div:has(> label:has-text("Price")) input, input#each_price, input[placeholder*="Price" i]')
    .last();
  await soPrice.fill('110000');
  await soPrice.press('Tab');
  await page.waitForTimeout(1000);
  await soModal.locator('button:has-text("Save"), button[type="submit"]').last().click({ force: true });
  await page.waitForTimeout(3000);

  const soOpen = page.locator('#open');
  if (await soOpen.count()) {
    await soOpen.check({ force: true });
    await page.waitForTimeout(1500);
  }
  const saveAll = page.getByRole('button', { name: /Save All/i }).first();
  if (await saveAll.isVisible().catch(() => false)) {
    await saveAll.click({ force: true });
    await page.waitForTimeout(3000);
  }

  // Approve SO
  const approveBtn = page.locator('button.bg-info.border-info').last();
  if (await approveBtn.isVisible({ timeout: 8000 }).catch(() => false)) {
    await approveBtn.click({ force: true });
    await page.waitForTimeout(800);
    const confirm = page.getByRole('button', { name: /^Approve$/i }).last();
    if (await confirm.isVisible({ timeout: 5000 }).catch(() => false)) {
      await confirm.click({ force: true });
    }
    await page.waitForTimeout(4000);
  }

  const soData = (
    await (
      await page.request.get(
        `https://api.staging.olshoperp.com/api/omnichannel/sales-order/${soId}`,
        { headers },
      )
    ).json()
  ).data;
  console.log('SO status', soData.transaction_status);
  console.log(
    'SO lines',
    JSON.stringify(
      (soData.sales_order_details || []).map((d: any) => ({
        sku: d.product?.sku,
        qty: d.order_quantity,
        before_vat: d.each_price_before_vat ?? d.price_before_vat,
        after_vat: d.each_price_after_vat,
        vat_included: d.vat_included,
      })),
    ),
  );

  // Wave attempt
  await page.goto(
    `https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/${soId}`,
  );
  await page.waitForTimeout(2000);
  const sendWave = page.getByRole('button', { name: /Send to Wave|Wave/i }).first();
  if (await sendWave.isVisible({ timeout: 5000 }).catch(() => false)) {
    await sendWave.click({ force: true });
    await page.waitForTimeout(3000);
  }

  // --- 5. PPL ---
  console.log('=== 5. PPL ===');
  await page.goto('https://staging.olshoperp.com/accounting/product-profit-loss');
  await page.waitForTimeout(2500);
  const tip = page.locator('.tooltip-custom-gross_sales').first();
  let tipVal = '';
  if (await tip.count()) {
    tipVal = (await tip.getAttribute('value')) || '';
    console.log('Tooltip', tipVal);
  }
  const refresh = page.getByRole('button', { name: /Refresh Data|Refresh/i }).first();
  if (await refresh.isVisible({ timeout: 4000 }).catch(() => false)) {
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
  console.log(
    'PPL UI row',
    (await pplRow.isVisible().catch(() => false))
      ? await pplRow.innerText()
      : 'not visible yet (need outbound approved)',
  );

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const pplApi = await (
    await page.request.get(
      `https://api.staging.olshoperp.com/api/accounting/product-profit-loss?start_date=${yesterday}&end_date=${today}&search[value]=${encodeURIComponent(sku)}`,
      { headers },
    )
  ).json();
  const match =
    (pplApi.data || []).find((r: any) => String(r.product_sku || r.sku || '').includes(sku)) ||
    null;
  console.log('PPL API', JSON.stringify(match, null, 2));

  console.log('=== FIXTURE ===', {
    sku,
    supplierName,
    poCode,
    poId,
    inCode,
    inId,
    soCode,
    soId,
    warehouseLabel,
  });

  if (tipVal) {
    expect(tipVal.toLowerCase()).not.toContain('including vat');
  }
  if (match) {
    expect(Number(match.total_gross_sales ?? match.gross_sales)).toBeCloseTo(100000, -2);
    expect(Number(match.total_hpp ?? match.total_cogs)).toBeCloseTo(80000, -2);
  }
});
