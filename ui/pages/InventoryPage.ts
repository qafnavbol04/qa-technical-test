import { expect, Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly sortSelect: Locator;
  readonly inventoryItems: Locator;
  readonly shoppingCartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sortSelect = page.locator('.product_sort_container');
    this.inventoryItems = page.locator('.inventory_item');
    this.shoppingCartBadge = page.locator('.shopping_cart_badge');
  }

  async sortByPriceLowToHigh() {
    await this.sortSelect.selectOption('lohi');
    await expect(this.inventoryItems.first()).toBeVisible();
  }

  async getPriceValues() {
    return await this.inventoryItems.locator('.inventory_item_price').allTextContents();
  }

  async addLowestAndHighestPricedProducts() {
    const items = this.inventoryItems;
    const count = await items.count();
    const prices = [] as { index: number; value: number }[];

    for (let i = 0; i < count; i++) {
      const priceText = await items.nth(i).locator('.inventory_item_price').textContent();
      const value = Number(priceText?.replace('$', '').trim());
      prices.push({ index: i, value });
    }

    prices.sort((a, b) => a.value - b.value);

    await items.nth(prices[0].index).locator('button').click();
    await items.nth(prices[prices.length - 1].index).locator('button').click();

    return {
      lowestPrice: prices[0].value,
      highestPrice: prices[prices.length - 1].value
    };
  }

  async addThreeDifferentProducts() {
    const items = this.inventoryItems;
    const count = await items.count();
    const prices = [] as { index: number; value: number }[];

    for (let i = 0; i < count; i++) {
      const priceText = await items.nth(i).locator('.inventory_item_price').textContent();
      const value = Number(priceText?.replace('$', '').trim());
      prices.push({ index: i, value });
    }

    prices.sort((a, b) => a.value - b.value);
    const selected = prices.slice(0, 3);

    for (const product of selected) {
      await items.nth(product.index).locator('button').click();
    }

    return selected.map((product) => product.value);
  }

  async openCart() {
    await this.page.locator('.shopping_cart_link').click();
    await expect(this.page).toHaveURL(/cart\.html/);
  }

  async getCartBadgeCount() {
    if (await this.shoppingCartBadge.count() === 0) {
      return 0;
    }
    return Number(await this.shoppingCartBadge.textContent());
  }
}
