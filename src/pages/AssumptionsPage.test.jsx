import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AssumptionsPage from './AssumptionsPage';
import { AssumptionsProvider } from '../contexts/AssumptionsContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { createDefaultAssumptions } from '../utils/assumptionsDataHelpers';
import { saveNewAssumptions, setActiveSavedAssumptionsId } from '../utils/savedAssumptionsStore';

/* global localStorage */

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

describe('AssumptionsPage routing integration', () => {
  beforeEach(() => {
    localStorage.clear();
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

    expect(await screen.findByText(/for each cause category/i)).toBeInTheDocument();
    expect(screen.queryByText(/Edit effects for category/i)).not.toBeInTheDocument();
  });

  it('supports back/forward navigation between category list and category editor urls', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions?tab=categories');

    await user.click(screen.getByRole('button', { name: 'Open Category Editor' }));

    await waitFor(() => {
      expect(screen.getByText(/Edit effects for category/i)).toBeInTheDocument();
      expect(screen.getByTestId('location-probe').textContent).toContain('categoryId=');
    });

    await user.click(screen.getByRole('button', { name: 'Go Back' }));
    await waitFor(() => {
      expect(screen.queryByText(/Edit effects for category/i)).not.toBeInTheDocument();
      expect(screen.getByTestId('location-probe').textContent).toBe('/assumptions?tab=categories');
    });

    await user.click(screen.getByRole('button', { name: 'Go Forward' }));
    await waitFor(() => {
      expect(screen.getByText(/Edit effects for category/i)).toBeInTheDocument();
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

    expect(await screen.findByText(/Edit effects for category/i)).toBeInTheDocument();
    expect(screen.getByTestId('location-probe')).toHaveTextContent(`categoryId=${firstValidCategoryId}`);
  });

  it('opens recipient editor from deep-link even when tab query param is global', async () => {
    if (!firstValidRecipientId) {
      throw new Error('Expected at least one recipient with categories in default assumptions data');
    }

    renderAssumptionsRoute(`/assumptions?tab=global&recipientId=${firstValidRecipientId}`);

    expect(await screen.findByText(/Edit effects for recipient/i)).toBeInTheDocument();
    expect(screen.getByTestId('location-probe')).toHaveTextContent(`recipientId=${firstValidRecipientId}`);
  });

  it('updates URL tab params from tab navigation and omits tab param for global', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    await user.click(screen.getByRole('button', { name: 'Categories' }));
    await waitFor(() => {
      expect(screen.getByTestId('location-probe').textContent).toBe('/assumptions?tab=categories');
    });

    await user.click(screen.getByRole('button', { name: 'Recipients' }));
    await waitFor(() => {
      expect(screen.getByTestId('location-probe').textContent).toBe('/assumptions?tab=recipients');
    });

    await user.click(screen.getByRole('button', { name: 'Global' }));
    await waitFor(() => {
      expect(screen.getByTestId('location-probe').textContent).toBe('/assumptions');
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

    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      const persisted = JSON.parse(localStorage.getItem('customEffectsData'));
      expect(persisted.globalParameters.timeLimit).toBe(150);
    });

    await user.click(screen.getByRole('button', { name: 'Reset Global' }));

    await waitFor(() => {
      expect(localStorage.getItem('customEffectsData')).toBeNull();
    });
  });

  it('blocks global save when input is incomplete', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    const discountRateInput = await screen.findByLabelText('Discount Rate (%)');
    await user.clear(discountRateInput);
    await user.type(discountRateInput, '-');

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText('Please enter a complete number')).toBeInTheDocument();
    expect(localStorage.getItem('customEffectsData')).toBeNull();
  });

  it('hides Save Assumptions when there are no custom assumptions', async () => {
    renderAssumptionsRoute('/assumptions');
    expect(await screen.findByText('Assumptions')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Save Assumptions' })).not.toBeInTheDocument();
  });

  it('saves current assumptions to Saved Assumptions and marks entry active', async () => {
    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions');

    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, '175');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    await user.click(screen.getByRole('button', { name: 'Save Assumptions' }));
    expect(await screen.findByRole('heading', { name: 'Save Assumptions' })).toBeInTheDocument();

    const labelInput = screen.getByLabelText('Label');
    await user.clear(labelInput);
    await user.type(labelInput, 'My Local Snapshot');
    const saveButtons = screen.getAllByRole('button', { name: 'Save Assumptions' });
    await user.click(saveButtons[saveButtons.length - 1]);

    expect(await screen.findByText('My Local Snapshot')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();

    const savedRaw = localStorage.getItem('savedAssumptions:v1');
    expect(savedRaw).toBeTruthy();
    const savedEntries = JSON.parse(savedRaw);
    expect(savedEntries).toHaveLength(1);
    expect(savedEntries[0].label).toBe('My Local Snapshot');
  });

  it('updates the active saved assumptions entry in place', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: 150,
        },
      })
    );

    const seeded = saveNewAssumptions({
      label: 'Current Working Model',
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

    renderAssumptionsRoute('/assumptions');

    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, '205');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    await user.click(screen.getByRole('button', { name: 'Save Assumptions' }));
    expect(await screen.findByRole('button', { name: 'Update Current Saved Assumptions' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Update Current Saved Assumptions' }));

    const savedEntries = JSON.parse(localStorage.getItem('savedAssumptions:v1'));
    expect(savedEntries).toHaveLength(1);
    expect(savedEntries[0].id).toBe(seeded.entry.id);
    expect(savedEntries[0].assumptions.globalParameters.timeLimit).toBe(205);
  });

  it('does not allow replacing remote saved assumptions and saves as new local instead', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
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
    await user.click(screen.getByRole('button', { name: 'Save' }));

    await user.click(screen.getByRole('button', { name: 'Save Assumptions' }));
    expect(await screen.findByRole('heading', { name: 'Save Assumptions' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Update Current Saved Assumptions' })).not.toBeInTheDocument();

    const labelInput = screen.getByLabelText('Label');
    await user.clear(labelInput);
    await user.type(labelInput, 'Local Fork');
    const saveButtons = screen.getAllByRole('button', { name: 'Save Assumptions' });
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
    localStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: 175,
        },
      })
    );

    const seeded = saveNewAssumptions({
      label: 'My Snapshot',
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
        reference: 'share-175',
      }),
    });

    renderAssumptionsRoute('/assumptions');

    await user.click(await screen.findByRole('button', { name: 'Share Assumptions' }));
    await user.click(await screen.findByRole('button', { name: 'Create Link' }));
    expect(await screen.findByText('Share link created.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Done' }));

    await waitFor(() => {
      const entries = JSON.parse(localStorage.getItem('savedAssumptions:v1'));
      expect(entries).toHaveLength(1);
      expect(entries[0].reference).toBe('share-175');
      expect(entries[0].source).toBe('local');
    });

    const panel = screen.getByText('Saved Assumptions').closest('section');
    const row = within(panel).getByText('My Snapshot').closest('div.rounded-md');
    expect(within(row).getByText('Remote')).toBeInTheDocument();
    expect(within(row).getByRole('button', { name: 'Copy Link' })).toBeInTheDocument();

    expect(
      fetchMock.mock.calls.some(([url, options]) => url === '/api/shared-assumptions' && options?.method === 'POST')
    ).toBe(true);
  });

  it('shows existing share link immediately for active remote assumptions without creating a new link', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: 160,
        },
      })
    );

    const remoteSeed = saveNewAssumptions({
      label: 'Existing Remote',
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

    await user.click(await screen.findByRole('button', { name: 'Share Assumptions' }));
    expect(await screen.findByRole('heading', { name: 'Share Assumptions' })).toBeInTheDocument();
    expect(screen.getByText((text) => text.includes('?shared=existing-remote'))).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Copy Link' }).length).toBeGreaterThan(0);
    expect(screen.queryByRole('button', { name: 'Create Link' })).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('loads default assumptions from Saved Assumptions panel and clears active saved entry', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
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

    const panel = screen.getByText('Saved Assumptions').closest('section');
    await user.click(within(panel).getByRole('button', { name: /Show Inactive/i }));
    const defaultRow = within(panel).getByText('Default').closest('div.rounded-md');
    await user.click(within(defaultRow).getByRole('button', { name: 'Load' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Time Limit (years)')).toHaveValue(
        String(assumptionsData.globalParameters.timeLimit)
      );
    });

    expect(localStorage.getItem('customEffectsData')).toBeNull();
    expect(localStorage.getItem('activeSavedAssumptionsId:v1')).toBeNull();

    const activeDefaultRow = within(panel).getByText('Default').closest('div.rounded-md');
    expect(within(activeDefaultRow).getByText('Active')).toBeInTheDocument();
  });

  it('loads a saved assumptions entry after replace confirmation when local custom assumptions exist', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
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
    expect(await screen.findByText('Imported From Friend')).toBeInTheDocument();

    const panel = screen.getByText('Saved Assumptions').closest('section');
    const importedRow = within(panel).getByText('Imported From Friend').closest('div.rounded-md');
    const loadButton = within(importedRow).getByRole('button', { name: 'Load' });
    await user.click(loadButton);

    expect(await screen.findByText('Load Saved Assumptions?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Continue (Replace Mine)' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Time Limit (years)')).toHaveValue('220');
    });
  });

  it('loads without replace confirmation when current assumptions match a saved entry', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
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

    await user.click(screen.getByRole('button', { name: /Show Inactive/i }));

    const panel = screen.getByText('Saved Assumptions').closest('section');
    const targetRow = within(panel).getByText('Target Saved').closest('div.rounded-md');
    const loadButton = within(targetRow).getByRole('button', { name: 'Load' });
    await user.click(loadButton);

    await waitFor(() => {
      expect(screen.queryByText('Load Saved Assumptions?')).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByLabelText('Time Limit (years)')).toHaveValue('200');
    });
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
    await userEvent.click(await screen.findByRole('button', { name: /Show Inactive/i }));
    expect(await screen.findByText('Imported Baseline')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Delete All Imported' })).not.toBeInTheDocument();
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
    await user.click(await screen.findByRole('button', { name: /Show Inactive/i }));
    expect(await screen.findByText('Old Label')).toBeInTheDocument();

    const panel = screen.getByText('Saved Assumptions').closest('section');
    await user.click(within(panel).getByRole('button', { name: 'Rename' }));

    const input = within(panel).getByDisplayValue('Old Label');
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
    const panel = await screen.findByText('Saved Assumptions');
    const section = panel.closest('section');
    await user.click(within(section).getByRole('button', { name: /Show Inactive/i }));
    const secondRow = within(section).getByText('Second Label').closest('div.rounded-md');

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

  it('prevents saving assumptions with a duplicate name', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
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
    await user.click(await screen.findByRole('button', { name: 'Save Assumptions' }));

    const labelInput = await screen.findByLabelText('Label');
    await user.clear(labelInput);
    await user.type(labelInput, ' taken name ');

    const saveButtons = screen.getAllByRole('button', { name: 'Save Assumptions' });
    await user.click(saveButtons[saveButtons.length - 1]);

    expect(screen.getByRole('heading', { name: 'Save Assumptions' })).toBeInTheDocument();
    expect(
      screen.getByText('You already have saved assumptions with that name. Choose a different name.')
    ).toBeInTheDocument();

    const entries = JSON.parse(localStorage.getItem('savedAssumptions:v1'));
    expect(entries).toHaveLength(1);
  });
});
