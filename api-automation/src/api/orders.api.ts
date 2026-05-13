import { createAuthClient } from "../client/axios.client";
import type { Order, PlaceOrderResponse, CancelOrderResponse } from "../types";
import type { AxiosResponse } from "../client/axios.client";

export const OrdersApi = {
  placeOrder(token: string): Promise<AxiosResponse<PlaceOrderResponse>> {
    return createAuthClient(token).post<PlaceOrderResponse>("/orders");
  },

  getOrder(token: string, orderId: string): Promise<AxiosResponse<Order>> {
    return createAuthClient(token).get<Order>(`/orders/${orderId}`);
  },

  cancelOrder(token: string, orderId: string): Promise<AxiosResponse<CancelOrderResponse>> {
    return createAuthClient(token).delete<CancelOrderResponse>(`/orders/${orderId}/cancel`);
  },
};
