import { Link, useNavigate } from 'react-router-dom';
import { Search, Layers, Camera, Book, AlertCircle, Wallet, Shuffle } from 'lucide-react';
import { useState, FormEvent, useEffect, useRef } from 'react';
import { useDebouncedValue } from '../../hooks/useApi';
import { searchCards, getRandomCard } from '../../services/api';
import type { PokemonCard } from '../../types/pokemon';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PokemonCard[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [randomLoading, setRandomLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebouncedValue(searchQuery, 300);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    let cancelled = false;
    async function fetchSuggestions() {
      try {
        const result = await searchCards(debouncedQuery, { pageSize: 6, orderBy: 'name' });
        if (!cancelled) {
          setSuggestions(result.data || []);
          setShowSuggestions(true);
          setSelectedIndex(-1);
        }
      } catch {
        if (!cancelled) {
          setSuggestions([]);
        }
      }
    }

    fetchSuggestions();
    return () => { cancelled = true; };
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && showSuggestions) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSuggestions]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const selectSuggestion = (card: PokemonCard) => {
    setShowSuggestions(false);
    setSearchQuery('');
    navigate(`/card/${card.id}`);
  };

  const handleRandom = async () => {
    setRandomLoading(true);
    try {
      const card = await getRandomCard();
      if (card) {
        setShowSuggestions(false);
        setSearchQuery('');
        navigate(`/card/${card.id}`);
      }
    } catch {
      // silently fail
    } finally {
      setRandomLoading(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[selectedIndex]);
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
        className="relative flex flex-1 max-w-[560px] min-w-[200px]"
      >
        <div className="flex w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 focus-within:border-[var(--accent)] focus-within:ring-1 focus-within:ring-[var(--accent)] transition-all">
          <input
            ref={inputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
            placeholder="Search 18,000+ cards..."
            className="flex-1 border-none bg-transparent px-4 py-2 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
            aria-label="Search cards"
            onKeyDown={handleInputKeyDown}
            autoComplete="off"
          />
          <button
            type="submit"
            className="border-none bg-transparent px-4 text-[var(--muted)] hover:text-[var(--accent)] transition-colors active:scale-90"
            aria-label="Submit search"
          >
            <Search size={18} />
          </button>
        </div>

        {/* Autocomplete dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute left-0 right-0 top-full mt-1 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl z-50"
          >
            {suggestions.map((card, index) => (
              <button
                key={card.id}
                type="button"
                onClick={() => selectSuggestion(card)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                  index === selectedIndex ? 'bg-[var(--accent)]/10 text-[var(--text)]' : 'text-[var(--muted)] hover:bg-[var(--bg-soft)]'
                }`}
              >
                {card.images?.small && (
                  <img src={card.images.small} alt="" className="h-10 w-auto rounded object-contain" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-[var(--text)]">{card.name}</p>
                  <p className="truncate text-[11px] text-[var(--muted)]">
                    {card.set?.name} · #{card.number}
                  </p>
                </div>
                {card.types && card.types.length > 0 && (
                  <span className="shrink-0 text-[10px] text-[var(--accent)] font-bold">{card.types.join('/')}</span>
                )}
              </button>
            ))}
          </div>
        )}
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

      <button
        onClick={handleRandom}
        disabled={randomLoading}
        className="hidden sm:flex items-center gap-1.5 rounded-full bg-[var(--bg-soft)] border border-[var(--border)] px-3 py-1 font-bold text-[10px] uppercase tracking-tighter text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-all disabled:opacity-50"
        title="Random Card"
      >
        <Shuffle size={12} />
        <span>{randomLoading ? '...' : 'Random'}</span>
      </button>

      <Link
        to="/about"
        className="hidden sm:flex items-center gap-1.5 rounded-full bg-[var(--bg-soft)] border border-[var(--border)] px-3 py-1 font-bold text-[10px] uppercase tracking-tighter text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-all"
        title="About PokeGuru"
      >
        <AlertCircle size={12} />
        <span>About</span>
      </Link>
    </header>
  );
}