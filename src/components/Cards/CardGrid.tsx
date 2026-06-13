import type { PokemonCard } from '../../types/pokemon';
import CardTile from './CardTile';

interface CardGridProps {
  cards: PokemonCard[];
  emptyMessage?: string;
}

export default function CardGrid({ cards, emptyMessage = 'No cards found.' }: CardGridProps) {
  if (!cards.length) {
    return (
      <div className="py-16 text-center text-lg text-[var(--muted)]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
      {cards.map((card) => (
        <CardTile key={card.id} card={card} />
      ))}
    </div>
  );
}
