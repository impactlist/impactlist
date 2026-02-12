import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAssumptionsEditorController } from './useAssumptionsEditorController';

const defaultAssumptions = {
  categories: {
    health: { name: 'Health', effects: [] },
    aid: { name: 'Aid', effects: [] },
  },
};

const allRecipients = [
  {
    id: 'recipient-1',
    name: 'Recipient 1',
    categories: {
      health: { fraction: 0.5 },
      aid: { fraction: 0.5 },
    },
  },
];

const buildHook = (overrides = {}) => {
  const onParamsChange = overrides.onParamsChange || vi.fn();

  const { result } = renderHook(() =>
    useAssumptionsEditorController({
      initialTab: 'global',
      initialCategoryId: null,
      initialRecipientId: null,
      initialActiveCategory: null,
      allRecipients,
      defaultAssumptions,
      onParamsChange,
      ...overrides,
    })
  );

  return { result, onParamsChange };
};

describe('useAssumptionsEditorController', () => {
  it('infers active recipients tab from recipient deep-link params', () => {
    const { result } = buildHook({
      initialTab: 'global',
      initialRecipientId: 'recipient-1',
    });

    expect(result.current.activeTab).toBe('recipients');
    expect(result.current.editingRecipient?.recipientId).toBe('recipient-1');
    expect(result.current.editingRecipient?.activeCategory).toBe('health');
    expect(result.current.editingCategoryId).toBeNull();
  });

  it('infers active categories tab from category deep-link params', () => {
    const { result } = buildHook({
      initialTab: 'global',
      initialCategoryId: 'health',
    });

    expect(result.current.activeTab).toBe('categories');
    expect(result.current.editingCategoryId).toBe('health');
    expect(result.current.editingRecipient).toBeNull();
  });

  it('returns null editing state for invalid ids', () => {
    const { result } = buildHook({
      initialTab: 'categories',
      initialCategoryId: 'missing-category',
      initialRecipientId: 'missing-recipient',
    });

    expect(result.current.activeTab).toBe('recipients');
    expect(result.current.editingCategoryId).toBeNull();
    expect(result.current.editingRecipient).toBeNull();
  });

  it('emits URL param updates for tab and edit handlers', () => {
    const { result, onParamsChange } = buildHook();

    result.current.handleTabChange('categories');
    result.current.handleEditCategory('health');
    result.current.handleEditRecipient(allRecipients[0], 'recipient-1');
    result.current.handleCancelCategoryEdit();
    result.current.handleCancelRecipientEdit();

    expect(onParamsChange).toHaveBeenNthCalledWith(1, { tab: 'categories' }, false);
    expect(onParamsChange).toHaveBeenNthCalledWith(2, { tab: 'categories', categoryId: 'health' }, true);
    expect(onParamsChange).toHaveBeenNthCalledWith(
      3,
      { tab: 'recipients', recipientId: 'recipient-1', activeCategory: 'health' },
      true
    );
    expect(onParamsChange).toHaveBeenNthCalledWith(4, { tab: 'categories' }, false);
    expect(onParamsChange).toHaveBeenNthCalledWith(5, { tab: 'recipients' }, false);
  });
});
