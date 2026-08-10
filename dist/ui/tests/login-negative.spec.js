"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const LoginPage_1 = require("../pages/LoginPage");
test_1.test.describe('Login negativo', () => {
    (0, test_1.test)('Muestra error credenciales inválidas', async ({ page }) => {
        const loginPage = new LoginPage_1.LoginPage(page);
        await loginPage.goto();
        // Usar credenciales inválidas
        await page.fill('#user-name', 'invalid_user');
        await page.fill('#password', 'bad_password');
        await page.click('#login-button');
        const error = page.locator('[data-test="error"]');
        await (0, test_1.expect)(error).toBeVisible();
        await (0, test_1.expect)(error).toHaveText(/username and password do not match/i);
        // Verificar que permanecemos en la página de login
        await (0, test_1.expect)(page).toHaveURL(/saucedemo\.com/);
    });
});
