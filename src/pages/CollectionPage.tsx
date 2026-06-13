import { useCollection } from '../hooks/useCollection';
import { getCardValueGBP, formatGBP } from '../utils/pricing';
import CardGrid from '../components/Cards/CardGrid';
import { Wallet, Trash2, ArrowUpDown, Info } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function CollectionPage() {
  const { collection, removeFromCollection } = useCollection();
  const [sortBy, setSortBy] = useState<'value' | 'name' | 'added'>('value');

  const sortedItems = useMemo(() => {
    return [...collection].sort((a, b) => {
      if (sortBy === 'value') return getCardValueGBP(b.card) - getCardValueGBP(a.card);
      if (sortBy === 'name') return a.card.name.localeCompare(b.card.name);
      return b.addedAt - a.addedAt;
    });
  }, [collection, sortBy]);

  const totalValue = useMemo(() => {
    return collection.reduce((sum, item) => sum + getCardValueGBP(item.card), 0);
  }, [collection]);

  if (collection.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-6 rounded-full bg-[var(--bg-soft)] p-10">
          <Wallet size={64} className="text-[var(--muted)] opacity-20" />
        </div>
        <h1 className="text-2xl font-bold">Your Collection is Empty</h1>
        <p className="mt-2 max-w-md text-[var(--muted)]">
          Start adding cards to your personal collection to track their total market value and keep them all in one place.
        </p>
        <a href="#/" className="mt-8 rounded-xl bg-[var(--accent)] px-8 py-3 font-bold text-white hover:bg-[#dc2626] transition-all">
          Browse Cards
        </a>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header Stat Card */}
      <div className="relative mb-10 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-8 md:p-12">
        <div className="absolute -right-16 -top-16 opacity-5 pointer-events-none">
          <Wallet size={300} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">My <span className="text-[var(--accent)]">Collection</span></h1>
            <p className="mt-2 text-lg text-[var(--muted)]">Tracking {collection.length} unique cards in your database.</p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Total Market Value</p>
            <p className="text-4xl font-black text-[#10b981] md:text-6xl">£{totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <div className="mt-2 flex items-center justify-center md:justify-end gap-1.5 text-xs text-[#10b981]">
              <Info size={12} />
              <span>Based on "Ungraded" Average Market Price</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ArrowUpDown size={16} className="text-[var(--muted)]" />
          <span className="text-sm font-bold text-[var(--muted)] uppercase tracking-wider">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 text-sm font-semibold text-[var(--text)] outline-none focus:border-[var(--accent)]"
          >
            <option value="value">Highest Value</option>
            <option value="name">Name (A-Z)</option>
            <option value="added">Recently Added</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {sortedItems.map((item) => (
          <div key={item.card.id} className="group relative">
            <a href={`#/card/${item.card.id}`} className="block">
              <div className="card-glow overflow-hidden rounded-[var(--radius)]">
                <img
                  src={item.card.images.small}
                  alt={item.card.name}
                  className="w-full transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="mt-3">
                <h3 className="truncate text-sm font-bold text-[var(--text)]">{item.card.name}</h3>
                <p className="text-xs font-bold text-[#10b981]">{formatGBP(getCardMarketValueUSD(item.card))}</p>
              </div>
            </a>
            <button
              onClick={() => removeFromCollection(item.card.id)}
              className="absolute -right-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-card)] text-red-400 shadow-xl opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-400 hover:text-white"
              title="Remove from collection"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
