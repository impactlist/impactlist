import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AssumptionsSelector from './AssumptionsSelector';

const mockSetAllUserAssumptions = vi.fn();
const mockMarkSavedAssumptionsLoaded = vi.fn();
const mockSetActiveSavedAssumptionsId = vi.fn();
const mockShowNotification = vi.fn();
const mockAssumptionsState = {
  normalizedAssumptions: null,
  isUsingCustomValues: false,
};
const mockSavedAssumptionsState = {
  activeId: null,
};

const curatedEntry = {
  id: 'curated:longtermist',
  label: 'Longtermist',
  source: 'curated',
  description: 'Looks far into the future.',
  assumptions: { globalParameters: { timeLimit: 1000000 } },
};

const savedEntry = {
  id: 'saved-1',
  label: 'My Saved Assumptions',
  source: 'local',
  assumptions: { globalParameters: { timeLimit: 500 } },
};

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

vi.mock('../../contexts/AssumptionsContext', () => ({
  useAssumptions: () => ({
    getNormalizedUserAssumptionsForSharing: () => mockAssumptionsState.normalizedAssumptions,
    isUsingCustomValues: mockAssumptionsState.isUsingCustomValues,
    setAllUserAssumptions: mockSetAllUserAssumptions,
  }),
}));

vi.mock('../../contexts/NotificationContext', () => ({
  useNotificationActions: () => ({
    showNotification: (...args) => mockShowNotification(...args),
  }),
}));

vi.mock('../../utils/curatedAssumptionsProfiles', () => ({
  getCuratedAssumptionsEntries: () => [curatedEntry],
  hasCuratedAssumptionsLabel: () => false,
  isCuratedAssumptionsEntryId: (id) => id === curatedEntry.id,
}));

vi.mock('../../utils/savedAssumptionsStore', () => ({
  createComparableAssumptionsFingerprint: (assumptions) => JSON.stringify(assumptions || null),
  getActiveSavedAssumptionsId: () => mockSavedAssumptionsState.activeId,
  getSavedAssumptions: () => [savedEntry],
  markSavedAssumptionsLoaded: (...args) => mockMarkSavedAssumptionsLoaded(...args),
  SAVED_ASSUMPTIONS_CHANGED_EVENT: 'saved-assumptions:changed',
  setActiveSavedAssumptionsId: (...args) => mockSetActiveSavedAssumptionsId(...args),
}));

