import { type Page, type Locator, expect as pwExpect } from '@playwright/test';

export function productContainer(page: Page, productName: string): Locator {
  return page
    .getByRole('heading', { name: productName })
    .locator('xpath=ancestor::div[.//*[normalize-space()="Add to Basket"]][1]');
}

export async function addProductToBasket(page: Page, productName: string): Promise<void> {
  await productContainer(page, productName)
    .getByText('Add to Basket', { exact: true })
    .click();
}

export async function clickPrimaryNav(page: Page, name: string | RegExp): Promise<void> {
  const options =
    typeof name === 'string'
      ? { hasText: new RegExp(`^${name}$`) }
      : { hasText: name };
  await page.locator('nav a', options).first().evaluate((anchor) => (anchor as HTMLElement).click());
}

export async function expectBasketNavCount(
  page: Page,
  count: number,
  expect: typeof pwExpect
): Promise<void> {
  const toggle = page.getByRole('button', { name: 'Toggle navigation' });
  const hasToggle = await toggle.count();
  const shouldToggle =
    hasToggle > 0 &&
    (await toggle.evaluate((element) => {
      const style = window.getComputedStyle(element);
      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        element.getClientRects().length > 0
      );
    }));
  if (shouldToggle) {
    await toggle.click();
  }
  await expect(page.getByRole('link', { name: new RegExp(`${count} Basket`) })).toBeVisible();
}
