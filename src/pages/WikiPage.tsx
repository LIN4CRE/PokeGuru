import { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Book, ChevronDown, ChevronRight, Search, Layers, Calendar, Hash, Filter } from 'lucide-react';
import UK_ERAS, { getTotalSetCount, getTotalCardCount } from '../data/ukSets';
import type { WikiSet } from '../data/ukSets';

type ViewMode = 'timeline' | 'table';

export default function WikiPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialEra = searchParams.get('era') || '';
  const initialSearch = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedEra, setSelectedEra] = useState(initialEra);
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [expandedEras, setExpandedEras] = useState<Set<string>>(() => {
    // If an era is selected via URL, expand it
    if (initialEra) return new Set([initialEra]);
    // Otherwise expand the first era by default
    return new Set([UK_ERAS[0].slug]);
  });

  const eraRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedEra) params.set('era', selectedEra);
    if (searchQuery) params.set('q', searchQuery);
    setSearchParams(params, { replace: true });
  }, [selectedEra, searchQuery, setSearchParams]);

  // Auto-scroll to era when selected
  useEffect(() => {
    if (selectedEra && eraRefs.current[selectedEra]) {
      eraRefs.current[selectedEra]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedEra]);

  const totalSets = getTotalSetCount();
  const totalCards = getTotalCardCount();

  // Filtered data
  const filteredEras = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return UK_ERAS
      .filter((era) => !selectedEra || era.slug === selectedEra)
      .map((era) => ({
        ...era,
        sets: era.sets.filter((set) => {
          if (!q) return true;
          return (
            set.name.toLowerCase().includes(q) ||
            set.id.toLowerCase().includes(q) ||
            String(set.releaseYear).includes(q)
          );
        }),
      }))
      .filter((era) => era.sets.length > 0);
  }, [searchQuery, selectedEra]);

  const toggleEra = (slug: string) => {
    setExpandedEras((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedEras(new Set(UK_ERAS.map((e) => e.slug)));
  };

  const collapseAll = () => {
    setExpandedEras(new Set());
  };

  return (
    <div className="pb-8">
      {/* Hero Header */}
      <div className="mb-8 rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-soft)] p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-[var(--accent)]/20 p-3">
            <Book size={32} className="text-[var(--accent)]" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold md:text-3xl">
              🇬🇧 UK Pokémon Card Wiki
            </h1>
            <p className="mt-1 text-[var(--muted)]">
              Every Pokémon TCG set released in the UK — from Base Set (1999) to today
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5">
                <Layers size={14} className="text-[var(--accent)]" />
                <span className="text-[var(--text)] font-semibold">{totalSets}</span>
                <span className="text-[var(--muted)]">sets</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5">
                <Hash size={14} className="text-[var(--accent-2)]" />
                <span className="text-[var(--text)] font-semibold">{totalCards.toLocaleString()}</span>
                <span className="text-[var(--muted)]">cards</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5">
                <Calendar size={14} className="text-[var(--link)]" />
                <span className="text-[var(--text)] font-semibold">{UK_ERAS.length}</span>
                <span className="text-[var(--muted)]">eras</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px] max-w-[400px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sets by name, year..."
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] py-2.5 pl-9 pr-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
              aria-label="Search wiki"
            />
          </div>

          {/* Era Filter */}
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <select
              value={selectedEra}
              onChange={(e) => {
                setSelectedEra(e.target.value);
                if (e.target.value) {
                  setExpandedEras((prev) => new Set([...prev, e.target.value]));
                }
              }}
              className="appearance-none rounded-lg border border-[var(--border)] bg-[var(--bg-card)] py-2.5 pl-8 pr-8 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
              aria-label="Filter by era"
            >
              <option value="">All Eras</option>
              {UK_ERAS.map((era) => (
                <option key={era.slug} value={era.slug}>{era.name}</option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-2 text-xs font-medium transition-colors ${
                viewMode === 'timeline'
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--bg-card)] text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 text-xs font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--bg-card)] text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              Table
            </button>
          </div>
        </div>

        {/* Expand / Collapse */}
        {viewMode === 'timeline' && (
          <div className="flex gap-2 text-xs">
            <button
              onClick={expandAll}
              className="text-[var(--link)] hover:underline"
            >
              Expand all
            </button>
            <span className="text-[var(--muted)]">·</span>
            <button
              onClick={collapseAll}
              className="text-[var(--link)] hover:underline"
            >
              Collapse all
            </button>
            {selectedEra && (
              <>
                <span className="text-[var(--muted)]">·</span>
                <button
                  onClick={() => setSelectedEra('')}
                  className="text-[var(--accent)] hover:underline"
                >
                  Clear era filter
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* No Results */}
      {filteredEras.length === 0 && (
        <div className="py-16 text-center text-[var(--muted)]">
          <p className="text-lg">No sets found matching your search.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedEra('');
            }}
            className="mt-3 text-sm text-[var(--link)] hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Timeline View */}
      {viewMode === 'timeline' && filteredEras.map((era) => (
        <div
          key={era.slug}
          ref={(el) => { eraRefs.current[era.slug] = el; }}
          className="mb-4"
        >
          {/* Era Header */}
          <button
            onClick={() => toggleEra(era.slug)}
            className="group flex w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 text-left transition-colors hover:border-[color:var(--era-col)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            style={{ '--era-col': era.colour } as React.CSSProperties}
          >
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-white text-sm font-bold"
              style={{ backgroundColor: era.colour }}
            >
              {expandedEras.has(era.slug) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-[var(--text)] text-base">{era.name}</h2>
              <p className="text-xs text-[var(--muted)] truncate">{era.years} · {era.sets.length} sets · {era.description}</p>
            </div>
            <span
              className="flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
              style={{ backgroundColor: era.colour }}
            >
              {era.sets.length}
            </span>
          </button>

          {/* Era Sets */}
          {expandedEras.has(era.slug) && (
            <div className="ml-4 mt-2 border-l-2 border-[var(--border)] pl-4 space-y-2">
              {/* Era Description */}
              <p className="py-2 text-sm text-[var(--muted)] italic">{era.description}</p>

              {era.sets.map((set) => (
                <SetRow key={set.id} set={set} eraColour={era.colour} />
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--border)] bg-[var(--bg-card)]">
              <tr>
                <th className="px-4 py-3 font-semibold text-[var(--muted)]">Era</th>
                <th className="px-4 py-3 font-semibold text-[var(--muted)]">Set Name</th>
                <th className="px-4 py-3 font-semibold text-[var(--muted)] text-right">Cards</th>
                <th className="px-4 py-3 font-semibold text-[var(--muted)]">Release Date</th>
                <th className="px-4 py-3 font-semibold text-[var(--muted)]">Type</th>
                <th className="px-4 py-3 font-semibold text-[var(--muted)]">Browse</th>
              </tr>
            </thead>
            <tbody>
              {filteredEras.flatMap((era) =>
                era.sets.map((set, i) => (
                  <tr
                    key={set.id}
                    className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-soft)] transition-colors"
                  >
                    {i === 0 ? (
                      <td
                        className="px-4 py-3 align-top font-medium"
                        rowSpan={era.sets.length}
                      >
                        <span
                          className="inline-block rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                          style={{ backgroundColor: era.colour }}
                        >
                          {era.name.replace(/ Series| \(WOTC\)/g, '')}
                        </span>
                      </td>
                    ) : null}
                    <td className="px-4 py-3 font-medium text-[var(--text)]">{set.name}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-[var(--text)]">{set.cards}</td>
                    <td className="px-4 py-3 text-[var(--muted)] tabular-nums">
                      {new Date(set.releaseDate + 'T00:00:00').toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        set.type === 'main' ? 'bg-blue-500/20 text-blue-400' :
                        set.type === 'special' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {set.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/search?q=set.id:${set.id}`}
                        className="text-[var(--link)] hover:underline text-xs"
                      >
                        View cards →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Quick Era Navigation */}
      <div className="mt-10">
        <h3 className="mb-3 text-sm font-semibold text-[var(--muted)] uppercase tracking-wider">Quick Navigation</h3>
        <div className="flex flex-wrap gap-2">
          {UK_ERAS.map((era) => (
            <button
              key={era.slug}
              onClick={() => {
                setSelectedEra(era.slug);
                setExpandedEras((prev) => new Set([...prev, era.slug]));
              }}
              className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text)] transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{
                borderColor: selectedEra === era.slug ? era.colour : undefined,
                backgroundColor: selectedEra === era.slug ? era.colour + '20' : undefined,
              }}
            >
              {era.name.replace(/ Series| \(WOTC\)/g, '')}
              <span className="ml-1 text-[var(--muted)]">{era.years.split(' – ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-component: individual set row ─── */

function SetRow({ set, eraColour }: { set: WikiSet; eraColour: string }) {
  const formattedDate = new Date(set.releaseDate + 'T00:00:00').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="group flex items-center gap-3 rounded-lg border border-transparent bg-[var(--bg-soft)] p-3 transition-all hover:border-[var(--border)] hover:bg-[var(--bg-card)]">
      {/* Timeline Dot */}
      <div
        className="h-2.5 w-2.5 flex-shrink-0 rounded-full ring-2 ring-[var(--bg-soft)] group-hover:ring-[var(--bg-card)]"
        style={{ backgroundColor: eraColour }}
      />

      {/* Set Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-[var(--text)] text-sm truncate">{set.name}</h3>
          <span className={`flex-shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
            set.type === 'main' ? 'bg-blue-500/20 text-blue-400' :
            set.type === 'special' ? 'bg-purple-500/20 text-purple-400' :
            'bg-yellow-500/20 text-yellow-400'
          }`}>
            {set.type}
          </span>
        </div>
        <p className="text-xs text-[var(--muted)]">
          {formattedDate} · {set.cards} cards
        </p>
      </div>

      {/* Action */}
      <Link
        to={`/search?q=set.id:${set.id}`}
        className="flex-shrink-0 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1 text-xs font-medium text-[var(--muted)] opacity-0 transition-all group-hover:opacity-100 hover:text-[var(--text)] hover:border-[var(--accent)] hover:no-underline"
      >
        Browse →
      </Link>
    </div>
  );
}
