import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

/* global Element */

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Vitest's jsdom environment installs jsdom's AbortController/AbortSignal
// globals but keeps Node's fetch `Request`, whose undici brand check rejects
// jsdom signals ("Expected signal to be an instance of AbortSignal"). React
// Router's data router (createMemoryRouter in tests) constructs a Request
// with a signal on every navigation, so without this shim every in-test
// navigation dies as an unhandled rejection. Construct the native Request
// without the brand-checked signal and expose the caller's signal via a
// getter instead — consumers of `request.signal` (e.g. route loaders) still
// see a fully functional signal; only real undici-fetch cancellation wiring
// is skipped, which never happens in unit tests.
const NativeRequest = globalThis.Request;
class AbortInteropRequest extends NativeRequest {
  #signal;

  constructor(input, init) {
    if (init?.signal) {
      const { signal, ...rest } = init;
      super(input, rest);
      this.#signal = signal;
    } else {
      super(input, init);
    }
  }

  get signal() {
    return this.#signal ?? super.signal;
  }
}
globalThis.Request = AbortInteropRequest;

// Mock window.matchMedia if not present
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
globalThis.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = MockResizeObserver;

// jsdom doesn't implement scrollIntoView (MultiCategoryRecipientEditor
// scrolls its active category section into view on mount).
Element.prototype.scrollIntoView = vi.fn();

// jsdom doesn't implement window.scrollBy either: SortableTable's
// stuck-header focus reveal calls it whenever a header control gains focus,
// because jsdom's all-zero layout geometry always measures as "stuck".
// Without this stub every focused header click prints a jsdom
// "Not implemented" error stack. Tests asserting on the reveal spy over it.
window.scrollBy = vi.fn();
