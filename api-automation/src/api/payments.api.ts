import { createAuthClient } from "../client/axios.client";
import type { PaymentRequest, PaymentResponse, PaymentDetails } from "../types";
import type { AxiosResponse } from "../client/axios.client";

export const PaymentsApi = {
  initiatePayment(token: string, payload: PaymentRequest): Promise<AxiosResponse<PaymentResponse>> {
    return createAuthClient(token).post<PaymentResponse>("/payments", payload);
  },

  getPayment(token: string, paymentId: string): Promise<AxiosResponse<PaymentDetails>> {
    return createAuthClient(token).get<PaymentDetails>(`/payments/${paymentId}`);
  },
};
