import { defineConfig, devices } from '@playwright/test';

const sharedUse = {
  headless: process.env.PW_HEADLESS !== 'false',
  trace: 'on-first-retry' as const,
  screenshot: 'only-on-failure' as const,
  video: 'on-first-retry' as const,
  actionTimeout: 20_000,
  navigationTimeout: 45_000,
};

const chromiumDevice = {
  ...devices['Desktop Chrome'],
  viewport: { width: 1440, height: 900 },
  launchOptions: {
    // Set PW_SLOW_MO=1500 for headed debugging; crawl runs best at 0.
    slowMo: process.env.PW_SLOW_MO ? Number(process.env.PW_SLOW_MO) : 0,
  },
};

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 180_000,
  expect: { timeout: 15_000 },
  projects: [
    {
      name: 'staging',
      use: {
        ...sharedUse,
        ...chromiumDevice,
        baseURL: 'https://staging.olshoperp.com',
      },
    },
    {
      name: 'tyas',
      use: {
        ...sharedUse,
        ...chromiumDevice,
        baseURL: 'https://tyas.olshoperp.com',
      },
    },
    {
      name: 'merdian',
      use: {
        ...sharedUse,
        ...chromiumDevice,
        baseURL: 'https://merdian.olshoperp.com',
      },
    },
  ],
});
