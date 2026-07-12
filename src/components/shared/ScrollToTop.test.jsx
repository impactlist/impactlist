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
      <button type="button" onClick={() => navigate('/cause/ai-risk#full-justification')}>
        Push Hash Page
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
  let scrollIntoViewSpy;
  let resizeCallback;

  beforeEach(() => {
    scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    scrollIntoViewSpy = vi.spyOn(window.Element.prototype, 'scrollIntoView');
    // Capture the body observer so tests can play "the page grew".
    resizeCallback = null;
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback) {
          resizeCallback = callback;
        }
        observe() {}
        unobserve() {}
        disconnect() {}
      }
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    document.getElementById('full-justification')?.remove();
  });

  const appendHashTarget = () => {
    const target = document.createElement('div');
    target.id = 'full-justification';
    document.body.appendChild(target);
    return target;
  };

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

  it('keeps retrying until a lazily rendered hash target appears, then scrolls to it', async () => {
    const user = userEvent.setup();
    renderAt('/assumptions');

    await user.click(screen.getByRole('button', { name: 'Push Hash Page' }));

    // Route pages are React.lazy: the target renders some frames after the
    // navigation commits, so there is nothing to scroll to yet.
    expect(scrollIntoViewSpy).not.toHaveBeenCalled();

    const target = appendHashTarget();

    await waitFor(() => {
      expect(scrollIntoViewSpy).toHaveBeenCalled();
    });
    expect(scrollIntoViewSpy.mock.instances[0]).toBe(target);
    // The to-the-top fallback never fired — the page stays on the target.
    expect(scrollSpy).not.toHaveBeenCalled();
  });

  it('scrolls to the hash target on the initial load too', async () => {
    renderAt('/cause/ai-risk#full-justification');

    const target = appendHashTarget();

    await waitFor(() => {
      expect(scrollIntoViewSpy).toHaveBeenCalled();
    });
    expect(scrollIntoViewSpy.mock.instances[0]).toBe(target);
  });

  it('re-pins only when growth actually moved the target, not when content below it grows', async () => {
    const user = userEvent.setup();
    renderAt('/assumptions');
    await user.click(screen.getByRole('button', { name: 'Push Hash Page' }));

    const target = appendHashTarget();
    const rect = { top: 0 };
    vi.spyOn(target, 'getBoundingClientRect').mockImplementation(() => rect);

    await waitFor(() => {
      expect(scrollIntoViewSpy).toHaveBeenCalledTimes(1);
    });

    // Content BELOW the anchor grows (donation table): body resizes but the
    // target hasn't moved — no re-scroll.
    resizeCallback();
    expect(scrollIntoViewSpy).toHaveBeenCalledTimes(1);

    // A chart ABOVE the target finishes measuring and expands, pushing the
    // already-scrolled-to target back down the page — re-pin.
    rect.top = 300;
    resizeCallback();
    expect(scrollIntoViewSpy).toHaveBeenCalledTimes(2);
  });

  it('stops pinning the moment the user interacts', async () => {
    const user = userEvent.setup();
    renderAt('/assumptions');
    await user.click(screen.getByRole('button', { name: 'Push Hash Page' }));

    const target = appendHashTarget();
    const rect = { top: 0 };
    vi.spyOn(target, 'getBoundingClientRect').mockImplementation(() => rect);

    await waitFor(() => {
      expect(scrollIntoViewSpy).toHaveBeenCalledTimes(1);
    });

    // Grabbing the scrollbar fires pointerdown (no wheel, touch, or key).
    window.dispatchEvent(new window.Event('pointerdown'));
    rect.top = 300;
    resizeCallback();

    expect(scrollIntoViewSpy).toHaveBeenCalledTimes(1);
  });
});
