import { CartApi } from "../../src/api/cart.api";
import { OrdersApi } from "../../src/api/orders.api";
import { getAdminToken } from "../../src/helpers/auth.helper";
import { validCartItem } from "../../test-data/cart.data";
import { nonExistentOrderId } from "../../test-data/orders.data";

describe("Orders API", () => {
  let token: string;
  let placedOrderId: string;

  beforeAll(async () => {
    token = await getAdminToken();
  });

  // Seed the cart before order tests that need an item in cart
  async function seedCart(): Promise<void> {
    await CartApi.addItem(token, validCartItem);
  }

  // ─── POST /orders ──────────────────────────────────────────────────────────

  describe("POST /orders", () => {
    it("TC-ORD-001 | should return 201 and orderId when cart has items", async () => {
      await seedCart();
      const res = await OrdersApi.placeOrder(token);

      expect(res.status).toBe(201);
      expect(res.data).toHaveProperty("orderId");
      expect(typeof res.data.orderId).toBe("string");
      expect(res.data.orderId).toMatch(/^ORD-/);
      expect(res.data).toHaveProperty("total");
      expect(res.data).toHaveProperty("status");
      expect(res.data.status).toBe("pending");

      placedOrderId = res.data.orderId; // reuse in subsequent tests
    });

    it("TC-ORD-002 | order total should be a positive number", async () => {
      await seedCart();
      const res = await OrdersApi.placeOrder(token);

      expect(res.status).toBe(201);
      expect(res.data.total).toBeGreaterThan(0);
      expect(typeof res.data.total).toBe("number");
    });

    it("TC-ORD-003 | should return 400 when cart is empty", async () => {
      // Drain the cart first
      const cartRes = await CartApi.getCart(token);
      for (const item of cartRes.data.items) {
        await CartApi.removeItem(token, (item as any).productId ?? (item as any).id);
      }

      const res = await OrdersApi.placeOrder(token);
      expect(res.status).toBe(400);
      expect(res.data).toHaveProperty("error");
    });

    it("TC-ORD-004 | should return 401 without auth token", async () => {
      const res = await OrdersApi.placeOrder("");

      expect(res.status).toBe(401);
      expect(res.data).toHaveProperty("error");
    });
  });

  // ─── GET /orders/:orderId ──────────────────────────────────────────────────

  describe("GET /orders/:orderId", () => {
    beforeAll(async () => {
      // Ensure we have a valid order
      if (!placedOrderId) {
        await seedCart();
        const res = await OrdersApi.placeOrder(token);
        placedOrderId = res.data.orderId;
      }
    });

    it("TC-ORD-005 | should return 200 with order details for valid orderId", async () => {
      const res = await OrdersApi.getOrder(token, placedOrderId);

      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty("orderId", placedOrderId);
      expect(res.data).toHaveProperty("status");
      expect(res.data).toHaveProperty("total");
      expect(res.data).toHaveProperty("items");
      expect(Array.isArray(res.data.items)).toBe(true);
    });

    it("TC-ORD-006 | order status should be a valid enum value", async () => {
      const res = await OrdersApi.getOrder(token, placedOrderId);

      expect(res.status).toBe(200);
      const validStatuses = ["pending", "paid", "shipped", "delivered", "cancelled"];
      expect(validStatuses).toContain(res.data.status);
    });

    it("TC-ORD-007 | should return 404 for non-existent orderId", async () => {
      const res = await OrdersApi.getOrder(token, nonExistentOrderId);

      expect(res.status).toBe(404);
      expect(res.data).toHaveProperty("error");
    });

    it("TC-ORD-008 | should return 401 without auth token", async () => {
      const res = await OrdersApi.getOrder("", placedOrderId);

      expect(res.status).toBe(401);
      expect(res.data).toHaveProperty("error");
    });
  });

  // ─── DELETE /orders/:orderId/cancel ───────────────────────────────────────

  describe("DELETE /orders/:orderId/cancel", () => {
    let cancelableOrderId: string;

    beforeEach(async () => {
      // Create a fresh pending order to cancel
      await seedCart();
      const res = await OrdersApi.placeOrder(token);
      cancelableOrderId = res.data.orderId;
    });

    it("TC-ORD-009 | should return 200 and cancelled status for a pending order", async () => {
      const res = await OrdersApi.cancelOrder(token, cancelableOrderId);

      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty("orderId", cancelableOrderId);
      expect(res.data).toHaveProperty("status");
      expect(res.data.status).toBe("cancelled");
      expect(res.data).toHaveProperty("message");
    });

    it("TC-ORD-010 | cancelled order should reflect cancelled status in GET", async () => {
      await OrdersApi.cancelOrder(token, cancelableOrderId);

      const res = await OrdersApi.getOrder(token, cancelableOrderId);
      expect(res.status).toBe(200);
      expect(res.data.status).toBe("cancelled");
    });

    it("TC-ORD-011 | should return 404 when cancelling a non-existent order", async () => {
      const res = await OrdersApi.cancelOrder(token, nonExistentOrderId);

      expect(res.status).toBe(404);
      expect(res.data).toHaveProperty("error");
    });

    it("TC-ORD-012 | should return 401 without auth token", async () => {
      const res = await OrdersApi.cancelOrder("", cancelableOrderId);

      expect(res.status).toBe(401);
      expect(res.data).toHaveProperty("error");
    });
  });
});
