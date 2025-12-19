import React, { useState, useEffect, useMemo } from 'react';
import { useAssumptions } from '../contexts/AssumptionsContext';
import {
  validateCategoryValues,
  validateRecipientValues,
  validateGlobalParameterValues,
  scrollToFirstError,
} from '../utils/assumptionsFormValidation';
import { cleanAndParseValue } from '../utils/effectValidation';
import { useCategoryForm, useRecipientForm, useRecipientSearch } from '../hooks/useAssumptionsForm';
import { useGlobalForm } from '../hooks/useGlobalForm';
import {
  getAllRecipientsFromDefaults,
  mergeGlobalParameters,
  getCategoryFromDefaults,
} from '../utils/assumptionsEditorHelpers';

// Import shared components
import CategoryValuesSection from './assumptions/CategoryValuesSection';
import RecipientValuesSection from './assumptions/RecipientValuesSection';
import GlobalValuesSection from './assumptions/GlobalValuesSection';
import CategoryEffectEditor from './assumptions/CategoryEffectEditor';
import RecipientEffectEditor from './assumptions/RecipientEffectEditor';
import MultiCategoryRecipientEditor from './assumptions/MultiCategoryRecipientEditor';
import Modal from './assumptions/Modal';
import TabNavigation from './assumptions/TabNavigation';
import FormActions from './assumptions/FormActions';
import YearSelector from './shared/YearSelector';

