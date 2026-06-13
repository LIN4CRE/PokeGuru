import { Link } from 'react-router-dom';
import type { PokemonSet } from '../../types/pokemon';

interface SetTileProps {
  set: PokemonSet;
}

export default function SetTile({ set }: SetTileProps) {
  const releaseDate = new Date(set.releaseDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });

  return (
    <Link
      to={`/set/${set.id}`}
      className="flex items-center gap-3.5 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-card)] p-4 transition-all hover:-translate-y-0.5 hover:border-[var(--accent-2)] hover:shadow-[var(--shadow)] hover:no-underline"
    >
      {set.images?.logo && (
        <img
          src={set.images.logo}
          alt={set.name}
          className="h-12 w-16 flex-shrink-0 object-contain"
          loading="lazy"
        />
      )}
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold text-[var(--text)]">{set.name}</h3>
        <p className="text-xs text-[var(--muted)]">
          {set.series} · {releaseDate} · {set.total} cards
        </p>
      </div>
    </Link>
  );
}
