/**
 * Custom hooks for API data fetching
 * 
 * Provides a clean interface for components to fetch data
 * with loading states and error handling
 */

import { useState, useEffect, useRef } from 'react';
import type { ApiResponse, PokemonCard, PokemonSet, CardType, SortOption } from '../types/pokemon';
import * as api from '../services/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for fetching featured cards on the home page
 */
export function useFeaturedCards() {
  const [state, setState] = useState<UseApiState<PokemonCard[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        const data = await api.getFeaturedCards();
        if (mounted) {
          setState({ data, loading: false, error: null });
        }
      } catch (err) {
        if (mounted) {
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : 'Failed to load featured cards',
          });
        }
      }
    }

    fetchData();
    return () => { mounted = false; };
  }, []);

  return state;
}

/**
 * Hook for searching cards
 */
export function useCardSearch(
  query: string,
  type: CardType,
  sort: SortOption,
  page: number
) {
  const [state, setState] = useState<UseApiState<ApiResponse<PokemonCard[]>>>({
    data: null,
    loading: true,
    error: null,
  });

  // Track current request to avoid race conditions
  const requestId = useRef(0);

  useEffect(() => {
    const currentRequest = ++requestId.current;
    setState(prev => ({ ...prev, loading: true }));

    const orderBy = sort === 'newest' ? '-set.releaseDate' 
                  : sort === 'oldest' ? 'set.releaseDate' 
                  : 'name';

    async function fetchData() {
      try {
        const data = await api.searchCards(query, {
          page,
          pageSize: 24,
          orderBy,
          type: type || undefined,
        });
        
        // Only update if this is still the latest request
        if (currentRequest === requestId.current) {
          setState({ data, loading: false, error: null });
        }
      } catch (err) {
        if (currentRequest === requestId.current) {
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : 'Search failed',
          });
        }
      }
    }

    fetchData();
  }, [query, type, sort, page]);

  return state;
}

/**
 * Hook for fetching a single card
 */
export function useCard(id: string) {
  const [state, setState] = useState<UseApiState<PokemonCard>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;
    setState({ data: null, loading: true, error: null });

    async function fetchData() {
      try {
        const data = await api.getCard(id);
        if (mounted) {
          setState({ data, loading: false, error: null });
        }
      } catch (err) {
        if (mounted) {
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : 'Failed to load card',
          });
        }
      }
    }

    fetchData();
    return () => { mounted = false; };
  }, [id]);

  return state;
}

/**
 * Hook for fetching all sets
 */
export function useSets() {
  const [state, setState] = useState<UseApiState<PokemonSet[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        const data = await api.getSets();
        if (mounted) {
          setState({ data, loading: false, error: null });
        }
      } catch (err) {
        if (mounted) {
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : 'Failed to load sets',
          });
        }
      }
    }

    fetchData();
    return () => { mounted = false; };
  }, []);

  return state;
}

/**
 * Hook for fetching cards from a specific set
 */
export function useSetCards(setId: string, page: number = 1) {
  const [state, setState] = useState<UseApiState<ApiResponse<PokemonCard[]>>>({
    data: null,
    loading: true,
    error: null,
  });

  const [set, setSet] = useState<PokemonSet | null>(null);
  const [setError, setSetError] = useState<string | null>(null);

  // Fetch set details
  useEffect(() => {
    let mounted = true;

    async function fetchSet() {
      try {
        const data = await api.getSet(setId);
        if (mounted) {
          setSet(data);
          setSetError(null);
        }
      } catch (err) {
        if (mounted) {
          setSetError(err instanceof Error ? err.message : 'Failed to load set');
        }
      }
    }

    fetchSet();
    return () => { mounted = false; };
  }, [setId]);

  // Fetch set cards
  useEffect(() => {
    let mounted = true;
    setState(prev => ({ ...prev, loading: true }));

    async function fetchCards() {
      try {
        const data = await api.getSetCards(setId, { page, pageSize: 50 });
        if (mounted) {
          setState({ data, loading: false, error: null });
        }
      } catch (err) {
        if (mounted) {
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : 'Failed to load cards',
          });
        }
      }
    }

    fetchCards();
    return () => { mounted = false; };
  }, [setId, page]);

  return {
    ...state,
    set,
    setError: setError || state.error,
  };
}

/**
 * Hook for debounced search
 */
export function useDebouncedValue<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
