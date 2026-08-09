import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './',
  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000
  },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],
  use: {
    actionTimeout: 10 * 1000,
    navigationTimeout: 30 * 1000,
    baseURL: 'https://www.saucedemo.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    outputDir: 'playwright-results'
  },
  projects: [
    {
      name: 'ui',
      testMatch: 'ui/tests/**/*.spec.ts',
      use: {
        browserName: 'chromium',
        ...devices['Desktop Chrome']
      }
    },
    {
      name: 'ui-firefox',
      testMatch: 'ui/tests/**/*.spec.ts',
      use: {
        browserName: 'firefox',
        ...devices['Desktop Firefox']
      }
    },
    {
      name: 'ui-webkit',
      testMatch: 'ui/tests/**/*.spec.ts',
      use: {
        browserName: 'webkit',
        ...devices['Desktop Safari']
      }
    },
    {
      name: 'api',
      testMatch: 'api/tests/**/*.spec.ts',
      use: {
        baseURL: 'https://restful-booker.herokuapp.com'
      }
    }
  ],
  webServer: undefined
});
