import React, { useState, useEffect, useMemo } from 'react';
import { useCostPerLife } from './CostPerLifeContext';
import { getAllRecipients, getAllCategories } from '../utils/donationDataHelpers';
import { calculateCategoryBaseCostPerLife } from '../utils/effectsCalculation';
import {
  validateCategoryValues,
  validateRecipientValues,
  scrollToFirstError,
} from '../utils/assumptionsFormValidation';
import { useCategoryForm, useRecipientForm, useRecipientSearch } from '../hooks/useAssumptionsForm';

// Import shared components
import DefaultValuesSection from './assumptions/DefaultValuesSection';
import RecipientValuesSection from './assumptions/RecipientValuesSection';
import Modal from './assumptions/Modal';
import TabNavigation from './assumptions/TabNavigation';
import FormActions from './assumptions/FormActions';

const AssumptionsEditor = () => {
  const {
    combinedAssumptions,
    updateCategoryValue,
    updateRecipientValue,
    getCategoryValue,
    getRecipientValue,
    isModalOpen,
    closeModal,
  } = useCostPerLife();

  const [activeTab, setActiveTab] = useState('categories');

  const allRecipients = useMemo(() => getAllRecipients(), []);
  const allCategories = useMemo(() => {
    // Convert to format expected by the component
    const categories = {};
    getAllCategories().forEach((category) => {
      // Calculate cost per life from effects
      const costPerLife = calculateCategoryBaseCostPerLife(category, category.id);
      categories[category.id] = {
        name: category.name,
        costPerLife: costPerLife,
      };
    });
    return categories;
  }, []);

  // Use custom hooks for form state management
  const categoryForm = useCategoryForm(allCategories, getCategoryValue, isModalOpen);
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

  // Initialize filtered recipients when modal opens
  useEffect(() => {
    if (isModalOpen && activeTab === 'recipients') {
      recipientSearch.filterRecipients(recipientSearch.searchTerm, recipientSearch.searchTerm === '');
    }
  }, [isModalOpen, activeTab, recipientSearch]);

  // Update filtered recipients when tab changes
  useEffect(() => {
    if (activeTab === 'recipients') {
      recipientSearch.filterRecipients(recipientSearch.searchTerm, recipientSearch.searchTerm === '');
    }
  }, [activeTab, recipientSearch]);

  // Validate all values before submission
  const validateAllValues = () => {
    // Validate category values
    const categoryValidation = validateCategoryValues(categoryForm.formValues, allCategories);
    categoryForm.setErrors(categoryValidation.errors);

    // Validate recipient form values
    const recipientValidation = validateRecipientValues(recipientForm.formValues);
    recipientForm.setErrors(recipientValidation.errors);

    const hasErrors = categoryValidation.hasErrors || recipientValidation.hasErrors;

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

  // Handle reset button for categories
  const handleCategoryReset = () => {
    categoryForm.reset();
  };

  // Handle reset button for recipients - only resets recipient data, preserves category values
  const handleResetRecipients = () => {
    // Clear all recipient custom values using context methods
    Object.keys(recipientForm.formValues).forEach((fieldKey) => {
      const [recipientName, categoryId, type] = fieldKey.split('__');
      updateRecipientValue(recipientName, categoryId, type, '');
    });
    recipientForm.reset();
  };

  const tabs = [
    { id: 'categories', label: 'Categories' },
    { id: 'recipients', label: 'Recipients' },
  ];

  const getDescription = () => {
    return activeTab === 'categories'
      ? 'Customize the cost per life values for different cause categories. These values represent the estimated cost in dollars to save one life.'
      : "Customize how specific recipients' cost per life values differ from their category defaults. You can set a multiplier or specify a direct cost per life value.";
  };

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} title="Edit Cost Per Life Values" description={getDescription()}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:items-center sm:justify-between">
          <div className="order-2 sm:order-1">
            <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} tabs={tabs} />
          </div>
          <div className="order-1 sm:order-2">
            <FormActions
              onReset={activeTab === 'categories' ? handleCategoryReset : handleResetRecipients}
              onCancel={closeModal}
              onSave={handleSubmit}
              resetLabel={activeTab === 'categories' ? 'Reset Categories' : 'Reset Recipients'}
            />
          </div>
        </div>
      </div>

      {/* Tab content container */}
      <div className="overflow-y-auto p-3 flex-grow h-[calc(100vh-15rem)] min-h-[400px]">
        {activeTab === 'categories' ? (
          <form onSubmit={handleSubmit}>
            <DefaultValuesSection
              allCategories={allCategories}
              formValues={categoryForm.formValues}
              errors={categoryForm.errors}
              onChange={categoryForm.handleChange}
            />
          </form>
        ) : (
          <RecipientValuesSection
            filteredRecipients={recipientSearch.filteredRecipients}
            formValues={recipientForm.formValues}
            errors={recipientForm.errors}
            allCategories={allCategories}
            getCustomRecipientValue={getRecipientValue}
            onChange={recipientForm.handleChange}
            onSearch={recipientSearch.handleSearchChange}
            searchTerm={recipientSearch.searchTerm}
          />
        )}
      </div>
    </Modal>
  );
};

export default AssumptionsEditor;
