import { test, expect } from '@playwright/test';

test.describe('Restful Booker negative booking tests', () => {
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

  test('Creating a booking with empty body returns an error', async ({ request }) => {
    const createResponse = await request.post('/booking', {
      data: {},
      timeout: 2000,
      headers: { 'Content-Type': 'application/json' }
    });

    expect(createResponse.status()).toBeGreaterThanOrEqual(400);
  });
});
