import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import useRouteMetadata, { buildCanonicalUrl } from './useRouteMetadata';

const MetadataProbe = ({ pathname }) => {
  useRouteMetadata(pathname);
  return null;
};

describe('buildCanonicalUrl', () => {
  it.each([
    ['/', 'https://example.org/'],
    ['/donor/bill-gates', 'https://example.org/donor/bill-gates'],
    ['/donor/bill-gates/', 'https://example.org/donor/bill-gates'],
    ['/categories', 'https://example.org/causes'],
    ['/category/global-health', 'https://example.org/cause/global-health'],
  ])('canonicalizes %s', (pathname, expected) => {
    expect(buildCanonicalUrl('https://example.org', pathname)).toBe(expected);
  });
});

describe('useRouteMetadata', () => {
  beforeEach(() => {
    document.head.querySelectorAll('link[rel="canonical"], meta[property="og:url"]').forEach((element) => {
      element.remove();
    });
    const openGraphUrl = document.createElement('meta');
    openGraphUrl.setAttribute('property', 'og:url');
    openGraphUrl.setAttribute('content', 'https://impactlist.xyz/');
    document.head.appendChild(openGraphUrl);
  });

  it('sets and updates the canonical and Open Graph URLs', () => {
    const { rerender } = render(<MetadataProbe pathname="/donor/bill-gates/" />);

    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://impactlist.xyz/donor/bill-gates'
    );
    expect(document.querySelector('meta[property="og:url"]')).toHaveAttribute(
      'content',
      'https://impactlist.xyz/donor/bill-gates'
    );

    rerender(<MetadataProbe pathname="/recipients" />);

    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://impactlist.xyz/recipients'
    );
    expect(document.querySelector('meta[property="og:url"]')).toHaveAttribute(
      'content',
      'https://impactlist.xyz/recipients'
    );
  });
});
