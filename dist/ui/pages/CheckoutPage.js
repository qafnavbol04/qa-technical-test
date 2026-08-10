"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutPage = void 0;
const test_1 = require("@playwright/test");
class CheckoutPage {
    constructor(page) {
        this.page = page;
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');
        this.finishButton = page.locator('[data-test="finish"]');
        this.subtotalLabel = page.locator('.summary_subtotal_label');
        this.taxLabel = page.locator('.summary_tax_label');
        this.totalLabel = page.locator('.summary_total_label');
        this.confirmationHeader = page.locator('.complete-header');
        this.errorMessage = page.locator('[data-test="error"]');
    }
    async completeCheckout(firstName, lastName, postalCode) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
        await this.continueButton.click();
        await (0, test_1.expect)(this.page).toHaveURL(/checkout-step-two\.html/);
    }
    async finishOrder() {
        await this.finishButton.click();
        await (0, test_1.expect)(this.page).toHaveURL(/checkout-complete\.html/);
    }
    async getSubtotal() {
        const text = await this.subtotalLabel.textContent();
        return Number(text?.replace('Item total: $', '').trim());
    }
    async getTax() {
        const text = await this.taxLabel.textContent();
        return Number(text?.replace('Tax: $', '').trim());
    }
    async getTotal() {
        const text = await this.totalLabel.textContent();
        return Number(text?.replace('Total: $', '').trim());
    }
    async getConfirmationText() {
        return (await this.confirmationHeader.textContent())?.trim() ?? '';
    }
    async getErrorMessage() {
        return (await this.errorMessage.textContent())?.trim() ?? '';
    }
}
exports.CheckoutPage = CheckoutPage;
