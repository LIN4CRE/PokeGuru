import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { PokemonCard } from '../../types/pokemon';

interface CardTileProps {
  card: PokemonCard;
}

export default function CardTile({ card }: CardTileProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageUrl = card.images?.small || card.images?.large || '';
  const subtitle = [card.set?.name, card.number ? `#${card.number}` : '']
    .filter(Boolean)
    .join(' · ');

  return (
    <Link
      to={`/card/${card.id}`}
      className="group block card-glow overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-card)] transition-all hover:border-[var(--accent)]/50 hover:no-underline"
    >
      <div className={`relative holo-shimmer aspect-[245/342] w-full overflow-hidden bg-[#0b0d12] ${!imageLoaded ? 'animate-shimmer' : ''}`}>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={card.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`h-full w-full object-contain transition-all duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
      </div>
      <div className="p-3 bg-gradient-to-t from-[var(--bg-soft)] to-transparent">
        <h3 className="truncate text-sm font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
          {card.name}
        </h3>
        <p className="truncate text-[10px] font-bold uppercase tracking-tighter text-[var(--muted)]">{subtitle}</p>
      </div>
    </Link>
  );
}
