"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
const test_1 = require("@playwright/test");
class LoginPage {
    constructor(page) {
        this.page = page;
        this.usernameInput = page.locator('#user-name');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('#login-button');
    }
    async goto() {
        await this.page.goto('/');
        await (0, test_1.expect)(this.page).toHaveURL(/saucedemo\.com/);
    }
    async login(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        await (0, test_1.expect)(this.page).toHaveURL(/inventory\.html/);
    }
}
exports.LoginPage = LoginPage;
