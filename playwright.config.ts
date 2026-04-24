import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : 2,
  timeout: 60_000,
  reporter: process.env.CI
    ? [
        ['html'],
        ['json', { outputFile: 'test-results/results.json' }],
        ['github'],
        ['allure-playwright'],
      ]
    : [['html'], ['allure-playwright']],

  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com/',
    testIdAttribute: 'data-test',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium-setup',
      testMatch: '**/auth.setup.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox-setup',
      testMatch: '**/auth.setup.ts',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit-setup',
      testMatch: '**/auth.setup.ts',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/chromium.json',
      },
      dependencies: ['chromium-setup'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: '.auth/firefox.json',
      },
      dependencies: ['firefox-setup'],
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: '.auth/webkit.json',
      },
      dependencies: ['webkit-setup'],
    },
  ],
});
