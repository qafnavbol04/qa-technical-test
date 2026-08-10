import { test, expect, request } from '@playwright/test';

test.describe('CRUD de reservas', () => {
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

  test('CRUD completo', async ({ request }) => {
    const authStart = Date.now();
    const authResponse = await request.post('/auth', {
      data: authPayload,
      timeout: 2000
    });
    const authDuration = Date.now() - authStart;
    expect(authResponse.status()).toBe(200);
    expect(authDuration).toBeLessThan(2000);

    const authBody = await authResponse.json();
    expect(authBody).toHaveProperty('token');
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
    expect(createResponse.status()).toBe(200);
    expect(createDuration).toBeLessThan(2000);
    expect(createResponse.headers()['content-type']).toContain('application/json');

    const createBody = await createResponse.json();
    expect(createBody).toMatchObject({
      bookingid: expect.any(Number),
      booking: expect.objectContaining({
        firstname: bookingPayload.firstname,
        lastname: bookingPayload.lastname,
        totalprice: bookingPayload.totalprice,
        depositpaid: bookingPayload.depositpaid,
        bookingdates: expect.objectContaining(bookingPayload.bookingdates)
      })
    });

    const bookingId = createBody.bookingid;

    const getStart = Date.now();
    const getResponse = await request.get(`/booking/${bookingId}`, {
      timeout: 2000
    });
    const getDuration = Date.now() - getStart;
    expect(getResponse.status()).toBe(200);
    expect(getDuration).toBeLessThan(2000);

    const getBody = await getResponse.json();
    expect(getBody).toMatchObject({
      firstname: bookingPayload.firstname,
      lastname: bookingPayload.lastname,
      totalprice: bookingPayload.totalprice,
      depositpaid: bookingPayload.depositpaid,
      bookingdates: expect.objectContaining(bookingPayload.bookingdates)
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
    expect(updateResponse.status()).toBe(200);
    expect(updateDuration).toBeLessThan(2000);

    const updateBody = await updateResponse.json();
    expect(updateBody).toMatchObject({
      firstname: updatedPayload.firstname,
      lastname: updatedPayload.lastname,
      totalprice: updatedPayload.totalprice,
      depositpaid: updatedPayload.depositpaid,
      bookingdates: expect.objectContaining(updatedPayload.bookingdates)
    });

    const getUpdatedStart = Date.now();
    const getUpdatedResponse = await request.get(`/booking/${bookingId}`, {
      timeout: 2000
    });
    const getUpdatedDuration = Date.now() - getUpdatedStart;
    expect(getUpdatedResponse.status()).toBe(200);
    expect(getUpdatedDuration).toBeLessThan(2000);

    const getUpdatedBody = await getUpdatedResponse.json();
    expect(getUpdatedBody).toMatchObject({
      firstname: updatedPayload.firstname,
      lastname: updatedPayload.lastname,
      totalprice: updatedPayload.totalprice,
      depositpaid: updatedPayload.depositpaid,
      bookingdates: expect.objectContaining(updatedPayload.bookingdates)
    });

    const deleteStart = Date.now();
    const deleteResponse = await request.delete(`/booking/${bookingId}`, {
      timeout: 2000,
      headers: {
        Cookie: `token=${token}`
      }
    });
    const deleteDuration = Date.now() - deleteStart;
    expect([201, 200]).toContain(deleteResponse.status());
    expect(deleteDuration).toBeLessThan(2000);

    const getDeletedResponse = await request.get(`/booking/${bookingId}`, {
      timeout: 2000
    });
    expect(getDeletedResponse.status()).toBe(404);
  });
});
