# Detailed Test Cases

## Navigation

### TC-NAV-001: Home page exposes hero, browse CTA, popular sweets, and footer
- **Preconditions:** App is reachable
- **Steps:** Open `/`, verify title, hero heading, subtitle, Browse Sweets link, four popular products, and footer
- **Expected Result:** All content is visible and Browse Sweets points to `/sweets`

### TC-NAV-002: Header navigation reaches all primary pages
- **Preconditions:** App is reachable
- **Steps:** Open `/`, click Sweets, About, Login, and Basket links in header
- **Expected Result:** Each click opens the expected route and page heading

### TC-NAV-003: About page communicates promotion and application purpose
- **Preconditions:** App is reachable
- **Steps:** Open `/about`
- **Expected Result:** Promotion banner and Sweet Shop Project description are visible

### TC-NAV-004: Brand logo link navigates back to home from any page
- **Preconditions:** App is reachable, user is on `/sweets`
- **Steps:** Click the `a.navbar-brand` logo/link in the header
- **Expected Result:** URL returns to `/` and home hero heading is visible

### TC-NAV-005: Browse Sweets CTA on home hero navigates to sweets catalog
- **Preconditions:** App is reachable, user is on home page
- **Steps:** Click the "Browse Sweets" link in the hero section
- **Expected Result:** URL changes to `/sweets` and Browse sweets heading is visible

### TC-NAV-006: Footer copyright text is present across core pages
- **Preconditions:** App is reachable
- **Steps:** Open `/`, `/about`, and `/login`; check footer on each
- **Expected Result:** "Sweet Shop Project 2018" text is visible on all three pages

---

## Catalog

### TC-CAT-001: Sweets listing shows every product with description, price, image, and add action
- **Preconditions:** App is reachable
- **Steps:** Open `/sweets`, inspect each of the 16 configured product cards
- **Expected Result:** 16 products display correct name, description, price, image, and enabled Add to Basket button

### TC-CAT-002: Add-to-basket updates basket count for single and multiple products
- **Preconditions:** Basket is empty
- **Steps:** Open `/sweets`, add Chocolate Cups, then add Sherbert Straws
- **Expected Result:** Basket count increments from 0 to 1 and then 2

### TC-CAT-003: Home page add-to-basket action uses the same basket state
- **Preconditions:** Basket is empty
- **Steps:** Open `/`, add Bon Bons, open Basket
- **Expected Result:** Basket count is 1 and Bon Bons appears in the basket with price £1.00

### TC-CAT-004: Adding the same product twice increments basket count to 2
- **Preconditions:** Basket is empty
- **Steps:** Open `/sweets`, click Add to Basket for Chocolate Cups twice
- **Expected Result:** Basket count increments to 1 after first click and to 2 after second click

### TC-CAT-005: All product card images have non-empty src attributes
- **Preconditions:** App is reachable, `/sweets` is open
- **Steps:** Select all `.card img` elements and inspect their `src` attribute
- **Expected Result:** Every image has a non-null, non-empty src value

### TC-CAT-006: Sweets page browser title contains Sweet Shop
- **Preconditions:** App is reachable
- **Steps:** Open `/sweets`, check page title
- **Expected Result:** Page title matches `/Sweet Shop/i`

---

## Basket

### TC-BKT-001: Empty basket shows zero count, zero total, and checkout sections
- **Preconditions:** Basket is empty
- **Steps:** Open `/basket`
- **Expected Result:** Heading shows "Your Basket 0", total is £0.00, Delivery/Billing/Payment sections visible

### TC-BKT-002: Basket persists selected products and calculates product total
- **Preconditions:** Basket is empty
- **Steps:** Add Chocolate Cups (£1.00) and Sherbert Straws (£0.75), open Basket
- **Expected Result:** Both products are listed and total is £1.75

### TC-BKT-003: Shipping choice changes order total
- **Preconditions:** Chocolate Cups (£1.00) is in basket
- **Steps:** Open Basket, choose Standard Shipping, then Collect
- **Expected Result:** Total changes to £11.99 (known bug: actual app shows £11.99 instead of £2.99), then back to £1.00

### TC-BKT-004: Invalid promo code shows validation feedback and keeps basket total unchanged
- **Preconditions:** Chocolate Cups is in basket
- **Steps:** Open Basket, enter "NOT-A-CODE" in promo field, click Redeem
- **Expected Result:** Total remains £1.00

### TC-BKT-005: Empty basket link is accessible (NOTE: functionality is broken)
- **Preconditions:** Product exists in basket
- **Steps:** Open Basket, click "Empty Basket" link
- **Expected Result:** Link is visible and clickable; page remains functional (basket count element visible)

### TC-BKT-006: Three different products show correct combined basket total
- **Preconditions:** Basket is empty
- **Steps:** Add Chocolate Cups (£1.00) + Sherbert Straws (£0.75) + Bon Bons (£1.00), open Basket
- **Expected Result:** Heading shows "Your Basket 3", all three products listed, total is £2.75

