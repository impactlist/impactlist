// "Nice" tick computation for linear chart axes.
//
// Recharts only rounds ticks itself when a domain edge is 'auto'. An explicit
// numeric domain — which charts with negative values need, to pin a zero
// baseline — is instead sliced into tickCount steps starting from the raw
// minimum, producing ticks like 5,497. Callers that pin a domain therefore
// compute round ticks here and pass BOTH the ticks and the matching domain to
// the axis.

const NICE_STEP_MANTISSAS = [1, 2, 5];

/**
 * Compute round tick values covering [minValue, maxValue] on a clean step
 * (1, 2, or 5 × a power of ten), with the outer ticks snapped outward to
 * enclose the range. Every tick is a multiple of the step, so 0 is always a
 * tick when the range spans it.
 *
 * targetTickCount is an aim, not a guarantee: the step ladder yields between
 * 4 and targetTickCount + 1 ticks.
 *
 * @param {number} minValue - Lower edge the ticks must enclose.
 * @param {number} maxValue - Upper edge the ticks must enclose; must exceed minValue.
 * @param {number} [targetTickCount] - Approximate number of ticks to aim for.
 * @returns {{domain: [number, number], ticks: number[]}} The outer tick pair
 *   (for the axis domain) and the full tick list.
 */
export const computeNiceTicks = (minValue, maxValue, targetTickCount = 7) => {
  if (!Number.isFinite(minValue) || !Number.isFinite(maxValue) || minValue >= maxValue) {
    throw new Error(`computeNiceTicks requires finite bounds with minValue < maxValue, got [${minValue}, ${maxValue}]`);
  }

  const roughStep = (maxValue - minValue) / (targetTickCount - 1);
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const step =
    NICE_STEP_MANTISSAS.map((mantissa) => mantissa * magnitude).find((candidate) => candidate >= roughStep) ??
    10 * magnitude;

  // Build ticks from integer step indices (not by accumulating floats) so
  // values like 0 land exactly.
  const firstIndex = Math.floor(minValue / step);
  const lastIndex = Math.ceil(maxValue / step);
  const ticks = [];
  for (let index = firstIndex; index <= lastIndex; index += 1) {
    ticks.push(index * step);
  }

  return { domain: [ticks[0], ticks[ticks.length - 1]], ticks };
};
