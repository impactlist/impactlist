import { expect, test } from '@playwright/test';

// The core product flow: home ranking table -> donor detail -> back, plus a
// recipient detail hop and 404 handling for stale links.
test.describe('Donor list and detail flow', () => {
  test('home page ranks donors and links to a working detail page @smoke', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Impact List/);
    await expect(page.getByRole('heading', { name: 'Impact List', level: 1 })).toBeVisible();

    // The ranking table renders with sortable headers and donor rows.
    const table = page.getByRole('table');
    await expect(table).toBeVisible();
    const donorLinks = table.locator('a[href^="/donor/"]');
    expect(await donorLinks.count()).toBeGreaterThan(5);

    // Visit the top-ranked donor.
    const topDonorName = (await donorLinks.first().textContent()).trim();
    await donorLinks.first().click();

    await expect(page).toHaveURL(/\/donor\//);
    await expect(page.getByRole('heading', { name: topDonorName, level: 1 })).toBeVisible();
    await expect(page).toHaveTitle(new RegExp(topDonorName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

    // The donations table links through to a recipient detail page.
    const recipientLink = page.locator('a[href^="/recipient/"]').first();
    await expect(recipientLink).toBeVisible();
    const recipientName = (await recipientLink.textContent()).trim();
    await recipientLink.click();

    await expect(page).toHaveURL(/\/recipient\//);
    await expect(page.getByRole('heading', { name: recipientName, level: 1 })).toBeVisible();

    // Browser back returns to the donor page.
    await page.goBack();
    await expect(page.getByRole('heading', { name: topDonorName, level: 1 })).toBeVisible();
  });

  test('unknown donor IDs and URLs show the not-found page, not an error screen', async ({ page }) => {
    await page.goto('/donor/this-donor-does-not-exist');
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
    await expect(page.getByText('No donor found with ID')).toBeVisible();

    await page.goto('/totally/unknown/path');
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();

    // The escape hatch works.
    await page.getByRole('link', { name: 'Back to the Impact List' }).click();
    await expect(page.getByRole('heading', { name: 'Impact List', level: 1 })).toBeVisible();
  });
});
