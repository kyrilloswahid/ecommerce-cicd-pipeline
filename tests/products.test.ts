import request from 'supertest';

import app from '../src/app';

describe('Products API', () => {
  it('lists products', async () => {
    const res = await request(app).get('/products').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('gets one product', async () => {
    const res = await request(app).get('/products/1').expect(200);
    expect(res.body).toHaveProperty('id', '1');
  });

  it('returns 404 for missing', async () => {
    await request(app).get('/products/999').expect(404);
  });
});
