import { test } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('probe coa for supplier 1540', async ({ page }) => {
  await prepareSession(page, { companyCode: 'lumicharmsid', targetPath: '/' });
  const { token } = await readAuthFromPage(page);
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': '153',
    Accept: 'application/json',
  };

  const urls = [
    'https://api.staging.olshoperp.com/api/accounting/coa/select2-child',
    'https://api.staging.olshoperp.com/api/accounting/coa/select2-child?q=a',
    'https://api.staging.olshoperp.com/api/generalsetting/company/1539/accounting?with_supplier=true&with_customer=false',
    'https://api.staging.olshoperp.com/api/generalsetting/company/1540/accounting?with_supplier=true&with_customer=false',
  ];
  for (const u of urls) {
    const r = await page.request.get(u, { headers });
    const j = await r.json().catch(() => null);
    console.log('URL', u, 'status', r.status());
    console.log(JSON.stringify(j).slice(0, 1200));
  }

  const acc = await (
    await page.request.get(
      'https://api.staging.olshoperp.com/api/generalsetting/company/1539/accounting?with_supplier=true&with_customer=false',
      { headers },
    )
  ).json();
  const items = acc.data?.['company-as-supplier'] || [];
  for (const item of items.slice(0, 3)) {
    const coaUrl = `https://api.staging.olshoperp.com/api/generalsetting/general-company/select2/coa-company?transaction_coa_list_id=${item.id}`;
    const r = await page.request.get(coaUrl, { headers });
    console.log('COA options for', item.id, item.name, await r.json());
  }
});
