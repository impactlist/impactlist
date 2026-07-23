import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CauseFilter, { CauseScopeSummary } from './CauseFilter';

const categories = [
  { id: 'animal-welfare', name: 'Animal Welfare' },
  { id: 'climate-change', name: 'Climate Change' },
  { id: 'global-health', name: 'Global Health' },
];

const Harness = () => {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(null);

  return (
    <CauseFilter categories={categories} selectedCategoryIds={selectedCategoryIds} onApply={setSelectedCategoryIds} />
  );
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('CauseFilter', () => {
  it('stages a focused cause selection before applying it', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Cause scope. Current selection: All causes' }));
    expect(screen.getByRole('dialog', { name: 'Choose causes' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Causes included in the ranking' })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'Search causes' })).toHaveFocus();
    });

    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.getByRole('button', { name: 'Apply scope' })).toBeDisabled();

    await user.click(screen.getByRole('checkbox', { name: 'Global Health' }));
    expect(screen.getByText('1 of 3 selected')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cause scope. Current selection: All causes' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Apply scope' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Choose causes' })).not.toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Cause scope. Current selection: Global Health' })).toBeInTheDocument();
  });

  it('searches the cause list without changing the staged selection', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Cause scope. Current selection: All causes' }));
    await user.type(screen.getByRole('textbox', { name: 'Search causes' }), 'climate');

    expect(screen.getByRole('checkbox', { name: 'Climate Change' })).toBeInTheDocument();
    expect(screen.queryByRole('checkbox', { name: 'Global Health' })).not.toBeInTheDocument();
    expect(screen.getByText('3 of 3 selected')).toBeInTheDocument();
  });

  it('discards staged changes when cancelled', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const trigger = screen.getByRole('button', { name: 'Cause scope. Current selection: All causes' });
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Clear' }));
    await user.click(screen.getByRole('checkbox', { name: 'Animal Welfare' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByRole('button', { name: 'Cause scope. Current selection: All causes' })).toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes on Escape and restores focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const trigger = screen.getByRole('button', { name: 'Cause scope. Current selection: All causes' });
    await user.click(trigger);
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Search causes' })).toHaveFocus());

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Choose causes' })).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it('closes on an outside pointer press without moving focus back to the trigger', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">Outside target</button>
        <Harness />
      </>
    );

    const trigger = screen.getByRole('button', { name: 'Cause scope. Current selection: All causes' });
    await user.click(trigger);
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Search causes' })).toHaveFocus());

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside target' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Choose causes' })).not.toBeInTheDocument();
    });
    expect(trigger).not.toHaveFocus();
  });

  it('stays open when a touch tap moves focus to a non-tabbable page container', async () => {
    const user = userEvent.setup();
    render(
      <>
        <main tabIndex={-1}>Page content</main>
        <Harness />
      </>
    );

    await user.click(screen.getByRole('button', { name: 'Cause scope. Current selection: All causes' }));

    const dialog = screen.getByRole('dialog', { name: 'Choose causes' });
    const searchInput = screen.getByRole('textbox', { name: 'Search causes' });
    const animalWelfareLabel = screen.getByText('Animal Welfare');
    const pageContainer = screen.getByRole('main');
    await waitFor(() => expect(searchInput).toHaveFocus());

    fireEvent.pointerDown(animalWelfareLabel, { pointerType: 'touch' });
    fireEvent.blur(searchInput, { relatedTarget: pageContainer });

    expect(dialog).toBeInTheDocument();
    await user.click(screen.getByRole('checkbox', { name: 'Animal Welfare' }));
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Animal Welfare' })).not.toBeChecked();
    expect(screen.getByText('2 of 3 selected')).toBeInTheDocument();
  });

  it('closes when keyboard focus moves to a tabbable control outside the popover', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">Outside target</button>
        <Harness />
      </>
    );

    await user.click(screen.getByRole('button', { name: 'Cause scope. Current selection: All causes' }));

    const searchInput = screen.getByRole('textbox', { name: 'Search causes' });
    await waitFor(() => expect(searchInput).toHaveFocus());
    fireEvent.blur(searchInput, { relatedTarget: screen.getByRole('button', { name: 'Outside target' }) });

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Choose causes' })).not.toBeInTheDocument();
    });
  });

  it('uses the shared modal presentation on a narrow viewport', async () => {
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      matches: query.includes('(max-width: 639px)'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Cause scope. Current selection: All causes' }));

    const dialog = screen.getByRole('dialog', { name: 'Choose causes' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleDescription("Recalculate every donor's impact using only the causes you select.");
    expect(dialog).toHaveFocus();
  });
});

describe('CauseScopeSummary', () => {
  it('reports the active scope and resets it', async () => {
    const onReset = vi.fn();
    const user = userEvent.setup();
    render(<CauseScopeSummary selectedCategories={categories.slice(0, 2)} donorCount={7} onReset={onReset} />);

    expect(screen.getByRole('region', { name: 'Active cause scope' })).toHaveTextContent('Animal Welfare');
    expect(screen.getByRole('region', { name: 'Active cause scope' })).toHaveTextContent('7 donors');

    await user.click(screen.getByRole('button', { name: 'Switch to all causes' }));
    expect(onReset).toHaveBeenCalledOnce();
  });
});
