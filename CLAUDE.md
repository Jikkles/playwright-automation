# Project: Playwright Automation Framework

## Overview

A Playwright + TypeScript end-to-end test automation framework built against [SauceDemo](https://www.saucedemo.com/) — a demo e-commerce site used for QA practice. Implements the Page Object Model pattern with Playwright fixtures, stored authentication state, and full CI/CD integration.

## Key Commands

```bash
npm test                             # Run all tests
npm run test:smoke                   # Run smoke suite only (@smoke tagged tests)
npm run test:ui                      # Open Playwright UI mode
npm run test:headed                  # Run tests in headed browser
npm run test:report                  # Open the last HTML report
npm run lint                         # Check for lint errors
npm run lint:fix                     # Auto-fix lint errors
npm run format                       # Format all files with Prettier
npm run format:check                 # Check formatting without writing
```

## Architecture

### Pattern: Page Object Model (POM) + Playwright Fixtures

All page interactions are abstracted into classes under `pages/`. Tests import the extended `test` object from `fixtures/index.ts`, which injects page objects directly — tests never call `new PageObject(page)` themselves.

```ts
// Correct pattern in spec files
import { test, expect } from '../fixtures';

test('example', async ({ inventoryPage, cartPage }) => {
  await inventoryPage.addFirstItemToCart();
  await inventoryPage.goToCart();
  expect(await cartPage.getCartItemCount()).toBe(1);
});
```

### BasePage

`pages/BasePage.ts` is an abstract class that all authenticated page objects extend. It holds the shared navigation chrome that exists on every authenticated page: burger menu locators and actions (`logout`, `resetAppState`, `navigateToAllItems`, `openBurgerMenu`, `closeBurgerMenu`), the cart icon and badge (`goToCart`, `getCartBadgeCount`), and `pageTitle`.

`LoginPage` does **not** extend `BasePage` — it is an unauthenticated page with no shared chrome.

Use the most contextually appropriate page object to call inherited methods:

```ts
// On the cart page — use cartPage, not inventoryPage, for burger menu actions
await cartPage.navigateToAllItems();
```

### Authentication

`tests/auth.setup.ts` runs before all other tests. It logs in as `standard_user` and saves the browser storage state per browser to `.auth/${browserName}.json` (e.g. `.auth/chromium.json`, `.auth/firefox.json`). All specs except login and non-standard-user suites load this state automatically — no UI login required.

Specs that test login flows or non-standard users override the stored state at the describe level:

```ts
test.use({ storageState: { cookies: [], origins: [] } });
```

### File Structure

```
fixtures/index.ts          — extended test with all page object fixtures
tests/auth.setup.ts        — one-time auth setup (runs before all specs)
pages/BasePage.ts          — abstract base with shared nav chrome
pages/                     — Page Object Model classes (all extend BasePage except LoginPage)
tests/                     — test specifications
data/credentials.ts        — test user credentials (reads from env vars)
data/checkout.ts           — customer fixture data
data/utils.ts              — shared test data utilities (e.g. parseCurrency)
.env                       — environment variable overrides (gitignored)
```

### Config

- `playwright.config.ts` — base URL from `BASE_URL` env var, Chromium + Firefox, multi-reporter in CI, 4 workers in CI, 0 local retries, 60s test timeout, 10s action timeout, 30s navigation timeout
- `tsconfig.json` — strict TypeScript across pages, tests, fixtures, data
- `eslint.config.cjs` — TypeScript ESLint + Playwright plugin rules
- `.prettierrc.json` — consistent formatting (single quotes, 100 char width)

## Environment Variables

Edit `.env` to override values and target a different environment:

```
BASE_URL=https://www.saucedemo.com/
TEST_PASSWORD=secret_sauce
STANDARD_USER=standard_user
```

## Test Users (SauceDemo)

| User                      | Notes                                                              |
| ------------------------- | ------------------------------------------------------------------ |
| `standard_user`           | Normal working user — used by stored auth setup                    |
| `locked_out_user`         | Cannot log in — used for negative login tests                      |
| `problem_user`            | Degraded UX — sort broken, last name field silently drops input    |
| `performance_glitch_user` | Artificial ~5s login delay                                         |
| `error_user`              | Some interactions produce errors — covered in `error-user.spec.ts` |

## Test Tagging

Smoke tests use Playwright's structured tag format:

```ts
test('should login with valid credentials', { tag: '@smoke' }, async ({ ... }) => { ... });
```

- `@smoke` — critical path, run on every commit: `npm run test:smoke`
- No tag — full regression suite: `npm test`

## Conventions

- Import `test` and `expect` from `../fixtures`, never directly from `@playwright/test`
- Page objects are injected via fixtures — destructure only what the test needs
- Tests start from a known URL in `beforeEach` (`page.goto('/inventory.html')`)
- `login.spec.ts`, `problem-user.spec.ts`, and `error-user.spec.ts` use `test.use({ storageState: ... })` to clear auth
- Use `test.fixme(true, 'reason')` to mark known upstream bugs — never `test.fail()`
- Long E2E tests use `test.step()` to create named sections in the HTML report
- `getCartBadgeCount()` returns `number` — compare with numeric literals, not strings
- Screenshots, video, and traces captured automatically on failure
- Retries: 0 locally, 2 in CI
