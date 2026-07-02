import { test, expect } from '@playwright/test';
import {
  ALLOWED_COMPANIES,
  assertAllowedCompanyId,
  login,
  readActiveCompanyFromPage,
  switchCompanyByCode,
} from './helpers/company-access';

/**
 * Selectors derived from olshoperp-frontend staging bundles:
 * - Login: `assets/Login-CvdZr7Xo.js` → placeholder Email/Password, button "Login"
 * - TopBar: `index-*.js` → profile dropdown "Switch Company", confirm modal "Proceed"
 *
 * Related TC docs:
 * - qa-docs/gate-user/test-cases/TC-GATE-001.md
 * - qa-docs/sidebar-menu/test-cases/TC-SMENU-001..003.md
 */

test.describe('OlshopERP — login & company scope', () => {
  // 1. Login
  test('login dengan akun tester berhasil masuk ke dashboard', async ({ page }) => {
    await login(page);

    await expect(page.locator('.topbar')).toBeVisible();

    const activeCompany = await readActiveCompanyFromPage(page);
    expect(activeCompany.id).toBeGreaterThan(0);
    assertAllowedCompanyId(activeCompany.id, 'default company after login');
  });

  // 2–4. Verifikasi akses ke Company ID 112, 153, dan 13
  for (const company of ALLOWED_COMPANIES) {
    test(`bisa mengakses company ${company.code} (ID ${company.id})`, async ({
      page,
    }) => {
      await login(page);
      await switchCompanyByCode(page, company.code);

      const activeCompany = await readActiveCompanyFromPage(page);
      expect(activeCompany.id).toBe(company.id);
      assertAllowedCompanyId(activeCompany.id, `active company ${company.code}`);

      if (company.code === 'DEV-STG') {
        await page.waitForTimeout(5_000);
      }
    });
  }
});
