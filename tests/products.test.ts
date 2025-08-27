// @ts-nocheck
/**
 * @jest-environment node
 */
import request from "supertest";
import app from "../src/app";

describe("Products API", () => {
  it("should return a list of products", async () => {
    const res = await request(app).get("/products");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    const product = res.body[0];
    expect(product).toHaveProperty("id");
    expect(product).toHaveProperty("name");
    expect(product).toHaveProperty("price");
    expect(product).toHaveProperty("imageUrl");
  });

  it("should return a product by id", async () => {
    const res = await request(app).get("/products/1");
    expect([200, 404]).toContain(res.status);

    if (res.status === 200) {
      expect(res.body).toHaveProperty("id", "1");
      expect(res.body).toHaveProperty("name");
    }
  });

  it("should create a new product with valid data", async () => {
    const newProduct = {
      name: "Test Product",
      price: 12.5,
      imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=60"
    };

    const res = await request(app).post("/products").send(newProduct);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe(newProduct.name);
    expect(res.body.price).toBe(newProduct.price);
  });

  it("should reject creating a product with invalid data", async () => {
    const invalidProduct = { name: "", price: -5 };

    const res = await request(app).post("/products").send(invalidProduct);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
