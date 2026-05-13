# Sweet Shop Test Strategy

## Objective

Validate the Sweet Shop web application at `https://sweetshop.netlify.app/sweets` across customer browsing, basket, login, checkout, accessibility, and navigation journeys. The strategy targets near-complete functional coverage of the visible application surface, plus regression checks for navigation, validations, totals, state persistence, and baseline accessibility.

## Scope

In scope:

- Home page and primary navigation (including logo and Browse Sweets CTA)
- Footer copyright presence across all pages
- Sweets catalog: product card content, images, and page title
- Add-to-basket behavior from Home and Sweets pages (single, duplicate, multiple products)
- Basket count, basket contents, totals, delivery selection, promo validation (valid/invalid/boundary), and empty basket
- Checkout billing and payment field validation (full blank, partial, complete)
- Checkout country and state dropdowns
- Login form validation, input types, and demo credential submission
- Static About page content and promotion banner
- Baseline accessibility: alt text, label association, nav link text
- Desktop Chrome and mobile Chrome responsive execution

Out of scope:

- Backend order processing (public app does not expose a real payment/order service)
- Real payment authorization
- Security penetration testing
- Cross-browser matrix beyond configured Playwright projects unless requested
- Deep accessibility audits (WCAG AA full conformance)

## Test Levels

- Smoke: Page load, navigation, core headings, and primary controls
- Functional: Catalog, basket, checkout, login, promo, and validation behavior
- Regression: Full Playwright suite on every change or release candidate
- Responsive: Same suite on desktop and mobile Chrome projects
- Accessibility Baseline: Alt text, label associations, nav link text

## Test Types

- Positive tests for valid navigation, add-to-basket, and complete form entry
- Negative tests for missing required data and invalid/blank/whitespace/special-char promo codes
- Data validation tests for field-level feedback and input type attributes
- State tests for basket count and product persistence
- UI content tests for product names, descriptions, prices, images, and static page copy
- Boundary tests for promo code inputs and duplicate product adds
- Accessibility baseline tests for alt text, labels, and link text

## Entry Criteria

- Target URL is reachable
- Playwright and TypeScript dependencies and browser binaries are installed (`npm install && npx playwright install chromium`)
- Test environment is stable enough to execute without planned downtime
- No blocking changes to routes or core page structure

## Exit Criteria

- All 37 automated tests have executed on both configured Playwright projects (chromium, mobile-chrome)
- Execution report is generated at `reports/execution-report.md`
- Critical and high-severity defects are logged with evidence
- Any remaining failures are triaged as product defects, test issues, or environment issues

## Risk Areas

- Basket totals and shipping calculations (known string-concatenation bug on Standard Shipping)
- State carryover between pages
- Required-field validation and form labels
- Product catalog completeness (16 products)
- Empty Basket functionality (currently broken in application)
- Mobile layout preserving access to navigation and checkout controls

## Tools

- Playwright Test for browser automation (TypeScript)
- Playwright HTML report for screenshots, traces, and videos on failure
- `tsx` for running the TypeScript execution report generator script
- Custom Markdown report generator for stakeholder-friendly execution summary

## Language

All test code, fixtures, and scripts are written in **TypeScript**. The Playwright config, fixtures, spec files, and report script are all `.ts` files.

## Test Data

- Demo login: `test@user.com` / `qwerty`
- Products and prices are maintained in `tests/fixtures/products.ts`
- Checkout card data uses non-real test values and does not submit to a payment gateway

## Known Defects

| Defect | Area | Severity |
| --- | --- | --- |
| Standard Shipping total shows £11.99 instead of £2.99 (string concat instead of addition) | Basket | High |
| Empty Basket link does not clear basket contents | Basket | High |

## Defect Severity

- Critical: Core purchase flow unusable, basket cannot persist, checkout cannot be reached
- High: Incorrect totals, required validation missing, major navigation break
- Medium: Incorrect static content, missing image, promo validation issue
- Low: Minor copy, layout, or cosmetic issue with no workflow impact
