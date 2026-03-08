import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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
