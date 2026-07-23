import { expect, test } from '@playwright/test';

// Compact controls expand under pointer: coarse. jsdom tests can verify
// behavior but not geometry — only a real layout can prove their touch targets
// reach the intended size without overlapping interactive neighbors. Touch
// emulation makes `pointer: coarse` match. Keep the emulation options
// browser-neutral: Playwright's full iPhone preset sets `isMobile`, which
// Chromium/WebKit support but Firefox intentionally does not.
test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

const boxesIntersect = (a, b) =>
  a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

test.describe('Coarse-pointer hit targets', () => {
  test('entity-card action targets do not overlap each other or the title link', async ({ page }) => {
    await page.goto('/assumptions?tab=categories');

    const card = page.locator('.assumption-card').first();
    const titleLink = card.locator('.assumption-card__title-link');
    const editButton = card.getByRole('button', { name: /^Edit / });
    const justificationLink = card.getByRole('link', { name: /^Justification for / });
    await expect(justificationLink).toBeVisible();

    const [titleBox, editBox, justificationBox] = await Promise.all([
      titleLink.boundingBox(),
      editButton.boundingBox(),
      justificationLink.boundingBox(),
    ]);

    expect(titleBox).not.toBeNull();
    expect(editBox).not.toBeNull();
    expect(justificationBox).not.toBeNull();

    // Adjacent inline actions must not share any clickable pixels…
    expect(boxesIntersect(editBox, justificationBox)).toBe(false);
    // …and the vertical expansion must not reach the interactive row above.
    expect(boxesIntersect(editBox, titleBox)).toBe(false);
    expect(boxesIntersect(justificationBox, titleBox)).toBe(false);
  });

  test('cause selector close button has a full-size touch target', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Cause scope. Current selection: All causes' }).click();

    const closeButton = page.getByRole('button', { name: 'Close cause selector' });
    await expect(closeButton).toBeVisible();
    const closeBox = await closeButton.boundingBox();

    expect(closeBox).not.toBeNull();
    expect(closeBox.width).toBeGreaterThanOrEqual(44);
    expect(closeBox.height).toBeGreaterThanOrEqual(44);
  });
});
