import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SpecificDonationModal from './SpecificDonationModal';

const mockCombinedAssumptions = {
  globalParameters: { yearsPerLife: 50 },
  getAllRecipients: () => [{ id: 'amf', name: 'Against Malaria Foundation' }],
  getAllCategories: () => [
    { id: 'health', name: 'Global Health' },
    { id: 'animal', name: 'Animal Welfare' },
  ],
};

const mockGetCostPerLifeFromCombined = vi.fn();
const mockGetCostPerLifeForRecipientFromCombined = vi.fn();

vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }) => children,
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

vi.mock('../contexts/AssumptionsContext', () => ({
  useAssumptions: () => ({
    combinedAssumptions: mockCombinedAssumptions,
  }),
}));

vi.mock('../utils/donationDataHelpers', () => ({
  getRecipientId: (recipient) => recipient.id,
  getCurrentYear: () => 2026,
  MIN_CALCULATOR_DONATION_YEAR: 1900,
  parseCalculatorDonationYear: (value) => {
    if (typeof value !== 'string' || !/^\d{4}$/.test(value)) return null;
    const year = Number(value);
    return year >= 1900 && year <= 2026 ? year : null;
  },
}));

vi.mock('../utils/assumptionsDataHelpers', () => ({
  getCostPerLifeFromCombined: (...args) => mockGetCostPerLifeFromCombined(...args),
  getCostPerLifeForRecipientFromCombined: (...args) => mockGetCostPerLifeForRecipientFromCombined(...args),
}));

