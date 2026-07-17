import { describe, expect, it } from 'vitest';
import { recipientsById } from './generatedData';

describe('default recipient assumptions', () => {
  it('uses direct overrides rather than multipliers', () => {
    const recipientMultipliers = [];

    for (const [recipientId, recipient] of Object.entries(recipientsById)) {
      for (const [categoryId, category] of Object.entries(recipient.categories || {})) {
        for (const effect of category.effects || []) {
          if (effect.multipliers) {
            recipientMultipliers.push(`${recipientId}/${categoryId}/${effect.effectId}`);
          }
        }
      }
    }

    expect(recipientMultipliers).toEqual([]);
  });
});
