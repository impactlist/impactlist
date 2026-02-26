import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AssumptionsPage from './AssumptionsPage';
import { AssumptionsProvider } from '../contexts/AssumptionsContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { createDefaultAssumptions } from '../utils/assumptionsDataHelpers';
import { saveNewAssumptions } from '../utils/savedAssumptionsStore';
import GlobalSharedAssumptionsImport from '../components/shared/GlobalSharedAssumptionsImport';
import GlobalNotificationBanner from '../components/shared/GlobalNotificationBanner';

/* global localStorage */

const assumptionsData = createDefaultAssumptions();

const LocationProbe = () => {
  const location = useLocation();
  return <div data-testid="location-probe">{`${location.pathname}${location.search}`}</div>;
};

const renderAppRoutes = (initialEntry, { strictMode = false } = {}) => {
  const tree = (
    <NotificationProvider>
      <AssumptionsProvider>
        <MemoryRouter initialEntries={[initialEntry]}>
          <GlobalNotificationBanner />
          <GlobalSharedAssumptionsImport />
          <LocationProbe />
          <Routes>
            <Route path="/" element={<div>Home</div>} />
            <Route path="/assumptions" element={<AssumptionsPage />} />
          </Routes>
        </MemoryRouter>
      </AssumptionsProvider>
    </NotificationProvider>
  );

  render(strictMode ? <React.StrictMode>{tree}</React.StrictMode> : tree);
};

const getPersistedCustomEffectsData = () => {
  const raw = localStorage.getItem('customEffectsData');
  return raw ? JSON.parse(raw) : null;
};

