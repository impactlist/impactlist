import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import MiniImpactList from './MiniImpactList';

const renderList = (neighboringDonors) =>
  render(
    <MemoryRouter>
      <MiniImpactList
        donorRank={1}
        totalLivesSaved={0}
        totalDonated={0}
        costPerLife={Infinity}
        neighboringDonors={neighboringDonors}
      />
    </MemoryRouter>
  );

describe('MiniImpactList', () => {
  it('renders the current user without crashing when the donor list is empty', () => {
    renderList({ above: null, below: null, twoBelow: null, twoAbove: null });

    expect(screen.getByText('You')).toBeInTheDocument();
    expect(screen.getByText('Unknown')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(2);
  });

  it('renders as many neighboring rows as are available', () => {
    renderList({
      above: null,
      below: {
        id: 'only-donor',
        name: 'Only Donor',
        totalLivesSaved: 10,
        totalDonated: 1000,
        costPerLife: 100,
        netWorth: 5000,
      },
      twoBelow: null,
      twoAbove: null,
    });

    expect(screen.getByRole('link', { name: 'Only Donor' })).toHaveAttribute('href', '/donor/only-donor');
    expect(screen.getAllByRole('row')).toHaveLength(3);
  });

  it('shows the shared donor explanations for lives saved and cost per life', async () => {
    const user = userEvent.setup();
    renderList({ above: null, below: null, twoBelow: null, twoAbove: null });

    await user.hover(screen.getByRole('button', { name: 'About Lives Saved' }));
    expect(await screen.findByRole('tooltip')).toHaveTextContent(
      'We first calculate the expected lives saved for each donation a person has made'
    );

    await user.unhover(screen.getByRole('button', { name: 'About Lives Saved' }));
    await user.hover(screen.getByRole('button', { name: 'About Cost/Life' }));
    expect(await screen.findByRole('tooltip')).toHaveTextContent(
      'Cost/Life is the amount donated divided by the lives saved'
    );
  });
});
