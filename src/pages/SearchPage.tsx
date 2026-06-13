import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCardSearch, useSets } from '../hooks/useApi';
import { useTitle } from '../hooks/useTitle';
import { getCardValueGBP } from '../utils/pricing';
import type { CardType, SortOption } from '../types/pokemon';
import CardGrid from '../components/Cards/CardGrid';
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

const RARITIES = [
  '',
  'Common',
  'Uncommon',
  'Rare',
  'Rare Holo',
  'Rare Ultra',
  'Rare Secret',
  'Illustration Rare',
  'Special Illustration Rare',
  'Hyper Rare',
];

const SUPERTYPES = [
  '',
  'Pokémon',
  'Trainer',
  'Energy',
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: '', label: 'Name (A–Z)' },
  { value: 'value_high', label: 'Highest Value' },
  { value: 'value_low', label: 'Lowest Value' },
  { value: 'newest', label: 'Newest sets' },
  { value: 'oldest', label: 'Oldest sets' },
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [retryCount, setRetryCount] = useState(0);
  const [displayCount, setDisplayCount] = useState(24);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const query = searchParams.get('q') || '';
  useTitle(query ? `Search: ${query}` : 'Search');
  const type = (searchParams.get('type') || '') as CardType;
  const rarity = searchParams.get('rarity') || '';
  const supertype = searchParams.get('supertype') || '';
  const setId = searchParams.get('set') || '';
  const sort = (searchParams.get('sort') || '') as SortOption;

  const { data: sets } = useSets();
  const { data, loading, error } = useCardSearch(
    query,
    type,
    sort,
    1,
    { rarity, supertype, setId },
    retryCount,
    250
  );

  // Reset display count when data or filters change
  useEffect(() => {
    setDisplayCount(24);
  }, [query, type, rarity, supertype, setId, sort]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && data?.data) {
          setDisplayCount(prev => Math.min(prev + 24, data.data.length));
        }
      },
      { rootMargin: '400px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [data?.data.length]);

  const updateParams = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  const handleTypeChange = (newType: string) => {
    updateParams({ type: newType });
  };

  const handleSortChange = (newSort: string) => {
    updateParams({ sort: newSort });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-xl font-semibold">
          {query ? `Results for "${query}"` : 'All Cards'}
        </h1>
        {data && (
          <span className="text-sm text-[var(--muted)]">
            {data.totalCount?.toLocaleString() || 0} card{data.totalCount === 1 ? '' : 's'}
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="sticky top-[72px] z-10 mb-8 flex flex-wrap gap-3 glass p-4 rounded-2xl shadow-xl">
        <div className="flex flex-col gap-1.5 min-w-[140px] flex-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] ml-1">Category</label>
          <select
            value={supertype}
            onChange={(e) => updateParams({ supertype: e.target.value })}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 px-3 py-2 text-sm font-bold text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all"
          >
            {SUPERTYPES.map((s) => (
              <option key={s} value={s}>
                {s ? s : 'All Categories'}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5 min-w-[140px] flex-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] ml-1">Type</label>
          <select
            value={type}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 px-3 py-2 text-sm font-bold text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all"
          >
            {CARD_TYPES.map((t) => (
              <option key={t} value={t}>
                {t ? t : 'All Types'}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5 min-w-[140px] flex-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] ml-1">Rarity</label>
          <select
            value={rarity}
            onChange={(e) => updateParams({ rarity: e.target.value })}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 px-3 py-2 text-sm font-bold text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all"
          >
            {RARITIES.map((r) => (
              <option key={r} value={r}>
                {r ? r : 'All Rarities'}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5 min-w-[140px] flex-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] ml-1">Set</label>
          <select
            value={setId}
            onChange={(e) => updateParams({ set: e.target.value })}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 px-3 py-2 text-sm font-bold text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all"
          >
            <option value="">All Sets</option>
            {sets?.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5 min-w-[140px] flex-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] ml-1">Sort</label>
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 px-3 py-2 text-sm font-bold text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {loading && <SkeletonGrid count={24} />}

      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => setRetryCount(c => c + 1)}
        />
      )}

      {data && (
        <>
          {(() => {
            const sorted = sort === 'value_high'
              ? [...data.data].sort((a, b) => getCardValueGBP(b) - getCardValueGBP(a))
              : sort === 'value_low'
              ? [...data.data].sort((a, b) => getCardValueGBP(a) - getCardValueGBP(b))
              : data.data;
            const visible = sorted.slice(0, displayCount);
            return <CardGrid cards={visible} />;
          })()}
          {displayCount < (data.data?.length || 0) && (
            <div ref={sentinelRef} className="h-10" />
          )}
        </>
      )}
    </div>
  );
}