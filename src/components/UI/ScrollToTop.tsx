import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * On route change: scroll to top AND move keyboard/screen-reader focus to the
 * main content region (WCAG 2.2 SC 2.4.3 focus order). Improves accessibility
 * for SPA navigation where focus would otherwise stay on the clicked link.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    const main = document.getElementById('main-content');
    if (main) {
      main.focus({ preventScroll: true });
    }
  }, [pathname]);

  return null;
}
