# Project: Playwright Automation Framework

## Overview
A Playwright + TypeScript end-to-end test automation framework built against [SauceDemo](https://www.saucedemo.com/) — a demo e-commerce site used for QA practice. The goal is to learn and build out a proper automation framework with the Page Object Model pattern.

## Key Commands
```bash
npx playwright test                  # Run all tests
npx playwright test tests/login.spec.ts  # Run a specific spec file
npx playwright test --ui             # Open Playwright UI mode
npx playwright show-report           # Open the last HTML report
```

## Architecture

### Pattern: Page Object Model (POM)
All page interactions are abstracted into classes under `pages/`. Test files in `tests/` import and use these classes — they should not contain raw selectors or navigation logic.

- `pages/LoginPage.ts` — login form interactions and credentials
- `pages/InventoryPage.ts` — product listing page
- `pages/CartPage.ts` — shopping cart page
- `tests/login.spec.ts` — login flow tests
- `tests/inventory.spec.ts` — inventory page tests
- `tests/cart.spec.ts` — cart tests

### Config
- `playwright.config.ts` — base URL is `https://www.saucedemo.com/`, runs Chromium only, HTML reporter, retries on failure, screenshots/video on failure
- TypeScript configured via `tsconfig.json`

## Test Users (SauceDemo)
- `standard_user` / `secret_sauce` — standard working user
- `locked_out_user` / `secret_sauce` — locked out user (used for negative testing)

## Conventions
- Use Page Object classes for all selectors and actions — keep specs clean
- Tests use `test.describe` blocks grouped by page/feature
- Screenshots and video are captured automatically on failure (configured in playwright.config.ts)
- Retries: 1 locally, 2 in CI
