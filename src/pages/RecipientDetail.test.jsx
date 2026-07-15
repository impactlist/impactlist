import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RecipientDetail from './RecipientDetail';
import { AssumptionsProvider } from '../contexts/AssumptionsContext';
import { NotificationProvider } from '../contexts/NotificationContext';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Capture the rows RecipientDetail hands to the donation table: the table
// sorts by the values its cells display, so every row must carry them.
const capturedTableProps = [];
vi.mock('../components/entity/EntityDonationTable', () => ({
  default: (props) => {
    capturedTableProps.push(props);
    return <div data-testid="donation-table" />;
  },
}));
vi.mock('../components/entity/EntityChartSection', () => ({
  default: () => <div data-testid="chart-section" />,
}));
vi.mock('../components/shared/SampleDonationCalculator', () => ({
  default: () => <div data-testid="sample-calculator" />,
}));
vi.mock('../components/shared/MarkdownContent', () => ({
  default: () => <div data-testid="markdown-content" />,
}));
vi.mock('../components/shared/AssumptionsSelector', () => ({
  default: () => <div data-testid="assumptions-selector" />,
}));

const renderPage = (recipientId) =>
  render(
    <NotificationProvider>
      <AssumptionsProvider>
        <MemoryRouter initialEntries={[`/recipient/${recipientId}`]}>
          <Routes>
            <Route path="/recipient/:recipientId" element={<RecipientDetail />} />
          </Routes>
        </MemoryRouter>
      </AssumptionsProvider>
    </NotificationProvider>
  );

describe('RecipientDetail', () => {
  beforeEach(() => {
    capturedTableProps.length = 0;
  });

  it('supplies the donation table with every sortable value per row (Cost/Life sort crash regression)', () => {
    renderPage('good-ventures');

    expect(screen.getByTestId('donation-table')).toBeInTheDocument();
    const { donations } = capturedTableProps.at(-1);
    expect(donations.length).toBeGreaterThan(0);
    for (const row of donations) {
      // costPerLife may legitimately be negative or Infinity, but never
      // missing or NaN — SortableTable throws if no row has the sort value.
      expect(typeof row.costPerLife).toBe('number');
      expect(Number.isNaN(row.costPerLife)).toBe(false);
      expect(typeof row.creditedAmount).toBe('number');
      expect(typeof row.totalLivesSaved).toBe('number');
    }
  });

  it('renders NotFound for an unknown recipient id', () => {
    renderPage('no-such-recipient');

    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });
});
