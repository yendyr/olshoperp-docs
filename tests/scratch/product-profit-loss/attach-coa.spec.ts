import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Check COAs in Lumi Charms', async ({ page }) => {
  await prepareSession(page, {
    companyCode: 'lumicharmsid',
    targetPath: '/generalsetting/general-company',
  });

  const { token } = await readAuthFromPage(page);
  const companyId = '153';
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': companyId,
    'Content-Type': 'application/json',
  };

  const coaRes = await page.request.get('https://api.staging.olshoperp.com/api/accounting/coa/select2-child', { headers });
  const coaJson = await coaRes.json();
  console.log('Child COAs in company 153:', coaJson.data?.slice(0, 5));

  // Get Transaction COA List IDs for supplier
  const tclRes = await page.request.get('https://api.staging.olshoperp.com/api/generalsetting/company/1539/accounting?with_supplier=true&with_customer=false', { headers });
  const tclJson = await tclRes.json();
  const items = tclJson.data?.['company-as-supplier'] || [];
  console.log('Required TCL items for supplier:', items.map((i: any) => ({ id: i.id, name: i.name })));

  const firstCoaId = coaJson.data?.[0]?.id;
  if (firstCoaId) {
    for (const item of items) {
      const saveAcc = await page.request.post('https://api.staging.olshoperp.com/api/generalsetting/company/1539/accounting', {
        headers,
        data: {
          transaction_coa_list_id: item.id,
          coa_id: firstCoaId
        }
      });
      console.log('Attached COA', firstCoaId, 'to item', item.id, 'Status:', saveAcc.status());
    }
  }

  // Now verify if supplier appears in select2-general-company
  const suppRes = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/purchase-order/select2-general-company?q=PT Murni Supplier', { headers });
  console.log('Supplier in PO select2 after COA attachment:', await suppRes.json());
});
