import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login negativo', () => {
  test('Muestra error credenciales inválidas', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Usar credenciales inválidas
    await page.fill('#user-name', 'invalid_user');
    await page.fill('#password', 'bad_password');
    await page.click('#login-button');

    const error = page.locator('[data-test="error"]');
    await expect(error).toBeVisible();
    await expect(error).toHaveText(/username and password do not match/i);
    // Verificar que permanecemos en la página de login
    await expect(page).toHaveURL(/saucedemo\.com/);
  });
});
