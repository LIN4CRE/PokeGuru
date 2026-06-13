import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Layers, ArrowUpDown, Wallet } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useSetCards } from '../hooks/useApi';
import { useTitle } from '../hooks/useTitle';
import { useCollection } from '../hooks/useCollection';
import { getCardValueGBP } from '../utils/pricing';
import CardGrid from '../components/Cards/CardGrid';
import Pagination from '../components/UI/Pagination';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';

export default function SetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState(1);
  const [retryCount, setRetryCount] = useState(0);
  const [sortBy, setSortBy] = useState<'number' | 'value_high' | 'value_low'>('number');
  const { data, loading, set, setError } = useSetCards(id || '', page, retryCount);
  const { collection } = useCollection();
  useTitle(set?.name);

  const ownedInSet = useMemo(() => {
    if (!data?.data) return [];
    const ownedIds = new Set(collection.map(c => c.card.id));
    return data.data.filter(card => ownedIds.has(card.id));
  }, [data, collection]);

  const ownedCount = ownedInSet.length;
  const totalCards = set?.total || data?.totalCount || 0;

  const sortedCards = useMemo(() => {
    if (!data?.data) return [];
    const cards = [...data.data];
    if (sortBy === 'value_high') return cards.sort((a, b) => getCardValueGBP(b) - getCardValueGBP(a));
    if (sortBy === 'value_low') return cards.sort((a, b) => getCardValueGBP(a) - getCardValueGBP(b));
    return cards;
  }, [data, sortBy]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && !set) {
    return <LoadingSpinner message="Loading set..." />;
  }

  if (setError) {
    return (
      <ErrorMessage
        message={setError}
        onRetry={() => setRetryCount(c => c + 1)}
      />
    );
  }

  const releaseDate = set?.releaseDate
    ? new Date(set.releaseDate).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div>
      {/* Back Link */}
      <Link
        to="/sets"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--text)] hover:no-underline"
      >
        <ArrowLeft size={16} />
        All Sets
      </Link>

      {/* Set Header */}
      {set && (
        <div className="mb-8 flex flex-wrap items-center gap-6">
          {set.images?.logo && (
            <img
              src={set.images.logo}
              alt={set.name}
              className="h-16 w-auto object-contain"
            />
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{set.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-[var(--muted)]">
              <span>{set.series}</span>
              {releaseDate && (
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {releaseDate}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Layers size={14} />
                {set.total} cards
              </span>
            </div>

            {/* Collection Progress */}
            {ownedCount > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <Wallet size={14} className="text-[var(--accent)]" />
                <span className="text-xs font-bold text-[var(--accent)]">
                  {ownedCount} / {totalCards} in Vault
                </span>
                <div className="h-2 w-32 overflow-hidden rounded-full bg-[var(--bg-soft)] border border-[var(--border)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] transition-all duration-500"
                    style={{ width: `${Math.round((ownedCount / totalCards) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sort & Cards Grid */}
      {loading ? (
        <LoadingSpinner message="Loading cards..." />
      ) : data ? (
        <>
          <div className="mb-4 flex items-center justify-end gap-2">
            <ArrowUpDown size={14} className="text-[var(--muted)]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'number' | 'value_high' | 'value_low')}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] outline-none focus:border-[var(--accent)]"
            >
              <option value="number">Card Number</option>
              <option value="value_high">Highest Value</option>
              <option value="value_low">Lowest Value</option>
            </select>
          </div>
          <CardGrid cards={sortedCards} emptyMessage="No cards found in this set." />
          <Pagination
            currentPage={page}
            totalCount={data.totalCount || 0}
            pageSize={50}
            onPageChange={handlePageChange}
          />
        </>
      ) : null}
    </div>
  );
}