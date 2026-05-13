import { test, expect } from '@playwright/test';

test.describe('accessibility baseline', () => {

  test('TC-A11Y-001 login form labels are correctly associated with their input fields', async ({ page }) => {
    await page.goto('/login');

    // Verify that clicking each label focuses the correct input
    const emailLabel = page.locator('label', { hasText: 'Email address' });
    await expect(emailLabel).toBeVisible();
    const emailFor = await emailLabel.getAttribute('for');
    expect(emailFor, 'Email label must have a for attribute').toBeTruthy();
    await expect(page.locator(`#${emailFor}`)).toBeVisible();

    const passwordLabel = page.locator('label', { hasText: 'Password' });
    await expect(passwordLabel).toBeVisible();
    const passwordFor = await passwordLabel.getAttribute('for');
    expect(passwordFor, 'Password label must have a for attribute').toBeTruthy();
    await expect(page.locator(`#${passwordFor}`)).toBeVisible();
  });

  test('TC-A11Y-002 primary navigation links have discernible text content', async ({ page }) => {
    await page.goto('/');

    const navLinks = page.locator('nav a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const text = (await navLinks.nth(i).textContent())?.trim();
      expect(text, `Nav link ${i} should have non-empty text`).toBeTruthy();
    }
  });
});
