import { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export async function checkAccessibility(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).analyze();
  if (results.violations.length > 0) {
    const summary = results.violations
      .map((v) => `[${v.impact}] ${v.id}: ${v.description}`)
      .join('\n');
    throw new Error(`Accessibility violations found:\n${summary}`);
  }
}
