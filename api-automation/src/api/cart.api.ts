import { createAuthClient } from "../client/axios.client";
import type { CartItem, CartItemResponse, CartResponse } from "../types";
import type { AxiosResponse } from "../client/axios.client";

export const CartApi = {
  addItem(token: string, payload: CartItem): Promise<AxiosResponse<CartItemResponse>> {
    return createAuthClient(token).post<CartItemResponse>("/cart/items", payload);
  },

  getCart(token: string): Promise<AxiosResponse<CartResponse>> {
    return createAuthClient(token).get<CartResponse>("/cart");
  },

  removeItem(token: string, itemId: number): Promise<AxiosResponse<CartItemResponse>> {
    return createAuthClient(token).delete<CartItemResponse>(`/cart/items/${itemId}`);
  },
};
