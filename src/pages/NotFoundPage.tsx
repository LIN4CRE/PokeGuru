import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 text-8xl">🔍</div>
      <h1 className="mb-2 text-3xl font-bold">Page Not Found</h1>
      <p className="mb-8 max-w-md text-[var(--muted)]">
        The page you're looking for doesn't exist. It might have been moved or deleted.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-2.5 font-medium text-white hover:bg-[#dc2626] hover:no-underline transition-colors"
        >
          <Home size={18} />
          Go Home
        </Link>
        <Link
          to="/search?q="
          className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] px-5 py-2.5 font-medium text-[var(--text)] hover:border-[var(--accent)] hover:no-underline transition-colors"
        >
          <Search size={18} />
          Search Cards
        </Link>
      </div>
    </div>
  );
}
