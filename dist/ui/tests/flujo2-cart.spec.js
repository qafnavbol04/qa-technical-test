"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const LoginPage_1 = require("../pages/LoginPage");
const InventoryPage_1 = require("../pages/InventoryPage");
const CartPage_1 = require("../pages/CartPage");
const CheckoutPage_1 = require("../pages/CheckoutPage");
const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';
test_1.test.describe('Carrito', () => {
    (0, test_1.test)('Elimina caro y valida checkout', async ({ page }) => {
        const loginPage = new LoginPage_1.LoginPage(page);
        const inventoryPage = new InventoryPage_1.InventoryPage(page);
        const cartPage = new CartPage_1.CartPage(page);
        const checkoutPage = new CheckoutPage_1.CheckoutPage(page);
        // Paso 1: Inicio de sesión y selección dinámica de productos
        await loginPage.goto();
        await loginPage.login(USERNAME, PASSWORD);
        await inventoryPage.sortByPriceLowToHigh();
        await inventoryPage.addThreeDifferentProducts();
        await inventoryPage.openCart();
        // Paso 2: Validar el contador de carrito y el conteo real de ítems
        await cartPage.validateBadgeCount(3);
        (0, test_1.expect)(await cartPage.getCartItemCount()).toBe(3);
        // Paso 3: Eliminar el producto de mayor precio y validar que la lista se actualice
        const removedPrice = await cartPage.removeHighestPricedProduct();
        const remainingPrices = await cartPage.getCartItemPrices();
        await cartPage.validateBadgeCount(2);
        (0, test_1.expect)(await cartPage.getCartItemCount()).toBe(2);
        (0, test_1.expect)(Math.max(...remainingPrices)).toBeLessThan(removedPrice);
        // Paso 4: Validar el error de checkout cuando faltan datos obligatorios
        await cartPage.continueToCheckout();
        await checkoutPage.continueButton.click();
        await (0, test_1.expect)(checkoutPage.errorMessage).toHaveText('Error: First Name is required');
        await (0, test_1.expect)(page).toHaveURL(/checkout-step-one\.html/);
    });
});
