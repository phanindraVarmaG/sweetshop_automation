import type { ProductQueryParams } from "../src/types";

export const validProductId = 1;
export const nonExistentProductId = 999999;
export const invalidProductId = -1;

export const filterByCategory: ProductQueryParams = {
  category: "electronics",
};

export const paginationParams: ProductQueryParams = {
  page: 1,
  limit: 5,
};

export const combinedParams: ProductQueryParams = {
  category: "electronics",
  page: 1,
  limit: 3,
};

export const highPageParams: ProductQueryParams = {
  page: 9999,
  limit: 10,
};
