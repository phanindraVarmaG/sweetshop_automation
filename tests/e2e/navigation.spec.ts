import { test, expect } from '@playwright/test';
import { popularProducts } from '../fixtures/products';
import { clickPrimaryNav } from '../fixtures/ui-helpers';

test.describe('navigation and static content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC-NAV-001 home page exposes hero, browse CTA, popular sweets, and footer', async ({ page }) => {
    await expect(page).toHaveTitle(/Sweet Shop/);
    await expect(page.getByRole('heading', { name: 'Welcome to the sweet shop!' })).toBeVisible();
    await expect(page.getByText('The sweetest online shop out there.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Browse Sweets' })).toHaveAttribute('href', /sweets/);

    for (const productName of popularProducts) {
      await expect(page.getByRole('heading', { name: productName })).toBeVisible();
    }

    await expect(page.getByText('Sweet Shop Project 2018')).toBeVisible();
  });

  test('TC-NAV-002 header navigation reaches all primary pages', async ({ page }) => {
    await clickPrimaryNav(page, 'Sweets');
    await expect(page).toHaveURL(/\/sweets$/);
    await expect(page.getByRole('heading', { name: 'Browse sweets' })).toBeVisible();

    await clickPrimaryNav(page, 'About');
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.getByRole('heading', { name: 'Sweet Shop Project' })).toBeVisible();

    await clickPrimaryNav(page, 'Login');
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

    await clickPrimaryNav(page, /Basket/);
    await expect(page).toHaveURL(/\/basket$/);
    await expect(page.getByRole('heading', { name: 'Your Basket', exact: true })).toBeVisible();
  });

  test('TC-NAV-003 about page communicates promotion and application purpose', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByText('20% Off! Get 20% off your first sweet shop order!')).toHaveCount(1);
    await expect(page.getByText('An intentionally broken web application')).toBeVisible();
  });

  test('TC-NAV-004 brand logo link navigates back to home from any page', async ({ page }) => {
    // Navigate away then use brand link to return home
    await page.goto('/sweets');
    await page.locator('a.navbar-brand').click();
    await expect(page).toHaveURL(/\/?$/);
    await expect(page.getByRole('heading', { name: 'Welcome to the sweet shop!' })).toBeVisible();
  });

  test('TC-NAV-005 Browse Sweets CTA on home hero navigates to sweets catalog', async ({ page }) => {
    const browseLink = page.getByRole('link', { name: 'Browse Sweets' });
    await expect(browseLink).toBeVisible();
    await browseLink.click();
    await expect(page).toHaveURL(/\/sweets/);
    await expect(page.getByRole('heading', { name: 'Browse sweets' })).toBeVisible();
  });

  test('TC-NAV-006 footer copyright text is present across core pages', async ({ page }) => {
    // Home
    await expect(page.getByText('Sweet Shop Project 2018')).toBeVisible();

    // About
    await page.goto('/about');
    await expect(page.getByText('Sweet Shop Project 2018')).toBeVisible();

    // Login
    await page.goto('/login');
    await expect(page.getByText('Sweet Shop Project 2018')).toBeVisible();
  });
});
