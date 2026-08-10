import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

test.describe('Compra extremo', () => {
  test('Compra extremos y valida total', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Paso 1: Login y navegación al catálogo
    await loginPage.goto();
    await loginPage.login(USERNAME, PASSWORD);

    // Paso 2: Ordenar por precio y elegir dinámicamente los extremos
    await inventoryPage.sortByPriceLowToHigh();
    const { lowestPrice, highestPrice } = await inventoryPage.addLowestAndHighestPricedProducts();

    // Paso 3: Validar badge del carrito antes de continuar a checkout
    await inventoryPage.openCart();
    await cartPage.validateBadgeCount(2);
    expect(await cartPage.getCartItemCount()).toBe(2);

    // Paso 4: Iniciar checkout y validar cálculos financieros de la orden
    await cartPage.continueToCheckout();
    await checkoutPage.completeCheckout('Fernando', 'Navia', '11001');

    const subtotal = await checkoutPage.getSubtotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();

    // Validación matemática: Subtotal + Impuesto = Total
    expect(subtotal).toBeCloseTo(Number((lowestPrice + highestPrice).toFixed(2)), 2);
    expect(total).toBeCloseTo(Number((subtotal + tax).toFixed(2)), 2);

    await checkoutPage.finishOrder();
    expect(await checkoutPage.getConfirmationText()).toMatch(/thank you for your order/i);
  });
});
