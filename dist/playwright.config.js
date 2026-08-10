"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
exports.default = (0, test_1.defineConfig)({
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
        actionTimeout: 30 * 1000,
        navigationTimeout: 30 * 1000,
        baseURL: 'https://www.saucedemo.com',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true
    },
    outputDir: 'playwright-results',
    projects: [
        {
            name: 'ui',
            testMatch: 'ui/tests/**/*.spec.ts',
            use: {
                browserName: 'chromium',
                ...test_1.devices['Desktop Chrome']
            }
        },
        {
            name: 'ui-firefox',
            testMatch: 'ui/tests/**/*.spec.ts',
            use: {
                browserName: 'firefox',
                ...test_1.devices['Desktop Firefox']
            }
        },
        {
            name: 'ui-webkit',
            testMatch: 'ui/tests/**/*.spec.ts',
            use: {
                browserName: 'webkit',
                ...test_1.devices['Desktop Safari']
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
