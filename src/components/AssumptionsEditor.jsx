import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useAssumptions } from '../contexts/AssumptionsContext';
import { validateGlobalParameterValues, scrollToFirstError } from '../utils/assumptionsFormValidation';
import { cleanAndParseValue } from '../utils/effectValidation';
import { useRecipientSearch } from '../hooks/useAssumptionsForm';
import { useGlobalForm } from '../hooks/useGlobalForm';
import { useAssumptionsEditorController } from '../hooks/useAssumptionsEditorController';
import {
  getAllRecipientsFromDefaults,
  mergeGlobalParameters,
  getCategoryFromDefaults,
} from '../utils/assumptionsEditorHelpers';

import CategoryValuesSection from './assumptions/CategoryValuesSection';
import RecipientValuesSection from './assumptions/RecipientValuesSection';
import GlobalValuesSection from './assumptions/GlobalValuesSection';
import CategoryEffectEditor from './assumptions/CategoryEffectEditor';
import RecipientEffectEditor from './assumptions/RecipientEffectEditor';
import MultiCategoryRecipientEditor from './assumptions/MultiCategoryRecipientEditor';
import TabNavigation from './assumptions/TabNavigation';
import FormActions from './assumptions/FormActions';
import YearSelector from './shared/YearSelector';

const tabs = [
  { id: 'global', label: 'Global' },
  { id: 'categories', label: 'Categories' },
  { id: 'recipients', label: 'Recipients' },
];

