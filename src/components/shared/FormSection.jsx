import React from 'react';
import PropTypes from 'prop-types';

/**
 * A reusable form section with consistent styling for all forms.
 */
const FormSection = ({ title, description, children, className = '', actions = null }) => {
  return (
    <div className={`bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200 p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-medium text-slate-800">{title}</h3>
          {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
        </div>
        {actions && <div className="flex space-x-2">{actions}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
};

FormSection.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  actions: PropTypes.node,
};

export default React.memo(FormSection);
