import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import useNoIndex from './useNoIndex';

const NoIndexProbe = () => {
  useNoIndex();
  return null;
};

describe('useNoIndex', () => {
  beforeEach(() => {
    document.head.querySelectorAll('meta[name="robots"]').forEach((meta) => meta.remove());
  });

  it('adds noindex while mounted and removes it on unmount', () => {
    const { unmount } = render(<NoIndexProbe />);

    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');

    unmount();
    expect(document.querySelector('meta[name="robots"]')).not.toBeInTheDocument();
  });

  it('restores an existing robots directive on unmount', () => {
    const existingMeta = document.createElement('meta');
    existingMeta.setAttribute('name', 'robots');
    existingMeta.setAttribute('content', 'index, follow');
    document.head.appendChild(existingMeta);

    const { unmount } = render(<NoIndexProbe />);
    expect(existingMeta).toHaveAttribute('content', 'noindex, follow');

    unmount();
    expect(existingMeta).toHaveAttribute('content', 'index, follow');
  });
});
