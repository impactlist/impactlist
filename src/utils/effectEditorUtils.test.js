import { describe, expect, it } from 'vitest';
import { buildRecipientEditableEffects, calculateEffectCostPerLife } from './effectEditorUtils';

describe('buildRecipientEditableEffects', () => {
  it('uses user category values as the recipient base effect for downstream calculations', () => {
    const baseCategoryEffects = [
      {
        effectId: 'standard',
        costPerQALY: 160000,
        startTime: 1,
        windowLength: 10,
      },
    ];

    const userCategoryEffects = [
      {
        effectId: 'standard',
        costPerQALY: 80000,
      },
    ];

    const [editableEffect] = buildRecipientEditableEffects({
      baseCategoryEffects,
      userCategoryEffects,
    });

    expect(editableEffect._baseEffect.costPerQALY).toBe(80000);

    const globalParameters = {
      yearsPerLife: 100,
      discountRate: 0,
      timeLimit: 100,
    };

    expect(calculateEffectCostPerLife(editableEffect._baseEffect, globalParameters, 2026)).toBe(8000000);
  });

  it('preserves category-level disabled state on the recipient base effect', () => {
    const [editableEffect] = buildRecipientEditableEffects({
      baseCategoryEffects: [
        {
          effectId: 'standard',
          costPerQALY: 160000,
          startTime: 1,
          windowLength: 10,
          disabled: false,
        },
      ],
      userCategoryEffects: [
        {
          effectId: 'standard',
          disabled: true,
        },
      ],
    });

    expect(editableEffect._baseEffect.disabled).toBe(true);
  });
});
