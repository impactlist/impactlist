import { useEffect } from 'react';

const BASE_TITLE = 'Impact List';

const setMetaContent = (attribute, value, content) => {
  let meta = document.querySelector(`meta[${attribute}="${value}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, value);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
};

/**
 * Set the document and social-preview titles to "<title> — Impact List".
 *
 * Falsy titles are ignored (not reset): detail pages pass undefined while
 * their entity is still loading, and pages that render NotFound let it set
 * the title instead.
 */
const useDocumentTitle = (title) => {
  useEffect(() => {
    if (title) {
      const pageTitle = `${title} — ${BASE_TITLE}`;
      document.title = pageTitle;
      setMetaContent('property', 'og:title', pageTitle);
      setMetaContent('name', 'twitter:title', pageTitle);
    }
  }, [title]);
};

export default useDocumentTitle;
