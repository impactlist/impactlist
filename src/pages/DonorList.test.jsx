import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import DonorList from './DonorList';

const mockCombinedAssumptions = {
  getAllRecipients: () => [],
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
  calculateDonorStatsFromCombined: () => [
    {
      id: 'donor-1',
      rank: 1,
      name: 'Donor One',
      totalLivesSaved: 10,
      totalDonated: 1000,
      costPerLife: 100,
      netWorth: 1000000,
    },
    {
      id: 'donor-2',
      rank: 2,
      name: 'Donor Two',
      totalLivesSaved: 5,
      totalDonated: 500,
      costPerLife: 100,
      netWorth: 500000,
    },
  ],
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

const renderPage = () => {
  return render(
    <MemoryRouter>
      <DonorList />
    </MemoryRouter>
  );
};

describe('DonorList assumptions selector', () => {
  it('renders the shared assumptions selector above the donor table', () => {
    renderPage();

    expect(screen.getByTestId('assumptions-selector')).toBeInTheDocument();
    expect(screen.getByTestId('sortable-table')).toBeInTheDocument();
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
