# Commit

Stage all relevant changes and create a detailed git commit for this Playwright TypeScript project.

## Instructions

1. Run `git status` and `git diff` to understand all staged and unstaged changes.
2. Stage the relevant files.
3. Write a commit message following the rules below.
4. Commit the changes.

## Commit Message Rules

Write the commit message in full, plain English sentences — not bullet shorthand. Be specific and descriptive.

### Title line

- One concise sentence summarising the overall change (under 72 characters)
- Use present tense (e.g. "Add", "Update", "Remove", "Fix")

### Body

Write full English sentences describing every change. Apply these rules:

- **Tests**: If a test is added or modified, name it in full — include the `test.describe` block name and the `test()` name. For example: _"The test 'Login › should display error for locked out user' has been updated to use the new `lockedOutUser` credential constant."_
- **Methods / functions**: If a method is added or modified on a Page Object or elsewhere, name it in full. For example: _"The method `InventoryPage.addItemToCartByName()` has been added to allow tests to add a specific product to the cart by its display name."_
- **Page Objects**: If a page object class is changed, name the class and describe the structural change.
- **Config / infrastructure**: Describe what changed and why (e.g. CI workflow, playwright.config.ts, package.json).
- **Deletions**: Clearly state what was removed and why it is no longer needed.

End the body with:
Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
