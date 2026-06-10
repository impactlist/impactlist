import React from 'react';
import PropTypes from 'prop-types';
import FormattedScientificValue from './FormattedScientificValue';
import { formatCurrency, formatRoundedLives } from '../../utils/formatters';

/**
 * The colored Lives Saved / Cost-Per-Life table cell shared by the list
 * pages (previously three drifted copies with inconsistent ∞ rules).
 *
 * Currency cells render "∞" exactly when the value is ±Infinity — the
 * domain's own sentinel (Infinity = "no effect"; donor cost-per-life ratios
 * are already Infinity when lives are zero). Invalid states stay LOUD: a
 * cost of 0 renders as "$0" and a NaN renders as "$NaN", so calculation bugs
 * look wrong instead of masquerading as the legitimate no-effect case.
 */
const ImpactValueCell = ({ kind, value, positiveTone = 'strong' }) => {
  const tone = value < 0 ? 'text-danger' : positiveTone === 'success' ? 'text-success' : 'text-strong';

  return (
    <div className={`text-sm ${tone}`}>
      {kind === 'currency' && (value === Infinity || value === -Infinity) ? (
        '∞'
      ) : (
        <FormattedScientificValue
          value={kind === 'currency' ? formatCurrency(value) : formatRoundedLives(value)}
          variant="compact"
        />
      )}
    </div>
  );
};

ImpactValueCell.propTypes = {
  kind: PropTypes.oneOf(['currency', 'lives']).isRequired,
  value: PropTypes.number.isRequired,
  positiveTone: PropTypes.oneOf(['strong', 'success']),
};

export default ImpactValueCell;
