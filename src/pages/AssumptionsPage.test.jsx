import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AssumptionsPage from './AssumptionsPage';
import { AssumptionsProvider } from '../contexts/AssumptionsContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { createDefaultAssumptions } from '../utils/assumptionsDataHelpers';
import { saveNewAssumptions, setActiveSavedAssumptionsId } from '../utils/savedAssumptionsStore';

/* global localStorage, sessionStorage */

const assumptionsData = createDefaultAssumptions();
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
  render(
    <NotificationProvider>
      <AssumptionsProvider>
        <MemoryRouter initialEntries={[initialEntry]}>
          <RouterControls />
          <Routes>
            <Route path="/" element={<div>Home</div>} />
            <Route path="/assumptions" element={<AssumptionsPage />} />
          </Routes>
        </MemoryRouter>
      </AssumptionsProvider>
    </NotificationProvider>
  );
};

const getAssumptionsLibrarySection = () => screen.getByText('Active Assumptions').closest('section');

const openAssumptionsLibraryMenu = async (user) => {
  const section = getAssumptionsLibrarySection();
  const openMenu = within(section).queryByRole('menu');

  if (!openMenu) {
    await user.click(within(section).getByRole('button', { name: /Select assumptions set/i }));
  }

  return {
    section,
    menu: await within(section).findByRole('menu'),
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

  it('shows an explanatory tooltip next to the active assumptions heading', async () => {
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

  it('keeps tab navigation visible and locked while editing a category', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute(`/assumptions?tab=categories&categoryId=${firstValidCategoryId}`);

    expect(await screen.findByText(/Edit effects for cause/i)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Global' })).toBeDisabled();
    expect(screen.getByRole('tab', { name: 'Causes' })).toBeDisabled();
    expect(screen.getByRole('tab', { name: 'Recipients' })).toBeDisabled();

    await user.click(screen.getByRole('tab', { name: 'Global' }));
    expect(screen.getByTestId('location-probe').textContent).toBe(
      `/assumptions?tab=categories&categoryId=${firstValidCategoryId}`
    );
  });

  it('opens recipient editor from deep-link even when tab query param is global', async () => {
    if (!firstValidRecipientId) {
      throw new Error('Expected at least one recipient with categories in default assumptions data');
    }

    renderAssumptionsRoute(`/assumptions?tab=global&recipientId=${firstValidRecipientId}`);

    expect(await screen.findByText(/Edit effects for recipient/i)).toBeInTheDocument();
    expect(screen.getByTestId('location-probe')).toHaveTextContent(`recipientId=${firstValidRecipientId}`);
  });

  it('keeps tab navigation visible and locked while editing a recipient', async () => {
    if (!firstValidRecipientId) {
      throw new Error('Expected at least one recipient with categories in default assumptions data');
    }

    const user = userEvent.setup();
    renderAssumptionsRoute(`/assumptions?tab=recipients&recipientId=${firstValidRecipientId}`);

    expect(await screen.findByText(/Edit effects for recipient/i)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Global' })).toBeDisabled();
    expect(screen.getByRole('tab', { name: 'Causes' })).toBeDisabled();
    expect(screen.getByRole('tab', { name: 'Recipients' })).toBeDisabled();

    await user.click(screen.getByRole('tab', { name: 'Causes' }));
    expect(screen.getByTestId('location-probe').textContent).toContain(`recipientId=${firstValidRecipientId}`);
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

    const editButtons = await screen.findAllByRole('button', { name: 'Edit' });
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

    await user.click(screen.getByRole('button', { name: 'Reset Global' }));

    await waitFor(() => {
      expect(sessionStorage.getItem('customEffectsData')).toBeNull();
    });
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

  it('hides Save to Library when there are no custom assumptions', async () => {
    renderAssumptionsRoute('/assumptions');
    expect(await screen.findByText('Assumptions')).toBeInTheDocument();
    expect(queryActiveAssumptionsActionButton('Save')).not.toBeInTheDocument();
    expect(queryActiveAssumptionsActionButton('Share')).not.toBeInTheDocument();
  });

  it('shows curated assumptions profiles in the library and loads them as read-only presets', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    const { menu } = await openAssumptionsLibraryMenu(user);
    const longtermistRow = getAssumptionsLibraryRow(menu, 'Longtermist');
    expect(within(longtermistRow).getByText('Curated')).toBeInTheDocument();
    expect(within(longtermistRow).queryByRole('button', { name: 'Rename' })).not.toBeInTheDocument();
    expect(within(longtermistRow).queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
    expect(within(longtermistRow).getByRole('button', { name: 'Copy Link' })).toBeInTheDocument();

    await user.click(within(longtermistRow).getByRole('menuitemradio'));

    await waitFor(() => {
      expect(screen.getByLabelText('Time Limit (years)')).toHaveValue('10,000,000,000');
    });

    expect(JSON.parse(sessionStorage.getItem('customEffectsData'))).toEqual({
      globalParameters: {
        timeLimit: 10000000000,
      },
    });
    expect(sessionStorage.getItem('activeSavedAssumptionsId:v1')).toBe('curated:longtermist');

    const activeRow = getAssumptionsLibrarySummary();
    expect(activeRow).toHaveAttribute('data-active', 'true');
    expect(within(activeRow).getByText('Longtermist')).toBeInTheDocument();

    await user.click(within(activeRow).getByRole('button', { name: 'View description' }));
    const descriptionModal = screen.getByRole('heading', { name: 'Longtermist' }).closest('.impact-modal');
    expect(within(descriptionModal).getByRole('region', { name: 'Description:' })).toHaveTextContent(
      '10 billion years'
    );
    expect(screen.queryByRole('button', { name: 'Save Description' })).not.toBeInTheDocument();
  });

  it('does not show Save or Share actions for an active curated assumptions set', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    const { menu } = await openAssumptionsLibraryMenu(user);
    const row = getAssumptionsLibraryRow(menu, 'Longtermist');
    await user.click(within(row).getByRole('menuitemradio'));

    await waitFor(() => {
      expect(queryActiveAssumptionsActionButton('Save')).not.toBeInTheDocument();
      expect(queryActiveAssumptionsActionButton('Share')).not.toBeInTheDocument();
      expect(getActiveAssumptionsActionButton('Copy Link')).toBeInTheDocument();
    });
  });

  it('saves current assumptions to Assumptions Library and marks entry active', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, '175');
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    await user.click(getActiveAssumptionsActionButton('Save'));
    expect(await screen.findByRole('heading', { name: 'Save to Library' })).toBeInTheDocument();

    const labelInput = screen.getByLabelText('Label');
    expect(labelInput).toHaveValue('');
    await user.clear(labelInput);
    await user.type(labelInput, 'My Local Snapshot');
    await user.type(
      screen.getByLabelText('Description (optional)'),
      'Longer time horizon with a lower discount rate for current planning.'
    );
    const saveButtons = screen.getAllByRole('button', { name: 'Save to Library' });
    await user.click(saveButtons[saveButtons.length - 1]);

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

    await user.click(getActiveAssumptionsActionButton('Save'));
    expect(await screen.findByRole('heading', { name: 'Save to Library' })).toBeInTheDocument();

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

    await user.click(getActiveAssumptionsActionButton('Save'));
    expect(await screen.findByRole('button', { name: 'Update Current Library Entry' })).toBeInTheDocument();
    expect(screen.getByLabelText('Label')).toHaveValue('');
    const descriptionInput = screen.getByLabelText('Description (optional)');
    expect(descriptionInput).toHaveValue('');
    await user.type(descriptionInput, 'Extended horizon after reviewing sensitivity analysis.');
    await user.click(screen.getByRole('button', { name: 'Update Current Library Entry' }));

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
    expect(within(row).queryByRole('button', { name: /description/i })).not.toBeInTheDocument();
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

    await user.click(getActiveAssumptionsActionButton('Save'));
    expect(await screen.findByRole('heading', { name: 'Save to Library' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Update Current Library Entry' })).not.toBeInTheDocument();

    const labelInput = screen.getByLabelText('Label');
    await user.clear(labelInput);
    await user.type(labelInput, 'Local Fork');
    const saveButtons = screen.getAllByRole('button', { name: 'Save to Library' });
    await user.click(saveButtons[saveButtons.length - 1]);

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

  it('shows Copy Link instead of Share for active assumptions that already have a share link', async () => {
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

  it('does not show Share for active assumptions that already have a share link and no description', async () => {
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
    const defaultRow = getAssumptionsLibraryRow(menu, 'Default');
    await user.click(within(defaultRow).getByRole('menuitemradio'));

    await waitFor(() => {
      expect(screen.getByLabelText('Time Limit (years)')).toHaveValue(
        String(assumptionsData.globalParameters.timeLimit)
      );
    });

    expect(sessionStorage.getItem('customEffectsData')).toBeNull();
    expect(sessionStorage.getItem('activeSavedAssumptionsId:v1')).toBeNull();

    const activeDefaultRow = getAssumptionsLibrarySummary();
    expect(activeDefaultRow).toHaveAttribute('data-active', 'true');
    expect(within(activeDefaultRow).getByText('Default')).toBeInTheDocument();
  });

  it('lets users load default assumptions when a non-default entry is active but edits match the default state', async () => {
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

    const customRow = getAssumptionsLibrarySummary();
    expect(customRow).toHaveAttribute('data-active', 'true');
    expect(customRow).toHaveAttribute('data-dirty', 'false');
    expect(within(customRow).getByText('Custom (unsaved)')).toBeInTheDocument();
    expect(within(customRow).getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(within(customRow).getByRole('button', { name: 'Share' })).toBeInTheDocument();
    expect(within(customRow).getByRole('button', { name: 'View description' })).toBeInTheDocument();

    const { menu } = await openAssumptionsLibraryMenu(user);
    const defaultRow = getAssumptionsLibraryRow(menu, 'Default');
    await user.click(within(defaultRow).getByRole('menuitemradio'));

    await waitFor(() => {
      expect(sessionStorage.getItem('activeSavedAssumptionsId:v1')).toBeNull();
    });

    expect(sessionStorage.getItem('customEffectsData')).toBeNull();
    expect(screen.queryByText('Default assumptions are already loaded.')).not.toBeInTheDocument();
    const summaryRow = getAssumptionsLibrarySummary();
    expect(summaryRow).toHaveAttribute('data-active', 'true');
    expect(within(summaryRow).getByText('Default')).toBeInTheDocument();
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
    await user.click(within(importedRow).getByRole('menuitemradio'));

    expect(await screen.findByText('Overwrite your unsaved assumptions?')).toBeInTheDocument();
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
    await user.click(within(targetRow).getByRole('menuitemradio'));

    await waitFor(() => {
      expect(screen.queryByText('Overwrite your unsaved assumptions?')).not.toBeInTheDocument();
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
    expect(within(activeRow).getByText('Custom (unsaved)')).toBeInTheDocument();
    expect(activeRow).toHaveAttribute('data-dirty', 'false');

    const { menu } = await openAssumptionsLibraryMenu(user);
    expect(within(menu).getByText('Current Saved')).toBeInTheDocument();
  });

  it('shows a read-only description for the custom unsaved active assumptions state', async () => {
    const user = userEvent.setup();

    renderAssumptionsRoute('/assumptions');

    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, '155');
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    const summaryRow = getAssumptionsLibrarySummary();
    await user.click(within(summaryRow).getByRole('button', { name: 'View description' }));

    expect(await screen.findByRole('heading', { name: 'Custom (unsaved)' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Description:' })).toHaveTextContent(
      'The active assumptions have been edited and no longer match a saved set of assumptions.'
    );
    expect(screen.getByRole('region', { name: 'Description:' })).toHaveTextContent(
      'If you want to reuse these exact assumptions later, click Save to save a local copy or click Share to create a link to these assumptions that you can share with others.'
    );
    expect(screen.queryByRole('button', { name: 'Save Description' })).not.toBeInTheDocument();
  });

  it('shows only the description action for the default active assumptions row', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    const summaryRow = getAssumptionsLibrarySummary();
    expect(within(summaryRow).getByText('Default')).toBeInTheDocument();
    expect(within(summaryRow).getByRole('button', { name: 'View description' })).toBeInTheDocument();
    expect(within(summaryRow).queryByRole('button', { name: 'Rename' })).not.toBeInTheDocument();
    expect(within(summaryRow).queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();

    await user.click(within(summaryRow).getByRole('button', { name: 'View description' }));
    expect(await screen.findByRole('heading', { name: 'Default' })).toBeInTheDocument();
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
    expect(within(summaryRow).getByText('Custom (unsaved)')).toBeInTheDocument();

    await user.click(within(summaryRow).getByRole('button', { name: 'Save' }));

    expect(await screen.findByRole('heading', { name: 'Save to Library' })).toBeInTheDocument();
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
    expect(within(summary).queryByRole('button', { name: 'Save' })).not.toBeInTheDocument();
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
    await user.type(input, 'Longtermist');
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
    await user.click(getActiveAssumptionsActionButton('Save'));

    const labelInput = await screen.findByLabelText('Label');
    await user.clear(labelInput);
    await user.type(labelInput, ' taken name ');

    const saveButtons = screen.getAllByRole('button', { name: 'Save to Library' });
    await user.click(saveButtons[saveButtons.length - 1]);

    expect(screen.getByRole('heading', { name: 'Save to Library' })).toBeInTheDocument();
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
    await user.click(getActiveAssumptionsActionButton('Save'));

    const labelInput = await screen.findByLabelText('Label');
    await user.clear(labelInput);
    await user.type(labelInput, 'Longtermist');

    const saveButtons = screen.getAllByRole('button', { name: 'Save to Library' });
    await user.click(saveButtons[saveButtons.length - 1]);

    expect(
      screen.getByText('That name is already used by a curated assumptions set. Choose a different name.')
    ).toBeInTheDocument();
    expect(localStorage.getItem('savedAssumptions:v1')).toBeNull();
  });

  it('warns when saving unchanged assumptions would duplicate an existing saved entry', async () => {
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
    await user.click(getActiveAssumptionsActionButton('Save'));

    expect(screen.getByText(/You are about to save a duplicate copy of/i)).toHaveTextContent(
      'You are about to save a duplicate copy of Baseline Model.'
    );
  });
});
