import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import FormField from './FormField';

const renderField = (props = {}) =>
  render(
    <FormField
      id="cost-per-qaly"
      label="Cost per QALY"
      description="What one quality-adjusted life year costs."
      value="1,000"
      defaultValue={1000}
      onChange={vi.fn()}
      {...props}
    />
  );

describe('FormField', () => {
  it("keeps the tooltip button out of the input's accessible name", () => {
    renderField();

    // Exact name — no "More information" suffix from a nested tooltip button.
    expect(screen.getByRole('textbox', { name: 'Cost per QALY' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'About Cost per QALY' })).toBeInTheDocument();
  });

  it('associates the error message with the input (same pattern as NumericInput)', () => {
    renderField({ error: 'Cost per QALY cannot be zero' });

    const input = screen.getByRole('textbox', { name: 'Cost per QALY' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-errormessage', 'cost-per-qaly-error');

    const errorMessage = document.getElementById('cost-per-qaly-error');
    expect(errorMessage).toHaveTextContent('Cost per QALY cannot be zero');
  });

  it('reports a valid input as not invalid', () => {
    renderField();

    const input = screen.getByRole('textbox', { name: 'Cost per QALY' });
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(input).not.toHaveAttribute('aria-errormessage');
  });

  it('preserves malformed comma placement for validation instead of reinterpreting it', () => {
    const onChange = vi.fn();
    renderField({ value: '', onChange });

    const input = screen.getByRole('textbox', { name: 'Cost per QALY' });
    fireEvent.input(input, { target: { value: '12,34' }, inputType: 'insertFromPaste' });

    expect(onChange).toHaveBeenLastCalledWith('12,34');
  });
});
