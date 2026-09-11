import { expect, test } from '@playwright/test';

test('loads history and detail microfrontends through the host', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'CATEGORIES' })).toBeVisible();

  await page.getByRole('button', { name: /Luis Meléndez/ }).click();
  await page.getByRole('menuitem', { name: 'View History' }).click();
  await expect(page.getByRole('heading', { name: 'Recently viewed' })).toBeVisible();
  await page.getByRole('button', { name: 'Close history' }).click();

  await page.getByRole('button', { name: 'Select charmander' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'charmander' })).toBeVisible();
});