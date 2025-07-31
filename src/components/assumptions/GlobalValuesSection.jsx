import React from 'react';

const GlobalValuesSection = ({ defaultGlobalParameters, formValues, errors, onChange }) => {
  const parameters = [
    {
      id: 'discountRate',
      label: 'Discount Rate',
      description: 'Annual discount rate for future effects',
      format: 'percentage',
    },
    {
      id: 'populationGrowthRate',
      label: 'Population Growth Rate',
      description: 'Annual population growth rate',
      format: 'percentage',
    },
    {
      id: 'timeLimit',
      label: 'Time Limit (years)',
      description: "Time after which we don't consider effects on the future",
      format: 'number',
    },
    {
      id: 'populationLimit',
      label: 'Population Limit',
      description: "Maximum population as a multiple of today's population",
      format: 'number',
    },
    {
      id: 'currentPopulation',
      label: 'Current Population',
      description: 'Current global population',
      format: 'number',
    },
    {
      id: 'yearsPerLife',
      label: 'Years Per Life',
      description: 'Average years of life saved per intervention',
      format: 'number',
    },
  ];

  const formatDisplayValue = (value, format) => {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    if (format === 'percentage') {
      return (parseFloat(value) * 100).toFixed(2) + '%';
    }

    if (format === 'number') {
      // Format large numbers with commas
      return parseFloat(value).toLocaleString();
    }

    return value;
  };

  return (
    <div className="space-y-4">
      {parameters.map((param) => {
        const value = formValues[param.id]?.formatted || '';
        const hasError = errors[param.id];
        const defaultValue = defaultGlobalParameters[param.id];

        return (
          <div key={param.id} className="space-y-2">
            <label htmlFor={param.id} className="block text-sm font-medium text-gray-700">
              {param.label}
            </label>
            <p className="text-sm text-gray-600">{param.description}</p>
            <div className="relative">
              <input
                type="text"
                id={param.id}
                name={param.id}
                value={value}
                onChange={(e) => onChange(param.id, e.target.value)}
                placeholder={formatDisplayValue(defaultValue, param.format)}
                className={`
                  block w-full rounded-md shadow-sm
                  ${
                    hasError
                      ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                  }
                  sm:text-sm px-3 py-2
                `}
              />
              {hasError && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            {hasError && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors[param.id]}
              </p>
            )}
            <p className="text-xs text-gray-500">Default: {formatDisplayValue(defaultValue, param.format)}</p>
          </div>
        );
      })}
    </div>
  );
};

export default GlobalValuesSection;
