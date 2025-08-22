import request from 'supertest';
import app from '../src/app';

describe('Cart API', () => {
  it('adds items and returns cart', async () => {
    await request(app).post('/cart/clear').expect(200);
    const res = await request(app).post('/cart/add').send({ productId: '1', qty: 1 }).expect(201);
    expect(res.body.items[0]).toMatchObject({ productId: '1', qty: 1 });
    const list = await request(app).get('/cart').expect(200);
    expect(list.body.totalItems).toBeGreaterThan(0);
  });

  it('rejects bad payload', async () => {
    await request(app).post('/cart/add').send({ productId: '1', qty: 0 }).expect(400);
  });
});
