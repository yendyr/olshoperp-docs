import { defineConfig, devices } from '@playwright/test';
import { getAuthStoragePath } from './tests/global-setup';

const stagingBaseURL =
  process.env.OLSHOP_BASE_URL ?? 'https://staging.olshoperp.com';
const authFile = getAuthStoragePath();
const qaVideoEnabled = process.env.PW_QA_VIDEO === '1';

const sharedUse = {
  headless: process.env.PW_HEADLESS !== 'false',
  trace: 'retain-on-failure' as const,
  screenshot: 'only-on-failure' as const,
  video: (qaVideoEnabled ? 'retain-on-failure' : 'off') as const,
  actionTimeout: 20_000,
  navigationTimeout: 45_000,
};

const chromiumDevice = {
  ...devices['Desktop Chrome'],
  viewport: { width: 1440, height: 900 },
  launchOptions: {
    slowMo: process.env.PW_SLOW_MO ? Number(process.env.PW_SLOW_MO) : 0,
  },
};

export default defineConfig({
  testDir: './tests',
  globalSetup: './tests/global-setup.ts',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['./tests/reporters/flow-summary-reporter.ts'],
  ],
  timeout: 180_000,
  expect: { timeout: 15_000 },
  projects: [
    {
      name: 'authenticated',
      testMatch: '**/specs/**/*.spec.ts',
      // Script scratch/diagnostic sekali pakai (hasil eksplorasi MCP/debug) —
      // bukan test case, tidak boleh ikut run default: bikin data sampah di
      // staging dan memperlambat suite. Beri prefix ini kalau menulis script
      // sekali pakai; jalankan manual dengan menyebut path-nya.
      testIgnore: [
        '**/specs/**/{check,inspect,probe,debug,diag,find,get,read,log,intercept,discover,verify}-*.spec.ts',
      ],
      use: {
        ...sharedUse,
        ...chromiumDevice,
        baseURL: stagingBaseURL,
        storageState: authFile,
      },
    },
  ],
});
