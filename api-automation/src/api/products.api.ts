import { createClient } from "../client/axios.client";
import type { Product, ProductListResponse, ProductQueryParams } from "../types";
import type { AxiosResponse } from "../client/axios.client";

const client = createClient();

export const ProductsApi = {
  list(params?: ProductQueryParams): Promise<AxiosResponse<ProductListResponse>> {
    return client.get<ProductListResponse>("/products", { params });
  },

  getById(id: number): Promise<AxiosResponse<Product>> {
    return client.get<Product>(`/products/${id}`);
  },
};
