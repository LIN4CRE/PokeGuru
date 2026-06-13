import { useState, useEffect, useCallback } from 'react';
import type { PokemonCard } from '../types/pokemon';

export interface CollectionItem {
  card: PokemonCard;
  addedAt: number;
}

export function useCollection() {
  const [collection, setCollection] = useState<CollectionItem[]>([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pokeguru_collection');
    if (saved) {
      try {
        setCollection(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load collection', e);
      }
    }
  }, []);

  // Save to localStorage
  const saveCollection = useCallback((newItems: CollectionItem[]) => {
    localStorage.setItem('pokeguru_collection', JSON.stringify(newItems));
    setCollection(newItems);
  }, []);

  const addToCollection = useCallback((card: PokemonCard) => {
    setCollection(prev => {
      if (prev.some(item => item.card.id === card.id)) return prev;
      const next = [...prev, { card, addedAt: Date.now() }];
      localStorage.setItem('pokeguru_collection', JSON.stringify(next));
      return next;
    });
  }, []);

  const removeFromCollection = useCallback((cardId: string) => {
    setCollection(prev => {
      const next = prev.filter(item => item.card.id !== cardId);
      localStorage.setItem('pokeguru_collection', JSON.stringify(next));
      return next;
    });
  }, []);

  const isInCollection = useCallback((cardId: string) => {
    return collection.some(item => item.card.id === cardId);
  }, [collection]);

  return {
    collection,
    addToCollection,
    removeFromCollection,
    isInCollection
  };
}
