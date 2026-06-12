// Series values at or below this magnitude are treated as zero by LivesSavedGraph
// (trailing-zero axis trimming, tooltip entries). Series builders that decide how
// to sample a time window must use the same threshold, so that "negligible" means
// the same thing on both sides.
export const NONZERO_EPSILON = 1e-9;
