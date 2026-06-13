/**
 * Pokemon TCG API Service
 *
 * Handles all API communication with pokemontcg.io
 * Implements caching, rate limiting awareness, and error handling
 */

import type { ApiResponse, PokemonCard, PokemonSet } from '../types/pokemon';

const API_BASE = 'https://api.pokemontcg.io/v2';

// In-memory cache for API responses
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Session storage cache key prefix
const STORAGE_PREFIX = 'pokeguru_cache_';

/**
 * Get cached data from memory or session storage
 */
function getFromCache<T>(key: string): T | null {
  // Check memory cache first
  const memCached = cache.get(key);
  if (memCached && Date.now() - memCached.timestamp < CACHE_TTL) {
    return memCached.data as T;
  }

  // Try session storage
  try {
    const stored = sessionStorage.getItem(STORAGE_PREFIX + key);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Date.now() - parsed.timestamp < CACHE_TTL) {
        cache.set(key, parsed);
        return parsed.data as T;
      }
      // Remove stale cache
      sessionStorage.removeItem(STORAGE_PREFIX + key);
    }
  } catch {
    // Ignore storage errors
  }

  return null;
}

/**
 * Store data in cache
 */
function setInCache<T>(key: string, data: T): void {
  const cacheEntry = { data, timestamp: Date.now() };
  cache.set(key, cacheEntry);

  try {
    sessionStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(cacheEntry));
  } catch {
    // Ignore storage errors (quota exceeded, etc.)
  }
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public isRateLimited: boolean = false
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Make an API request with caching and error handling
 */
async function apiRequest<T>(path: string): Promise<T> {
  // Check cache first
  const cached = getFromCache<T>(path);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const isRateLimited = response.status === 429;
      throw new ApiError(
        isRateLimited
          ? 'API rate limit exceeded. Please wait a moment and try again.'
          : `API error: ${response.status} ${response.statusText}`,
        response.status,
        isRateLimited
      );
    }

    const data = await response.json() as T;
    setInCache(path, data);
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      'Network error. Please check your connection and try again.',
      0
    );
  }
}

/**
 * Search for cards
 */
export async function searchCards(
  query: string,
  options: {
    page?: number;
    pageSize?: number;
    orderBy?: string;
    type?: string;
    rarity?: string;
    supertype?: string;
  } = {}
): Promise<ApiResponse<PokemonCard[]>> {
  const { page = 1, pageSize = 24, orderBy = 'name', type, rarity, supertype } = options;

  // Build query
  let q = buildSearchQuery(query);
  if (type) {
    q = q ? `${q} types:${type}` : `types:${type}`;
  }
  if (rarity) {
    q = q ? `${q} rarity:"${rarity}"` : `rarity:"${rarity}"`;
  }
  if (supertype) {
    q = q ? `${q} supertype:${supertype}` : `supertype:${supertype}`;
  }
  if (!q) {
    q = 'supertype:pokemon';
  }

  const path = `/cards?q=${encodeURIComponent(q)}&page=${page}&pageSize=${pageSize}&orderBy=${orderBy}`;
  return apiRequest<ApiResponse<PokemonCard[]>>(path);
}

/**
 * Get a single card by ID
 */
export async function getCard(id: string): Promise<PokemonCard> {
  const response = await apiRequest<ApiResponse<PokemonCard>>(`/cards/${encodeURIComponent(id)}`);
  return response.data;
}

/**
 * Get all sets
 */
export async function getSets(): Promise<PokemonSet[]> {
  const response = await apiRequest<ApiResponse<PokemonSet[]>>('/sets?orderBy=-releaseDate&pageSize=250');
  return response.data;
}

/**
 * Get a single set by ID
 */
export async function getSet(id: string): Promise<PokemonSet> {
  const response = await apiRequest<ApiResponse<PokemonSet>>(`/sets/${encodeURIComponent(id)}`);
  return response.data;
}

/**
 * Get cards from a specific set
 */
export async function getSetCards(
  setId: string,
  options: { page?: number; pageSize?: number } = {}
): Promise<ApiResponse<PokemonCard[]>> {
  const { page = 1, pageSize = 50 } = options;
  return apiRequest<ApiResponse<PokemonCard[]>>(
    `/cards?q=set.id:${encodeURIComponent(setId)}&page=${page}&pageSize=${pageSize}&orderBy=number`
  );
}

/**
 * Get featured cards for the home page
 */
export async function getFeaturedCards(): Promise<PokemonCard[]> {
  const response = await apiRequest<ApiResponse<PokemonCard[]>>(
    '/cards?q=supertype:pokemon%20rarity:%22Rare%20Holo%22&pageSize=12&orderBy=-set.releaseDate'
  );
  return response.data;
}

/**
 * Build a search query from user input
 *
 * If the input contains a colon (like "types:fire"), treat it as a field query.
 * Otherwise, treat it as a name search with wildcard.
 */
function buildSearchQuery(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';

  // Check if it looks like a field query (contains field:value)
  if (/[a-zA-Z.]+:/.test(trimmed)) {
    return trimmed;
  }

  // Treat as a name search with wildcard
  // Remove quotes to prevent query issues
  const sanitized = trimmed.replace(/"/g, '');
  return `name:"${sanitized}*"`;
}

/**
 * Clear all caches (useful for debugging)
 */
export function clearCache(): void {
  cache.clear();
  try {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        sessionStorage.removeItem(key);
      }
    });
  } catch {
    // Ignore storage errors
  }
}