const AssumptionsEditor = ({
  initialTab = 'global',
  initialCategoryId = null,
  initialRecipientId = null,
  initialActiveCategory = null,
  onParamsChange = () => {},
}) => {
  const {
    defaultAssumptions,
    userAssumptions,
    replaceCategoryEffects,
    replaceRecipientCategoryEffects,
    replaceRecipientEffectsByCategory,
    updateGlobalParameter,
    resetAllGlobalParameters,
    resetCategoryToDefaults,
    resetRecipientToDefaults,
    getGlobalParameter,
  } = useAssumptions();

  const [previewYear, setPreviewYear] = useState(new Date().getFullYear());

  const allRecipients = useMemo(() => getAllRecipientsFromDefaults(defaultAssumptions), [defaultAssumptions]);

  const {
    activeTab,
    editingCategoryId,
    editingRecipient,
    handleTabChange,
    handleEditCategory,
    handleEditRecipient,
    handleCancelCategoryEdit,
    handleCancelRecipientEdit,
  } = useAssumptionsEditorController({
    initialTab,
    initialCategoryId,
    initialRecipientId,
    initialActiveCategory,
    allRecipients,
    defaultAssumptions,
    onParamsChange,
  });

  const categoriesWithCustomValues = useMemo(
    () => new Set(Object.keys(userAssumptions?.categories ?? {})),
    [userAssumptions?.categories]
  );

  const mergedGlobalParameters = useMemo(
    () => mergeGlobalParameters(defaultAssumptions.globalParameters, userAssumptions?.globalParameters),
    [defaultAssumptions.globalParameters, userAssumptions]
  );

  const globalForm = useGlobalForm(mergedGlobalParameters, defaultAssumptions.globalParameters, getGlobalParameter);

  const recipientSearch = useRecipientSearch(
    allRecipients,
    defaultAssumptions,
    userAssumptions,
    activeTab === 'recipients'
  );

  const handleSaveGlobal = useCallback(() => {
    if (!globalForm.hasUnsavedChanges) {
      return;
    }

    const validation = validateGlobalParameterValues(globalForm.formValues, mergedGlobalParameters);
    globalForm.setErrors(validation.errors);

    if (validation.hasErrors) {
      scrollToFirstError();
      return;
    }

    Object.entries(globalForm.formValues).forEach(([paramKey, valueObj]) => {
      const rawValue = valueObj.raw;

      if (rawValue === null || rawValue === undefined || (typeof rawValue === 'string' && rawValue.trim() === '')) {
        updateGlobalParameter(paramKey, '');
        return;
      }

      const { numValue } = cleanAndParseValue(rawValue);
      if (!isNaN(numValue)) {
        updateGlobalParameter(paramKey, numValue);
      }
    });
  }, [globalForm, mergedGlobalParameters, updateGlobalParameter]);

  const handleGlobalReset = useCallback(() => {
    globalForm.reset();
    resetAllGlobalParameters();
  }, [globalForm, resetAllGlobalParameters]);

  const handleCategoryReset = useCallback(() => {
    Object.keys(userAssumptions?.categories ?? {}).forEach((categoryId) => {
      resetCategoryToDefaults(categoryId);
    });
  }, [userAssumptions, resetCategoryToDefaults]);

  const handleResetRecipients = useCallback(() => {
    recipientSearch.filteredRecipients.forEach((recipient) => {
      resetRecipientToDefaults(recipient.name);
    });
  }, [recipientSearch.filteredRecipients, resetRecipientToDefaults]);

  const handleSaveCategoryEffects = useCallback(
    (updatedEffects) => {
      if (!editingCategoryId) {
        return;
      }

      replaceCategoryEffects(editingCategoryId, updatedEffects);
      handleCancelCategoryEdit();
    },
    [editingCategoryId, replaceCategoryEffects, handleCancelCategoryEdit]
  );

  const handleSaveRecipientEffects = useCallback(
    (updatedEffects) => {
      if (!editingRecipient) {
        return;
      }

      replaceRecipientCategoryEffects(editingRecipient.recipientId, editingRecipient.categoryId, updatedEffects);
      handleCancelRecipientEdit();
    },
    [editingRecipient, replaceRecipientCategoryEffects, handleCancelRecipientEdit]
  );

  const handleSaveMultiCategoryEffects = useCallback(
    (allCategoryEffects) => {
      if (!editingRecipient) {
        return;
      }

      replaceRecipientEffectsByCategory(editingRecipient.recipientId, allCategoryEffects);
      handleCancelRecipientEdit();
    },
    [editingRecipient, replaceRecipientEffectsByCategory, handleCancelRecipientEdit]
  );

  return (
    <div className="flex flex-col">
      {!editingCategoryId && !editingRecipient && (
        <>
          <div className="p-6">
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:items-center sm:justify-between">
              <div className="order-2 sm:order-1 flex items-center">
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
                  onSave={handleSaveGlobal}
                  showSave={activeTab === 'global'}
                  resetLabel={
                    activeTab === 'global'
                      ? 'Reset Global'
                      : activeTab === 'categories'
                        ? 'Reset Categories'
                        : 'Reset Recipients'
                  }
                  hasErrors={Object.keys(globalForm.errors).length > 0}
                  hasUnsavedChanges={globalForm.hasUnsavedChanges}
                />
              </div>
            </div>
          </div>

          <div className="px-6 py-3">
            {activeTab === 'global' ? (
              <p className="text-base font-semibold text-gray-700">
                Global parameters that affect the calculations of the cost to save one life for each category or
                recipient:
              </p>
            ) : (
              <div className="flex items-center flex-wrap text-base font-semibold text-gray-700">
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

      <div className="p-3">
        {editingCategoryId ? (
          <CategoryEffectEditor
            category={getCategoryFromDefaults(defaultAssumptions, editingCategoryId)}
            categoryId={editingCategoryId}
            globalParameters={mergedGlobalParameters}
            onSave={handleSaveCategoryEffects}
            onCancel={handleCancelCategoryEdit}
          />
        ) : editingRecipient?.isMultiCategory ? (
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
          <GlobalValuesSection
            globalParameters={mergedGlobalParameters}
            defaultGlobalParameters={defaultAssumptions.globalParameters}
            formValues={globalForm.formValues}
            errors={globalForm.errors}
            onChange={globalForm.handleChange}
          />
        ) : activeTab === 'categories' ? (
          <CategoryValuesSection
            defaultAssumptions={defaultAssumptions}
            userAssumptions={userAssumptions}
            onEditCategory={handleEditCategory}
            onResetCategory={resetCategoryToDefaults}
            categoriesWithCustomValues={categoriesWithCustomValues}
            previewYear={previewYear}
          />
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
    </div>
  );
};

AssumptionsEditor.propTypes = {
  initialTab: PropTypes.string,
  initialCategoryId: PropTypes.string,
  initialRecipientId: PropTypes.string,
  initialActiveCategory: PropTypes.string,
  onParamsChange: PropTypes.func,
};

export default AssumptionsEditor;
