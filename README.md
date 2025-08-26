# ecommerce-cicd-pipeline

to be updated

## API endpoints

- GET /health – status check ({ status: "ok" }).
- GET /products – list products with { id, name, price, imageUrl }.
- GET /products/:id – get a single product.
- POST /products – create a product (validated with Zod).
- GET /cart – get cart { items: [{ productId, qty }], totalItems }.
- POST /cart/add – add { productId, qty } to the cart.
- POST /cart/clear – clear the cart.
- POST /cart/checkout – optional simulated payment endpoint (see above).