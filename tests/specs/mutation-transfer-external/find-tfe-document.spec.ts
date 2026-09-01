import { test } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { MutationTransferExternalPage } from '../../helpers/mutation-transfer-external';

test('Find TFE-5U97T5DC across staging companies', async ({ page }) => {
  test.setTimeout(300_000);

  const companies = ['FAT', 'lumicharmsid', 'DEV-STG', 'Lumielle', 'TANRISE', 'HUAWEI'];
  
  for (const company of companies) {
    console.log(`Checking company: ${company}...`);
    try {
      await prepareSession(page, {
        companyCode: company,
        targetPath: '/supplychain/mutation-transfer-external',
      });
      
      const tfe = new MutationTransferExternalPage(page);
      await tfe.datalist.searchInput.fill(process.env.FIND_CODE || 'TFE-5U97T5DC');
      await page.waitForTimeout(1500);
      await tfe.datalist.searchButton.click();
      await page.waitForTimeout(2000);
      
      const row = page.getByRole('row').filter({ hasText: process.env.FIND_CODE || 'TFE-5U97T5DC' }).first();
      if (await row.isVisible({ timeout: 5000 }).catch(() => false)) {
        console.log(`FOUND! Document is in company: ${company}`);
        const link = row.locator('a[href*="/supplychain/mutation-transfer-external/edit/"]').first();
        if (await link.isVisible()) {
          console.log(`Edit path: ${await link.getAttribute('href')}`);
        }
        return;
      }
    } catch (e) {
      console.log(`Error checking company ${company}: ${e.message}`);
    }
  }
  console.log(`NOT FOUND anywhere!`);
});
