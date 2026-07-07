import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Scroll to top when a forward navigation lands on a DIFFERENT page.
 *
 * - POP navigations (back/forward buttons) keep the browser's restored
 *   scroll position.
 * - Same-pathname navigations (search-param changes like the assumptions
 *   editor's tab/entity state) must not touch the scroll position — only a
 *   pathname change counts as arriving on a new page.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  const previousPathnameRef = useRef(pathname);

  useEffect(() => {
    const pathnameChanged = previousPathnameRef.current !== pathname;
    previousPathnameRef.current = pathname;

    if (pathnameChanged && navigationType !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [pathname, navigationType]);

  return null;
};

export default ScrollToTop;
