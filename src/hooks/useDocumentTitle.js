import { useEffect } from 'react';

const BASE_TITLE = 'Impact List';

/**
 * Set the document title to "<title> — Impact List".
 *
 * Falsy titles are ignored (not reset): detail pages pass undefined while
 * their entity is still loading, and pages that render NotFound let it set
 * the title instead.
 */
const useDocumentTitle = (title) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} — ${BASE_TITLE}`;
    }
  }, [title]);
};

export default useDocumentTitle;
