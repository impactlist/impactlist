import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import DonorList from './DonorList';
import { NotificationProvider } from '../contexts/NotificationContext';
import GlobalNotificationBanner from '../components/shared/GlobalNotificationBanner';

const mockCombinedAssumptions = {
  getAllRecipients: () => [],
  getAllCategories: () => [
    { id: 'climate-change', name: 'Climate Change' },
    { id: 'global-health', name: 'Global Health' },
  ],
};

const donorOne = {
  id: 'donor-1',
  rank: 1,
  name: 'Donor One',
  totalLivesSaved: 10,
  totalDonated: 1000,
  costPerLife: 100,
  netWorth: 1000000,
};

const donorTwo = {
  id: 'donor-2',
  rank: 2,
  name: 'Donor Two',
  totalLivesSaved: 5,
  totalDonated: 500,
  costPerLife: 100,
  netWorth: 500000,
};

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

vi.mock('../components/shared/SortableTable', () => ({
  default: ({ data, emptyMessage }) => (
    <div data-testid="sortable-table">
      {data.length === 0 && emptyMessage}
      {data.map((donor) => (
        <div key={donor.id}>{donor.name}</div>
      ))}
    </div>
  ),
}));

vi.mock('../components/shared/DonorPhoto', () => ({
  default: () => <div data-testid="donor-photo" />,
}));

vi.mock('../contexts/AssumptionsContext', () => ({
  useAssumptions: () => ({
    combinedAssumptions: mockCombinedAssumptions,
  }),
}));

vi.mock('../utils/assumptionsDataHelpers', () => ({
  calculateDonorStatsFromCombined: (_combinedAssumptions, { categoryIds } = {}) =>
    categoryIds?.includes('global-health') ? [{ ...donorTwo, rank: 1 }] : [donorOne, donorTwo],
  getCostPerLifeForRecipientFromCombined: () => 100,
  calculateLivesSavedForDonationFromCombined: () => 1,
}));

vi.mock('../utils/donationDataHelpers', () => ({
  getPrimaryCategoryId: () => 'health',
  getDonationsForRecipient: () => [],
  getTotalAmountForRecipient: () => 0,
  getCurrentYear: () => 2026,
}));

vi.mock('../components/shared/AssumptionsSelector', () => ({
  default: () => <div data-testid="assumptions-selector" />,
}));

const LocationProbe = () => {
  const location = useLocation();
  return <output data-testid="location">{`${location.pathname}${location.search}`}</output>;
};

const renderPage = (initialEntry = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <NotificationProvider>
        <GlobalNotificationBanner />
        <DonorList />
        <LocationProbe />
      </NotificationProvider>
    </MemoryRouter>
  );
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('DonorList assumptions selector', () => {
  it('renders the shared assumptions selector above the donor table', () => {
    renderPage();

    expect(screen.getByTestId('assumptions-selector')).toBeInTheDocument();
    expect(screen.getByTestId('sortable-table')).toBeInTheDocument();
  });

  it('does not change the source-page scroll position before opening the calculator', async () => {
    const user = userEvent.setup();
    const scrollSpy = vi.spyOn(window, 'scrollTo');
    renderPage();

    await user.click(screen.getByRole('link', { name: /Calculate the lives you could save/i }));

    expect(scrollSpy).not.toHaveBeenCalled();
  });
});

describe('DonorList search', () => {
  it('filters donors by name, case-insensitively', async () => {
    const user = userEvent.setup();
    renderPage();

    expect(screen.getByText('Donor One')).toBeInTheDocument();
    expect(screen.getByText('Donor Two')).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('Search donors...'), 'two');

    expect(screen.queryByText('Donor One')).not.toBeInTheDocument();
    expect(screen.getByText('Donor Two')).toBeInTheDocument();
  });

  it('ignores surrounding whitespace in the search query', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText('Search donors...'), '  two  ');

    expect(screen.queryByText('Donor One')).not.toBeInTheDocument();
    expect(screen.getByText('Donor Two')).toBeInTheDocument();
  });

  it('shows an empty state when no donors match', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText('Search donors...'), 'zzz');

    expect(screen.getByText('No donors match your search.')).toBeInTheDocument();
    expect(screen.queryByText('Donor One')).not.toBeInTheDocument();
    expect(screen.queryByText('Donor Two')).not.toBeInTheDocument();
  });

  it('restores the full list when the search is cleared', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText('Search donors...'), 'two');
    expect(screen.queryByText('Donor One')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(screen.getByText('Donor One')).toBeInTheDocument();
    expect(screen.getByText('Donor Two')).toBeInTheDocument();
  });
});

describe('DonorList cause scope', () => {
  it('loads a scoped ranking from the URL and explains the data boundary', () => {
    renderPage('/?causes=global-health');

    expect(screen.queryByText('Donor One')).not.toBeInTheDocument();
    expect(screen.getByText('Donor Two')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Active cause scope' })).toHaveTextContent('Global Health');
  });

  it('applies a cause selection to the URL and restores all causes from the scope summary', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: 'Cause scope. Current selection: All causes' }));
    await user.click(screen.getByRole('button', { name: 'Clear' }));
    await user.click(screen.getByRole('checkbox', { name: 'Global Health' }));
    await user.click(screen.getByRole('button', { name: 'Apply scope' }));

    expect(screen.getByTestId('location')).toHaveTextContent('/?causes=global-health');
    expect(screen.queryByText('Donor One')).not.toBeInTheDocument();
    expect(screen.getByText('Donor Two')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Switch to all causes' }));

    expect(screen.getByTestId('location')).toHaveTextContent('/');
    expect(screen.getByText('Donor One')).toBeInTheDocument();
  });

  it('explains and removes an invalid-only cause scope from a stale link', async () => {
    const user = userEvent.setup();
    renderPage('/?shared=example&causes=stale-id');

    const noticeText = await screen.findByText(
      'That link does not match any current cause areas, so the all-cause ranking is shown instead.'
    );
    const notice = noticeText.closest('[role="status"]');
    expect(notice).toBeInTheDocument();
    expect(screen.getByText('Donor One')).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Active cause scope' })).not.toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('/?shared=example');
    });

    await user.click(within(notice).getByRole('button', { name: 'Dismiss notification' }));
    expect(notice).not.toBeInTheDocument();
  });
});
