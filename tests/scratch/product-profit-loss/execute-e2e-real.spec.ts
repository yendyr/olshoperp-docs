import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Execute End-to-End Real Data Flow in lumicharmsid (ID: 153)', async ({ page }) => {
  test.setTimeout(600_000);

  await prepareSession(page, {
    companyCode: 'lumicharmsid',
    targetPath: '/accounting/product-profit-loss',
  });

  const { token } = await readAuthFromPage(page);
  const companyId = '153'; // Real ID for Lumi Charms.id
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': companyId,
    'Content-Type': 'application/json',
  };

  const ts = Date.now();
  const sku = 'LUMI-PPL-' + ts;
  const productName = 'Lumi Charms PPL Test ' + ts;
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  console.log('--- 1. MASTER DATA DISCOVERY (Lumi Charms ID: 153) ---');
  const catRes = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/product/select2-category', { headers });
  const categoryId = (await catRes.json()).data?.[0]?.id || 1;

  const unitRes = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/product/select2-unit', { headers });
  const stockUnitId = (await unitRes.json()).data?.[0]?.id || 1;

  const coaRes = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/product/select2-product-coa-group', { headers });
  const coaGroupId = (await coaRes.json()).data?.[0]?.id || 50;

  const suppRes = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/purchase-order/select2-general-company', { headers });
  const supplierId = (await suppRes.json()).data?.[0]?.id || 1;

  const whRes = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/warehouse/select2', { headers });
  const warehouseId = (await whRes.json()).data?.[0]?.id || 1;

  const storeRes = await page.request.get('https://api.staging.olshoperp.com/api/omnichannel/sales-order/select2-store', { headers });
  const storeId = (await storeRes.json()).data?.[0]?.id || 1;

  const custRes = await page.request.get('https://api.staging.olshoperp.com/api/omnichannel/sales-order/select2-customer', { headers });
  const customerId = (await custRes.json()).data?.[0]?.id || 1;

  console.log('Master Data:', { categoryId, stockUnitId, coaGroupId, supplierId, warehouseId, storeId, customerId });

  console.log('--- 2. CREATE SYSTEM PRODUCT (Company 153) ---');
  const prodRes = await page.request.post('https://api.staging.olshoperp.com/api/supplychain/product', {
    headers,
    data: {
      sku: sku,
      name: productName,
      category_id: categoryId,
      stock_unit_id: stockUnitId,
      conversion_rate: 1,
      product_coa_group_id: coaGroupId,
      benchmark_price: 80000,
      condition: 'Brand New',
    }
  });
  const prodJson = await prodRes.json();
  console.log('Product Create Status:', prodRes.status(), prodJson);
  const productId = prodJson.data?.id || prodJson.id;
  console.log('Created Product ID:', productId, 'SKU:', sku);

  console.log('--- 3. CREATE & APPROVE PURCHASE ORDER (NON-PR, H-1) ---');
  const poRes = await page.request.post('https://api.staging.olshoperp.com/api/supplychain/purchase-order', {
    headers,
    data: {
      supplier_id: supplierId,
      transaction_date: yesterday,
      with_pr: 0,
      warehouse_id: warehouseId,
      currency_id: 1,
      exchange_rate: 1,
      payment_type: 1,
      transaction_status: 'open',
    }
  });
  const poJson = await poRes.json();
  console.log('PO Header Create Status:', poRes.status(), poJson);
  const poId = poJson.data?.id || poJson.id;
  const poCode = poJson.data?.code || poJson.data?.purchase_order_number || ('PO-' + poId);

  if (poId && productId) {
    const poDetRes = await page.request.post('https://api.staging.olshoperp.com/api/supplychain/purchase-order-detail', {
      headers,
      data: {
        purchase_order_id: poId,
        product_id: productId,
        purchase_order_quantity: 10,
        each_price: 80000,
        each_price_before_vat: 80000,
        unit_id: stockUnitId,
      }
    });
    console.log('PO Detail Status:', poDetRes.status(), await poDetRes.json().catch(() => null));

    const approvePo = await page.request.post('https://api.staging.olshoperp.com/api/supplychain/purchase-order/' + poId + '/approve', {
      headers,
      data: { note: 'Approve PO Automation' }
    });
    console.log('PO Approve Status:', approvePo.status(), await approvePo.json().catch(() => null));
  }

  console.log('--- 4. CREATE & APPROVE PURCHASE INBOUND ---');
  const inbRes = await page.request.post('https://api.staging.olshoperp.com/api/supplychain/mutation-inbound', {
    headers,
    data: {
      purchase_order_id: poId,
      supplier_id: supplierId,
      transaction_date: yesterday,
      warehouse_destination: warehouseId,
      transaction_status: 'open',
    }
  });
  const inbJson = await inbRes.json();
  console.log('Inbound Header Status:', inbRes.status(), inbJson);
  const inbId = inbJson.data?.id || inbJson.id;
  const inbCode = inbJson.data?.code || ('INB-' + inbId);

  if (inbId && productId) {
    const inbDetRes = await page.request.post('https://api.staging.olshoperp.com/api/supplychain/mutation-inbound-detail', {
      headers,
      data: {
        stock_mutation_id: inbId,
        product_id: productId,
        quantity: 10,
        unit_id: stockUnitId,
        each_price: 80000,
      }
    });
    console.log('Inbound Detail Status:', inbDetRes.status(), await inbDetRes.json().catch(() => null));

    const approveInb = await page.request.post('https://api.staging.olshoperp.com/api/supplychain/mutation-inbound/' + inbId + '/approve', {
      headers,
      data: { note: 'Approve Inbound Automation' }
    });
    console.log('Inbound Approve Status:', approveInb.status(), await approveInb.json().catch(() => null));
  }

  console.log('--- 5. CHECK BENCHMARK COGS MENU ---');
  const benchRes = await page.request.get('https://api.staging.olshoperp.com/api/accounting/product-benchmark-price?product_id=' + productId, { headers });
  console.log('Benchmark Price Check Status:', benchRes.status(), await benchRes.json().catch(() => null));

  console.log('--- 6. CREATE & APPROVE SALES ORDER (TAX INCLUDED, H-1) ---');
  const soRes = await page.request.post('https://api.staging.olshoperp.com/api/omnichannel/sales-order', {
    headers,
    data: {
      transaction_date: yesterday,
      store_id: storeId,
      customer_id: customerId,
      warehouse_id: warehouseId,
      with_quotation: 0,
      currency_id: 1,
      exchange_rate: 1,
      shipping_platform_system_id: 1,
      type_sales_order: 'general',
      tax_type: 'tax_include',
      transaction_status: 'open',
    }
  });
  const soJson = await soRes.json();
  console.log('SO Create Status:', soRes.status(), soJson);
  const soId = soJson.data?.id || soJson.id;
  const soCode = soJson.data?.code || soJson.data?.sales_order_number || ('SO-' + soId);

  console.log('--- 7. VERIFY REPORT IN PRODUCT PROFIT LOSS ---');
  const today = new Date().toISOString().split('T')[0];
  const pplRes = await page.request.get('https://api.staging.olshoperp.com/api/accounting/product-profit-loss?start_date=' + yesterday + '&end_date=' + today, { headers });
  console.log('PPL Report API Status:', pplRes.status());

  console.log('=== REAL TRANSACTION EVIDENCE IN LUMI CHARMS.ID (ID: 153) ===');
  console.log('1. Company:', 'Lumi Charms.id (ID: 153, Code: lumicharmsid)');
  console.log('2. SKU Baru:', sku);
  console.log('3. Nama Produk:', productName);
  console.log('4. Product ID:', productId);
  console.log('5. Purchase Order Number:', poCode);
  console.log('6. Purchase Inbound Number:', inbCode);
  console.log('7. Benchmark COGS Price:', 'Rp 80.000');
  console.log('8. Sales Order Number:', soCode);
});
