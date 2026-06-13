import { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Book, ChevronDown, ChevronRight, Search, Layers, Calendar, Hash, Filter, ExternalLink } from 'lucide-react';
import UK_ERAS, { getTotalSetCount, getTotalCardCount } from '../data/ukSets';
import type { WikiSet } from '../data/ukSets';

type ViewMode = 'timeline' | 'table';

function getBulbapediaUrl(setName: string) {
  const sanitized = setName.replace(/ Series| \(WOTC\)/g, '').replace(/ /g, '_');
  return `https://bulbapedia.bulbagarden.net/wiki/${sanitized}_(TCG)`;
}

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
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 md:p-8">
        {/* Decorative Background Poke-ball */}
        <div className="absolute -right-16 -top-16 opacity-[0.03] pointer-events-none">
          <div className="h-64 w-64 rounded-full border-[30px] border-[var(--text)]" />
          <div className="absolute inset-0 m-auto h-20 w-20 rounded-full border-[30px] border-[var(--text)]" />
          <div className="absolute inset-0 top-1/2 h-[30px] w-64 -translate-y-1/2 bg-[var(--text)]" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[#dc2626] shadow-lg shadow-[var(--accent)]/20">
            <Book size={40} className="text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              🇬🇧 <span className="text-[var(--text)]">UK Pokémon Card</span> <span className="text-[var(--accent)]">Wiki</span>
            </h1>
            <p className="mt-2 text-[var(--muted)] text-lg max-w-2xl">
              The definitive database of every Pokémon TCG set released in the UK.
              From the 1999 Base Set to the latest expansions.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 px-4 py-2 backdrop-blur-sm">
                <Layers size={16} className="text-[var(--accent)]" />
                <span className="text-base font-bold text-[var(--text)]">{totalSets}</span>
                <span className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Sets</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 px-4 py-2 backdrop-blur-sm">
                <Hash size={16} className="text-[var(--accent-2)]" />
                <span className="text-base font-bold text-[var(--text)]">{totalCards.toLocaleString()}</span>
                <span className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Cards</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 px-4 py-2 backdrop-blur-sm">
                <Calendar size={16} className="text-[var(--link)]" />
                <span className="text-base font-bold text-[var(--text)]">{UK_ERAS.length}</span>
                <span className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Eras</span>
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
        <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-soft)]/50">
                <th className="px-4 py-4 font-bold text-[var(--muted)] uppercase tracking-widest text-[10px]">Era</th>
                <th className="px-4 py-4 font-bold text-[var(--muted)] uppercase tracking-widest text-[10px]">Set Name</th>
                <th className="px-4 py-4 font-bold text-[var(--muted)] uppercase tracking-widest text-[10px] text-right">Cards</th>
                <th className="px-4 py-4 font-bold text-[var(--muted)] uppercase tracking-widest text-[10px]">Release</th>
                <th className="px-4 py-4 font-bold text-[var(--muted)] uppercase tracking-widest text-[10px]">Type</th>
                <th className="px-4 py-4 font-bold text-[var(--muted)] uppercase tracking-widest text-[10px] text-right">Links</th>
              </tr>
            </thead>
            <tbody>
              {filteredEras.flatMap((era) =>
                era.sets.map((set, i) => {
                  const isReleased = new Date(set.releaseDate) <= new Date();
                  return (
                    <tr
                      key={set.id}
                      className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-soft)]/50 transition-colors group"
                    >
                      {i === 0 ? (
                        <td
                          className="px-4 py-4 align-top"
                          rowSpan={era.sets.length}
                        >
                          <span
                            className="inline-block rounded-lg px-2 py-1 text-[10px] font-extrabold text-white uppercase tracking-tighter"
                            style={{ backgroundColor: era.colour }}
                          >
                            {era.name.replace(/ Series| \(WOTC\)/g, '')}
                          </span>
                        </td>
                      ) : null}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded bg-[var(--bg)] border border-[var(--border)] p-1">
                            <img
                              src={`https://images.pokemontcg.io/${set.id}/symbol.png`}
                              alt=""
                              className={`h-5 w-5 object-contain ${!isReleased ? 'grayscale opacity-30' : ''}`}
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          </div>
                          <span className="font-bold text-[var(--text)]">{set.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right tabular-nums font-medium text-[var(--text)]/80">{set.cards}</td>
                      <td className="px-4 py-4 text-[var(--muted)] tabular-nums">
                        {new Date(set.releaseDate + 'T00:00:00').toLocaleDateString('en-GB', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter border ${
                          set.type === 'main' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          set.type === 'special' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                          'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}>
                          {set.type}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={getBulbapediaUrl(set.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--muted)] hover:text-[var(--link)] transition-colors p-1"
                            title="Bulbapedia"
                          >
                            <ExternalLink size={14} />
                          </a>
                          {isReleased ? (
                            <Link
                              to={`/search?q=set.id:${set.id}`}
                              className="text-[var(--accent)] hover:text-[var(--accent)] font-bold text-xs hover:underline underline-offset-4"
                            >
                              Cards →
                            </Link>
                          ) : (
                            <span className="text-[var(--muted)] text-[10px] font-bold uppercase opacity-40">Soon</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Quick Era Navigation */}
      <div className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)]/50 p-6">
        <h3 className="mb-4 text-xs font-bold text-[var(--muted)] uppercase tracking-[0.2em]">Jump to Era</h3>
        <div className="flex flex-wrap gap-2">
          {UK_ERAS.map((era) => (
            <button
              key={era.slug}
              onClick={() => {
                setSelectedEra(era.slug);
                setExpandedEras((prev) => new Set([...prev, era.slug]));
              }}
              className="group relative flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2.5 text-sm font-bold text-[var(--text)] transition-all hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              style={{
                borderColor: selectedEra === era.slug ? era.colour : undefined,
                backgroundColor: selectedEra === era.slug ? era.colour + '15' : undefined,
              }}
            >
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: era.colour }}
              />
              {era.name.replace(/ Series| \(WOTC\)/g, '')}
              <span className="ml-1 text-[10px] font-medium text-[var(--muted)]">{era.years.split(' – ')[0]}</span>

              {selectedEra === era.slug && (
                <div
                  className="absolute -bottom-px left-4 right-4 h-1 rounded-t-full"
                  style={{ backgroundColor: era.colour }}
                />
              )}
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

  const isReleased = new Date(set.releaseDate) <= new Date();

  return (
    <div className="group flex items-center gap-3 rounded-lg border border-transparent bg-[var(--bg-soft)] p-3 transition-all hover:border-[var(--border)] hover:bg-[var(--bg-card)] hover:shadow-sm">
      {/* Symbol Container */}
      <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--bg)] border border-[var(--border)] group-hover:border-[var(--accent)]/30 transition-colors">
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundColor: eraColour }}
        />
        <img
          src={`https://images.pokemontcg.io/${set.id}/symbol.png`}
          alt=""
          className={`relative z-10 h-6 w-6 object-contain transition-transform group-hover:scale-110 ${!isReleased ? 'grayscale opacity-30' : ''}`}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>

      {/* Set Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-[var(--text)] text-sm truncate">{set.name}</h3>
          <span className={`flex-shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold tracking-tight uppercase border ${
            set.type === 'main' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
            set.type === 'special' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
            'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
          }`}>
            {set.type}
          </span>
        </div>
        <p className="text-xs text-[var(--muted)] flex items-center gap-2 mt-0.5">
          <span className="font-medium text-[var(--text)]/70">{formattedDate}</span>
          <span className="opacity-20">•</span>
          <span>{set.cards} cards</span>
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <a
          href={getBulbapediaUrl(set.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--muted)] transition-all hover:bg-[var(--bg-soft)] hover:text-[var(--link)] hover:border-[var(--link)]"
          title="Read History on Bulbapedia"
        >
          <ExternalLink size={14} />
        </a>

        {isReleased ? (
          <Link
            to={`/search?q=set.id:${set.id}`}
            className="flex h-8 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 text-xs font-bold text-[var(--muted)] transition-all hover:no-underline group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white"
          >
            Browse
          </Link>
        ) : (
          <span className="rounded-lg bg-[var(--bg)] border border-[var(--border)] px-2 py-1.5 text-[10px] font-bold text-[var(--muted)] opacity-50 uppercase tracking-tighter">
            Soon
          </span>
        )}
      </div>
    </div>
  );
}
