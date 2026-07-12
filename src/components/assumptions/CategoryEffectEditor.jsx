import React, { forwardRef, useCallback, useState, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import QalyEffectInputs from './effects/QalyEffectInputs';
import PopulationEffectInputs from './effects/PopulationEffectInputs';
import EffectCard from './EffectCard';
import EffectEditorHeader from '../shared/EffectEditorHeader';
import EffectEditorFooter from '../shared/EffectEditorFooter';
import EffectEditorActionButtons from '../shared/EffectEditorActionButtons';
import InfoTooltipIcon from '../shared/InfoTooltipIcon';
import {
  calculateEffectCostPerLife,
  cleanEffectsForSave,
  getBaselineReinitSignature,
  haveEffectsChanged,
  sortEffectsByActiveDate,
} from '../../utils/effectEditorUtils';
import { calculateCombinedCostPerLife } from '../../utils/effectsCalculation';
import { getEffectType, validateEffectField, validateEffects } from '../../utils/effectValidation';
import { useAssumptions } from '../../contexts/AssumptionsContext';
import useUnsavedChangesReporter from '../../hooks/useUnsavedChangesReporter';
import { mergeEffects } from '../../utils/assumptionsDataHelpers';
import { resolveCalcYear } from '../../utils/donationDataHelpers';
import { buildCausePath } from '../../utils/causeRoutes';
import YearSelector from '../shared/YearSelector';

/**
 * Component for editing all effects of a category.
 *
 * Reports draft dirtiness through `onUnsavedChangesChange` and exposes
 * `attemptApply()` on its ref (see EFFECT_EDITOR_HANDLE_CONTRACT in
 * AssumptionsEditor) so the navigation guard can commit or hold the draft.
 */
const CategoryEffectEditor = forwardRef(
  (
    {
      category,
      categoryId,
      globalParameters,
      previewYear,
      onPreviewYearChange,
      onSave,
      onCancel,
      onUnsavedChangesChange = () => {},
    },
    ref
  ) => {
    const [errors, setErrors] = useState({});
    const { defaultAssumptions, userAssumptions } = useAssumptions();
    // ONE preview year, owned by the editor shell and shared with the list
    // views — a list set to 2010 can't silently show different costs than
    // this editor. YearSelector commits only valid years; resolveCalcYear is
    // a defensive guard, and labels display the same resolved year that the
    // costs are computed with.
    const calculationYear = resolveCalcYear(previewYear);

    // Get default effects for comparison
    const defaultEffects = useMemo(() => {
      if (!defaultAssumptions?.categories?.[categoryId]?.effects) {
        return [];
      }
      return defaultAssumptions.categories[categoryId].effects;
    }, [defaultAssumptions, categoryId]);

    const baselineEffects = useMemo(() => {
      if (!category?.effects) {
        return [];
      }

      const userEffects = userAssumptions?.categories?.[categoryId]?.effects;
      const mergedEffects = mergeEffects(category.effects, userEffects);
      return sortEffectsByActiveDate(mergedEffects);
    }, [category, categoryId, userAssumptions]);

    // Drafts initialize FROM the baseline — never from [] — so a freshly
    // mounted editor is clean on its very first render. hasUnsavedChanges
    // feeds the navigation guard and the Apply button; an empty initial draft
    // would report a false "dirty" frame before any install effect ran.
    const [tempEditToEffects, setTempEditToEffects] = useState(baselineEffects);

    // Re-initialize drafts whenever the baseline VALUES change. Assumption
    // updates hand us fresh object identities on every change (normalization
    // deep-copies), so gate on a value signature — an unrelated change (e.g.
    // reverting another entity's row in the differences section) must not wipe
    // in-progress draft edits.
    const baselineSignature = useMemo(() => getBaselineReinitSignature(baselineEffects), [baselineEffects]);
    const lastBaselineSignatureRef = useRef(baselineSignature);
    useEffect(() => {
      if (lastBaselineSignatureRef.current === baselineSignature) {
        return;
      }
      lastBaselineSignatureRef.current = baselineSignature;
      setTempEditToEffects(baselineEffects);
    }, [baselineSignature, baselineEffects]);

    // Validate all effects on mount and when effects change
    useEffect(() => {
      if (tempEditToEffects.length > 0) {
        const validation = validateEffects(tempEditToEffects);
        setErrors(validation.errors);
      }
    }, [tempEditToEffects]);

    // Update a specific field of an effect
    const updateEffectField = (effectIndex, fieldName, value) => {
      // Store the value as-is (string with formatting)
      // The validation will clean it when checking
      setTempEditToEffects((prev) => {
        const newEffects = [...prev];
        newEffects[effectIndex] = {
          ...newEffects[effectIndex],
          [fieldName]: value,
        };
        return newEffects;
      });

      // Validate this field immediately
      const effect = { ...tempEditToEffects[effectIndex], [fieldName]: value };
      const effectType = getEffectType(effect);
      const error = validateEffectField(fieldName, value, effectType);
      const errorKey = `${effectIndex}-${fieldName}`;

      setErrors((prev) => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[errorKey] = error;
        } else {
          delete newErrors[errorKey];
        }
        return newErrors;
      });
    };

    // Toggle disabled state for an effect
    const toggleEffectDisabled = (effectIndex) => {
      setTempEditToEffects((prev) => {
        const newEffects = [...prev];
        newEffects[effectIndex] = {
          ...newEffects[effectIndex],
          disabled: !newEffects[effectIndex].disabled,
        };
        return newEffects;
      });
    };

    // Calculate cost per life for each effect
    const effectCostPerLife = useMemo(() => {
      return tempEditToEffects.map((effect) => calculateEffectCostPerLife(effect, globalParameters, calculationYear));
    }, [tempEditToEffects, globalParameters, calculationYear]);

    // Calculate combined cost per life
    const combinedCostPerLife = useMemo(() => {
      return calculateCombinedCostPerLife(effectCostPerLife);
    }, [effectCostPerLife]);

    // Check if there are any validation errors
    const hasErrors = useMemo(() => {
      return Object.keys(errors).length > 0;
    }, [errors]);

    const hasUnsavedChanges = useMemo(() => {
      return haveEffectsChanged(tempEditToEffects, baselineEffects);
    }, [tempEditToEffects, baselineEffects]);

    useUnsavedChangesReporter(hasUnsavedChanges, onUnsavedChangesChange);

    // Validate the draft and hand back what a commit would save, without
    // committing: the footer Apply passes it to onSave (which also closes the
    // editor), while the navigation guard commits it directly so the blocked
    // navigation can complete instead. `cleanEffectsForSave` throws on values
    // that slipped past field validation — a real bug, so let it propagate.
    const attemptApply = useCallback(() => {
      if (!hasUnsavedChanges) {
        return { ok: true, effects: null };
      }
      if (hasErrors) {
        return { ok: false };
      }

      const cleanedEffects = cleanEffectsForSave(tempEditToEffects);
      const validation = validateEffects(cleanedEffects);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return { ok: false };
      }

      return { ok: true, effects: cleanedEffects };
    }, [hasUnsavedChanges, hasErrors, tempEditToEffects]);

    useImperativeHandle(ref, () => ({ attemptApply }), [attemptApply]);

    const handleSave = () => {
      const result = attemptApply();
      if (result.ok && result.effects) {
        onSave(result.effects);
      }
    };

    const showHeaderActions = tempEditToEffects.length > 1;
    const headerActions = showHeaderActions ? (
      <EffectEditorActionButtons
        onSave={handleSave}
        onCancel={onCancel}
        isSaveDisabled={hasErrors || !hasUnsavedChanges}
        compact={true}
      />
    ) : null;

    if (!category) return null;

    return (
      <div className="assumptions-shell assumptions-shell--editor overflow-hidden">
        <EffectEditorHeader
          title={
            <>
              Edit effects for cause
              <InfoTooltipIcon
                className="effect-editor-help"
                content="See the FAQ to learn how to edit these assumptions, and for a description of what effects are."
              />{' '}
              :{' '}
              <Link to={buildCausePath(categoryId)} className="assumptions-link">
                {category.name}
              </Link>
            </>
          }
          description={
            <div className="flex items-center gap-2">
              <YearSelector
                value={previewYear}
                onChange={onPreviewYearChange}
                label="Preview calculations for year:"
                id="category-effect-preview-year"
                className=""
              />
            </div>
          }
          combinedCostPerLife={showHeaderActions ? combinedCostPerLife : undefined}
          combinedCostYear={calculationYear}
          showCombinedCost={showHeaderActions}
          headerActions={headerActions}
        />

        {/* Effects List */}
        <div className="px-3 py-3">
          <div className="space-y-3">
            {tempEditToEffects.map((effect, index) => {
              const effectType = getEffectType(effect);
              const isDisabled = effect.disabled || false;
              const inputProps = {
                effect,
                effectIndex: index,
                defaultEffect: defaultEffects.find((e) => e.effectId === effect.effectId),
                errors,
                onChange: updateEffectField,
                globalParameters,
                isDisabled,
              };

              return (
                <EffectCard
                  key={index}
                  index={index}
                  effectId={effect.effectId}
                  costPerLife={effectCostPerLife[index]}
                  isDisabled={isDisabled}
                  isToggledOff={isDisabled}
                  onToggleDisabled={() => toggleEffectDisabled(index)}
                  validTimeInterval={effect.validTimeInterval}
                  previewYear={calculationYear}
                  rationaleHref={`${buildCausePath(categoryId)}#full-justification`}
                >
                  {effectType === 'qaly' ? (
                    <QalyEffectInputs {...inputProps} />
                  ) : effectType === 'population' ? (
                    <PopulationEffectInputs {...inputProps} />
                  ) : (
                    <div className="text-sm text-danger">Unknown effect type</div>
                  )}
                </EffectCard>
              );
            })}
          </div>
        </div>

        <EffectEditorFooter
          onSave={handleSave}
          onCancel={onCancel}
          hasErrors={hasErrors}
          disabled={!hasUnsavedChanges}
        />
      </div>
    );
  }
);

CategoryEffectEditor.displayName = 'CategoryEffectEditor';

CategoryEffectEditor.propTypes = {
  category: PropTypes.shape({
    name: PropTypes.string.isRequired,
    effects: PropTypes.arrayOf(PropTypes.object).isRequired,
  }),
  categoryId: PropTypes.string.isRequired,
  globalParameters: PropTypes.object.isRequired,
  previewYear: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onPreviewYearChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onUnsavedChangesChange: PropTypes.func,
};

export default CategoryEffectEditor;