describe('AssumptionsSelector', () => {
  const openMenu = async (user) => {
    await user.click(screen.getByRole('button', { name: /Active assumptions:/ }));
    return screen.getByRole('menu', { name: 'Assumptions options' });
  };

  const getMenuRow = (menu, label) => within(menu).getByText(label).closest('.assumptions-entry');

  beforeEach(() => {
    globalThis.localStorage.setItem('showAssumptionsSelectorEveryPage:v1', '1');
    mockSetAllUserAssumptions.mockReset();
    mockMarkSavedAssumptionsLoaded.mockReset();
    mockSetActiveSavedAssumptionsId.mockReset();
    mockShowNotification.mockReset();
    mockAssumptionsState.normalizedAssumptions = null;
    mockAssumptionsState.isUsingCustomValues = false;
    mockSavedAssumptionsState.activeId = null;
    delete savedEntry.reference;
    delete savedEntry.shareUrl;
  });

  afterEach(() => {
    globalThis.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders the assumptions trigger', () => {
    render(<AssumptionsSelector />);

    expect(screen.getByRole('button', { name: /Active assumptions:/ })).toBeInTheDocument();
  });

  it('renders a display label without the dropdown when interactive is false', () => {
    mockSavedAssumptionsState.activeId = savedEntry.id;
    mockAssumptionsState.normalizedAssumptions = savedEntry.assumptions;

    render(<AssumptionsSelector interactive={false} />);

    expect(document.querySelector('.assumptions-selector-bar__display-text')).toHaveTextContent(
      'Active assumptions: My Saved Assumptions'
    );
    expect(screen.queryByRole('button', { name: /Active assumptions:/ })).not.toBeInTheDocument();
  });

  it('shows an explanatory tooltip next to the active assumptions label', async () => {
    const user = userEvent.setup();
    render(<AssumptionsSelector />);

    await user.hover(screen.getByRole('button', { name: 'More information' }));

    expect(
      await screen.findByText('Change the active assumptions to see how it affects the rankings.')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'If you want to view the details of the existing assumptions or specify/save/share your own assumptions, go to the Assumptions page.'
      )
    ).toBeInTheDocument();
  });

  it('applies curated assumptions when selected', async () => {
    const user = userEvent.setup();
    render(<AssumptionsSelector />);

    const menu = await openMenu(user);
    await user.click(within(getMenuRow(menu, 'Longtermist')).getByRole('menuitemradio'));

    expect(mockSetAllUserAssumptions).toHaveBeenCalledWith(curatedEntry.assumptions);
    expect(mockSetActiveSavedAssumptionsId).toHaveBeenCalledWith(curatedEntry.id);
    expect(mockMarkSavedAssumptionsLoaded).not.toHaveBeenCalled();
  });

  it('marks saved assumptions as loaded when a saved entry is selected', async () => {
    const user = userEvent.setup();
    render(<AssumptionsSelector />);

    const menu = await openMenu(user);
    await user.click(within(getMenuRow(menu, 'My Saved Assumptions')).getByRole('menuitemradio'));

    expect(mockSetAllUserAssumptions).toHaveBeenCalledWith(savedEntry.assumptions);
    expect(mockMarkSavedAssumptionsLoaded).toHaveBeenCalledWith(savedEntry.id);
    expect(mockSetActiveSavedAssumptionsId).toHaveBeenCalledWith(savedEntry.id);
  });

  it('loads an entry when clicking anywhere on its visible menu row', async () => {
    const user = userEvent.setup();
    render(<AssumptionsSelector />);

    const menu = await openMenu(user);
    await user.click(getMenuRow(menu, 'Longtermist'));

    expect(mockSetAllUserAssumptions).toHaveBeenCalledWith(curatedEntry.assumptions);
    expect(mockSetActiveSavedAssumptionsId).toHaveBeenCalledWith(curatedEntry.id);
  });

  it('opens the description modal when the description icon is clicked', async () => {
    const user = userEvent.setup();
    render(<AssumptionsSelector />);

    const menu = await openMenu(user);
    const longtermistRow = getMenuRow(menu, 'Longtermist');
    await user.click(within(longtermistRow).getByRole('button', { name: 'View description' }));

    expect(screen.getByRole('heading', { name: 'Longtermist' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Description:' })).toHaveTextContent('Looks far into the future.');
    expect(mockSetAllUserAssumptions).not.toHaveBeenCalled();
  });

  it('shows a description for the default assumptions entry', async () => {
    const user = userEvent.setup();
    render(<AssumptionsSelector />);

    const summaryRow = document.querySelector('.saved-assumptions-panel__summary');
    expect(within(summaryRow).queryByRole('button', { name: 'Rename' })).not.toBeInTheDocument();
    expect(within(summaryRow).queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
    await user.click(within(summaryRow).getByRole('button', { name: 'View description' }));

    expect(screen.getByRole('heading', { name: 'Default' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Description:' })).toHaveTextContent(
      'These assumptions reflect the best estimates of the creators of Impact List.'
    );
    expect(screen.getByRole('region', { name: 'Description:' })).toHaveTextContent(
      'You can create and share your own assumptions on the Assumptions page.'
    );
    expect(screen.queryByRole('link', { name: 'Assumptions page' })).not.toBeInTheDocument();
  });

  it('shows only the description action for the default row inside the menu', async () => {
    const user = userEvent.setup();
    mockSavedAssumptionsState.activeId = savedEntry.id;
    mockAssumptionsState.normalizedAssumptions = savedEntry.assumptions;

    render(<AssumptionsSelector />);

    const menu = await openMenu(user);
    const defaultRow = getMenuRow(menu, 'Default');

    expect(within(defaultRow).getByRole('button', { name: 'View description' })).toBeInTheDocument();
    expect(within(defaultRow).queryByRole('button', { name: 'Rename' })).not.toBeInTheDocument();
    expect(within(defaultRow).queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
  });

  it('shows Custom (unsaved) when edits no longer match the active saved assumptions and exposes its description', async () => {
    const user = userEvent.setup();
    mockSavedAssumptionsState.activeId = savedEntry.id;
    mockAssumptionsState.isUsingCustomValues = true;
    mockAssumptionsState.normalizedAssumptions = {
      globalParameters: { timeLimit: 800 },
    };

    render(<AssumptionsSelector />);

    expect(screen.getByRole('button', { name: /Active assumptions:/ })).toHaveTextContent('Custom (unsaved)');
    const summaryRow = document.querySelector('.saved-assumptions-panel__summary');
    await user.click(within(summaryRow).getByRole('button', { name: 'View description' }));

    expect(screen.getByRole('heading', { name: 'Custom (unsaved)' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Description:' })).toHaveTextContent(
      'The active assumptions have been edited and no longer match a saved set of assumptions.'
    );
    expect(screen.getByRole('region', { name: 'Description:' })).toHaveTextContent(
      'If you want to reuse these exact assumptions later, click Save to save a local copy or click Share to create a link to these assumptions that you can share with others.'
    );
  });

  it('keeps save/share/rename/delete hidden in the simplified selector summary', () => {
    mockSavedAssumptionsState.activeId = savedEntry.id;
    mockAssumptionsState.normalizedAssumptions = savedEntry.assumptions;

    render(<AssumptionsSelector />);

    const summaryRow = document.querySelector('.saved-assumptions-panel__summary');
    expect(within(summaryRow).queryByRole('button', { name: 'Share' })).not.toBeInTheDocument();
    expect(within(summaryRow).queryByRole('button', { name: 'Save' })).not.toBeInTheDocument();
    expect(within(summaryRow).queryByRole('button', { name: 'Rename' })).not.toBeInTheDocument();
    expect(within(summaryRow).queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
  });

  it('prompts before overwriting custom unsaved assumptions from the selector and keeps the current state on cancel', async () => {
    const user = userEvent.setup();
    mockSavedAssumptionsState.activeId = savedEntry.id;
    mockAssumptionsState.isUsingCustomValues = true;
    mockAssumptionsState.normalizedAssumptions = {
      globalParameters: { timeLimit: 800 },
    };

    render(<AssumptionsSelector />);

    const menu = await openMenu(user);
    await user.click(within(getMenuRow(menu, 'Longtermist')).getByRole('menuitemradio'));

    expect(screen.getByRole('heading', { name: 'Overwrite your unsaved assumptions?' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('heading', { name: 'Overwrite your unsaved assumptions?' })).not.toBeInTheDocument();
    expect(mockSetAllUserAssumptions).not.toHaveBeenCalled();
    expect(mockSetActiveSavedAssumptionsId).not.toHaveBeenCalled();
  });

  it('prompts before overwriting custom unsaved assumptions from the selector and applies the new entry on continue', async () => {
    const user = userEvent.setup();
    mockSavedAssumptionsState.activeId = savedEntry.id;
    mockAssumptionsState.isUsingCustomValues = true;
    mockAssumptionsState.normalizedAssumptions = {
      globalParameters: { timeLimit: 800 },
    };

    render(<AssumptionsSelector />);

    const menu = await openMenu(user);
    await user.click(within(getMenuRow(menu, 'Longtermist')).getByRole('menuitemradio'));
    await user.click(screen.getByRole('button', { name: 'Continue (overwrite yours)' }));

    expect(mockSetAllUserAssumptions).toHaveBeenCalledWith(curatedEntry.assumptions);
    expect(mockSetActiveSavedAssumptionsId).toHaveBeenCalledWith(curatedEntry.id);
  });

  it('keeps copy link hidden in the simplified selector summary', () => {
    mockSavedAssumptionsState.activeId = savedEntry.id;
    mockAssumptionsState.normalizedAssumptions = savedEntry.assumptions;
    savedEntry.reference = 'saved-link';
    savedEntry.shareUrl = 'http://localhost:3000/?shared=saved-link';

    render(<AssumptionsSelector />);

    const summaryRow = document.querySelector('.saved-assumptions-panel__summary');
    expect(within(summaryRow).queryByRole('button', { name: 'Share' })).not.toBeInTheDocument();
    expect(within(summaryRow).queryByRole('button', { name: 'Copy Link' })).not.toBeInTheDocument();
  });
});
