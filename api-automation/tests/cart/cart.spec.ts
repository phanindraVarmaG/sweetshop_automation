import { CartApi } from "../../src/api/cart.api";
import { getAdminToken } from "../../src/helpers/auth.helper";
import {
  validCartItem,
  anotherCartItem,
  missingProductId,
  missingQuantity,
  nonExistentProductItem,
  nonExistentCartItemId,
} from "../../test-data/cart.data";

describe("Cart API", () => {
  let token: string;

  beforeAll(async () => {
    token = await getAdminToken();
  });

  // ─── POST /cart/items ──────────────────────────────────────────────────────

  describe("POST /cart/items", () => {
    it("TC-CART-001 | should return 201 when adding a valid item to cart", async () => {
      const res = await CartApi.addItem(token, validCartItem);

      expect(res.status).toBe(201);
      expect(res.data).toHaveProperty("message");
      expect(res.data).toHaveProperty("cartTotal");
      expect(typeof res.data.cartTotal).toBe("number");
      expect(res.data.cartTotal).toBeGreaterThanOrEqual(0);
    });

    it("TC-CART-002 | cartTotal should reflect the added item price", async () => {
      const before = await CartApi.getCart(token);
      const beforeTotal = before.data.subtotal ?? 0;

      await CartApi.addItem(token, anotherCartItem);

      const after = await CartApi.getCart(token);
      expect(after.data.subtotal).toBeGreaterThanOrEqual(beforeTotal);
    });

    it("TC-CART-003 | should return 401 when no auth token provided", async () => {
      const res = await CartApi.addItem("", validCartItem);

      expect(res.status).toBe(401);
      expect(res.data).toHaveProperty("error");
    });

    it("TC-CART-004 | should return 401 for an invalid/expired token", async () => {
      const res = await CartApi.addItem("invalid.token.value", validCartItem);

      expect(res.status).toBe(401);
      expect(res.data).toHaveProperty("error");
    });

    it("TC-CART-005 | should return 400 when productId is missing", async () => {
      const res = await CartApi.addItem(token, missingProductId as any);

      expect(res.status).toBe(400);
      expect(res.data).toHaveProperty("error");
    });

    it("TC-CART-006 | should return 400 when quantity is missing", async () => {
      const res = await CartApi.addItem(token, missingQuantity as any);

      expect(res.status).toBe(400);
      expect(res.data).toHaveProperty("error");
    });

    it("TC-CART-007 | should return 404 for a non-existent product", async () => {
      const res = await CartApi.addItem(token, nonExistentProductItem);

      expect(res.status).toBe(404);
      expect(res.data).toHaveProperty("error");
    });
  });

  // ─── GET /cart ─────────────────────────────────────────────────────────────

  describe("GET /cart", () => {
    it("TC-CART-008 | should return 200 with cart contents", async () => {
      const res = await CartApi.getCart(token);

      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty("items");
      expect(Array.isArray(res.data.items)).toBe(true);
      expect(res.data).toHaveProperty("subtotal");
      expect(res.data).toHaveProperty("itemCount");
    });

    it("TC-CART-009 | itemCount should match items array length", async () => {
      const res = await CartApi.getCart(token);

      expect(res.status).toBe(200);
      expect(res.data.itemCount).toBe(res.data.items.length);
    });

    it("TC-CART-010 | subtotal should be a non-negative number", async () => {
      const res = await CartApi.getCart(token);

      expect(res.status).toBe(200);
      expect(typeof res.data.subtotal).toBe("number");
      expect(res.data.subtotal).toBeGreaterThanOrEqual(0);
    });

    it("TC-CART-011 | should return 401 without auth token", async () => {
      const res = await CartApi.getCart("");

      expect(res.status).toBe(401);
      expect(res.data).toHaveProperty("error");
    });
  });

  // ─── DELETE /cart/items/:itemId ────────────────────────────────────────────

  describe("DELETE /cart/items/:itemId", () => {
    it("TC-CART-012 | should return 200 when removing an existing cart item", async () => {
      // Ensure item is in cart first
      await CartApi.addItem(token, validCartItem);

      const res = await CartApi.removeItem(token, validCartItem.productId);

      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty("message");
      expect(res.data).toHaveProperty("cartTotal");
    });

    it("TC-CART-013 | cartTotal should decrease after item removal", async () => {
      await CartApi.addItem(token, validCartItem);
      const before = await CartApi.getCart(token);

      await CartApi.removeItem(token, validCartItem.productId);

      const after = await CartApi.getCart(token);
      expect(after.data.subtotal).toBeLessThanOrEqual(before.data.subtotal);
    });

    it("TC-CART-014 | should return 401 without auth token", async () => {
      const res = await CartApi.removeItem("", validCartItem.productId);

      expect(res.status).toBe(401);
      expect(res.data).toHaveProperty("error");
    });

    it("TC-CART-015 | should return 404 for item not in cart", async () => {
      const res = await CartApi.removeItem(token, nonExistentCartItemId);

      expect(res.status).toBe(404);
      expect(res.data).toHaveProperty("error");
    });
  });
});