### TC-BKT-007: Basket displays cheapest and most expensive items with correct combined total
- **Preconditions:** Basket is empty
- **Steps:** Add Bubbly (£0.10) and Swansea Mixture (£1.50), open Basket
- **Expected Result:** Both products listed, total is £1.60

---

## Promo Code Boundary

### TC-PROMO-001: Submitting a blank promo code leaves basket total unchanged
- **Preconditions:** Chocolate Cups (£1.00) is in basket
- **Steps:** Open Basket, click Redeem without entering anything in the promo code field
- **Expected Result:** Total remains £1.00

### TC-PROMO-002: Whitespace-only promo code leaves basket total unchanged
- **Preconditions:** Chocolate Cups (£1.00) is in basket
- **Steps:** Open Basket, enter "   " (spaces only) in promo code, click Redeem
- **Expected Result:** Total remains £1.00

### TC-PROMO-003: Special character promo code leaves basket total unchanged
- **Preconditions:** Chocolate Cups (£1.00) is in basket
- **Steps:** Open Basket, enter "!@#$%^&*()_+-=[]{}|;:<>?,./`~" in promo code, click Redeem
- **Expected Result:** Total remains £1.00

---

## Checkout

### TC-CHK-001: Checkout submission validates all required billing and payment fields
- **Preconditions:** App is reachable
- **Steps:** Open Basket and click "Continue to checkout" with all fields blank
- **Expected Result:** Validation messages visible for: first name, last name, email, address, country, state, zip, name on card, credit card number, expiration date, security code

### TC-CHK-002: Checkout accepts complete billing, delivery, and payment details
- **Preconditions:** Chocolate Cups in basket
- **Steps:** Fill all billing (Test User, test.user@example.com, 123 Test Street, UK, Bristol, BS1 1AA) and payment (Test User, 4111111111111111, 12/30, 123) fields, submit
- **Expected Result:** No validation error messages visible after submission

### TC-CHK-003: Filling only billing address fields still shows payment validation errors
- **Preconditions:** Chocolate Cups in basket
- **Steps:** Fill all billing address fields only (first/last name, email, address, country, state, zip), click "Continue to checkout"
- **Expected Result:** Payment field validation messages (name on card, credit card number, expiration, security code) are visible

### TC-CHK-004: Country dropdown contains selectable country options
- **Preconditions:** App is reachable
- **Steps:** Open `/basket`, inspect the Country select element and option count, select "United Kingdom"
- **Expected Result:** More than 1 option available; United Kingdom can be selected and select has a value

### TC-CHK-005: State dropdown populates after selecting a country
- **Preconditions:** App is reachable
- **Steps:** Open `/basket`, select "United Kingdom" from Country dropdown, inspect the state/county select
- **Expected Result:** State dropdown is visible and has more than 1 option

---

## Login

### TC-AUTH-001: Login page exposes email, password, submit button, and social links
- **Preconditions:** App is reachable
- **Steps:** Open `/login`
- **Expected Result:** Login heading, instruction text, email input, password input, Login button, and Twitter/Facebook/LinkedIn images are visible

### TC-AUTH-002: Invalid login submission shows field validation feedback
- **Preconditions:** App is reachable
- **Steps:** Open `/login`, click Login without entering credentials
- **Expected Result:** "Use one of the demo email addresses" and "Please enter a valid password" messages visible

### TC-AUTH-003: Valid demo credentials can be submitted without client-side validation errors
- **Preconditions:** App is reachable
- **Steps:** Open `/login`, enter `test@user.com` and `qwerty`, submit
- **Expected Result:** Form has `was-validated` class applied; email field retains value

### TC-AUTH-004: Password field has type="password" so input is masked
- **Preconditions:** App is reachable
- **Steps:** Open `/login`, get the `type` attribute of the Password input
- **Expected Result:** type attribute value is "password"

### TC-AUTH-005: Email field has type="email" for native browser validation
- **Preconditions:** App is reachable
- **Steps:** Open `/login`, get the `type` attribute of the Email address input
- **Expected Result:** type attribute value is "email"

### TC-AUTH-006: Login page browser title contains Sweet Shop
- **Preconditions:** App is reachable
- **Steps:** Open `/login`, check page title
- **Expected Result:** Page title matches `/Sweet Shop/i`

---

## Accessibility Baseline

### TC-A11Y-001: All product images on sweets page have non-empty alt attributes
- **Preconditions:** App is reachable
- **Steps:** Open `/sweets`, select all `.card img` elements, read each `alt` attribute
- **Expected Result:** Every product image has a non-null, non-empty alt attribute

### TC-A11Y-002: Login form labels are correctly associated with their input fields
- **Preconditions:** App is reachable
- **Steps:** Open `/login`, read `for` attribute on each label (Email address, Password), locate matching element by ID
- **Expected Result:** Both labels have a `for` attribute whose value matches a visible input element ID

### TC-A11Y-003: Primary navigation links have discernible text content
- **Preconditions:** App is reachable
- **Steps:** Open `/`, select all `nav a` elements, read text content of each
- **Expected Result:** Every navigation anchor has non-empty, non-whitespace text content
