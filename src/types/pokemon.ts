/**
 * Pokemon TCG API Types
 * Based on https://docs.pokemontcg.io
 */

export interface CardImage {
  small: string;
  large: string;
}

export interface SetImage {
  symbol: string;
  logo: string;
}

export interface Attack {
  name: string;
  cost: string[];
  convertedEnergyCost: number;
  damage: string;
  text: string;
}

export interface Weakness {
  type: string;
  value: string;
}

export interface Resistance {
  type: string;
  value: string;
}

export interface Ability {
  name: string;
  text: string;
  type: string;
}

export interface Legalities {
  unlimited?: string;
  standard?: string;
  expanded?: string;
}

export interface TCGPlayerPrice {
  low?: number;
  mid?: number;
  high?: number;
  market?: number;
  directLow?: number;
}

export interface TCGPlayerPrices {
  normal?: TCGPlayerPrice;
  holofoil?: TCGPlayerPrice;
  reverseHolofoil?: TCGPlayerPrice;
  '1stEditionHolofoil'?: TCGPlayerPrice;
  '1stEditionNormal'?: TCGPlayerPrice;
}

export interface TCGPlayer {
  url: string;
  updatedAt: string;
  prices?: TCGPlayerPrices;
}

export interface CardMarket {
  url: string;
  updatedAt: string;
  prices?: {
    averageSellPrice?: number;
    lowPrice?: number;
    trendPrice?: number;
    germanProLow?: number;
    suggestedPrice?: number;
    reverseHoloSell?: number;
    reverseHoloLow?: number;
    reverseHoloTrend?: number;
    lowPriceExPlus?: number;
    avg1?: number;
    avg7?: number;
    avg30?: number;
    reverseHoloAvg1?: number;
    reverseHoloAvg7?: number;
    reverseHoloAvg30?: number;
  };
}

export interface PokemonSet {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: number;
  legalities: Legalities;
  ptcgoCode?: string;
  releaseDate: string;
  updatedAt: string;
  images: SetImage;
}

export interface PokemonCard {
  id: string;
  name: string;
  supertype: string;
  subtypes?: string[];
  hp?: string;
  types?: string[];
  evolvesFrom?: string;
  evolvesTo?: string[];
  rules?: string[];
  attacks?: Attack[];
  weaknesses?: Weakness[];
  resistances?: Resistance[];
  retreatCost?: string[];
  convertedRetreatCost?: number;
  set: PokemonSet;
  number: string;
  artist?: string;
  rarity?: string;
  flavorText?: string;
  nationalPokedexNumbers?: number[];
  legalities: Legalities;
  images: CardImage;
  tcgplayer?: TCGPlayer;
  cardmarket?: CardMarket;
  abilities?: Ability[];
}

export interface ApiResponse<T> {
  data: T;
  page?: number;
  pageSize?: number;
  count?: number;
  totalCount?: number;
}

export type CardType =
  | ""
  | "Colorless"
  | "Darkness"
  | "Dragon"
  | "Fairy"
  | "Fighting"
  | "Fire"
  | "Grass"
  | "Lightning"
  | "Metal"
  | "Psychic"
  | "Water";

export type SortOption = "" | "newest" | "oldest" | "name" | "value_high" | "value_low";
