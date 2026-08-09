import { test, expect } from '@playwright/test';

test.describe('Restful Booker negative booking tests', () => {
  const existingBookingId = 1;

  test('Creating a booking with missing required fields returns an error', async ({ request }) => {
    const incompletePayload = {
      // missing firstname and lastname
      totalprice: 100,
      depositpaid: false,
      bookingdates: {
        checkin: '2026-10-01',
        checkout: '2026-10-02'
      }
    };

    const createResponse = await request.post('/booking', {
      data: incompletePayload,
      timeout: 2000,
      headers: { 'Content-Type': 'application/json' }
    });

    // The service should not accept incomplete bookings — expect client/server error
    expect(createResponse.status()).toBeGreaterThanOrEqual(400);
  });

  test('Getting a booking that does not exist returns 404', async ({ request }) => {
    const response = await request.get('/booking/9999999', { timeout: 2000 });

    expect(response.status()).toBe(404);
  });

  test('Updating a booking without authentication is rejected', async ({ request }) => {
    const response = await request.put(`/booking/${existingBookingId}`, {
      data: {
        firstname: 'Unauthorized',
        lastname: 'Update',
        totalprice: 100,
        depositpaid: false,
        bookingdates: {
          checkin: '2026-10-01',
          checkout: '2026-10-02'
        }
      },
      timeout: 2000,
      headers: { 'Content-Type': 'application/json' }
    });

    expect([401, 403]).toContain(response.status());
  });

  test('Deleting a booking without authentication is rejected', async ({ request }) => {
    const response = await request.delete(`/booking/${existingBookingId}`, {
      timeout: 2000
    });

    expect([401, 403]).toContain(response.status());
  });

  test('Creating a booking with empty body returns an error', async ({ request }) => {
    const createResponse = await request.post('/booking', {
      data: {},
      timeout: 2000,
      headers: { 'Content-Type': 'application/json' }
    });

    expect(createResponse.status()).toBeGreaterThanOrEqual(400);
  });
});
