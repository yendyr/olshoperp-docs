import { chromium, type FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import {
  ALLOWED_COMPANIES,
  login,
  switchCompanyByCode,
} from './helpers/company-access';

/** Folder untuk file session Playwright (gitignored). */
export const AUTH_DIR = path.join(__dirname, '.auth');

/**
 * Path file storageState per company.
 * Default company: lumicharmsid — override via env `OLSHOP_COMPANY_CODE`.
 */
export function getAuthStoragePath(companyCode?: string): string {
  const code =
    companyCode ?? process.env.OLSHOP_COMPANY_CODE ?? 'lumicharmsid';
  return path.join(AUTH_DIR, `${code}.json`);
}

/**
 * Playwright globalSetup — jalan **sekali** per perintah `playwright test`.
 *
 * Login UI + switch company → simpan cookies/localStorage ke tests/.auth/{company}.json
 * Test berikutnya bisa pakai `storageState` tanpa Sign In lagi (Fase 1 langkah berikutnya).
 */
async function globalSetup(_config: FullConfig): Promise<void> {
  const companyCode = process.env.OLSHOP_COMPANY_CODE ?? 'lumicharmsid';
  const company = ALLOWED_COMPANIES.find((item) => item.code === companyCode);

  if (!company) {
    throw new Error(
      `OLSHOP_COMPANY_CODE="${companyCode}" tidak ada di ALLOWED_COMPANIES`,
    );
  }

  const baseURL =
    process.env.OLSHOP_BASE_URL ?? 'https://staging.olshoperp.com';
  const storagePath = getAuthStoragePath(companyCode);

  fs.mkdirSync(AUTH_DIR, { recursive: true });

  const refreshAuth = process.env.OLSHOP_REFRESH_AUTH === '1';
  if (!refreshAuth && fs.existsSync(storagePath)) {
    // eslint-disable-next-line no-console
    console.log(
      `[global-setup] Skip login — pakai session existing: ${storagePath} (company: ${company.label})`,
    );
    return;
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  await login(page);
  await switchCompanyByCode(page, companyCode);

  await context.storageState({ path: storagePath });
  await browser.close();

  // eslint-disable-next-line no-console
  console.log(
    `[global-setup] Session tersimpan: ${storagePath} (company: ${company.label})`,
  );
}

export default globalSetup;
