import { test, expect } from '@playwright/test';

test.describe('login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('TC-AUTH-001 login page exposes email, password, submit button, and social links', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.getByText('Please enter your email address and password in order to login to your account.')).toBeVisible();
    await expect(page.getByLabel('Email address')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    await expect(page.locator('img[alt="twitter"]')).toBeVisible();
    await expect(page.locator('img[alt="facebook"]')).toBeVisible();
    await expect(page.locator('img[alt="linkedin"]')).toBeVisible();
  });

  test('TC-AUTH-002 invalid login submission shows field validation feedback', async ({ page }) => {
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Use one of the demo email addresses shown in the tooltip.')).toBeVisible();
    await expect(page.getByText('Please enter a valid password.')).toBeVisible();
  });

  test('TC-AUTH-003 valid demo credentials can be submitted without client-side validation errors', async ({ page }) => {
    await page.getByLabel('Email address').fill('test@user.com');
    await page.getByLabel('Password').fill('qwerty');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.locator('form.was-validated')).toBeVisible();
    await expect(page.getByLabel('Email address')).toHaveValue('test@user.com');
  });

  test('TC-AUTH-004 password field has type="password" so input is masked', async ({ page }) => {
    const passwordInput = page.getByLabel('Password');
    await expect(passwordInput).toBeVisible();
    const inputType = await passwordInput.getAttribute('type');
    expect(inputType).toBe('password');
  });

  test('TC-AUTH-005 email field has type="email" for native browser validation', async ({ page }) => {
    const emailInput = page.getByLabel('Email address');
    await expect(emailInput).toBeVisible();
    const inputType = await emailInput.getAttribute('type');
    expect(inputType).toBe('email');
  });

  test('TC-AUTH-006 login page browser title contains Sweet Shop', async ({ page }) => {
    await expect(page).toHaveTitle(/Sweet Shop/i);
  });
});
