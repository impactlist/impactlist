import React, { useState, useEffect, useMemo } from 'react';
import { useAssumptions } from '../contexts/AssumptionsContext';
import { getBaseCostPerLife } from '../utils/effectsCalculation';
import {
  validateCategoryValues,
  validateRecipientValues,
  validateGlobalParameterValues,
  scrollToFirstError,
} from '../utils/assumptionsFormValidation';
import { useCategoryForm, useRecipientForm, useRecipientSearch } from '../hooks/useAssumptionsForm';
import { useGlobalForm } from '../hooks/useGlobalForm';

// Import shared components
import DefaultValuesSection from './assumptions/DefaultValuesSection';
import RecipientValuesSection from './assumptions/RecipientValuesSection';
import GlobalValuesSection from './assumptions/GlobalValuesSection';
import CategoryEffectEditor from './assumptions/CategoryEffectEditor';
import Modal from './assumptions/Modal';
import TabNavigation from './assumptions/TabNavigation';
import FormActions from './assumptions/FormActions';

const AssumptionsEditor = () => {
  const {
    combinedAssumptions,
    defaultAssumptions,
    updateCategoryValue,
    updateCategoryFieldOverride,
    updateRecipientValue,
    updateGlobalParameter,
    getCategoryValue,
    getRecipientValue,
    getGlobalParameter,
    isModalOpen,
    closeModal,
  } = useAssumptions();

  const [activeTab, setActiveTab] = useState('global');
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const allRecipients = useMemo(() => combinedAssumptions.getAllRecipients(), [combinedAssumptions]);
  const allCategories = useMemo(() => {
    // Convert to format expected by the component
    const categories = {};
    combinedAssumptions.getAllCategories().forEach((category) => {
      // Use base cost per life (without discounting) for display
      let costPerLife = null;
      if (category.effects && category.effects.length > 0) {
        const baseEffect = category.effects[0];
        costPerLife = getBaseCostPerLife(baseEffect, combinedAssumptions.globalParameters);
      }

      if (costPerLife === null) {
        throw new Error(`Could not calculate base cost per life for category ${category.id}`);
      }

      categories[category.id] = {
        name: category.name,
        costPerLife: costPerLife,
      };
    });
    return categories;
  }, [combinedAssumptions]);

  const defaultCategories = useMemo(() => {
    // Get default categories without user overrides
    const categories = {};
    combinedAssumptions.getAllCategories().forEach((category) => {
      // Get the default category data (without user overrides)
      const defaultCategory = defaultAssumptions.categories[category.id];

      // Use base cost per life (without discounting) for display
      let costPerLife = null;
      if (defaultCategory.effects && defaultCategory.effects.length > 0) {
        const baseEffect = defaultCategory.effects[0];
        costPerLife = getBaseCostPerLife(baseEffect, defaultAssumptions.globalParameters);
      }

      if (costPerLife === null) {
        throw new Error(`Could not calculate base cost per life for default category ${category.id}`);
      }

      categories[category.id] = {
        name: category.name,
        costPerLife: costPerLife,
      };
    });
    return categories;
  }, [combinedAssumptions, defaultAssumptions]);

  // Use custom hooks for form state management
  const globalForm = useGlobalForm(
    combinedAssumptions.globalParameters,
    defaultAssumptions.globalParameters,
    getGlobalParameter,
    isModalOpen
  );
  const categoryForm = useCategoryForm(allCategories, getCategoryValue, isModalOpen, defaultCategories);
  const recipientForm = useRecipientForm();
  const recipientSearch = useRecipientSearch(
    allRecipients,
    combinedAssumptions,
    recipientForm.formValues,
    getRecipientValue
  );

  // Handle tab switching
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'recipients') {
      // Initialize filtered recipients based on current filter settings
      recipientSearch.filterRecipients(recipientSearch.searchTerm, recipientSearch.showOnlyCustom);
    }
  };

  // Destructure to avoid infinite loops
  const { filterRecipients, searchTerm } = recipientSearch;

  // Initialize filtered recipients when modal opens
  useEffect(() => {
    if (isModalOpen && activeTab === 'recipients') {
      filterRecipients(searchTerm, searchTerm === '');
    }
  }, [isModalOpen, activeTab, filterRecipients, searchTerm]);

  // Update filtered recipients when tab changes
  useEffect(() => {
    if (activeTab === 'recipients') {
      filterRecipients(searchTerm, searchTerm === '');
    }
  }, [activeTab, filterRecipients, searchTerm]);

  // Validate all values before submission
  const validateAllValues = () => {
    // Validate global parameter values
    const globalValidation = validateGlobalParameterValues(globalForm.formValues, combinedAssumptions.globalParameters);
    globalForm.setErrors(globalValidation.errors);

    // Validate category values
    const categoryValidation = validateCategoryValues(categoryForm.formValues, allCategories);
    categoryForm.setErrors(categoryValidation.errors);

    // Validate recipient form values
    const recipientValidation = validateRecipientValues(recipientForm.formValues);
    recipientForm.setErrors(recipientValidation.errors);

    const hasErrors = globalValidation.hasErrors || categoryValidation.hasErrors || recipientValidation.hasErrors;

    // Show alert if there are errors
    if (hasErrors) {
      scrollToFirstError();
    }

    return !hasErrors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all values
    if (!validateAllValues()) {
      return; // Stop if there are errors
    }

    // Update global parameter values using context methods
    Object.entries(globalForm.formValues).forEach(([paramKey, valueObj]) => {
      const rawValue = valueObj.raw;
      const cleanValue = typeof rawValue === 'string' ? rawValue.replace(/,/g, '') : String(rawValue);

      if (cleanValue.trim() === '') {
        // Empty value - clear any custom override
        updateGlobalParameter(paramKey, '');
      } else {
        const numValue = Number(cleanValue);
        if (!isNaN(numValue)) {
          updateGlobalParameter(paramKey, numValue);
        }
      }
    });

    // Update category values using context methods
    Object.entries(categoryForm.formValues).forEach(([categoryId, valueObj]) => {
      const rawValue = valueObj.raw;
      const cleanValue = typeof rawValue === 'string' ? rawValue.replace(/,/g, '') : String(rawValue);

      if (cleanValue.trim() === '') {
        // Empty value - clear any custom override
        updateCategoryValue(categoryId, '');
      } else {
        const numValue = Number(cleanValue);
        if (!isNaN(numValue) && numValue > 0) {
          updateCategoryValue(categoryId, numValue);
        }
      }
    });

    // Update recipient values using context methods
    Object.entries(recipientForm.formValues).forEach(([fieldKey, valueObj]) => {
      const [recipientName, categoryId, type] = fieldKey.split('__');
      const rawValue = valueObj.raw;
      const cleanValue = typeof rawValue === 'string' ? rawValue.replace(/,/g, '') : String(rawValue);

      if (cleanValue.trim() === '') {
        // Empty value - clear any custom override
        updateRecipientValue(recipientName, categoryId, type, '');
      } else {
        const numValue = Number(cleanValue);
        if (!isNaN(numValue) && numValue > 0) {
          updateRecipientValue(recipientName, categoryId, type, numValue);
        }
      }
    });

    closeModal();
  };

  // Handle reset button for global parameters
  const handleGlobalReset = () => {
    // First reset the form to show empty values (defaults)
    globalForm.reset();

    // Then clear all global parameter custom values using context methods
    // We do this after reset to avoid the form re-initializing with old values
    Object.keys(globalForm.formValues).forEach((paramKey) => {
      updateGlobalParameter(paramKey, '');
    });
  };

  // Handle reset button for categories
  const handleCategoryReset = () => {
    // Clear all category custom values using context methods
    Object.keys(categoryForm.formValues).forEach((categoryId) => {
      updateCategoryValue(categoryId, '');
    });
    categoryForm.reset();
  };

  // Handle reset button for recipients - only resets recipient data, preserves category values
  const handleResetRecipients = () => {
    // Clear all custom values for filtered recipients
    recipientSearch.filteredRecipients.forEach((recipient) => {
      Object.keys(recipient.categories || {}).forEach((categoryId) => {
        // Clear both multiplier and costPerLife for each category
        updateRecipientValue(recipient.name, categoryId, 'multiplier', '');
        updateRecipientValue(recipient.name, categoryId, 'costPerLife', '');
      });
    });
    recipientForm.reset();
  };

  // Handle editing a category's effects
  const handleEditCategory = (categoryId) => {
    setEditingCategoryId(categoryId);
  };

  // Handle saving category effects
  const handleSaveCategoryEffects = (updatedEffects) => {
    // Get the default category to compare against
    const defaultCategory = defaultAssumptions.categories[editingCategoryId];
    if (!defaultCategory || !defaultCategory.effects) {
      throw new Error(`Default category ${editingCategoryId} not found`);
    }

    // The updatedEffects contains the edited values from the UI
    updatedEffects.forEach((effect) => {
      // Find the corresponding default effect
      const defaultEffect = defaultCategory.effects.find((e) => e.effectId === effect.effectId);
      if (!defaultEffect) {
        throw new Error(`Default effect ${effect.effectId} not found in category ${editingCategoryId}`);
      }

      // Determine which fields are valid for this effect type (excluding metadata)
      const validFields = [];
      if (effect.costPerQALY !== undefined && typeof effect.costPerQALY !== 'object') {
        // QALY-based effect
        validFields.push('costPerQALY');
      }
      if (effect.costPerMicroprobability !== undefined && typeof effect.costPerMicroprobability !== 'object') {
        // Population-based effect
        validFields.push('costPerMicroprobability');
        if (
          effect.microprobabilityOfLiveSaved !== undefined &&
          typeof effect.microprobabilityOfLiveSaved !== 'object'
        ) {
          validFields.push('microprobabilityOfLiveSaved');
        }
      }

      // Save each valid field
      validFields.forEach((fieldName) => {
        const newValue = effect[fieldName];

        // Convert to number if needed
        const numValue = typeof newValue === 'string' ? parseFloat(newValue) : newValue;

        // Validate the value
        if (typeof numValue !== 'number' || isNaN(numValue)) {
          throw new Error(
            `Invalid value for ${editingCategoryId}.${effect.effectId}.${fieldName}: expected number, got ${typeof newValue} (${newValue})`
          );
        }

        // Always update the field - the API helper will handle whether to store as override or clear
        updateCategoryFieldOverride(editingCategoryId, effect.effectId, fieldName, numValue);
      });
    });

    // Return to category list view
    setEditingCategoryId(null);
  };

  // Handle canceling category edit
  const handleCancelCategoryEdit = () => {
    setEditingCategoryId(null);
  };

  const tabs = [
    { id: 'global', label: 'Global' },
    { id: 'categories', label: 'Categories' },
    { id: 'recipients', label: 'Recipients' },
  ];

  const getDescription = () => {
    if (activeTab === 'global') {
      return 'Customize global parameters that affect all calculations.';
    } else if (activeTab === 'categories') {
      return 'Customize the parameters for different cause categories which go into the computation of the cost in dollars to save one life.';
    } else {
      return "Customize how specific recipients' parameter values differ from their category defaults. These parameters are used to compute the cost in dollars to save one life. You can set a multiplier or override for each parameter value.";
    }
  };

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} title="Edit Assumptions" description={getDescription()}>
      {!editingCategoryId && (
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:items-center sm:justify-between">
            <div className="order-2 sm:order-1">
              <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} tabs={tabs} />
            </div>
            <div className="order-1 sm:order-2">
              <FormActions
                onReset={
                  activeTab === 'global'
                    ? handleGlobalReset
                    : activeTab === 'categories'
                      ? handleCategoryReset
                      : handleResetRecipients
                }
                onCancel={closeModal}
                onSave={handleSubmit}
                resetLabel={
                  activeTab === 'global'
                    ? 'Reset Global'
                    : activeTab === 'categories'
                      ? 'Reset Categories'
                      : 'Reset Recipients'
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab content container */}
      <div
        className={
          editingCategoryId ? 'flex-grow' : 'overflow-y-auto p-3 flex-grow h-[calc(100vh-15rem)] min-h-[400px]'
        }
      >
        {editingCategoryId ? (
          // Show category effect editor when editing a category
          <CategoryEffectEditor
            category={combinedAssumptions.getCategoryById(editingCategoryId)}
            categoryId={editingCategoryId}
            globalParameters={combinedAssumptions.globalParameters}
            onSave={handleSaveCategoryEffects}
            onCancel={handleCancelCategoryEdit}
          />
        ) : activeTab === 'global' ? (
          <form onSubmit={handleSubmit}>
            <GlobalValuesSection
              globalParameters={combinedAssumptions.globalParameters}
              defaultGlobalParameters={defaultAssumptions.globalParameters}
              formValues={globalForm.formValues}
              errors={globalForm.errors}
              onChange={globalForm.handleChange}
            />
          </form>
        ) : activeTab === 'categories' ? (
          <form onSubmit={handleSubmit}>
            <DefaultValuesSection
              allCategories={allCategories}
              defaultCategories={defaultCategories}
              formValues={categoryForm.formValues}
              errors={categoryForm.errors}
              onChange={categoryForm.handleChange}
              onEditCategory={handleEditCategory}
            />
          </form>
        ) : (
          <RecipientValuesSection
            filteredRecipients={recipientSearch.filteredRecipients}
            formValues={recipientForm.formValues}
            errors={recipientForm.errors}
            allCategories={allCategories}
            defaultCategories={defaultCategories}
            getCustomRecipientValue={getRecipientValue}
            onChange={recipientForm.handleChange}
            onSearch={recipientSearch.handleSearchChange}
            searchTerm={recipientSearch.searchTerm}
            combinedAssumptions={combinedAssumptions}
            defaultAssumptions={defaultAssumptions}
          />
        )}
      </div>
    </Modal>
  );
};

export default AssumptionsEditor;
