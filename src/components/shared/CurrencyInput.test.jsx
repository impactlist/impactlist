import { fireEvent, render, screen } from '@testing-library/react';
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

  it('preserves malformed grouped paste instead of silently changing its value', () => {
    const onChange = vi.fn();
    render(<CurrencyInput id="amount" label="Amount" value="" onChange={onChange} />);

    const input = screen.getByLabelText('Amount');
    fireEvent.input(input, { target: { value: '12,34' }, inputType: 'insertFromPaste' });

    expect(input).toHaveValue('12,34');
    expect(onChange).toHaveBeenLastCalledWith('12,34');
  });

  it('regroups ordinary replacements inside its own formatted value', () => {
    const onChange = vi.fn();
    render(<CurrencyInput id="amount" label="Amount" value="12345" onChange={onChange} />);

    const input = screen.getByLabelText('Amount');
    expect(input).toHaveValue('12,345');

    fireEvent.input(input, {
      target: { value: '12,6', selectionStart: 4 },
      inputType: 'insertText',
      data: '6',
    });

    expect(input).toHaveValue('126');
    expect(onChange).toHaveBeenLastCalledWith('126');
  });
});
