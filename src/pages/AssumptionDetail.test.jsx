import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import AssumptionDetail from './AssumptionDetail';

describe('AssumptionDetail', () => {
  it.each(['__proto__', 'constructor', 'toString'])('renders NotFound for inherited object key %s', (assumptionId) => {
    render(
      <MemoryRouter initialEntries={[`/assumption/${assumptionId}`]}>
        <Routes>
          <Route path="/assumption/:assumptionId" element={<AssumptionDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
  });
});
