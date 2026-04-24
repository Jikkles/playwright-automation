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
├── .env.example            # Documents all supported environment variables
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
- **Environment variables** — Base URL and credentials configurable via `.env`, documented in `.env.example`
- **Smart retry logic** — 2 retries in CI, 0 locally for an honest local signal
- **Failure artefacts** — Screenshots and video automatically captured on failure, traces on first retry
- **CI/CD pipeline** — Automated runs on every push and PR via GitHub Actions with browser caching
- **Allure reporting** — Rich interactive reports with step-level timings, inline attachments, and trend history across CI runs

## 🚀 Getting Started

### Prerequisites

- Node.js v24+
- npm

### Installation

```bash
git clone https://github.com/Jikkles/playwright-automation.git
cd playwright-automation
npm install
npx playwright install chromium firefox
```

### Environment Variables

Copy `.env.example` to `.env` to override the base URL or credentials for a different environment:

```bash
cp .env.example .env
```

### Running Tests

```bash
# Run the full suite (Chromium + Firefox)
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
```

## 🌐 Test Target

Tests run against [Sauce Demo](https://www.saucedemo.com/), a purpose-built e-commerce demo application commonly used for automation practice. Six test user profiles are available, covering standard behaviour, locked-out users, degraded UX, and performance simulation.

## 📋 CI/CD

Tests execute automatically on every push and pull request to `main` via GitHub Actions on `ubuntu-24.04`. The pipeline caches Playwright browsers by a hash of `package-lock.json` and `playwright.config.ts` (so the cache auto-invalidates when the browser list changes), runs the full Chromium, Firefox, and WebKit suite with 4 parallel workers, and uploads both the HTML report and Allure report as build artefacts with a 5-day retention window. Allure history is persisted across runs via the Actions cache, enabling trend charts from the second run onward.

## 🗺️ Roadmap

- [x] WebKit (Safari) browser coverage
- [ ] API test layer for faster setup and teardown
- [x] Allure reporting integration
