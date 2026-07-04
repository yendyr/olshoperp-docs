import { Page, expect } from '@playwright/test';
import {
  CompanyConfig,
  EnvConfig,
  findCompanyByCode,
  findCompanyById,
  getEnvConfig,
} from './env-config';

export const TEST_EMAIL = process.env.OLSHOP_TEST_EMAIL ?? 'playwright@gmail.com';
export const TEST_PASSWORD = process.env.OLSHOP_TEST_PASSWORD ?? '12345678';

/** @deprecated Use getApiUrl(getEnvConfig()) */
export const STAGING_API_URL = getEnvConfig('staging').apiURL;

/** @deprecated Use getEnvConfig(projectName).allowedCompanies */
export const ALLOWED_COMPANIES = getEnvConfig().allowedCompanies;

export type AllowedCompany = CompanyConfig;

export function getApiUrl(env?: EnvConfig): string {
  return (env ?? getEnvConfig()).apiURL;
}

export function isAllowedCompanyId(
  companyId: number,
  env?: EnvConfig,
): boolean {
  const config = env ?? getEnvConfig();
  return config.allowedCompanies.some((company) => company.id === companyId);
}

export function assertAllowedCompanyId(
  companyId: number,
  context = 'company access',
  env?: EnvConfig,
): void {
  const config = env ?? getEnvConfig();
  expect(
    isAllowedCompanyId(companyId, config),
    `${context}: company id ${companyId} is outside the allowed scope for ${config.name} (${config.allowedCompanies.map((c) => `${c.label}/${c.id}`).join(', ')})`,
  ).toBe(true);
}

export async function dismissStagingBanner(page: Page): Promise<void> {
  const closeButton = page.getByRole('button', { name: 'Close' });
  if (await closeButton.isVisible().catch(() => false)) {
    await closeButton.click();
  }
}

export async function readAuthFromPage(page: Page): Promise<{
  token: string;
  user: Record<string, unknown>;
}> {
  return page.evaluate(() => {
    const raw = localStorage.getItem('auth');
    if (!raw) {
      return { token: '', user: {} };
    }

    const parsed = JSON.parse(raw) as {
      token?: string;
      user?: Record<string, unknown>;
    };

    return { token: parsed.token ?? '', user: parsed.user ?? {} };
  });
}

export async function readActiveCompanyFromPage(page: Page): Promise<{
  id: number;
  name?: string;
  code?: string;
}> {
  return page.evaluate(() => {
    const raw = localStorage.getItem('company');
    if (!raw) {
      return { id: -1 };
    }

    const parsed = JSON.parse(raw) as {
      data?: { id?: number; name?: string; code?: string };
    };

    return {
      id: parsed.data?.id ?? -1,
      name: parsed.data?.name,
      code: parsed.data?.code,
    };
  });
}

export async function login(page: Page, env?: EnvConfig): Promise<void> {
  await page.goto('/login', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

  await page.getByPlaceholder('Email').fill(TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(TEST_PASSWORD);
  await page.getByRole('button', { name: 'Login' }).click();

  await page.waitForURL((url) => !url.pathname.includes('/login'), {
    timeout: 45_000,
  });

  await expect(page.locator('.topbar')).toBeVisible();
  await dismissStagingBanner(page);

  const auth = await readAuthFromPage(page);
  expect(auth.token, 'auth token should exist after login').toBeTruthy();
  expect(auth.user?.email ?? auth.user?.username).toBeTruthy();

  if (env) {
    const activeCompany = await readActiveCompanyFromPage(page);
    assertAllowedCompanyId(activeCompany.id, 'default company after login', env);
  }
}

export async function ensureDefaultCompany(
  page: Page,
  env?: EnvConfig,
): Promise<CompanyConfig> {
  const config = env ?? getEnvConfig();
  await switchCompanyById(
    page,
    config.defaultCompany.id,
    config.defaultCompany.label,
    config,
  );
  return config.defaultCompany;
}

export async function openCompanySwitcher(page: Page): Promise<void> {
  await dismissStagingBanner(page);

  const profileTrigger = page
    .locator('.topbar .rounded-full.image-fit')
    .or(page.locator('.topbar img[alt*="Profile"]'))
    .first();

  await expect(profileTrigger).toBeVisible();
  await profileTrigger.click();
  await expect(page.getByText('Switch Company', { exact: true })).toBeVisible();
}

export async function switchCompanyById(
  page: Page,
  companyId: number,
  companyLabel: string,
  env?: EnvConfig,
): Promise<void> {
  const config = env ?? getEnvConfig();
  assertAllowedCompanyId(companyId, `switch to ${companyLabel}`, config);

  const activeCompany = await readActiveCompanyFromPage(page);
  if (activeCompany.id === companyId) {
    return;
  }

  await openCompanySwitcher(page);

  const companyMenuItem = page.getByRole('menuitem', {
    name: companyLabel,
    exact: true,
  });

  await expect(companyMenuItem).toBeVisible();
  await companyMenuItem.click();

  await expect(page.getByText('Are you sure?', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Proceed' }).click();

  await page.waitForFunction(
    (expectedId) => {
      const raw = localStorage.getItem('company');
      if (!raw) return false;

      const parsed = JSON.parse(raw) as { data?: { id?: number } };
      return parsed.data?.id === expectedId;
    },
    companyId,
    { timeout: 45_000 },
  );

  await page.waitForURL('/', { timeout: 45_000 });

  const switchedCompany = await readActiveCompanyFromPage(page);
  expect(switchedCompany.id).toBe(companyId);
}

export async function switchCompanyByCode(
  page: Page,
  companyCode: string,
  env?: EnvConfig,
): Promise<void> {
  const config = env ?? getEnvConfig();
  const company = findCompanyByCode(config, companyCode);
  if (!company) {
    throw new Error(
      `Company code "${companyCode}" is not registered in allowed companies for ${config.name}`,
    );
  }

  await switchCompanyById(page, company.id, company.label, config);
}

export function resolveCompanyLabel(
  env: EnvConfig,
  companyId: number,
  fallbackLabel: string,
): string {
  return findCompanyById(env, companyId)?.label ?? fallbackLabel;
}
