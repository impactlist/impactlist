import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react';
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

const AssumptionsEditor = forwardRef(
  (
    {
      initialTab = 'global',
      initialCategoryId = null,
      initialRecipientId = null,
      initialActiveCategory = null,
      onParamsChange = () => {},
    },
    ref
  ) => {
    const {
      defaultAssumptions,
      userAssumptions,
      replaceCategoryEffects,
      replaceRecipientCategoryEffects,
      replaceRecipientEffectsByCategory,
      updateGlobalParameterValue,
      resetGlobalParameter,
      resetAllGlobalParameters,
      resetCategoryToDefaults,
      resetRecipientToDefaults,
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

    const globalForm = useGlobalForm(
      mergedGlobalParameters,
      defaultAssumptions.globalParameters,
      userAssumptions?.globalParameters
    );

    const recipientSearch = useRecipientSearch(
      allRecipients,
      defaultAssumptions,
      userAssumptions,
      activeTab === 'recipients'
    );

    const commitGlobalChanges = useCallback(() => {
      if (!globalForm.hasUnsavedChanges) {
        return true;
      }

      const validation = validateGlobalParameterValues(globalForm.formValues, mergedGlobalParameters);
      globalForm.setErrors(validation.errors);

      if (validation.hasErrors) {
        if (activeTab !== 'global') {
          handleTabChange('global');
        }
        scrollToFirstError();
        return false;
      }

      Object.entries(globalForm.formValues).forEach(([paramKey, valueObj]) => {
        const rawValue = valueObj.raw;

        if (rawValue === null || rawValue === undefined || (typeof rawValue === 'string' && rawValue.trim() === '')) {
          resetGlobalParameter(paramKey);
          return;
        }

        const { numValue } = cleanAndParseValue(rawValue);
        if (!isNaN(numValue)) {
          updateGlobalParameterValue(paramKey, numValue);
        }
      });
      return true;
    }, [
      activeTab,
      globalForm,
      handleTabChange,
      mergedGlobalParameters,
      resetGlobalParameter,
      updateGlobalParameterValue,
    ]);

    const handleSaveGlobal = useCallback(() => {
      commitGlobalChanges();
    }, [commitGlobalChanges]);

    useImperativeHandle(ref, () => {
      const commitPendingAssumptionsEdits = () => {
        if (editingCategoryId || editingRecipient) {
          return {
            ok: false,
            message: 'Apply or cancel your in-progress edits before continuing.',
          };
        }

        const globalSaved = commitGlobalChanges();
        if (!globalSaved) {
          return {
            ok: false,
            message: 'Fix global parameter errors before continuing.',
          };
        }

        return { ok: true };
      };

      return {
        commitPendingAssumptionsEdits,
        // Backward-compatible alias while callers migrate to the generic name.
        prepareForShare: commitPendingAssumptionsEdits,
      };
    }, [commitGlobalChanges, editingCategoryId, editingRecipient]);

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
        resetRecipientToDefaults(recipient.id);
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

    const isEditingEffects = Boolean(editingCategoryId || editingRecipient);
    const activePanelId = `assumptions-panel-${activeTab}`;

    return (
      <div className="flex flex-col gap-3 p-3 sm:p-4">
        <div className="assumptions-toolbar">
          <TabNavigation
            activeTab={activeTab}
            onTabChange={handleTabChange}
            tabs={tabs}
            idBase="assumptions"
            isLocked={isEditingEffects}
          />

          {isEditingEffects ? (
            <span className="assumptions-toolbar__hint" role="status" aria-live="polite">
              Apply or cancel current edits to switch sections.
            </span>
          ) : (
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
          )}
        </div>

        <div
          className={isEditingEffects ? '' : 'assumptions-tabpanel'}
          id={isEditingEffects ? undefined : activePanelId}
          role={isEditingEffects ? undefined : 'tabpanel'}
          aria-labelledby={isEditingEffects ? undefined : `assumptions-tab-${activeTab}`}
        >
          {!isEditingEffects && (
            <div className="assumptions-panel-context">
              {activeTab === 'global' ? (
                <span>Global parameters that affect the lives saved for each category or recipient:</span>
              ) : (
                <>
                  <span>Cost to save a life in</span>
                  <YearSelector
                    value={previewYear}
                    onChange={setPreviewYear}
                    id="assumptions-preview-year"
                    label=""
                    className="assumptions-panel-context__year-selector"
                  />
                  <span>{activeTab === 'categories' ? 'for each cause category:' : 'for each recipient:'}</span>
                </>
              )}
            </div>
          )}

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
              onResetRecipient={resetRecipientToDefaults}
              previewYear={previewYear}
            />
          )}
        </div>
      </div>
    );
  }
);

AssumptionsEditor.propTypes = {
  initialTab: PropTypes.string,
  initialCategoryId: PropTypes.string,
  initialRecipientId: PropTypes.string,
  initialActiveCategory: PropTypes.string,
  onParamsChange: PropTypes.func,
};

AssumptionsEditor.displayName = 'AssumptionsEditor';

export default AssumptionsEditor;
