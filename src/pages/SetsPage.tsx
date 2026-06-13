import { useState, useMemo } from 'react';
import { useSets } from '../hooks/useApi';
import { useTitle } from '../hooks/useTitle';
import SetTile from '../components/Sets/SetTile';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';

export default function SetsPage() {
  useTitle('All Sets');
  const [retryCount, setRetryCount] = useState(0);
  const { data: sets, loading, error } = useSets(retryCount);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('');

  // Get unique series names
  const seriesOptions = useMemo(() => {
    if (!sets) return [];
    const series = [...new Set(sets.map((s) => s.series))];
    return series.sort();
  }, [sets]);

  // Filter sets
  const filteredSets = useMemo(() => {
    if (!sets) return [];
    return sets.filter((set) => {
      const matchesSearch = !searchQuery || 
        set.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSeries = !selectedSeries || set.series === selectedSeries;
      return matchesSearch && matchesSeries;
    });
  }, [sets, searchQuery, selectedSeries]);

  if (loading) {
    return <LoadingSpinner message="Loading sets..." />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error}
        onRetry={() => setRetryCount(c => c + 1)}
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pokémon TCG Sets</h1>
          <p className="text-sm text-[var(--muted)]">
            Browse all {sets?.length || 0} official sets
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search sets..."
          className="flex-1 min-w-[200px] max-w-[300px] rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
        />
        <select
          value={selectedSeries}
          onChange={(e) => setSelectedSeries(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
        >
          <option value="">All Series</option>
          {seriesOptions.map((series) => (
            <option key={series} value={series}>{series}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      {searchQuery || selectedSeries ? (
        <p className="mb-4 text-sm text-[var(--muted)]">
          Showing {filteredSets.length} of {sets?.length || 0} sets
        </p>
      ) : null}

      {/* Sets Grid */}
      {filteredSets.length === 0 ? (
        <div className="py-16 text-center text-lg text-[var(--muted)]">
          No sets found matching your criteria.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSets.map((set) => (
            <SetTile key={set.id} set={set} />
          ))}
        </div>
      )}
    </div>
  );
}
