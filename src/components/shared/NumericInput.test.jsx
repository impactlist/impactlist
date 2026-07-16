import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import NumericInput from './NumericInput';

describe('NumericInput', () => {
  it('keeps the caret after an incomplete exponent while scientific notation is typed', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<NumericInput id="quantity" label="Quantity" value="" onChange={onChange} />);

    const input = screen.getByLabelText('Quantity');
    await user.type(input, '1e7');

    expect(input).toHaveValue('1e7');
    expect(input.selectionStart).toBe(3);
    expect(onChange).toHaveBeenLastCalledWith('1e7');
  });

  it('preserves the exact decimal text instead of round-tripping through exponent notation', () => {
    const onChange = vi.fn();
    render(<NumericInput id="quantity" label="Quantity" value="" onChange={onChange} />);

    const decimal = `0.${'0'.repeat(50)}1`;
    fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: decimal } });

    expect(onChange).toHaveBeenLastCalledWith(decimal);
  });

  it('does not silently accept the numeric prefix of invalid visible text', () => {
    const onChange = vi.fn();
    render(<NumericInput id="quantity" label="Quantity" value="" onChange={onChange} />);

    fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '12oops' } });

    expect(onChange).toHaveBeenLastCalledWith('12oops');
  });

  it('does not emit Infinity for an overflowing numeric draft', () => {
    const onChange = vi.fn();
    render(<NumericInput id="quantity" label="Quantity" value="" onChange={onChange} />);

    fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '1e999' } });

    expect(onChange).toHaveBeenLastCalledWith('1e999');
  });

  it('does not reinterpret non-decimal JavaScript number syntax', () => {
    const onChange = vi.fn();
    render(<NumericInput id="quantity" label="Quantity" value="" onChange={onChange} />);
    const input = screen.getByLabelText('Quantity');

    fireEvent.change(input, { target: { value: '0x10' } });
    expect(onChange).toHaveBeenLastCalledWith('0x10');

    fireEvent.change(input, { target: { value: '1e3' } });
    expect(onChange).toHaveBeenLastCalledWith('1e3');
  });

  it('preserves malformed grouped paste for validation instead of converting it', () => {
    const onChange = vi.fn();
    render(<NumericInput id="quantity" label="Quantity" value="" onChange={onChange} />);
    const input = screen.getByLabelText('Quantity');

    fireEvent.input(input, { target: { value: '12,34' }, inputType: 'insertFromPaste' });

    expect(input).toHaveValue('12,34');
    expect(onChange).toHaveBeenLastCalledWith('12,34');
  });
});
