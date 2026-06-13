import type { PokemonCard } from '../types/pokemon';

const USD_TO_GBP = 0.79;

function getRawUSD(card: PokemonCard): number {
  const prices = card.tcgplayer?.prices;
  if (!prices) return 0;

  if (prices.holofoil?.market) return prices.holofoil.market;
  if (prices.reverseHolofoil?.market) return prices.reverseHolofoil.market;
  if (prices.normal?.market) return prices.normal.market;
  if (prices['1stEditionHolofoil']?.market) return prices['1stEditionHolofoil'].market;
  if (prices['1stEditionNormal']?.market) return prices['1stEditionNormal'].market;

  if (prices.holofoil?.mid) return prices.holofoil.mid;
  if (prices.reverseHolofoil?.mid) return prices.reverseHolofoil.mid;
  if (prices.normal?.mid) return prices.normal.mid;

  return 0;
}

export function getCardValueGBP(card: PokemonCard): number {
  return getRawUSD(card) * USD_TO_GBP;
}

export function formatGBP(value: number): string {
  if (!value) return '£0.00';
  return `£${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatGBPFromUSD(usd: number | undefined | null): string {
  if (!usd) return '—';
  const gbp = usd * USD_TO_GBP;
  return `£${gbp.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
