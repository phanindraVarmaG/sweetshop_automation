# Sweet Shop Test Plan

## Application Under Test

- Name: Sweet Shop
- URL: `https://sweetshop.netlify.app/sweets`
- Related routes: `/`, `/sweets`, `/about`, `/login`, `/basket`

## Test Approach

The suite is grouped by customer journey and automated with Playwright (TypeScript). Tests use accessible locators where possible, verify both page content and behavior, and run against desktop and mobile Chrome profiles.

## Test Groups

| Group | Area | Goal | Spec File |
| --- | --- | --- | --- |
| Navigation | Home, header, footer, About | Confirm core routes, logo, CTA, and static content | `tests/e2e/navigation.spec.ts` |
| Catalog | Product list and product cards | Confirm all sweets, prices, images, add actions, and page title | `tests/e2e/catalog.spec.ts` |
| Basket | Cart state, totals, delivery, promo boundary tests, empty basket | Confirm basket business rules | `tests/e2e/basket-checkout.spec.ts` |
| Checkout | Billing, delivery, payment forms | Confirm required validation (full/partial) and valid form entry | `tests/e2e/basket-checkout.spec.ts` |
| Login | Authentication form | Confirm login page controls, input types, and validation | `tests/e2e/login.spec.ts` |
| Accessibility | Alt text, labels, nav links | Baseline accessibility checks | `tests/e2e/accessibility.spec.ts` |

## Test Cases

### Navigation

| Test ID | Scenario | Priority | Automation |
| --- | --- | --- | --- |
| TC-NAV-001 | Home page exposes hero, browse CTA, popular sweets, and footer | High | Automated |
| TC-NAV-002 | Header navigation reaches Sweets, About, Login, and Basket pages | Critical | Automated |
| TC-NAV-003 | About page communicates promotion and application purpose | Medium | Automated |
| TC-NAV-004 | Brand logo link navigates back to home from any page | Medium | Automated |
| TC-NAV-005 | Browse Sweets CTA on home hero navigates to sweets catalog | High | Automated |
| TC-NAV-006 | Footer copyright text is present across core pages | Low | Automated |

### Catalog

| Test ID | Scenario | Priority | Automation |
| --- | --- | --- | --- |
| TC-CAT-001 | Sweets listing shows every product with description, price, image, and add action | Critical | Automated |
| TC-CAT-002 | Add-to-basket updates basket count for single and multiple products | Critical | Automated |
| TC-CAT-003 | Home page add-to-basket action uses the same basket state | High | Automated |
| TC-CAT-004 | Adding the same product twice increments basket count to 2 | High | Automated |
| TC-CAT-005 | All product card images have non-empty src attributes | Medium | Automated |
| TC-CAT-006 | Sweets page browser title contains Sweet Shop | Low | Automated |

### Basket

| Test ID | Scenario | Priority | Automation |
| --- | --- | --- | --- |
| TC-BKT-001 | Empty basket shows zero count, zero total, and checkout sections | High | Automated |
| TC-BKT-002 | Basket persists selected products and calculates product total | Critical | Automated |
| TC-BKT-003 | Shipping choice changes order total | Critical | Automated |
| TC-BKT-004 | Invalid promo code shows validation feedback and keeps basket total unchanged | High | Automated |
| TC-BKT-005 | Empty basket link is present (NOTE: functionality is broken) | High | Automated |
| TC-BKT-006 | Three different products show correct combined basket total | Critical | Automated |
| TC-BKT-007 | Basket displays cheapest and most expensive items with correct combined total | High | Automated |

### Promo Code Boundary

| Test ID | Scenario | Priority | Automation |
| --- | --- | --- | --- |
| TC-PROMO-001 | Submitting a blank promo code leaves basket total unchanged | Medium | Automated |
| TC-PROMO-002 | Whitespace-only promo code leaves basket total unchanged | Medium | Automated |
| TC-PROMO-003 | Special character promo code leaves basket total unchanged | Medium | Automated |

### Checkout

| Test ID | Scenario | Priority | Automation |
| --- | --- | --- | --- |
| TC-CHK-001 | Checkout submission validates all required billing and payment fields | Critical | Automated |
| TC-CHK-002 | Checkout accepts complete billing, delivery, and payment details | High | Automated |
| TC-CHK-003 | Filling only billing fields still shows payment validation errors | High | Automated |
| TC-CHK-004 | Country dropdown contains selectable country options | Medium | Automated |
| TC-CHK-005 | State dropdown populates after selecting a country | Medium | Automated |

### Login

| Test ID | Scenario | Priority | Automation |
| --- | --- | --- | --- |
| TC-AUTH-001 | Login page exposes email, password, submit button, and social links | High | Automated |
| TC-AUTH-002 | Invalid login submission shows field validation feedback | High | Automated |
| TC-AUTH-003 | Valid demo credentials can be submitted without client-side validation errors | Medium | Automated |
| TC-AUTH-004 | Password field has type="password" so input is masked | High | Automated |
| TC-AUTH-005 | Email field has type="email" for native browser validation | Medium | Automated |
| TC-AUTH-006 | Login page browser title contains Sweet Shop | Low | Automated |

### Accessibility Baseline

| Test ID | Scenario | Priority | Automation |
| --- | --- | --- | --- |
| TC-A11Y-001 | All product images on sweets page have non-empty alt attributes | High | Automated |
| TC-A11Y-002 | Login form labels are correctly associated with their input fields | High | Automated |
| TC-A11Y-003 | Primary navigation links have discernible text content | Medium | Automated |

**Total automated tests: 37** (each runs on 2 browser profiles = 74 executions)

## Environment

- Runtime: Node.js
- Language: TypeScript
- Framework: Playwright Test
- Browsers: Desktop Chrome and Pixel 5 Chrome profile via Playwright projects
- Reports:
  - HTML: `playwright-report/index.html`
  - JSON: `reports/results.json`
  - Markdown: `reports/execution-report.md`

## Execution Commands

```bash
npm install
npx playwright install chromium
npm test
npm run report
```

One-step test + report:

```bash
npm run test:report
```

## Assumptions

- The public Netlify app is the test environment.
- Product catalog values observed on April 25, 2026 are the expected baseline.
- Demo credentials shown in the page source are valid for client-side login checks.
- Checkout does not create a real order or charge a card.
- Standard Shipping total bug (£11.99 vs £2.99) is a known defect and tests are written to match actual behavior.
