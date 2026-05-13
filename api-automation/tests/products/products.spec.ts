import { ProductsApi } from "../../src/api/products.api";
import {
  validProductId,
  nonExistentProductId,
  filterByCategory,
  paginationParams,
  combinedParams,
  highPageParams,
} from "../../test-data/products.data";

describe("Products API", () => {
  // ─── GET /products ─────────────────────────────────────────────────────────

  describe("GET /products", () => {
    it("TC-PROD-001 | should return 200 with product list", async () => {
      const res = await ProductsApi.list();

      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty("data");
      expect(Array.isArray(res.data.data)).toBe(true);
      expect(res.data).toHaveProperty("total");
      expect(res.data).toHaveProperty("page");
      expect(res.data).toHaveProperty("limit");
    });

    it("TC-PROD-002 | should return products with correct schema", async () => {
      const res = await ProductsApi.list();

      expect(res.status).toBe(200);
      const product = res.data.data[0];
      if (product) {
        expect(product).toHaveProperty("id");
        expect(product).toHaveProperty("name");
        expect(product).toHaveProperty("price");
        expect(product).toHaveProperty("category");
        expect(product).toHaveProperty("stock");
        expect(typeof product.price).toBe("number");
        expect(product.price).toBeGreaterThan(0);
      }
    });

    it("TC-PROD-003 | should filter products by category", async () => {
      const res = await ProductsApi.list(filterByCategory);

      expect(res.status).toBe(200);
      // All returned products should match the requested category
      res.data.data.forEach((p) => {
        expect(p.category.toLowerCase()).toBe(filterByCategory.category!.toLowerCase());
      });
    });

    it("TC-PROD-004 | should honour limit parameter", async () => {
      const res = await ProductsApi.list(paginationParams);

      expect(res.status).toBe(200);
      expect(res.data.data.length).toBeLessThanOrEqual(paginationParams.limit!);
      expect(res.data.limit).toBe(paginationParams.limit);
    });

    it("TC-PROD-005 | should return page metadata matching request", async () => {
      const res = await ProductsApi.list(paginationParams);

      expect(res.status).toBe(200);
      expect(res.data.page).toBe(paginationParams.page);
    });

    it("TC-PROD-006 | should support combined category + pagination params", async () => {
      const res = await ProductsApi.list(combinedParams);

      expect(res.status).toBe(200);
      expect(res.data.data.length).toBeLessThanOrEqual(combinedParams.limit!);
    });

    it("TC-PROD-007 | should return empty data array for out-of-range page", async () => {
      const res = await ProductsApi.list(highPageParams);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.data.data)).toBe(true);
      expect(res.data.data.length).toBe(0);
    });
  });

  // ─── GET /products/:id ─────────────────────────────────────────────────────

  describe("GET /products/:id", () => {
    it("TC-PROD-008 | should return 200 with product details for valid id", async () => {
      const res = await ProductsApi.getById(validProductId);

      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty("id", validProductId);
      expect(res.data).toHaveProperty("name");
      expect(res.data).toHaveProperty("price");
      expect(res.data).toHaveProperty("category");
      expect(res.data).toHaveProperty("stock");
    });

    it("TC-PROD-009 | should return 404 for non-existent product id", async () => {
      const res = await ProductsApi.getById(nonExistentProductId);

      expect(res.status).toBe(404);
      expect(res.data).toHaveProperty("error");
    });

    it("TC-PROD-010 | product price should be a positive number", async () => {
      const res = await ProductsApi.getById(validProductId);

      expect(res.status).toBe(200);
      expect(res.data.price).toBeGreaterThan(0);
      expect(typeof res.data.price).toBe("number");
    });

    it("TC-PROD-011 | product stock should be a non-negative integer", async () => {
      const res = await ProductsApi.getById(validProductId);

      expect(res.status).toBe(200);
      expect(res.data.stock).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(res.data.stock)).toBe(true);
    });
  });
});
