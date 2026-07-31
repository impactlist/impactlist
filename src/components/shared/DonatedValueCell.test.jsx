import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import DonatedValueCell from './DonatedValueCell';

describe('DonatedValueCell', () => {
  it('renders the donated amount with the percentage of net worth donated', () => {
    render(<DonatedValueCell totalDonated={500000000} netWorth={4000000000} />);

    expect(screen.getByText(/\$500 M/)).toBeInTheDocument();
    expect(screen.getByText('(13%)')).toBeInTheDocument();
  });

  it.each([
    ['zero', 0],
    ['negative', -1000000],
    ['NaN', NaN],
    ['Infinity', Infinity],
    ['undefined', undefined],
  ])('omits the percentage when net worth is %s', (_label, netWorth) => {
    render(<DonatedValueCell totalDonated={500000000} netWorth={netWorth} />);

    expect(screen.getByText(/\$500 M/)).toBeInTheDocument();
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });

  it('gives the amount the strong weight by default', () => {
    render(<DonatedValueCell totalDonated={500000000} netWorth={4000000000} />);

    expect(screen.getByText(/\$500 M/)).toHaveClass('text-strong');
    expect(screen.getByText('(13%)')).toHaveClass('text-muted');
  });

  it('swaps the strong weight onto the percentage when emphasizePercent is set', () => {
    render(<DonatedValueCell totalDonated={500000000} netWorth={4000000000} emphasizePercent />);

    expect(screen.getByText('(13%)')).toHaveClass('text-strong');
    expect(screen.getByText(/\$500 M/)).toHaveClass('text-muted');
  });

  it('keeps the amount strong under emphasizePercent when there is no percentage to emphasize', () => {
    render(<DonatedValueCell totalDonated={500000000} emphasizePercent />);

    expect(screen.getByText(/\$500 M/)).toHaveClass('text-strong');
  });
});
