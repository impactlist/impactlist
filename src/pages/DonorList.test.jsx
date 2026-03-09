import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
  default: () => <div data-testid="sortable-table" />,
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
