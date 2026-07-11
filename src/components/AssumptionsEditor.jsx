import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useBlocker, useLocation } from 'react-router-dom';
import { useAssumptions } from '../contexts/AssumptionsContext';
import { useNotificationActions } from '../contexts/NotificationContext';
import { validateGlobalParameterValues, scrollToFirstError } from '../utils/assumptionsFormValidation';
import { cleanAndParseValue } from '../utils/effectValidation';
import { useRecipientSearch } from '../hooks/useAssumptionsForm';
import { useGlobalForm } from '../hooks/useGlobalForm';
import { useAssumptionsEditorController } from '../hooks/useAssumptionsEditorController';
import useUnsavedChangesReporter from '../hooks/useUnsavedChangesReporter';
import {
  getAllRecipientsFromDefaults,
  getEffectEditingTargetFromSearch,
  mergeGlobalParameters,
  getCategoryFromDefaults,
} from '../utils/assumptionsEditorHelpers';
import UnappliedEditsModal from './UnappliedEditsModal';

import CategoryValuesSection from './assumptions/CategoryValuesSection';
import RecipientValuesSection from './assumptions/RecipientValuesSection';
import GlobalValuesSection from './assumptions/GlobalValuesSection';
import CategoryEffectEditor from './assumptions/CategoryEffectEditor';
import RecipientEffectEditor from './assumptions/RecipientEffectEditor';
import MultiCategoryRecipientEditor from './assumptions/MultiCategoryRecipientEditor';
import TabNavigation from './assumptions/TabNavigation';
import YearSelector from './shared/YearSelector';

const tabs = [
  { id: 'global', label: 'Global' },
  { id: 'categories', label: 'Causes' },
  { id: 'recipients', label: 'Recipients' },
];

// Every path that moves a draft into the applied assumptions confirms with
// this one message, so "applied" keeps a single meaning across the editor.
export const APPLY_SUCCESS_MESSAGE = 'Assumptions applied — rankings and calculations now use these values.';

// When "Apply and leave" commits the drill-in draft but global validation
// errors cancel the navigation, the partial commit is announced with this
// info notice — a success confirmation would ring false next to the errors.
const PARTIAL_APPLY_MESSAGE = 'Your effect edits were applied. Fix the global parameter errors before leaving.';

