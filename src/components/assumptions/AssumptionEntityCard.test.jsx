import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('names its actions after the entity so multiple cards stay distinguishable', () => {
    const { getByRole } = renderCard({ onReset: vi.fn() });

    // The edit control shows a plain "(edit)" link in the readout line but
    // keeps the per-entity accessible name.
    const editLink = getByRole('button', { name: 'Edit AI Existential Risk' });
    expect(editLink).toHaveTextContent('edit');
    expect(getByRole('button', { name: 'Reset AI Existential Risk' })).toBeInTheDocument();
  });

  it('adds a justification link when given a target, without triggering the card edit', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const { getByRole } = renderCard({ onEdit, justificationTo: '/cause/ai-risk#full-justification' });

    const justificationLink = getByRole('link', { name: 'Justification for AI Existential Risk' });
    expect(justificationLink).toHaveTextContent('justification');
    expect(justificationLink).toHaveAttribute('href', '/cause/ai-risk#full-justification');

    await user.click(justificationLink);
    expect(onEdit).not.toHaveBeenCalled();
  });

  it('renders no justification link without a target', () => {
    const { queryByRole } = renderCard();

    expect(queryByRole('link', { name: /Justification for/ })).not.toBeInTheDocument();
  });

  it('only the explicit (edit) action opens the editor — the card body is not a click target', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const { container, getByRole } = renderCard({ onEdit });

    await user.click(container.querySelector('.assumption-card'));
    expect(onEdit).not.toHaveBeenCalled();

    await user.click(getByRole('button', { name: 'Edit AI Existential Risk' }));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });
});
