import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, Route, RouterProvider, Routes, useLocation, useNavigate } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AssumptionsPage from './AssumptionsPage';
import { AssumptionsProvider } from '../contexts/AssumptionsContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import GlobalNotificationBanner from '../components/shared/GlobalNotificationBanner';
import {
  createCombinedAssumptions,
  createDefaultAssumptions,
  getCostPerLifeForRecipientFromCombined,
} from '../utils/assumptionsDataHelpers';
import { formatCurrency, formatNumberWithCommas } from '../utils/formatters';
import { getCurrentYear } from '../utils/donationDataHelpers';
import { __internal, saveNewAssumptions, setActiveSavedAssumptionsId } from '../utils/savedAssumptionsStore';
import { beginHistoryEntryScrollRestoration, getHistoryEntryScrollId } from '../utils/scrollRestorationCoordinator';

/* global localStorage, sessionStorage, Event */

const assumptionsData = createDefaultAssumptions();
const longtermistGlobalParameters = {
  populationGrowthRate: 2e-8,
  populationLimit: 1_000_000,
  timeLimit: 10_000_000_000,
};
const firstValidCategoryId = Object.keys(assumptionsData.categories)[0];
const firstValidRecipientId = Object.entries(assumptionsData.recipients).find(
  ([, recipient]) => Object.keys(recipient.categories || {}).length > 0
)?.[0];

const RouterControls = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <div data-testid="location-probe">{`${location.pathname}${location.search}`}</div>
      <button type="button" onClick={() => navigate(-1)}>
        Go Back
      </button>
      <button type="button" onClick={() => navigate(1)}>
        Go Forward
      </button>
      <button type="button" onClick={() => navigate('/')}>
        Go Home
      </button>
      <button type="button" onClick={() => navigate('/assumptions?tab=categories')}>
        Open Categories
      </button>
      <button type="button" onClick={() => navigate(`/assumptions?tab=categories&categoryId=${firstValidCategoryId}`)}>
        Open Category Editor
      </button>
    </>
  );
};

const renderAssumptionsRoute = (initialEntry) => {
  // A data router (single splat route hosting descendant <Routes>) mirrors
  // App.jsx — AssumptionsEditor's useBlocker requires one.
  const router = createMemoryRouter(
    [
      {
        path: '*',
        element: (
          <>
            {/* Mirrors App.jsx so notification-producing flows are assertable
                (the banner renders null while no notification is showing). */}
            <GlobalNotificationBanner />
            <RouterControls />
            <Routes>
              <Route path="/" element={<div>Home</div>} />
              <Route path="/assumptions" element={<AssumptionsPage />} />
            </Routes>
          </>
        ),
      },
    ],
    { initialEntries: [initialEntry] }
  );

  render(
    <NotificationProvider>
      <AssumptionsProvider>
        <RouterProvider router={router} />
      </AssumptionsProvider>
    </NotificationProvider>
  );
};

const getAssumptionsLibrarySection = () => screen.getByText('Current Assumptions').closest('section');

const openAssumptionsLibraryMenu = async (user) => {
  const section = getAssumptionsLibrarySection();
  const openMenu = within(section).queryByRole('group', { name: 'Assumptions sets' });

  if (!openMenu) {
    await user.click(within(section).getByRole('button', { name: /Select assumptions set/i }));
  }

  return {
    section,
    menu: await within(section).findByRole('group', { name: 'Assumptions sets' }),
  };
};

const getAssumptionsLibraryRow = (container, label) => within(container).getByText(label).closest('.assumptions-entry');

const getAssumptionsLibrarySummary = () =>
  getAssumptionsLibrarySection().querySelector('.saved-assumptions-panel__summary');

const getActiveAssumptionsActionButton = (label) =>
  within(getAssumptionsLibrarySummary()).getByRole('button', { name: label });

const queryActiveAssumptionsActionButton = (label) =>
  within(getAssumptionsLibrarySummary()).queryByRole('button', { name: label });

