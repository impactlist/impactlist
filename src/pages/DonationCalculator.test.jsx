import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import DonationCalculator from './DonationCalculator';
import { AssumptionsProvider } from '../contexts/AssumptionsContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import GlobalNotificationBanner from '../components/shared/GlobalNotificationBanner';
import {
  calculateDonorStatsFromCombined,
  createCombinedAssumptions,
  createDefaultAssumptions,
} from '../utils/assumptionsDataHelpers';

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
      expect(screen.getByTestId('calculator-total-donated-value')).toHaveTextContent('$5,000');
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

  it('accepts its own persisted empty fields on the next visit', async () => {
    const allEmptyValues = Object.fromEntries(sortedCategories.map(({ id }) => [id, '']));
    localStorage.setItem('donationCalculatorValues', JSON.stringify(allEmptyValues));

    renderCalculator();

    expect(await screen.findByRole('heading', { name: 'Donation Calculator' })).toBeInTheDocument();
    expect(screen.queryByText("Some saved calculator data couldn't be loaded and was discarded.")).toBeNull();
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

  it('stays usable if localStorage is revoked after its availability probe', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const originalGetItem = globalThis.Storage.prototype.getItem;
    const originalSetItem = globalThis.Storage.prototype.setItem;
    const calculatorKeys = new Set(['donationCalculatorValues', 'specificDonations', 'categoryYear']);

    vi.spyOn(globalThis.Storage.prototype, 'getItem').mockImplementation(function (key) {
      if (this === localStorage && calculatorKeys.has(key)) {
        throw new globalThis.DOMException('Storage access was revoked', 'SecurityError');
      }
      return originalGetItem.call(this, key);
    });
    vi.spyOn(globalThis.Storage.prototype, 'setItem').mockImplementation(function (key, value) {
      if (this === localStorage && calculatorKeys.has(key)) {
        throw new globalThis.DOMException('Storage access was revoked', 'SecurityError');
      }
      return originalSetItem.call(this, key, value);
    });

    renderCalculator();

    expect(await screen.findByRole('heading', { name: 'Donation Calculator' })).toBeInTheDocument();
    expect(screen.getByText("Some saved calculator data couldn't be loaded and was discarded.")).toBeInTheDocument();
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

  it('discards malformed per-category values that would crash number-input rendering', async () => {
    localStorage.setItem(
      'donationCalculatorValues',
      JSON.stringify({
        [firstCategory.id]: { toString: null },
      })
    );

    renderCalculator();

    expect(
      await screen.findByText("Some saved calculator data couldn't be loaded and was discarded.")
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Donation Calculator' })).toBeInTheDocument();
    expect(screen.getByLabelText(firstCategory.name)).toHaveValue('');
  });

  it('resets an invalid persisted category year instead of passing it into calculations', async () => {
    localStorage.setItem('categoryYear', '9999oops');

    renderCalculator();

    expect(
      await screen.findByText("Some saved calculator data couldn't be loaded and was discarded.")
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Assumed year:')).toHaveValue(new Date().getFullYear());
    await waitFor(() => {
      expect(localStorage.getItem('categoryYear')).toBe(String(new Date().getFullYear()));
    });
  });

  it('drops malformed and duplicate specific donations while preserving a valid entry', async () => {
    const validDonation = {
      id: 'keep-once',
      recipientName: 'My Custom Charity',
      amount: 5000,
      date: '2024',
      isCustomRecipient: true,
      categoryId: firstCategory.id,
      customCostPerLife: 1000,
    };
    localStorage.setItem(
      'specificDonations',
      JSON.stringify([
        validDonation,
        { ...validDonation },
        { ...validDonation, id: 'bad-year', date: '2024junk' },
        { ...validDonation, id: 'bad-name', recipientName: { rendered: 'boom' } },
        { ...validDonation, id: 'bad-flag', isCustomRecipient: 'true' },
        { ...validDonation, id: 'bad-multiplier', customCostPerLife: null, multiplier: {} },
      ])
    );

    renderCalculator();

    expect(await screen.findByText('My Custom Charity')).toBeInTheDocument();
    expect(
      await screen.findByText("Some saved calculator data couldn't be loaded and was discarded.")
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem('specificDonations'))).toEqual([validDonation]);
    });
  });

  it('keeps every finite nonzero custom cost but drops zero costs and string amounts', async () => {
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
        {
          id: 'keep-tiny-cost',
          recipientName: 'Tiny Cost',
          amount: 5000,
          date: '2024',
          isCustomRecipient: true,
          categoryId: firstCategory.id,
          customCostPerLife: 5e-324,
        },
        {
          id: 'keep-huge-cost',
          recipientName: 'Huge Cost',
          amount: 5000,
          date: '2024',
          isCustomRecipient: true,
          categoryId: firstCategory.id,
          customCostPerLife: Number.MAX_VALUE,
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
      expect(stored.map(({ id }) => id)).toEqual(['keep-negative', 'keep-tiny-cost', 'keep-huge-cost']);
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

describe('DonationCalculator ranking', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('shows the mini ranking at the starting zero-lives rank before anything is donated', async () => {
    renderCalculator();

    expect(await screen.findByText('Your potential rank on Impact List')).toBeInTheDocument();

    const youRow = screen.getByText('You').closest('tr');
    expect(youRow).not.toBeNull();

    // Zero lives saved starts below every donor with non-negative lives
    // saved; donors with net-negative lives saved still rank below you.
    const donorStats = calculateDonorStatsFromCombined(createCombinedAssumptions(defaultAssumptions, null));
    const expectedRank = donorStats.filter((donor) => donor.totalLivesSaved >= 0).length + 1;
    expect(within(youRow).getByText(String(expectedRank))).toBeInTheDocument();
    expect(within(youRow).getByText('$0')).toBeInTheDocument();
    // Zero donated + zero lives renders the "no effect" cost sentinel.
    expect(within(youRow).getByText('∞')).toBeInTheDocument();
  });

  it('shows the two donors immediately below when the user ranks #1 (rank-3 off-by-one regression)', async () => {
    renderCalculator();

    const donorStats = calculateDonorStatsFromCombined(createCombinedAssumptions(defaultAssumptions, null));
    const combined = createCombinedAssumptions(defaultAssumptions, null);
    const currentYear = new Date().getFullYear();

    // Pick a cause that saves lives under default assumptions and donate
    // enough through it to outrank every real donor.
    const { getCostPerLifeFromCombined } = await import('../utils/assumptionsDataHelpers');
    const positiveCategory = sortedCategories.find((category) => {
      const costPerLife = getCostPerLifeFromCombined(combined, category.id, currentYear);
      return Number.isFinite(costPerLife) && costPerLife > 0;
    });
    expect(positiveCategory).toBeDefined();

    const costPerLife = getCostPerLifeFromCombined(combined, positiveCategory.id, currentYear);
    const livesToBeat = donorStats[0].totalLivesSaved * 2 + 10;
    const amount = Math.ceil(costPerLife * livesToBeat);

    const input = await screen.findByLabelText(positiveCategory.name);
    fireEvent.change(input, { target: { value: String(amount) } });

    const youRow = (await screen.findByText('You')).closest('tr');
    await waitFor(() => {
      expect(within(youRow).getByText('1')).toBeInTheDocument();
    });

    // Rank 2 must be the old #1 and rank 3 the old #2 — not the old #3.
    const rankTwoRow = screen.getByText(donorStats[0].name).closest('tr');
    expect(within(rankTwoRow).getByText('2')).toBeInTheDocument();
    const rankThreeRow = screen.getByText(donorStats[1].name).closest('tr');
    expect(within(rankThreeRow).getByText('3')).toBeInTheDocument();
  });
});

describe('DonationCalculator amount input', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('preserves an invalid decimal draft while keeping the last valid amount', async () => {
    renderCalculator();

    const input = await screen.findByLabelText(firstCategory.name);
    fireEvent.change(input, { target: { value: '1.5' } });
    expect(input).toHaveValue('1.5');

    fireEvent.change(input, { target: { value: '1.5.5' } });
    expect(input).toHaveValue('1.5.5');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('The previous amount is still included in the totals.');
    expect(screen.getByTestId('calculator-total-donated-value')).toHaveTextContent('$1.5');

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('donationCalculatorValues'));
      expect(stored[firstCategory.id]).toBe('1.5');
    });
  });

  it('rejects unsupported monetary text instead of silently changing its value', async () => {
    renderCalculator();

    const input = await screen.findByLabelText(firstCategory.name);

    // Negative category donations are unsupported. Reject the whole edit;
    // silently turning -100 into +100 reverses its meaning.
    fireEvent.change(input, { target: { value: '-100' } });
    expect(input).toHaveValue('-100');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).not.toHaveTextContent('previous amount');
    expect(screen.getByTestId('calculator-total-donated-value')).toHaveTextContent('$0');

    // Scientific notation previously became a different number (`1e309`
    // became 1,309) after unsupported characters were stripped.
    fireEvent.change(input, { target: { value: '1e309' } });
    expect(input).toHaveValue('1e309');
    expect(screen.getByTestId('calculator-total-donated-value')).toHaveTextContent('$0');

    // Misplaced grouping separators are equally ambiguous; do not guess that
    // 12,34 meant 1,234 or 1234.
    fireEvent.change(input, { target: { value: '12,34' } });
    expect(input).toHaveValue('12,34');
    expect(screen.getByTestId('calculator-total-donated-value')).toHaveTextContent('$0');

    // A conventional leading currency sign remains convenient to paste.
    fireEvent.change(input, { target: { value: '$1,234.56' } });
    expect(input).toHaveValue('1,234.56');
  });

  it('keeps the caret in place when editing inside a comma-formatted value', async () => {
    renderCalculator();

    const input = await screen.findByLabelText(firstCategory.name);
    fireEvent.change(input, { target: { value: '100000' } });
    expect(input).toHaveValue('100,000');

    // Type '2' after the leading '1' of "100,000" → "1,200,000" with the
    // caret still after the typed digit, not snapped to the end.
    input.focus();
    fireEvent.change(input, { target: { value: '1200,000', selectionStart: 2 } });
    expect(input).toHaveValue('1,200,000');
    await waitFor(() => {
      expect(input.selectionStart).toBe(3);
    });
    await waitFor(() => {
      expect(screen.getByTestId('calculator-total-donated-value')).toHaveTextContent('$1.20 M');
    });
  });

  it('accepts a typed replacement of several selected formatted digits', async () => {
    renderCalculator();

    const input = await screen.findByLabelText(firstCategory.name);
    fireEvent.change(input, { target: { value: '12345' } });
    expect(input).toHaveValue('12,345');

    // Selecting the final "345" and typing "6" produces the browser's
    // transient value "12,6". It is a direct edit of our formatted value, not
    // a malformed paste, and should therefore become 126.
    fireEvent.input(input, {
      target: { value: '12,6', selectionStart: 4 },
      inputType: 'insertText',
      data: '6',
    });

    expect(input).toHaveValue('126');
    await waitFor(() => {
      expect(screen.getByTestId('calculator-total-donated-value')).toHaveTextContent('$126');
    });
  });
});