describe('Global shared assumptions import flow', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    globalThis.fetch = originalFetch;
  });

  it('auto-imports shared assumptions and preserves non-shared query params', async () => {
    const incomingTimeLimit = Number(assumptionsData.globalParameters.timeLimit) + 25;
    const user = userEvent.setup();

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 'abc123',
        assumptions: {
          globalParameters: {
            timeLimit: incomingTimeLimit,
          },
        },
      }),
    });

    renderAppRoutes('/assumptions?tab=categories&shared=abc123');

    expect(await screen.findByText('Shared assumptions loaded.')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('location-probe').textContent).toBe('/assumptions?tab=categories');
    });

    await waitFor(() => {
      expect(getPersistedCustomEffectsData()).toEqual({
        globalParameters: {
          timeLimit: incomingTimeLimit,
        },
      });
    });

    const savedAssumptionsRaw = localStorage.getItem('savedAssumptions:v1');
    expect(savedAssumptionsRaw).toBeTruthy();
    const savedAssumptions = JSON.parse(savedAssumptionsRaw);
    expect(savedAssumptions).toHaveLength(1);
    expect(savedAssumptions[0]).toMatchObject({
      source: 'imported',
      reference: 'abc123',
    });
    expect(localStorage.getItem('activeSavedAssumptionsId:v1')).toBe(savedAssumptions[0].id);
    expect(await screen.findByText('abc123')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Global' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Time Limit (years)')).toHaveValue(String(incomingTimeLimit));
    });
  });

  it('auto-imports shared assumptions from home route in React StrictMode', async () => {
    const incomingTimeLimit = Number(assumptionsData.globalParameters.timeLimit) + 28;

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 'strict123',
        assumptions: {
          globalParameters: {
            timeLimit: incomingTimeLimit,
          },
        },
      }),
    });

    renderAppRoutes('/?shared=strict123', { strictMode: true });

    expect(await screen.findByText('Shared assumptions loaded.')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('location-probe').textContent).toBe('/');
    });

    await waitFor(() => {
      expect(getPersistedCustomEffectsData()).toEqual({
        globalParameters: {
          timeLimit: incomingTimeLimit,
        },
      });
    });
  });

  it('keeps local assumptions when user chooses Cancel', async () => {
    const currentTimeLimit = Number(assumptionsData.globalParameters.timeLimit) + 10;
    const incomingTimeLimit = Number(assumptionsData.globalParameters.timeLimit) + 30;

    localStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: currentTimeLimit,
        },
      })
    );

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 'shared123',
        assumptions: {
          globalParameters: {
            timeLimit: incomingTimeLimit,
          },
        },
      }),
    });

    const user = userEvent.setup();
    renderAppRoutes('/assumptions?shared=shared123');

    expect(await screen.findByText('Import Shared Assumptions?')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText('Loading shared assumptions...')).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => {
      expect(screen.getByTestId('location-probe').textContent).toBe('/assumptions');
    });

    await waitFor(() => {
      expect(getPersistedCustomEffectsData()).toEqual({
        globalParameters: {
          timeLimit: currentTimeLimit,
        },
      });
    });
  });

  it('replaces local assumptions when user chooses Continue (Replace Mine)', async () => {
    const currentTimeLimit = Number(assumptionsData.globalParameters.timeLimit) + 12;
    const incomingTimeLimit = Number(assumptionsData.globalParameters.timeLimit) + 44;

    localStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: currentTimeLimit,
        },
      })
    );

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 'shared456',
        assumptions: {
          globalParameters: {
            timeLimit: incomingTimeLimit,
          },
        },
      }),
    });

    const user = userEvent.setup();
    renderAppRoutes('/?shared=shared456');

    expect(await screen.findByText('Import Shared Assumptions?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Continue (Replace Mine)' }));

    await waitFor(() => {
      expect(screen.getByTestId('location-probe').textContent).toBe('/');
    });

    await waitFor(() => {
      expect(getPersistedCustomEffectsData()).toEqual({
        globalParameters: {
          timeLimit: incomingTimeLimit,
        },
      });
    });
  });

  it('shows error and removes shared param when shared snapshot lookup fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({
        error: 'not_found',
        message: 'Shared assumptions were not found.',
      }),
    });

    renderAppRoutes('/assumptions?tab=recipients&shared=missing-reference');

    expect(await screen.findByText('Shared assumptions were not found.')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('location-probe').textContent).toBe('/assumptions?tab=recipients');
    });
  });

  it('loads shared assumptions when imported name collides and stores them with a suffixed label', async () => {
    const incomingTimeLimit = Number(assumptionsData.globalParameters.timeLimit) + 31;
    const seeded = saveNewAssumptions({
      label: 'Shared Name',
      assumptions: {
        globalParameters: {
          timeLimit: Number(assumptionsData.globalParameters.timeLimit) + 7,
        },
      },
      source: 'local',
    });
    if (!seeded.ok) {
      throw new Error('Expected seeded local saved assumptions entry');
    }

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 'shared-name-ref',
        name: 'Shared Name',
        assumptions: {
          globalParameters: {
            timeLimit: incomingTimeLimit,
          },
        },
      }),
    });

    renderAppRoutes('/assumptions?shared=shared-name-ref');

    expect(await screen.findByText('Shared assumptions loaded.')).toBeInTheDocument();

    await waitFor(() => {
      expect(getPersistedCustomEffectsData()).toEqual({
        globalParameters: {
          timeLimit: incomingTimeLimit,
        },
      });
    });

    const savedAssumptions = JSON.parse(localStorage.getItem('savedAssumptions:v1'));
    const importedEntry = savedAssumptions.find((entry) => entry.reference === 'shared-name-ref');
    expect(importedEntry).toBeTruthy();
    expect(importedEntry.label).toBe('Shared Name (2)');
    expect(localStorage.getItem('activeSavedAssumptionsId:v1')).toBe(importedEntry.id);
  });

  it('still upserts and activates imported entry when shared assumptions are already applied', async () => {
    const appliedTimeLimit = Number(assumptionsData.globalParameters.timeLimit) + 41;
    localStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: appliedTimeLimit,
        },
      })
    );

    const seeded = saveNewAssumptions({
      label: 'Shared Name',
      assumptions: {
        globalParameters: {
          timeLimit: appliedTimeLimit,
        },
      },
      source: 'local',
    });
    if (!seeded.ok) {
      throw new Error('Expected seeded local saved assumptions entry');
    }

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 'already-applied-ref',
        name: 'Shared Name',
        assumptions: {
          globalParameters: {
            timeLimit: appliedTimeLimit,
          },
        },
      }),
    });

    renderAppRoutes('/assumptions?shared=already-applied-ref');

    expect(await screen.findByText('Import Shared Assumptions?')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Continue (Replace Mine)' }));

    await waitFor(() => {
      expect(screen.getByTestId('location-probe').textContent).toBe('/assumptions');
    });

    const savedAssumptions = JSON.parse(localStorage.getItem('savedAssumptions:v1'));
    expect(savedAssumptions).toHaveLength(2);

    const importedEntry = savedAssumptions.find((entry) => entry.reference === 'already-applied-ref');
    expect(importedEntry).toBeTruthy();
    expect(importedEntry.label).toBe('Shared Name (2)');
    expect(localStorage.getItem('activeSavedAssumptionsId:v1')).toBe(importedEntry.id);
  });

  it('does not clear local assumptions when shared snapshot response is invalid', async () => {
    const currentTimeLimit = Number(assumptionsData.globalParameters.timeLimit) + 22;

    localStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: currentTimeLimit,
        },
      })
    );

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 'bad-shape',
      }),
    });

    renderAppRoutes('/assumptions?shared=bad-shape');

    expect(await screen.findByText('Server returned an invalid snapshot response.')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('location-probe').textContent).toBe('/assumptions');
    });

    expect(getPersistedCustomEffectsData()).toEqual({
      globalParameters: {
        timeLimit: currentTimeLimit,
      },
    });
  });

  it('shows error when shared snapshot contains no usable custom assumptions', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 'no-custom',
        assumptions: {
          globalParameters: {},
          categories: {},
          recipients: {},
        },
      }),
    });

    renderAppRoutes('/assumptions?shared=no-custom');

    expect(
      await screen.findByText('Shared assumptions link did not contain usable custom assumptions.')
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('location-probe').textContent).toBe('/assumptions');
    });
  });

  it('commits unsaved global edits before creating a share link', async () => {
    const initialTimeLimit = Number(assumptionsData.globalParameters.timeLimit) + 5;
    const unsavedTimeLimit = initialTimeLimit + 40;

    localStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: initialTimeLimit,
        },
      })
    );

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async (url, options = {}) => {
      if (url === '/api/shared-assumptions' && options.method === 'POST') {
        return {
          ok: true,
          json: async () => ({
            id: 'save-with-unsaved',
            reference: 'save-with-unsaved',
          }),
        };
      }

      throw new Error(`Unexpected fetch call: ${String(url)}`);
    });

    const user = userEvent.setup();
    renderAppRoutes('/assumptions');

    const timeLimitInput = await screen.findByLabelText('Time Limit (years)');
    await user.clear(timeLimitInput);
    await user.type(timeLimitInput, String(unsavedTimeLimit));

    await user.click(screen.getByRole('button', { name: 'Share Assumptions' }));
    expect(await screen.findByRole('heading', { name: 'Share Assumptions' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Create Link' }));

    await waitFor(() => {
      expect(
        fetchMock.mock.calls.some(([url, options]) => url === '/api/shared-assumptions' && options?.method === 'POST')
      ).toBe(true);
    });

    const postCall = fetchMock.mock.calls.find(
      ([url, options]) => url === '/api/shared-assumptions' && options?.method === 'POST'
    );
    const payload = JSON.parse(postCall[1].body);
    expect(payload.assumptions.globalParameters.timeLimit).toBe(unsavedTimeLimit);
  });
});
