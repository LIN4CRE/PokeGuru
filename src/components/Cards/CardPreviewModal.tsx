import { Link } from 'react-router-dom';
import { X, ExternalLink, Heart } from 'lucide-react';
import { useEffect } from 'react';
import type { PokemonCard } from '../../types/pokemon';
import { getCardValueGBP, formatGBP } from '../../utils/pricing';

interface CardPreviewModalProps {
  card: PokemonCard;
  onClose: () => void;
  onAddToCollection?: (card: PokemonCard) => void;
  isInCollection?: boolean;
  onRemoveFromCollection?: (cardId: string) => void;
}

export default function CardPreviewModal({ card, onClose, onAddToCollection, isInCollection, onRemoveFromCollection }: CardPreviewModalProps) {
  const value = getCardValueGBP(card);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative flex w-full max-w-[700px] flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl animate-fade-in sm:flex-row">
        {/* Image */}
        <div className="flex items-center justify-center bg-gradient-to-b from-[var(--bg)] to-[#0b0d12] p-4 sm:w-[260px]">
          {card.images?.large && (
            <img
              src={card.images.large}
              alt={card.name}
              className="h-auto w-full max-h-[360px] object-contain rounded-lg shadow-[var(--shadow)]"
            />
          )}
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-[var(--text)]">{card.name}</h2>
              <p className="text-xs text-[var(--muted)]">
                {card.set?.name} · #{card.number}
              </p>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] p-1.5 text-[var(--muted)] hover:text-[var(--text)] transition-colors"
              aria-label="Close preview"
            >
              <X size={16} />
            </button>
          </div>

          {/* Badges */}
          <div className="mb-3 flex flex-wrap gap-1.5">
            {card.supertype && (
              <span className="rounded-md border border-[var(--border)] bg-[var(--bg-soft)] px-2 py-0.5 text-[10px] font-bold text-[var(--muted)]">
                {card.supertype}
              </span>
            )}
            {card.types?.map((type) => (
              <span key={type} className="rounded-md border border-[var(--border)] bg-[var(--bg-soft)] px-2 py-0.5 text-[10px] font-bold text-[var(--muted)]">
                {type}
              </span>
            ))}
            {card.hp && (
              <span className="rounded-md border border-[var(--border)] bg-[var(--bg-soft)] px-2 py-0.5 text-[10px] font-bold text-[var(--muted)]">
                {card.hp} HP
              </span>
            )}
            {card.rarity && (
              <span className="rounded-md border border-[var(--border)] bg-[var(--bg-soft)] px-2 py-0.5 text-[10px] font-bold text-[var(--muted)]">
                {card.rarity}
              </span>
            )}
          </div>

          {/* Value */}
          {value > 0 && (
            <div className="mb-4 rounded-xl border border-[#10b981]/20 bg-[#10b981]/10 px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#10b981]">Estimated Value</p>
              <p className="text-2xl font-black text-[var(--text)]">{formatGBP(value)}</p>
            </div>
          )}

          {/* Attacks */}
          {card.attacks && card.attacks.length > 0 && (
            <div className="mb-4 space-y-1.5">
              {card.attacks.slice(0, 2).map((attack, i) => (
                <div key={i} className="rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] px-2.5 py-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--text)]">{attack.name}</span>
                    <span className="text-sm font-bold text-[var(--accent)]">{attack.damage}</span>
                  </div>
                  {attack.text && <p className="text-[10px] text-[var(--muted)] leading-tight">{attack.text}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="mt-auto flex items-center gap-2">
            <Link
              to={`/card/${card.id}`}
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-xl border border-[var(--accent)] bg-[var(--accent)]/10 px-4 py-2 text-sm font-bold text-[var(--accent)] transition-all hover:bg-[var(--accent)]/20"
            >
              View Details
              <ExternalLink size={14} />
            </Link>
            {onAddToCollection && (
              <button
                onClick={() => isInCollection ? onRemoveFromCollection?.(card.id) : onAddToCollection(card)}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-bold transition-all ${
                  isInCollection
                    ? 'border-red-500/20 bg-red-500/10 text-red-500'
                    : 'border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]'
                }`}
              >
                <Heart size={16} fill={isInCollection ? 'currentColor' : 'none'} />
                {isInCollection ? 'Remove' : 'Save'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}