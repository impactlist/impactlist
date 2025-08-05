import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import CurrencyInput from '../shared/CurrencyInput';
import { formatNumberWithCommas, formatWithCursorHandling } from '../../utils/formatters';
import { getRecipientId } from '../../utils/donationDataHelpers';
import { calculateCategoryBaseCostPerLife, applyRecipientEffectToBase } from '../../utils/effectsCalculation';

/**
 * Component for managing recipient-specific cost per life values.
 */
const RecipientValuesSection = ({
  filteredRecipients,
  formValues,
  errors,
  allCategories,
  defaultCategories,
  getCustomRecipientValue,
  onChange,
  onSearch,
  searchTerm,
  defaultAssumptions,
}) => {
  // Helper function to get form value
  const getFormValue = (formValues, key) => {
    // If we have a form value (user has interacted), return it
    if (formValues[key] !== undefined) {
      // Handle both formatted and display properties for compatibility
      if (formValues[key].display !== undefined) {
        return formValues[key].display;
      }
      if (formValues[key].formatted !== undefined) {
        return formValues[key].formatted;
      }
      // If it's just a raw value, use it
      if (formValues[key].raw !== undefined) {
        return formValues[key].raw;
      }
    }
    // Return empty string if no form value
    return '';
  };

  // Helper function to get the display value for an input
  const getInputDisplayValue = (formValues, key, customValue, defaultValue, shouldShowDefault = true) => {
    // If form value exists (even if empty), it means user has interacted
    if (formValues[key] !== undefined) {
      return getFormValue(formValues, key);
    }

    // Then check for custom value
    if (customValue !== null) return formatNumberWithCommas(customValue);

    // Finally fall back to default if allowed
    if (shouldShowDefault && defaultValue !== null) return formatNumberWithCommas(defaultValue);

    return '';
  };

  // Recreate getRecipientDefaultMultiplier functionality using defaultAssumptions
  const getRecipientDefaultMultiplier = (recipientId, categoryId) => {
    const recipient = defaultAssumptions.recipients?.[recipientId];
    if (!recipient || !recipient.categories) {
      return null;
    }

    const categoryData = recipient.categories[categoryId];
    if (!categoryData || !categoryData.effects || !Array.isArray(categoryData.effects)) {
      return null;
    }

    // Get the category's base effects to compare against
    const category = defaultAssumptions.categories?.[categoryId];
    if (!category || !category.effects || category.effects.length === 0) {
      return null;
    }

    // Check if any of the recipient effects have multipliers
    const hasMultipliers = categoryData.effects.some(
      (effect) => effect.multipliers && Object.keys(effect.multipliers).length > 0
    );

    if (!hasMultipliers) {
      return null;
    }

    // Calculate base cost per life for the category
    const baseCostPerLife = calculateCategoryBaseCostPerLife(category, categoryId, defaultAssumptions.globalParameters);

    // Apply recipient modifications to all effects
    const modifiedEffects = category.effects.map((baseEffect) => {
      const recipientEffect = categoryData.effects.find((e) => e.effectId === baseEffect.effectId);
      if (recipientEffect) {
        const context = `for recipient ${recipient.name} category ${categoryId}`;
        return applyRecipientEffectToBase(baseEffect, recipientEffect, context);
      }
      return baseEffect;
    });

    // Calculate modified cost per life
    const modifiedCategory = {
      name: category.name,
      effects: modifiedEffects,
    };
    const modifiedCostPerLife = calculateCategoryBaseCostPerLife(
      modifiedCategory,
      categoryId,
      defaultAssumptions.globalParameters
    );

    // Multiplier represents how much more expensive (less effective) the recipient is
    // A multiplier of 10 means 10x the cost (10x less effective)
    const multiplier = modifiedCostPerLife / baseCostPerLife;
    return multiplier;
  };

  // Recreate getRecipientDefaultCostPerLife functionality using defaultAssumptions
  const getRecipientDefaultCostPerLife = (recipientId, categoryId) => {
    const recipient = defaultAssumptions.recipients?.[recipientId];
    if (!recipient || !recipient.categories) {
      return null;
    }

    const categoryData = recipient.categories[categoryId];
    if (!categoryData || !categoryData.effects || !Array.isArray(categoryData.effects)) {
      return null;
    }

    // Get the category's base effects
    const category = defaultAssumptions.categories?.[categoryId];
    if (!category || !category.effects || category.effects.length === 0) {
      return null;
    }

    // Check if any of the recipient effects have overrides
    const hasOverrides = categoryData.effects.some(
      (effect) => effect.overrides && Object.keys(effect.overrides).length > 0
    );

    if (!hasOverrides) {
      return null;
    }

    // Apply recipient modifications to all effects
    const modifiedEffects = category.effects.map((baseEffect) => {
      const recipientEffect = categoryData.effects.find((e) => e.effectId === baseEffect.effectId);
      if (recipientEffect && recipientEffect.overrides) {
        const context = `for recipient ${recipient.name} category ${categoryId}`;
        return applyRecipientEffectToBase(baseEffect, recipientEffect, context);
      }
      return baseEffect;
    });

    // Calculate cost per life from all modified effects
    const modifiedCategory = {
      name: category.name,
      effects: modifiedEffects,
    };
    return calculateCategoryBaseCostPerLife(modifiedCategory, categoryId, defaultAssumptions.globalParameters);
  };

  return (
    <div>
      <div className="mb-4 flex flex-col space-y-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search recipients..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <div className="text-sm text-gray-600 italic">
          {searchTerm === ''
            ? 'Showing only recipients with custom values. Use search to find others.'
            : filteredRecipients.length >= 10
              ? 'Showing first 10 matching recipients.'
              : `Showing ${filteredRecipients.length} matching recipient${filteredRecipients.length === 1 ? '' : 's'}.`}
        </div>
      </div>

      {filteredRecipients.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm
            ? 'No recipients found matching your search'
            : 'No recipients with custom values found. Search for a specific recipient.'}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecipients
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((recipient, index) => {
              const recipientCategories = Object.entries(recipient.categories || {});
              if (recipientCategories.length === 0) return null;

              // Alternate row colors for better readability
              const isEven = index % 2 === 0;
              const bgColorClass = isEven ? 'bg-white' : 'bg-gray-100';

              return (
                <div key={recipient.name} className={`border border-gray-200 rounded-md p-3 ${bgColorClass}`}>
                  <h3 className="font-medium text-gray-800 mb-2">{recipient.name}</h3>
                  <div className="space-y-3">
                    {recipientCategories.map(([categoryId]) => {
                      const categoryName = allCategories[categoryId]?.name || categoryId;

                      // Calculate base values - use defaultCategories for true default
                      const baseCostPerLife = defaultCategories[categoryId]?.costPerLife || 0;

                      // Get recipient ID for lookups
                      const recipientId = getRecipientId(recipient);

                      // Get default values from effects (if any)
                      const defaultMultiplier = recipientId
                        ? getRecipientDefaultMultiplier(recipientId, categoryId)
                        : null;
                      const defaultCostPerLife = recipientId
                        ? getRecipientDefaultCostPerLife(recipientId, categoryId)
                        : null;

                      // Get custom values
                      const customMultiplier = getCustomRecipientValue(recipient.name, categoryId, 'multiplier');
                      const customCostPerLife = getCustomRecipientValue(recipient.name, categoryId, 'costPerLife');

                      // Field keys
                      const multiplierKey = `${recipient.name}__${categoryId}__multiplier`;
                      const costPerLifeKey = `${recipient.name}__${categoryId}__costPerLife`;

                      return (
                        <div key={categoryId} className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 p-2 rounded">
                          <div className="text-sm text-gray-700">
                            <Link
                              to={`/category/${encodeURIComponent(categoryId)}`}
                              className="text-indigo-600 hover:text-indigo-800 hover:underline"
                            >
                              {categoryName}
                            </Link>
                            <div className="text-xs text-gray-500">Category: ${baseCostPerLife.toLocaleString()}</div>
                          </div>

                          {/* Multiplier input */}
                          <div>
                            <label
                              htmlFor={`multiplier-${recipient.name}-${categoryId}`}
                              className="block text-xs font-medium text-gray-500 mb-1"
                            >
                              Multiplier
                            </label>
                            <input
                              id={`multiplier-${recipient.name}-${categoryId}`}
                              type="text"
                              inputMode="text"
                              placeholder={
                                customCostPerLife || getFormValue(formValues, costPerLifeKey) !== ''
                                  ? 'None'
                                  : defaultMultiplier !== null
                                    ? defaultMultiplier.toString()
                                    : 'None'
                              }
                              value={getInputDisplayValue(
                                formValues,
                                multiplierKey,
                                customMultiplier,
                                defaultMultiplier,
                                getFormValue(formValues, costPerLifeKey) === ''
                              )}
                              onChange={(e) => {
                                // Clear cost per life field immediately when user types in multiplier
                                onChange(costPerLifeKey, '');

                                // Get the current input element and cursor position
                                const inputElement = e.target;
                                const newValue = e.target.value;
                                const currentPosition = e.target.selectionStart;

                                // Format with commas while preserving cursor position
                                const result = formatWithCursorHandling(newValue, currentPosition, inputElement);

                                // Pass the value to parent
                                onChange(multiplierKey, result.value);
                              }}
                              className={`w-full py-1 px-1.5 text-sm border rounded ${
                                errors[recipient.name]?.[categoryId]?.multiplier
                                  ? 'border-red-300 text-red-700 bg-red-50'
                                  : (customMultiplier !== null && customMultiplier !== defaultMultiplier) ||
                                      (formValues[multiplierKey] &&
                                        formValues[multiplierKey].raw !== '' &&
                                        Number(formValues[multiplierKey].raw) !== defaultMultiplier)
                                    ? 'border-indigo-300 bg-indigo-50'
                                    : 'border-gray-300'
                              }`}
                              aria-invalid={!!errors[recipient.name]?.[categoryId]?.multiplier}
                            />
                            {errors[recipient.name]?.[categoryId]?.multiplier && (
                              <div className="text-xs text-red-600 mt-0.5">
                                {errors[recipient.name][categoryId].multiplier}
                              </div>
                            )}
                            {/* Show default value indicator only when value differs from default */}
                            {defaultMultiplier !== null &&
                              ((customMultiplier !== null && customMultiplier !== defaultMultiplier) ||
                                (formValues[multiplierKey] &&
                                  formValues[multiplierKey].raw !== '' &&
                                  Number(formValues[multiplierKey].raw) !== defaultMultiplier)) && (
                                <div className="text-xs text-gray-500 mt-0.5">
                                  Default: {formatNumberWithCommas(defaultMultiplier)}
                                </div>
                              )}
                          </div>

                          {/* Direct cost per life input */}
                          <div>
                            <label
                              htmlFor={`cost-per-life-${recipient.name}-${categoryId}`}
                              className="block text-xs font-medium text-gray-500 mb-1"
                            >
                              Direct Cost Per Life
                            </label>
                            <CurrencyInput
                              id={`cost-per-life-${recipient.name}-${categoryId}`}
                              value={getInputDisplayValue(
                                formValues,
                                costPerLifeKey,
                                customCostPerLife,
                                defaultCostPerLife,
                                getFormValue(formValues, multiplierKey) === ''
                              )}
                              onChange={(value) => {
                                // Clear multiplier field immediately when user types in cost per life
                                onChange(multiplierKey, '');
                                onChange(costPerLifeKey, value);
                              }}
                              placeholder={
                                customMultiplier || getFormValue(formValues, multiplierKey) !== ''
                                  ? 'None'
                                  : defaultCostPerLife !== null
                                    ? 'Default'
                                    : 'None'
                              }
                              error={errors[recipient.name]?.[categoryId]?.costPerLife}
                              className="w-full"
                              validateOnBlur={true} // Only validate on blur, not while typing
                              isCustom={
                                (customCostPerLife !== null && customCostPerLife !== defaultCostPerLife) ||
                                (formValues[costPerLifeKey] &&
                                  formValues[costPerLifeKey].raw !== '' &&
                                  Number(formValues[costPerLifeKey].raw) !== defaultCostPerLife)
                              }
                            />
                            {/* Show default value indicator only when value differs from default */}
                            {defaultCostPerLife !== null &&
                              ((customCostPerLife !== null && customCostPerLife !== defaultCostPerLife) ||
                                (formValues[costPerLifeKey] &&
                                  formValues[costPerLifeKey].raw !== '' &&
                                  Number(formValues[costPerLifeKey].raw) !== defaultCostPerLife)) && (
                                <div className="text-xs text-gray-500 mt-0.5">
                                  Default: ${formatNumberWithCommas(defaultCostPerLife)}
                                </div>
                              )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

RecipientValuesSection.propTypes = {
  filteredRecipients: PropTypes.array.isRequired,
  formValues: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  allCategories: PropTypes.object.isRequired,
  defaultCategories: PropTypes.object.isRequired,
  getCustomRecipientValue: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  combinedAssumptions: PropTypes.object.isRequired,
  defaultAssumptions: PropTypes.object.isRequired,
};

export default React.memo(RecipientValuesSection);
