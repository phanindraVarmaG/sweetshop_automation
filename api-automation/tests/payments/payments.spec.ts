import { CartApi } from "../../src/api/cart.api";
import { OrdersApi } from "../../src/api/orders.api";
import { PaymentsApi } from "../../src/api/payments.api";
import { getAdminToken } from "../../src/helpers/auth.helper";
import { validCartItem } from "../../test-data/cart.data";
import {
  validPaymentMethod,
  paymentMethods,
  missingMethod,
  missingOrderId,
  nonExistentOrderPayment,
  nonExistentPaymentId,
} from "../../test-data/payments.data";

describe("Payments API", () => {
  let token: string;

  beforeAll(async () => {
    token = await getAdminToken();
  });

  /** Creates a new pending order ready for payment */
  async function createPendingOrder(): Promise<string> {
    await CartApi.addItem(token, validCartItem);
    const res = await OrdersApi.placeOrder(token);
    expect(res.status).toBe(201);
    return res.data.orderId;
  }

  // ─── POST /payments ────────────────────────────────────────────────────────

  describe("POST /payments", () => {
    it("TC-PAY-001 | should return 201 with paymentId for a valid order", async () => {
      const orderId = await createPendingOrder();
      const res = await PaymentsApi.initiatePayment(token, {
        orderId,
        method: validPaymentMethod,
      });

      expect(res.status).toBe(201);
      expect(res.data).toHaveProperty("paymentId");
      expect(typeof res.data.paymentId).toBe("string");
      expect(res.data.paymentId).toMatch(/^PAY-/);
      expect(res.data).toHaveProperty("status");
      expect(res.data).toHaveProperty("amount");
      expect(res.data.amount).toBeGreaterThan(0);
    });

    it.each(paymentMethods)(
      "TC-PAY-002 | should accept payment method: %s",
      async (method) => {
        const orderId = await createPendingOrder();
        const res = await PaymentsApi.initiatePayment(token, { orderId, method });

        expect(res.status).toBe(201);
        expect(res.data).toHaveProperty("paymentId");
      }
    );

    it("TC-PAY-003 | should return 409 when payment already processed for order", async () => {
      const orderId = await createPendingOrder();

      // First payment — should succeed
      const first = await PaymentsApi.initiatePayment(token, {
        orderId,
        method: validPaymentMethod,
      });
      expect(first.status).toBe(201);

      // Second payment for same order — should conflict
      const second = await PaymentsApi.initiatePayment(token, {
        orderId,
        method: validPaymentMethod,
      });
      expect(second.status).toBe(409);
      expect(second.data).toHaveProperty("error");
    });

    it("TC-PAY-004 | should return 404 for non-existent orderId", async () => {
      const res = await PaymentsApi.initiatePayment(token, nonExistentOrderPayment);

      expect(res.status).toBe(404);
      expect(res.data).toHaveProperty("error");
    });

    it("TC-PAY-005 | should return 400 when method is missing", async () => {
      const res = await PaymentsApi.initiatePayment(token, missingMethod as any);

      expect(res.status).toBe(400);
      expect(res.data).toHaveProperty("error");
    });

    it("TC-PAY-006 | should return 400 when orderId is missing", async () => {
      const res = await PaymentsApi.initiatePayment(token, missingOrderId as any);

      expect(res.status).toBe(400);
      expect(res.data).toHaveProperty("error");
    });

    it("TC-PAY-007 | should return 401 without auth token", async () => {
      const orderId = await createPendingOrder();
      const res = await PaymentsApi.initiatePayment("", {
        orderId,
        method: validPaymentMethod,
      });

      expect(res.status).toBe(401);
      expect(res.data).toHaveProperty("error");
    });
  });

  // ─── GET /payments/:paymentId ──────────────────────────────────────────────

  describe("GET /payments/:paymentId", () => {
    let paymentId: string;
    let associatedOrderId: string;

    beforeAll(async () => {
      associatedOrderId = await createPendingOrder();
      const res = await PaymentsApi.initiatePayment(token, {
        orderId: associatedOrderId,
        method: validPaymentMethod,
      });
      paymentId = res.data.paymentId;
    });

    it("TC-PAY-008 | should return 200 with payment details for valid paymentId", async () => {
      const res = await PaymentsApi.getPayment(token, paymentId);

      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty("paymentId", paymentId);
      expect(res.data).toHaveProperty("orderId", associatedOrderId);
      expect(res.data).toHaveProperty("method");
      expect(res.data).toHaveProperty("amount");
      expect(res.data).toHaveProperty("status");
      expect(res.data).toHaveProperty("processedAt");
    });

    it("TC-PAY-009 | payment amount should be a positive number", async () => {
      const res = await PaymentsApi.getPayment(token, paymentId);

      expect(res.status).toBe(200);
      expect(res.data.amount).toBeGreaterThan(0);
      expect(typeof res.data.amount).toBe("number");
    });

    it("TC-PAY-010 | payment method should match the one used during initiation", async () => {
      const res = await PaymentsApi.getPayment(token, paymentId);

      expect(res.status).toBe(200);
      expect(res.data.method).toBe(validPaymentMethod);
    });

    it("TC-PAY-011 | should return 404 for non-existent paymentId", async () => {
      const res = await PaymentsApi.getPayment(token, nonExistentPaymentId);

      expect(res.status).toBe(404);
      expect(res.data).toHaveProperty("error");
    });

    it("TC-PAY-012 | should return 401 without auth token", async () => {
      const res = await PaymentsApi.getPayment("", paymentId);

      expect(res.status).toBe(401);
      expect(res.data).toHaveProperty("error");
    });
  });
});
