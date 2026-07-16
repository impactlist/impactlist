import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App, { RouteErrorFallback } from './App';

const BrokenPage = () => {
  throw new Error('private implementation detail');
};

describe('RouteErrorFallback', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('replaces data-router render failures with a focused recovery screen', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const router = createMemoryRouter([
      {
        path: '/',
        element: <BrokenPage />,
        errorElement: <RouteErrorFallback />,
      },
    ]);

    render(<RouterProvider router={router} />);

    const heading = await screen.findByRole('heading', { name: 'Something went wrong' });
    await waitFor(() => expect(heading).toHaveFocus());
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to Impact List' })).toHaveAttribute('href', '/');
    expect(screen.queryByText('private implementation detail')).not.toBeInTheDocument();
  });

  it('surfaces unexpected unhandled promise rejections without exposing their details', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<App />);

    const rejectionEvent = new globalThis.Event('unhandledrejection', { cancelable: true });
    Object.defineProperty(rejectionEvent, 'reason', {
      value: new Error('private async failure detail'),
    });
    fireEvent(window, rejectionEvent);

    expect(await screen.findByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
    expect(screen.queryByText('private async failure detail')).not.toBeInTheDocument();
    expect(rejectionEvent.defaultPrevented).toBe(true);
  });

  it('ignores message-only browser and cross-origin script errors', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<App />);

    const messageOnlyEvents = [
      new globalThis.ErrorEvent('error', {
        cancelable: true,
        message: 'ResizeObserver loop completed with undelivered notifications.',
      }),
      new globalThis.ErrorEvent('error', {
        cancelable: true,
        filename: 'https://example.com/foreign-script.js',
        message: 'Script error.',
      }),
    ];

    messageOnlyEvents.forEach((event) => {
      fireEvent(window, event);
      expect(event.defaultPrevented).toBe(false);
    });

    expect(screen.queryByRole('heading', { name: 'Something went wrong' })).not.toBeInTheDocument();
    expect(consoleError).not.toHaveBeenCalled();
  });

  it('fails hard for genuine global errors', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<App />);
    const error = new Error('private global failure detail');
    const errorEvent = new globalThis.ErrorEvent('error', {
      cancelable: true,
      error,
      message: error.message,
    });

    fireEvent(window, errorEvent);

    expect(await screen.findByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
    expect(screen.queryByText('private global failure detail')).not.toBeInTheDocument();
    expect(errorEvent.defaultPrevented).toBe(true);
    expect(consoleError).toHaveBeenCalledWith('Global error:', error);
  });
});
