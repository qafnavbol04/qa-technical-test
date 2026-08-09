import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

test.describe('SauceDemo flujo 2 - carrito y validaciones', () => {
  test('Debe agregar 3 productos dinámicos, eliminar el más caro y validar errores de checkout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Paso 1: Inicio de sesión y selección dinámica de productos
    await loginPage.goto();
    await loginPage.login(USERNAME, PASSWORD);
    await inventoryPage.sortByPriceLowToHigh();

    await inventoryPage.addThreeDifferentProducts();
    await inventoryPage.openCart();

    // Paso 2: Validar el contador de carrito y el conteo real de ítems
    await cartPage.validateBadgeCount(3);
    expect(await cartPage.getCartItemCount()).toBe(3);

    // Paso 3: Eliminar el producto de mayor precio y validar que la lista se actualice
    const removedPrice = await cartPage.removeHighestPricedProduct();
    const remainingPrices = await cartPage.getCartItemPrices();
    await cartPage.validateBadgeCount(2);
    expect(await cartPage.getCartItemCount()).toBe(2);
    expect(Math.max(...remainingPrices)).toBeLessThan(removedPrice);

    // Paso 4: Validar el error de checkout cuando faltan datos obligatorios
    await cartPage.continueToCheckout();
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.errorMessage).toHaveText('Error: First Name is required');
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });
});
