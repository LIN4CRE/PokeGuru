import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useCard } from '../hooks/useApi';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import type { PokemonCard, TCGPlayerPrice } from '../types/pokemon';

function formatPrice(price: number | undefined): string {
  if (price === undefined || price === null) return '—';
  return `$${price.toFixed(2)}`;
}

function getBestPrice(card: PokemonCard): { label: string; price: TCGPlayerPrice } | null {
  const prices = card.tcgplayer?.prices;
  if (!prices) return null;

  // Try to find the best available price type
  const priceTypes: { key: keyof typeof prices; label: string }[] = [
    { key: 'holofoil', label: 'Holofoil' },
    { key: 'reverseHolofoil', label: 'Reverse Holo' },
    { key: 'normal', label: 'Normal' },
    { key: '1stEditionHolofoil', label: '1st Edition Holo' },
    { key: '1stEditionNormal', label: '1st Edition' },
  ];

  for (const { key, label } of priceTypes) {
    const priceData = prices[key];
    if (priceData && (priceData.market || priceData.mid)) {
      return { label, price: priceData };
    }
  }

  return null;
}

export default function CardDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: card, loading, error } = useCard(id || '');

  if (loading) {
    return <LoadingSpinner message="Loading card details..." />;
  }

  if (error || !card) {
    return (
      <ErrorMessage 
        message={error || 'Card not found'}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const priceInfo = getBestPrice(card);

  return (
    <div>
      {/* Back Link */}
      <Link
        to={-1 as any}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--text)] hover:no-underline"
        onClick={(e) => {
          e.preventDefault();
          window.history.back();
        }}
      >
        <ArrowLeft size={16} />
        Back
      </Link>

      <div className="grid gap-8 md:grid-cols-[minmax(220px,360px)_1fr]">
        {/* Card Image */}
        <div>
          <img
            src={card.images.large || card.images.small}
            alt={card.name}
            className="w-full rounded-2xl shadow-[var(--shadow)]"
          />
        </div>

        {/* Card Info */}
        <div>
          <h1 className="mb-1 text-3xl font-bold">{card.name}</h1>
          <p className="mb-5 text-[var(--muted)]">
            {card.set.name} · #{card.number}
          </p>

          {/* Badges */}
          <div className="mb-5 flex flex-wrap gap-2">
            {card.supertype && (
              <span className="rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-1 text-sm text-[var(--muted)]">
                <strong className="text-[var(--text)]">{card.supertype}</strong>
              </span>
            )}
            {card.subtypes?.map((subtype) => (
              <span key={subtype} className="rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-1 text-sm text-[var(--muted)]">
                {subtype}
              </span>
            ))}
            {card.types?.map((type) => (
              <span key={type} className="rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-1 text-sm text-[var(--muted)]">
                {type}
              </span>
            ))}
            {card.hp && (
              <span className="rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-1 text-sm text-[var(--muted)]">
                <strong className="text-[var(--text)]">{card.hp}</strong> HP
              </span>
            )}
            {card.rarity && (
              <span className="rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-1 text-sm text-[var(--muted)]">
                {card.rarity}
              </span>
            )}
          </div>

          {/* Abilities */}
          {card.abilities && card.abilities.length > 0 && (
            <div className="mb-4 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <h3 className="mb-3 text-base font-semibold text-[var(--accent-2)]">Abilities</h3>
              {card.abilities.map((ability, i) => (
                <div key={i} className="mb-3 last:mb-0">
                  <p className="font-semibold text-[var(--text)]">{ability.name}</p>
                  <p className="text-sm text-[var(--muted)]">{ability.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Attacks */}
          {card.attacks && card.attacks.length > 0 && (
            <div className="mb-4 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <h3 className="mb-3 text-base font-semibold text-[var(--accent-2)]">Attacks</h3>
              {card.attacks.map((attack, i) => (
                <div key={i} className="border-t border-[var(--border)] py-3 first:border-0 first:pt-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-[var(--text)]">{attack.name}</span>
                    {attack.damage && (
                      <span className="text-lg font-bold text-[var(--accent)]">{attack.damage}</span>
                    )}
                  </div>
                  {attack.cost && attack.cost.length > 0 && (
                    <p className="text-xs text-[var(--muted)]">
                      Cost: {attack.cost.join(', ')}
                    </p>
                  )}
                  {attack.text && (
                    <p className="mt-1 text-sm text-[var(--muted)]">{attack.text}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Weaknesses, Resistances, Retreat */}
          {(card.weaknesses || card.resistances || card.retreatCost) && (
            <div className="mb-4 grid gap-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-card)] p-4 sm:grid-cols-3">
              {card.weaknesses && card.weaknesses.length > 0 && (
                <div>
                  <h4 className="mb-1 text-xs font-medium uppercase text-[var(--muted)]">Weakness</h4>
                  <p className="text-sm text-[var(--text)]">
                    {card.weaknesses.map((w) => `${w.type} ${w.value}`).join(', ')}
                  </p>
                </div>
              )}
              {card.resistances && card.resistances.length > 0 && (
                <div>
                  <h4 className="mb-1 text-xs font-medium uppercase text-[var(--muted)]">Resistance</h4>
                  <p className="text-sm text-[var(--text)]">
                    {card.resistances.map((r) => `${r.type} ${r.value}`).join(', ')}
                  </p>
                </div>
              )}
              {card.retreatCost && (
                <div>
                  <h4 className="mb-1 text-xs font-medium uppercase text-[var(--muted)]">Retreat Cost</h4>
                  <p className="text-sm text-[var(--text)]">
                    {card.retreatCost.length} ({card.retreatCost.join(', ')})
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Rules */}
          {card.rules && card.rules.length > 0 && (
            <div className="mb-4 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <h3 className="mb-2 text-base font-semibold text-[var(--accent-2)]">Rules</h3>
              {card.rules.map((rule, i) => (
                <p key={i} className="mb-2 text-sm text-[var(--muted)] last:mb-0">{rule}</p>
              ))}
            </div>
          )}

          {/* Market Prices */}
          {priceInfo && (
            <div className="mb-4 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <h3 className="mb-3 text-base font-semibold text-[var(--accent-2)]">Market Prices</h3>
              <p className="mb-2 text-xs text-[var(--muted)]">
                {priceInfo.label} • Updated {card.tcgplayer?.updatedAt ? new Date(card.tcgplayer.updatedAt).toLocaleDateString() : 'recently'}
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-[var(--muted)]">Low</p>
                  <p className="text-lg font-semibold text-[var(--text)]">
                    {formatPrice(priceInfo.price.low)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)]">Mid</p>
                  <p className="text-lg font-semibold text-[var(--text)]">
                    {formatPrice(priceInfo.price.mid)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)]">High</p>
                  <p className="text-lg font-semibold text-[var(--text)]">
                    {formatPrice(priceInfo.price.high)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)]">Market</p>
                  <p className="text-lg font-semibold text-[var(--accent)]">
                    {formatPrice(priceInfo.price.market)}
                  </p>
                </div>
              </div>
              {card.tcgplayer?.url && (
                <a
                  href={card.tcgplayer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm text-[var(--link)] hover:underline"
                >
                  View on TCGplayer
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          )}

          {/* Set Info */}
          <div className="mb-4 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <h3 className="mb-3 text-base font-semibold text-[var(--accent-2)]">Set Information</h3>
            <Link
              to={`/set/${card.set.id}`}
              className="flex items-center gap-3 hover:no-underline"
            >
              {card.set.images?.logo && (
                <img
                  src={card.set.images.logo}
                  alt={card.set.name}
                  className="h-10 w-14 object-contain"
                />
              )}
              <div>
                <p className="font-semibold text-[var(--text)]">{card.set.name}</p>
                <p className="text-xs text-[var(--muted)]">
                  {card.set.series} • Released {new Date(card.set.releaseDate).toLocaleDateString()}
                </p>
              </div>
            </Link>
          </div>

          {/* Artist */}
          {card.artist && (
            <p className="text-sm text-[var(--muted)]">
              Illustrated by <span className="text-[var(--text)]">{card.artist}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
