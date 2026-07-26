import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { setRememberedCauseScope } from '../../utils/causeScopeSession';
import BackButton from './BackButton';

/* global sessionStorage */

const LocationProbe = () => {
  const location = useLocation();
  return <div data-testid="location">{`${location.pathname}${location.search}`}</div>;
};

describe('BackButton', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('carries the tab-scoped ranking through an explicit top-donors link', () => {
    setRememberedCauseScope(['climate-change', 'global-health']);
    render(
      <MemoryRouter initialEntries={['/faq']}>
        <BackButton to="/" label="Back to top donors" />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Back to top donors' })).toHaveAttribute(
      'href',
      '/?causes=climate-change%2Cglobal-health'
    );
  });

  it('uses its fallback route on a direct entry with no in-app history', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/recipient/example']}>
        <BackButton fallbackTo="/recipients" />
        <LocationProbe />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: 'Back' }));

    expect(screen.getByTestId('location')).toHaveTextContent('/recipients');
  });

  it('carries the tab-scoped ranking through a direct-entry homepage fallback', async () => {
    const user = userEvent.setup();
    setRememberedCauseScope(['global-health']);
    render(
      <MemoryRouter initialEntries={['/donor/example']}>
        <BackButton />
        <LocationProbe />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: 'Back' }));

    expect(screen.getByTestId('location')).toHaveTextContent('/?causes=global-health');
  });

  it('uses the actual previous route after an in-app navigation', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/recipients', '/recipient/example']} initialIndex={1}>
        <Routes>
          <Route
            path="*"
            element={
              <>
                <BackButton fallbackTo="/" />
                <LocationProbe />
              </>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: 'Back' }));

    expect(screen.getByTestId('location')).toHaveTextContent('/recipients');
  });

  it('uses the fallback after a replace navigation on a direct browser entry', async () => {
    const user = userEvent.setup();
    const originalHistoryState = globalThis.history.state;
    globalThis.history.replaceState({ idx: 0 }, '');

    try {
      render(
        <MemoryRouter initialEntries={[{ pathname: '/recipient/example', key: 'replacement-key' }]}>
          <BackButton fallbackTo="/recipients" />
          <LocationProbe />
        </MemoryRouter>
      );

      await user.click(screen.getByRole('button', { name: 'Back' }));

      expect(screen.getByTestId('location')).toHaveTextContent('/recipients');
    } finally {
      globalThis.history.replaceState(originalHistoryState, '');
    }
  });
});
