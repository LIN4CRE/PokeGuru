import { useSearchParams } from 'react-router-dom';
import { useCardSearch } from '../hooks/useApi';
import type { CardType, SortOption } from '../types/pokemon';
import CardGrid from '../components/Cards/CardGrid';
import Pagination from '../components/UI/Pagination';
import SkeletonGrid from '../components/UI/SkeletonGrid';
import ErrorMessage from '../components/UI/ErrorMessage';

const CARD_TYPES: CardType[] = [
  '',
  'Colorless',
  'Darkness',
  'Dragon',
  'Fairy',
  'Fighting',
  'Fire',
  'Grass',
  'Lightning',
  'Metal',
  'Psychic',
  'Water',
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: '', label: 'Name (A–Z)' },
  { value: 'newest', label: 'Newest sets' },
  { value: 'oldest', label: 'Oldest sets' },
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const query = searchParams.get('q') || '';
  const type = (searchParams.get('type') || '') as CardType;
  const sort = (searchParams.get('sort') || '') as SortOption;
  const page = parseInt(searchParams.get('page') || '1', 10);

  const { data, loading, error } = useCardSearch(query, type, sort, page);

  const updateParams = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    // Reset to page 1 when filters change
    if (!('page' in updates)) {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  const handleTypeChange = (newType: string) => {
    updateParams({ type: newType });
  };

  const handleSortChange = (newSort: string) => {
    updateParams({ sort: newSort });
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: String(newPage) });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-xl font-semibold">
          Results for "{query}"
        </h1>
        {data && (
          <span className="text-sm text-[var(--muted)]">
            {data.totalCount?.toLocaleString() || 0} card{data.totalCount === 1 ? '' : 's'}
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <select
          value={type}
          onChange={(e) => handleTypeChange(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
          aria-label="Filter by type"
        >
          {CARD_TYPES.map((t) => (
            <option key={t} value={t}>
              {t ? `Type: ${t}` : 'All types'}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
          aria-label="Sort results"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              Sort: {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      {loading && <SkeletonGrid count={24} />}

      {error && (
        <ErrorMessage 
          message={error}
          onRetry={() => window.location.reload()}
        />
      )}

      {data && (
        <>
          <CardGrid cards={data.data} />
          <Pagination
            currentPage={page}
            totalCount={data.totalCount || 0}
            pageSize={24}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