describe('AssumptionsPage routing integration', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows recipients list for an invalid recipient deep-link instead of opening an editor', async () => {
    renderAssumptionsRoute('/assumptions?recipientId=recipient-that-does-not-exist');

    expect(await screen.findByPlaceholderText('Search recipients...')).toBeInTheDocument();
    expect(screen.queryByText(/Edit effects for recipient/i)).not.toBeInTheDocument();
    expect(screen.getByTestId('location-probe')).toHaveTextContent('recipientId=recipient-that-does-not-exist');
  });

  it('shows categories list for an invalid category deep-link instead of opening an editor', async () => {
    renderAssumptionsRoute('/assumptions?tab=categories&categoryId=missing-category');

    expect(await screen.findByText(/for each cause:/i)).toBeInTheDocument();
    expect(screen.queryByText(/Edit effects for cause/i)).not.toBeInTheDocument();
  });

  it('shows an explanatory tooltip next to the current assumptions heading', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    const activeAssumptionsSection = getAssumptionsLibrarySection();
    await user.hover(within(activeAssumptionsSection).getByRole('button', { name: 'More information' }));

    expect(
      await screen.findByText(
        'Choose an assumptions set to see how different assumptions affect the rankings and calculations across the site.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Curated assumptions are built-in sets provided by Impact List. Local assumptions are saved only in this browser. Remote assumptions are shared links that were imported from somewhere else.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Non-local assumptions already have a link you can use to share them. If you want a link for a local assumptions set, select it and click Share.'
      )
    ).toBeInTheDocument();
  });

  it('hides the sitewide assumptions selector preference while keeping the selector enabled', async () => {
    renderAssumptionsRoute('/assumptions');

    expect(screen.queryByRole('checkbox', { name: 'Show assumption selector on all pages' })).not.toBeInTheDocument();
  });

  it.skip('lets the user toggle whether the assumptions selector appears on every page', async () => {
    // Re-enable when ASSUMPTIONS_SELECTOR_PREFERENCE_CONTROL_ENABLED is restored.
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    const checkbox = screen.getByRole('checkbox', { name: 'Show assumption selector on all pages' });
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(localStorage.getItem('showAssumptionsSelectorEveryPage:v1')).toBe('1');

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(localStorage.getItem('showAssumptionsSelectorEveryPage:v1')).toBe('0');
  });

  it('supports back/forward navigation between category list and category editor urls', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions?tab=categories');

    await user.click(screen.getByRole('button', { name: 'Open Category Editor' }));

    await waitFor(() => {
      expect(screen.getByText(/Edit effects for cause/i)).toBeInTheDocument();
      expect(screen.getByTestId('location-probe').textContent).toContain('categoryId=');
    });

    await user.click(screen.getByRole('button', { name: 'Go Back' }));
    await waitFor(() => {
      expect(screen.queryByText(/Edit effects for cause/i)).not.toBeInTheDocument();
      expect(screen.getByTestId('location-probe').textContent).toBe('/assumptions?tab=categories');
    });

    await user.click(screen.getByRole('button', { name: 'Go Forward' }));
    await waitFor(() => {
      expect(screen.getByText(/Edit effects for cause/i)).toBeInTheDocument();
      expect(screen.getByTestId('location-probe').textContent).toContain('categoryId=');
    });
  });

  it('resets recipient search after navigating away and back', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions?tab=recipients');

    const searchInput = await screen.findByPlaceholderText('Search recipients...');
    await user.type(searchInput, 'malaria');
    expect(searchInput).toHaveValue('malaria');

    await user.click(screen.getByRole('button', { name: 'Go Home' }));
    expect(screen.getByText('Home')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Go Back' }));
    const searchInputAfterReturn = await screen.findByPlaceholderText('Search recipients...');
    expect(searchInputAfterReturn).toHaveValue('');
  });

  it('opens valid category editor from deep-link query params', async () => {
    renderAssumptionsRoute(`/assumptions?tab=categories&categoryId=${firstValidCategoryId}`);

    expect(await screen.findByText(/Edit effects for cause/i)).toBeInTheDocument();
    expect(screen.getByTestId('location-probe')).toHaveTextContent(`categoryId=${firstValidCategoryId}`);
  });

  it('keeps tabs operable while editing a category: a clean editor closes without prompting', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute(`/assumptions?tab=categories&categoryId=${firstValidCategoryId}`);

    expect(await screen.findByText(/Edit effects for cause/i)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Global' })).toBeEnabled();
    expect(screen.getByRole('tab', { name: 'Causes' })).toBeEnabled();
    expect(screen.getByRole('tab', { name: 'Recipients' })).toBeEnabled();

    await user.click(screen.getByRole('tab', { name: 'Global' }));
    expect(screen.queryByText('Apply your edits before leaving?')).not.toBeInTheDocument();
    expect(screen.getByTestId('location-probe').textContent).toBe('/assumptions');
    expect(screen.queryByText(/Edit effects for cause/i)).not.toBeInTheDocument();
  });

  it('opens recipient editor from deep-link even when tab query param is global', async () => {
    if (!firstValidRecipientId) {
      throw new Error('Expected at least one recipient with categories in default assumptions data');
    }

    renderAssumptionsRoute(`/assumptions?tab=global&recipientId=${firstValidRecipientId}`);

    expect(await screen.findByText(/Edit effects for recipient/i)).toBeInTheDocument();
    expect(screen.getByTestId('location-probe')).toHaveTextContent(`recipientId=${firstValidRecipientId}`);
  });

  it('keeps tabs operable while editing a recipient: a clean editor closes without prompting', async () => {
    if (!firstValidRecipientId) {
      throw new Error('Expected at least one recipient with categories in default assumptions data');
    }

    const user = userEvent.setup();
    renderAssumptionsRoute(`/assumptions?tab=recipients&recipientId=${firstValidRecipientId}`);

    expect(await screen.findByText(/Edit effects for recipient/i)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Causes' })).toBeEnabled();

    await user.click(screen.getByRole('tab', { name: 'Causes' }));
    expect(screen.queryByText('Apply your edits before leaving?')).not.toBeInTheDocument();
    expect(screen.getByTestId('location-probe').textContent).toBe('/assumptions?tab=categories');
    expect(screen.queryByText(/Edit effects for recipient/i)).not.toBeInTheDocument();
  });

  it('updates URL tab params from tab navigation and omits tab param for global', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    await user.click(screen.getByRole('tab', { name: 'Causes' }));
    await waitFor(() => {
      expect(screen.getByTestId('location-probe').textContent).toBe('/assumptions?tab=categories');
    });

    await user.click(screen.getByRole('tab', { name: 'Recipients' }));
    await waitFor(() => {
      expect(screen.getByTestId('location-probe').textContent).toBe('/assumptions?tab=recipients');
    });

    await user.click(screen.getByRole('tab', { name: 'Global' }));
    await waitFor(() => {
      expect(screen.getByTestId('location-probe').textContent).toBe('/assumptions');
    });
  });

  it('supports keyboard navigation across tabs with Home and End keys', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    const globalTab = screen.getByRole('tab', { name: 'Global' });
    globalTab.focus();
    expect(globalTab).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'Causes' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByTestId('location-probe').textContent).toBe('/assumptions?tab=categories');
    });

    await user.keyboard('{End}');
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'Recipients' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByTestId('location-probe').textContent).toBe('/assumptions?tab=recipients');
    });

    await user.keyboard('{Home}');
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'Global' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByTestId('location-probe').textContent).toBe('/assumptions');
    });
  });

  it('shows parameter tooltip content on keyboard focus', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    const discountRateLabel = await screen.findByText('Discount Rate (%)');
    const discountRateCard = discountRateLabel.closest('.assumption-card__title-wrap');
    await user.click(within(discountRateCard).getByRole('button', { name: 'More information' }));

    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByRole('tooltip')).toHaveTextContent(/annual discount rate/i);

    await user.tab();
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('supports back/forward navigation for recipient editor entry from list', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions?tab=recipients');

    const searchInput = await screen.findByPlaceholderText('Search recipients...');
    await user.type(searchInput, 'a');

    const editButtons = await screen.findAllByRole('button', { name: /^Edit / });
    await user.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Edit effects for recipient/i)).toBeInTheDocument();
      expect(screen.getByTestId('location-probe').textContent).toContain('recipientId=');
    });

    await user.click(screen.getByRole('button', { name: 'Go Back' }));
    await waitFor(() => {
      expect(screen.queryByText(/Edit effects for recipient/i)).not.toBeInTheDocument();
      expect(screen.getByTestId('location-probe').textContent).toBe('/assumptions?tab=recipients');
    });

    await user.click(screen.getByRole('button', { name: 'Go Forward' }));
    await waitFor(() => {
      expect(screen.getByText(/Edit effects for recipient/i)).toBeInTheDocument();
      expect(screen.getByTestId('location-probe').textContent).toContain('recipientId=');
    });
  });

  it('opens the cause editor only from the explicit (edit) action, never from the card body', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions?tab=categories');

    const categoryName = assumptionsData.categories[firstValidCategoryId].name;
    const cardLink = await screen.findByRole('link', { name: categoryName });
    const cardRoot = cardLink.closest('.assumption-card');
    expect(cardRoot).not.toBeNull();

    // The card body stopped being a click target once cards grew multiple
    // links — a body click must not open the editor.
    await user.click(cardRoot);
    expect(screen.queryByText(/Edit effects for cause/i)).not.toBeInTheDocument();
    expect(screen.getByTestId('location-probe').textContent).not.toContain('categoryId=');

    await user.click(screen.getByRole('button', { name: `Edit ${categoryName}` }));
    await waitFor(() => {
      expect(screen.getByText(/Edit effects for cause/i)).toBeInTheDocument();
      expect(screen.getByTestId('location-probe').textContent).toContain(`categoryId=${firstValidCategoryId}`);
    });

    // Multi-effect categories render header + footer Cancel buttons; the
    // footer one always exists.
    const cancelButtons = screen.getAllByRole('button', { name: 'Cancel' });
    await user.click(cancelButtons[cancelButtons.length - 1]);
    await waitFor(() => {
      expect(screen.queryByText(/Edit effects for cause/i)).not.toBeInTheDocument();
    });

    // The entity link navigates to the cause page — and must not also push
    // an editor navigation (categoryId= would land last if it did).
    await user.click(screen.getByRole('link', { name: categoryName }));
    await waitFor(() => {
      const probe = screen.getByTestId('location-probe').textContent;
      expect(probe).toContain('/cause/');
      expect(probe).not.toContain('categoryId=');
    });
  });

  it('saves and resets global parameter overrides from the global tab', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, '150');

    await user.click(screen.getByRole('button', { name: 'Apply' }));

    await waitFor(() => {
      const persisted = JSON.parse(sessionStorage.getItem('customEffectsData'));
      expect(persisted.globalParameters.timeLimit).toBe(150);
    });

    // The per-parameter reset icon returns the field to its default; Apply
    // persists it (the pruned diff then matches the defaults exactly).
    await user.click(screen.getByRole('button', { name: 'Reset Time Limit (years)' }));
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    await waitFor(() => {
      expect(sessionStorage.getItem('customEffectsData')).toBeNull();
    });
  });

  it('offers the per-field reset as an escape hatch from invalid global input', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    expect(screen.queryByRole('button', { name: 'Reset Time Limit (years)' })).not.toBeInTheDocument();

    // A partial value parses to NaN — never "custom" — and a save attempt
    // pins an error that disables Apply, so the reset icon must appear for
    // errored fields too or the user is stuck retyping the default by hand.
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, '-');
    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(await screen.findByText('Please enter a complete number')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Reset Time Limit (years)' }));

    await waitFor(() => {
      expect(screen.queryByText('Please enter a complete number')).not.toBeInTheDocument();
    });
    expect(screen.getByLabelText('Time Limit (years)')).toHaveValue(
      formatNumberWithCommas(String(assumptionsData.globalParameters.timeLimit))
    );
  });

  it('keeps the differences section usable while a drill-in editor is open', async () => {
    const user = userEvent.setup();
    const categoryEffect = assumptionsData.categories[firstValidCategoryId].effects[0];
    const categoryField = categoryEffect.costPerQALY !== undefined ? 'costPerQALY' : 'costPerMicroprobability';
    const fieldLabel = categoryEffect.costPerQALY !== undefined ? 'Cost per life-year' : 'Cost per microprobability';
    localStorage.setItem(__internal.SAVED_ASSUMPTIONS_MIGRATION_KEY, '1');
    sessionStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: { timeLimit: assumptionsData.globalParameters.timeLimit + 50 },
        categories: {
          [firstValidCategoryId]: {
            effects: [{ effectId: categoryEffect.effectId, [categoryField]: categoryEffect[categoryField] * 2 }],
          },
        },
      })
    );

    renderAssumptionsRoute(`/assumptions?tab=categories&categoryId=${firstValidCategoryId}`);

    expect(await screen.findByText(/Edit effects for cause/i)).toBeInTheDocument();
    const toggle = screen.getByRole('button', { name: /differences? from default assumptions/i });
    await user.click(toggle);
    const section = toggle.closest('.review-changes-section');

    // Type an in-progress draft into the open editor…
    const costField = screen.getAllByRole('textbox', { name: fieldLabel })[0];
    await user.clear(costField);
    await user.type(costField, '777');

    // …reverting an UNRELATED row must not wipe it…
    await user.click(within(section).getByRole('button', { name: 'Revert Time Limit (years)' }));
    expect(screen.getAllByRole('textbox', { name: fieldLabel })[0]).toHaveValue('777');

    // …while reverting the edited cause's own row re-initializes the draft
    // to the restored default value.
    await user.click(within(section).getByRole('button', { name: new RegExp(`^Revert .*${fieldLabel}$`) }));
    await waitFor(() => {
      expect(screen.getAllByRole('textbox', { name: fieldLabel })[0]).toHaveValue(
        formatNumberWithCommas(String(categoryEffect[categoryField]))
      );
    });

    // Nothing differs any more; the section retires while the editor stays open.
    expect(screen.queryByRole('button', { name: /differences? from default assumptions/i })).not.toBeInTheDocument();
    expect(screen.getByText(/Edit effects for cause/i)).toBeInTheDocument();
  });

  it('shows inline errors instead of crashing when typed global values are out of range', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    // Each of these previously crashed the page: the future-value preview
    // graph fed the invalid number into math that asserts.
    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, '-1');
    expect(await screen.findByText('Time limit must be positive')).toBeInTheDocument();

    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, '0');
    expect(await screen.findByText('Time limit must be positive')).toBeInTheDocument();

    const discountRateInput = screen.getByLabelText('Discount Rate (%)');
    await user.clear(discountRateInput);
    await user.type(discountRateInput, '-1');
    expect(await screen.findByText('Discount rate cannot be negative')).toBeInTheDocument();

    await user.clear(discountRateInput);
    await user.type(discountRateInput, '1000.1');
    expect(await screen.findByText('Discount rate must be no greater than 1,000%')).toBeInTheDocument();

    const populationLimitInput = screen.getByLabelText('Population Limit Factor');
    await user.clear(populationLimitInput);
    await user.type(populationLimitInput, '-1');
    expect(await screen.findByText('Population limit must be positive')).toBeInTheDocument();

    // The page is still alive and invalid values cannot be applied.
    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(sessionStorage.getItem('customEffectsData')).toBeNull();
    expect(screen.getByRole('tab', { name: 'Global' })).toBeInTheDocument();
  });

  it('blocks global save when input is incomplete', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    const discountRateInput = await screen.findByLabelText('Discount Rate (%)');
    await user.clear(discountRateInput);
    await user.type(discountRateInput, '-');

    await user.click(screen.getByRole('button', { name: 'Apply' }));

    expect(await screen.findByText('Please enter a complete number')).toBeInTheDocument();
    expect(sessionStorage.getItem('customEffectsData')).toBeNull();
  });

  it('applies cause-level edits to recipient summary cards on the Recipients tab', async () => {
    const user = userEvent.setup();

    const [categoryId, category] = Object.entries(assumptionsData.categories).find(
      ([, entry]) => Array.isArray(entry.effects) && entry.effects.length > 0
    );
    if (!categoryId || !category) {
      throw new Error('Expected at least one category with effects in default assumptions data');
    }

    const [recipientId, recipient] = Object.entries(assumptionsData.recipients).find(([, entry]) =>
      Object.hasOwn(entry.categories || {}, categoryId)
    );
    if (!recipientId || !recipient) {
      throw new Error(`Expected at least one recipient linked to category ${categoryId}`);
    }

    const firstEffect = category.effects[0];
    const fieldLabel = firstEffect.costPerQALY !== undefined ? 'Cost per life-year' : 'Cost per microprobability';
    const originalValue = firstEffect.costPerQALY ?? firstEffect.costPerMicroprobability;
    const updatedValue = originalValue / 2;

    renderAssumptionsRoute(`/assumptions?tab=categories&categoryId=${categoryId}`);

    const editor = await screen.findByText(/Edit effects for cause/i);
    const editorRoot = editor.closest('.assumptions-shell');
    expect(editorRoot).not.toBeNull();

    // The category may have several effects of the same type; the first
    // matching field belongs to effects[0], whose type chose fieldLabel.
    const costField = within(editorRoot).getAllByRole('textbox', { name: fieldLabel })[0];
    await user.clear(costField);
    await user.type(costField, String(updatedValue));
    // Multi-effect categories render header + footer Apply buttons; the footer
    // one always exists.
    const applyButtons = within(editorRoot).getAllByRole('button', { name: 'Apply' });
    await user.click(applyButtons[applyButtons.length - 1]);

    let persisted;
    await waitFor(() => {
      persisted = JSON.parse(sessionStorage.getItem('customEffectsData'));
      expect(persisted.categories?.[categoryId]?.effects?.[0]?.effectId).toBe(firstEffect.effectId);
    });

    await user.click(screen.getByRole('tab', { name: 'Recipients' }));

    const searchInput = await screen.findByPlaceholderText('Search recipients...');
    await user.type(searchInput, recipient.name);

    const recipientCard = await screen.findByText(recipient.name);
    const cardRoot = recipientCard.closest('[data-state]');
    expect(cardRoot).not.toBeNull();

    const expectedCost = getCostPerLifeForRecipientFromCombined(
      createCombinedAssumptions(assumptionsData, persisted),
      recipientId,
      getCurrentYear()
    );

    // The card shows the combined cost as a text readout (not an input).
    expect(within(cardRoot).getByText(formatCurrency(expectedCost))).toBeInTheDocument();
  });

  it('prompts before navigating away with unapplied global edits, and keeps or discards them', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, '123');

    await user.click(screen.getByRole('button', { name: 'Go Home' }));

    const prompt = await screen.findByText('Apply your edits before leaving?');
    expect(prompt).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Keep editing' }));
    await waitFor(() => {
      expect(screen.queryByText('Apply your edits before leaving?')).not.toBeInTheDocument();
    });
    expect(screen.getByTestId('location-probe')).toHaveTextContent('/assumptions');
    expect(screen.getByLabelText('Time Limit (years)')).toHaveValue('123');

    await user.click(screen.getByRole('button', { name: 'Go Home' }));
    await screen.findByText('Apply your edits before leaving?');
    await user.click(screen.getByRole('button', { name: 'Discard and leave' }));

    await waitFor(() => {
      expect(screen.getByTestId('location-probe')).toHaveTextContent('/');
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
    expect(sessionStorage.getItem('customEffectsData')).toBeNull();
  });

  it('applies unapplied global edits when leaving via "Apply and leave"', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    const updatedTimeLimit = assumptionsData.globalParameters.timeLimit + 50;
    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, String(updatedTimeLimit));

    await user.click(screen.getByRole('button', { name: 'Go Home' }));
    await screen.findByText('Apply your edits before leaving?');
    await user.click(screen.getByRole('button', { name: 'Apply and leave' }));

    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
    expect(JSON.parse(sessionStorage.getItem('customEffectsData')).globalParameters.timeLimit).toBe(updatedTimeLimit);
  });

  it('stays on the page when "Apply and leave" hits validation errors', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, '0');

    await user.click(screen.getByRole('button', { name: 'Go Home' }));
    await screen.findByText('Apply your edits before leaving?');
    await user.click(screen.getByRole('button', { name: 'Apply and leave' }));

    await waitFor(() => {
      expect(screen.queryByText('Apply your edits before leaving?')).not.toBeInTheDocument();
    });
    expect(screen.getByTestId('location-probe')).toHaveTextContent('/assumptions');
    expect(screen.getByText('Time limit must be positive')).toBeInTheDocument();
    expect(sessionStorage.getItem('customEffectsData')).toBeNull();
  });

  it('does not prompt when switching tabs with unapplied global edits', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, '123');

    await user.click(screen.getByRole('tab', { name: 'Causes' }));

    await waitFor(() => {
      expect(screen.getByTestId('location-probe')).toHaveTextContent('tab=categories');
    });
    expect(screen.queryByText('Apply your edits before leaving?')).not.toBeInTheDocument();

    // The form survives the tab round-trip.
    await user.click(screen.getByRole('tab', { name: 'Global' }));
    expect(await screen.findByLabelText('Time Limit (years)')).toHaveValue('123');
  });

  it('asks the browser to confirm unload while global edits are unapplied', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    const fireBeforeUnload = () => {
      const event = new Event('beforeunload', { cancelable: true });
      window.dispatchEvent(event);
      return event.defaultPrevented;
    };

    expect(await screen.findByLabelText('Time Limit (years)')).toBeInTheDocument();
    expect(fireBeforeUnload()).toBe(false);

    const timeLimitInput = screen.getByLabelText('Time Limit (years)');
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, '123');
    expect(fireBeforeUnload()).toBe(true);

    await user.click(screen.getByRole('button', { name: 'Apply' }));
    await waitFor(() => {
      expect(fireBeforeUnload()).toBe(false);
    });
  });

  // ---- Drill-in editor navigation guard ----
  // The guard that protects un-applied global edits also covers drill-in
  // effect drafts: any navigation that would close or retarget the open
  // editor (tab switch, back button, leaving the page) prompts instead of
  // silently discarding, while the editor's own Apply/Cancel exits and
  // navigations from a clean editor stay prompt-free.

  const guardPromptTitle = 'Apply your edits before leaving?';

  const categoryEditorField = () => {
    // The first textbox with this label belongs to the editor's first
    // (date-sorted) effect, which may not be effects[0] of the raw data — so
    // persistence assertions match by value, not by effect id.
    const effect = assumptionsData.categories[firstValidCategoryId].effects[0];
    const isQaly = effect.costPerQALY !== undefined;
    return {
      label: isQaly ? 'Cost per life-year' : 'Cost per microprobability',
      fieldKey: isQaly ? 'costPerQALY' : 'costPerMicroprobability',
    };
  };

  const typeIntoFirstCostField = async (user, editor, value) => {
    const input = within(editor).getAllByRole('textbox', { name: categoryEditorField().label })[0];
    await user.clear(input);
    if (value) {
      await user.type(input, value);
    }
    return input;
  };

  const openDirtyCategoryEditor = async (user, value = '777') => {
    renderAssumptionsRoute(`/assumptions?tab=categories&categoryId=${firstValidCategoryId}`);
    const editor = (await screen.findByText(/Edit effects for cause/i)).closest('.assumptions-shell');
    const input = await typeIntoFirstCostField(user, editor, value);
    return { editor, input };
  };

  it('prompts when switching tabs would discard drill-in effect edits, and "Keep editing" preserves them', async () => {
    const user = userEvent.setup();
    const { input } = await openDirtyCategoryEditor(user);

    await user.click(screen.getByRole('tab', { name: 'Recipients' }));

    expect(await screen.findByText(guardPromptTitle)).toBeInTheDocument();
    // Only the drill-in draft is at risk on a same-page navigation, so the
    // prompt names it alone.
    expect(screen.getByText(/You changed effects for .+ but haven't applied them\./)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Keep editing' }));
    await waitFor(() => {
      expect(screen.queryByText(guardPromptTitle)).not.toBeInTheDocument();
    });
    expect(screen.getByTestId('location-probe')).toHaveTextContent(`categoryId=${firstValidCategoryId}`);
    expect(input).toHaveValue('777');
  });

  it('"Discard and leave" abandons the drill-in draft and completes the tab switch', async () => {
    const user = userEvent.setup();
    await openDirtyCategoryEditor(user);

    await user.click(screen.getByRole('tab', { name: 'Recipients' }));
    await screen.findByText(guardPromptTitle);
    await user.click(screen.getByRole('button', { name: 'Discard and leave' }));

    await waitFor(() => {
      expect(screen.getByTestId('location-probe')).toHaveTextContent('tab=recipients');
    });
    expect(screen.queryByText(/Edit effects for cause/i)).not.toBeInTheDocument();
    expect(sessionStorage.getItem('customEffectsData')).toBeNull();
  });

  it('"Apply and leave" commits the drill-in draft and completes the tab switch', async () => {
    const user = userEvent.setup();
    const { fieldKey } = categoryEditorField();
    await openDirtyCategoryEditor(user);

    await user.click(screen.getByRole('tab', { name: 'Recipients' }));
    await screen.findByText(guardPromptTitle);
    await user.click(screen.getByRole('button', { name: 'Apply and leave' }));

    await waitFor(() => {
      expect(screen.getByTestId('location-probe')).toHaveTextContent('tab=recipients');
    });
    const persisted = JSON.parse(sessionStorage.getItem('customEffectsData'));
    expect(persisted.categories[firstValidCategoryId].effects.some((effect) => effect[fieldKey] === 777)).toBe(true);
  });

  // ---- Apply confirmation ----
  // Committing a draft is otherwise invisible (the numbers simply become the
  // applied state), so every apply path confirms through the global
  // notification banner.

  const applyConfirmationText = 'Assumptions applied — rankings and calculations now use these values.';

  it('confirms a global Apply with a notification', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, '155');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Apply' }));

    expect(await screen.findByRole('status')).toHaveTextContent(applyConfirmationText);
  });

  it('confirms a drill-in Apply with a notification', async () => {
    const user = userEvent.setup();
    const { editor } = await openDirtyCategoryEditor(user);

    const applyButtons = within(editor).getAllByRole('button', { name: 'Apply' });
    await user.click(applyButtons[applyButtons.length - 1]);

    expect(await screen.findByRole('status')).toHaveTextContent(applyConfirmationText);
  });

  it('confirms "Apply and leave" with a notification once the navigation completes', async () => {
    const user = userEvent.setup();
    await openDirtyCategoryEditor(user);

    await user.click(screen.getByRole('tab', { name: 'Recipients' }));
    await screen.findByText(guardPromptTitle);
    await user.click(screen.getByRole('button', { name: 'Apply and leave' }));

    await waitFor(() => {
      expect(screen.getByTestId('location-probe')).toHaveTextContent('tab=recipients');
    });
    expect(screen.getByRole('status')).toHaveTextContent(applyConfirmationText);
  });

  it('confirms the implicit apply when Save as… commits a pending global draft', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    // Establish an applied custom state so the summary row offers Save, then
    // dismiss that apply's confirmation to isolate the one under test.
    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, '155');
    await user.click(screen.getByRole('button', { name: 'Apply' }));
    await user.click(within(await screen.findByRole('status')).getByRole('button', { name: 'Dismiss notification' }));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    // Leave a fresh draft pending; the save flow commits it before saving.
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, '160');
    await user.click(getActiveAssumptionsActionButton('Save as…'));

    expect(await screen.findByRole('heading', { name: 'Save assumptions as' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(applyConfirmationText);
    const persisted = JSON.parse(sessionStorage.getItem('customEffectsData'));
    expect(persisted.globalParameters.timeLimit).toBe(160);
  });

  // ---- Persistent draft indicators ----
  // A Global draft survives tab switches but its Apply button doesn't, so the
  // draft carries its own status layer: a count chip beside Apply, a badge on
  // the Global tab, an actionable reminder on the other tabs, and draft-
  // preview labeling on the future-value graph. All of it speaks in
  // "unapplied changes"; the applied-differences view stays draft-free.

  it('shows the unapplied count beside Apply, a Global tab badge, and Discard while the draft is dirty', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    expect(screen.queryByText(/unapplied change/)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Discard \d+ change/ })).not.toBeInTheDocument();

    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, '155');

    // The tab badge's hidden description holds the same text as the chip, so
    // chip assertions scope to the chip element.
    expect(screen.getByText('1 unapplied change', { selector: '.assumptions-draft-chip' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Global' })).toHaveAccessibleDescription('1 unapplied change');
    expect(screen.getByRole('button', { name: 'Discard 1 change' })).toBeInTheDocument();

    // A second dirty parameter bumps the count.
    const currentDiscountPct = Math.round(assumptionsData.globalParameters.discountRate * 100 * 1e10) / 1e10;
    const highDiscountPct = currentDiscountPct === 150 ? 151 : 150;
    const discountInput = screen.getByLabelText('Discount Rate (%)');
    await user.clear(discountInput);
    await user.type(discountInput, String(highDiscountPct));

    expect(screen.getByText('2 unapplied changes', { selector: '.assumptions-draft-chip' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Global' })).toHaveAccessibleDescription('2 unapplied changes');

    await user.click(screen.getByRole('button', { name: 'Apply' }));

    await waitFor(() => {
      expect(screen.queryByText(/unapplied change/)).not.toBeInTheDocument();
    });
    expect(JSON.parse(sessionStorage.getItem('customEffectsData')).globalParameters.discountRate).toBe(
      highDiscountPct / 100
    );
    expect(screen.getByRole('tab', { name: 'Global' })).not.toHaveAccessibleDescription();
    expect(screen.queryByRole('button', { name: /^Discard \d+ change/ })).not.toBeInTheDocument();
  });

  it('Discard reverts the whole draft to the applied values and clears validation errors', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    const originalTimeLimit = timeLimitInput.value;
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, '155');

    const discountInput = screen.getByLabelText('Discount Rate (%)');
    const originalDiscount = discountInput.value;
    await user.clear(discountInput);
    await user.type(discountInput, '-1');

    expect(screen.getByText('Discount rate cannot be negative')).toBeInTheDocument();
    expect(screen.getByText('Fix validation errors before applying.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();

    // The escape hatch stays available while errors block Apply.
    await user.click(screen.getByRole('button', { name: 'Discard 2 changes' }));

    expect(screen.getByLabelText('Time Limit (years)')).toHaveValue(originalTimeLimit);
    expect(screen.getByLabelText('Discount Rate (%)')).toHaveValue(originalDiscount);
    expect(screen.queryByText('Discount rate cannot be negative')).not.toBeInTheDocument();
    expect(screen.queryByText(/unapplied change/)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
    expect(sessionStorage.getItem('customEffectsData')).toBeNull();
  });

  it('reminds about the Global draft on other tabs, and Review returns to it intact', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, '155');

    await user.click(screen.getByRole('tab', { name: 'Causes' }));

    expect(screen.getByText('Global has 1 unapplied change')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Global' })).toHaveAccessibleDescription('1 unapplied change');

    await user.click(screen.getByRole('button', { name: 'Review unapplied global changes' }));

    expect(screen.getByRole('tab', { name: 'Global' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByLabelText('Time Limit (years)')).toHaveValue('155');
    expect(screen.getByText('1 unapplied change', { selector: '.assumptions-draft-chip' })).toBeInTheDocument();
    expect(screen.queryByText('Global has 1 unapplied change')).not.toBeInTheDocument();
  });

  it('keeps the draft reminder visible while a drill-in editor is open', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, '155');

    await user.click(screen.getByRole('button', { name: 'Open Category Editor' }));

    expect(await screen.findByText(/Edit effects for cause/i)).toBeInTheDocument();
    expect(screen.getByText('Global has 1 unapplied change')).toBeInTheDocument();
  });

  it('labels the future-value graph as a draft preview only when the preview actually diverges', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    expect(screen.queryByText('Preview using unapplied values')).not.toBeInTheDocument();

    // An invalid draft resolves back to the applied value, so the graph is
    // NOT previewing it — dirty form, but no draft-preview label.
    const discountInput = screen.getByLabelText('Discount Rate (%)');
    await user.clear(discountInput);
    await user.type(discountInput, '-1');
    expect(screen.getByText('Fix validation errors before applying.')).toBeInTheDocument();
    expect(screen.queryByText('Preview using unapplied values')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Discard 1 change' }));

    // A valid draft diverges: the graph says so and shows the applied total.
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, '155');
    expect(screen.getByText('Preview using unapplied values')).toBeInTheDocument();
    expect(screen.getByText(/With currently applied values:/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Apply' }));
    await waitFor(() => {
      expect(screen.queryByText('Preview using unapplied values')).not.toBeInTheDocument();
    });
    expect(screen.queryByText(/With currently applied values:/)).not.toBeInTheDocument();
  });

  // ---- Shared preview year ----
  // The editor shell owns ONE preview year: the list views and every drill-in
  // editor read and write the same value, so a list set to 2010 can never
  // silently disagree with the editor's computed costs. Computed labels name
  // the year they were computed for.

  it('shares one preview year between the list and the drill-in editor', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions?tab=categories');

    const listYear = await screen.findByLabelText('Preview calculation year');
    await user.clear(listYear);
    await user.type(listYear, '2010');

    await user.click(screen.getByRole('button', { name: 'Open Category Editor' }));
    const editorYear = await screen.findByLabelText('Preview calculations for year:');
    expect(editorYear).toHaveValue(2010);

    // Adjusting the year inside the editor adjusts the SAME year: it is
    // still set after the editor closes.
    await user.clear(editorYear);
    await user.type(editorYear, '2015');

    const editor = screen.getByText(/Edit effects for cause/i).closest('.assumptions-shell');
    const cancelButtons = within(editor).getAllByRole('button', { name: 'Cancel' });
    await user.click(cancelButtons[cancelButtons.length - 1]);
    await waitFor(() => {
      expect(screen.queryByText(/Edit effects for cause/i)).not.toBeInTheDocument();
    });
    expect(screen.getByLabelText('Preview calculation year')).toHaveValue(2015);
  });

  it('names the preview year in the combined cost label', async () => {
    const multiEffectCategoryId = Object.entries(assumptionsData.categories).find(
      ([, category]) => category.effects.length > 1
    )?.[0];
    if (!multiEffectCategoryId) {
      throw new Error('Expected a multi-effect category in the generated data');
    }

    const user = userEvent.setup();
    renderAssumptionsRoute(`/assumptions?tab=categories&categoryId=${multiEffectCategoryId}`);

    expect(await screen.findByText(`Combined cost per life in ${getCurrentYear()}:`)).toBeInTheDocument();

    const editorYear = screen.getByLabelText('Preview calculations for year:');
    await user.clear(editorYear);
    await user.type(editorYear, '2010');

    expect(screen.getByText('Combined cost per life in 2010:')).toBeInTheDocument();
  });

  it('the year control clamps out-of-range input and restores the last valid year when cleared', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions?tab=categories');

    const yearInput = await screen.findByLabelText('Preview calculation year');

    // Below the minimum clamps to the minimum — not a silent jump elsewhere.
    await user.clear(yearInput);
    await user.type(yearInput, '1850');
    await user.tab();
    expect(yearInput).toHaveValue(1900);

    await user.clear(yearInput);
    await user.type(yearInput, '2010');
    await user.tab();
    expect(yearInput).toHaveValue(2010);

    // Leaving the field empty restores the year it had, not the current year.
    await user.clear(yearInput);
    await user.tab();
    expect(yearInput).toHaveValue(2010);
  });

  it('keeps the committed year (and every computed label) while typing partial or out-of-range input', async () => {
    const multiEffectCategoryId = Object.entries(assumptionsData.categories).find(
      ([, category]) => category.effects.length > 1
    )?.[0];
    if (!multiEffectCategoryId) {
      throw new Error('Expected a multi-effect category in the generated data');
    }

    const user = userEvent.setup();
    renderAssumptionsRoute(`/assumptions?tab=categories&categoryId=${multiEffectCategoryId}`);

    const editorYear = await screen.findByLabelText('Preview calculations for year:');
    await user.clear(editorYear);
    await user.type(editorYear, '2010');
    expect(await screen.findByText('Combined cost per life in 2010:')).toBeInTheDocument();

    // Out-of-range (and partial) text stays local to the control: costs and
    // labels hold the committed year until blur resolves the input.
    await user.clear(editorYear);
    await user.type(editorYear, '1850');
    expect(editorYear).toHaveValue(1850);
    expect(screen.getByText('Combined cost per life in 2010:')).toBeInTheDocument();

    await user.tab();
    expect(editorYear).toHaveValue(1900);
    expect(screen.getByText('Combined cost per life in 1900:')).toBeInTheDocument();
  });

  it('shares the preview year with the recipient drill-in editor', async () => {
    const overrideRecipient = Object.entries(assumptionsData.recipients).find(([, recipient]) =>
      Object.values(recipient.categories || {}).some((category) => (category.effects || []).length > 0)
    );
    if (!overrideRecipient) {
      throw new Error('Expected a recipient with built-in overrides in the generated data');
    }

    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions?tab=recipients');

    const listYear = await screen.findByLabelText('Preview calculation year');
    await user.clear(listYear);
    await user.type(listYear, '2012');

    // Recipients with built-in overrides are listed without a search.
    await user.click(screen.getByRole('button', { name: `Edit ${overrideRecipient[1].name}`, exact: true }));

    const editorYear = await screen.findByLabelText('Preview calculations for year:');
    expect(editorYear).toHaveValue(2012);
  });

  it('shares the preview year with the multi-category editor and keeps its aggregate on the same year', async () => {
    const multiCategoryRecipientId = Object.entries(assumptionsData.recipients).find(
      ([, recipient]) => Object.keys(recipient.categories || {}).length > 1
    )?.[0];
    if (!multiCategoryRecipientId) {
      throw new Error('Expected a multi-category recipient in the generated data');
    }

    const user = userEvent.setup();
    renderAssumptionsRoute(`/assumptions?tab=recipients&recipientId=${multiCategoryRecipientId}`);

    const editorYear = await screen.findByLabelText('Preview calculations for year:');
    expect(editorYear).toHaveValue(getCurrentYear());

    await user.clear(editorYear);
    await user.type(editorYear, '2012');

    // The header aggregate only renders from section reports computed for
    // the current year, so once it shows, label and value agree — and no
    // label anywhere is left naming the previous year.
    expect((await screen.findAllByText('Combined cost per life in 2012:')).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(`Combined cost per life in ${getCurrentYear()}:`)).toHaveLength(0);
  });

  it('cancels the delayed active-category scroll when the user takes control', async () => {
    const multiCategoryRecipientId = Object.entries(assumptionsData.recipients).find(
      ([, recipient]) => Object.keys(recipient.categories || {}).length > 1
    )?.[0];
    if (!multiCategoryRecipientId) {
      throw new Error('Expected a multi-category recipient in the generated data');
    }
    const scrollIntoViewSpy = vi.spyOn(window.Element.prototype, 'scrollIntoView');

    renderAssumptionsRoute(`/assumptions?tab=recipients&recipientId=${multiCategoryRecipientId}`);
    fireEvent.pointerDown(window);
    await screen.findByLabelText('Preview calculations for year:');
    await new Promise((resolve) => setTimeout(resolve, 150));

    expect(scrollIntoViewSpy).not.toHaveBeenCalled();
  });

  it('lets history restoration outrank the delayed active-category landing', async () => {
    const multiCategoryRecipientId = Object.entries(assumptionsData.recipients).find(
      ([, recipient]) => Object.keys(recipient.categories || {}).length > 1
    )?.[0];
    if (!multiCategoryRecipientId) {
      throw new Error('Expected a multi-category recipient in the generated data');
    }
    const search = `?tab=recipients&recipientId=${multiCategoryRecipientId}`;
    const initialEntry = `/assumptions${search}`;
    const finishRestoration = beginHistoryEntryScrollRestoration(
      getHistoryEntryScrollId({ key: 'default', pathname: '/assumptions', search })
    );
    const scrollIntoViewSpy = vi.spyOn(window.Element.prototype, 'scrollIntoView');

    try {
      renderAssumptionsRoute(initialEntry);
      await screen.findByLabelText('Preview calculations for year:');
      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(scrollIntoViewSpy).not.toHaveBeenCalled();
    } finally {
      finishRestoration();
    }
  });

  it('aggregates the recipient header cost harmonically, matching the sitewide recipient readout', async () => {
    const multiCategoryRecipientId = Object.entries(assumptionsData.recipients).find(
      ([, recipient]) => Object.keys(recipient.categories || {}).length > 1
    )?.[0];
    if (!multiCategoryRecipientId) {
      throw new Error('Expected a multi-category recipient in the generated data');
    }

    renderAssumptionsRoute(`/assumptions?tab=recipients&recipientId=${multiCategoryRecipientId}`);

    // The recipient-level aggregate lives in the editor header; per-category
    // sections render their own combined labels inside .effect-card. It only
    // renders once every section has reported, hence the waitFor.
    let headerLabel;
    await waitFor(() => {
      const labels = screen.queryAllByText(`Combined cost per life in ${getCurrentYear()}:`);
      headerLabel = labels.find((label) => label.closest('.effect-card') === null);
      expect(headerLabel).toBeDefined();
    });

    // With untouched drafts, the header must equal the harmonic recipient
    // aggregate shown everywhere else — a weighted arithmetic mean here once
    // contradicted the recipient card an order of magnitude apart.
    const combined = createCombinedAssumptions(assumptionsData, null);
    const expected = formatCurrency(
      getCostPerLifeForRecipientFromCombined(combined, multiCategoryRecipientId, getCurrentYear())
    );
    expect(headerLabel.parentElement).toHaveTextContent(expected);
  });

  it('gives every field in the multi-category editor a unique id', async () => {
    const multiCategoryRecipientId = Object.entries(assumptionsData.recipients).find(
      ([, recipient]) => Object.keys(recipient.categories || {}).length > 1
    )?.[0];
    if (!multiCategoryRecipientId) {
      throw new Error('Expected a multi-category recipient in the generated data');
    }

    renderAssumptionsRoute(`/assumptions?tab=recipients&recipientId=${multiCategoryRecipientId}`);

    const editor = (await screen.findByText(/Edit effects for recipient/i)).closest('.assumptions-shell');
    // Every category section indexes its effects from 0, so without a
    // per-section id prefix the sections would repeat ids — and label /
    // aria-errormessage references would resolve to another section's field.
    const ids = Array.from(editor.querySelectorAll('[id]')).map((element) => element.id);
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('links each effect to the rationale for its defaults', async () => {
    renderAssumptionsRoute(`/assumptions?tab=categories&categoryId=${firstValidCategoryId}`);

    await screen.findByText(/Edit effects for cause/i);

    const rationaleLinks = screen.getAllByRole('link', { name: 'Why these values?' });
    expect(rationaleLinks).toHaveLength(assumptionsData.categories[firstValidCategoryId].effects.length);
    expect(rationaleLinks[0]).toHaveAttribute(
      'href',
      `/cause/${encodeURIComponent(firstValidCategoryId)}#full-justification`
    );
  });

  it('"Apply and leave" keeps you in the editor when the drill-in draft has validation errors', async () => {
    const user = userEvent.setup();
    // Clearing a category effect field is a change AND a validation error.
    await openDirtyCategoryEditor(user, '');

    await user.click(screen.getByRole('tab', { name: 'Recipients' }));
    await screen.findByText(guardPromptTitle);
    await user.click(screen.getByRole('button', { name: 'Apply and leave' }));

    await waitFor(() => {
      expect(screen.queryByText(guardPromptTitle)).not.toBeInTheDocument();
    });
    expect(screen.getByTestId('location-probe')).toHaveTextContent(`categoryId=${firstValidCategoryId}`);
    expect(screen.getByText(/is required/i)).toBeInTheDocument();
    expect(sessionStorage.getItem('customEffectsData')).toBeNull();
  });

  it('the editor footer Cancel discards a dirty draft without prompting', async () => {
    const user = userEvent.setup();
    const { editor } = await openDirtyCategoryEditor(user);

    const cancelButtons = within(editor).getAllByRole('button', { name: 'Cancel' });
    await user.click(cancelButtons[cancelButtons.length - 1]);

    expect(screen.queryByText(guardPromptTitle)).not.toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText(/Edit effects for cause/i)).not.toBeInTheDocument();
    });
    expect(sessionStorage.getItem('customEffectsData')).toBeNull();
  });

  it('guards the browser back button while the drill-in draft is dirty', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions?tab=categories');

    await user.click(screen.getByRole('button', { name: 'Open Category Editor' }));
    const editor = (await screen.findByText(/Edit effects for cause/i)).closest('.assumptions-shell');
    const input = await typeIntoFirstCostField(user, editor, '777');

    await user.click(screen.getByRole('button', { name: 'Go Back' }));
    expect(await screen.findByText(guardPromptTitle)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Keep editing' }));
    await waitFor(() => {
      expect(screen.queryByText(guardPromptTitle)).not.toBeInTheDocument();
    });
    expect(screen.getByTestId('location-probe')).toHaveTextContent(`categoryId=${firstValidCategoryId}`);
    expect(input).toHaveValue('777');
  });

  it('guards tab switches away from a dirty recipient editor and applies via the prompt', async () => {
    const singleCategoryRecipient = Object.entries(assumptionsData.recipients).find(
      ([, recipient]) => Object.keys(recipient.categories || {}).length === 1
    );
    if (!singleCategoryRecipient) {
      throw new Error('Expected a single-category recipient in default assumptions data');
    }
    const [recipientId] = singleCategoryRecipient;

    const user = userEvent.setup();
    renderAssumptionsRoute(`/assumptions?tab=recipients&recipientId=${recipientId}`);
    const editor = (await screen.findByText(/Edit effects for recipient/i)).closest('.assumptions-shell');

    const input = within(editor).getAllByRole('textbox', { name: /cost per|population|qaly/i })[0];
    await user.clear(input);
    await user.type(input, '123');

    await user.click(screen.getByRole('tab', { name: 'Causes' }));
    await screen.findByText(guardPromptTitle);
    await user.click(screen.getByRole('button', { name: 'Apply and leave' }));

    await waitFor(() => {
      expect(screen.getByTestId('location-probe')).toHaveTextContent('tab=categories');
    });
    expect(JSON.parse(sessionStorage.getItem('customEffectsData')).recipients?.[recipientId]).toBeDefined();
  });

  it('applies a recipient cost override that replaces a persisted multiplier without crashing', async () => {
    // Multipliers no longer ship in default data and cannot be entered
    // through the editor (override-only UI), but persisted assumptions from
    // saved library entries or shared links can still carry them. Combining
    // one with a built-in override empties the superseded override map, so
    // this pins the whole flow: render, edit, and apply over a seeded
    // multiplier.
    const recipientWithOverride = Object.entries(assumptionsData.recipients).find(([, recipient]) =>
      Object.values(recipient.categories || {}).some((category) =>
        (category.effects || []).some((effect) =>
          Object.keys(effect.overrides || {}).some(
            (field) => field === 'costPerQALY' || field === 'costPerMicroprobability'
          )
        )
      )
    );
    if (!recipientWithOverride) {
      throw new Error('Expected a recipient with a built-in cost override in default assumptions data');
    }

    const [recipientId, recipient] = recipientWithOverride;
    const [categoryId, recipientCategory] = Object.entries(recipient.categories).find(([, category]) =>
      (category.effects || []).some((effect) =>
        Object.keys(effect.overrides || {}).some(
          (field) => field === 'costPerQALY' || field === 'costPerMicroprobability'
        )
      )
    );
    const recipientEffect = recipientCategory.effects.find((effect) =>
      Object.keys(effect.overrides || {}).some(
        (field) => field === 'costPerQALY' || field === 'costPerMicroprobability'
      )
    );
    const field = Object.keys(recipientEffect.overrides).find(
      (name) => name === 'costPerQALY' || name === 'costPerMicroprobability'
    );
    const label = field === 'costPerQALY' ? 'Cost per life-year' : 'Cost per microprobability';

    // Seeded custom assumptions would otherwise trigger the one-time
    // migration prompt, which opens a competing dialog.
    localStorage.setItem(__internal.SAVED_ASSUMPTIONS_MIGRATION_KEY, '1');
    sessionStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        recipients: {
          [recipientId]: {
            categories: {
              [categoryId]: {
                effects: [{ effectId: recipientEffect.effectId, multipliers: { [field]: 2 } }],
              },
            },
          },
        },
      })
    );

    const user = userEvent.setup();
    // Land on the recipients list first: its cost readouts run the combined
    // recipient through validateRecipient, which is exactly where an emptied
    // override map used to throw. The drill-in editor alone never hits it.
    renderAssumptionsRoute('/assumptions?tab=recipients');
    await user.click(await screen.findByRole('button', { name: `Edit ${recipient.name}` }));
    const editor = (await screen.findByText(/Edit effects for recipient/i)).closest('.assumptions-shell');
    const input = within(editor).getByRole('textbox', { name: label });
    fireEvent.change(input, { target: { value: '1,234,567' } });

    const applyButtons = within(editor).getAllByRole('button', { name: 'Apply' });
    await user.click(applyButtons[applyButtons.length - 1]);

    expect(await screen.findByRole('status')).toHaveTextContent(applyConfirmationText);
    await waitFor(() => {
      expect(screen.queryByText(/Edit effects for recipient/i)).not.toBeInTheDocument();
    });

    const persisted = JSON.parse(sessionStorage.getItem('customEffectsData'));
    const savedEffect = persisted.recipients[recipientId].categories[categoryId].effects.find(
      (effect) => effect.effectId === recipientEffect.effectId
    );
    expect(savedEffect.overrides[field]).toBe(1234567);
    expect(savedEffect.multipliers).toBeUndefined();
  });

  it('guards a dirty multi-category recipient editor the same way', async () => {
    const multiCategoryRecipient = Object.entries(assumptionsData.recipients).find(
      ([, recipient]) => Object.keys(recipient.categories || {}).length > 1
    );
    if (!multiCategoryRecipient) {
      throw new Error('Expected a multi-category recipient in default assumptions data');
    }
    const [recipientId] = multiCategoryRecipient;

    const user = userEvent.setup();
    renderAssumptionsRoute(`/assumptions?tab=recipients&recipientId=${recipientId}`);
    const editor = (await screen.findByText(/Edit effects for recipient/i)).closest('.assumptions-shell');

    const input = within(editor).getAllByRole('textbox', { name: /cost per|population|qaly/i })[0];
    await user.clear(input);
    await user.type(input, '123');

    await user.click(screen.getByRole('tab', { name: 'Causes' }));
    await screen.findByText(guardPromptTitle);
    await user.click(screen.getByRole('button', { name: 'Apply and leave' }));

    await waitFor(() => {
      expect(screen.getByTestId('location-probe')).toHaveTextContent('tab=categories');
    });
    expect(JSON.parse(sessionStorage.getItem('customEffectsData')).recipients?.[recipientId]).toBeDefined();
  });

  it('applies both un-applied global edits and the drill-in draft when leaving the page', async () => {
    const user = userEvent.setup();
    const { fieldKey } = categoryEditorField();
    renderAssumptionsRoute('/assumptions');

    const updatedTimeLimit = assumptionsData.globalParameters.timeLimit + 50;
    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, String(updatedTimeLimit));

    // Moving into a drill-in is a same-page navigation: no prompt, and the
    // global draft survives it.
    await user.click(screen.getByRole('button', { name: 'Open Category Editor' }));
    const editor = (await screen.findByText(/Edit effects for cause/i)).closest('.assumptions-shell');
    expect(screen.queryByText(guardPromptTitle)).not.toBeInTheDocument();
    await typeIntoFirstCostField(user, editor, '777');

    await user.click(screen.getByRole('button', { name: 'Go Home' }));
    await screen.findByText(guardPromptTitle);
    // Leaving the page threatens both drafts, and the prompt says so.
    expect(screen.getByText(/You changed global parameters and effects for/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Apply and leave' }));
    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
    const persisted = JSON.parse(sessionStorage.getItem('customEffectsData'));
    expect(persisted.globalParameters.timeLimit).toBe(updatedTimeLimit);
    expect(persisted.categories[firstValidCategoryId].effects.some((effect) => effect[fieldKey] === 777)).toBe(true);
  });

  it('applies the valid drill-in draft and holds invalid global edits when leaving via "Apply and leave"', async () => {
    // Pins the DELIBERATE partial-apply semantics (see handleApplyAndLeave):
    // the drill-in payload commits first; the global validation failure then
    // cancels the navigation, landing on the Global tab with the error shown
    // and the drill-in work already applied.
    const user = userEvent.setup();
    const { fieldKey } = categoryEditorField();
    renderAssumptionsRoute('/assumptions');

    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, '0');

    await user.click(screen.getByRole('button', { name: 'Open Category Editor' }));
    const editor = (await screen.findByText(/Edit effects for cause/i)).closest('.assumptions-shell');
    await typeIntoFirstCostField(user, editor, '777');

    await user.click(screen.getByRole('button', { name: 'Go Home' }));
    await screen.findByText(guardPromptTitle);
    await user.click(screen.getByRole('button', { name: 'Apply and leave' }));

    await waitFor(() => {
      expect(screen.queryByText(guardPromptTitle)).not.toBeInTheDocument();
    });
    expect(screen.getByTestId('location-probe')).toHaveTextContent('/assumptions');
    expect(await screen.findByText('Time limit must be positive')).toBeInTheDocument();
    // The partial commit is announced with an info notice — not the success
    // confirmation, which would ring false next to the validation errors
    // that are holding the navigation.
    expect(screen.getByRole('status')).toHaveTextContent(
      'Your effect edits were applied. Fix the global parameter errors before leaving.'
    );
    const persisted = JSON.parse(sessionStorage.getItem('customEffectsData'));
    expect(persisted.globalParameters?.timeLimit).toBeUndefined();
    expect(persisted.categories[firstValidCategoryId].effects.some((effect) => effect[fieldKey] === 777)).toBe(true);
  });

  it('asks the browser to confirm unload while drill-in edits are unapplied', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute(`/assumptions?tab=categories&categoryId=${firstValidCategoryId}`);
    const editor = (await screen.findByText(/Edit effects for cause/i)).closest('.assumptions-shell');

    const fireBeforeUnload = () => {
      const event = new Event('beforeunload', { cancelable: true });
      window.dispatchEvent(event);
      return event.defaultPrevented;
    };

    expect(fireBeforeUnload()).toBe(false);
    await typeIntoFirstCostField(user, editor, '777');
    expect(fireBeforeUnload()).toBe(true);
  });

  it('preserves unapplied global drafts when reverting an unrelated change in the differences section', async () => {
    const user = userEvent.setup();

    const categoryEffect = assumptionsData.categories[firstValidCategoryId].effects[0];
    const categoryField = categoryEffect.costPerQALY !== undefined ? 'costPerQALY' : 'costPerMicroprobability';
    localStorage.setItem(__internal.SAVED_ASSUMPTIONS_MIGRATION_KEY, '1');
    sessionStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        categories: {
          [firstValidCategoryId]: {
            effects: [{ effectId: categoryEffect.effectId, [categoryField]: categoryEffect[categoryField] * 2 }],
          },
        },
      })
    );

    renderAssumptionsRoute('/assumptions');

    const draftValue = assumptionsData.globalParameters.timeLimit + 50;
    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, String(draftValue));
    const draftDisplay = timeLimitInput.value;

    const toggle = screen.getByRole('button', { name: /differences? from default assumptions/i });
    await user.click(toggle);
    const section = toggle.closest('.review-changes-section');
    await user.click(within(section).getByRole('button', { name: /^Revert / }));

    // Nothing differs any more, so the section disappears.
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /differences? from default assumptions/i })).not.toBeInTheDocument();
    });

    // Reverting a cause change must not clobber the unapplied global draft.
    expect(screen.getByLabelText('Time Limit (years)')).toHaveValue(draftDisplay);
    expect(screen.getByRole('button', { name: 'Apply' })).toBeEnabled();
  });

  it('preserves unapplied global drafts when loading a saved set that does not touch them', async () => {
    const user = userEvent.setup();

    const defaultDiscountRate = assumptionsData.globalParameters.discountRate;
    const entryDiscountRate = defaultDiscountRate === 0.07 ? 0.09 : 0.07;
    saveNewAssumptions({
      label: 'Discount Only',
      assumptions: {
        globalParameters: { discountRate: entryDiscountRate },
        categories: {},
        recipients: {},
      },
    });

    renderAssumptionsRoute('/assumptions');

    const draftValue = assumptionsData.globalParameters.timeLimit + 50;
    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, String(draftValue));
    const draftDisplay = timeLimitInput.value;

    const { menu } = await openAssumptionsLibraryMenu(user);
    await user.click(
      within(getAssumptionsLibraryRow(menu, 'Discount Only')).getByRole('button', { name: /Discount Only/ })
    );

    // The loaded set's parameter hydrates; the untouched draft survives.
    // (×100 with the same float-artifact rounding the form applies.)
    await waitFor(() => {
      expect(screen.getByLabelText('Discount Rate (%)')).toHaveValue(
        String(Math.round(entryDiscountRate * 100 * 1e10) / 1e10)
      );
    });
    expect(screen.getByLabelText('Time Limit (years)')).toHaveValue(draftDisplay);

    // Contract for the two dirtiness indicators: the panel reports the
    // APPLIED state (the loaded entry is active and clean — the draft is not
    // applied), so the entry keeps its normal presentation with no Save
    // action and no "Custom (unnamed)" pseudo-entry. The
    // surviving draft is the editor's concern and shows as its enabled
    // Apply, protected by the navigation guard.
    const summary = getAssumptionsLibrarySummary();
    expect(within(summary).getByText('Discount Only')).toBeInTheDocument();
    expect(within(summary).getByText('Local')).toBeInTheDocument();
    expect(within(summary).queryByText('Custom (unnamed)')).not.toBeInTheDocument();
    expect(queryActiveAssumptionsActionButton('Save as…')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeEnabled();
  });

  it('reviews and reverts applied global changes from the differences section', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    expect(await screen.findByLabelText('Time Limit (years)')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /differences? from default assumptions/i })).not.toBeInTheDocument();
    // No phantom wrapper spacing in the panel either — the page gates the
    // slot on changeCount, since a null-rendering element is still truthy.
    expect(document.querySelector('.saved-assumptions-panel__review')).toBeNull();

    const defaultTimeLimit = assumptionsData.globalParameters.timeLimit;
    const updatedTimeLimit = defaultTimeLimit + 50;
    const timeLimitInput = screen.getByLabelText('Time Limit (years)');
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, String(updatedTimeLimit));
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    const toggle = await screen.findByRole('button', { name: /differences? from default assumptions/i });
    expect(toggle).toHaveTextContent('Show 1 difference from default assumptions');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');

    const section = toggle.closest('.review-changes-section');
    const row = within(section).getByText('Time Limit (years)').closest('li');
    expect(row).toHaveTextContent(String(defaultTimeLimit));
    expect(row).toHaveTextContent(String(updatedTimeLimit));

    await user.click(within(section).getByRole('button', { name: 'Revert Time Limit (years)' }));

    // Nothing differs from the defaults any more: the section disappears.
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /differences? from default assumptions/i })).not.toBeInTheDocument();
    });
    expect(sessionStorage.getItem('customEffectsData')).toBeNull();
  });

  it('lists cause and recipient changes in the differences section and reverts them individually', async () => {
    const user = userEvent.setup();

    const categoryEffect = assumptionsData.categories[firstValidCategoryId].effects[0];
    const categoryField = categoryEffect.costPerQALY !== undefined ? 'costPerQALY' : 'costPerMicroprobability';

    // A recipient category without default effect wrappers keeps the expected
    // diff to exactly the one override we seed.
    const [plainRecipientId, plainRecipient] = Object.entries(assumptionsData.recipients).find(([, recipient]) =>
      Object.entries(recipient.categories || {}).some(([, category]) => !category.effects?.length)
    );
    const plainCategoryId = Object.entries(plainRecipient.categories).find(
      ([, category]) => !category.effects?.length
    )[0];
    const recipientBaseEffect = assumptionsData.categories[plainCategoryId].effects[0];
    const recipientField = recipientBaseEffect.costPerQALY !== undefined ? 'costPerQALY' : 'costPerMicroprobability';

    // Seeded custom assumptions would otherwise trigger the one-time
    // migration prompt, which opens a competing dialog.
    localStorage.setItem(__internal.SAVED_ASSUMPTIONS_MIGRATION_KEY, '1');
    sessionStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        categories: {
          [firstValidCategoryId]: {
            effects: [{ effectId: categoryEffect.effectId, [categoryField]: categoryEffect[categoryField] * 2 }],
          },
        },
        recipients: {
          [plainRecipientId]: {
            categories: {
              [plainCategoryId]: {
                effects: [{ effectId: recipientBaseEffect.effectId, overrides: { [recipientField]: 123457 } }],
              },
            },
          },
        },
      })
    );

    renderAssumptionsRoute('/assumptions');

    const toggle = await screen.findByRole('button', { name: /differences? from default assumptions/i });
    expect(toggle).toHaveTextContent('Show 2 differences from default assumptions');
    await user.click(toggle);
    const section = toggle.closest('.review-changes-section');

    const categoryName = assumptionsData.categories[firstValidCategoryId].name;
    const recipientGroupTitle = `${plainRecipient.name} · ${assumptionsData.categories[plainCategoryId].name}`;
    expect(within(section).getByText(categoryName)).toBeInTheDocument();
    expect(within(section).getByText(recipientGroupTitle)).toBeInTheDocument();
    // The recipient row's "before" side resolves to the concrete cause value.
    expect(within(section).getByText('from cause')).toBeInTheDocument();

    const revertButtons = within(section).getAllByRole('button', { name: /^Revert / });
    expect(revertButtons).toHaveLength(2);
    await user.click(revertButtons[0]);

    await waitFor(() => {
      expect(within(section).getAllByRole('button', { name: /^Revert / })).toHaveLength(1);
    });
    // The count updates live in the disclosure label (open → "Hide").
    expect(screen.getByRole('button', { name: /differences? from default assumptions/i })).toHaveTextContent(
      'Hide 1 difference from default assumptions'
    );
  });

  it('hides Save as… when there are no custom assumptions', async () => {
    renderAssumptionsRoute('/assumptions');
    expect(await screen.findByText('Assumptions')).toBeInTheDocument();
    expect(queryActiveAssumptionsActionButton('Save as…')).not.toBeInTheDocument();
    expect(queryActiveAssumptionsActionButton('Share')).not.toBeInTheDocument();
  });

  it('shows curated assumptions profiles in the library and loads them as read-only presets', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    const { menu } = await openAssumptionsLibraryMenu(user);
    const longtermistRow = getAssumptionsLibraryRow(menu, 'Longtermist (10 billion years)');
    expect(within(longtermistRow).getByText('Curated')).toBeInTheDocument();
    expect(within(longtermistRow).queryByRole('button', { name: 'Rename' })).not.toBeInTheDocument();
    expect(within(longtermistRow).queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
    expect(within(longtermistRow).getByRole('button', { name: 'Copy Link' })).toBeInTheDocument();

    await user.click(longtermistRow.querySelector('[data-menu-item]'));

    await waitFor(() => {
      expect(screen.getByLabelText('Time Limit (years)')).toHaveValue('10,000,000,000');
      expect(screen.getByLabelText('Population Growth Rate (%)')).toHaveValue('0.000002');
    });

    expect(JSON.parse(sessionStorage.getItem('customEffectsData'))).toEqual({
      globalParameters: longtermistGlobalParameters,
    });
    expect(sessionStorage.getItem('activeSavedAssumptionsId:v1')).toBe('curated:longtermist');

    const activeRow = getAssumptionsLibrarySummary();
    expect(activeRow).toHaveAttribute('data-active', 'true');
    expect(within(activeRow).getByText('Longtermist (10 billion years)')).toBeInTheDocument();

    await user.click(within(activeRow).getByRole('button', { name: 'View description' }));
    const descriptionModal = screen
      .getByRole('heading', { name: 'Longtermist (10 billion years)' })
      .closest('.impact-modal');
    expect(within(descriptionModal).getByRole('region', { name: 'Description:' })).toHaveTextContent(
      '10 billion years'
    );
    expect(screen.queryByRole('button', { name: 'Save Description' })).not.toBeInTheDocument();
  });

  it('does not show Save or Share actions for an active curated assumptions set', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    const { menu } = await openAssumptionsLibraryMenu(user);
    const row = getAssumptionsLibraryRow(menu, 'Longtermist (10 billion years)');
    await user.click(row.querySelector('[data-menu-item]'));

    await waitFor(() => {
      expect(queryActiveAssumptionsActionButton('Save as…')).not.toBeInTheDocument();
      expect(queryActiveAssumptionsActionButton('Share')).not.toBeInTheDocument();
      expect(getActiveAssumptionsActionButton('Copy Link')).toBeInTheDocument();
    });
  });

  it('saves current assumptions to the browser and marks entry active', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, '175');
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    await user.click(getActiveAssumptionsActionButton('Save as…'));
    expect(await screen.findByRole('heading', { name: 'Save assumptions as' })).toBeInTheDocument();

    const labelInput = screen.getByLabelText('Label');
    expect(labelInput).toHaveValue('');
    await user.clear(labelInput);
    await user.type(labelInput, 'My Local Snapshot');
    await user.type(
      screen.getByLabelText('Description (optional)'),
      'Longer time horizon with a lower discount rate for current planning.'
    );
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText('My Local Snapshot')).toBeInTheDocument();
    const savedRow = getAssumptionsLibrarySummary();
    await user.click(within(savedRow).getByRole('button', { name: 'View description' }));
    const descriptionModal = screen.getByRole('heading', { name: 'My Local Snapshot' }).closest('.impact-modal');
    expect(within(descriptionModal).getByLabelText('Description:')).toHaveValue(
      'Longer time horizon with a lower discount rate for current planning.'
    );
    expect(within(descriptionModal).getByRole('button', { name: 'Save Description' })).toBeInTheDocument();
    await user.click(within(descriptionModal).getByRole('button', { name: 'Cancel' }));
    const summaryRow = getAssumptionsLibrarySummary();
    expect(summaryRow).toHaveAttribute('data-active', 'true');
    expect(within(summaryRow).getByText('My Local Snapshot')).toBeInTheDocument();

    const savedRaw = localStorage.getItem('savedAssumptions:v1');
    expect(savedRaw).toBeTruthy();
    const savedEntries = JSON.parse(savedRaw);
    expect(savedEntries).toHaveLength(1);
    expect(savedEntries[0].label).toBe('My Local Snapshot');
    expect(savedEntries[0].description).toBe('Longer time horizon with a lower discount rate for current planning.');
  });

  it('shows remaining description characters only after 2000 characters in the save modal', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, '175');
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    await user.click(getActiveAssumptionsActionButton('Save as…'));
    expect(await screen.findByRole('heading', { name: 'Save assumptions as' })).toBeInTheDocument();

    const descriptionInput = screen.getByLabelText('Description (optional)');
    fireEvent.change(descriptionInput, { target: { value: 'a'.repeat(2000) } });
    expect(screen.queryByText(/characters remaining/i)).not.toBeInTheDocument();

    fireEvent.change(descriptionInput, { target: { value: 'a'.repeat(2001) } });
    expect(screen.getByText('999 characters remaining')).toBeInTheDocument();
  });

  it('updates the active saved assumptions entry in place', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: 150,
        },
      })
    );

    const seeded = saveNewAssumptions({
      label: 'Current Working Model',
      description: 'Original saved description.',
      assumptions: {
        globalParameters: {
          timeLimit: 150,
        },
        categories: {},
        recipients: {},
      },
    });
    if (!seeded.ok) {
      throw new Error('Expected seeded saved assumptions entry');
    }
    setActiveSavedAssumptionsId(seeded.entry.id);
    sessionStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: 150,
        },
      })
    );

    renderAssumptionsRoute('/assumptions');

    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, '205');
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    await user.click(getActiveAssumptionsActionButton('Save as…'));
    expect(await screen.findByRole('button', { name: 'Update Saved Assumptions' })).toBeInTheDocument();
    // The overwrite target is named in the modal copy (labels are uncapped,
    // so prose — not the button — carries the variable-length text).
    const saveDialog = screen.getByRole('dialog');
    expect(within(saveDialog).getByText('Current Working Model')).toBeInTheDocument();
    expect(screen.getByLabelText('Label')).toHaveValue('');
    const descriptionInput = screen.getByLabelText('Description (optional)');
    expect(descriptionInput).toHaveValue('');
    await user.type(descriptionInput, 'Extended horizon after reviewing sensitivity analysis.');
    await user.click(screen.getByRole('button', { name: 'Update Saved Assumptions' }));

    const savedEntries = JSON.parse(localStorage.getItem('savedAssumptions:v1'));
    expect(savedEntries).toHaveLength(1);
    expect(savedEntries[0].id).toBe(seeded.entry.id);
    expect(savedEntries[0].assumptions.globalParameters.timeLimit).toBe(205);
    expect(savedEntries[0].description).toBe('Extended horizon after reviewing sensitivity analysis.');
  });

  it('edits a local saved assumption description from the description modal', async () => {
    const user = userEvent.setup();

    const seeded = saveNewAssumptions({
      label: 'Described Entry',
      description: 'Original description',
      assumptions: {
        globalParameters: { timeLimit: 150 },
        categories: {},
        recipients: {},
      },
    });
    if (!seeded.ok) {
      throw new Error('Expected seeded saved assumptions entry');
    }
    setActiveSavedAssumptionsId(seeded.entry.id);
    sessionStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: 150,
        },
      })
    );

    renderAssumptionsRoute('/assumptions');

    const row = getAssumptionsLibrarySummary();
    await user.click(within(row).getByRole('button', { name: 'View description' }));
    const descriptionInput = screen.getByLabelText('Description:');
    expect(descriptionInput).toHaveValue('Original description');
    await user.clear(descriptionInput);
    await user.type(descriptionInput, 'Updated from modal');
    await user.click(screen.getByRole('button', { name: 'Save Description' }));

    const savedEntries = JSON.parse(localStorage.getItem('savedAssumptions:v1'));
    expect(savedEntries[0].description).toBe('Updated from modal');
  });

  it('does not close the description modal when scrim dismissal is rejected by the discard confirmation', async () => {
    const user = userEvent.setup();

    const seeded = saveNewAssumptions({
      label: 'Dirty Description',
      description: 'Original description',
      assumptions: {
        globalParameters: { timeLimit: 150 },
        categories: {},
        recipients: {},
      },
    });
    if (!seeded.ok) {
      throw new Error('Expected seeded saved assumptions entry');
    }
    setActiveSavedAssumptionsId(seeded.entry.id);
    sessionStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: 150,
        },
      })
    );

    const confirmSpy = vi.spyOn(globalThis, 'confirm').mockReturnValue(false);

    renderAssumptionsRoute('/assumptions');

    const row = getAssumptionsLibrarySummary();
    await user.click(within(row).getByRole('button', { name: 'View description' }));
    const descriptionInput = screen.getByLabelText('Description:');
    await user.clear(descriptionInput);
    await user.type(descriptionInput, 'Changed but not saved');
    await user.click(document.querySelector('.impact-modal__scrim'));

    expect(confirmSpy).toHaveBeenCalledWith('Discard unsaved description changes?');
    expect(screen.getByRole('heading', { name: 'Dirty Description' })).toBeInTheDocument();
    expect(screen.getByLabelText('Description:')).toHaveValue('Changed but not saved');
  });

  it('closes the description modal immediately when cancel is clicked', async () => {
    const user = userEvent.setup();

    const seeded = saveNewAssumptions({
      label: 'Cancel Closes',
      description: 'Original description',
      assumptions: {
        globalParameters: { timeLimit: 150 },
        categories: {},
        recipients: {},
      },
    });
    if (!seeded.ok) {
      throw new Error('Expected seeded saved assumptions entry');
    }
    setActiveSavedAssumptionsId(seeded.entry.id);
    sessionStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: 150,
        },
      })
    );

    const confirmSpy = vi.spyOn(globalThis, 'confirm').mockReturnValue(false);

    renderAssumptionsRoute('/assumptions');

    const row = getAssumptionsLibrarySummary();
    await user.click(within(row).getByRole('button', { name: 'View description' }));
    const descriptionInput = screen.getByLabelText('Description:');
    await user.clear(descriptionInput);
    await user.type(descriptionInput, 'Changed but not saved');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(confirmSpy).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Cancel Closes' })).not.toBeInTheDocument();
    });
  });

  it('shows remote descriptions as read-only in the description modal', async () => {
    const user = userEvent.setup();

    const seeded = saveNewAssumptions({
      label: 'Remote Description',
      description: 'Immutable remote note',
      assumptions: {
        globalParameters: { timeLimit: 150 },
        categories: {},
        recipients: {},
      },
      reference: 'remote-description',
      source: 'local',
    });
    if (!seeded.ok) {
      throw new Error('Expected seeded saved assumptions entry');
    }
    setActiveSavedAssumptionsId(seeded.entry.id);
    sessionStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: 150,
        },
      })
    );

    renderAssumptionsRoute('/assumptions');

    const row = getAssumptionsLibrarySummary();
    await user.click(within(row).getByRole('button', { name: 'View description' }));
    const descriptionModal = screen.getByRole('heading', { name: 'Remote Description' }).closest('.impact-modal');
    expect(within(descriptionModal).getByRole('region', { name: 'Description:' })).toHaveTextContent(
      'Immutable remote note'
    );
    expect(screen.queryByRole('button', { name: 'Save Description' })).not.toBeInTheDocument();
  });

  it('does not show a description action for remote assumptions without a description', async () => {
    const remoteSeed = saveNewAssumptions({
      label: 'Remote Without Description',
      assumptions: {
        globalParameters: { timeLimit: 150 },
        categories: {},
        recipients: {},
      },
      reference: 'remote-without-description',
      source: 'local',
    });
    if (!remoteSeed.ok) {
      throw new Error('Expected seeded saved assumptions entry');
    }

    renderAssumptionsRoute('/assumptions');

    const { menu } = await openAssumptionsLibraryMenu(userEvent.setup());
    const row = getAssumptionsLibraryRow(menu, 'Remote Without Description');
    // Target the action labels precisely — the row's LOAD button is also a
    // button and its accessible name contains the entry label ("…Description").
    expect(within(row).queryByRole('button', { name: /view description|add description/i })).not.toBeInTheDocument();
  });

  it('does not allow replacing remote saved assumptions and saves as new local instead', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: 150,
        },
      })
    );

    const remoteSeed = saveNewAssumptions({
      label: 'Remote Snapshot',
      assumptions: {
        globalParameters: {
          timeLimit: 150,
        },
        categories: {},
        recipients: {},
      },
      source: 'local',
      reference: 'remote-snapshot',
    });
    if (!remoteSeed.ok) {
      throw new Error('Expected seeded remote entry');
    }
    setActiveSavedAssumptionsId(remoteSeed.entry.id);

    renderAssumptionsRoute('/assumptions');

    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, '205');
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    await user.click(getActiveAssumptionsActionButton('Save as…'));
    expect(await screen.findByRole('heading', { name: 'Save assumptions as' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Update / })).not.toBeInTheDocument();

    const labelInput = screen.getByLabelText('Label');
    await user.clear(labelInput);
    await user.type(labelInput, 'Local Fork');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    const savedEntries = JSON.parse(localStorage.getItem('savedAssumptions:v1'));
    expect(savedEntries).toHaveLength(2);

    const originalRemote = savedEntries.find((entry) => entry.id === remoteSeed.entry.id);
    expect(originalRemote.reference).toBe('remote-snapshot');
    expect(originalRemote.assumptions.globalParameters.timeLimit).toBe(150);

    const localFork = savedEntries.find((entry) => entry.label === 'Local Fork');
    expect(localFork).toBeTruthy();
    expect(localFork.reference).toBeNull();
    expect(localFork.source).toBe('local');
    expect(localFork.assumptions.globalParameters.timeLimit).toBe(205);
  });

  it('updates matching saved assumptions entry with share reference after link creation', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: 175,
        },
      })
    );

    const seeded = saveNewAssumptions({
      label: 'My Snapshot',
      description: 'Local description before sharing.',
      assumptions: {
        globalParameters: { timeLimit: 175 },
        categories: {},
        recipients: {},
      },
      source: 'local',
    });
    if (!seeded.ok) {
      throw new Error('Expected seeded saved assumptions entry');
    }
    setActiveSavedAssumptionsId(seeded.entry.id);

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 'share-175',
        description: 'Remote description after editing.',
        reference: 'share-175',
      }),
    });

    renderAssumptionsRoute('/assumptions');

    await user.click(getActiveAssumptionsActionButton('Share'));
    const shareDescription = screen.getByLabelText('Description (optional)');
    expect(shareDescription).toHaveValue('Local description before sharing.');
    await user.clear(shareDescription);
    await user.type(shareDescription, 'Remote description after editing.');
    await user.click(await screen.findByRole('button', { name: 'Create Link' }));
    expect(await screen.findByText('Share link created.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Done' }));

    await waitFor(() => {
      const entries = JSON.parse(localStorage.getItem('savedAssumptions:v1'));
      expect(entries).toHaveLength(1);
      expect(entries[0].reference).toBe('share-175');
      expect(entries[0].description).toBe('Remote description after editing.');
      expect(entries[0].source).toBe('local');
    });

    const row = getAssumptionsLibrarySummary();
    expect(within(row).getByText('My Snapshot')).toBeInTheDocument();
    expect(within(row).getByText('Remote')).toBeInTheDocument();
    expect(within(row).getByRole('button', { name: 'Copy Link' })).toBeInTheDocument();

    expect(
      fetchMock.mock.calls.some(([url, options]) => url === '/api/shared-assumptions' && options?.method === 'POST')
    ).toBe(true);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
      name: 'My Snapshot',
      description: 'Remote description after editing.',
    });
  });

  it('uses the new link slug instead of a stale curated name when sharing edited curated assumptions', async () => {
    const user = userEvent.setup();
    const longtermistTimeLimit = longtermistGlobalParameters.timeLimit;
    const slightlyLongerTimeLimit = longtermistTimeLimit + 1;
    sessionStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          ...longtermistGlobalParameters,
        },
      })
    );
    setActiveSavedAssumptionsId('curated:longtermist');

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 'slightly-longer-id',
        slug: 'slightly-longer-longerterm',
        reference: 'slightly-longer-longerterm',
      }),
    });

    renderAssumptionsRoute('/assumptions');

    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, String(slightlyLongerTimeLimit));
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    await user.click(getActiveAssumptionsActionButton('Share'));
    await user.type(screen.getByLabelText('Custom link text (optional)'), 'slightly-longer-longerterm');
    await user.click(screen.getByRole('button', { name: 'Create Link' }));

    expect(await screen.findByText('Share link created.')).toBeInTheDocument();
    const requestBody = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(requestBody).toMatchObject({
      assumptions: {
        globalParameters: {
          populationGrowthRate: longtermistGlobalParameters.populationGrowthRate,
          populationLimit: longtermistGlobalParameters.populationLimit,
          timeLimit: slightlyLongerTimeLimit,
        },
      },
      name: null,
      slug: 'slightly-longer-longerterm',
    });

    await waitFor(() => {
      const entries = JSON.parse(localStorage.getItem('savedAssumptions:v1'));
      expect(entries).toHaveLength(1);
      expect(entries[0]).toMatchObject({
        label: 'slightly-longer-longerterm',
        source: 'local',
        reference: 'slightly-longer-longerterm',
        assumptions: {
          globalParameters: {
            populationGrowthRate: longtermistGlobalParameters.populationGrowthRate,
            populationLimit: longtermistGlobalParameters.populationLimit,
            timeLimit: slightlyLongerTimeLimit,
          },
        },
      });
      expect(sessionStorage.getItem('activeSavedAssumptionsId:v1')).toBe(entries[0].id);
    });

    const summaryRow = getAssumptionsLibrarySummary();
    expect(within(summaryRow).getByText('slightly-longer-longerterm')).toBeInTheDocument();
    expect(within(summaryRow).getByText('Remote')).toBeInTheDocument();
  });

  it('shares edited imported assumptions as a new local fork without reusing the imported name', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: 150,
        },
      })
    );

    const importedSeed = saveNewAssumptions({
      label: 'Imported From Friend',
      assumptions: {
        globalParameters: {
          timeLimit: 150,
        },
        categories: {},
        recipients: {},
      },
      source: 'imported',
      reference: 'friend-model',
    });
    if (!importedSeed.ok) {
      throw new Error('Expected seeded imported entry');
    }
    setActiveSavedAssumptionsId(importedSeed.entry.id);

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 'share-205',
        reference: 'friend-model-fork',
      }),
    });

    renderAssumptionsRoute('/assumptions');

    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, '205');
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    await user.click(getActiveAssumptionsActionButton('Share'));
    await user.click(await screen.findByRole('button', { name: 'Create Link' }));
    expect(await screen.findByText('Share link created.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Done' }));

    await waitFor(() => {
      const entries = JSON.parse(localStorage.getItem('savedAssumptions:v1'));
      expect(entries).toHaveLength(2);

      const originalImported = entries.find((entry) => entry.id === importedSeed.entry.id);
      expect(originalImported).toMatchObject({
        label: 'Imported From Friend',
        source: 'imported',
        reference: 'friend-model',
      });
      expect(originalImported.assumptions.globalParameters.timeLimit).toBe(150);

      const sharedFork = entries.find((entry) => entry.reference === 'friend-model-fork');
      expect(sharedFork).toBeTruthy();
      expect(sharedFork).toMatchObject({
        label: 'friend-model-fork',
        source: 'local',
      });
      expect(sharedFork.assumptions.globalParameters.timeLimit).toBe(205);
      expect(sessionStorage.getItem('activeSavedAssumptionsId:v1')).toBe(sharedFork.id);
    });

    expect(JSON.parse(fetchMock.mock.calls[0][1].body).name).toBeNull();
  });

  it('creates and activates a saved assumptions entry when sharing unsaved custom assumptions', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: 185,
        },
      })
    );

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 'share-185',
        description: 'Unsaved assumptions shared note.',
        reference: 'custom-slug-185',
      }),
    });

    renderAssumptionsRoute('/assumptions');

    await user.click(getActiveAssumptionsActionButton('Share'));
    await user.type(screen.getByLabelText('Description (optional)'), 'Unsaved assumptions shared note.');
    await user.click(await screen.findByRole('button', { name: 'Create Link' }));
    expect(await screen.findByText('Share link created.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Done' }));

    await waitFor(() => {
      const entries = JSON.parse(localStorage.getItem('savedAssumptions:v1'));
      expect(entries).toHaveLength(1);
      expect(entries[0].label).toBe('custom-slug-185');
      expect(entries[0].reference).toBe('custom-slug-185');
      expect(entries[0].source).toBe('local');
      expect(entries[0].description).toBe('Unsaved assumptions shared note.');
      expect(entries[0].assumptions.globalParameters.timeLimit).toBe(185);
      expect(sessionStorage.getItem('activeSavedAssumptionsId:v1')).toBe(entries[0].id);
    });

    const row = getAssumptionsLibrarySummary();
    expect(row).toHaveAttribute('data-active', 'true');
    expect(within(row).getByText('custom-slug-185')).toBeInTheDocument();
    expect(within(row).getByText('Remote')).toBeInTheDocument();

    expect(
      fetchMock.mock.calls.some(([url, options]) => url === '/api/shared-assumptions' && options?.method === 'POST')
    ).toBe(true);
  });

  it('uses a unique local label when sharing unsaved assumptions and the slug label already exists', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: 186,
        },
      })
    );

    const existing = saveNewAssumptions({
      label: 'duplicate-slug',
      assumptions: {
        globalParameters: { timeLimit: 120 },
        categories: {},
        recipients: {},
      },
      source: 'local',
    });
    if (!existing.ok) {
      throw new Error('Expected seeded entry');
    }

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 'share-186',
        reference: 'duplicate-slug',
      }),
    });

    renderAssumptionsRoute('/assumptions');

    await user.click(getActiveAssumptionsActionButton('Share'));
    await user.click(await screen.findByRole('button', { name: 'Create Link' }));
    expect(await screen.findByText('Share link created.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Done' }));

    await waitFor(() => {
      const entries = JSON.parse(localStorage.getItem('savedAssumptions:v1'));
      expect(entries).toHaveLength(2);

      const newEntry = entries.find((entry) => entry.label === 'duplicate-slug (2)');
      expect(newEntry).toBeTruthy();
      expect(newEntry.reference).toBe('duplicate-slug');
      expect(newEntry.assumptions.globalParameters.timeLimit).toBe(186);
      expect(sessionStorage.getItem('activeSavedAssumptionsId:v1')).toBe(newEntry.id);
    });

    expect(
      fetchMock.mock.calls.some(([url, options]) => url === '/api/shared-assumptions' && options?.method === 'POST')
    ).toBe(true);
  });

  it('shows Copy Link instead of Share for current assumptions that already have a share link', async () => {
    sessionStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: 160,
        },
      })
    );

    const remoteSeed = saveNewAssumptions({
      label: 'Existing Remote',
      description: 'Existing remote description',
      assumptions: {
        globalParameters: {
          timeLimit: 160,
        },
        categories: {},
        recipients: {},
      },
      source: 'local',
      reference: 'existing-remote',
    });
    if (!remoteSeed.ok) {
      throw new Error('Expected seeded remote entry');
    }
    setActiveSavedAssumptionsId(remoteSeed.entry.id);

    const fetchMock = vi.spyOn(globalThis, 'fetch');

    renderAssumptionsRoute('/assumptions');

    expect(queryActiveAssumptionsActionButton('Share')).not.toBeInTheDocument();
    expect(getActiveAssumptionsActionButton('Copy Link')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('does not show Share for current assumptions that already have a share link and no description', async () => {
    sessionStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: 160,
        },
      })
    );

    const remoteSeed = saveNewAssumptions({
      label: 'Existing Remote Without Description',
      assumptions: {
        globalParameters: {
          timeLimit: 160,
        },
        categories: {},
        recipients: {},
      },
      source: 'local',
      reference: 'existing-remote-without-description',
    });
    if (!remoteSeed.ok) {
      throw new Error('Expected seeded remote entry');
    }
    setActiveSavedAssumptionsId(remoteSeed.entry.id);

    const fetchMock = vi.spyOn(globalThis, 'fetch');

    renderAssumptionsRoute('/assumptions');

    expect(queryActiveAssumptionsActionButton('Share')).not.toBeInTheDocument();
    expect(getActiveAssumptionsActionButton('Copy Link')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('loads default assumptions from Assumptions Library panel and clears active saved entry', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: 160,
        },
      })
    );

    const seeded = saveNewAssumptions({
      label: 'Current Custom',
      assumptions: {
        globalParameters: {
          timeLimit: 160,
        },
        categories: {},
        recipients: {},
      },
      source: 'local',
    });
    if (!seeded.ok) {
      throw new Error('Expected seeded local entry');
    }
    setActiveSavedAssumptionsId(seeded.entry.id);

    renderAssumptionsRoute('/assumptions');

    const { menu } = await openAssumptionsLibraryMenu(user);
    const defaultRow = getAssumptionsLibraryRow(menu, 'Default (100 years)');
    await user.click(defaultRow.querySelector('[data-menu-item]'));

    await waitFor(() => {
      expect(screen.getByLabelText('Time Limit (years)')).toHaveValue(
        String(assumptionsData.globalParameters.timeLimit)
      );
    });

    expect(sessionStorage.getItem('customEffectsData')).toBeNull();
    expect(sessionStorage.getItem('activeSavedAssumptionsId:v1')).toBeNull();

    const activeDefaultRow = getAssumptionsLibrarySummary();
    expect(activeDefaultRow).toHaveAttribute('data-active', 'true');
    expect(within(activeDefaultRow).getByText('Default (100 years)')).toBeInTheDocument();
  });

  it('automatically recognizes default assumptions after all custom changes are reverted', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: 160,
        },
      })
    );

    const seeded = saveNewAssumptions({
      label: 'Current Custom',
      assumptions: {
        globalParameters: {
          timeLimit: 160,
        },
        categories: {},
        recipients: {},
      },
      source: 'local',
    });
    if (!seeded.ok) {
      throw new Error('Expected seeded local entry');
    }
    setActiveSavedAssumptionsId(seeded.entry.id);

    renderAssumptionsRoute('/assumptions');

    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, String(assumptionsData.globalParameters.timeLimit));
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    await waitFor(() => {
      expect(sessionStorage.getItem('activeSavedAssumptionsId:v1')).toBeNull();
    });

    expect(sessionStorage.getItem('customEffectsData')).toBeNull();
    const summaryRow = getAssumptionsLibrarySummary();
    expect(summaryRow).toHaveAttribute('data-active', 'true');
    expect(within(summaryRow).getByText('Default (100 years)')).toBeInTheDocument();
    expect(within(summaryRow).queryByRole('button', { name: 'Save as…' })).not.toBeInTheDocument();
    expect(within(summaryRow).queryByRole('button', { name: 'Share' })).not.toBeInTheDocument();
  });

  it('automatically activates a saved entry when edits come to match it', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem('customEffectsData', JSON.stringify({ globalParameters: { timeLimit: 140 } }));

    const previousEntry = saveNewAssumptions({
      label: 'Previous Saved',
      assumptions: { globalParameters: { timeLimit: 140 } },
    });
    const matchingEntry = saveNewAssumptions({
      label: 'Matching Saved',
      assumptions: { globalParameters: { timeLimit: 155 } },
    });
    if (!previousEntry.ok || !matchingEntry.ok) {
      throw new Error('Expected saved entries to seed successfully');
    }
    setActiveSavedAssumptionsId(previousEntry.entry.id);

    renderAssumptionsRoute('/assumptions');

    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, '155');
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    await waitFor(() => {
      expect(sessionStorage.getItem('activeSavedAssumptionsId:v1')).toBe(matchingEntry.entry.id);
    });

    const summaryRow = getAssumptionsLibrarySummary();
    expect(summaryRow).toHaveAttribute('data-active', 'true');
    expect(within(summaryRow).getByText('Matching Saved')).toBeInTheDocument();
    expect(within(summaryRow).queryByText('Custom (unnamed)')).not.toBeInTheDocument();

    const { menu } = await openAssumptionsLibraryMenu(user);
    expect(within(menu).queryByText('Matching Saved')).not.toBeInTheDocument();
    expect(within(menu).getByText('Previous Saved')).toBeInTheDocument();
  });

  it('loads a saved assumptions entry after replace confirmation when local custom assumptions exist', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: 140,
        },
      })
    );

    const savedResult = saveNewAssumptions({
      label: 'Imported From Friend',
      assumptions: {
        globalParameters: {
          timeLimit: 220,
        },
        categories: {},
        recipients: {},
      },
      source: 'imported',
      reference: 'friend-model',
    });

    if (!savedResult.ok) {
      throw new Error('Expected seeded saved assumptions entry');
    }

    renderAssumptionsRoute('/assumptions');
    const { menu } = await openAssumptionsLibraryMenu(user);
    const importedRow = getAssumptionsLibraryRow(menu, 'Imported From Friend');
    await user.click(importedRow.querySelector('[data-menu-item]'));

    expect(await screen.findByText('Overwrite your current assumptions?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Continue (overwrite yours)' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Time Limit (years)')).toHaveValue('220');
    });
  });

  it('loads without replace confirmation when current assumptions match a saved entry', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: 140,
        },
      })
    );

    const currentSaved = saveNewAssumptions({
      label: 'Current Saved',
      assumptions: {
        globalParameters: { timeLimit: 140 },
        categories: {},
        recipients: {},
      },
    });
    const targetSaved = saveNewAssumptions({
      label: 'Target Saved',
      assumptions: {
        globalParameters: { timeLimit: 200 },
        categories: {},
        recipients: {},
      },
    });
    if (!currentSaved.ok || !targetSaved.ok) {
      throw new Error('Expected saved entries to seed successfully');
    }
    setActiveSavedAssumptionsId(currentSaved.entry.id);

    renderAssumptionsRoute('/assumptions');

    const { menu } = await openAssumptionsLibraryMenu(user);
    const targetRow = getAssumptionsLibraryRow(menu, 'Target Saved');
    await user.click(targetRow.querySelector('[data-menu-item]'));

    await waitFor(() => {
      expect(screen.queryByText('Overwrite your current assumptions?')).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByLabelText('Time Limit (years)')).toHaveValue('200');
    });
  });

  it('keeps the active saved assumptions entry out of the dropdown menu when there are no unsaved changes', async () => {
    sessionStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: 140,
        },
      })
    );

    const currentSaved = saveNewAssumptions({
      label: 'Current Saved',
      assumptions: {
        globalParameters: { timeLimit: 140 },
        categories: {},
        recipients: {},
      },
    });
    if (!currentSaved.ok) {
      throw new Error('Expected saved entry to seed successfully');
    }
    setActiveSavedAssumptionsId(currentSaved.entry.id);

    renderAssumptionsRoute('/assumptions');

    const activeRow = getAssumptionsLibrarySummary();
    expect(within(activeRow).getByText('Current Saved')).toBeInTheDocument();

    const { menu } = await openAssumptionsLibraryMenu(userEvent.setup());
    expect(within(menu).queryByText('Current Saved')).not.toBeInTheDocument();
  });

  it('keeps the active saved assumptions entry out of the dropdown menu when there are unsaved changes', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: 140,
        },
      })
    );

    const currentSaved = saveNewAssumptions({
      label: 'Current Saved',
      assumptions: {
        globalParameters: { timeLimit: 140 },
        categories: {},
        recipients: {},
      },
    });
    if (!currentSaved.ok) {
      throw new Error('Expected saved entry to seed successfully');
    }
    setActiveSavedAssumptionsId(currentSaved.entry.id);

    renderAssumptionsRoute('/assumptions');

    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, '155');
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    const activeRow = getAssumptionsLibrarySummary();
    expect(within(activeRow).getByText('Custom (unnamed)')).toBeInTheDocument();
    expect(activeRow).toHaveAttribute('data-dirty', 'false');

    const { menu } = await openAssumptionsLibraryMenu(user);
    expect(within(menu).getByText('Current Saved')).toBeInTheDocument();
  });

  it('shows a read-only description for the custom unsaved current assumptions state', async () => {
    const user = userEvent.setup();

    renderAssumptionsRoute('/assumptions');

    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, '155');
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    const summaryRow = getAssumptionsLibrarySummary();
    await user.click(within(summaryRow).getByRole('button', { name: 'View description' }));

    expect(await screen.findByRole('heading', { name: 'Custom (unnamed)' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Description:' })).toHaveTextContent(
      'The current assumptions have been edited and no longer match a saved set of assumptions. They are applied — every ranking and calculation on the site uses them'
    );
    expect(screen.getByRole('region', { name: 'Description:' })).toHaveTextContent(
      'They are not saved as a named set. If you want a reusable named copy, click “Save as…”'
    );
    expect(screen.queryByRole('button', { name: 'Save Description' })).not.toBeInTheDocument();
  });

  it('shows only the description action for the default current assumptions row', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    const summaryRow = getAssumptionsLibrarySummary();
    expect(within(summaryRow).getByText('Default (100 years)')).toBeInTheDocument();
    expect(within(summaryRow).getByRole('button', { name: 'View description' })).toBeInTheDocument();
    expect(within(summaryRow).queryByRole('button', { name: 'Rename' })).not.toBeInTheDocument();
    expect(within(summaryRow).queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();

    await user.click(within(summaryRow).getByRole('button', { name: 'View description' }));
    expect(await screen.findByRole('heading', { name: 'Default (100 years)' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Description:' })).not.toHaveTextContent(
      'You can create and share your own assumptions on the Assumptions page.'
    );
    expect(screen.queryByRole('link', { name: 'Assumptions page' })).not.toBeInTheDocument();
  });

  it('does not prefill the save description when saving custom unsaved assumptions', async () => {
    const user = userEvent.setup();
    const seeded = saveNewAssumptions({
      label: 'Baseline Entry',
      description: 'Existing saved description',
      assumptions: {
        globalParameters: { timeLimit: 115 },
        categories: {},
        recipients: {},
      },
    });
    if (!seeded.ok) {
      throw new Error('Expected saved entry to seed successfully');
    }
    setActiveSavedAssumptionsId(seeded.entry.id);

    renderAssumptionsRoute('/assumptions');

    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, '155');
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    const summaryRow = getAssumptionsLibrarySummary();
    expect(within(summaryRow).getByText('Custom (unnamed)')).toBeInTheDocument();

    await user.click(within(summaryRow).getByRole('button', { name: 'Save as…' }));

    expect(await screen.findByRole('heading', { name: 'Save assumptions as' })).toBeInTheDocument();
    expect(screen.getByLabelText('Description (optional)')).toHaveValue('');
  });

  it('does not show Delete All Imported button', async () => {
    saveNewAssumptions({
      label: 'Local Baseline',
      assumptions: {
        globalParameters: { timeLimit: 100 },
        categories: {},
        recipients: {},
      },
      source: 'local',
    });
    saveNewAssumptions({
      label: 'Imported Baseline',
      assumptions: {
        globalParameters: { timeLimit: 180 },
        categories: {},
        recipients: {},
      },
      source: 'imported',
      reference: 'imported-baseline',
    });

    renderAssumptionsRoute('/assumptions');
    const { menu } = await openAssumptionsLibraryMenu(userEvent.setup());
    expect(within(menu).getByText('Imported Baseline')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Delete All Imported' })).not.toBeInTheDocument();
  });

  it('shows the active entry actions in the library summary row and allows top-row rename', async () => {
    const user = userEvent.setup();
    const seeded = saveNewAssumptions({
      label: 'Summary Entry',
      description: 'Summary description',
      assumptions: {
        globalParameters: { timeLimit: 115 },
        categories: {},
        recipients: {},
      },
    });
    if (!seeded.ok) {
      throw new Error('Expected saved entry to seed successfully');
    }
    setActiveSavedAssumptionsId(seeded.entry.id);
    sessionStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: 115,
        },
      })
    );

    renderAssumptionsRoute('/assumptions');

    const section = getAssumptionsLibrarySection();
    const summary = section.querySelector('.saved-assumptions-panel__summary');
    expect(summary).not.toBeNull();
    expect(within(summary).getByText('Local')).toBeInTheDocument();
    expect(within(summary).queryByRole('button', { name: 'Save as…' })).not.toBeInTheDocument();
    expect(within(summary).getByRole('button', { name: 'Share' })).toBeInTheDocument();
    expect(within(summary).getByRole('button', { name: 'View description' })).toBeInTheDocument();

    await user.click(within(summary).getByRole('button', { name: 'Rename' }));

    await waitFor(() => {
      expect(within(getAssumptionsLibrarySummary()).getByDisplayValue('Summary Entry')).toBeInTheDocument();
    });
  });

  it('renames a saved assumptions entry from the panel', async () => {
    const user = userEvent.setup();
    const seeded = saveNewAssumptions({
      label: 'Old Label',
      assumptions: {
        globalParameters: { timeLimit: 115 },
        categories: {},
        recipients: {},
      },
    });
    if (!seeded.ok) {
      throw new Error('Expected saved entry to seed successfully');
    }

    renderAssumptionsRoute('/assumptions');
    const { menu } = await openAssumptionsLibraryMenu(user);
    const row = getAssumptionsLibraryRow(menu, 'Old Label');
    await user.click(within(row).getByRole('button', { name: 'Rename' }));

    const input = within(row).getByDisplayValue('Old Label');
    await user.clear(input);
    await user.type(input, 'New Label');
    await user.keyboard('{Enter}');

    expect(await screen.findByText('New Label')).toBeInTheDocument();
    expect(screen.queryByText('Old Label')).not.toBeInTheDocument();

    const savedEntries = JSON.parse(localStorage.getItem('savedAssumptions:v1'));
    expect(savedEntries[0].label).toBe('New Label');
  });

  it('shows inline rename error for duplicate saved assumptions name', async () => {
    const user = userEvent.setup();
    saveNewAssumptions({
      label: 'First Label',
      assumptions: {
        globalParameters: { timeLimit: 115 },
        categories: {},
        recipients: {},
      },
    });
    saveNewAssumptions({
      label: 'Second Label',
      assumptions: {
        globalParameters: { timeLimit: 130 },
        categories: {},
        recipients: {},
      },
    });

    renderAssumptionsRoute('/assumptions');
    const { menu } = await openAssumptionsLibraryMenu(user);
    const secondRow = getAssumptionsLibraryRow(menu, 'Second Label');

    await user.click(within(secondRow).getByRole('button', { name: 'Rename' }));
    const input = within(secondRow).getByDisplayValue('Second Label');
    await user.clear(input);
    await user.type(input, 'first label');
    await user.keyboard('{Enter}');

    expect(
      within(secondRow).getByText('You already have saved assumptions with that name. Choose a different name.')
    ).toBeInTheDocument();
    expect(within(secondRow).getByDisplayValue('first label')).toBeInTheDocument();
  });

  it('shows inline rename error when a saved assumptions name collides with a curated profile', async () => {
    const user = userEvent.setup();
    const seeded = saveNewAssumptions({
      label: 'Rename Me',
      assumptions: {
        globalParameters: { timeLimit: 115 },
        categories: {},
        recipients: {},
      },
    });
    if (!seeded.ok) {
      throw new Error('Expected saved entry to seed successfully');
    }

    renderAssumptionsRoute('/assumptions');
    const { menu } = await openAssumptionsLibraryMenu(user);
    const row = getAssumptionsLibraryRow(menu, 'Rename Me');

    await user.click(within(row).getByRole('button', { name: 'Rename' }));
    const input = within(row).getByDisplayValue('Rename Me');
    await user.clear(input);
    await user.type(input, 'Longtermist (10 billion years)');
    await user.keyboard('{Enter}');

    expect(
      within(row).getByText('That name is already used by a curated assumptions set. Choose a different name.')
    ).toBeInTheDocument();
  });

  it('prevents saving assumptions with a duplicate name', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: 140,
        },
      })
    );
    const existing = saveNewAssumptions({
      label: 'Taken Name',
      assumptions: {
        globalParameters: { timeLimit: 120 },
        categories: {},
        recipients: {},
      },
    });
    if (!existing.ok) {
      throw new Error('Expected seeded entry');
    }

    renderAssumptionsRoute('/assumptions');
    await user.click(getActiveAssumptionsActionButton('Save as…'));

    const labelInput = await screen.findByLabelText('Label');
    await user.clear(labelInput);
    await user.type(labelInput, ' taken name ');

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByRole('heading', { name: 'Save assumptions as' })).toBeInTheDocument();
    expect(
      screen.getByText('You already have saved assumptions with that name. Choose a different name.')
    ).toBeInTheDocument();

    const entries = JSON.parse(localStorage.getItem('savedAssumptions:v1'));
    expect(entries).toHaveLength(1);
  });

  it('prevents saving assumptions with a curated profile name and shows a curated-specific error', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: 140,
        },
      })
    );

    renderAssumptionsRoute('/assumptions');
    await user.click(getActiveAssumptionsActionButton('Save as…'));

    const labelInput = await screen.findByLabelText('Label');
    await user.clear(labelInput);
    await user.type(labelInput, 'Longtermist (10 billion years)');

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(
      screen.getByText('That name is already used by a curated assumptions set. Choose a different name.')
    ).toBeInTheDocument();
    expect(localStorage.getItem('savedAssumptions:v1')).toBeNull();
  });

  it('recognizes an existing saved entry instead of offering to save a duplicate', async () => {
    sessionStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: 150,
        },
      })
    );

    const seeded = saveNewAssumptions({
      label: 'Baseline Model',
      assumptions: {
        globalParameters: { timeLimit: 150 },
        categories: {},
        recipients: {},
      },
      source: 'local',
    });
    if (!seeded.ok) {
      throw new Error('Expected seeded entry');
    }

    renderAssumptionsRoute('/assumptions');

    await waitFor(() => {
      expect(sessionStorage.getItem('activeSavedAssumptionsId:v1')).toBe(seeded.entry.id);
    });

    const summaryRow = getAssumptionsLibrarySummary();
    expect(within(summaryRow).getByText('Baseline Model')).toBeInTheDocument();
    expect(within(summaryRow).queryByRole('button', { name: 'Save as…' })).not.toBeInTheDocument();
  });
});
