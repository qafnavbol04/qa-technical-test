import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

test.describe('Checkout negative scenarios', () => {
  test('Errors when required fields are missing', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(USERNAME, PASSWORD);
    await inventoryPage.sortByPriceLowToHigh();
    await inventoryPage.addThreeDifferentProducts();
    await inventoryPage.openCart();
    await cartPage.continueToCheckout();

    // Submit without any data
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.errorMessage).toHaveText('Error: First Name is required');

    // Fill first name only
    await checkoutPage.firstNameInput.fill('Juan');
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.errorMessage).toHaveText('Error: Last Name is required');

    // Fill last name, leave postal code empty
    await checkoutPage.lastNameInput.fill('Perez');
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.errorMessage).toHaveText('Error: Postal Code is required');
  });
});
