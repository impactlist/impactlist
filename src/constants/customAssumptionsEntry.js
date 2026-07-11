export const CURRENT_CUSTOM_ENTRY_ID = '__current_custom__';

export const CURRENT_CUSTOM_ENTRY = Object.freeze({
  id: CURRENT_CUSTOM_ENTRY_ID,
  label: 'Custom (not saved to browser)',
  source: 'custom',
  description:
    'The current assumptions have been edited and no longer match a saved set. They are applied to every ranking and calculation on the site, but they are not saved to this browser.',
  content:
    'The current assumptions have been edited and no longer match a saved set of assumptions. They are applied — every ranking and calculation on the site uses them — but they are not saved to this browser, so they only last as long as this browser tab.\n\nIf you want to reuse these exact assumptions later, click Save to browser to keep a copy in this browser, or click Share to create a link to these assumptions that you can share with others.',
});
