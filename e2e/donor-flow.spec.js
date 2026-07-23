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

  test('shared cause scope recalculates the ranking and can be reset', async ({ page }) => {
    await page.goto('/?causes=global-health');

    const table = page.getByRole('table');
    const donorLinks = table.locator('tbody a[href^="/donor/"]');
    const billGatesRow = table.getByRole('row', { name: /Bill Gates/ });
    const scopeSummary = page.getByRole('region', { name: 'Active cause scope' });

    await expect(scopeSummary).toContainText('Global Health');
    await expect(donorLinks.first()).toBeVisible();
    await expect(billGatesRow).toBeVisible();
    const scopedDonorCount = await donorLinks.count();
    const scopedBillGatesText = await billGatesRow.innerText();

    await scopeSummary.getByRole('button', { name: 'Switch to all causes' }).click();

    await expect(page).toHaveURL('/');
    await expect(scopeSummary).toHaveCount(0);
    await expect.poll(() => donorLinks.count()).toBeGreaterThan(scopedDonorCount);
    await expect(page.getByRole('button', { name: 'Cause scope. Current selection: All causes' })).toBeVisible();
    expect(await billGatesRow.innerText()).not.toBe(scopedBillGatesText);
  });

  test('cause selector stays within the viewport when it opens from the left toolbar column', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 900 });
    await page.goto('/');

    await page.getByRole('button', { name: 'Cause scope. Current selection: All causes' }).click();

    const dialog = page.getByRole('dialog', { name: 'Choose causes' });
    await expect(dialog).toBeVisible();

    const dialogBox = await dialog.boundingBox();
    const viewportWidth = await page.evaluate(() => window.innerWidth);

    expect(dialogBox).not.toBeNull();
    expect(dialogBox.x).toBeGreaterThanOrEqual(0);
    expect(dialogBox.x + dialogBox.width).toBeLessThanOrEqual(viewportWidth);
  });

  test('donor category chart renders bar value labels in both views', async ({ page }) => {
    // Regression: both previous label mechanisms silently rendered nothing
    // (recharts passes label formatters only the value, and label content
    // functions the row INDEX, not the payload). jsdom can't render recharts
    // bars, so this contract is only verifiable in a real browser.
    await page.goto('/donor/bill-gates');
    await expect(page.getByRole('heading', { name: 'Bill Gates', level: 1 })).toBeVisible();

    // Donations view (default): labels read like "$1.23 B (45.6%)".
    const barLabel = page.getByText(/\(\d[\d.,]*%\)/).first();
    await expect(barLabel).toBeVisible();

    // Lives-saved view relabels after the toggle animation settles.
    await page.getByRole('tab', { name: 'Lives Saved' }).click();
    await expect(page.getByText(/\(\d[\d.,]*%\)/).first()).toBeVisible();
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

// Date-only strings parse as UTC midnight; formatted in local time they'd
// display the PREVIOUS day for any viewer west of UTC (the whole US). The
// unit suite can't force a timezone (Node caches it per process and CI runs
// in UTC), so this pins the regression deterministically in a real browser.
test.describe('Donation dates render on the recorded day', () => {
  test.use({ timezoneId: 'America/Los_Angeles' });

  test('west-of-UTC viewers see Jan 1 dates as Jan 1, not Dec 31 of the prior year', async ({ page }) => {
    // Jaan Tallinn's grants include 36 donations dated 2024-01-01 and none
    // dated 2023-12-31, so any "Dec 31, 2023" here is the timezone bug.
    await page.goto('/donor/jaan-tallinn');
    await expect(page.getByRole('heading', { name: 'Jaan Tallinn', level: 1 })).toBeVisible();

    await expect(page.getByText('Jan 1, 2024').first()).toBeVisible();
    await expect(page.getByText('Dec 31, 2023')).toHaveCount(0);
  });
});

test.describe('Landscape touch cause selector', () => {
  test.use({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 844, height: 390 },
  });
  test.skip(({ browserName }) => browserName === 'firefox', 'Firefox does not support Playwright mobile emulation.');

  test('uses the modal presentation and keeps it open while changing a cause', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Cause scope. Current selection: All causes' }).tap();

    const dialog = page.getByRole('dialog', { name: 'Choose causes' });
    const animalWelfareCheckbox = dialog.getByRole('checkbox', { name: 'Animal Welfare' });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(dialog).toBeFocused();
    await expect(dialog.getByRole('textbox', { name: 'Search causes' })).not.toBeFocused();
    await expect(animalWelfareCheckbox).toBeChecked();

    const viewportHeight = await page.evaluate(() => window.innerHeight);
    await expect
      .poll(async () => {
        const dialogBox = await dialog.boundingBox();
        return (
          dialogBox && {
            topInsideViewport: dialogBox.y >= 0,
            bottomInsideViewport: dialogBox.y + dialogBox.height <= viewportHeight,
          }
        );
      })
      .toEqual({ topInsideViewport: true, bottomInsideViewport: true });

    await dialog.getByText('Animal Welfare', { exact: true }).tap();

    await expect(dialog).toBeVisible();
    await expect(animalWelfareCheckbox).not.toBeChecked();
    await expect(dialog).toContainText('27 of 28 selected');
  });

  test('keeps the apply action fully reachable on very short landscape screens', async ({ page }) => {
    await page.setViewportSize({ width: 568, height: 320 });
    await page.goto('/');

    await page.getByRole('button', { name: 'Cause scope. Current selection: All causes' }).tap();

    const dialog = page.getByRole('dialog', { name: 'Choose causes' });
    const applyButton = dialog.getByRole('button', { name: 'Apply scope' });
    await expect(dialog).toBeVisible();

    const viewportHeight = await page.evaluate(() => window.innerHeight);
    await expect
      .poll(async () => {
        const [dialogBox, applyButtonBox] = await Promise.all([dialog.boundingBox(), applyButton.boundingBox()]);
        return (
          dialogBox &&
          applyButtonBox && {
            insideDialog:
              applyButtonBox.y >= dialogBox.y &&
              applyButtonBox.y + applyButtonBox.height <= dialogBox.y + dialogBox.height,
            insideViewport: applyButtonBox.y >= 0 && applyButtonBox.y + applyButtonBox.height <= viewportHeight,
          }
        );
      })
      .toEqual({ insideDialog: true, insideViewport: true });

    await dialog.getByText('Animal Welfare', { exact: true }).tap();
    await expect(applyButton).toBeEnabled();
    await applyButton.tap();

    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Cause scope. Current selection: 27 causes' })).toBeVisible();
  });
});
