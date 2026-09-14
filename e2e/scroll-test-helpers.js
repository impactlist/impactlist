import { expect } from '@playwright/test';

export const settleAndReadScrollY = (page) =>
  page.evaluate(
    () =>
      new Promise((resolve) => {
        window.requestAnimationFrame(() => window.requestAnimationFrame(() => resolve(window.scrollY)));
      })
  );

/**
 * Settle relevant entrance motion and finish Playwright's click actionability
 * checks before a test records scroll. A trial click can wait for moving
 * elements and scroll them without dispatching input. Reposition afterwards so
 * the real click cannot contaminate the test's baseline with setup-only motion.
 */
export const prepareLocatorForScrollMeasurement = async ({ page, locator, motionLocator, reposition }) => {
  // A delayed Framer Motion transition can look stable for Playwright's two
  // sampled frames before it starts. Wait for the relevant animated container
  // to reach its declared final state, then use the trial click as the normal
  // visibility/enabled/stability check.
  if (motionLocator) {
    await expect(motionLocator).toHaveCSS('transform', 'none');
    await expect(motionLocator).toHaveCSS('opacity', '1');
  }
  await locator.click({ trial: true });
  if (reposition) {
    await reposition();
  } else {
    await locator.scrollIntoViewIfNeeded();
  }
  await settleAndReadScrollY(page);
};

export const expectPageScrollUnchanged = ({ context, before, after, tolerance = 24, timeline = [] }) => {
  const delta = Math.abs(after - before);
  const timelineDetails = timeline.length > 0 ? `\nScroll timeline:\n${JSON.stringify(timeline, null, 2)}` : '';
  expect(
    delta,
    `${context} moved the page: before=${before}, after=${after}, delta=${delta}, tolerance=${tolerance}.${timelineDetails}`
  ).toBeLessThanOrEqual(tolerance);
};
