import { useState } from 'react';
import type { PokemonCard } from '../../types/pokemon';
import CardTile from './CardTile';
import CardPreviewModal from './CardPreviewModal';
import { useCollection } from '../../hooks/useCollection';

interface CardGridProps {
  cards: PokemonCard[];
  emptyMessage?: string;
  enablePreview?: boolean;
}

export default function CardGrid({ cards, emptyMessage = 'No cards found.', enablePreview = true }: CardGridProps) {
  const [previewCard, setPreviewCard] = useState<PokemonCard | null>(null);
  const { addToCollection, removeFromCollection, isInCollection } = useCollection();

  if (!cards.length) {
    return (
      <div className="py-16 text-center text-lg text-[var(--muted)]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {cards.map((card) => (
          <CardTile
            key={card.id}
            card={card}
            onPreview={enablePreview ? () => setPreviewCard(card) : undefined}
          />
        ))}
      </div>
      {previewCard && (
        <CardPreviewModal
          card={previewCard}
          onClose={() => setPreviewCard(null)}
          onAddToCollection={addToCollection}
          onRemoveFromCollection={removeFromCollection}
          isInCollection={isInCollection(previewCard.id)}
        />
      )}
    </>
  );
}