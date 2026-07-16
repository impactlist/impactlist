import { StrictMode } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider, useNavigate } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getSessionStorage } from '../../utils/safeStorage';
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
      <button type="button" onClick={() => navigate('/cause/ai-risk#full%2Djustification')}>
        Push Encoded Hash Page
      </button>
      <button type="button" onClick={() => navigate(-1)}>
        Back
      </button>
    </>
  );
};

const renderWithHistory = (initialEntries, initialIndex, { strictMode = false } = {}) => {
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
    { initialEntries, initialIndex }
  );
  const tree = <RouterProvider router={router} />;
  render(strictMode ? <StrictMode>{tree}</StrictMode> : tree);
};

const renderAt = (initialEntry) => renderWithHistory([initialEntry]);

const scrollPositionStorageKey = (locationKey, url = '/assumptions') =>
  `impactlist:scroll-position:${locationKey}:${url}`;

describe('ScrollToTop', () => {
  let scrollSpy;
  let scrollIntoViewSpy;
  let resizeCallback;
  let currentScrollX;
  let currentScrollY;

  beforeEach(() => {
    currentScrollX = 0;
    currentScrollY = 0;
    Object.defineProperty(window, 'scrollX', { configurable: true, get: () => currentScrollX });
    Object.defineProperty(window, 'scrollY', { configurable: true, get: () => currentScrollY });
    scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation((x, y) => {
      currentScrollX = x;
      currentScrollY = y;
      window.dispatchEvent(new window.Event('scroll'));
    });
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
    vi.useRealTimers();
    vi.unstubAllGlobals();
    document.getElementById('full-justification')?.remove();
    for (let index = window.sessionStorage.length - 1; index >= 0; index -= 1) {
      const key = window.sessionStorage.key(index);
      if (key?.startsWith('impactlist:scroll-position:')) {
        window.sessionStorage.removeItem(key);
      }
    }
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

  it('scrolls forward navigations to the top and restores a POP entry after lazy routing', async () => {
    const user = userEvent.setup();
    renderAt('/assumptions');

    currentScrollY = 640;
    fireEvent.scroll(window);

    await user.click(screen.getByRole('button', { name: 'Push Page' }));
    await waitFor(() => {
      expect(scrollSpy).toHaveBeenCalledWith(0, 0);
    });

    scrollSpy.mockClear();
    await user.click(screen.getByRole('button', { name: 'Back' }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Push Page' })).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(scrollSpy).toHaveBeenCalledWith(0, 640);
    });
  });

  it('restores a POP entry from session storage after the in-memory position cache is lost', async () => {
    const user = userEvent.setup();
    renderWithHistory(
      [
        { pathname: '/assumptions', key: 'assumptions-entry' },
        { pathname: '/faq', key: 'faq-entry' },
      ],
      1
    );

    // A hard reload creates a fresh ScrollToTop instance, but session storage
    // keeps the position associated with the older history entry's key.
    window.sessionStorage.setItem(scrollPositionStorageKey('assumptions-entry'), JSON.stringify({ x: 0, y: 875 }));

    await user.click(screen.getByRole('button', { name: 'Back' }));

    await waitFor(() => {
      expect(scrollSpy).toHaveBeenCalledWith(0, 875);
    });
  });

  it('restores the current page on initial load when a reload cleared the in-memory cache', async () => {
    window.sessionStorage.setItem(scrollPositionStorageKey('reload-entry'), JSON.stringify({ x: 0, y: 930 }));

    renderWithHistory([{ pathname: '/assumptions', key: 'reload-entry' }], undefined, { strictMode: true });

    await waitFor(() => {
      expect(scrollSpy).toHaveBeenCalledWith(0, 930);
    });
  });

  it('debounces persistent writes while keeping the latest position in memory', async () => {
    vi.useFakeTimers();
    const setItemSpy = vi.spyOn(window.Storage.prototype, 'setItem');
    renderWithHistory([{ pathname: '/assumptions', key: 'debounce-entry' }]);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(250);
    });
    setItemSpy.mockClear();

    for (const y of [100, 200, 300, 400]) {
      currentScrollY = y;
      fireEvent.scroll(window);
    }

    expect(setItemSpy).not.toHaveBeenCalled();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(249);
    });
    expect(setItemSpy).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });
    expect(setItemSpy).toHaveBeenCalledTimes(1);
    expect(JSON.parse(window.sessionStorage.getItem(scrollPositionStorageKey('debounce-entry')))).toEqual({
      x: 0,
      y: 400,
    });
  });

  it('flushes the latest position on pagehide before the debounce fires', () => {
    renderWithHistory([{ pathname: '/assumptions', key: 'pagehide-entry' }]);

    currentScrollY = 725;
    fireEvent.scroll(window);
    window.dispatchEvent(new window.Event('pagehide'));

    expect(JSON.parse(window.sessionStorage.getItem(scrollPositionStorageKey('pagehide-entry')))).toEqual({
      x: 0,
      y: 725,
    });
  });

  it('does not throw when persistent scroll storage fails', () => {
    getSessionStorage();
    vi.spyOn(window.Storage.prototype, 'setItem').mockImplementation(() => {
      throw new window.DOMException('Storage unavailable', 'QuotaExceededError');
    });
    renderWithHistory([{ pathname: '/assumptions', key: 'failing-storage-entry' }]);

    currentScrollY = 300;
    fireEvent.scroll(window);

    expect(() => window.dispatchEvent(new window.Event('pagehide'))).not.toThrow();
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
    // The new page moves to a stable top position while waiting, then lands
    // on the target as soon as lazy content supplies it.
    expect(scrollSpy).toHaveBeenCalledWith(0, 0);
  });

  it('decodes percent-encoded fragment IDs before looking up the target', async () => {
    const user = userEvent.setup();
    renderAt('/assumptions');

    const target = appendHashTarget();
    await user.click(screen.getByRole('button', { name: 'Push Encoded Hash Page' }));

    await waitFor(() => {
      expect(scrollIntoViewSpy).toHaveBeenCalled();
    });
    expect(scrollIntoViewSpy.mock.instances[0]).toBe(target);
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
