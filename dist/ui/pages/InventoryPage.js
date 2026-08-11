"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryPage = void 0;
const test_1 = require("@playwright/test");
class InventoryPage {
    constructor(page) {
        this.page = page;
        this.sortSelect = page.locator('.product_sort_container');
        this.inventoryItems = page.locator('.inventory_item');
        this.shoppingCartBadge = page.locator('.shopping_cart_badge');
    }
    async sortByPriceLowToHigh() {
        await this.sortSelect.selectOption('lohi');
        await (0, test_1.expect)(this.inventoryItems.first()).toBeVisible();
    }
    async getPriceValues() {
        return await this.inventoryItems.locator('.inventory_item_price').allTextContents();
    }
    async addLowestAndHighestPricedProducts() {
        const items = this.inventoryItems;
        const count = await items.count();
        const prices = [];
        for (let i = 0; i < count; i++) {
            const priceText = await items.nth(i).locator('.inventory_item_price').textContent();
            const value = Number(priceText?.replace('$', '').trim());
            prices.push({ index: i, value });
        }
        prices.sort((a, b) => a.value - b.value);
        const lowestBtn = items.nth(prices[0].index).locator('button');
        await lowestBtn.scrollIntoViewIfNeeded();
        await (0, test_1.expect)(lowestBtn).toBeVisible();
        await lowestBtn.click();
        const highestBtn = items.nth(prices[prices.length - 1].index).locator('button');
        await highestBtn.scrollIntoViewIfNeeded();
        await (0, test_1.expect)(highestBtn).toBeVisible();
        await highestBtn.click();
        return {
            lowestPrice: prices[0].value,
            highestPrice: prices[prices.length - 1].value
        };
    }
    async addThreeDifferentProducts() {
        const items = this.inventoryItems;
        const count = await items.count();
        const prices = [];
        for (let i = 0; i < count; i++) {
            const priceText = await items.nth(i).locator('.inventory_item_price').textContent();
            const value = Number(priceText?.replace('$', '').trim());
            prices.push({ index: i, value });
        }
        prices.sort((a, b) => a.value - b.value);
        const selected = prices.slice(0, 3);
        for (const product of selected) {
            const btn = items.nth(product.index).locator('button');
            await btn.scrollIntoViewIfNeeded();
            await (0, test_1.expect)(btn).toBeVisible();
            await btn.click();
        }
        return selected.map((product) => product.value);
    }
    async openCart() {
        await this.page.locator('.shopping_cart_link').click();
        await (0, test_1.expect)(this.page).toHaveURL(/cart\.html/);
    }
    async getCartBadgeCount() {
        if (await this.shoppingCartBadge.count() === 0) {
            return 0;
        }
        return Number(await this.shoppingCartBadge.textContent());
    }
}
exports.InventoryPage = InventoryPage;
