import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import AssumptionsPage from './AssumptionsPage';
import { AssumptionsProvider } from '../contexts/AssumptionsContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { createDefaultAssumptions } from '../utils/assumptionsDataHelpers';

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
});
