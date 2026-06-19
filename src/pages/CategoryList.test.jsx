import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CategoryList from './CategoryList';

const mockCombinedAssumptions = {
  getAllCategories: () => [
    {
      id: 'global-health',
      name: 'Global Health',
    },
    {
      id: 'animal-welfare',
      name: 'Animal Welfare',
    },
  ],
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
      {data.map((category) => (
        <div key={category.id}>{category.name}</div>
      ))}
    </div>
  ),
}));

vi.mock('../components/shared/AssumptionsSelector', () => ({
  default: () => <div data-testid="assumptions-selector" />,
}));

vi.mock('../contexts/AssumptionsContext', () => ({
  useAssumptions: () => ({
    combinedAssumptions: mockCombinedAssumptions,
  }),
}));

vi.mock('../utils/assumptionsDataHelpers', () => ({
  getCostPerLifeFromCombined: () => 100,
  calculateCategoryBreakdownForDonationFromCombined: () => [],
}));

vi.mock('../utils/donationDataHelpers', () => ({
  getDonationsForRecipient: () => [],
  getRecipientId: (recipient) => recipient.id,
  getCurrentYear: () => 2026,
}));

const renderPage = () => {
  return render(
    <MemoryRouter>
      <CategoryList />
    </MemoryRouter>
  );
};

describe('CategoryList search', () => {
  it('renders the shared assumptions selector above the causes table', () => {
    renderPage();

    expect(screen.getByTestId('assumptions-selector')).toBeInTheDocument();
    expect(screen.getByTestId('sortable-table')).toBeInTheDocument();
  });

  it('filters causes by name, case-insensitively', async () => {
    const user = userEvent.setup();
    renderPage();

    expect(screen.getByText('Global Health')).toBeInTheDocument();
    expect(screen.getByText('Animal Welfare')).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('Search causes...'), 'animal');

    expect(screen.queryByText('Global Health')).not.toBeInTheDocument();
    expect(screen.getByText('Animal Welfare')).toBeInTheDocument();
  });

  it('ignores surrounding whitespace in the search query', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText('Search causes...'), '  health  ');

    expect(screen.getByText('Global Health')).toBeInTheDocument();
    expect(screen.queryByText('Animal Welfare')).not.toBeInTheDocument();
  });

  it('shows an empty state when no causes match', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText('Search causes...'), 'zzz');

    expect(screen.getByText('No causes match your search.')).toBeInTheDocument();
    expect(screen.queryByText('Global Health')).not.toBeInTheDocument();
    expect(screen.queryByText('Animal Welfare')).not.toBeInTheDocument();
  });

  it('restores the full list when the search is cleared', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText('Search causes...'), 'animal');
    expect(screen.queryByText('Global Health')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(screen.getByText('Global Health')).toBeInTheDocument();
    expect(screen.getByText('Animal Welfare')).toBeInTheDocument();
  });
});
