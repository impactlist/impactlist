// Tiebreaker for the donor ranking ONLY. When two donors are exactly tied on
// lives saved (e.g. spouses who give as a couple and split every donation 50/50,
// so their credited totals are identical), the one with the higher prominence
// value ranks first; donors not listed here default to 0. Keep this sparse — add
// an entry only to resolve a specific tie, not to score everyone.
//
// Net worth can't do this job: spouses share an identical net worth, so it ties
// too. Any value works as long as "more well-known" gets the higher number.
export const DONOR_PROMINENCE = {
  // Dustin Moskovitz and Cari Tuna are an exact tie (joint giving, 50/50 credit);
  // rank the more widely-known Moskovitz above his tie with Tuna.
  'dustin-moskovitz': 1,
};

// Prominence for a donor id, defaulting to 0 when unlisted.
export const getDonorProminence = (donorId) => DONOR_PROMINENCE[donorId] ?? 0;
