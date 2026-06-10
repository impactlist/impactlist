import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import DonationCalculator from './DonationCalculator';
import { AssumptionsProvider } from '../contexts/AssumptionsContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import GlobalNotificationBanner from '../components/shared/GlobalNotificationBanner';
import { createDefaultAssumptions } from '../utils/assumptionsDataHelpers';

/* global localStorage, sessionStorage */

const defaultAssumptions = createDefaultAssumptions();
const sortedCategories = Object.entries(defaultAssumptions.categories)
  .map(([id, category]) => ({ id, name: category.name }))
  .sort((a, b) => a.name.localeCompare(b.name));
const firstCategory = sortedCategories[0];

const renderCalculator = () =>
  render(
    <NotificationProvider>
      <AssumptionsProvider>
        <MemoryRouter>
          <GlobalNotificationBanner />
          <DonationCalculator />
        </MemoryRouter>
      </AssumptionsProvider>
    </NotificationProvider>
  );

describe('DonationCalculator persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('restores saved category donation values from localStorage', async () => {
    localStorage.setItem('donationCalculatorValues', JSON.stringify({ [firstCategory.id]: '5,000' }));

    renderCalculator();

    await waitFor(() => {
      expect(screen.getByLabelText(firstCategory.name)).toHaveValue('5,000');
    });
  });

  it('persists typed category donation values to localStorage', async () => {
    renderCalculator();

    const input = await screen.findByLabelText(firstCategory.name);
    fireEvent.change(input, { target: { value: '1000' } });

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('donationCalculatorValues'));
      expect(stored[firstCategory.id]).toMatch(/1,?000/);
    });
  });

  it('restores saved specific donations from localStorage', async () => {
    localStorage.setItem(
      'specificDonations',
      JSON.stringify([
        {
          id: 'test-donation-1',
          recipientName: 'My Custom Charity',
          amount: 5000,
          date: '2024',
          isCustomRecipient: true,
          categoryId: firstCategory.id,
          customCostPerLife: 1000,
        },
      ])
    );

    renderCalculator();

    expect(await screen.findByText('My Custom Charity')).toBeInTheDocument();
  });

  it('discards corrupted category values, clears the key, and notifies instead of crashing', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem('donationCalculatorValues', 'not-json{{{');

    renderCalculator();

    expect(await screen.findByText('Saved calculator data was corrupted and has been reset.')).toBeInTheDocument();
    // The corrupted value is discarded; the save effect then re-persists a
    // clean empty state, so the key must hold valid JSON with no amounts.
    const stored = JSON.parse(localStorage.getItem('donationCalculatorValues'));
    expect(Object.values(stored).every((value) => value === '')).toBe(true);
    expect(screen.getByRole('heading', { name: 'Donation Calculator' })).toBeInTheDocument();
    expect(errorSpy).toHaveBeenCalled();
  });

  it('discards corrupted specific donations, clears the key, and notifies instead of crashing', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem('specificDonations', '[broken');

    renderCalculator();

    expect(await screen.findByText('Saved calculator data was corrupted and has been reset.')).toBeInTheDocument();
    // Discarded, then re-persisted as a clean empty list by the save effect.
    expect(JSON.parse(localStorage.getItem('specificDonations'))).toEqual([]);
    expect(screen.getByRole('heading', { name: 'Donation Calculator' })).toBeInTheDocument();
    expect(errorSpy).toHaveBeenCalled();
  });
});
