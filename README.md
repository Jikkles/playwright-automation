# Playwright Automation Framework

An end-to-end test automation framework built with Playwright and TypeScript, demonstrating industry-standard practices including the Page Object Model, Playwright fixtures, stored authentication state, cross-browser coverage, and a full CI/CD pipeline.

## 🧰 Tech Stack

| Tool                                  | Purpose                                            |
| ------------------------------------- | -------------------------------------------------- |
| [Playwright](https://playwright.dev/) | Browser automation & test runner                   |
| TypeScript                            | Strongly-typed test authoring                      |
| ESLint + eslint-plugin-playwright     | Static analysis and Playwright-specific lint rules |
| Prettier                              | Consistent code formatting                         |
| GitHub Actions                        | CI/CD pipeline                                     |
| HTML Reporter                         | Built-in Playwright test result reporting          |
| Allure Reporter                       | Rich interactive reporting with history and trends |
| axe-core / @axe-core/playwright       | Automated WCAG accessibility scanning              |

## 🏗️ Project Structure

```
playwright-automation/
├── fixtures/
│   └── index.ts            # Extended test with all page object fixtures
├── pages/                  # Page Object Model classes
├── tests/
│   ├── auth.setup.ts       # One-time auth setup — saves browser storage state
│   └── *.spec.ts           # Test specs organised by feature
├── data/                   # Externalised test data and credentials
├── .github/
│   └── workflows/          # GitHub Actions CI configuration
├── .env                    # Environment variable overrides (gitignored)
├── eslint.config.cjs       # ESLint configuration
├── .prettierrc.json        # Prettier configuration
├── playwright.config.ts
└── tsconfig.json
```

## ✅ Features

- **Page Object Model (POM)** — UI interactions encapsulated in dedicated page classes; tests never contain raw selectors or navigation logic
- **Playwright fixtures** — Page objects injected via `test.extend`, eliminating boilerplate from every spec file
- **Stored authentication** — `auth.setup.ts` logs in once per browser and saves storage state; subsequent tests skip the UI login entirely
- **Cross-browser coverage** — Tests run against Chromium, Firefox, and WebKit (Safari engine) in parallel, with independent auth state per engine
- **TypeScript** — Full type safety across page objects, fixtures, and test files with strict mode enabled
- **ESLint + Prettier** — Enforced code quality and consistent formatting, including Playwright-specific rules
- **Test tagging** — `@smoke` tags on critical-path tests enable fast targeted runs: `npm run test:smoke`
- **Environment variables** — Base URL and credentials configurable via `.env` (gitignored; defaults are built in)
- **Smart retry logic** — 2 retries in CI, 0 locally for an honest local signal
- **Failure artefacts** — Screenshots and video automatically captured on failure, traces on first retry
- **CI/CD pipeline** — Automated runs on every push and PR via GitHub Actions with browser caching
- **Allure reporting** — Rich interactive reports with step-level timings, inline attachments, and trend history across CI runs
- **Accessibility testing** — Automated WCAG 2 AA scans via axe-core on all key pages (login, inventory, cart, checkout)
- **Network resilience tests** — `page.route()` interception tests verify core functionality survives resource failures
- **Parameterised test data** — Checkout flow validated across multiple customer profiles covering different name formats and postal code conventions
- **Dependency automation** — Dependabot raises weekly PRs for npm packages and GitHub Actions pins

## 🚀 Getting Started

### Prerequisites

- Node.js v24+
- npm

### Installation

```bash
git clone https://github.com/Jikkles/playwright-automation.git
cd playwright-automation
npm install
npx playwright install chromium firefox webkit
```

### Environment Variables

Edit `.env` to override the base URL or credentials for a different environment:

### Running Tests

```bash
# Run the full suite (Chromium, Firefox, and WebKit)
npm test

# Run critical-path smoke tests only
npm run test:smoke

# Run with Playwright UI mode
npm run test:ui

# Run in a headed browser
npm run test:headed

# Open the last HTML report
npm run test:report

# Generate Allure report from last test run
npm run allure:generate

# Open the Allure report in a browser
npm run allure:open
```

### Code Quality

```bash
# Check for lint errors
npm run lint

# Auto-fix lint errors
npm run lint:fix

# Format all files
npm run format

# Check formatting without writing
npm run format:check

# Run TypeScript type checking without emitting files
npm run typecheck
```

## 🌐 Test Target

Tests run against [Sauce Demo](https://www.saucedemo.com/), a purpose-built e-commerce demo application commonly used for automation practice. Six test user profiles are available, covering standard behaviour, locked-out users, degraded UX, and performance simulation.

## 📋 CI/CD

Tests execute automatically on every push and pull request to `main` via GitHub Actions on `ubuntu-24.04`. The pipeline runs a **quality gate first** (lint, formatting, TypeScript type check, `npm audit`) before tests are allowed to start. If quality passes, the full Chromium, Firefox, and WebKit suite runs with 4 parallel workers. Playwright browsers are cached by a hash of `package-lock.json` and `playwright.config.ts`, so the cache auto-invalidates when the browser list changes. After the run, a minimum test count is asserted to catch accidental spec file deletion. Both the HTML report and Allure report are uploaded as build artefacts with a 5-day retention window. Allure history is persisted across runs via the Actions cache, enabling trend charts from the second run onward.

## 🔀 Branch workflow

Feature branches should be rebased onto `main` before pushing to keep the history linear and PRs up to date:

```bash
# Fetch and rebase in one step
npm run sync

# Then push (force needed after rebase)
git push --force-with-lease
```

A pre-push hook in `.githooks/pre-push` enforces this — it blocks the push and prints the above commands if your branch is behind `origin/main`. The hook is activated automatically via `core.hooksPath` in the repo config once you run `git config core.hooksPath .githooks` after cloning.

## 🗺️ Roadmap

- [x] WebKit (Safari) browser coverage
- [x] Allure reporting integration
- [x] Accessibility (WCAG) test coverage via axe-core
- [x] Network resilience tests
- [x] Automated dependency updates via Dependabot
- [ ] API test layer for faster setup and teardown
