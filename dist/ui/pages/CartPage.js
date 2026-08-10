"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartPage = void 0;
const test_1 = require("@playwright/test");
class CartPage {
    constructor(page) {
        this.page = page;
        this.cartItems = page.locator('.cart_item');
        this.cartQuantityBadge = page.locator('.shopping_cart_badge');
        this.checkoutButton = page.locator('[data-test="checkout"]');
    }
    async getCartItemCount() {
        return await this.cartItems.count();
    }
    async getCartItemPrices() {
        const count = await this.cartItems.count();
        const prices = [];
        for (let i = 0; i < count; i++) {
            const priceText = await this.cartItems.nth(i).locator('.inventory_item_price').textContent();
            prices.push(Number(priceText?.replace('$', '').trim()));
        }
        return prices;
    }
    async validateBadgeCount(expectedCount) {
        await (0, test_1.expect)(this.cartQuantityBadge).toHaveText(String(expectedCount));
    }
    async removeHighestPricedProduct() {
        const count = await this.cartItems.count();
        const prices = [];
        for (let i = 0; i < count; i++) {
            const priceText = await this.cartItems.nth(i).locator('.inventory_item_price').textContent();
            const value = Number(priceText?.replace('$', '').trim());
            prices.push({ index: i, value });
        }
        prices.sort((a, b) => a.value - b.value);
        const highest = prices[prices.length - 1];
        await this.cartItems.nth(highest.index).locator('button').click();
        return highest.value;
    }
    async continueToCheckout() {
        await (0, test_1.expect)(this.checkoutButton).toBeVisible({ timeout: 30 * 1000 });
        await (0, test_1.expect)(this.checkoutButton).toBeEnabled({ timeout: 30 * 1000 });
        await this.checkoutButton.click();
        await (0, test_1.expect)(this.page).toHaveURL(/checkout-step-one\.html/);
    }
}
exports.CartPage = CartPage;
