"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const LoginPage_1 = require("../pages/LoginPage");
const InventoryPage_1 = require("../pages/InventoryPage");
const CartPage_1 = require("../pages/CartPage");
const CheckoutPage_1 = require("../pages/CheckoutPage");
const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';
test_1.test.describe('Checkout negativo', () => {
    (0, test_1.test)('Valida campos faltantes', async ({ page }) => {
        const loginPage = new LoginPage_1.LoginPage(page);
        const inventoryPage = new InventoryPage_1.InventoryPage(page);
        const cartPage = new CartPage_1.CartPage(page);
        const checkoutPage = new CheckoutPage_1.CheckoutPage(page);
        await loginPage.goto();
        await loginPage.login(USERNAME, PASSWORD);
        await inventoryPage.sortByPriceLowToHigh();
        await inventoryPage.addThreeDifferentProducts();
        await inventoryPage.openCart();
        await cartPage.continueToCheckout();
        // Enviar sin ningún dato
        await checkoutPage.continueButton.click();
        await (0, test_1.expect)(checkoutPage.errorMessage).toHaveText('Error: First Name is required');
        // Llenar solo nombre
        await checkoutPage.firstNameInput.fill('Juan');
        await checkoutPage.continueButton.click();
        await (0, test_1.expect)(checkoutPage.errorMessage).toHaveText('Error: Last Name is required');
        // Llenar apellido y dejar código postal vacío
        await checkoutPage.lastNameInput.fill('Perez');
        await checkoutPage.continueButton.click();
        await (0, test_1.expect)(checkoutPage.errorMessage).toHaveText('Error: Postal Code is required');
    });
});
