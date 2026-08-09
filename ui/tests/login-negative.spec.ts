import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login negative scenarios', () => {
  test('Shows error with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Use invalid credentials
    await page.fill('#user-name', 'invalid_user');
    await page.fill('#password', 'bad_password');
    await page.click('#login-button');

    const error = page.locator('[data-test="error"]');
    await expect(error).toBeVisible();
    await expect(error).toHaveText(/username and password do not match/i);
    // Ensure we remain on login page
    await expect(page).toHaveURL(/saucedemo\.com/);
  });
});
