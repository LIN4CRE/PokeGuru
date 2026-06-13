import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

/**
 * Floating button that appears when the user scrolls down.
 * Provides a one-click way to return to the top of the page.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-card)] text-[var(--muted)] shadow-lg transition-all hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--text)] hover:shadow-xl"
      aria-label="Back to top"
    >
      <ChevronUp size={20} />
    </button>
  );
}
