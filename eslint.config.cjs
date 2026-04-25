const tseslint = require('typescript-eslint');
const playwright = require('eslint-plugin-playwright');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = [
  ...tseslint.configs.recommended,
  {
    files: ['tests/**/*.spec.ts'],
    plugins: { playwright },
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/expect-expect': ['error', { assertFunctionNames: ['expect', 'checkAccessibility'] }],
      'playwright/no-wait-for-timeout': 'warn',
      'playwright/no-skipped-test': 'warn',
    },
  },
  {
    ignores: [
      'node_modules/',
      'playwright-report/',
      'test-results/',
      '.auth/',
      'eslint.config.cjs',
    ],
  },
  eslintConfigPrettier,
];
