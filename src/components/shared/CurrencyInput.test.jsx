import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CurrencyInput from './CurrencyInput';

describe('CurrencyInput', () => {
  it('renders a read-only input when displayOnly is enabled', () => {
    render(
      <CurrencyInput
        id="category-cost"
        value="62"
        onChange={vi.fn()}
        placeholder="31"
        displayOnly={true}
        ariaLabel="AGI Development"
      />
    );

    const input = screen.getByDisplayValue('62');
    expect(input).toHaveAttribute('readonly');
    expect(input).toHaveAttribute('tabindex', '-1');
    expect(input).toHaveAccessibleName('AGI Development');
    expect(input).toHaveClass('impact-field__input--display');
  });

  it('falls back to the placeholder when display-only value is empty', () => {
    render(
      <CurrencyInput
        id="recipient-cost"
        value=""
        onChange={vi.fn()}
        placeholder="640"
        displayOnly={true}
        ariaLabel="Animal Welfare"
      />
    );

    expect(screen.getByPlaceholderText('640')).toHaveAccessibleName('Animal Welfare');
  });
});
