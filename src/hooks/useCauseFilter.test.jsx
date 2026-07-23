import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import useCauseFilter, { parseCauseSelection } from './useCauseFilter';

const categories = [
  { id: 'animal-welfare', name: 'Animal Welfare' },
  { id: 'climate-change', name: 'Climate Change' },
  { id: 'global-health', name: 'Global Health' },
];

const Harness = () => {
  const location = useLocation();
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
  it('reads a cause selection from the URL', () => {
    render(
      <MemoryRouter initialEntries={['/?causes=global-health%2Cclimate-change']}>
        <Harness />
      </MemoryRouter>
    );

    expect(screen.getByTestId('selection')).toHaveTextContent('climate-change|global-health');
    expect(screen.getByTestId('invalid-selection')).toHaveTextContent('valid');
  });

  it('treats a partially valid selection as a valid filtered scope', () => {
    render(
      <MemoryRouter initialEntries={['/?causes=stale-id%2Cglobal-health']}>
        <Harness />
      </MemoryRouter>
    );

    expect(screen.getByTestId('selection')).toHaveTextContent('global-health');
    expect(screen.getByTestId('invalid-selection')).toHaveTextContent('valid');
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
  });

  it('removes the query parameter when resetting to all causes', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/?causes=global-health']}>
        <Harness />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: 'Reset' }));

    expect(screen.getByTestId('selection')).toHaveTextContent('all');
    expect(screen.getByTestId('location')).toHaveTextContent('/');
  });

  it('removes an invalid-only parameter while preserving unrelated parameters', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/?shared=example&causes=stale-id']}>
        <Harness />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: 'Clear invalid' }));

    expect(screen.getByTestId('invalid-selection')).toHaveTextContent('valid');
    expect(screen.getByTestId('location')).toHaveTextContent('/?shared=example');
  });
});