const AssumptionsEditor = forwardRef(
  (
    {
      initialTab = 'global',
      initialCategoryId = null,
      initialRecipientId = null,
      initialActiveCategory = null,
      activeAssumptionsLabel = '',
      onParamsChange = () => {},
      onUnappliedEditsChange = () => {},
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
      resetCategoryToDefaults,
      resetRecipientToDefaults,
    } = useAssumptions();

    const { showNotification } = useNotificationActions();

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
      // Capture before committing: the commit itself retires the draft.
      const hadChanges = globalForm.hasUnsavedChanges;
      if (commitGlobalChanges() && hadChanges) {
        showNotification('success', APPLY_SUCCESS_MESSAGE);
      }
    }, [commitGlobalChanges, globalForm.hasUnsavedChanges, showNotification]);

    /**
     * EFFECT_EDITOR_HANDLE_CONTRACT
     *
     * The drill-in effect editors (CategoryEffectEditor, RecipientEffectEditor,
     * MultiCategoryRecipientEditor) forward a ref exposing
     *   attemptApply(): { ok: boolean, effects: <payload>|null }
     * — ok:false means validation errors block a commit (the editor is left
     * showing them; never navigate then); effects:null means the draft is
     * clean; otherwise `effects` is exactly what the editor's onSave would
     * receive. They also report draft dirtiness via onUnsavedChangesChange,
     * including a false on unmount. The navigation guard below consumes both.
     */
    const effectEditorRef = useRef(null);
    const [hasUnappliedEffectEdits, setHasUnappliedEffectEdits] = useState(false);
    // Ref mirror for same-tick reads: applying or cancelling navigates in the
    // same event tick that clears the draft, before React re-renders — the
    // blocker predicate would otherwise block the editor's own close
    // navigation with a stale "dirty" closure.
    const hasUnappliedEffectEditsRef = useRef(false);

    const handleEffectEditorUnsavedChanges = useCallback((dirty) => {
      hasUnappliedEffectEditsRef.current = dirty;
      setHasUnappliedEffectEdits(dirty);
    }, []);

    // Un-applied edits (global form values, drill-in effect drafts) live only
    // in component state, so a navigation that unmounts them destroys work.
    // Global drafts survive same-page query changes (tab switches); a drill-in
    // draft dies with any navigation that closes or retargets its editor.
    const hasUnappliedGlobalEdits = globalForm.hasUnsavedChanges;
    const hasUnappliedEdits = hasUnappliedGlobalEdits || hasUnappliedEffectEdits;

    // The page renders the differences section (in the Current Assumptions
    // panel) and needs to know when un-applied drafts exist.
    useUnsavedChangesReporter(hasUnappliedEdits, onUnappliedEditsChange);

    const location = useLocation();

    const navigationBlocker = useBlocker(
      useCallback(
        ({ currentLocation, nextLocation }) => {
          const pathnameChanged = currentLocation.pathname !== nextLocation.pathname;

          if (hasUnappliedGlobalEdits && pathnameChanged) {
            return true;
          }

          if (!hasUnappliedEffectEditsRef.current) {
            return false;
          }

          if (pathnameChanged) {
            return true;
          }

          const currentTarget = getEffectEditingTargetFromSearch(currentLocation.search);
          return currentTarget !== null && currentTarget !== getEffectEditingTargetFromSearch(nextLocation.search);
        },
        [hasUnappliedGlobalEdits]
      )
    );

    // Release a blocked navigation if the edits get applied or reset while
    // the prompt is up (standard useBlocker safety valve).
    useEffect(() => {
      if (navigationBlocker.state === 'blocked' && !hasUnappliedEdits) {
        navigationBlocker.reset();
      }
    }, [navigationBlocker, hasUnappliedEdits]);

    // The router blocker can't see reloads or tab closes; ask the browser to
    // confirm those too while edits are un-applied.
    useEffect(() => {
      if (!hasUnappliedEdits) {
        return undefined;
      }

      const handleBeforeUnload = (event) => {
        event.preventDefault();
        // Chrome still requires returnValue to show the confirmation dialog.
        event.returnValue = '';
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnappliedEdits]);

    // Commit an effect editor's payload to the applied assumptions WITHOUT
    // the editor-closing navigation its onSave handlers chain — the guard's
    // pending navigation supplies the exit.
    const commitEffectEditorPayload = useCallback(
      (effects) => {
        if (editingCategoryId) {
          replaceCategoryEffects(editingCategoryId, effects);
        } else if (editingRecipient?.isMultiCategory) {
          replaceRecipientEffectsByCategory(editingRecipient.recipientId, effects);
        } else if (editingRecipient) {
          replaceRecipientCategoryEffects(editingRecipient.recipientId, editingRecipient.categoryId, effects);
        }
      },
      [
        editingCategoryId,
        editingRecipient,
        replaceCategoryEffects,
        replaceRecipientEffectsByCategory,
        replaceRecipientCategoryEffects,
      ]
    );

    const handleApplyAndLeave = useCallback(() => {
      const stay = () => {
        if (navigationBlocker.state === 'blocked') {
          navigationBlocker.reset();
        }
      };

      // Deliberately NOT atomic when both draft kinds are dirty: the drill-in
      // payload commits first (its failure keeps the user in the editor,
      // where the errors are visible), and a global validation failure below
      // then holds the navigation with the drill-in work already applied —
      // visible and revertible in the differences section, never silent.
      // Refusing both would strand the valid drill-in draft: surfacing the
      // global errors means switching to the Global tab, a navigation the
      // still-dirty editor would itself re-block.
      let appliedSomething = false;
      if (hasUnappliedEffectEditsRef.current) {
        const result = effectEditorRef.current?.attemptApply() ?? { ok: false };
        if (!result.ok) {
          // The editor is showing its validation errors.
          stay();
          return;
        }
        if (result.effects) {
          commitEffectEditorPayload(result.effects);
          appliedSomething = true;
        }
        handleEffectEditorUnsavedChanges(false);
      }

      // A same-page navigation (tab or entity switch) only threatens the
      // drill-in draft — the global form survives it, so leave global edits
      // un-applied rather than committing more than the user asked for.
      const leavingPage = navigationBlocker.location?.pathname !== location.pathname;
      if (leavingPage) {
        const hadGlobalChanges = globalForm.hasUnsavedChanges;
        if (!commitGlobalChanges()) {
          // commitGlobalChanges surfaced the errors (switching to the Global
          // tab if needed), so stay — announcing the drill-in half that DID
          // commit, which would otherwise be a hidden state change.
          if (appliedSomething) {
            showNotification('info', PARTIAL_APPLY_MESSAGE);
          }
          stay();
          return;
        }
        appliedSomething = appliedSomething || hadGlobalChanges;
      }

      if (appliedSomething) {
        showNotification('success', APPLY_SUCCESS_MESSAGE);
      }

      if (navigationBlocker.state === 'blocked') {
        navigationBlocker.proceed();
      }
    }, [
      commitEffectEditorPayload,
      commitGlobalChanges,
      globalForm.hasUnsavedChanges,
      handleEffectEditorUnsavedChanges,
      location.pathname,
      navigationBlocker,
      showNotification,
    ]);

    useImperativeHandle(ref, () => {
      const commitPendingAssumptionsEdits = () => {
        // An open-but-clean drill-in editor is fine; only a dirty draft makes
        // the current state ambiguous to save or share.
        if (hasUnappliedEffectEditsRef.current) {
          return {
            ok: false,
            message: 'Apply or cancel your in-progress edits before continuing.',
          };
        }

        const hadGlobalChanges = globalForm.hasUnsavedChanges;
        if (!commitGlobalChanges()) {
          return {
            ok: false,
            message: 'Fix global parameter errors before continuing.',
          };
        }

        if (hadGlobalChanges) {
          // Save/Share implicitly apply a pending global draft (the state
          // being persisted is the applied state), so the apply gets the
          // same confirmation as the explicit Apply paths.
          showNotification('success', APPLY_SUCCESS_MESSAGE);
        }

        return { ok: true };
      };

      return {
        commitPendingAssumptionsEdits,
        // Backward-compatible alias while callers migrate to the generic name.
        prepareForShare: commitPendingAssumptionsEdits,
      };
    }, [commitGlobalChanges, globalForm.hasUnsavedChanges, showNotification]);

    // Applying commits and then navigates the editor closed; cancelling is an
    // explicit discard. Both navigations run in the same tick that retires the
    // draft, so clear the dirty flag first (see hasUnappliedEffectEditsRef) —
    // the guard must not block the editor's own exits.
    const handleSaveCategoryEffects = useCallback(
      (updatedEffects) => {
        if (!editingCategoryId) {
          return;
        }

        replaceCategoryEffects(editingCategoryId, updatedEffects);
        handleEffectEditorUnsavedChanges(false);
        handleCancelCategoryEdit();
        showNotification('success', APPLY_SUCCESS_MESSAGE);
      },
      [
        editingCategoryId,
        replaceCategoryEffects,
        handleEffectEditorUnsavedChanges,
        handleCancelCategoryEdit,
        showNotification,
      ]
    );

    const handleSaveRecipientEffects = useCallback(
      (updatedEffects) => {
        if (!editingRecipient) {
          return;
        }

        replaceRecipientCategoryEffects(editingRecipient.recipientId, editingRecipient.categoryId, updatedEffects);
        handleEffectEditorUnsavedChanges(false);
        handleCancelRecipientEdit();
        showNotification('success', APPLY_SUCCESS_MESSAGE);
      },
      [
        editingRecipient,
        replaceRecipientCategoryEffects,
        handleEffectEditorUnsavedChanges,
        handleCancelRecipientEdit,
        showNotification,
      ]
    );

    const handleSaveMultiCategoryEffects = useCallback(
      (allCategoryEffects) => {
        if (!editingRecipient) {
          return;
        }

        replaceRecipientEffectsByCategory(editingRecipient.recipientId, allCategoryEffects);
        handleEffectEditorUnsavedChanges(false);
        handleCancelRecipientEdit();
        showNotification('success', APPLY_SUCCESS_MESSAGE);
      },
      [
        editingRecipient,
        replaceRecipientEffectsByCategory,
        handleEffectEditorUnsavedChanges,
        handleCancelRecipientEdit,
        showNotification,
      ]
    );

    const handleDiscardCategoryEdit = useCallback(() => {
      handleEffectEditorUnsavedChanges(false);
      handleCancelCategoryEdit();
    }, [handleEffectEditorUnsavedChanges, handleCancelCategoryEdit]);

    const handleDiscardRecipientEdit = useCallback(() => {
      handleEffectEditorUnsavedChanges(false);
      handleCancelRecipientEdit();
    }, [handleEffectEditorUnsavedChanges, handleCancelRecipientEdit]);

    const isEditingEffects = Boolean(editingCategoryId || editingRecipient);
    const hasGlobalFormErrors = Object.keys(globalForm.errors).length > 0;
    const activePanelId = `assumptions-panel-${activeTab}`;

    // Word the guard prompt for what the blocked navigation would actually
    // discard: same-page navigations (tab or entity switches) only threaten
    // the drill-in draft — the global form survives them.
    const editingEntityName = editingCategoryId
      ? getCategoryFromDefaults(defaultAssumptions, editingCategoryId)?.name
      : editingRecipient?.recipient?.name;
    const blockerLeavesPage =
      navigationBlocker.state === 'blocked' && navigationBlocker.location?.pathname !== location.pathname;
    const atRiskSubjects = [];
    if (hasUnappliedGlobalEdits && blockerLeavesPage) {
      atRiskSubjects.push('global parameters');
    }
    if (hasUnappliedEffectEdits) {
      atRiskSubjects.push(editingEntityName ? `effects for ${editingEntityName}` : 'effects');
    }
    const unappliedEditsMessage = `You changed ${atRiskSubjects.join(' and ')} but haven't applied them. Edits that aren't applied are discarded when you leave.`;

    return (
      <div className="flex flex-col gap-3 p-3 sm:p-4">
        <div className="px-1 sm:px-2">
          <h2 className="assumptions-title text-2xl font-semibold text-strong">
            <span>Edit/View Assumptions</span>
            {activeAssumptionsLabel && <span className="assumptions-title__meta ml-2">: {activeAssumptionsLabel}</span>}
          </h2>
        </div>

        {/* Strip + panel live in one wrapper so the root's flex gap doesn't
            separate them: the strip overlaps the panel border to fuse the
            active tab into it. Drill-in editors are their own card, so the
            strip detaches instead. Tabs stay enabled while an editor is open —
            switching away from a dirty draft is caught by the navigation
            guard, not by locking the UI. */}
        <div className={`assumptions-tabs-region${isEditingEffects ? ' assumptions-tabs-region--detached' : ''}`}>
          <div className="assumptions-toolbar">
            <div className="assumptions-toolbar__nav">
              <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} tabs={tabs} idBase="assumptions" />
            </div>

            <div className="assumptions-toolbar__actions">
              {!isEditingEffects && activeTab === 'global' && (
                // Only the Global tab commits through an explicit Apply;
                // cause/recipient edits commit from their drill-in editors.
                <div className="assumptions-form-actions">
                  {hasGlobalFormErrors && (
                    <p className="assumptions-form-actions__status">Fix validation errors before applying.</p>
                  )}
                  <button
                    type="button"
                    onClick={handleSaveGlobal}
                    disabled={hasGlobalFormErrors || !globalForm.hasUnsavedChanges}
                    className="impact-btn impact-btn--custom-accent assumptions-form-actions__apply"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* The tabpanel class (panel chrome) drops while a drill-in editor
              renders its own card, but the panel semantics stay: the tabs
              remain operable, so their aria-controls target must exist. */}
          <div
            className={isEditingEffects ? '' : 'assumptions-tabpanel'}
            id={activePanelId}
            role="tabpanel"
            aria-labelledby={`assumptions-tab-${activeTab}`}
          >
            {!isEditingEffects && (
              <div className="assumptions-panel-context">
                {activeTab === 'global' ? (
                  <span>Global parameters that affect the lives saved calculations:</span>
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
                    <span>{activeTab === 'categories' ? 'for each cause:' : 'for each recipient:'}</span>
                  </>
                )}
              </div>
            )}

            {editingCategoryId ? (
              <CategoryEffectEditor
                ref={effectEditorRef}
                category={getCategoryFromDefaults(defaultAssumptions, editingCategoryId)}
                categoryId={editingCategoryId}
                globalParameters={mergedGlobalParameters}
                onSave={handleSaveCategoryEffects}
                onCancel={handleDiscardCategoryEdit}
                onUnsavedChangesChange={handleEffectEditorUnsavedChanges}
              />
            ) : editingRecipient?.isMultiCategory ? (
              <MultiCategoryRecipientEditor
                ref={effectEditorRef}
                recipient={editingRecipient.recipient}
                recipientId={editingRecipient.recipientId}
                categories={editingRecipient.categories}
                activeCategory={editingRecipient.activeCategory}
                globalParameters={mergedGlobalParameters}
                onSave={handleSaveMultiCategoryEffects}
                onCancel={handleDiscardRecipientEdit}
                onUnsavedChangesChange={handleEffectEditorUnsavedChanges}
              />
            ) : editingRecipient ? (
              <RecipientEffectEditor
                ref={effectEditorRef}
                recipient={editingRecipient.recipient}
                recipientId={editingRecipient.recipientId}
                category={editingRecipient.category}
                categoryId={editingRecipient.categoryId}
                globalParameters={mergedGlobalParameters}
                onSave={handleSaveRecipientEffects}
                onCancel={handleDiscardRecipientEdit}
                onUnsavedChangesChange={handleEffectEditorUnsavedChanges}
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

        <UnappliedEditsModal
          isOpen={navigationBlocker.state === 'blocked'}
          message={unappliedEditsMessage}
          onApplyAndLeave={handleApplyAndLeave}
          onDiscardAndLeave={() => navigationBlocker.proceed()}
          onStay={() => navigationBlocker.reset()}
        />
      </div>
    );
  }
);

AssumptionsEditor.propTypes = {
  initialTab: PropTypes.string,
  initialCategoryId: PropTypes.string,
  initialRecipientId: PropTypes.string,
  initialActiveCategory: PropTypes.string,
  activeAssumptionsLabel: PropTypes.string,
  onParamsChange: PropTypes.func,
  onUnappliedEditsChange: PropTypes.func,
};

AssumptionsEditor.displayName = 'AssumptionsEditor';

export default AssumptionsEditor;
