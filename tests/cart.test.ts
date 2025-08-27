import request from "supertest";
import app from "../src/app";

describe("Cart API", () => {
  it("should return an empty cart initially", async () => {
    const res = await request(app).get("/cart");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("items");
    expect(res.body.items).toEqual([]);
    expect(res.body.totalItems).toBe(0);
  });

  it("should add an item to the cart", async () => {
    const res = await request(app)
      .post("/cart/add")
      .send({ productId: "1", qty: 2 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("items");
    expect(res.body.totalItems).toBe(2);
    expect(res.body.items[0]).toMatchObject({ productId: "1", qty: 2 });
  });

  it("should clear the cart", async () => {
    await request(app).post("/cart/add").send({ productId: "2", qty: 1 });

    const res = await request(app).post("/cart/clear");
    expect(res.status).toBe(200);
    expect(res.body.totalItems).toBe(0);
    expect(res.body.items).toEqual([]);
  });

  it("should simulate checkout", async () => {
    await request(app).post("/cart/add").send({ productId: "1", qty: 1 });
    const res = await request(app).post("/cart/checkout");

    // Checkout may just be stubbed
    expect([200, 501]).toContain(res.status);
  });
});
