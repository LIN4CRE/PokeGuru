/**
 * Complete UK Pokémon TCG Set Database
 *
 * Every English-language Pokémon TCG set released in the UK,
 * organised chronologically from Base Set (1999) to present.
 *
 * Note: UK releases share the same English-language card pool
 * as all other Western markets. Release dates listed are the
 * international English-language dates; UK street dates sometimes
 * differed by a few days.
 *
 * Sources: Bulbapedia, The Pokémon Company International, Serebii
 */

export interface WikiSet {
  name: string;
  id: string;           // pokemontcg.io set id
  cards: number;
  releaseDate: string;  // YYYY-MM-DD for sorting
  releaseYear: number;
  type: 'main' | 'special' | 'promo';
  psa10Avg?: number;    // Average PSA 10 value in GBP
  psa10Max?: number;    // Maximum PSA 10 value in GBP
}

export interface WikiEra {
  name: string;
  slug: string;
  years: string;
  description: string;
  colour: string;       // CSS accent colour for the era badge
  sets: WikiSet[];
}

const UK_ERAS: WikiEra[] = [
  /* ─────────── Original / WOTC Era ─────────── */
  {
    name: 'Original Series (WOTC)',
    slug: 'original',
    years: '1999 – 2003',
    description: 'The very first Pokémon cards published in English by Wizards of the Coast. Base Set, Jungle & Fossil defined an entire generation of collectors.',
    colour: '#ef4444',
    sets: [
      { name: 'Base Set', id: 'base1', cards: 102, releaseDate: '1999-01-09', releaseYear: 1999, type: 'main', psa10Avg: 850, psa10Max: 250000 },
      { name: 'Jungle', id: 'base2', cards: 64, releaseDate: '1999-06-16', releaseYear: 1999, type: 'main', psa10Avg: 450, psa10Max: 12000 },
      { name: 'Fossil', id: 'base3', cards: 62, releaseDate: '1999-10-10', releaseYear: 1999, type: 'main', psa10Avg: 420, psa10Max: 15000 },
      { name: 'Base Set 2', id: 'base4', cards: 130, releaseDate: '2000-02-24', releaseYear: 2000, type: 'main', psa10Avg: 250, psa10Max: 5000 },
      { name: 'Team Rocket', id: 'base5', cards: 83, releaseDate: '2000-04-24', releaseYear: 2000, type: 'main', psa10Avg: 380, psa10Max: 10000 },
      { name: 'Gym Heroes', id: 'gym1', cards: 132, releaseDate: '2000-08-14', releaseYear: 2000, type: 'main', psa10Avg: 320, psa10Max: 8000 },
      { name: 'Gym Challenge', id: 'gym2', cards: 132, releaseDate: '2000-10-16', releaseYear: 2000, type: 'main', psa10Avg: 350, psa10Max: 12000 },
      { name: 'Neo Genesis', id: 'neo1', cards: 111, releaseDate: '2000-12-16', releaseYear: 2000, type: 'main', psa10Avg: 400, psa10Max: 20000 },
      { name: 'Neo Discovery', id: 'neo2', cards: 75, releaseDate: '2001-06-01', releaseYear: 2001, type: 'main', psa10Avg: 300, psa10Max: 7000 },
      { name: 'Neo Revelation', id: 'neo3', cards: 66, releaseDate: '2001-09-21', releaseYear: 2001, type: 'main', psa10Avg: 600, psa10Max: 15000 },
      { name: 'Neo Destiny', id: 'neo4', cards: 113, releaseDate: '2002-02-28', releaseYear: 2002, type: 'main', psa10Avg: 750, psa10Max: 30000 },
      { name: 'Southern Islands', id: 'si1', cards: 18, releaseDate: '2002-04-01', releaseYear: 2002, type: 'special' },
      { name: 'Legendary Collection', id: 'base6', cards: 110, releaseDate: '2002-05-24', releaseYear: 2002, type: 'special' },
      { name: 'Expedition Base Set', id: 'ecard1', cards: 165, releaseDate: '2002-09-15', releaseYear: 2002, type: 'main' },
      { name: 'Aquapolis', id: 'ecard2', cards: 186, releaseDate: '2003-01-15', releaseYear: 2003, type: 'main' },
      { name: 'Skyridge', id: 'ecard3', cards: 182, releaseDate: '2003-05-12', releaseYear: 2003, type: 'main' },
      { name: 'Wizards Black Star Promos', id: 'promo1', cards: 53, releaseDate: '2003-05-13', releaseYear: 2003, type: 'promo' },
    ],
  },

  /* ─────────── EX Era ─────────── */
  {
    name: 'EX Series',
    slug: 'ex',
    years: '2003 – 2007',
    description: 'The arrival of Pokémon-ex cards with powerful attacks and the downside of giving up two Prize cards. Published by The Pokémon Company International.',
    colour: '#f59e0b',
    sets: [
      { name: 'EX Ruby & Sapphire', id: 'ex1', cards: 109, releaseDate: '2003-07-18', releaseYear: 2003, type: 'main', psa10Avg: 200, psa10Max: 6000 },
      { name: 'EX Sandstorm', id: 'ex2', cards: 100, releaseDate: '2003-09-18', releaseYear: 2003, type: 'main', psa10Avg: 180, psa10Max: 4000 },
      { name: 'EX Dragon', id: 'ex3', cards: 100, releaseDate: '2003-11-24', releaseYear: 2003, type: 'main', psa10Avg: 220, psa10Max: 8000 },
      { name: 'EX Team Magma vs Team Aqua', id: 'ex4', cards: 97, releaseDate: '2004-03-01', releaseYear: 2004, type: 'main', psa10Avg: 190, psa10Max: 5500 },
      { name: 'EX Hidden Legends', id: 'ex5', cards: 102, releaseDate: '2004-06-14', releaseYear: 2004, type: 'main', psa10Avg: 170, psa10Max: 4500 },
      { name: 'EX FireRed & LeafGreen', id: 'ex6', cards: 116, releaseDate: '2004-09-01', releaseYear: 2004, type: 'main', psa10Avg: 250, psa10Max: 9000 },
      { name: 'EX Team Rocket Returns', id: 'ex7', cards: 111, releaseDate: '2004-11-08', releaseYear: 2004, type: 'main', psa10Avg: 350, psa10Max: 15000 },
      { name: 'EX Deoxys', id: 'ex8', cards: 108, releaseDate: '2005-02-14', releaseYear: 2005, type: 'main', psa10Avg: 280, psa10Max: 10000 },
      { name: 'EX Emerald', id: 'ex9', cards: 107, releaseDate: '2005-05-09', releaseYear: 2005, type: 'main', psa10Avg: 200, psa10Max: 5000 },
      { name: 'EX Unseen Forces', id: 'ex10', cards: 145, releaseDate: '2005-08-22', releaseYear: 2005, type: 'main', psa10Avg: 240, psa10Max: 7000 },
      { name: 'EX Delta Species', id: 'ex11', cards: 114, releaseDate: '2005-10-31', releaseYear: 2005, type: 'main', psa10Avg: 210, psa10Max: 6500 },
      { name: 'EX Legend Maker', id: 'ex12', cards: 93, releaseDate: '2006-02-13', releaseYear: 2006, type: 'main', psa10Avg: 200, psa10Max: 5000 },
      { name: 'EX Holon Phantoms', id: 'ex13', cards: 111, releaseDate: '2006-05-03', releaseYear: 2006, type: 'main', psa10Avg: 230, psa10Max: 7500 },
      { name: 'EX Crystal Guardians', id: 'ex14', cards: 100, releaseDate: '2006-08-30', releaseYear: 2006, type: 'main', psa10Avg: 210, psa10Max: 6000 },
      { name: 'EX Dragon Frontiers', id: 'ex15', cards: 101, releaseDate: '2006-11-08', releaseYear: 2006, type: 'main', psa10Avg: 300, psa10Max: 12000 },
      { name: 'EX Power Keepers', id: 'ex16', cards: 108, releaseDate: '2007-02-14', releaseYear: 2007, type: 'main', psa10Avg: 190, psa10Max: 5000 },
      { name: 'Nintendo Black Star Promos', id: 'np', cards: 40, releaseDate: '2007-03-01', releaseYear: 2007, type: 'promo' },
    ],
  },

  /* ─────────── Diamond & Pearl Era ─────────── */
  {
    name: 'Diamond & Pearl Series',
    slug: 'dp',
    years: '2007 – 2009',
    description: 'Introduced LV.X cards and new mechanics alongside Generation IV Pokémon from the Sinnoh region.',
    colour: '#3b82f6',
    sets: [
      { name: 'Diamond & Pearl', id: 'dp1', cards: 130, releaseDate: '2007-05-23', releaseYear: 2007, type: 'main', psa10Avg: 150, psa10Max: 3000 },
      { name: 'Mysterious Treasures', id: 'dp2', cards: 124, releaseDate: '2007-08-22', releaseYear: 2007, type: 'main', psa10Avg: 140, psa10Max: 2500 },
      { name: 'Secret Wonders', id: 'dp3', cards: 132, releaseDate: '2007-11-07', releaseYear: 2007, type: 'main', psa10Avg: 160, psa10Max: 2800 },
      { name: 'Great Encounters', id: 'dp4', cards: 106, releaseDate: '2008-02-13', releaseYear: 2008, type: 'main', psa10Avg: 130, psa10Max: 2200 },
      { name: 'Majestic Dawn', id: 'dp5', cards: 100, releaseDate: '2008-05-21', releaseYear: 2008, type: 'main', psa10Avg: 150, psa10Max: 3500 },
      { name: 'Legends Awakened', id: 'dp6', cards: 146, releaseDate: '2008-08-20', releaseYear: 2008, type: 'main', psa10Avg: 180, psa10Max: 5000 },
      { name: 'Stormfront', id: 'dp7', cards: 106, releaseDate: '2008-11-05', releaseYear: 2008, type: 'main', psa10Avg: 170, psa10Max: 4500 },
    ],
  },

  /* ─────────── Platinum Era ─────────── */
  {
    name: 'Platinum Series',
    slug: 'platinum',
    years: '2009 – 2010',
    description: 'Short but iconic series featuring Pokémon SP, the Distortion World, and fan-favourite Arceus cards.',
    colour: '#a855f7',
    sets: [
      { name: 'Platinum', id: 'pl1', cards: 133, releaseDate: '2009-02-11', releaseYear: 2009, type: 'main', psa10Avg: 140, psa10Max: 4000 },
      { name: 'Rising Rivals', id: 'pl2', cards: 120, releaseDate: '2009-05-20', releaseYear: 2009, type: 'main', psa10Avg: 130, psa10Max: 3500 },
      { name: 'Supreme Victors', id: 'pl3', cards: 153, releaseDate: '2009-08-19', releaseYear: 2009, type: 'main', psa10Avg: 160, psa10Max: 6000 },
      { name: 'Arceus', id: 'pl4', cards: 111, releaseDate: '2009-11-04', releaseYear: 2009, type: 'main', psa10Avg: 150, psa10Max: 4500 },
    ],
  },

  /* ─────────── HeartGold & SoulSilver Era ─────────── */
  {
    name: 'HeartGold & SoulSilver Series',
    slug: 'hgss',
    years: '2010 – 2011',
    description: 'Brought LEGEND cards — two-card combos featuring Legendary Pokémon — and the return of Johto favourites.',
    colour: '#eab308',
    sets: [
      { name: 'HeartGold & SoulSilver', id: 'hgss1', cards: 124, releaseDate: '2010-02-10', releaseYear: 2010, type: 'main', psa10Avg: 180, psa10Max: 8000 },
      { name: 'Unleashed', id: 'hgss2', cards: 96, releaseDate: '2010-05-12', releaseYear: 2010, type: 'main', psa10Avg: 160, psa10Max: 5000 },
      { name: 'Undaunted', id: 'hgss3', cards: 91, releaseDate: '2010-08-18', releaseYear: 2010, type: 'main', psa10Avg: 170, psa10Max: 7000 },
      { name: 'Triumphant', id: 'hgss4', cards: 103, releaseDate: '2010-11-03', releaseYear: 2010, type: 'main', psa10Avg: 190, psa10Max: 10000 },
      { name: 'Call of Legends', id: 'col1', cards: 106, releaseDate: '2011-02-09', releaseYear: 2011, type: 'special', psa10Avg: 220, psa10Max: 12000 },
    ],
  },

  /* ─────────── Black & White Era ─────────── */
  {
    name: 'Black & White Series',
    slug: 'bw',
    years: '2011 – 2013',
    description: 'The era that introduced Pokémon-EX, Full Art cards, and the entire Unova region to the TCG.',
    colour: '#6366f1',
    sets: [
      { name: 'Black & White', id: 'bw1', cards: 115, releaseDate: '2011-04-25', releaseYear: 2011, type: 'main', psa10Avg: 120, psa10Max: 3500 },
      { name: 'Emerging Powers', id: 'bw2', cards: 98, releaseDate: '2011-08-31', releaseYear: 2011, type: 'main', psa10Avg: 100, psa10Max: 2000 },
      { name: 'Noble Victories', id: 'bw3', cards: 102, releaseDate: '2011-11-16', releaseYear: 2011, type: 'main', psa10Avg: 110, psa10Max: 3000 },
      { name: 'Next Destinies', id: 'bw4', cards: 103, releaseDate: '2012-02-08', releaseYear: 2012, type: 'main', psa10Avg: 115, psa10Max: 4000 },
      { name: 'Dark Explorers', id: 'bw5', cards: 111, releaseDate: '2012-05-09', releaseYear: 2012, type: 'main', psa10Avg: 130, psa10Max: 6000 },
      { name: 'Dragons Exalted', id: 'bw6', cards: 128, releaseDate: '2012-08-15', releaseYear: 2012, type: 'main', psa10Avg: 140, psa10Max: 7500 },
      { name: 'Dragon Vault', id: 'dv1', cards: 21, releaseDate: '2012-10-05', releaseYear: 2012, type: 'special', psa10Avg: 90, psa10Max: 1500 },
      { name: 'Boundaries Crossed', id: 'bw7', cards: 153, releaseDate: '2012-11-07', releaseYear: 2012, type: 'main', psa10Avg: 125, psa10Max: 5000 },
      { name: 'Plasma Storm', id: 'bw8', cards: 138, releaseDate: '2013-02-06', releaseYear: 2013, type: 'main', psa10Avg: 135, psa10Max: 8000 },
      { name: 'Plasma Freeze', id: 'bw9', cards: 122, releaseDate: '2013-05-08', releaseYear: 2013, type: 'main', psa10Avg: 140, psa10Max: 9000 },
      { name: 'Plasma Blast', id: 'bw10', cards: 105, releaseDate: '2013-08-14', releaseYear: 2013, type: 'main', psa10Avg: 130, psa10Max: 7000 },
      { name: 'Legendary Treasures', id: 'bw11', cards: 140, releaseDate: '2013-11-06', releaseYear: 2013, type: 'special', psa10Avg: 110, psa10Max: 4000 },
    ],
  },

  /* ─────────── XY Era ─────────── */
  {
    name: 'XY Series',
    slug: 'xy',
    years: '2014 – 2016',
    description: 'Mega Evolution came to the TCG alongside BREAK cards. The Kalos region brought a new design style that collectors still love.',
    colour: '#0ea5e9',
    sets: [
      { name: 'XY', id: 'xy1', cards: 146, releaseDate: '2014-02-05', releaseYear: 2014, type: 'main', psa10Avg: 110, psa10Max: 5000 },
      { name: 'Flashfire', id: 'xy2', cards: 109, releaseDate: '2014-05-07', releaseYear: 2014, type: 'main', psa10Avg: 150, psa10Max: 12000 },
      { name: 'Furious Fists', id: 'xy3', cards: 114, releaseDate: '2014-08-13', releaseYear: 2014, type: 'main', psa10Avg: 90, psa10Max: 3000 },
      { name: 'Phantom Forces', id: 'xy4', cards: 122, releaseDate: '2014-11-05', releaseYear: 2014, type: 'main', psa10Avg: 120, psa10Max: 8000 },
      { name: 'Primal Clash', id: 'xy5', cards: 164, releaseDate: '2015-02-04', releaseYear: 2015, type: 'main', psa10Avg: 100, psa10Max: 4500 },
      { name: 'Double Crisis', id: 'dc1', cards: 34, releaseDate: '2015-03-25', releaseYear: 2015, type: 'special', psa10Avg: 80, psa10Max: 2000 },
      { name: 'Roaring Skies', id: 'xy6', cards: 110, releaseDate: '2015-05-06', releaseYear: 2015, type: 'main', psa10Avg: 110, psa10Max: 6000 },
      { name: 'Ancient Origins', id: 'xy7', cards: 100, releaseDate: '2015-08-12', releaseYear: 2015, type: 'main', psa10Avg: 120, psa10Max: 7000 },
      { name: 'BREAKthrough', id: 'xy8', cards: 164, releaseDate: '2015-11-04', releaseYear: 2015, type: 'main', psa10Avg: 85, psa10Max: 3500 },
      { name: 'BREAKpoint', id: 'xy9', cards: 123, releaseDate: '2016-02-03', releaseYear: 2016, type: 'main', psa10Avg: 90, psa10Max: 4000 },
      { name: 'Generations', id: 'g1', cards: 115, releaseDate: '2016-02-22', releaseYear: 2016, type: 'special', psa10Avg: 100, psa10Max: 5000 },
      { name: 'Fates Collide', id: 'xy10', cards: 125, releaseDate: '2016-05-02', releaseYear: 2016, type: 'main', psa10Avg: 80, psa10Max: 2500 },
      { name: 'Steam Siege', id: 'xy11', cards: 116, releaseDate: '2016-08-03', releaseYear: 2016, type: 'main', psa10Avg: 75, psa10Max: 2000 },
      { name: 'Evolutions', id: 'xy12', cards: 113, releaseDate: '2016-11-02', releaseYear: 2016, type: 'main', psa10Avg: 120, psa10Max: 3500 },
    ],
  },

  /* ─────────── Sun & Moon Era ─────────── */
  {
    name: 'Sun & Moon Series',
    slug: 'sm',
    years: '2017 – 2019',
    description: 'Pokémon-GX debuted with dramatic artwork. Featured the Alola region, Ultra Beasts, and the beloved Hidden Fates chase set.',
    colour: '#f97316',
    sets: [
      { name: 'Sun & Moon', id: 'sm1', cards: 163, releaseDate: '2017-02-03', releaseYear: 2017, type: 'main', psa10Avg: 60, psa10Max: 1500 },
      { name: 'Guardians Rising', id: 'sm2', cards: 169, releaseDate: '2017-05-05', releaseYear: 2017, type: 'main', psa10Avg: 55, psa10Max: 1000 },
      { name: 'Burning Shadows', id: 'sm3', cards: 169, releaseDate: '2017-08-04', releaseYear: 2017, type: 'main', psa10Avg: 80, psa10Max: 15000 },
      { name: 'Shining Legends', id: 'sm35', cards: 78, releaseDate: '2017-10-06', releaseYear: 2017, type: 'special', psa10Avg: 75, psa10Max: 3000 },
      { name: 'Crimson Invasion', id: 'sm4', cards: 124, releaseDate: '2017-11-03', releaseYear: 2017, type: 'main', psa10Avg: 45, psa10Max: 800 },
      { name: 'Ultra Prism', id: 'sm5', cards: 173, releaseDate: '2018-02-02', releaseYear: 2018, type: 'main', psa10Avg: 70, psa10Max: 2500 },
      { name: 'Forbidden Light', id: 'sm6', cards: 146, releaseDate: '2018-05-04', releaseYear: 2018, type: 'main', psa10Avg: 65, psa10Max: 1200 },
      { name: 'Celestial Storm', id: 'sm7', cards: 187, releaseDate: '2018-08-03', releaseYear: 2018, type: 'main', psa10Avg: 75, psa10Max: 4000 },
      { name: 'Dragon Majesty', id: 'sm75', cards: 78, releaseDate: '2018-09-07', releaseYear: 2018, type: 'special', psa10Avg: 70, psa10Max: 2000 },
      { name: 'Lost Thunder', id: 'sm8', cards: 236, releaseDate: '2018-11-02', releaseYear: 2018, type: 'main', psa10Avg: 85, psa10Max: 5000 },
      { name: 'Team Up', id: 'sm9', cards: 196, releaseDate: '2019-02-01', releaseYear: 2019, type: 'main', psa10Avg: 120, psa10Max: 10000 },
      { name: 'Detective Pikachu', id: 'det1', cards: 18, releaseDate: '2019-04-05', releaseYear: 2019, type: 'special', psa10Avg: 40, psa10Max: 300 },
      { name: 'Unbroken Bonds', id: 'sm10', cards: 234, releaseDate: '2019-05-03', releaseYear: 2019, type: 'main', psa10Avg: 95, psa10Max: 6000 },
      { name: 'Unified Minds', id: 'sm11', cards: 258, releaseDate: '2019-08-02', releaseYear: 2019, type: 'main', psa10Avg: 90, psa10Max: 4500 },
      { name: 'Hidden Fates', id: 'sm115', cards: 163, releaseDate: '2019-08-23', releaseYear: 2019, type: 'special', psa10Avg: 110, psa10Max: 5000 },
      { name: 'Cosmic Eclipse', id: 'sm12', cards: 271, releaseDate: '2019-11-01', releaseYear: 2019, type: 'main', psa10Avg: 100, psa10Max: 8000 },
    ],
  },

  /* ─────────── Sword & Shield Era ─────────── */
  {
    name: 'Sword & Shield Series',
    slug: 'swsh',
    years: '2020 – 2023',
    description: 'Pokémon V & VMAX brought Dynamax and Gigantamax to the card game. Alternate Art rares became the most sought-after pulls.',
    colour: '#06b6d4',
    sets: [
      { name: 'Sword & Shield', id: 'swsh1', cards: 216, releaseDate: '2020-02-07', releaseYear: 2020, type: 'main', psa10Avg: 45, psa10Max: 500 },
      { name: 'Rebel Clash', id: 'swsh2', cards: 209, releaseDate: '2020-05-01', releaseYear: 2020, type: 'main', psa10Avg: 40, psa10Max: 400 },
      { name: 'Darkness Ablaze', id: 'swsh3', cards: 201, releaseDate: '2020-08-14', releaseYear: 2020, type: 'main', psa10Avg: 50, psa10Max: 800 },
      { name: "Champion's Path", id: 'swsh35', cards: 80, releaseDate: '2020-09-25', releaseYear: 2020, type: 'special', psa10Avg: 90, psa10Max: 1500 },
      { name: 'Vivid Voltage', id: 'swsh4', cards: 203, releaseDate: '2020-11-13', releaseYear: 2020, type: 'main', psa10Avg: 55, psa10Max: 1200 },
      { name: 'Shining Fates', id: 'swsh45', cards: 195, releaseDate: '2021-02-19', releaseYear: 2021, type: 'special', psa10Avg: 50, psa10Max: 1000 },
      { name: 'Battle Styles', id: 'swsh5', cards: 183, releaseDate: '2021-03-19', releaseYear: 2021, type: 'main', psa10Avg: 40, psa10Max: 600 },
      { name: 'Chilling Reign', id: 'swsh6', cards: 233, releaseDate: '2021-06-18', releaseYear: 2021, type: 'main', psa10Avg: 60, psa10Max: 1200 },
      { name: 'Evolving Skies', id: 'swsh7', cards: 237, releaseDate: '2021-08-27', releaseYear: 2021, type: 'main', psa10Avg: 110, psa10Max: 3500 },
      { name: 'Celebrations', id: 'cel25', cards: 50, releaseDate: '2021-10-08', releaseYear: 2021, type: 'special', psa10Avg: 60, psa10Max: 1200 },
      { name: 'Fusion Strike', id: 'swsh8', cards: 284, releaseDate: '2021-11-12', releaseYear: 2021, type: 'main', psa10Avg: 50, psa10Max: 1500 },
      { name: 'Brilliant Stars', id: 'swsh9', cards: 216, releaseDate: '2022-02-25', releaseYear: 2022, type: 'main', psa10Avg: 65, psa10Max: 1800 },
      { name: 'Astral Radiance', id: 'swsh10', cards: 246, releaseDate: '2022-05-27', releaseYear: 2022, type: 'main', psa10Avg: 55, psa10Max: 1000 },
      { name: 'Pokémon GO', id: 'pgo', cards: 88, releaseDate: '2022-07-01', releaseYear: 2022, type: 'special', psa10Avg: 45, psa10Max: 350 },
      { name: 'Lost Origin', id: 'swsh11', cards: 247, releaseDate: '2022-09-09', releaseYear: 2022, type: 'main', psa10Avg: 60, psa10Max: 2000 },
      { name: 'Silver Tempest', id: 'swsh12', cards: 245, releaseDate: '2022-11-11', releaseYear: 2022, type: 'main', psa10Avg: 60, psa10Max: 2500 },
      { name: 'Crown Zenith', id: 'swsh125', cards: 230, releaseDate: '2023-01-20', releaseYear: 2023, type: 'special', psa10Avg: 80, psa10Max: 2000 },
    ],
  },

  /* ─────────── Scarlet & Violet Era ─────────── */
  {
    name: 'Scarlet & Violet Series',
    slug: 'sv',
    years: '2023 – 2025',
    description: 'Pokémon ex returned (lowercase!) with stunning Illustration Rare and Special Art Rare chase cards. The Paldea region and Tera types took centre stage.',
    colour: '#ec4899',
    sets: [
      { name: 'Scarlet & Violet', id: 'sv1', cards: 258, releaseDate: '2023-03-31', releaseYear: 2023, type: 'main', psa10Avg: 35, psa10Max: 300 },
      { name: 'Paldea Evolved', id: 'sv2', cards: 279, releaseDate: '2023-06-09', releaseYear: 2023, type: 'main', psa10Avg: 40, psa10Max: 500 },
      { name: 'Obsidian Flames', id: 'sv3', cards: 230, releaseDate: '2023-08-11', releaseYear: 2023, type: 'main', psa10Avg: 45, psa10Max: 600 },
      { name: '151', id: 'sv3pt5', cards: 207, releaseDate: '2023-09-22', releaseYear: 2023, type: 'special', psa10Avg: 85, psa10Max: 1200 },
      { name: 'Paradox Rift', id: 'sv4', cards: 266, releaseDate: '2023-11-03', releaseYear: 2023, type: 'main', psa10Avg: 40, psa10Max: 450 },
      { name: 'Paldean Fates', id: 'sv4pt5', cards: 245, releaseDate: '2024-01-26', releaseYear: 2024, type: 'special', psa10Avg: 50, psa10Max: 800 },
      { name: 'Temporal Forces', id: 'sv5', cards: 218, releaseDate: '2024-03-22', releaseYear: 2024, type: 'main', psa10Avg: 40, psa10Max: 400 },
      { name: 'Twilight Masquerade', id: 'sv6', cards: 226, releaseDate: '2024-05-24', releaseYear: 2024, type: 'main', psa10Avg: 45, psa10Max: 700 },
      { name: 'Shrouded Fable', id: 'sv6pt5', cards: 99, releaseDate: '2024-08-02', releaseYear: 2024, type: 'special', psa10Avg: 35, psa10Max: 250 },
      { name: 'Stellar Crown', id: 'sv7', cards: 175, releaseDate: '2024-09-13', releaseYear: 2024, type: 'main', psa10Avg: 40, psa10Max: 400 },
      { name: 'Surging Sparks', id: 'sv8', cards: 252, releaseDate: '2024-11-08', releaseYear: 2024, type: 'main', psa10Avg: 50, psa10Max: 1000 },
      { name: 'Prismatic Evolutions', id: 'sv8pt5', cards: 180, releaseDate: '2025-01-17', releaseYear: 2025, type: 'special', psa10Avg: 60, psa10Max: 1500 },
      { name: 'Journey Together', id: 'sv9', cards: 162, releaseDate: '2025-03-28', releaseYear: 2025, type: 'main' },
      { name: 'Destined Rivals', id: 'sv10', cards: 200, releaseDate: '2025-05-30', releaseYear: 2025, type: 'main' },
    ],
  },

  /* ─────────── Mega Evolution / Master Ball Era ─────────── */
  {
    name: 'Mega Evolution Era',
    slug: 'mega',
    years: '2025 – present',
    description: 'The newest era of the TCG, re-introducing Mega Evolution mechanics alongside brand-new card designs and collectibility.',
    colour: '#10b981',
    sets: [
      { name: 'Mega Evolution', id: 'me1', cards: 200, releaseDate: '2025-09-26', releaseYear: 2025, type: 'main' },
      { name: 'Phantasmal Flames', id: 'me2', cards: 190, releaseDate: '2025-11-14', releaseYear: 2025, type: 'main' },
      { name: 'Ascended Heroes', id: 'me2pt5', cards: 175, releaseDate: '2026-01-30', releaseYear: 2026, type: 'main' },
    ],
  },
];

export default UK_ERAS;

/* ─── Derived helpers ─── */

/** Total number of unique sets */
export function getTotalSetCount(): number {
  return UK_ERAS.reduce((sum, era) => sum + era.sets.length, 0);
}

/** Total number of cards across all sets */
export function getTotalCardCount(): number {
  return UK_ERAS.reduce(
    (sum, era) => sum + era.sets.reduce((s, set) => s + set.cards, 0),
    0,
  );
}

/** Get a flat list of every set */
export function getAllSets(): (WikiSet & { eraName: string; eraSlug: string })[] {
  return UK_ERAS.flatMap((era) =>
    era.sets.map((set) => ({ ...set, eraName: era.name, eraSlug: era.slug })),
  );
}
