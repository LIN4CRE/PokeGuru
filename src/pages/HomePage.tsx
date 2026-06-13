import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Book, Layers, Wallet } from 'lucide-react';
import { useFeaturedCards } from '../hooks/useApi';
import { useTitle } from '../hooks/useTitle';
import { getTotalSetCount } from '../data/ukSets';
import CardGrid from '../components/Cards/CardGrid';
import LoadingSpinner from '../components/UI/LoadingSpinner';

export default function HomePage() {
  useTitle('Home');
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
      <section className="relative py-12 text-center md:py-20 overflow-hidden">
        {/* Glow effect */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent)] opacity-[0.05] blur-[120px] pointer-events-none rounded-full" />

        <div className="relative z-10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-xl">
            <div className="pokeball relative h-10 w-10 rounded-full border-[4px] border-[#111] bg-gradient-to-b from-[#ef4444] from-50% to-white to-50% shadow-[inset_0_0_0_3px_#fff]">
              <div className="absolute inset-0 m-auto h-3 w-3 rounded-full border-[4px] border-[#111] bg-white" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-extrabold md:text-6xl tracking-tight">
            The Pokémon Card <span className="text-[var(--accent)]">Guru</span>
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg text-[var(--muted)] md:text-xl">
            A lightning-fast cards database with UK market prices in GBP (£), set history, and advanced search tools.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="mx-auto mb-6 flex max-w-[640px] p-1.5 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-md shadow-2xl focus-within:border-[var(--accent)] transition-all"
          >
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search by name, type (types:fire) or set...'
              className="flex-1 border-none bg-transparent px-6 py-3 text-base text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
              aria-label="Search for Pokémon cards"
            />
            <button
              type="submit"
              className="rounded-xl bg-[var(--accent)] px-8 py-3 text-base font-bold text-white hover:bg-[#dc2626] transition-all active:scale-95 shadow-lg shadow-[var(--accent)]/20"
            >
              Search
            </button>
          </form>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-2 text-xs font-medium uppercase tracking-widest text-[var(--muted)]">
            <span>Popular:</span>
            <Link to="/search?q=charizard" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors">Charizard</Link>
            <span className="opacity-20">•</span>
            <Link to="/search?q=pikachu" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors">Pikachu</Link>
            <span className="opacity-20">•</span>
            <Link to="/search?q=rarity:%22Special%20Illustration%20Rare%22" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors">SIRs</Link>
          </div>
        </div>
      </section>

      {/* Quick Feature Cards */}
      <section className="mb-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/collection"
            className="group glass relative flex flex-col gap-4 rounded-3xl p-6 transition-all hover:-translate-y-2 hover:border-[var(--accent)] hover:shadow-2xl hover:no-underline"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)]/20 text-[var(--accent)] shadow-inner">
              <Wallet size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">The Vault</h3>
              <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                Track your personal collection & live portfolio value.
              </p>
            </div>
          </Link>

          <Link
            to="/wiki"
            className="group glass relative flex flex-col gap-4 rounded-3xl p-6 transition-all hover:-translate-y-2 hover:border-[var(--accent-2)] hover:shadow-2xl hover:no-underline"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-2)]/20 text-[var(--accent-2)] shadow-inner">
              <Book size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-[var(--text)] group-hover:text-[var(--accent-2)] transition-colors">UK Wiki</h3>
              <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                Explore {getTotalSetCount()} iconic UK sets from 1999 to today.
              </p>
            </div>
          </Link>

          <Link
            to="/sets"
            className="group glass relative flex flex-col gap-4 rounded-3xl p-6 transition-all hover:-translate-y-2 hover:border-[var(--link)] hover:shadow-2xl hover:no-underline"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--link)]/20 text-[var(--link)] shadow-inner">
              <Layers size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-[var(--text)] group-hover:text-[var(--link)] transition-colors">All Sets</h3>
              <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                Browse every expansion including modern Japanese releases.
              </p>
            </div>
          </Link>

          <Link
            to="/search?q=rarity:%22Special%20Illustration%20Rare%22"
            className="group glass relative flex flex-col gap-4 rounded-3xl p-6 transition-all hover:-translate-y-2 hover:border-purple-500 hover:shadow-2xl hover:no-underline"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400 shadow-inner">
              <span className="text-xl">✨</span>
            </div>
            <div>
              <h3 className="font-extrabold text-[var(--text)] group-hover:text-purple-400 transition-colors">Chase Cards</h3>
              <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                Discover the rarest Special Illustration Rares.
              </p>
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
