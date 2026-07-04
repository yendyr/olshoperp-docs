import { test, expect } from '@playwright/test';
import { getEnvConfig } from './helpers/env-config';
import {
  assertAllowedCompanyId,
  login,
  readActiveCompanyFromPage,
  switchCompanyByCode,
} from './helpers/company-access';

/**
 * Selectors derived from olshoperp-frontend staging bundles:
 * - Login: placeholder Email/Password, button "Login"
 * - TopBar: profile dropdown "Switch Company", confirm modal "Proceed"
 *
 * Related TC docs:
 * - qa-docs/gate-user/test-cases/TC-GATE-001.md
 * - qa-docs/sidebar-menu/test-cases/TC-SMENU-001..003.md
 */

test.describe('OlshopERP — login & company scope', () => {
  test('login dengan akun tester berhasil masuk ke dashboard', async ({
    page,
  }, testInfo) => {
    const env = getEnvConfig(testInfo.project.name);

    await login(page, env);

    await expect(page.locator('.topbar')).toBeVisible();

    const activeCompany = await readActiveCompanyFromPage(page);
    expect(activeCompany.id).toBeGreaterThan(0);
    assertAllowedCompanyId(activeCompany.id, 'default company after login', env);
  });

  test('verifikasi akses semua allowed company di environment aktif', async ({
    page,
  }, testInfo) => {
    const env = getEnvConfig(testInfo.project.name);

    for (const company of env.allowedCompanies) {
      await login(page, env);
      await switchCompanyByCode(page, company.code, env);

      const activeCompany = await readActiveCompanyFromPage(page);
      expect(activeCompany.id).toBe(company.id);
      assertAllowedCompanyId(
        activeCompany.id,
        `active company ${company.code}`,
        env,
      );

      if (company.code === 'DEV-STG') {
        await page.waitForTimeout(5_000);
      }
    }
  });
});
