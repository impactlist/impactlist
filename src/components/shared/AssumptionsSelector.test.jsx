import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AssumptionsSelector from './AssumptionsSelector';

const mockSetAllUserAssumptions = vi.fn();
const mockMarkSavedAssumptionsLoaded = vi.fn();
const mockSetActiveSavedAssumptionsId = vi.fn();
const mockAttachSavedAssumptionsShareReference = vi.fn();
const mockSaveNewAssumptions = vi.fn();
const mockUpdateSavedAssumptions = vi.fn();
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
  attachSavedAssumptionsShareReference: (...args) => mockAttachSavedAssumptionsShareReference(...args),
  createComparableAssumptionsFingerprint: (assumptions) => JSON.stringify(assumptions || null),
  getActiveSavedAssumptionsId: () => mockSavedAssumptionsState.activeId,
  getSavedAssumptions: () => [savedEntry],
  markSavedAssumptionsLoaded: (...args) => mockMarkSavedAssumptionsLoaded(...args),
  SAVED_ASSUMPTIONS_CHANGED_EVENT: 'saved-assumptions:changed',
  saveNewAssumptions: (...args) => mockSaveNewAssumptions(...args),
  setActiveSavedAssumptionsId: (...args) => mockSetActiveSavedAssumptionsId(...args),
  updateSavedAssumptions: (...args) => mockUpdateSavedAssumptions(...args),
}));

vi.mock('../ShareAssumptionsModal', () => ({
  default: ({ isOpen, title = 'Share Assumptions', onSaved, onClose }) => {
    if (!isOpen) {
      return null;
    }

    return (
      <div>
        <h2>{title}</h2>
        <button
          type="button"
          onClick={() =>
            onSaved({
              reference: 'shared-selector-ref',
              description: 'Shared selector description',
              shareUrl: 'http://localhost:3000/?shared=shared-selector-ref',
            })
          }
        >
          Simulate Share Saved
        </button>
        <button type="button" onClick={onClose}>
          Close Share Modal
        </button>
      </div>
    );
  },
}));

