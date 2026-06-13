import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Book, Layers } from 'lucide-react';
import { useFeaturedCards } from '../hooks/useApi';
import { getTotalSetCount, getTotalCardCount } from '../data/ukSets';
import CardGrid from '../components/Cards/CardGrid';
import LoadingSpinner from '../components/UI/LoadingSpinner';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { data: featuredCards, loading, error } = useFeaturedCards();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="py-10 text-center md:py-16">
        <h1 className="mb-2 text-3xl font-bold md:text-5xl">
          The Ultimate <span className="text-[var(--accent)]">Pokémon</span> Card Database
        </h1>
        <p className="mb-6 text-lg text-[var(--muted)]">
          Search every card, browse by set, and dig into the details.
        </p>

        {/* Search Form */}
        <form 
          onSubmit={handleSearch}
          className="mx-auto mb-4 flex max-w-[620px] overflow-hidden rounded-full border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow)]"
        >
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Try "venusaur" or "subtypes:mega"'
            className="flex-1 border-none bg-transparent px-6 py-3.5 text-base text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
            aria-label="Search for Pokémon cards"
          />
          <button
            type="submit"
            className="border-none bg-[var(--accent)] px-6 text-base font-semibold text-white hover:bg-[#dc2626] transition-colors"
          >
            Search
          </button>
        </form>

        {/* Quick Links */}
        <p className="text-sm text-[var(--muted)]">
          Try{' '}
          <Link to="/search?q=charizard" className="mx-1 hover:text-[var(--link)]">
            charizard
          </Link>
          ·
          <Link to="/search?q=subtypes:mega" className="mx-1 hover:text-[var(--link)]">
            subtypes:mega
          </Link>
          ·
          <Link to="/search?q=types:dragon" className="mx-1 hover:text-[var(--link)]">
            types:dragon
          </Link>
        </p>
      </section>

      {/* Quick Feature Cards */}
      <section className="mb-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/wiki"
            className="group flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 transition-all hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[var(--shadow)] hover:no-underline"
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--accent)]/20">
              <Book size={24} className="text-[var(--accent)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text)] group-hover:text-[var(--accent)]">🇬🇧 UK Card Wiki</h3>
              <p className="text-xs text-[var(--muted)]">
                {getTotalSetCount()} sets · {getTotalCardCount().toLocaleString()} cards · Base Set to today
              </p>
            </div>
          </Link>

          <Link
            to="/sets"
            className="group flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 transition-all hover:-translate-y-1 hover:border-[var(--accent-2)] hover:shadow-[var(--shadow)] hover:no-underline"
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--accent-2)]/20">
              <Layers size={24} className="text-[var(--accent-2)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text)] group-hover:text-[var(--accent-2)]">Browse Sets</h3>
              <p className="text-xs text-[var(--muted)]">Explore every TCG set with card lists</p>
            </div>
          </Link>

          <Link
            to="/search?q=rarity:%22Illustration%20Rare%22"
            className="group flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 transition-all hover:-translate-y-1 hover:border-[var(--link)] hover:shadow-[var(--shadow)] hover:no-underline sm:col-span-2 lg:col-span-1"
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--link)]/20 text-2xl">
              ✨
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text)] group-hover:text-[var(--link)]">Chase Cards</h3>
              <p className="text-xs text-[var(--muted)]">Find the rarest Illustration Rares</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Cards */}
      <section>
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h2 className="text-xl font-semibold">Fresh Holos</h2>
        </div>

        {loading && <LoadingSpinner message="Loading featured cards..." />}
        
        {error && (
          <div className="py-8 text-center text-[var(--muted)]">
            <p>Couldn't load featured cards. Try searching for something!</p>
          </div>
        )}

        {featuredCards && <CardGrid cards={featuredCards} />}
      </section>
    </div>
  );
}