describe('SpecificDonationModal', () => {
  beforeEach(() => {
    mockGetCostPerLifeFromCombined.mockImplementation((_combinedAssumptions, categoryId) => {
      if (categoryId === 'health') return 5000;
      if (categoryId === 'animal') return 2000;
      return 1000;
    });
    mockGetCostPerLifeForRecipientFromCombined.mockReturnValue(4000);
  });

  it('prefills custom recipient cost per life from the selected cause', async () => {
    const user = userEvent.setup();

    render(<SpecificDonationModal isOpen={true} onClose={vi.fn()} onSave={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'New Recipient' }));
    await user.selectOptions(screen.getByLabelText('Cause'), 'health');

    await waitFor(() => {
      expect(screen.getByLabelText('Cost per life')).toHaveValue('5,000');
    });
  });

  it('saves custom recipients with customCostPerLife instead of multiplier', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const onClose = vi.fn();

    render(<SpecificDonationModal isOpen={true} onClose={onClose} onSave={onSave} />);

    await user.click(screen.getByRole('button', { name: 'New Recipient' }));
    await user.type(screen.getByLabelText('Recipient Name'), 'Custom Recipient');
    await user.selectOptions(screen.getByLabelText('Cause'), 'health');
    await user.clear(screen.getByLabelText('Cost per life'));
    await user.type(screen.getByLabelText('Cost per life'), '7500');
    await user.type(screen.getByLabelText('Donation Amount'), '1000');
    await user.click(screen.getByRole('button', { name: 'Add Donation' }));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        recipientName: 'Custom Recipient',
        categoryId: 'health',
        isCustomRecipient: true,
        amount: 1000,
        date: '2026',
        customCostPerLife: 7500,
      })
    );
    expect(onSave.mock.calls[0][0]).not.toHaveProperty('multiplier');
    expect(onClose).toHaveBeenCalled();
  });

  it('clears the selected recipient when the search text is edited afterwards', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(<SpecificDonationModal isOpen={true} onClose={vi.fn()} onSave={onSave} />);

    const search = screen.getByLabelText('Search for a recipient');
    await user.type(search, 'Against');
    await user.click(await screen.findByRole('option', { name: 'Against Malaria Foundation' }));
    expect(search).toHaveValue('Against Malaria Foundation');

    // Editing the text after selecting must invalidate the selection —
    // submitting used to save the donation to the previously selected
    // recipient even though the box showed different text.
    await user.type(search, ' extra');
    await user.type(screen.getByLabelText('Donation Amount'), '100');
    await user.click(screen.getByRole('button', { name: 'Add Donation' }));

    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByText('Please select a recipient')).toBeInTheDocument();
  });

  it('rejects amounts that parse to Infinity instead of saving them', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(<SpecificDonationModal isOpen={true} onClose={vi.fn()} onSave={onSave} />);

    const search = screen.getByLabelText('Search for a recipient');
    await user.type(search, 'Against');
    await user.click(await screen.findByRole('option', { name: 'Against Malaria Foundation' }));

    await user.type(screen.getByLabelText('Donation Amount'), '1e999');
    await user.click(screen.getByRole('button', { name: 'Add Donation' }));

    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByText('Please enter a valid amount')).toBeInTheDocument();
  });

  it('rejects malformed grouping without imposing a finite amount ceiling', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(<SpecificDonationModal isOpen={true} onClose={vi.fn()} onSave={onSave} />);

    const search = screen.getByLabelText('Search for a recipient');
    await user.type(search, 'Against');
    await user.click(await screen.findByRole('option', { name: 'Against Malaria Foundation' }));

    const amountInput = screen.getByLabelText('Donation Amount');
    amountInput.focus();
    fireEvent.input(amountInput, { target: { value: '12,34' }, inputType: 'insertFromPaste' });
    expect(amountInput).toHaveValue('12,34');
    await user.click(screen.getByRole('button', { name: 'Add Donation' }));
    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByText('Please enter a valid amount')).toBeInTheDocument();

    await user.clear(amountInput);
    fireEvent.input(amountInput, { target: { value: '1e20' }, inputType: 'insertFromPaste' });
    expect(amountInput).toHaveValue('1e20');
    await user.click(screen.getByRole('button', { name: 'Add Donation' }));

    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ amount: 1e20 }));
  });

  it('prefills a rounded cost per life instead of raw float dust, and leaves ∞ empty', async () => {
    mockGetCostPerLifeFromCombined.mockImplementation((_combinedAssumptions, categoryId) => {
      if (categoryId === 'health') return 1935.5625942879883;
      if (categoryId === 'animal') return Infinity;
      return 1000;
    });
    const user = userEvent.setup();

    render(<SpecificDonationModal isOpen={true} onClose={vi.fn()} onSave={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'New Recipient' }));
    await user.selectOptions(screen.getByLabelText('Cause'), 'health');
    await waitFor(() => {
      expect(screen.getByLabelText('Cost per life')).toHaveValue('1,935.56');
    });

    // An infinite default ("no effect") must not prefill the literal string
    // "Infinity" — the field stays empty for the user to fill in.
    await user.selectOptions(screen.getByLabelText('Cause'), 'animal');
    await waitFor(() => {
      expect(screen.getByLabelText('Cost per life')).toHaveValue('');
    });
  });

  it('suppresses previews for invalid custom costs instead of showing ∞ or default-cost lives', async () => {
    const user = userEvent.setup();

    render(<SpecificDonationModal isOpen={true} onClose={vi.fn()} onSave={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'New Recipient' }));
    await user.selectOptions(screen.getByLabelText('Cause'), 'health');
    await user.type(screen.getByLabelText('Donation Amount'), '1000');

    // Valid prefill (5000): the preview and the readout agree.
    expect(await screen.findByText(/Estimated lives saved/)).toBeInTheDocument();
    expect(screen.getByText(/Recipient cost per life/)).toBeInTheDocument();

    // An EMPTY field must not preview either: submit rejects it, and falling
    // back to the cause default would show lives for a rejected donation.
    const costInput = screen.getByLabelText('Cost per life');
    await user.clear(costInput);
    expect(screen.queryByText(/Estimated lives saved/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Recipient cost per life/)).not.toBeInTheDocument();

    // Zero is invalid (would preview "∞ lives" via division by zero).
    await user.type(costInput, '0');
    expect(screen.queryByText(/Estimated lives saved/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Recipient cost per life/)).not.toBeInTheDocument();

    // 1e999 parses to Infinity: previously the lives preview silently used
    // the cause's DEFAULT cost while the readout said ∞.
    await user.clear(costInput);
    await user.type(costInput, '1e999');
    expect(screen.queryByText(/Estimated lives saved/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Recipient cost per life/)).not.toBeInTheDocument();

    // Negative cost is legitimate (lives lost) — previews return.
    await user.clear(costInput);
    await user.type(costInput, '-2500');
    expect(await screen.findByText(/Estimated lives saved/)).toBeInTheDocument();
    expect(screen.getByText(/Recipient cost per life/)).toBeInTheDocument();
  });

  it('accepts a finite nonzero custom cost without imposing a magnitude floor', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(<SpecificDonationModal isOpen={true} onClose={vi.fn()} onSave={onSave} />);

    await user.click(screen.getByRole('button', { name: 'New Recipient' }));
    await user.type(screen.getByLabelText('Recipient Name'), 'Extreme Charity');
    await user.selectOptions(screen.getByLabelText('Cause'), 'health');
    await user.type(screen.getByLabelText('Donation Amount'), '1000');

    const costInput = screen.getByLabelText('Cost per life');
    fireEvent.input(costInput, {
      target: { value: `0.${'0'.repeat(50)}1` },
      inputType: 'insertFromPaste',
    });
    await user.click(screen.getByRole('button', { name: 'Add Donation' }));
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ customCostPerLife: Number(`0.${'0'.repeat(50)}1`) }));
  });

  it('converts legacy multiplier donations into an editable cost per life', async () => {
    const user = userEvent.setup();

    render(
      <SpecificDonationModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        editingDonation={{
          id: 'legacy',
          recipientName: 'Legacy Custom',
          amount: 300,
          date: '2024',
          isCustomRecipient: true,
          categoryId: 'health',
          multiplier: 2,
        }}
      />
    );

    await user.click(screen.getByRole('button', { name: 'New Recipient' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Cost per life')).toHaveValue('10,000');
    });
  });
});