describe('AssumptionsSelector', () => {
  const openMenu = async (user) => {
    await user.click(screen.getByRole('button', { name: /Active assumptions:/ }));
    return screen.getByRole('menu', { name: 'Assumptions options' });
  };

  const getMenuRow = (menu, label) => within(menu).getByText(label).closest('.assumptions-entry');

  beforeEach(() => {
    mockSetAllUserAssumptions.mockReset();
    mockMarkSavedAssumptionsLoaded.mockReset();
    mockSetActiveSavedAssumptionsId.mockReset();
    mockAttachSavedAssumptionsShareReference.mockReset();
    mockSaveNewAssumptions.mockReset();
    mockUpdateSavedAssumptions.mockReset();
    mockShowNotification.mockReset();
    mockAssumptionsState.normalizedAssumptions = null;
    mockAssumptionsState.isUsingCustomValues = false;
    mockSavedAssumptionsState.activeId = null;
    delete savedEntry.reference;
    delete savedEntry.shareUrl;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the assumptions trigger', () => {
    render(<AssumptionsSelector />);

    expect(screen.getByRole('button', { name: /Active assumptions:/ })).toBeInTheDocument();
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

  it('shows Share for an active local assumptions set and keeps rename/delete hidden', async () => {
    const user = userEvent.setup();
    mockSavedAssumptionsState.activeId = savedEntry.id;
    mockAssumptionsState.normalizedAssumptions = savedEntry.assumptions;

    render(<AssumptionsSelector />);

    const summaryRow = document.querySelector('.saved-assumptions-panel__summary');
    expect(within(summaryRow).getByRole('button', { name: 'Share' })).toBeInTheDocument();
    expect(within(summaryRow).queryByRole('button', { name: 'Rename' })).not.toBeInTheDocument();
    expect(within(summaryRow).queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();

    await user.click(within(summaryRow).getByRole('button', { name: 'Share' }));
    expect(screen.getByRole('heading', { name: 'Share Assumptions' })).toBeInTheDocument();
  });

  it('shows Save for custom unsaved assumptions and saves them to the library', async () => {
    const user = userEvent.setup();
    const customAssumptions = {
      globalParameters: { timeLimit: 800 },
    };
    mockAssumptionsState.isUsingCustomValues = true;
    mockAssumptionsState.normalizedAssumptions = customAssumptions;
    mockSaveNewAssumptions.mockReturnValue({
      ok: true,
      entry: { id: 'saved-2' },
    });

    render(<AssumptionsSelector />);

    const summaryRow = document.querySelector('.saved-assumptions-panel__summary');
    expect(within(summaryRow).getByRole('button', { name: 'Save' })).toBeInTheDocument();

    await user.click(within(summaryRow).getByRole('button', { name: 'Save' }));
    expect(screen.getByRole('heading', { name: 'Save to Library' })).toBeInTheDocument();

    await user.type(screen.getByLabelText('Label'), 'My Custom Assumptions');
    await user.click(screen.getByRole('button', { name: 'Save to Library' }));

    expect(mockSaveNewAssumptions).toHaveBeenCalledWith({
      label: 'My Custom Assumptions',
      description: '',
      assumptions: customAssumptions,
      source: 'local',
    });
    expect(mockSetActiveSavedAssumptionsId).toHaveBeenCalledWith('saved-2');
    expect(screen.queryByRole('heading', { name: 'Save to Library' })).not.toBeInTheDocument();
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

  it('shows Copy Link instead of Share when the active assumptions set already has a share link', () => {
    mockSavedAssumptionsState.activeId = savedEntry.id;
    mockAssumptionsState.normalizedAssumptions = savedEntry.assumptions;
    savedEntry.reference = 'saved-link';
    savedEntry.shareUrl = 'http://localhost:3000/?shared=saved-link';

    render(<AssumptionsSelector />);

    const summaryRow = document.querySelector('.saved-assumptions-panel__summary');
    expect(within(summaryRow).queryByRole('button', { name: 'Share' })).not.toBeInTheDocument();
    expect(within(summaryRow).getByRole('button', { name: 'Copy Link' })).toBeInTheDocument();
  });

  it('syncs a newly created share link back into saved assumptions from the selector flow', async () => {
    const user = userEvent.setup();
    mockSavedAssumptionsState.activeId = savedEntry.id;
    mockAssumptionsState.normalizedAssumptions = savedEntry.assumptions;
    mockAttachSavedAssumptionsShareReference.mockReturnValue({
      ok: true,
      entry: { id: savedEntry.id },
    });

    render(<AssumptionsSelector />);

    const summaryRow = document.querySelector('.saved-assumptions-panel__summary');
    await user.click(within(summaryRow).getByRole('button', { name: 'Share' }));
    await user.click(screen.getByRole('button', { name: 'Simulate Share Saved' }));

    expect(mockAttachSavedAssumptionsShareReference).toHaveBeenCalledWith({
      reference: 'shared-selector-ref',
      description: 'Shared selector description',
      assumptions: savedEntry.assumptions,
      preferredId: savedEntry.id,
    });
    expect(mockSetActiveSavedAssumptionsId).toHaveBeenCalledWith(savedEntry.id);
  });

  it('shows an error notification when selector share sync fails unexpectedly', async () => {
    const user = userEvent.setup();
    mockSavedAssumptionsState.activeId = savedEntry.id;
    mockAssumptionsState.normalizedAssumptions = savedEntry.assumptions;
    mockAttachSavedAssumptionsShareReference.mockReturnValue({
      ok: false,
      errorCode: 'storage_write_failed',
    });

    render(<AssumptionsSelector />);

    const summaryRow = document.querySelector('.saved-assumptions-panel__summary');
    await user.click(within(summaryRow).getByRole('button', { name: 'Share' }));
    await user.click(screen.getByRole('button', { name: 'Simulate Share Saved' }));

    expect(mockShowNotification).toHaveBeenCalledWith(
      'error',
      'Share link created, but could not sync it to the Assumptions Library.'
    );
  });
});
