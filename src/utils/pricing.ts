import type { PokemonCard } from '../types/pokemon';

// Exchange rate USD to GBP (approximate)
const USD_TO_GBP = 0.79;

export function getCardMarketValueUSD(card: PokemonCard): number {
  const prices = card.tcgplayer?.prices;
  if (!prices) return 0;

  // Prefer Market Price
  if (prices.holofoil?.market) return prices.holofoil.market;
  if (prices.reverseHolofoil?.market) return prices.reverseHolofoil.market;
  if (prices.normal?.market) return prices.normal.market;
  if (prices['1stEditionHolofoil']?.market) return prices['1stEditionHolofoil'].market;
  if (prices['1stEditionNormal']?.market) return prices['1stEditionNormal'].market;

  // Fallback to Mid Price
  if (prices.holofoil?.mid) return prices.holofoil.mid;
  if (prices.reverseHolofoil?.mid) return prices.reverseHolofoil.mid;
  if (prices.normal?.mid) return prices.normal.mid;

  return 0;
}

export function formatGBP(usdAmount: number): string {
  if (!usdAmount) return '£0.00';
  const gbp = usdAmount * USD_TO_GBP;
  return `£${gbp.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function getCardValueGBP(card: PokemonCard): number {
  return getCardMarketValueUSD(card) * USD_TO_GBP;
}
