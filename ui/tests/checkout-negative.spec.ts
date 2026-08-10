import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

test.describe('Checkout negativo', () => {
  test('Valida campos faltantes', async ({ page }) => {
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

    // Enviar sin ningún dato
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.errorMessage).toHaveText('Error: First Name is required');

    // Llenar solo nombre
    await checkoutPage.firstNameInput.fill('Juan');
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.errorMessage).toHaveText('Error: Last Name is required');

    // Llenar apellido y dejar código postal vacío
    await checkoutPage.lastNameInput.fill('Perez');
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.errorMessage).toHaveText('Error: Postal Code is required');
  });
});
