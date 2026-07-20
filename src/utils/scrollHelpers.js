/**
 * Smooth scrolling is useful for spatial context, but it must respect the
 * visitor's operating-system motion preference. Call this at interaction time
 * so a preference change takes effect without reloading the page.
 */
export const getMotionSafeScrollBehavior = () =>
  globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ? 'auto' : 'smooth';
