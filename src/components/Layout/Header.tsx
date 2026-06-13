import { Link, useNavigate } from 'react-router-dom';
import { Search, Layers, Camera, Book, AlertCircle, Wallet } from 'lucide-react';
import { useState, FormEvent } from 'react';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center gap-4 glass-dark px-4 py-3 md:px-6">
      {/* Brand */}
      <Link to="/" className="flex items-center gap-2.5 text-xl font-semibold text-[var(--text)] hover:no-underline">
        <div className="pokeball relative h-6 w-6 rounded-full border-[3px] border-[#111] bg-gradient-to-b from-[#ef4444] from-50% to-white to-50% shadow-[inset_0_0_0_2px_#fff]">
          <div className="absolute inset-0 m-auto h-2 w-2 rounded-full border-[3px] border-[#111] bg-white" />
        </div>
        <span>
          Poke<strong className="text-[var(--accent)]">Guru</strong>
        </span>
      </Link>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="flex flex-1 max-w-[560px] min-w-[200px] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 focus-within:border-[var(--accent)] focus-within:ring-1 focus-within:ring-[var(--accent)] transition-all"
      >
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search 18,000+ cards..."
          className="flex-1 border-none bg-transparent px-4 py-2 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
          aria-label="Search cards"
        />
        <button
          type="submit"
          className="border-none bg-transparent px-4 text-[var(--muted)] hover:text-[var(--accent)] transition-colors active:scale-90"
          aria-label="Submit search"
        >
          <Search size={18} />
        </button>
      </form>

      {/* Navigation */}
      <nav className="hidden items-center gap-4 sm:flex">
        <Link
          to="/collection"
          className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-widest text-[var(--muted)] hover:text-[var(--text)] hover:no-underline transition-colors"
          title="My Collection"
        >
          <Wallet size={16} className="text-[var(--accent)]" />
          <span>Vault</span>
        </Link>
        <Link
          to="/wiki"
          className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-widest text-[var(--muted)] hover:text-[var(--text)] hover:no-underline transition-colors"
        >
          <Book size={16} />
          <span>Wiki</span>
        </Link>
        <Link
          to="/sets"
          className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-widest text-[var(--muted)] hover:text-[var(--text)] hover:no-underline transition-colors"
        >
          <Layers size={16} />
          <span>Sets</span>
        </Link>
        <Link
          to="/scanner"
          className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-widest text-[var(--muted)] hover:text-[var(--text)] hover:no-underline transition-colors"
        >
          <Camera size={16} />
          <span>Scan</span>
        </Link>
      </nav>

      <Link
        to="/about"
        className="ml-auto hidden sm:flex items-center gap-1.5 rounded-full bg-[var(--bg-soft)] border border-[var(--border)] px-3 py-1 font-bold text-[10px] uppercase tracking-tighter text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-all"
        title="About PokeGuru"
      >
        <AlertCircle size={12} />
        <span>About</span>
      </Link>
    </header>
  );
}
