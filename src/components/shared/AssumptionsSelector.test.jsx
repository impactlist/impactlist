import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AssumptionsSelector from './AssumptionsSelector';

const mockSetAllUserAssumptions = vi.fn();
const mockMarkSavedAssumptionsLoaded = vi.fn();
const mockSetActiveSavedAssumptionsId = vi.fn();
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

vi.mock('../../utils/curatedAssumptionsProfiles', () => ({
  getCuratedAssumptionsEntries: () => [curatedEntry],
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
  beforeEach(() => {
    mockSetAllUserAssumptions.mockReset();
    mockMarkSavedAssumptionsLoaded.mockReset();
    mockSetActiveSavedAssumptionsId.mockReset();
    mockAssumptionsState.normalizedAssumptions = null;
    mockAssumptionsState.isUsingCustomValues = false;
    mockSavedAssumptionsState.activeId = null;
  });

  it('renders the assumptions trigger', () => {
    render(<AssumptionsSelector />);

    expect(screen.getByRole('button', { name: /Active assumptions:/ })).toBeInTheDocument();
  });

  it('applies curated assumptions when selected', async () => {
    const user = userEvent.setup();
    render(<AssumptionsSelector />);

    await user.click(screen.getByRole('button', { name: /Active assumptions:/ }));
    await user.click(screen.getByRole('menuitemradio', { name: 'Longtermist' }));

    expect(mockSetAllUserAssumptions).toHaveBeenCalledWith(curatedEntry.assumptions);
    expect(mockSetActiveSavedAssumptionsId).toHaveBeenCalledWith(curatedEntry.id);
    expect(mockMarkSavedAssumptionsLoaded).not.toHaveBeenCalled();
  });

  it('marks saved assumptions as loaded when a saved entry is selected', async () => {
    const user = userEvent.setup();
    render(<AssumptionsSelector />);

    await user.click(screen.getByRole('button', { name: /Active assumptions:/ }));
    await user.click(screen.getByRole('menuitemradio', { name: 'My Saved Assumptions' }));

    expect(mockSetAllUserAssumptions).toHaveBeenCalledWith(savedEntry.assumptions);
    expect(mockMarkSavedAssumptionsLoaded).toHaveBeenCalledWith(savedEntry.id);
    expect(mockSetActiveSavedAssumptionsId).toHaveBeenCalledWith(savedEntry.id);
  });

  it('opens the description modal when the description icon is clicked', async () => {
    const user = userEvent.setup();
    render(<AssumptionsSelector />);

    await user.click(screen.getByRole('button', { name: /Active assumptions:/ }));
    await user.click(screen.getByRole('button', { name: 'View description for Longtermist' }));

    expect(screen.getByRole('heading', { name: 'Longtermist' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Description:' })).toHaveTextContent('Looks far into the future.');
    expect(mockSetAllUserAssumptions).not.toHaveBeenCalled();
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
    await user.click(screen.getByRole('button', { name: 'View description for Custom (unsaved)' }));

    expect(screen.getByRole('heading', { name: 'Custom (unsaved)' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Description:' })).toHaveTextContent(
      'The active assumptions have been edited and no longer match a saved set of assumptions.'
    );
    expect(screen.getByRole('region', { name: 'Description:' })).toHaveTextContent(
      'If you want to reuse these exact assumptions later, click Save to save a local copy or click Share to create a link to these assumptions that you can share with others.'
    );
  });
});
