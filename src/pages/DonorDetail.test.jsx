import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DonorDetail from './DonorDetail';
import { AssumptionsProvider } from '../contexts/AssumptionsContext';
import { NotificationProvider } from '../contexts/NotificationContext';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

vi.mock('../components/entity/EntityStatistics', () => ({
  default: () => <div data-testid="entity-statistics" />,
}));
vi.mock('../components/shared/DonorPhoto', () => ({
  default: () => <div data-testid="donor-photo" />,
}));
vi.mock('../components/shared/AssumptionsSelector', () => ({
  default: () => <div data-testid="assumptions-selector" />,
}));
vi.mock('../components/shared/MarkdownContent', () => ({
  default: ({ content, className }) => (content ? <div className={className} data-testid="markdown-content" /> : null),
}));
vi.mock('../components/entity/EntityChartSection', () => ({
  default: () => <div data-testid="chart-section" />,
}));
vi.mock('../components/charts/ImpactBarChart', () => ({
  ImpactChartToggle: () => <div data-testid="chart-toggle" />,
}));
vi.mock('../hooks/useCategoryChartData', () => ({
  default: (() => {
    const singleCauseData = [{ categoryId: 'ai-risk', name: 'AI Existential Risk' }];
    return () => singleCauseData;
  })(),
}));

const capturedTableProps = [];
vi.mock('../components/entity/EntityDonationTable', () => ({
  default: (props) => {
    capturedTableProps.push(props);
    return <div data-testid="donation-table" />;
  },
}));

const renderPage = () =>
  render(
    <NotificationProvider>
      <AssumptionsProvider>
        <MemoryRouter initialEntries={['/donor/ben-hoskin']}>
          <Routes>
            <Route path="/donor/:donorId" element={<DonorDetail />} />
          </Routes>
        </MemoryRouter>
      </AssumptionsProvider>
    </NotificationProvider>
  );

describe('DonorDetail', () => {
  beforeEach(() => {
    capturedTableProps.length = 0;
  });

  it('keeps space before donation history when the donor has only one cause area', () => {
    renderPage();

    expect(screen.queryByTestId('chart-section')).not.toBeInTheDocument();
    expect(screen.getByTestId('donation-table')).toBeInTheDocument();
    expect(capturedTableProps.at(-1).className).toContain('mt-8');
  });
});
