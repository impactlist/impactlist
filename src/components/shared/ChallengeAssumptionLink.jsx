import PropTypes from 'prop-types';

// Renders the generated "Challenge assumption" links (marked with the
// CHALLENGE_ASSUMPTION_TITLE_PREFIX markdown title prefix) as a small button that opens the
// pre-filled feedback form. Styles live in index.css under `.impact-challenge`.
// NOTE: the class names must stay static strings — Tailwind tree-shakes @layer
// components rules whose class names never appear literally in the source.

// `label` is the accessible name (e.g. "Challenge assumption 3 (under 'Effect 2: …')"),
// distinguishing the page's many identically-worded buttons for screen-reader navigation.
const ChallengeAssumptionLink = ({ href, label, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="impact-challenge">
    {children}
  </a>
);

ChallengeAssumptionLink.propTypes = {
  href: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default ChallengeAssumptionLink;
