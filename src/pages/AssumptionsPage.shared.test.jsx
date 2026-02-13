import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AssumptionsPage from './AssumptionsPage';
import { AssumptionsProvider } from '../contexts/AssumptionsContext';
import { createDefaultAssumptions } from '../utils/assumptionsDataHelpers';

/* global localStorage */

const assumptionsData = createDefaultAssumptions();

const LocationProbe = () => {
  const location = useLocation();
  return <div data-testid="location-probe">{`${location.pathname}${location.search}`}</div>;
};

const renderAssumptionsRoute = (initialEntry) => {
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <LocationProbe />
      <Routes>
        <Route
          path="/assumptions"
          element={
            <AssumptionsProvider>
              <AssumptionsPage />
            </AssumptionsProvider>
          }
        />
      </Routes>
    </MemoryRouter>
  );
};

const getPersistedCustomEffectsData = () => {
  const raw = localStorage.getItem('customEffectsData');
  return raw ? JSON.parse(raw) : null;
};

describe('AssumptionsPage shared import flow', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    globalThis.fetch = originalFetch;
  });

  it('auto-imports shared assumptions when no local custom assumptions exist', async () => {
    const incomingTimeLimit = Number(assumptionsData.globalParameters.timeLimit) + 25;

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

    renderAssumptionsRoute('/assumptions?tab=categories&shared=abc123');

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
  });

  it('keeps local assumptions when user chooses Keep Mine', async () => {
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
    renderAssumptionsRoute('/assumptions?shared=shared123');

    expect(await screen.findByText('Import Shared Assumptions?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Keep Mine' }));

    await waitFor(() => {
      expect(screen.getByTestId('location-probe').textContent).not.toContain('shared=');
    });

    await waitFor(() => {
      expect(getPersistedCustomEffectsData()).toEqual({
        globalParameters: {
          timeLimit: currentTimeLimit,
        },
      });
    });
  });

  it('replaces local assumptions when user chooses Replace Mine', async () => {
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
    renderAssumptionsRoute('/assumptions?shared=shared456');

    expect(await screen.findByText('Import Shared Assumptions?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Replace Mine' }));

    await waitFor(() => {
      expect(screen.getByTestId('location-probe').textContent).not.toContain('shared=');
    });

    await waitFor(() => {
      expect(getPersistedCustomEffectsData()).toEqual({
        globalParameters: {
          timeLimit: incomingTimeLimit,
        },
      });
    });
  });

  it('saves local assumptions first, then imports incoming shared assumptions', async () => {
    const currentTimeLimit = Number(assumptionsData.globalParameters.timeLimit) + 7;
    const incomingTimeLimit = Number(assumptionsData.globalParameters.timeLimit) + 55;

    localStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: currentTimeLimit,
        },
      })
    );

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async (url, options = {}) => {
      if (url === '/api/shared-assumptions' && options.method === 'POST') {
        return {
          ok: true,
          json: async () => ({
            id: 'savedmine123',
            reference: 'saved-mine',
            shareUrl: 'https://impactlist.xyz/assumptions?shared=saved-mine',
          }),
        };
      }

      return {
        ok: true,
        json: async () => ({
          id: 'incoming123',
          assumptions: {
            globalParameters: {
              timeLimit: incomingTimeLimit,
            },
          },
        }),
      };
    });

    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions?shared=incoming123');

    expect(await screen.findByText('Import Shared Assumptions?')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Save Mine First' }));
    expect(await screen.findByRole('heading', { name: 'Save Yours First' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Save & Continue' }));

    await waitFor(() => {
      expect(screen.getByTestId('location-probe').textContent).toBe('/assumptions');
    });

    await waitFor(() => {
      expect(getPersistedCustomEffectsData()).toEqual({
        globalParameters: {
          timeLimit: incomingTimeLimit,
        },
      });
    });

    expect(fetchMock.mock.calls.some(([url]) => url === '/api/shared-assumptions/incoming123')).toBe(true);
    expect(
      fetchMock.mock.calls.some(([url, options]) => url === '/api/shared-assumptions' && options?.method === 'POST')
    ).toBe(true);
  });

  it('returns to decision modal when Save Mine First is canceled and does not import', async () => {
    const currentTimeLimit = Number(assumptionsData.globalParameters.timeLimit) + 15;
    const incomingTimeLimit = Number(assumptionsData.globalParameters.timeLimit) + 65;

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
        id: 'incoming-cancel',
        assumptions: {
          globalParameters: {
            timeLimit: incomingTimeLimit,
          },
        },
      }),
    });

    const user = userEvent.setup();
    renderAssumptionsRoute('/assumptions?shared=incoming-cancel');

    expect(await screen.findByText('Import Shared Assumptions?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Save Mine First' }));
    expect(await screen.findByRole('heading', { name: 'Save Yours First' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(await screen.findByText('Import Shared Assumptions?')).toBeInTheDocument();
    expect(screen.getByTestId('location-probe').textContent).toContain('shared=incoming-cancel');
    expect(getPersistedCustomEffectsData()).toEqual({
      globalParameters: {
        timeLimit: currentTimeLimit,
      },
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

    renderAssumptionsRoute('/assumptions?tab=recipients&shared=missing-reference');

    expect(await screen.findByText('Shared assumptions were not found.')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('location-probe').textContent).toBe('/assumptions?tab=recipients');
    });
  });
});
