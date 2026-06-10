import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ImpactValueCell from './ImpactValueCell';

describe('ImpactValueCell', () => {
  it('renders ∞ exactly for ±Infinity currency values (the no-effect sentinel)', () => {
    const { rerender } = render(<ImpactValueCell kind="currency" value={Infinity} />);
    expect(screen.getByText('∞')).toBeInTheDocument();

    rerender(<ImpactValueCell kind="currency" value={-Infinity} />);
    expect(screen.getByText('∞')).toBeInTheDocument();
  });

  it('keeps invalid states loud instead of masking them as ∞', () => {
    // A cost of 0 is invalid by validation — it must look wrong, not infinite.
    const { rerender } = render(<ImpactValueCell kind="currency" value={0} />);
    expect(screen.getByText('$0')).toBeInTheDocument();

    // NaN is a calculation bug, never the no-effect sentinel.
    rerender(<ImpactValueCell kind="currency" value={NaN} />);
    expect(screen.getByText(/NaN/)).toBeInTheDocument();
    expect(screen.queryByText('∞')).not.toBeInTheDocument();
  });

  it('colors negative values as danger and respects positiveTone', () => {
    const { rerender, container } = render(<ImpactValueCell kind="lives" value={-5} />);
    expect(container.firstChild).toHaveClass('text-danger');

    rerender(<ImpactValueCell kind="lives" value={5} positiveTone="success" />);
    expect(container.firstChild).toHaveClass('text-success');

    rerender(<ImpactValueCell kind="currency" value={40000} />);
    expect(container.firstChild).toHaveClass('text-strong');
  });
});
