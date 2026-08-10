"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const LoginPage_1 = require("../pages/LoginPage");
const InventoryPage_1 = require("../pages/InventoryPage");
const CartPage_1 = require("../pages/CartPage");
const CheckoutPage_1 = require("../pages/CheckoutPage");
const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';
test_1.test.describe('Compra extremo', () => {
    (0, test_1.test)('Compra extremos y valida total', async ({ page }) => {
        const loginPage = new LoginPage_1.LoginPage(page);
        const inventoryPage = new InventoryPage_1.InventoryPage(page);
        const cartPage = new CartPage_1.CartPage(page);
        const checkoutPage = new CheckoutPage_1.CheckoutPage(page);
        // Paso 1: Login y navegación al catálogo
        await loginPage.goto();
        await loginPage.login(USERNAME, PASSWORD);
        // Paso 2: Ordenar por precio y elegir dinámicamente los extremos
        await inventoryPage.sortByPriceLowToHigh();
        const { lowestPrice, highestPrice } = await inventoryPage.addLowestAndHighestPricedProducts();
        // Paso 3: Validar badge del carrito antes de continuar a checkout
        await inventoryPage.openCart();
        await cartPage.validateBadgeCount(2);
        (0, test_1.expect)(await cartPage.getCartItemCount()).toBe(2);
        // Paso 4: Iniciar checkout y validar cálculos financieros de la orden
        await cartPage.continueToCheckout();
        await checkoutPage.completeCheckout('Fernando', 'Navia', '11001');
        const subtotal = await checkoutPage.getSubtotal();
        const tax = await checkoutPage.getTax();
        const total = await checkoutPage.getTotal();
        // Validación matemática: Subtotal + Impuesto = Total
        (0, test_1.expect)(subtotal).toBeCloseTo(Number((lowestPrice + highestPrice).toFixed(2)), 2);
        (0, test_1.expect)(total).toBeCloseTo(Number((subtotal + tax).toFixed(2)), 2);
        await checkoutPage.finishOrder();
        (0, test_1.expect)(await checkoutPage.getConfirmationText()).toMatch(/thank you for your order/i);
    });
});
