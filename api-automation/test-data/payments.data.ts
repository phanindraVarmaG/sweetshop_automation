import type { PaymentMethod } from "../src/types";

export const paymentMethods: PaymentMethod[] = [
  "credit_card",
  "debit_card",
  "upi",
  "net_banking",
];

export const validPaymentMethod: PaymentMethod = "credit_card";

export const missingMethod = {
  orderId: "ORD-1001",
  // method omitted
};

export const missingOrderId = {
  method: "credit_card",
  // orderId omitted
};

export const nonExistentOrderPayment = {
  orderId: "ORD-999999",
  method: "upi" as PaymentMethod,
};

export const nonExistentPaymentId = "PAY-999999";
