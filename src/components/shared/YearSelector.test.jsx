import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import YearSelector from './YearSelector';

describe('YearSelector', () => {
  it('does not silently truncate a fractional year', () => {
    const onChange = vi.fn();
    render(<YearSelector value={2024} onChange={onChange} minYear={1900} maxYear={2026} />);
    const input = screen.getByLabelText('Assumed year:');

    fireEvent.change(input, { target: { value: '2020.5' } });
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.blur(input);
    expect(input).toHaveValue(2024);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('interprets browser-supported exponent notation by its full numeric value', () => {
    const onChange = vi.fn();
    render(<YearSelector value={2024} onChange={onChange} minYear={1900} maxYear={2026} />);

    fireEvent.change(screen.getByLabelText('Assumed year:'), { target: { value: '2e3' } });

    expect(onChange).toHaveBeenCalledWith(2000);
  });
});