const AssumptionsEditor = () => {
  const {
    defaultAssumptions,
    userAssumptions,
    updateCategoryEffect,
    resetCategoryToDefaults,
    updateRecipientValue,
    updateRecipientEffect,
    clearRecipientEffect,
    updateGlobalParameter,
    resetAllGlobalParameters,
    resetRecipientToDefaults,
    getCategoryValue,
    getRecipientValue,
    getGlobalParameter,
    isModalOpen,
    closeModal,
    modalConfig,
    setModalConfig,
    activeTab,
    setActiveTab,
    recipientSearchTerm,
    setRecipientSearchTerm,
    isUsingCustomValues,
  } = useAssumptions();

  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingRecipient, setEditingRecipient] = useState(null);
  const [previewYear, setPreviewYear] = useState(new Date().getFullYear());
  const allRecipients = useMemo(() => getAllRecipientsFromDefaults(defaultAssumptions), [defaultAssumptions]);
  // Clear editing states when modal closes (but preserve activeTab)
  useEffect(() => {
    if (!isModalOpen) {
      // Don't reset activeTab - let it persist
      setEditingCategoryId(null);
      setEditingRecipient(null);
    }
  }, [isModalOpen]);

  // Handle deep-linking requests when the modal is opened from elsewhere
  useEffect(() => {
    if (!modalConfig) {
      return;
    }

    if (modalConfig.tab) {
      setActiveTab(modalConfig.tab);
    } else if (modalConfig.recipientId) {
      setActiveTab('recipients');
    } else if (modalConfig.categoryId) {
      setActiveTab('categories');
    }

    if (modalConfig.recipientId) {
      setEditingCategoryId(null);
      const recipient = allRecipients.find((r) => r.id === modalConfig.recipientId);
      if (!recipient) {
        throw new Error(`Recipient ${modalConfig.recipientId} not found in default assumptions`);
      }

      // Get ALL categories from the recipient data
      const categoryIds = Object.keys(recipient.categories || {});
      if (categoryIds.length === 0) {
        throw new Error(`Recipient ${recipient.name} has no categories to edit`);
      }

      const isMultiCategory = categoryIds.length > 1;

      // activeCategory is optional - for scrolling to a specific category
      const activeCategory = modalConfig.activeCategory || modalConfig.categoryId || categoryIds[0];

      setEditingRecipient({
        recipient,
        recipientId: recipient.id,
        categories: categoryIds.map((catId) => ({
          categoryId: catId,
          category: getCategoryFromDefaults(defaultAssumptions, catId),
        })),
        isMultiCategory,
        activeCategory,
        // Keep single-category fields for backward compatibility
        categoryId: activeCategory,
        category: getCategoryFromDefaults(defaultAssumptions, activeCategory),
      });
    } else if (modalConfig.categoryId) {
      setEditingRecipient(null);
      setEditingCategoryId(modalConfig.categoryId);
    }

    setModalConfig(null);
  }, [modalConfig, setActiveTab, setModalConfig, allRecipients, defaultAssumptions]);

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

  // Merge global parameters once
  const mergedGlobalParameters = useMemo(
    () => mergeGlobalParameters(defaultAssumptions.globalParameters, userAssumptions?.globalParameters),
    [defaultAssumptions.globalParameters, userAssumptions]
  );

  // Use custom hooks for form state management
  const globalForm = useGlobalForm(
    mergedGlobalParameters,
    defaultAssumptions.globalParameters,
    getGlobalParameter,
    isModalOpen
  );
  const categoryForm = useCategoryForm(defaultAssumptions, userAssumptions, getCategoryValue, isModalOpen);
  const recipientForm = useRecipientForm(isModalOpen);
  const recipientSearch = useRecipientSearch(
    allRecipients,
    defaultAssumptions,
    userAssumptions,
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
    const globalValidation = validateGlobalParameterValues(globalForm.formValues, mergedGlobalParameters);
    globalForm.setErrors(globalValidation.errors);

    // Validate category values
    const categoryValidation = validateCategoryValues(categoryForm.formValues, defaultAssumptions);
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
          // Always set the value if it's a number, to ensure user intent is captured
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

    // Use the batch reset function to clear all global parameters at once
    resetAllGlobalParameters();
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
    // Clear all custom values for filtered recipients using batch reset
    recipientSearch.filteredRecipients.forEach((recipient) => {
      resetRecipientToDefaults(recipient.name);
    });
    recipientForm.reset();
  };

  // Handle editing a category's effects
  const handleEditCategory = (categoryId) => {
    setEditingCategoryId(categoryId);
  };

  // Handle editing a recipient's effects
  const handleEditRecipient = (recipient, recipientId) => {
    // Get ALL categories from the recipient data
    const categoryIds = Object.keys(recipient.categories || {});
    if (categoryIds.length === 0) return;

    const isMultiCategory = categoryIds.length > 1;
    const firstCategoryId = categoryIds[0];

    setEditingRecipient({
      recipient,
      recipientId,
      categories: categoryIds.map((catId) => ({
        categoryId: catId,
        category: getCategoryFromDefaults(defaultAssumptions, catId),
      })),
      isMultiCategory,
      activeCategory: firstCategoryId,
      // Keep single-category fields for backward compatibility
      categoryId: firstCategoryId,
      category: getCategoryFromDefaults(defaultAssumptions, firstCategoryId),
    });
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
          } else if (typeof value === 'boolean') {
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
      const effectData = {
        overrides: effect.overrides || {},
        multipliers: effect.multipliers || {},
      };
      // Include disabled state if present
      if (effect.disabled !== undefined) {
        effectData.disabled = effect.disabled;
      }
      updateRecipientEffect(recipient.name, categoryId, effect.effectId, effectData);
    });

    // Close the editor
    setEditingRecipient(null);
  };

  // Handle saving multi-category recipient effects
  const handleSaveMultiCategoryEffects = (allCategoryEffects) => {
    if (!editingRecipient) return;

    const { recipient } = editingRecipient;

    // Process each category's effects
    Object.entries(allCategoryEffects).forEach(([categoryId, effects]) => {
      // Clear existing effects for this category first
      clearRecipientEffect(recipient.name, categoryId, null);

      // Then save the new effects
      effects.forEach((effect) => {
        const effectData = {
          overrides: effect.overrides || {},
          multipliers: effect.multipliers || {},
        };
        if (effect.disabled !== undefined) {
          effectData.disabled = effect.disabled;
        }
        updateRecipientEffect(recipient.name, categoryId, effect.effectId, effectData);
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
      return 'Global parameters that affect the calculations of the cost to save one life for each category or recipient:';
    }
    // For categories and recipients, we'll render the description with inline year selector
    return null;
  };

  const headerExtra = isUsingCustomValues ? (
    <div className="relative inline-flex items-center ml-2 group">
      <span className="text-sm text-indigo-600 font-medium cursor-help">(customized)</span>
      <div className="absolute right-0 top-full mt-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 w-64">
        Using custom assumptions. These can be reset within the Global, Categories, or Recipients tabs.
      </div>
    </div>
  ) : null;

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} title="Edit Assumptions" headerExtra={headerExtra}>
      {!editingCategoryId && !editingRecipient && (
        <>
          {/* Tabs and actions bar */}
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

          {/* Tab description */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            {activeTab === 'global' ? (
              <p className="text-base font-semibold text-gray-700">{getDescription()}</p>
            ) : (
              <div className="flex items-center text-base font-semibold text-gray-700">
                <span>Cost to save a life in</span>
                <YearSelector
                  value={previewYear}
                  onChange={setPreviewYear}
                  id="assumptions-preview-year"
                  label=""
                  className="mx-2"
                />
                <span>for each {activeTab === 'categories' ? 'cause category' : 'recipient'}:</span>
              </div>
            )}
          </div>
        </>
      )}

      {/* Tab content container */}
      <div
        className={
          editingCategoryId || editingRecipient
            ? 'flex flex-col flex-grow min-h-0 overflow-hidden'
            : 'flex-1 min-h-0 overflow-y-auto p-3 overscroll-contain'
        }
      >
        {editingCategoryId ? (
          // Show category effect editor when editing a category
          <CategoryEffectEditor
            category={getCategoryFromDefaults(defaultAssumptions, editingCategoryId)}
            categoryId={editingCategoryId}
            globalParameters={mergedGlobalParameters}
            onSave={handleSaveCategoryEffects}
            onCancel={handleCancelCategoryEdit}
          />
        ) : editingRecipient?.isMultiCategory ? (
          // Show multi-category editor for recipients with multiple categories
          <MultiCategoryRecipientEditor
            recipient={editingRecipient.recipient}
            recipientId={editingRecipient.recipientId}
            categories={editingRecipient.categories}
            activeCategory={editingRecipient.activeCategory}
            globalParameters={mergedGlobalParameters}
            onSave={handleSaveMultiCategoryEffects}
            onCancel={handleCancelRecipientEdit}
          />
        ) : editingRecipient ? (
          // Show single-category recipient effect editor
          <RecipientEffectEditor
            recipient={editingRecipient.recipient}
            recipientId={editingRecipient.recipientId}
            category={editingRecipient.category}
            categoryId={editingRecipient.categoryId}
            globalParameters={mergedGlobalParameters}
            onSave={handleSaveRecipientEffects}
            onCancel={handleCancelRecipientEdit}
          />
        ) : activeTab === 'global' ? (
          <form onSubmit={handleSubmit}>
            <GlobalValuesSection
              globalParameters={mergedGlobalParameters}
              defaultGlobalParameters={defaultAssumptions.globalParameters}
              formValues={globalForm.formValues}
              errors={globalForm.errors}
              onChange={globalForm.handleChange}
            />
          </form>
        ) : activeTab === 'categories' ? (
          <form onSubmit={handleSubmit}>
            <CategoryValuesSection
              defaultAssumptions={defaultAssumptions}
              userAssumptions={userAssumptions}
              formValues={categoryForm.formValues}
              errors={categoryForm.errors}
              onChange={categoryForm.handleChange}
              onEditCategory={handleEditCategory}
              onResetCategory={resetCategoryToDefaults}
              categoriesWithCustomValues={categoriesWithCustomValues}
              previewYear={previewYear}
            />
          </form>
        ) : (
          <RecipientValuesSection
            filteredRecipients={recipientSearch.filteredRecipients}
            onSearch={recipientSearch.handleSearchChange}
            searchTerm={recipientSearch.searchTerm}
            defaultAssumptions={defaultAssumptions}
            userAssumptions={userAssumptions}
            onEditRecipient={handleEditRecipient}
            previewYear={previewYear}
          />
        )}
      </div>
    </Modal>
  );
};

export default AssumptionsEditor;
