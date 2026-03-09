import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EntityStatistics from './EntityStatistics';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

describe('EntityStatistics', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders donor age from the birth date on donor detail stats', () => {
    vi.setSystemTime(new Date('2026-03-09T12:00:00'));

    render(
      <MemoryRouter>
        <EntityStatistics
          entityType="donor"
          photoComponent={<div data-testid="photo" />}
          stats={{
            totalLivesSaved: 12.5,
            costPerLife: 1000,
            totalDonated: 25000,
            knownDonations: 25000,
            rank: 3,
            netWorth: 100000000,
            birthDate: '1973-03-26',
          }}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('52')).toBeInTheDocument();
  });

  it('does not render age when the birth date is invalid', () => {
    vi.setSystemTime(new Date('2026-03-09T12:00:00'));

    render(
      <MemoryRouter>
        <EntityStatistics
          entityType="donor"
          photoComponent={<div data-testid="photo" />}
          stats={{
            totalLivesSaved: 12.5,
            costPerLife: 1000,
            totalDonated: 25000,
            knownDonations: 25000,
            rank: 3,
            netWorth: 100000000,
            birthDate: '1973-02-31',
          }}
        />
      </MemoryRouter>
    );

    expect(screen.queryByText('Age')).not.toBeInTheDocument();
  });
});
