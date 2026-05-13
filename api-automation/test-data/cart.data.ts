import type { CartItem } from "../src/types";

export const validCartItem: CartItem = {
  productId: 1,
  quantity: 2,
};

export const anotherCartItem: CartItem = {
  productId: 2,
  quantity: 1,
};

export const zeroQuantityItem = {
  productId: 1,
  quantity: 0,
};

export const missingProductId = {
  quantity: 2,
};

export const missingQuantity = {
  productId: 1,
};

export const nonExistentProductItem: CartItem = {
  productId: 999999,
  quantity: 1,
};

export const nonExistentCartItemId = 999999;
