import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { CAUSE_SCOPE_SESSION_KEY } from '../utils/causeScopeSession';
import useCauseFilter, { parseCauseSelection } from './useCauseFilter';

/* global sessionStorage */

const categories = [
  { id: 'animal-welfare', name: 'Animal Welfare' },
  { id: 'climate-change', name: 'Climate Change' },
  { id: 'global-health', name: 'Global Health' },
];

const Harness = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedCategoryIds, hasInvalidCauseSelection, applyCauseFilter, clearInvalidCauseSelection } =
    useCauseFilter(categories);

  return (
    <>
      <output data-testid="selection">{selectedCategoryIds?.join('|') || 'all'}</output>
      <output data-testid="invalid-selection">{hasInvalidCauseSelection ? 'invalid' : 'valid'}</output>
      <output data-testid="location">{`${location.pathname}${location.search}`}</output>
      <button type="button" onClick={() => applyCauseFilter(['global-health', 'climate-change'])}>
        Apply two
      </button>
      <button type="button" onClick={() => applyCauseFilter(null)}>
        Reset
      </button>
      <button type="button" onClick={clearInvalidCauseSelection}>
        Clear invalid
      </button>
      <button type="button" onClick={() => navigate(-1)}>
        Back
      </button>
      <button type="button" onClick={() => navigate(1)}>
        Forward
      </button>
    </>
  );
};

const HeaderNavigationHarness = () => {
  const location = useLocation();

  return (
    <>
      <Header isHome={location.pathname === '/'} isFAQ={location.pathname === '/faq'} />
      <Routes>
        <Route path="/" element={<Harness />} />
        <Route path="/faq" element={<p>FAQ page</p>} />
      </Routes>
    </>
  );
};

describe('parseCauseSelection', () => {
  it('keeps valid ids in canonical category order and removes duplicates', () => {
    expect(parseCauseSelection('global-health,unknown,climate-change,global-health', categories)).toEqual([
      'climate-change',
      'global-health',
    ]);
  });

  it('uses the all-cause sentinel for empty, invalid-only, and complete selections', () => {
    expect(parseCauseSelection('', categories)).toBeNull();
    expect(parseCauseSelection('unknown', categories)).toBeNull();
    expect(parseCauseSelection('global-health,animal-welfare,climate-change', categories)).toBeNull();
  });
});

