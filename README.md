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
| HTML Reporter                         | Test result reporting                              |

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
- **Cross-browser coverage** — Tests run against Chromium and Firefox in parallel, with independent auth state per engine
- **TypeScript** — Full type safety across page objects, fixtures, and test files with strict mode enabled
- **ESLint + Prettier** — Enforced code quality and consistent formatting, including Playwright-specific rules
- **Test tagging** — `@smoke` tags on critical-path tests enable fast targeted runs: `npm run test:smoke`
- **Environment variables** — Base URL and credentials configurable via `.env`, documented in `.env.example`
- **Smart retry logic** — 2 retries in CI, 0 locally for an honest local signal
- **Failure artefacts** — Screenshots and video automatically captured on failure, traces on first retry
- **CI/CD pipeline** — Automated runs on every push and PR via GitHub Actions with browser caching

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

Tests execute automatically on every push and pull request to `main` via GitHub Actions on `ubuntu-24.04`. The pipeline caches Playwright browsers by `package-lock.json` hash, runs the full Chromium and Firefox suite with 4 parallel workers, and uploads the HTML report as a build artefact with a 5-day retention window.

## 🗺️ Roadmap

- [ ] WebKit (Safari) browser coverage
- [ ] API test layer for faster setup and teardown
- [ ] Allure reporting integration
