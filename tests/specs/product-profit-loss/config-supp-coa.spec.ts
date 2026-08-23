import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Check and Configure Supplier Accounting COA', async ({ page }) => {
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

  const res = await page.request.get('https://api.staging.olshoperp.com/api/generalsetting/general-company?search[value]=SUPP-ONLY-1787448592996', { headers });
  const json = await res.json();
  const suppData = json.data?.[0];
  console.log('Supplier ID:', suppData?.id, 'Code:', suppData?.code);

  if (suppData?.id) {
    // Check Accounting requirements
    const accRes = await page.request.get('https://api.staging.olshoperp.com/api/generalsetting/company/' + suppData.id + '/accounting?with_supplier=true&with_customer=false', { headers });
    const accJson = await accRes.json();
    console.log('Supplier Accounting Required items:', accJson);

    const items = accJson.data?.['company-as-supplier'] || [];
    for (const item of items) {
      // Get Available COA
      const coaRes = await page.request.get('https://api.staging.olshoperp.com/api/generalsetting/general-company/select2/coa-company?transaction_coa_list_id=' + item.id, { headers });
      const coaJson = await coaRes.json();
      console.log('COA Options for item ' + item.name + ':', coaJson.data?.slice(0, 2));

      const coaId = coaJson.data?.[0]?.id;
      if (coaId) {
        // Save COA mapping via API or UI
        const saveAcc = await page.request.post('https://api.staging.olshoperp.com/api/generalsetting/company/' + suppData.id + '/accounting', {
          headers,
          data: {
            transaction_coa_list_id: item.id,
            coa_id: coaId
          }
        });
        console.log('Saved COA for', item.name, 'Status:', saveAcc.status());
      }
    }
  }
});
