import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import CurrencyInput from './CurrencyInput';

describe('CurrencyInput', () => {
  it('associates the label and reports cleaned values on change', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CurrencyInput id="donation-amount" label="Donation Amount" value="" onChange={onChange} />);

    const input = screen.getByLabelText('Donation Amount');
    await user.type(input, '1234');

    expect(onChange).toHaveBeenLastCalledWith('1234');
    expect(input).toHaveValue('1,234');
  });

  it('renders the error message and marks the input invalid', () => {
    render(<CurrencyInput id="amount" label="Amount" value="abc" onChange={vi.fn()} error="Must be a valid number" />);

    const input = screen.getByLabelText('Amount');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Must be a valid number')).toBeInTheDocument();
  });
});
