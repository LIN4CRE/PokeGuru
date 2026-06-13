# PokeGuru

<div align="center">
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-7.x-646CFF?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License" />
</div>

<p align="center">
  <strong>A fast, open Pokémon TCG card database</strong>
</p>

<p align="center">
  Search every card, browse by set, view market prices, and explore every UK Pokémon TCG set ever released.
</p>

---

## ✨ Features

- 🔎 **Advanced Search** — Search cards by name or use Lucene-style field queries (`types:fire`, `subtypes:mega`, etc.)
- 🃏 **Set Browser** — Explore every official Pokémon TCG set with card counts and release dates
- 📄 **Rich Card Details** — View high-resolution artwork, attacks, abilities, weaknesses, and real-time market prices
- 🇬🇧 **UK Card Wiki** — Complete database of every Pokémon TCG set released in the UK since 1999 — from Base Set/Jungle/Fossil through to the Mega Evolution era. Includes 10 eras, 120+ sets, and 18,000+ cards with timeline & table views, era filtering, and full search
- 📷 **Card Scanner** — UI ready for camera-based card identification (OCR integration ready)
- 📱 **Mobile Ready** — Fully responsive dark theme optimised for all devices
- ⚡ **Performance** — Client-side caching (memory + sessionStorage) with TTL reduces API calls
- 🛡️ **Error Boundary** — Graceful error recovery prevents crashes
- ♿ **Accessible** — ARIA labels, keyboard navigation, focus indicators

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 5 |
| Styling | Tailwind CSS 4 with CSS custom properties |
| Routing | React Router 7 |
| Build | Vite 7 (single-file output) |
| API | [Pokémon TCG API](https://pokemontcg.io) |
| Icons | Lucide React |

## 📋 Requirements

- Node.js 18+ or 20+
- npm 9+ or yarn 1.22+

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/lin4cre/PokeGuru.git
cd PokeGuru

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## 📁 Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── Cards/               # Card display (CardTile, CardGrid)
│   ├── Layout/              # App shell (Header, Footer, Layout)
│   ├── Sets/                # Set display (SetTile)
│   └── UI/                  # Generic UI (Loading, Error, Pagination,
│                              ErrorBoundary, BackToTop, ScrollToTop)
├── data/
│   └── ukSets.ts            # Complete UK TCG set database (10 eras, 120+ sets)
├── hooks/
│   └── useApi.ts            # Custom React hooks for API fetching
├── pages/
│   ├── HomePage.tsx          # Landing page with hero search & feature cards
│   ├── SearchPage.tsx        # Search results with filters & pagination
│   ├── CardDetailPage.tsx    # Full card detail with prices & set info
│   ├── SetsPage.tsx          # Browse all sets with search & series filter
│   ├── SetDetailPage.tsx     # Set detail with card list
│   ├── WikiPage.tsx          # 🇬🇧 UK Card Wiki with timeline/table views
│   ├── ScannerPage.tsx       # Card scanner UI
│   └── NotFoundPage.tsx      # 404 page
├── services/
│   └── api.ts               # Pokemon TCG API client with caching & error handling
├── types/
│   └── pokemon.ts           # TypeScript type definitions for API responses
├── utils/
│   └── cn.ts                # Tailwind class merging utility
├── App.tsx                   # Root component with routing & error boundary
├── main.tsx                  # Entry point
└── index.css                 # Global styles, CSS variables, animations
```

## 🔍 Search Syntax

PokeGuru supports the Pokémon TCG API's Lucene-style query syntax:

| Query | Description |
|-------|-------------|
| `charizard` | Search by name |
| `name:pikachu` | Exact name field search |
| `types:fire` | Filter by type |
| `subtypes:mega` | Filter by subtype |
| `rarity:"Rare Holo"` | Filter by rarity |
| `set.name:Vivid` | Filter by set name |
| `set.id:base1` | Filter by set ID |
| `hp:[100 TO *]` | HP range query |

**Examples:**
- `types:dragon subtypes:VMAX` — Dragon-type VMAX cards
- `artist:Arita` — Cards illustrated by Mitsuhiro Arita
- `nationalPokedexNumbers:25` — All Pikachu cards

## 🇬🇧 UK Card Wiki

The built-in Wiki covers every English-language Pokémon TCG set released in the UK, grouped into **10 eras**:

| Era | Period | Sets |
|-----|--------|------|
| Original (WOTC) | 1999 – 2003 | Base Set, Jungle, Fossil, Team Rocket, Neo, e-Card … |
| EX Series | 2003 – 2007 | Ruby & Sapphire through Power Keepers |
| Diamond & Pearl | 2007 – 2009 | DP1 through Stormfront |
| Platinum | 2009 – 2010 | Platinum through Arceus |
| HeartGold & SoulSilver | 2010 – 2011 | HGSS through Call of Legends |
| Black & White | 2011 – 2013 | BW through Legendary Treasures |
| XY | 2014 – 2016 | XY through Evolutions |
| Sun & Moon | 2017 – 2019 | SM through Cosmic Eclipse |
| Sword & Shield | 2020 – 2023 | SwSh through Crown Zenith |
| Scarlet & Violet | 2023 – 2025 | SV through Destined Rivals |
| Mega Evolution | 2025 – present | The newest era |

Features: timeline view, table view, search, era filtering, quick navigation, and direct links to browse cards from any set.

## 🔒 Security

- No API keys required for basic usage (pokemontcg.io free tier)
- All API communication over HTTPS
- User input sanitised before API queries
- React's built-in XSS protection
- No user data collected or stored
- External links use `rel="noopener noreferrer"`

### Using an API Key (Optional)

For higher rate limits, [register for a free key](https://dev.pokemontcg.io/) and add it to `src/services/api.ts`:

```typescript
headers: { 'X-Api-Key': 'your-key-here' }
```

> ⚠️ Never commit API keys. Use environment variables in production.

## 📈 Performance

- **Dual-layer Caching**: Memory + sessionStorage with 5-minute TTL
- **Lazy Loading**: Images use native `loading="lazy"`
- **Skeleton Loaders**: Visual feedback during API calls
- **Scroll-to-top**: Route changes auto-scroll; back-to-top button on long pages
- **Single File Output**: Vite bundles to a single HTML file for instant deployment

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

```bash
# Quick start
git checkout -b feature/my-feature
# Make changes, test, then…
git commit -m "feat: add my feature"
git push origin feature/my-feature
# Open a Pull Request
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| API rate limiting (429) | Wait a few seconds, or [register for an API key](https://dev.pokemontcg.io/) |
| Build fails | Run `rm -rf node_modules && npm install && npm run build` |
| Images not loading | Check internet connection; ensure no ad blockers interfere |
| Blank page | Clear browser cache; check browser console for errors |

## 📜 License

Released under the [MIT License](./LICENSE).

## 🙏 Credits

- Card data & images from [Pokémon TCG API](https://pokemontcg.io)
- Icons by [Lucide](https://lucide.dev)

---

<p align="center">
  <sub>
    Pokémon and all related names are trademarks of Nintendo, Game Freak & The Pokémon Company.<br/>
    This is an unofficial, non-commercial fan project.
  </sub>
</p>
