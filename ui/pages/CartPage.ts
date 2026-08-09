import { expect, Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly cartQuantityBadge: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
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
    const prices: number[] = [];

    for (let i = 0; i < count; i++) {
      const priceText = await this.cartItems.nth(i).locator('.inventory_item_price').textContent();
      prices.push(Number(priceText?.replace('$', '').trim()));
    }

    return prices;
  }

  async validateBadgeCount(expectedCount: number) {
    await expect(this.cartQuantityBadge).toHaveText(String(expectedCount));
  }

  async removeHighestPricedProduct() {
    const count = await this.cartItems.count();
    const prices = [] as { index: number; value: number }[];

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
    await this.checkoutButton.click();
    await expect(this.page).toHaveURL(/checkout-step-one\.html/);
  }
}
