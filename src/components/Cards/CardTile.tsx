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
      className="group block overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-card)] transition-all hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[var(--shadow)] hover:no-underline"
    >
      <div className={`relative aspect-[245/342] w-full overflow-hidden bg-[#0b0d12] ${!imageLoaded ? 'animate-shimmer' : ''}`}>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={card.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`h-full w-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
      </div>
      <div className="p-2.5">
        <h3 className="truncate text-sm font-semibold text-[var(--text)]">
          {card.name}
        </h3>
        <p className="truncate text-xs text-[var(--muted)]">{subtitle}</p>
      </div>
    </Link>
  );
}
