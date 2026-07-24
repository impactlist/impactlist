import { useEffect } from 'react';

const normalizeCanonicalPathname = (pathname) => {
  if (pathname === '/categories') {
    return '/causes';
  }
  if (pathname.startsWith('/category/')) {
    return pathname.replace('/category/', '/cause/');
  }

  const withoutTrailingSlash = pathname.replace(/\/+$/, '');
  return withoutTrailingSlash || '/';
};

export const buildCanonicalUrl = (origin, pathname) => `${origin}${normalizeCanonicalPathname(pathname)}`;

/**
 * Keep route-level canonical and social URLs on the production hostname.
 * Query parameters intentionally do not participate: filters, editor state,
 * and shared-assumption references are alternate views of the same route.
 */
const useRouteMetadata = (pathname) => {
  useEffect(() => {
    let canonical = document.querySelector('link[rel="canonical"]');
    let openGraphUrl = document.querySelector('meta[property="og:url"]');
    const configuredOrigin = openGraphUrl
      ? new globalThis.URL(openGraphUrl.getAttribute('content'), globalThis.location.origin).origin
      : globalThis.location.origin;
    const canonicalUrl = buildCanonicalUrl(configuredOrigin, pathname);

    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    if (!openGraphUrl) {
      openGraphUrl = document.createElement('meta');
      openGraphUrl.setAttribute('property', 'og:url');
      document.head.appendChild(openGraphUrl);
    }

    canonical.setAttribute('href', canonicalUrl);
    openGraphUrl.setAttribute('content', canonicalUrl);
  }, [pathname]);
};

export default useRouteMetadata;
