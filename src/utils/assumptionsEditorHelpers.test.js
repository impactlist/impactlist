import { describe, expect, it } from 'vitest';
import { getCategoryFromDefaults, getEffectEditingTargetFromSearch } from './assumptionsEditorHelpers';

describe('getCategoryFromDefaults', () => {
  it('does not treat inherited object keys as editable categories', () => {
    const defaults = { categories: { health: { name: 'Health', effects: [] } } };

    expect(getCategoryFromDefaults(defaults, 'health')).toMatchObject({ id: 'health', name: 'Health' });
    expect(getCategoryFromDefaults(defaults, '__proto__')).toBeNull();
    expect(getCategoryFromDefaults(defaults, 'constructor')).toBeNull();
  });
});

// The navigation guard compares these identities across a blocked navigation
// to decide whether it would close or retarget the open drill-in editor.
describe('getEffectEditingTargetFromSearch', () => {
  it('returns null when no drill-in editor params are present', () => {
    expect(getEffectEditingTargetFromSearch('')).toBeNull();
    expect(getEffectEditingTargetFromSearch('?tab=categories')).toBeNull();
  });

  it('identifies a category editor by categoryId', () => {
    expect(getEffectEditingTargetFromSearch('?tab=categories&categoryId=ai-risk')).toBe('category:ai-risk');
  });

  it('lets recipientId win over categoryId, mirroring the editor controller', () => {
    expect(getEffectEditingTargetFromSearch('?recipientId=amf&categoryId=global-health')).toBe('recipient:amf');
  });

  it('ignores params the editor survives (tab, activeCategory)', () => {
    expect(getEffectEditingTargetFromSearch('?tab=recipients&recipientId=amf&activeCategory=a')).toBe(
      getEffectEditingTargetFromSearch('?tab=global&recipientId=amf&activeCategory=b')
    );
  });
});
