export const CURRENT_CUSTOM_ENTRY_ID = '__current_custom__';

export const CURRENT_CUSTOM_ENTRY = Object.freeze({
  id: CURRENT_CUSTOM_ENTRY_ID,
  label: 'Custom (unsaved)',
  source: 'custom',
  description: 'The current assumptions have been edited and no longer match a saved set of assumptions.',
  content:
    'The current assumptions have been edited and no longer match a saved set of assumptions.\n\nIf you want to reuse these exact assumptions later, click Save to browser to keep a copy in this browser, or click Share to create a link to these assumptions that you can share with others.',
});
