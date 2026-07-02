import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.OLSHOP_BASE_URL ?? 'https://staging.olshoperp.com';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 180_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL,
    headless: false,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    actionTimeout: 20_000,
    navigationTimeout: 45_000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        launchOptions: {
          slowMo: 1_500,
        },
      },
    },
  ],
});
