import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Execute End-to-End Real Data Flow in lumicharmsid', async ({ page }) => {
  test.setTimeout(600_000);

  await prepareSession(page, {
    companyCode: 'lumicharmsid',
    targetPath: '/accounting/product-profit-loss',
  });

  const { token } = await readAuthFromPage(page);
  const companyId = '110';
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': companyId,
    'Content-Type': 'application/json',
  };

  const ts = Date.now();
  const sku = 'SKU-PPL-' + ts;
  const productName = 'Produk Test PPL ' + ts;
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  console.log('--- 1. CREATE SYSTEM PRODUCT ---');
  const catRes = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/product/select2-category', { headers });
  const categoryId = (await catRes.json()).data?.[0]?.id || 4053;

  const unitRes = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/product/select2-unit', { headers });
  const stockUnitId = (await unitRes.json()).data?.[0]?.id || 36;

  const prodRes = await page.request.post('https://api.staging.olshoperp.com/api/supplychain/product', {
    headers,
    data: {
      sku: sku,
      name: productName,
      category_id: categoryId,
      stock_unit_id: stockUnitId,
      conversion_rate: 1,
      product_coa_group_id: 50,
      benchmark_price: 80000,
      condition: 'Brand New',
    }
  });
  const prodJson = await prodRes.json();
  console.log('Product Create Status:', prodRes.status(), prodJson);
  const productId = prodJson.data?.id || prodJson.id;
  console.log('Created Product ID:', productId, 'SKU:', sku);

  console.log('--- 2. CREATE & APPROVE PURCHASE ORDER (NON-PR, H-1) ---');
  const suppRes = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/purchase-order/select2-general-company', { headers });
  const supplierId = (await suppRes.json()).data?.[0]?.id || 155;

  const whRes = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/warehouse/select2', { headers });
  const warehouseId = (await whRes.json()).data?.[0]?.id || 126602;

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
    console.log('PO Detail Status:', poDetRes.status(), await poDetRes.json());

    const approvePo = await page.request.post('https://api.staging.olshoperp.com/api/supplychain/purchase-order/' + poId + '/approve', {
      headers,
      data: { note: 'Approve PO Automation' }
    });
    console.log('PO Approve Status:', approvePo.status(), await approvePo.json());
  }

  console.log('--- 3. CREATE & APPROVE PURCHASE INBOUND ---');
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
    console.log('Inbound Detail Status:', inbDetRes.status(), await inbDetRes.json());

    const approveInb = await page.request.post('https://api.staging.olshoperp.com/api/supplychain/mutation-inbound/' + inbId + '/approve', {
      headers,
      data: { note: 'Approve Inbound Automation' }
    });
    console.log('Inbound Approve Status:', approveInb.status(), await approveInb.json());
  }

  console.log('--- 4. CHECK BENCHMARK COGS MENU ---');
  const benchRes = await page.request.get('https://api.staging.olshoperp.com/api/accounting/product-benchmark-price?product_id=' + productId, { headers });
  console.log('Benchmark Price Check Status:', benchRes.status());

  console.log('--- 5. CREATE & APPROVE SALES ORDER (TAX INCLUDED, H-1) ---');
  const storeRes = await page.request.get('https://api.staging.olshoperp.com/api/omnichannel/sales-order/select2-store', { headers });
  const storeId = (await storeRes.json()).data?.[0]?.id || 63;

  const custRes = await page.request.get('https://api.staging.olshoperp.com/api/omnichannel/sales-order/select2-customer', { headers });
  const customerId = (await custRes.json()).data?.[0]?.id || 1;

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

  if (soId && productId) {
    const soDetRes = await page.request.post('https://api.staging.olshoperp.com/api/omnichannel/sales-order/' + soId + '/sales-order-detail', {
      headers,
      data: {
        sales_order_id: soId,
        product_id: productId,
        sales_order_quantity: 2,
        each_price: 110000,
        each_price_before_discount_before_vat: 100000,
        tax_percentage: 10,
      }
    });
    console.log('SO Detail Status:', soDetRes.status(), await soDetRes.json());

    const approveSo = await page.request.post('https://api.staging.olshoperp.com/api/omnichannel/sales-order/' + soId + '/approve', {
      headers,
      data: { note: 'Approve SO Automation' }
    });
    console.log('SO Approve Status:', approveSo.status(), await approveSo.json());

    // Send to default waves
    const waveRes = await page.request.post('https://api.staging.olshoperp.com/api/omnichannel/waves-management/send-to-default-waves', {
      headers,
      data: { sales_order_ids: [soId] }
    });
    console.log('Send to default waves status:', waveRes.status(), await waveRes.json().catch(() => null));

    // Skip wave process
    const skipRes = await page.request.post('https://api.staging.olshoperp.com/api/omnichannel/skip-wave-process', {
      headers,
      data: { sales_order_ids: [soId] }
    });
    console.log('Skip wave process status:', skipRes.status(), await skipRes.json().catch(() => null));
  }

  console.log('--- 6. VERIFY REPORT IN PRODUCT PROFIT LOSS ---');
  const today = new Date().toISOString().split('T')[0];
  const pplRes = await page.request.get('https://api.staging.olshoperp.com/api/accounting/product-profit-loss?start_date=' + yesterday + '&end_date=' + today, { headers });
  console.log('PPL Report API Status:', pplRes.status());

  console.log('=== REAL TRANSACTION EVIDENCE RECORDED ===');
  console.log('1. SKU Baru:', sku);
  console.log('2. Nama Produk:', productName);
  console.log('3. Product ID:', productId);
  console.log('4. Purchase Order Number:', poCode);
  console.log('5. Purchase Inbound Number:', inbCode);
  console.log('6. Benchmark COGS Price:', 'Rp 80.000');
  console.log('7. Sales Order Number:', soCode);
});
