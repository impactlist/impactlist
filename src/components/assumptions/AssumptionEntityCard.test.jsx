import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import AssumptionEntityCard from './AssumptionEntityCard';

const renderCard = (props = {}) =>
  render(
    <MemoryRouter>
      <AssumptionEntityCard
        name="AI Existential Risk"
        to="/cause/ai-risk"
        isCustom={true}
        baselineValue="$1.16 × 10⁻⁶"
        currentValue="$1.29 × 10⁻⁶"
        onEdit={vi.fn()}
        {...props}
      />
    </MemoryRouter>
  );

describe('AssumptionEntityCard', () => {
  it('separates "was" from scientific baseline values with a non-breaking space', () => {
    // FormattedScientificValue renders scientific values as an element, which
    // becomes its own item inside the inline-flex meta — CSS strips a regular
    // trailing space at the end of the preceding text item, so the separator
    // must be a non-breaking space (U+00A0).
    const { container } = renderCard();
    const meta = container.querySelector('.assumption-card__default-meta');
    expect(meta.textContent).toContain('was\u00A0$1.16');
  });

  it('uses the same non-breaking separator for plain baseline values', () => {
    const { container } = renderCard({ baselineValue: '$9,400' });
    const meta = container.querySelector('.assumption-card__default-meta');
    expect(meta.textContent).toContain('was\u00A0$9,400');
  });
});