describe('useCauseFilter', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('reads a cause selection from the URL and remembers it for tab navigation', async () => {
    render(
      <MemoryRouter initialEntries={['/?causes=global-health%2Cclimate-change']}>
        <Harness />
      </MemoryRouter>
    );

    expect(screen.getByTestId('selection')).toHaveTextContent('climate-change|global-health');
    expect(screen.getByTestId('invalid-selection')).toHaveTextContent('valid');
    await waitFor(() => expect(sessionStorage.getItem(CAUSE_SCOPE_SESSION_KEY)).toBe('climate-change,global-health'));
  });

  it('treats a partially valid selection as a valid filtered scope', async () => {
    render(
      <MemoryRouter initialEntries={['/?causes=stale-id%2Cglobal-health']}>
        <Harness />
      </MemoryRouter>
    );

    expect(screen.getByTestId('selection')).toHaveTextContent('global-health');
    expect(screen.getByTestId('invalid-selection')).toHaveTextContent('valid');
    await waitFor(() => expect(sessionStorage.getItem(CAUSE_SCOPE_SESSION_KEY)).toBe('global-health'));
  });

  it('distinguishes an invalid-only URL selection from the all-cause sentinel', () => {
    render(
      <MemoryRouter initialEntries={['/?causes=stale-id']}>
        <Harness />
      </MemoryRouter>
    );

    expect(screen.getByTestId('selection')).toHaveTextContent('all');
    expect(screen.getByTestId('invalid-selection')).toHaveTextContent('invalid');
  });

  it('writes canonical selections while preserving unrelated query parameters', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/?shared=example']}>
        <Harness />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: 'Apply two' }));

    expect(screen.getByTestId('selection')).toHaveTextContent('climate-change|global-health');
    expect(screen.getByTestId('location')).toHaveTextContent('/?shared=example&causes=climate-change%2Cglobal-health');
    expect(sessionStorage.getItem(CAUSE_SCOPE_SESSION_KEY)).toBe('climate-change,global-health');
  });

  it('treats a parameterless URL as all causes and clears the prior tab context', async () => {
    sessionStorage.setItem(CAUSE_SCOPE_SESSION_KEY, 'global-health,climate-change');

    render(
      <MemoryRouter initialEntries={['/?shared=example']}>
        <Harness />
      </MemoryRouter>
    );

    expect(screen.getByTestId('selection')).toHaveTextContent('all');
    expect(screen.getByTestId('location')).toHaveTextContent('/?shared=example');
    await waitFor(() => expect(sessionStorage.getItem(CAUSE_SCOPE_SESSION_KEY)).toBeNull());
  });

  it('uses an explicit URL scope as the current tab context', async () => {
    sessionStorage.setItem(CAUSE_SCOPE_SESSION_KEY, 'animal-welfare');

    render(
      <MemoryRouter initialEntries={['/?causes=global-health']}>
        <Harness />
      </MemoryRouter>
    );

    expect(screen.getByTestId('selection')).toHaveTextContent('global-health');
    await waitFor(() => expect(sessionStorage.getItem(CAUSE_SCOPE_SESSION_KEY)).toBe('global-health'));
  });

  it('restores the scope after navigating away with the header and returning', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/']}>
        <HeaderNavigationHarness />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: 'Apply two' }));
    await user.click(screen.getByRole('link', { name: 'FAQ' }));
    expect(screen.getByText('FAQ page')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Impact List' }));

    expect(screen.getByTestId('selection')).toHaveTextContent('climate-change|global-health');
    await waitFor(() =>
      expect(screen.getByTestId('location')).toHaveTextContent('/?causes=climate-change%2Cglobal-health')
    );
  });

  it('lets Back and Forward reproduce the exact cause scope in their URLs', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/']}>
        <Harness />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: 'Apply two' }));
    expect(screen.getByTestId('selection')).toHaveTextContent('climate-change|global-health');

    await user.click(screen.getByRole('button', { name: 'Back' }));

    expect(screen.getByTestId('selection')).toHaveTextContent('all');
    expect(screen.getByTestId('location')).toHaveTextContent('/');
    await waitFor(() => expect(sessionStorage.getItem(CAUSE_SCOPE_SESSION_KEY)).toBeNull());

    await user.click(screen.getByRole('button', { name: 'Forward' }));

    expect(screen.getByTestId('selection')).toHaveTextContent('climate-change|global-health');
    expect(screen.getByTestId('location')).toHaveTextContent('/?causes=climate-change%2Cglobal-health');
    await waitFor(() => expect(sessionStorage.getItem(CAUSE_SCOPE_SESSION_KEY)).toBe('climate-change,global-health'));
  });

  it('removes the query parameter and tab context when resetting to all causes', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem(CAUSE_SCOPE_SESSION_KEY, 'global-health');
    render(
      <MemoryRouter initialEntries={['/?causes=global-health']}>
        <Harness />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: 'Reset' }));

    expect(screen.getByTestId('selection')).toHaveTextContent('all');
    expect(screen.getByTestId('location')).toHaveTextContent('/');
    expect(sessionStorage.getItem(CAUSE_SCOPE_SESSION_KEY)).toBeNull();
  });

  it('removes an invalid-only parameter and tab context while preserving unrelated parameters', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem(CAUSE_SCOPE_SESSION_KEY, 'animal-welfare');
    render(
      <MemoryRouter initialEntries={['/?shared=example&causes=stale-id']}>
        <Harness />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: 'Clear invalid' }));

    expect(screen.getByTestId('invalid-selection')).toHaveTextContent('valid');
    expect(screen.getByTestId('location')).toHaveTextContent('/?shared=example');
    expect(sessionStorage.getItem(CAUSE_SCOPE_SESSION_KEY)).toBeNull();
  });
});
