import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import EntityDonationTable from './EntityDonationTable';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

// Rows carry every column's sort value, exactly as DonorDetail/RecipientDetail
// build them (creditedAmount, totalLivesSaved, costPerLife).
const buildDonation = (overrides) => ({
  date: '2024-06-15',
  donorId: 'donor-a',
  donor: 'Donor A',
  recipientId: 'recipient-x',
  recipient: 'Recipient X',
  amount: 100,
  credit: 1,
  creditedAmount: 100,
  totalLivesSaved: 10,
  costPerLife: 100,
  source: 'https://example.org/source',
  ...overrides,
});

const renderTable = (donations, entityType = 'recipient') =>
  render(
    <MemoryRouter>
      <EntityDonationTable donations={donations} entityType={entityType} />
    </MemoryRouter>
  );

const dataRowTexts = () =>
  screen
    .getAllByRole('row')
    .slice(1) // drop the header row
    .map((row) => row.textContent);

describe('EntityDonationTable', () => {
  it('sorts by Cost/Life on recipient pages without crashing (regression: rows lacked the sort value)', async () => {
    const user = userEvent.setup();
    renderTable([
      buildDonation({ donor: 'Cheap Saver', costPerLife: 100, totalLivesSaved: 3 }),
      buildDonation({ donor: 'Pricey Saver', costPerLife: 5000, totalLivesSaved: 2 }),
      buildDonation({ donor: 'Harmful Giver', costPerLife: -50, totalLivesSaved: -1 }),
    ]);

    await user.click(screen.getByRole('button', { name: 'Sort by Cost/Life' }));

    // Descending cost per life follows the domain rule: negatives are worse
    // than any positive, then positives from most to least expensive.
    const rows = dataRowTexts();
    expect(rows[0]).toContain('Harmful Giver');
    expect(rows[1]).toContain('Pricey Saver');
    expect(rows[2]).toContain('Cheap Saver');
  });

  it('sorts the Amount column by the credited amount the cells display', async () => {
    const user = userEvent.setup();
    renderTable([
      buildDonation({ donor: 'Split Credit', amount: 400, credit: 0.5, creditedAmount: 200 }),
      buildDonation({ donor: 'Full Credit', amount: 300, credit: 1, creditedAmount: 300 }),
    ]);

    await user.click(screen.getByRole('button', { name: 'Sort by Amount' }));

    // Descending by displayed (credited) amount — raw amount would invert this.
    const rows = dataRowTexts();
    expect(rows[0]).toContain('Full Credit');
    expect(rows[1]).toContain('Split Credit');
  });

  it('renders the recorded calendar date, not the previous local day', () => {
    renderTable([buildDonation({ date: '2024-01-01' })]);

    // Date-only strings parse as UTC midnight; without UTC formatting a viewer
    // west of UTC would see "Dec 31, 2023".
    expect(screen.getByText('Jan 1, 2024')).toBeInTheDocument();
  });

  it('renders the synthetic Unknown donor row with ∞ and sorts it as costliest, not cheapest', async () => {
    const user = userEvent.setup();
    renderTable(
      [
        buildDonation({
          recipient: 'Cheap Recipient',
          categoryId: 'health',
          categoryName: 'Health',
          categoryCount: 1,
          costPerLife: 100,
          totalLivesSaved: 1,
        }),
        buildDonation({
          recipient: 'Pricey Recipient',
          categoryId: 'health',
          categoryName: 'Health',
          categoryCount: 1,
          costPerLife: 5000,
          totalLivesSaved: 0.02,
        }),
        // DonorDetail stores Infinity when known lives cancel to zero — the
        // sentinel must match the ∞ the cell displays, or the visibly
        // infinite row would sort as the cheapest.
        buildDonation({
          date: 'Unknown',
          recipientId: 'unknown',
          recipient: 'Unknown',
          amount: 5000000,
          creditedAmount: 5000000,
          categoryId: 'other',
          categoryName: 'Unknown',
          totalLivesSaved: 0,
          costPerLife: Infinity,
          source: '',
          isUnknown: true,
        }),
      ],
      'donor'
    );

    const unknownRow = screen.getAllByRole('row').find((row) => row.textContent.includes('∞'));
    expect(unknownRow).toBeDefined();
    expect(within(unknownRow).getAllByText('Unknown').length).toBeGreaterThan(0);

    // Descending cost per life: the ∞ row is the most expensive positive.
    await user.click(screen.getByRole('button', { name: 'Sort by Cost/Life' }));
    let rows = dataRowTexts();
    expect(rows[0]).toContain('∞');
    expect(rows[1]).toContain('Pricey Recipient');
    expect(rows[2]).toContain('Cheap Recipient');

    // Ascending: cheapest first, ∞ last.
    await user.click(screen.getByRole('button', { name: 'Sort by Cost/Life' }));
    rows = dataRowTexts();
    expect(rows[0]).toContain('Cheap Recipient');
    expect(rows[1]).toContain('Pricey Recipient');
    expect(rows[2]).toContain('∞');
  });
});
