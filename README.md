# PokeGuru

A fast, open Pokémon TCG card database.

It's a zero-build static site (plain HTML/CSS/JS) that talks directly to the
public [Pokémon TCG API](https://pokemontcg.io), so it deploys cleanly to GitHub Pages.

## Features

- 🔎 **Search** cards by name, or use field queries like `subtypes:mega`, `types:dragon`, `rarity:"Rare Holo"`
- 📷 **Scan a card** — point your camera (or upload a photo) and PokeGuru reads the card's name & collector number with on-device OCR, then jumps straight to the matching card
- 🃏 **Browse by set** — every official set, newest first
- 📄 **Card detail pages** — artwork, attacks, abilities, weaknesses/resistances, Pokédex data and TCGplayer market prices
- 🏷️ Type & sort filters, with pagination
- 📱 Responsive dark theme, fast hash-based routing (no server needed)

## Run locally

Because the app uses `fetch`, open it through a local server (not `file://`):

```bash
# Python
python3 -m http.server 8000
# then visit http://localhost:8000

# or with Node
npx serve .
```

## Deploy to GitHub Pages

### Option A — Actions (recommended)
1. Push these files to the `main` branch.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) publishes the site on every push.
4. Your site will be live at `https://<your-username>.github.io/<your-repo>/`.

### Option B — Deploy from branch
1. **Settings → Pages → Source: Deploy from a branch**, pick `main` / `root`.
2. The `.nojekyll` file ensures all assets are served as-is.

## API key (optional)

The site works anonymously with the API's default rate limits. For higher limits,
grab a free key at [dev.pokemontcg.io](https://dev.pokemontcg.io) and paste it into
the `API_KEY` constant near the top of [`app.js`](./app.js).

> ⚠️ Anything in client-side JS is public. Only use a personal, low-stakes key here.

## Card scanner

The **📷 Scan** page uses your device camera (or an uploaded photo) and reads the
card with [Tesseract.js](https://tesseract.projectnaptha.com/) OCR — entirely in
the browser, so no images leave your device. It extracts the card **name** and
**collector number** (e.g. `4/102`) and queries the API:

1. **name + number** → usually a single exact match, opens the card directly
2. **name only** → opens the best match
3. **number only** → last-resort fallback

It always **auto-opens the best match**, even when OCR is borderline. If other
plausible prints exist, the opened card shows a small "Not the right one? See N
other matches" banner so you can switch with one tap.

**Scan history:** your recent scans are saved locally (in your browser, via
`localStorage`) and listed on the Scan page for quick re-access. Nothing is sent
to a server, and you can clear it anytime with the **Clear** button.

Best results come from a flat, well-lit card that fills the frame. OCR isn't
perfect with heavy holo glare or full-art cards.

> Camera access requires HTTPS (GitHub Pages provides this automatically) or
> `localhost`.

## Tech

- Vanilla JS single-page app, hash routing
- OCR via Tesseract.js (loaded from CDN)
- No build step
- Data & images: [pokemontcg.io](https://pokemontcg.io)

## License

Released under the [MIT License](./LICENSE).

## Credits

Pokémon and all related names are trademarks of Nintendo, Game Freak and
The Pokémon Company. This is an unofficial, non-commercial fan project.
