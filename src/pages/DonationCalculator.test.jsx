import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
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

  it('treats a zero category amount as cleared instead of crashing', async () => {
    renderCalculator();

    const input = await screen.findByLabelText(firstCategory.name);
    fireEvent.change(input, { target: { value: '1000' } });

    await waitFor(() => {
      expect(screen.getByTestId('calculator-total-donated-value')).toHaveTextContent('$1,000');
    });

    // Typing 0 over an existing value clears the field's contribution.
    fireEvent.change(input, { target: { value: '0' } });

    await waitFor(() => {
      expect(screen.getByTestId('calculator-total-donated-value')).toHaveTextContent('$0');
    });
    expect(screen.getByRole('heading', { name: 'Donation Calculator' })).toBeInTheDocument();
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

  it('asks for confirmation before clearing all specific donations', async () => {
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

    fireEvent.click(screen.getByRole('button', { name: /clear all/i }));
    expect(await screen.findByText('Clear all specific donations?')).toBeInTheDocument();

    // Cancel keeps the donation (both in the UI and in storage).
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => {
      expect(screen.queryByText('Clear all specific donations?')).not.toBeInTheDocument();
    });
    expect(screen.getByText('My Custom Charity')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('specificDonations'))).toHaveLength(1);

    // Confirming clears the table and persists the empty list. (The dialog's
    // confirm button shares its label with the table's trigger, so scope to
    // the dialog.)
    fireEvent.click(screen.getByRole('button', { name: /clear all/i }));
    const dialog = await screen.findByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Clear All' }));

    await waitFor(() => {
      expect(screen.queryByText('My Custom Charity')).not.toBeInTheDocument();
    });
    expect(JSON.parse(localStorage.getItem('specificDonations'))).toEqual([]);
  });

  it('discards corrupted category values, clears the key, and notifies instead of crashing', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem('donationCalculatorValues', 'not-json{{{');

    renderCalculator();

    expect(
      await screen.findByText("Some saved calculator data couldn't be loaded and was discarded.")
    ).toBeInTheDocument();
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

    expect(
      await screen.findByText("Some saved calculator data couldn't be loaded and was discarded.")
    ).toBeInTheDocument();
    // Discarded, then re-persisted as a clean empty list by the save effect.
    expect(JSON.parse(localStorage.getItem('specificDonations'))).toEqual([]);
    expect(screen.getByRole('heading', { name: 'Donation Calculator' })).toBeInTheDocument();
    expect(errorSpy).toHaveBeenCalled();
  });

  it('discards parseable-but-wrong-shape persisted state instead of crashing', async () => {
    // Valid JSON, wrong shape: a non-array specificDonations (would hit
    // `.forEach`) and a non-object donations map. Both must be discarded, not
    // crash the totals calculation.
    localStorage.setItem('specificDonations', JSON.stringify({ not: 'an array' }));
    localStorage.setItem('donationCalculatorValues', JSON.stringify(['wrong', 'shape']));

    renderCalculator();

    expect(
      await screen.findByText("Some saved calculator data couldn't be loaded and was discarded.")
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Donation Calculator' })).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('specificDonations'))).toEqual([]);
    // The wrong-shape category map is also discarded and re-persisted as a clean
    // empty map (no amounts), same as the unparseable case above.
    const storedDonations = JSON.parse(localStorage.getItem('donationCalculatorValues'));
    expect(Object.values(storedDonations).every((value) => value === '')).toBe(true);
  });

  it('keeps a negative custom cost per life but drops zero cost and string amounts', async () => {
    // Cost per life can be negative (donations that cause deaths) — that entry
    // must survive. A zero cost (divides to infinite impact) and a string amount
    // (would concatenate into the running total) must be dropped.
    localStorage.setItem(
      'specificDonations',
      JSON.stringify([
        {
          id: 'keep-negative',
          recipientName: 'Harmful Charity',
          amount: 5000,
          date: '2024',
          isCustomRecipient: true,
          categoryId: firstCategory.id,
          customCostPerLife: -2000,
        },
        {
          id: 'drop-zero-cost',
          recipientName: 'Zero Cost',
          amount: 5000,
          date: '2024',
          isCustomRecipient: true,
          categoryId: firstCategory.id,
          customCostPerLife: 0,
        },
        {
          id: 'drop-string-amount',
          recipientName: 'String Amount',
          amount: '5000',
          date: '2024',
          isCustomRecipient: true,
          categoryId: firstCategory.id,
          customCostPerLife: 1000,
        },
      ])
    );

    renderCalculator();

    expect(await screen.findByText('Harmful Charity')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Donation Calculator' })).toBeInTheDocument();
    expect(
      await screen.findByText("Some saved calculator data couldn't be loaded and was discarded.")
    ).toBeInTheDocument();

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('specificDonations'));
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe('keep-negative');
    });
  });

  it('drops specific donations that can no longer be computed (missing date / stale recipient) and keeps the rest', async () => {
    localStorage.setItem(
      'specificDonations',
      JSON.stringify([
        // Valid — survives.
        {
          id: 'keep',
          recipientName: 'My Custom Charity',
          amount: 5000,
          date: '2024',
          isCustomRecipient: true,
          categoryId: firstCategory.id,
          customCostPerLife: 1000,
        },
        // Missing date — would throw in getDonationYear.
        {
          id: 'drop-no-date',
          recipientName: 'My Custom Charity',
          amount: 5000,
          isCustomRecipient: true,
          categoryId: firstCategory.id,
          customCostPerLife: 1000,
        },
        // Existing-recipient reference that no longer resolves — would throw.
        {
          id: 'drop-stale-recipient',
          recipientName: 'A Charity That No Longer Exists In The Data',
          amount: 5000,
          date: '2024',
        },
      ])
    );

    renderCalculator();

    // The valid donation renders; the page does not crash.
    expect(await screen.findByText('My Custom Charity')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Donation Calculator' })).toBeInTheDocument();
    expect(
      await screen.findByText("Some saved calculator data couldn't be loaded and was discarded.")
    ).toBeInTheDocument();

    // The save effect re-persists only the usable donation.
    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('specificDonations'));
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe('keep');
    });
  });
});
