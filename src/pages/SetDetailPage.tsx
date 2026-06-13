import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Layers } from 'lucide-react';
import { useState } from 'react';
import { useSetCards } from '../hooks/useApi';
import CardGrid from '../components/Cards/CardGrid';
import Pagination from '../components/UI/Pagination';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';

export default function SetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState(1);
  const [retryCount, setRetryCount] = useState(0);
  const { data, loading, set, setError } = useSetCards(id || '', page, retryCount);

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
    ? new Date(set.releaseDate).toLocaleDateString('en-US', {
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
          <div>
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
          </div>
        </div>
      )}

      {/* Cards Grid */}
      {loading ? (
        <LoadingSpinner message="Loading cards..." />
      ) : data ? (
        <>
          <CardGrid cards={data.data} emptyMessage="No cards found in this set." />
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
