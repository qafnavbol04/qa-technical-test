import { test, expect } from '@playwright/test';

test.describe('Reservas negativas', () => {
  const existingBookingId = 1;

  test('Reserva incompleta falla', async ({ request }) => {
    const incompletePayload = {
      // faltan firstname y lastname
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

    // El servicio debe rechazar reservas incompletas
    expect(createResponse.status()).toBeGreaterThanOrEqual(400);
  });

  test('Reserva inexistente 404', async ({ request }) => {
    const response = await request.get('/booking/9999999', { timeout: 2000 });

    expect(response.status()).toBe(404);
  });

  test('Actualización sin auth rechaza', async ({ request }) => {
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

  test('Eliminación sin auth rechaza', async ({ request }) => {
    const response = await request.delete(`/booking/${existingBookingId}`, {
      timeout: 2000
    });

    expect([401, 403]).toContain(response.status());
  });

  test('Reserva cuerpo vacío falla', async ({ request }) => {
    const createResponse = await request.post('/booking', {
      data: {},
      timeout: 2000,
      headers: { 'Content-Type': 'application/json' }
    });

    expect(createResponse.status()).toBeGreaterThanOrEqual(400);
  });
});
