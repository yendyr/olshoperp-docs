import { Page, expect } from '@playwright/test';

export const STAGING_API_URL =
  process.env.OLSHOP_API_URL ?? 'https://api.staging.olshoperp.com/api';

export const TEST_EMAIL = process.env.OLSHOP_TEST_EMAIL ?? 'playwright@gmail.com';
export const TEST_PASSWORD = process.env.OLSHOP_TEST_PASSWORD ?? '12345678';

/** Company scope allowed for this test suite. */
export const ALLOWED_COMPANIES = [
  { id: 112, code: 'FAT', label: 'FAT' },
  { id: 153, code: 'lumicharmsid', label: 'Lumi Charms.id' },
  { id: 13, code: 'DEV-STG', label: 'Dev Staging' },
] as const;

export type AllowedCompany = (typeof ALLOWED_COMPANIES)[number];

export function isAllowedCompanyId(companyId: number): boolean {
  return ALLOWED_COMPANIES.some((company) => company.id === companyId);
}

export function assertAllowedCompanyId(
  companyId: number,
  context = 'company access',
): void {
  expect(
    isAllowedCompanyId(companyId),
    `${context}: company id ${companyId} is outside the allowed scope (${ALLOWED_COMPANIES.map((c) => `${c.label}/${c.id}`).join(', ')})`,
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

export async function login(page: Page): Promise<void> {
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
): Promise<void> {
  assertAllowedCompanyId(companyId, `switch to ${companyLabel}`);

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
): Promise<void> {
  const company = ALLOWED_COMPANIES.find((item) => item.code === companyCode);
  if (!company) {
    throw new Error(
      `Company code "${companyCode}" is not registered in ALLOWED_COMPANIES`,
    );
  }

  await switchCompanyById(page, company.id, company.label);
}
