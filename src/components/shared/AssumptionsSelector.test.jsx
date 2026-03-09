import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AssumptionsSelector from './AssumptionsSelector';

const mockSetAllUserAssumptions = vi.fn();
const mockMarkSavedAssumptionsLoaded = vi.fn();
const mockSetActiveSavedAssumptionsId = vi.fn();

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
    getNormalizedUserAssumptionsForSharing: () => null,
    isUsingCustomValues: false,
    setAllUserAssumptions: mockSetAllUserAssumptions,
  }),
}));

vi.mock('../../utils/curatedAssumptionsProfiles', () => ({
  getCuratedAssumptionsEntries: () => [curatedEntry],
  isCuratedAssumptionsEntryId: (id) => id === curatedEntry.id,
}));

vi.mock('../../utils/savedAssumptionsStore', () => ({
  createComparableAssumptionsFingerprint: (assumptions) => JSON.stringify(assumptions || null),
  getActiveSavedAssumptionsId: () => null,
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
  });

  it('renders the assumptions trigger', () => {
    render(<AssumptionsSelector />);

    expect(screen.getByRole('button', { name: /Using assumptions:/ })).toBeInTheDocument();
  });

  it('applies curated assumptions when selected', async () => {
    const user = userEvent.setup();
    render(<AssumptionsSelector />);

    await user.click(screen.getByRole('button', { name: /Using assumptions:/ }));
    await user.click(screen.getByRole('menuitemradio', { name: 'Longtermist' }));

    expect(mockSetAllUserAssumptions).toHaveBeenCalledWith(curatedEntry.assumptions);
    expect(mockSetActiveSavedAssumptionsId).toHaveBeenCalledWith(curatedEntry.id);
    expect(mockMarkSavedAssumptionsLoaded).not.toHaveBeenCalled();
  });

  it('marks saved assumptions as loaded when a saved entry is selected', async () => {
    const user = userEvent.setup();
    render(<AssumptionsSelector />);

    await user.click(screen.getByRole('button', { name: /Using assumptions:/ }));
    await user.click(screen.getByRole('menuitemradio', { name: 'My Saved Assumptions' }));

    expect(mockSetAllUserAssumptions).toHaveBeenCalledWith(savedEntry.assumptions);
    expect(mockMarkSavedAssumptionsLoaded).toHaveBeenCalledWith(savedEntry.id);
    expect(mockSetActiveSavedAssumptionsId).toHaveBeenCalledWith(savedEntry.id);
  });

  it('opens the description modal when the description icon is clicked', async () => {
    const user = userEvent.setup();
    render(<AssumptionsSelector />);

    await user.click(screen.getByRole('button', { name: /Using assumptions:/ }));
    await user.click(screen.getByRole('button', { name: 'View description for Longtermist' }));

    expect(screen.getByRole('heading', { name: 'Longtermist' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Description:' })).toHaveTextContent('Looks far into the future.');
    expect(mockSetAllUserAssumptions).not.toHaveBeenCalled();
  });
});
