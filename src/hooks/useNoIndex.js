import { useEffect } from 'react';

const ROBOTS_SELECTOR = 'meta[name="robots"]';

/**
 * Keep error pages out of search results, then restore the previous robots
 * directive when the page unmounts.
 */
const useNoIndex = () => {
  useEffect(() => {
    const existingMeta = document.querySelector(ROBOTS_SELECTOR);
    const previousContent = existingMeta?.getAttribute('content') ?? null;
    const meta = existingMeta ?? document.createElement('meta');

    if (!existingMeta) {
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex, follow');

    return () => {
      if (!existingMeta) {
        meta.remove();
      } else if (previousContent === null) {
        meta.removeAttribute('content');
      } else {
        meta.setAttribute('content', previousContent);
      }
    };
  }, []);
};

export default useNoIndex;
