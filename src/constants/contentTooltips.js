// Definitions surfaced as inline tooltips inside published markdown content
// (cause-area, recipient, and assumption pages). Keyed by slug so a single
// source of truth can serve many glossary terms over time.
//
// A term is wired up by linking to it from markdown with the sentinel href
// `#tooltip:<key>` (most easily via a {{VARIABLE}} in the data generator, e.g.
// {{PLAUSIBLE_RANGE}}). MarkdownContent's CustomLink renders the match as a
// Tooltip carrying the text below. See src/components/shared/MarkdownContent.jsx.
export const CONTENT_TOOLTIPS = {
  'plausible-range':
    "Our ranges represent 80% credence intervals: we're about 80% confident the true value lies inside it, with roughly a 10% chance it's lower and a 10% chance it's higher.",
  qaly: 'A quality-adjusted life year (QALY) is defined to be equal to one year of human life in full health.',
};
