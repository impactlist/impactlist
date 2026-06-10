import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ModalShell from './ModalShell';

const renderShell = (props = {}) =>
  render(
    <ModalShell isOpen onClose={() => {}} labelledBy="test-modal-title" {...props}>
      <h2 id="test-modal-title">Test Modal</h2>
      <button type="button">First</button>
      <button type="button">Second</button>
    </ModalShell>
  );

describe('ModalShell', () => {
  it('renders dialog semantics and moves focus into the panel', () => {
    renderShell();

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleName('Test Modal');
    expect(dialog).toHaveFocus();
  });

  it('closes on Escape and restores focus to the previously focused element', async () => {
    const onClose = vi.fn();
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    outside.focus();

    const { rerender } = render(
      <ModalShell isOpen onClose={onClose} labelledBy="test-modal-title">
        <h2 id="test-modal-title">Test Modal</h2>
        <button type="button">First</button>
      </ModalShell>
    );

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(
      <ModalShell isOpen={false} onClose={onClose} labelledBy="test-modal-title">
        <h2 id="test-modal-title">Test Modal</h2>
        <button type="button">First</button>
      </ModalShell>
    );

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(outside).toHaveFocus();
    outside.remove();
  });

  it('closes when the scrim is clicked', () => {
    const onClose = vi.fn();
    const { container } = renderShell({ onClose });

    fireEvent.click(container.querySelector('.impact-modal__scrim'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('ignores Escape and scrim clicks when not dismissible', () => {
    const onClose = vi.fn();
    const { container } = renderShell({ onClose, dismissible: false });

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    fireEvent.click(container.querySelector('.impact-modal__scrim'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('wraps Tab focus within the panel', () => {
    renderShell();

    const first = screen.getByRole('button', { name: 'First' });
    const second = screen.getByRole('button', { name: 'Second' });

    second.focus();
    fireEvent.keyDown(second, { key: 'Tab' });
    expect(first).toHaveFocus();

    fireEvent.keyDown(first, { key: 'Tab', shiftKey: true });
    expect(second).toHaveFocus();
  });
});
