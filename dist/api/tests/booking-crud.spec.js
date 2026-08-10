"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
test_1.test.describe('CRUD de reservas', () => {
    const authPayload = {
        username: 'admin',
        password: 'password123'
    };
    const bookingPayload = {
        firstname: 'Fernando',
        lastname: 'Navia',
        totalprice: 250,
        depositpaid: true,
        bookingdates: {
            checkin: '2026-09-01',
            checkout: '2026-09-05'
        },
        additionalneeds: 'Breakfast'
    };
    const updatedPayload = {
        firstname: 'Fernando',
        lastname: 'Navia',
        totalprice: 300,
        depositpaid: false,
        bookingdates: {
            checkin: '2026-09-02',
            checkout: '2026-09-06'
        },
        additionalneeds: 'Late Checkout'
    };
    (0, test_1.test)('CRUD completo', async ({ request }) => {
        const authStart = Date.now();
        const authResponse = await request.post('/auth', {
            data: authPayload,
            timeout: 2000
        });
        const authDuration = Date.now() - authStart;
        (0, test_1.expect)(authResponse.status()).toBe(200);
        (0, test_1.expect)(authDuration).toBeLessThan(2000);
        const authBody = await authResponse.json();
        (0, test_1.expect)(authBody).toHaveProperty('token');
        const token = authBody.token;
        const createStart = Date.now();
        const createResponse = await request.post('/booking', {
            data: bookingPayload,
            timeout: 2000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const createDuration = Date.now() - createStart;
        (0, test_1.expect)(createResponse.status()).toBe(200);
        (0, test_1.expect)(createDuration).toBeLessThan(2000);
        (0, test_1.expect)(createResponse.headers()['content-type']).toContain('application/json');
        const createBody = await createResponse.json();
        (0, test_1.expect)(createBody).toMatchObject({
            bookingid: test_1.expect.any(Number),
            booking: test_1.expect.objectContaining({
                firstname: bookingPayload.firstname,
                lastname: bookingPayload.lastname,
                totalprice: bookingPayload.totalprice,
                depositpaid: bookingPayload.depositpaid,
                bookingdates: test_1.expect.objectContaining(bookingPayload.bookingdates)
            })
        });
        const bookingId = createBody.bookingid;
        const getStart = Date.now();
        const getResponse = await request.get(`/booking/${bookingId}`, {
            timeout: 2000
        });
        const getDuration = Date.now() - getStart;
        (0, test_1.expect)(getResponse.status()).toBe(200);
        (0, test_1.expect)(getDuration).toBeLessThan(2000);
        const getBody = await getResponse.json();
        (0, test_1.expect)(getBody).toMatchObject({
            firstname: bookingPayload.firstname,
            lastname: bookingPayload.lastname,
            totalprice: bookingPayload.totalprice,
            depositpaid: bookingPayload.depositpaid,
            bookingdates: test_1.expect.objectContaining(bookingPayload.bookingdates)
        });
        const updateStart = Date.now();
        const updateResponse = await request.put(`/booking/${bookingId}`, {
            data: updatedPayload,
            timeout: 2000,
            headers: {
                'Content-Type': 'application/json',
                Cookie: `token=${token}`
            }
        });
        const updateDuration = Date.now() - updateStart;
        (0, test_1.expect)(updateResponse.status()).toBe(200);
        (0, test_1.expect)(updateDuration).toBeLessThan(2000);
        const updateBody = await updateResponse.json();
        (0, test_1.expect)(updateBody).toMatchObject({
            firstname: updatedPayload.firstname,
            lastname: updatedPayload.lastname,
            totalprice: updatedPayload.totalprice,
            depositpaid: updatedPayload.depositpaid,
            bookingdates: test_1.expect.objectContaining(updatedPayload.bookingdates)
        });
        const getUpdatedStart = Date.now();
        const getUpdatedResponse = await request.get(`/booking/${bookingId}`, {
            timeout: 2000
        });
        const getUpdatedDuration = Date.now() - getUpdatedStart;
        (0, test_1.expect)(getUpdatedResponse.status()).toBe(200);
        (0, test_1.expect)(getUpdatedDuration).toBeLessThan(2000);
        const getUpdatedBody = await getUpdatedResponse.json();
        (0, test_1.expect)(getUpdatedBody).toMatchObject({
            firstname: updatedPayload.firstname,
            lastname: updatedPayload.lastname,
            totalprice: updatedPayload.totalprice,
            depositpaid: updatedPayload.depositpaid,
            bookingdates: test_1.expect.objectContaining(updatedPayload.bookingdates)
        });
        const deleteStart = Date.now();
        const deleteResponse = await request.delete(`/booking/${bookingId}`, {
            timeout: 2000,
            headers: {
                Cookie: `token=${token}`
            }
        });
        const deleteDuration = Date.now() - deleteStart;
        (0, test_1.expect)([201, 200]).toContain(deleteResponse.status());
        (0, test_1.expect)(deleteDuration).toBeLessThan(2000);
        const getDeletedResponse = await request.get(`/booking/${bookingId}`, {
            timeout: 2000
        });
        (0, test_1.expect)(getDeletedResponse.status()).toBe(404);
    });
});
