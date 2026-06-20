export const DEFAULT_ASSUMPTIONS_ENTRY_ID = '__default__';

export const DEFAULT_ASSUMPTIONS_ENTRY = Object.freeze({
  id: DEFAULT_ASSUMPTIONS_ENTRY_ID,
  label: 'Default (100 years)',
  description: `These assumptions reflect a blend of the best estimates of the creators of Impact List, and the best estimates given by frontier LLMs from Anthropic, OpenAI, and Google (prompted by Impact List staff).

We've also provided other curated sets of assumptions that we think reflect common beliefs of different types of users.`,
});
