import { expect, test } from '@playwright/test';
import { recipientsById } from '../src/data/generatedData.js';

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

test.describe('Scroll behavior', () => {
  test('browser Back from the calculator restores the homepage position', async ({ page }) => {
    await page.goto('/');

    const calculatorLink = page.getByRole('link', { name: /Calculate the lives you could save/i });
    await calculatorLink.scrollIntoViewIfNeeded();
    const scrollYBeforeNavigation = await page.evaluate(() => window.scrollY);
    expect(scrollYBeforeNavigation).toBeGreaterThan(0);

    await calculatorLink.click();
    await expect(page.getByRole('heading', { name: 'Donation Calculator' })).toBeVisible();
    // A visible lazy-route heading can precede the route scroll effect under
    // heavy parallel load. Confirm that the destination has settled before
    // exercising Back, just as a visitor would after arriving on the page.
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await page.goBack();
    await expect(page.getByRole('heading', { name: 'Impact List', level: 1 })).toBeVisible();

    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 7000 }).toBe(scrollYBeforeNavigation);
  });

  test('browser Back from a same-page justification anchor restores its prior position', async ({ page }) => {
    await page.goto('/recipients');
    const recipientHref = await page.locator('a[href^="/recipient/"]').first().getAttribute('href');
    expect(recipientHref).toBeTruthy();

    await page.goto(recipientHref);
    const scrollYBeforeAnchor = await page.evaluate(() => window.scrollY);
    await page.getByRole('link', { name: 'Cost per life justification' }).click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(scrollYBeforeAnchor);

    await page.goBack();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(scrollYBeforeAnchor);
  });

  test('browser Back restoration outranks a multi-category editor landing scroll', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    const multiCategoryRecipientEntry = Object.entries(recipientsById).find(
      ([, recipient]) => Object.keys(recipient.categories || {}).length > 1
    );
    if (!multiCategoryRecipientEntry) {
      throw new Error('Expected generated data to contain at least one recipient with multiple categories');
    }
    const [recipientId, recipient] = multiCategoryRecipientEntry;
    const activeCategory = Object.keys(recipient.categories)[0];
    const editorUrl = `/assumptions?tab=recipients&recipientId=${encodeURIComponent(
      recipientId
    )}&activeCategory=${encodeURIComponent(activeCategory)}`;
    await page.goto(editorUrl);
    await expect(page.getByLabel('Preview calculations for year:')).toBeVisible();

    // A fresh deep link should still perform the intentional category landing.
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

    const savedScrollY = await page.evaluate(
      () =>
        new Promise((resolve) => {
          const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
          window.scrollTo(0, Math.floor(maxScrollY * 0.7));
          window.requestAnimationFrame(() => resolve(window.scrollY));
        })
    );
    expect(savedScrollY).toBeGreaterThan(0);

    // Invoke the real React Router link without Playwright first scrolling
    // the header element into view and changing the source position.
    await page.getByRole('link', { name: 'FAQ', exact: true }).evaluate((link) => link.click());
    await expect(page.getByRole('heading', { name: 'FAQ', level: 1 })).toBeVisible();

    await page.goBack();
    await expect(page.getByLabel('Preview calculations for year:')).toBeVisible();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(savedScrollY);

    // The editor's category landing used to fire after restoration and win
    // 100 ms later. Verify the restored position remains stable past it.
    await page.waitForTimeout(200);
    expect(await page.evaluate(() => window.scrollY)).toBe(savedScrollY);
  });

  test('reload restores position but a fresh hard visit starts at the top', async ({ page }) => {
    await page.goto('/faq');
    await expect(page.getByRole('heading', { name: 'FAQ', level: 1 })).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 1000));
    const savedScrollY = await page.evaluate(() => window.scrollY);
    expect(savedScrollY).toBeGreaterThan(0);

    await page.reload();
    await expect(page.getByRole('heading', { name: 'FAQ', level: 1 })).toBeVisible();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(savedScrollY);

    await page.goto('/');
    await page.goto('/faq');
    await expect(page.getByRole('heading', { name: 'FAQ', level: 1 })).toBeVisible();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  });

  test('compact donation modal reveals and focuses its first validation error', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 450 });
    await page.goto('/calculator');
    await page.getByRole('button', { name: 'Add Specific Donation' }).click();

    const modal = page.getByTestId('specific-donation-modal');
    await modal.getByRole('button', { name: 'New Recipient' }).click();
    const submitButton = modal.getByRole('button', { name: 'Add Donation' });
    await submitButton.scrollIntoViewIfNeeded();
    await submitButton.click();

    const recipientName = modal.getByLabel('Recipient Name');
    await expect(recipientName).toBeFocused();
    await expect
      .poll(async () => {
        const panelBox = await page.locator('.impact-modal__panel').boundingBox();
        const fieldBox = await recipientName.boundingBox();
        return Boolean(
          panelBox &&
            fieldBox &&
            fieldBox.y >= panelBox.y &&
            fieldBox.y + fieldBox.height <= panelBox.y + panelBox.height
        );
      })
      .toBe(true);
  });
});
