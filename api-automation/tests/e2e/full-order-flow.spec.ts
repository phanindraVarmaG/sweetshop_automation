/**
 * End-to-End flow test covering the complete ShopEasy order lifecycle:
 *
 *   Register → Login → Browse Products → Add to Cart → View Cart
 *     → Place Order → Pay → Verify Payment → Cancel a Separate Order
 */

import { AuthApi } from "../../src/api/auth.api";
import { ProductsApi } from "../../src/api/products.api";
import { CartApi } from "../../src/api/cart.api";
import { OrdersApi } from "../../src/api/orders.api";
import { PaymentsApi } from "../../src/api/payments.api";

describe("E2E | Full Order Lifecycle", () => {
  const uniqueEmail = `e2e_user_${Date.now()}@shopeasy.com`;
  const password = "E2ePass!123";

  let authToken: string;
  let userId: number;
  let productId: number;
  let orderId: string;
  let paymentId: string;

  // ── Step 1: Register a new user ──────────────────────────────────────────

  it("Step 1 | Register a new user account", async () => {
    const res = await AuthApi.register({
      email: uniqueEmail,
      password,
      name: "E2E Test User",
    });

    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty("userId");
    userId = res.data.userId;
  });

  // ── Step 2: Login with the new user ─────────────────────────────────────

  it("Step 2 | Login with the registered user", async () => {
    const res = await AuthApi.login({ email: uniqueEmail, password });

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty("token");
    authToken = res.data.token;
    expect(authToken.length).toBeGreaterThan(0);
  });

  // ── Step 3: Browse products ──────────────────────────────────────────────

  it("Step 3 | Browse the product catalog and pick a product", async () => {
    const res = await ProductsApi.list({ page: 1, limit: 5 });

    expect(res.status).toBe(200);
    expect(res.data.data.length).toBeGreaterThan(0);

    // Pick the first in-stock product
    const inStock = res.data.data.find((p) => p.stock > 0);
    expect(inStock).toBeDefined();
    productId = inStock!.id;
  });

  // ── Step 4: Get product details ──────────────────────────────────────────

  it("Step 4 | Fetch product details for the chosen product", async () => {
    const res = await ProductsApi.getById(productId);

    expect(res.status).toBe(200);
    expect(res.data.id).toBe(productId);
    expect(res.data.stock).toBeGreaterThan(0);
  });

  // ── Step 5: Add product to cart ──────────────────────────────────────────

  it("Step 5 | Add chosen product to the cart", async () => {
    const res = await CartApi.addItem(authToken, { productId, quantity: 1 });

    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty("cartTotal");
    expect(res.data.cartTotal).toBeGreaterThan(0);
  });

  // ── Step 6: Verify cart contents ─────────────────────────────────────────

  it("Step 6 | Verify cart contains the added product", async () => {
    const res = await CartApi.getCart(authToken);

    expect(res.status).toBe(200);
    expect(res.data.itemCount).toBeGreaterThan(0);
    expect(res.data.subtotal).toBeGreaterThan(0);

    const cartProductIds = res.data.items.map(
      (i: any) => i.productId ?? i.id
    );
    expect(cartProductIds).toContain(productId);
  });

  // ── Step 7: Place the order ──────────────────────────────────────────────

  it("Step 7 | Place an order from the cart", async () => {
    const res = await OrdersApi.placeOrder(authToken);

    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty("orderId");
    expect(res.data.orderId).toMatch(/^ORD-/);
    expect(res.data.status).toBe("pending");
    expect(res.data.total).toBeGreaterThan(0);

    orderId = res.data.orderId;
  });

  // ── Step 8: Verify order details ─────────────────────────────────────────

  it("Step 8 | Retrieve and verify order details", async () => {
    const res = await OrdersApi.getOrder(authToken, orderId);

    expect(res.status).toBe(200);
    expect(res.data.orderId).toBe(orderId);
    expect(res.data.status).toBe("pending");
    expect(res.data.total).toBeGreaterThan(0);
    expect(res.data.items.length).toBeGreaterThan(0);
  });

  // ── Step 9: Process payment ──────────────────────────────────────────────

  it("Step 9 | Process payment for the order via credit_card", async () => {
    const res = await PaymentsApi.initiatePayment(authToken, {
      orderId,
      method: "credit_card",
    });

    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty("paymentId");
    expect(res.data.paymentId).toMatch(/^PAY-/);
    expect(res.data.amount).toBeGreaterThan(0);

    paymentId = res.data.paymentId;
  });

  // ── Step 10: Verify payment details ──────────────────────────────────────

  it("Step 10 | Verify payment details are persisted correctly", async () => {
    const res = await PaymentsApi.getPayment(authToken, paymentId);

    expect(res.status).toBe(200);
    expect(res.data.paymentId).toBe(paymentId);
    expect(res.data.orderId).toBe(orderId);
    expect(res.data.method).toBe("credit_card");
    expect(res.data.amount).toBeGreaterThan(0);
    expect(res.data).toHaveProperty("processedAt");
  });

  // ── Step 11: Duplicate payment should be rejected ─────────────────────────

  it("Step 11 | Duplicate payment on the same order should return 409", async () => {
    const res = await PaymentsApi.initiatePayment(authToken, {
      orderId,
      method: "upi",
    });

    expect(res.status).toBe(409);
    expect(res.data).toHaveProperty("error");
  });

  // ── Step 12: Cancel a separate new order ──────────────────────────────────

  it("Step 12 | Cancel a freshly placed order", async () => {
    // Add another item and create a new order
    await CartApi.addItem(authToken, { productId, quantity: 1 });
    const orderRes = await OrdersApi.placeOrder(authToken);
    expect(orderRes.status).toBe(201);
    const newOrderId = orderRes.data.orderId;

    // Cancel it
    const cancelRes = await OrdersApi.cancelOrder(authToken, newOrderId);
    expect(cancelRes.status).toBe(200);
    expect(cancelRes.data.status).toBe("cancelled");

    // Verify the cancelled status persists
    const getRes = await OrdersApi.getOrder(authToken, newOrderId);
    expect(getRes.data.status).toBe("cancelled");
  });
});
