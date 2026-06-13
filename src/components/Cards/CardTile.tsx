import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { PokemonCard } from '../../types/pokemon';
import { getCardValueGBP, formatGBP } from '../../utils/pricing';

const TYPE_COLORS: Record<string, string> = {
  Colorless: '#a8a8a8',
  Darkness: '#5a4e4e',
  Dragon: '#e6a100',
  Fairy: '#e898d4',
  Fighting: '#c05a3e',
  Fire: '#f08030',
  Grass: '#78c850',
  Lightning: '#f8d030',
  Metal: '#b8b8d0',
  Psychic: '#f85888',
  Water: '#6890f0',
};

interface CardTileProps {
  card: PokemonCard;
  onPreview?: () => void;
}

export default function CardTile({ card, onPreview }: CardTileProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageUrl = card.images?.small || card.images?.large || '';
  const subtitle = [card.set?.name, card.number ? `#${card.number}` : '']
    .filter(Boolean)
    .join(' · ');
  const value = getCardValueGBP(card);

  return (
    <div className="group relative">
      <div
        onClick={onPreview}
        className={`relative holo-shimmer aspect-[245/342] w-full overflow-hidden rounded-t-[var(--radius)] bg-[#0b0d12] cursor-pointer ${!imageLoaded ? 'animate-shimmer' : ''}`}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt={card.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`h-full w-full object-contain transition-all duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
        {card.types && card.types.length > 0 && (
          <div className="absolute bottom-1 left-1 flex gap-0.5">
            {card.types.map((type) => (
              <span
                key={type}
                className="inline-block h-4 w-4 rounded-full border border-black/30 shadow-sm"
                style={{ backgroundColor: TYPE_COLORS[type] || '#888' }}
                title={type}
              />
            ))}
          </div>
        )}
      </div>
      <Link
        to={`/card/${card.id}`}
        className="block card-glow overflow-hidden border border-t-0 border-[var(--border)] bg-[var(--bg-card)] transition-all hover:border-[var(--accent)]/50 hover:no-underline rounded-b-[var(--radius)]"
      >
        <div className="p-3 bg-gradient-to-t from-[var(--bg-soft)] to-transparent">
          <div className="flex items-baseline justify-between gap-1">
            <h3 className="truncate text-sm font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
              {card.name}
            </h3>
            {value > 0 && (
              <span className="shrink-0 text-xs font-black text-[#10b981]">{formatGBP(value)}</span>
            )}
          </div>
          <p className="truncate text-[10px] font-bold uppercase tracking-tighter text-[var(--muted)]">{subtitle}</p>
        </div>
      </Link>
    </div>
  );
}