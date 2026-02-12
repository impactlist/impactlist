import { useCallback, useMemo } from 'react';
import { getCategoryFromDefaults } from '../utils/assumptionsEditorHelpers';

const VALID_TABS = new Set(['global', 'categories', 'recipients']);

const resolveActiveTab = ({ initialTab, initialCategoryId, initialRecipientId }) => {
  let targetTab = VALID_TABS.has(initialTab) ? initialTab : 'global';

  if (initialRecipientId && targetTab !== 'recipients') {
    targetTab = 'recipients';
  } else if (initialCategoryId && !initialRecipientId && targetTab !== 'categories') {
    targetTab = 'categories';
  }

  return targetTab;
};

export const useAssumptionsEditorController = ({
  initialTab,
  initialCategoryId,
  initialRecipientId,
  initialActiveCategory,
  allRecipients,
  defaultAssumptions,
  onParamsChange,
}) => {
  const activeTab = useMemo(
    () => resolveActiveTab({ initialTab, initialCategoryId, initialRecipientId }),
    [initialTab, initialCategoryId, initialRecipientId]
  );

  const editingCategoryId = useMemo(() => {
    if (initialRecipientId || !initialCategoryId) {
      return null;
    }

    return getCategoryFromDefaults(defaultAssumptions, initialCategoryId) ? initialCategoryId : null;
  }, [initialCategoryId, initialRecipientId, defaultAssumptions]);

  const editingRecipient = useMemo(() => {
    if (!initialRecipientId) {
      return null;
    }

    const recipient = allRecipients.find((entry) => entry.id === initialRecipientId);
    if (!recipient) {
      return null;
    }

    const categoryIds = Object.keys(recipient.categories || {});
    if (categoryIds.length === 0) {
      return null;
    }

    const isMultiCategory = categoryIds.length > 1;
    const activeCategory =
      initialActiveCategory && categoryIds.includes(initialActiveCategory) ? initialActiveCategory : categoryIds[0];

    return {
      recipient,
      recipientId: recipient.id,
      categories: categoryIds.map((categoryId) => ({
        categoryId,
        category: getCategoryFromDefaults(defaultAssumptions, categoryId),
      })),
      isMultiCategory,
      activeCategory,
      // Keep single-category fields for compatibility with RecipientEffectEditor.
      categoryId: activeCategory,
      category: getCategoryFromDefaults(defaultAssumptions, activeCategory),
    };
  }, [allRecipients, defaultAssumptions, initialRecipientId, initialActiveCategory]);

  const handleTabChange = useCallback(
    (tab) => {
      onParamsChange({ tab }, false);
    },
    [onParamsChange]
  );

  const handleEditCategory = useCallback(
    (categoryId) => {
      onParamsChange({ tab: 'categories', categoryId }, true);
    },
    [onParamsChange]
  );

  const handleEditRecipient = useCallback(
    (recipient, recipientId) => {
      const categoryIds = Object.keys(recipient.categories || {});
      if (categoryIds.length === 0) {
        return;
      }

      onParamsChange({ tab: 'recipients', recipientId, activeCategory: categoryIds[0] }, true);
    },
    [onParamsChange]
  );

  const handleCancelCategoryEdit = useCallback(() => {
    onParamsChange({ tab: 'categories' }, false);
  }, [onParamsChange]);

  const handleCancelRecipientEdit = useCallback(() => {
    onParamsChange({ tab: 'recipients' }, false);
  }, [onParamsChange]);

  return {
    activeTab,
    editingCategoryId,
    editingRecipient,
    handleTabChange,
    handleEditCategory,
    handleEditRecipient,
    handleCancelCategoryEdit,
    handleCancelRecipientEdit,
  };
};
