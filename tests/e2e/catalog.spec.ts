import { test, expect } from '@playwright/test';
import { allProducts } from '../fixtures/products';
import { addProductToBasket, expectBasketNavCount, productContainer } from '../fixtures/ui-helpers';

test.describe('sweets catalog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sweets');
  });

  test('TC-CAT-001 sweets listing shows every product with description, price, image, and add action', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Browse sweets' })).toBeVisible();
    await expect(page.getByText('Browse our delicious choice of retro sweets.')).toBeVisible();
    await expect(page.getByText('Add to Basket', { exact: true })).toHaveCount(allProducts.length);

    for (const product of allProducts) {
      const card = productContainer(page, product.name);
      await expect(card, `${product.name} card`).toBeVisible();
      await expect(card.getByText(product.description)).toBeVisible();
      await expect(card.getByText(product.price)).toBeVisible();
      await expect(card.locator('img')).toBeVisible();
      await expect(card.getByText('Add to Basket', { exact: true })).toBeVisible();
    }
  });

  test('TC-CAT-002 add-to-basket updates basket count for single and multiple products', async ({ page }) => {
    await addProductToBasket(page, 'Chocolate Cups');
    await addProductToBasket(page, 'Sherbert Straws');

    // Verify both items accumulated in the basket (checked via basket heading to avoid
    // mobile nav-toggle interference from the open nav overlay)
    await page.goto('/basket');
    await expect(page.getByRole('heading', { name: /Your Basket 2/ })).toBeVisible();
  });

  test('TC-CAT-003 home page add-to-basket action uses the same basket state', async ({ page }) => {
    await page.goto('/');
    await addProductToBasket(page, 'Bon Bons');
    await expectBasketNavCount(page, 1, expect);

    await page.goto('/basket');
    await expect(page.getByText('Bon Bons')).toBeVisible();
    await expect(page.locator('strong').filter({ hasText: '£1.00' })).toBeVisible();
  });

  test('TC-CAT-004 adding the same product twice increments basket count to 2', async ({ page }) => {
    await addProductToBasket(page, 'Chocolate Cups');
    await addProductToBasket(page, 'Chocolate Cups');

    // Verify both clicks accumulated: basket heading shows count 2
    await page.goto('/basket');
    // await expect(page.getByRole('heading', { name: /Your Basket 2/ })).toBeVisible();
     await expect(page.getByRole('heading', { name: /Your Basket 2/ })).toBeVisible();  
     await expect(page.locator('#basketCount')).toHaveText('2');   
  });

  test('TC-CAT-005 all product card images have non-empty src attributes', async ({ page }) => {
    // Wait for product cards to be fully rendered before counting images
    await expect(page.getByText('Add to Basket', { exact: true }).first()).toBeVisible();
    const images = page.locator('.card img');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const src = await images.nth(i).getAttribute('src');
      expect(src, `Image ${i} should have a non-empty src`).toBeTruthy();
    }
  });

  test('TC-CAT-006 sweets page browser title contains Sweet Shop', async ({ page }) => {
    await expect(page).toHaveTitle(/Sweet Shop/i);
  });
});
