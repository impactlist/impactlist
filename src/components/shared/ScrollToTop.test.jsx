import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider, useNavigate } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ScrollToTop from './ScrollToTop';

const NavButtons = () => {
  const navigate = useNavigate();
  return (
    <>
      <button type="button" onClick={() => navigate('/assumptions?tab=categories')}>
        Push Params
      </button>
      <button type="button" onClick={() => navigate('/assumptions?tab=global', { replace: true })}>
        Replace Params
      </button>
      <button type="button" onClick={() => navigate('/faq')}>
        Push Page
      </button>
      <button type="button" onClick={() => navigate(-1)}>
        Back
      </button>
    </>
  );
};

const renderAt = (initialEntry) => {
  const router = createMemoryRouter(
    [
      {
        path: '*',
        element: (
          <>
            <ScrollToTop />
            <NavButtons />
          </>
        ),
      },
    ],
    { initialEntries: [initialEntry] }
  );
  render(<RouterProvider router={router} />);
};

describe('ScrollToTop', () => {
  let scrollSpy;

  beforeEach(() => {
    scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not scroll for same-pathname navigations (editor tab/entity params)', async () => {
    const user = userEvent.setup();
    renderAt('/assumptions');

    expect(scrollSpy).not.toHaveBeenCalled();

    // Opening a drill-in editor is a same-path push; Cancel/Apply are
    // same-path replaces. Neither is "arriving on a new page".
    await user.click(screen.getByRole('button', { name: 'Push Params' }));
    await user.click(screen.getByRole('button', { name: 'Replace Params' }));

    expect(scrollSpy).not.toHaveBeenCalled();
  });

  it('scrolls to top when a forward navigation changes the pathname, but not on POP', async () => {
    const user = userEvent.setup();
    renderAt('/assumptions');

    await user.click(screen.getByRole('button', { name: 'Push Page' }));
    await waitFor(() => {
      expect(scrollSpy).toHaveBeenCalledWith(0, 0);
    });

    scrollSpy.mockClear();
    await user.click(screen.getByRole('button', { name: 'Back' }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Push Page' })).toBeInTheDocument();
    });
    expect(scrollSpy).not.toHaveBeenCalled();
  });
});
