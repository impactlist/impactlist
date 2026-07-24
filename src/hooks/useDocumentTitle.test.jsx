import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import useDocumentTitle from './useDocumentTitle';

const TitleProbe = ({ title }) => {
  useDocumentTitle(title);
  return null;
};

describe('useDocumentTitle', () => {
  beforeEach(() => {
    document.title = 'Existing title';
    document.head.querySelectorAll('meta[property="og:title"], meta[name="twitter:title"]').forEach((meta) => {
      meta.remove();
    });
  });

  it('sets the document and social-preview titles', () => {
    render(<TitleProbe title="Bill Gates" />);

    expect(document.title).toBe('Bill Gates — Impact List');
    expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute('content', 'Bill Gates — Impact List');
    expect(document.querySelector('meta[name="twitter:title"]')).toHaveAttribute('content', 'Bill Gates — Impact List');
  });

  it('leaves existing titles alone while a dynamic title is unavailable', () => {
    render(<TitleProbe title={undefined} />);

    expect(document.title).toBe('Existing title');
    expect(document.querySelector('meta[property="og:title"]')).not.toBeInTheDocument();
    expect(document.querySelector('meta[name="twitter:title"]')).not.toBeInTheDocument();
  });
});
