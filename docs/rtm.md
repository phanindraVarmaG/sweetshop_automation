# Requirement Traceability Matrix

| Requirement ID | Requirement | Test IDs | Status |
| --- | --- | --- | --- |
| REQ-NAV-001 | User can access Home, Sweets, About, Login, and Basket from primary navigation | TC-NAV-001, TC-NAV-002 | Automated |
| REQ-NAV-002 | Home page displays welcome content, browse CTA, popular products, and footer | TC-NAV-001, TC-NAV-005 | Automated |
| REQ-NAV-003 | Brand logo navigates user back to home page | TC-NAV-004 | Automated |
| REQ-NAV-004 | Footer copyright text is visible across all pages | TC-NAV-006 | Automated |
| REQ-ABOUT-001 | About page displays promotion and Sweet Shop project description | TC-NAV-003 | Automated |
| REQ-CAT-001 | Sweets catalog lists all 16 available products | TC-CAT-001 | Automated |
| REQ-CAT-002 | Each product card displays image, name, description, price, and Add to Basket action | TC-CAT-001 | Automated |
| REQ-CAT-003 | Product card images have valid src attributes | TC-CAT-005 | Automated |
| REQ-CAT-004 | User can add products to basket from catalog (single product) | TC-CAT-002 | Automated |
| REQ-CAT-005 | User can add popular products to basket from home page | TC-CAT-003 | Automated |
| REQ-CAT-006 | Adding the same product multiple times accumulates in basket count | TC-CAT-004 | Automated |
| REQ-CAT-007 | Sweets page has a valid browser title | TC-CAT-006 | Automated |
| REQ-BKT-001 | Basket count reflects selected product quantity | TC-CAT-002, TC-CAT-003, TC-CAT-004, TC-BKT-005 | Automated |
| REQ-BKT-002 | Basket page displays selected products and correct product total | TC-BKT-002, TC-BKT-006, TC-BKT-007 | Automated |
| REQ-BKT-003 | Empty basket state displays zero count and zero total | TC-BKT-001 | Automated |
| REQ-BKT-004 | Delivery option changes total correctly | TC-BKT-003 | Automated |
| REQ-BKT-005 | Invalid promo code displays validation feedback without discounting total | TC-BKT-004 | Automated |
| REQ-BKT-006 | Blank promo code submission does not affect total | TC-PROMO-001 | Automated |
| REQ-BKT-007 | Whitespace promo code does not affect total | TC-PROMO-002 | Automated |
| REQ-BKT-008 | Special character promo code does not affect total | TC-PROMO-003 | Automated |
| REQ-BKT-009 | User can attempt to empty basket (link is accessible) | TC-BKT-005 | Automated |
| REQ-CHK-001 | Checkout requires all billing address fields | TC-CHK-001, TC-CHK-003 | Automated |
| REQ-CHK-002 | Checkout requires all payment fields | TC-CHK-001, TC-CHK-003 | Automated |
| REQ-CHK-003 | User can enter complete checkout details | TC-CHK-002 | Automated |
| REQ-CHK-004 | Country dropdown provides selectable country options | TC-CHK-004 | Automated |
| REQ-CHK-005 | State dropdown populates based on selected country | TC-CHK-005 | Automated |
| REQ-AUTH-001 | Login page displays email, password, login button, and social links | TC-AUTH-001 | Automated |
| REQ-AUTH-002 | Login validates blank/invalid required fields | TC-AUTH-002 | Automated |
| REQ-AUTH-003 | Demo credentials can be entered and submitted | TC-AUTH-003 | Automated |
| REQ-AUTH-004 | Password field masks input (type=password) | TC-AUTH-004 | Automated |
| REQ-AUTH-005 | Email field uses browser email validation (type=email) | TC-AUTH-005 | Automated |
| REQ-AUTH-006 | Login page has a valid browser title | TC-AUTH-006 | Automated |
| REQ-A11Y-001 | Product images have descriptive alt text | TC-A11Y-001 | Automated |
| REQ-A11Y-002 | Form labels are programmatically associated with their inputs | TC-A11Y-002 | Automated |
| REQ-A11Y-003 | Navigation links have discernible text content | TC-A11Y-003 | Automated |
| REQ-RESP-001 | Critical flows work on desktop and mobile viewport profiles | All automated test IDs | Automated via projects |
