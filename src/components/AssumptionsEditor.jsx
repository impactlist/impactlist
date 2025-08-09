import React, { useState, useEffect, useMemo } from 'react';
import { useAssumptions } from '../contexts/AssumptionsContext';
import { calculateCostPerLife } from '../utils/effectsCalculation';
import {
  validateCategoryValues,
  validateRecipientValues,
  validateGlobalParameterValues,
  scrollToFirstError,
} from '../utils/assumptionsFormValidation';
import { cleanAndParseValue } from '../utils/effectValidation';
import { useCategoryForm, useRecipientForm, useRecipientSearch } from '../hooks/useAssumptionsForm';
import { useGlobalForm } from '../hooks/useGlobalForm';

// Import shared components
import CategoryValuesSection from './assumptions/CategoryValuesSection';
import RecipientValuesSection from './assumptions/RecipientValuesSection';
import GlobalValuesSection from './assumptions/GlobalValuesSection';
import CategoryEffectEditor from './assumptions/CategoryEffectEditor';
import RecipientEffectEditor from './assumptions/RecipientEffectEditor';
import Modal from './assumptions/Modal';
import TabNavigation from './assumptions/TabNavigation';
import FormActions from './assumptions/FormActions';

const AssumptionsEditor = () => {
  const {
    combinedAssumptions,
    defaultAssumptions,
    userAssumptions,
    updateCategoryEffect,
    resetCategoryToDefaults,
    updateRecipientValue,
    updateRecipientEffect,
    clearRecipientEffect,
    updateGlobalParameter,
    getCategoryValue,
    getRecipientValue,
    getGlobalParameter,
    isModalOpen,
    closeModal,
    activeTab,
    setActiveTab,
    recipientSearchTerm,
    setRecipientSearchTerm,
  } = useAssumptions();

  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingRecipient, setEditingRecipient] = useState(null);

  // Clear editing states when modal closes (but preserve activeTab)
  useEffect(() => {
    if (!isModalOpen) {
      // Don't reset activeTab - let it persist
      setEditingCategoryId(null);
      setEditingRecipient(null);
    }
  }, [isModalOpen]);

  const allRecipients = useMemo(() => combinedAssumptions.getAllRecipients(), [combinedAssumptions]);

  // Track which categories have custom effect values
  const categoriesWithCustomValues = useMemo(() => {
    const customCategories = new Set();
    if (userAssumptions?.categories) {
      Object.keys(userAssumptions.categories).forEach((categoryId) => {
        customCategories.add(categoryId);
      });
    }
    return customCategories;
  }, [userAssumptions]);

  const allCategories = useMemo(() => {
    // Convert to format expected by the component
    const categories = {};
    combinedAssumptions.getAllCategories().forEach((category) => {
      // Use full cost per life calculation with discounting and population growth
      let costPerLife = null;
      if (category.effects && category.effects.length > 0) {
        costPerLife = calculateCostPerLife(category.effects, combinedAssumptions.globalParameters, category.id);
      }

      if (costPerLife === null) {
        throw new Error(`Could not calculate cost per life for category ${category.id}`);
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

      // Use full cost per life calculation with discounting and population growth
      let costPerLife = null;
      if (defaultCategory.effects && defaultCategory.effects.length > 0) {
        costPerLife = calculateCostPerLife(defaultCategory.effects, defaultAssumptions.globalParameters, category.id);
      }

      if (costPerLife === null) {
        throw new Error(`Could not calculate cost per life for default category ${category.id}`);
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
  const recipientForm = useRecipientForm(isModalOpen);
  const recipientSearch = useRecipientSearch(
    allRecipients,
    combinedAssumptions,
    recipientForm.formValues,
    getRecipientValue,
    isModalOpen,
    recipientSearchTerm,
    setRecipientSearchTerm
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

  // Initialize filtered recipients when modal opens or tab changes
  useEffect(() => {
    if (isModalOpen && activeTab === 'recipients') {
      filterRecipients(searchTerm, searchTerm === '');
    }
  }, [isModalOpen, activeTab, filterRecipients, searchTerm]);

  // Validate all values before submission
  const validateAllValues = () => {
    // Check if there are any existing errors from real-time validation
    const hasExistingErrors =
      Object.keys(globalForm.errors).length > 0 ||
      Object.keys(categoryForm.errors).length > 0 ||
      Object.keys(recipientForm.errors).length > 0;

    if (hasExistingErrors) {
      scrollToFirstError();
      return false;
    }

    // Also run full validation to catch any edge cases
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

      if (rawValue === null || rawValue === undefined || (typeof rawValue === 'string' && rawValue.trim() === '')) {
        // Empty value - clear any custom override
        updateGlobalParameter(paramKey, '');
      } else {
        const { numValue } = cleanAndParseValue(rawValue);
        if (!isNaN(numValue)) {
          updateGlobalParameter(paramKey, numValue);
        }
      }
    });

    // Categories are read-only in the main form and can only be edited through CategoryEffectEditor
    // So we don't process category form values here

    // Update recipient values using context methods
    Object.entries(recipientForm.formValues).forEach(([fieldKey, valueObj]) => {
      const [recipientName, categoryId, type] = fieldKey.split('__');
      const rawValue = valueObj.raw;

      if (rawValue === null || rawValue === undefined || rawValue === '') {
        // Empty value - clear any custom override
        updateRecipientValue(recipientName, categoryId, type, '');
      } else {
        const { numValue } = cleanAndParseValue(rawValue);
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
      resetCategoryToDefaults(categoryId);
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

  // Handle editing a recipient's effects
  const handleEditRecipient = (recipient, recipientId, categoryId) => {
    const category = combinedAssumptions.getCategoryById(categoryId);
    setEditingRecipient({ recipient, recipientId, categoryId, category });
  };

  // Handle saving category effects
  const handleSaveCategoryEffects = (updatedEffects) => {
    // Get the default category to compare against
    const defaultCategory = defaultAssumptions.categories[editingCategoryId];
    if (!defaultCategory || !defaultCategory.effects) {
      throw new Error(`Default category ${editingCategoryId} not found`);
    }

    // Process each effect using batch update
    updatedEffects.forEach((effect) => {
      // Find the corresponding default effect
      const defaultEffect = defaultCategory.effects.find((e) => e.effectId === effect.effectId);
      if (!defaultEffect) {
        throw new Error(`Default effect ${effect.effectId} not found in category ${editingCategoryId}`);
      }

      // Create an object with only the numeric fields (skip metadata)
      const effectData = {};
      Object.keys(effect).forEach((fieldName) => {
        if (fieldName !== 'effectId' && fieldName !== 'overrides' && fieldName !== 'multipliers') {
          const value = effect[fieldName];
          // Convert strings to numbers for numeric fields
          if (typeof value === 'string' && !isNaN(parseFloat(value))) {
            effectData[fieldName] = parseFloat(value);
          } else if (typeof value === 'number') {
            effectData[fieldName] = value;
          }
        }
      });

      // Use the new batch save function
      updateCategoryEffect(editingCategoryId, effect.effectId, effectData);
    });

    // Return to category list view
    setEditingCategoryId(null);
  };

  // Handle canceling category edit
  const handleCancelCategoryEdit = () => {
    setEditingCategoryId(null);
  };

  // Handle saving recipient effects
  const handleSaveRecipientEffects = (updatedEffects) => {
    if (!editingRecipient) return;

    const { recipient, categoryId } = editingRecipient;

    // Clear existing effects for this category first
    clearRecipientEffect(recipient.name, categoryId, null);

    // Then save the new effects
    updatedEffects.forEach((effect) => {
      updateRecipientEffect(recipient.name, categoryId, effect.effectId, {
        overrides: effect.overrides || {},
        multipliers: effect.multipliers || {},
      });
    });

    // Close the editor
    setEditingRecipient(null);
  };

  // Handle canceling recipient edit
  const handleCancelRecipientEdit = () => {
    setEditingRecipient(null);
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
      return "Customize how specific recipients' effect parameters differ from their category defaults. For each effect parameter, you can set either an override value (replaces the default) or a multiplier (scales the default). Click Edit on any recipient to modify their effects.";
    }
  };

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} title="Edit Assumptions" description={getDescription()}>
      {!editingCategoryId && !editingRecipient && (
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
                onSave={handleSubmit}
                showSave={activeTab === 'global'}
                resetLabel={
                  activeTab === 'global'
                    ? 'Reset Global'
                    : activeTab === 'categories'
                      ? 'Reset Categories'
                      : 'Reset Recipients'
                }
                hasErrors={
                  Object.keys(globalForm.errors).length > 0 ||
                  Object.keys(categoryForm.errors).length > 0 ||
                  Object.keys(recipientForm.errors).length > 0
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab content container */}
      <div
        className={
          editingCategoryId || editingRecipient
            ? 'flex flex-col flex-grow min-h-0 overflow-hidden'
            : 'overflow-y-auto p-3 flex-grow h-[calc(100vh-15rem)] min-h-[400px]'
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
        ) : editingRecipient ? (
          // Show recipient effect editor when editing a recipient
          <RecipientEffectEditor
            recipient={editingRecipient.recipient}
            recipientId={editingRecipient.recipientId}
            category={editingRecipient.category}
            categoryId={editingRecipient.categoryId}
            globalParameters={combinedAssumptions.globalParameters}
            onSave={handleSaveRecipientEffects}
            onCancel={handleCancelRecipientEdit}
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
            <CategoryValuesSection
              allCategories={allCategories}
              defaultCategories={defaultCategories}
              formValues={categoryForm.formValues}
              errors={categoryForm.errors}
              onChange={categoryForm.handleChange}
              onEditCategory={handleEditCategory}
              onResetCategory={resetCategoryToDefaults}
              categoriesWithCustomValues={categoriesWithCustomValues}
            />
          </form>
        ) : (
          <RecipientValuesSection
            filteredRecipients={recipientSearch.filteredRecipients}
            allCategories={allCategories}
            defaultCategories={defaultCategories}
            onSearch={recipientSearch.handleSearchChange}
            searchTerm={recipientSearch.searchTerm}
            defaultAssumptions={defaultAssumptions}
            onEditRecipient={handleEditRecipient}
          />
        )}
      </div>
    </Modal>
  );
};

export default AssumptionsEditor;
