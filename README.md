# Playwright Automation Framework

A personal end-to-end test automation framework built from scratch using Playwright and TypeScript, demonstrating industry-standard practices including the Page Object Model, CI/CD integration, and structured test organisation.

## 🧰 Tech Stack

| Tool | Purpose |
|---|---|
| [Playwright](https://playwright.dev/) | Browser automation & test runner |
| TypeScript | Strongly-typed test authoring |
| GitHub Actions | CI/CD pipeline |
| HTML Reporter | Test result reporting |

## 🏗️ Project Structure

```
playwright-automation/
├── pages/          # Page Object Model classes
├── tests/          # Test specs organised by feature
├── data/           # External test data
├── .github/
│   └── workflows/  # GitHub Actions CI configuration
├── playwright.config.ts
└── tsconfig.json
```

## ✅ Features

- **Page Object Model (POM)** — UI interactions are encapsulated in dedicated page classes, keeping tests clean and maintainable
- **TypeScript** — Full type safety across page objects and test files
- **Data-driven testing** — Test data externalised into a `data/` directory, keeping test logic separate from test inputs
- **CI/CD pipeline** — Automated test runs on every push via GitHub Actions, running against Chromium
- **Smart retry logic** — 2 retries on CI, 1 locally, reducing flakiness noise
- **Failure artefacts** — Screenshots and video automatically captured on test failure, traces on first retry
- **HTML reporting** — Built-in Playwright HTML reporter for readable local results

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm

### Installation

```bash
git clone https://github.com/Jikkles/playwright-automation.git
cd playwright-automation
npm install
npx playwright install chromium
```

### Running Tests

```bash
# Run all tests
npx playwright test

# Run with UI mode
npx playwright test --ui

# View HTML report
npx playwright show-report
```

## 🌐 Test Target

Tests run against [Sauce Demo](https://www.saucedemo.com/), a purpose-built e-commerce demo application commonly used for automation practice.

## 📋 CI/CD

Tests are executed automatically on every push to `main` via GitHub Actions, running in a headless Chromium environment with a single worker to ensure stable sequential execution.

## 🗺️ Roadmap

- [ ] API test coverage against Restful Booker
- [ ] Additional browsers (Firefox, WebKit)
- [ ] Custom fixtures and helpers
- [ ] Allure reporting integration