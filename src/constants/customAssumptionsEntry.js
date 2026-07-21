export const CURRENT_CUSTOM_ENTRY_ID = '__current_custom__';

export const CURRENT_CUSTOM_ENTRY = Object.freeze({
  id: CURRENT_CUSTOM_ENTRY_ID,
  label: 'Custom (unnamed)',
  source: 'custom',
  description:
    'The current assumptions have been edited and no longer match a saved set. They are applied to every ranking and calculation and will be restored when you return to this browser.',
  content:
    'The current assumptions have been edited and no longer match a saved set of assumptions. They are applied — every ranking and calculation on the site uses them — and will be restored when you return to this browser.\n\nThey are not saved as a named set. If you want a reusable named copy, click “Save as…” or click “Share” to create a link to these assumptions that you can share with others.',
});
