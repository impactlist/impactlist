// "Nice" tick computation for linear chart axes.
//
// Recharts only rounds ticks itself when a domain edge is 'auto'. An explicit
// numeric domain — which charts with negative values need, to pin a zero
// baseline — is instead sliced into tickCount steps starting from the raw
// minimum, producing ticks like 5,497. Callers that pin a domain therefore
// compute round ticks here and pass BOTH the ticks and the matching domain to
// the axis.

const NICE_STEP_MANTISSAS = [1, 2, 5];
const MAX_DOMAIN_OVERSHOOT = 2;
const COMPACT_DOMAIN_PADDING_FRACTION = 0.02;

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

/**
 * Compute ticks for a mixed-sign range without letting a small value on either
 * side of zero reserve a full dominant-side tick interval. The regular nice
 * scale remains preferable when both sides are substantial. When snapping an
 * edge outward would make it more than twice that side's data magnitude, use
 * the actual data endpoint as its outer tick and place the domain edge a small
 * distance beyond it.
 *
 * The outer interval on the compacted side may therefore be shorter than the
 * others. That tradeoff keeps the zero baseline visually proportional while
 * retaining round ticks across the dominant side. Recharts can still omit the
 * compact endpoint tick responsively if its formatted label would overlap 0.
 *
 * @param {number} minValue - Negative lower data bound.
 * @param {number} maxValue - Positive upper data bound.
 * @param {number} [targetTickCount] - Approximate number of ticks to aim for.
 * @returns {{domain: [number, number], ticks: number[]}} A scale enclosing the data.
 */
export const computeMixedSignTicks = (minValue, maxValue, targetTickCount = 7) => {
  if (!Number.isFinite(minValue) || !Number.isFinite(maxValue) || minValue >= 0 || maxValue <= 0) {
    throw new Error(`computeMixedSignTicks requires finite bounds spanning zero, got [${minValue}, ${maxValue}]`);
  }

  const regularScale = computeNiceTicks(minValue, maxValue, targetTickCount);
  const compactNegativeSide = Math.abs(regularScale.domain[0]) > Math.abs(minValue) * MAX_DOMAIN_OVERSHOOT;
  const compactPositiveSide = regularScale.domain[1] > maxValue * MAX_DOMAIN_OVERSHOOT;
  if (!compactNegativeSide && !compactPositiveSide) {
    return regularScale;
  }

  const padding = (maxValue - minValue) * COMPACT_DOMAIN_PADDING_FRACTION;
  const negativeTicks = compactNegativeSide ? [minValue] : regularScale.ticks.filter((tick) => tick < 0);
  const positiveTicks = compactPositiveSide ? [maxValue] : regularScale.ticks.filter((tick) => tick > 0);

  return {
    domain: [
      compactNegativeSide ? minValue - padding : regularScale.domain[0],
      compactPositiveSide ? maxValue + padding : regularScale.domain[1],
    ],
    ticks: [...negativeTicks, 0, ...positiveTicks],
  };
};
