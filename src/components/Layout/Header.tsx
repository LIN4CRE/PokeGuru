import { Link, useNavigate } from 'react-router-dom';
import { Search, Layers, Camera, Book, AlertCircle } from 'lucide-react';
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
    <header className="sticky top-0 z-20 flex flex-wrap items-center gap-4 border-b border-[var(--border)] bg-[rgba(15,17,21,0.85)] px-4 py-3 backdrop-blur-md md:px-6">
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
        className="flex flex-1 max-w-[560px] min-w-[200px] overflow-hidden rounded-full border border-[var(--border)] bg-[var(--bg-card)]"
      >
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search cards..."
          className="flex-1 border-none bg-transparent px-4 py-2.5 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
          aria-label="Search cards"
        />
        <button
          type="submit"
          className="border-none bg-transparent px-4 text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
          aria-label="Submit search"
        >
          <Search size={18} />
        </button>
      </form>

      {/* Navigation */}
      <nav className="flex items-center gap-4">
        <Link
          to="/wiki"
          className="flex items-center gap-1.5 font-medium text-[var(--muted)] hover:text-[var(--text)] hover:no-underline transition-colors"
        >
          <Book size={16} />
          <span className="hidden sm:inline">Wiki</span>
        </Link>
        <Link
          to="/sets"
          className="flex items-center gap-1.5 font-medium text-[var(--muted)] hover:text-[var(--text)] hover:no-underline transition-colors"
        >
          <Layers size={16} />
          <span className="hidden sm:inline">Sets</span>
        </Link>
        <Link
          to="/scanner"
          className="flex items-center gap-1.5 font-medium text-[var(--muted)] hover:text-[var(--text)] hover:no-underline transition-colors"
        >
          <Camera size={16} />
          <span className="hidden sm:inline">Scan</span>
        </Link>
        <Link
          to="/about"
          className="flex items-center gap-1.5 font-medium text-[var(--muted)] hover:text-[var(--text)] hover:no-underline transition-colors"
          title="About PokeGuru"
        >
          <AlertCircle size={16} />
          <span className="hidden sm:inline">About</span>
        </Link>
      </nav>
    </header>
  );
}
