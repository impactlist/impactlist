import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AssumptionsDropdown from './AssumptionsDropdown';

const entries = [
  { id: 'entry-1', label: 'My scenario', source: 'local' },
  { id: 'entry-2', label: 'Other scenario', source: 'local' },
];

const renderDropdown = (props = {}) =>
  render(<AssumptionsDropdown entries={entries} onLoad={vi.fn()} onDescription={vi.fn()} {...props} />);

const getTrigger = () => screen.getByRole('button', { name: /select assumptions set/i });
// With no active entry the panel lists the defaults entry plus both saved
// entries' load buttons.
const getLoadButton = (name) => screen.getByRole('button', { name });

describe('AssumptionsDropdown disclosure keyboard semantics', () => {
  it('ArrowDown on the trigger opens the panel and focuses the first load target', async () => {
    renderDropdown();

    fireEvent.keyDown(getTrigger(), { key: 'ArrowDown' });

    await screen.findByRole('group', { name: 'Assumptions options' });
    await waitFor(() => {
      expect(getLoadButton(/my scenario/i)).toHaveFocus();
    });
  });

  it('ArrowDown on the trigger moves focus into an already-open panel', async () => {
    renderDropdown();

    // Open with the pointer first: focus stays on the trigger.
    fireEvent.click(getTrigger(), { detail: 1 });
    await screen.findByRole('group', { name: 'Assumptions options' });
    expect(getLoadButton(/my scenario/i)).not.toHaveFocus();

    fireEvent.keyDown(getTrigger(), { key: 'ArrowDown' });
    expect(getLoadButton(/my scenario/i)).toHaveFocus();
  });

  it('arrow keys rove focus across load targets; Home and End jump', async () => {
    renderDropdown();
    fireEvent.keyDown(getTrigger(), { key: 'ArrowDown' });

    const first = await screen.findByRole('button', { name: /my scenario/i });
    const second = getLoadButton(/other scenario/i);
    await waitFor(() => expect(first).toHaveFocus());

    fireEvent.keyDown(first, { key: 'ArrowDown' });
    expect(second).toHaveFocus();

    fireEvent.keyDown(second, { key: 'ArrowUp' });
    expect(first).toHaveFocus();

    fireEvent.keyDown(first, { key: 'End' });
    expect(second).toHaveFocus();

    fireEvent.keyDown(second, { key: 'Home' });
    expect(first).toHaveFocus();
  });

  it('Escape closes the panel and returns focus to the trigger', async () => {
    renderDropdown();
    fireEvent.keyDown(getTrigger(), { key: 'ArrowDown' });
    await screen.findByRole('group', { name: 'Assumptions options' });

    fireEvent.keyDown(globalThis, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('group', { name: 'Assumptions options' })).not.toBeInTheDocument();
    });
    expect(getTrigger()).toHaveFocus();
  });

  it('keyboard activation of the trigger moves focus into the panel', async () => {
    renderDropdown();

    // A keyboard "click" (Enter/Space) reports detail 0.
    fireEvent.click(getTrigger(), { detail: 0 });

    await screen.findByRole('group', { name: 'Assumptions options' });
    await waitFor(() => {
      expect(getLoadButton(/my scenario/i)).toHaveFocus();
    });
  });

  it('exposes load targets as toggle buttons (the active entry renders in the summary, not the list)', async () => {
    renderDropdown({ activeId: 'entry-1', hasUnsavedChanges: true });

    fireEvent.keyDown(getTrigger(), { key: 'ArrowDown' });
    await screen.findByRole('group', { name: 'Assumptions options' });

    expect(getLoadButton(/my scenario/i)).toHaveAttribute('aria-pressed', 'false');
    expect(getLoadButton(/other scenario/i)).toHaveAttribute('aria-pressed', 'false');
  });
});
