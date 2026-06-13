/* PokeGuru — a fast, open Pokémon card database. */

const API = "https://api.pokemontcg.io/v2";
const API_KEY = "";
const cache = new Map();
const app = document.getElementById("app");

/* ---------- helpers ---------- */

function headers() {
  return API_KEY ? { "X-Api-Key": API_KEY } : {};
}

async function apiGet(path) {
  if (cache.has(path)) return cache.get(path);
  const res = await fetch(`${API}${path}`, { headers: headers() });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  cache.set(path, data);
  return data;
}

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function setLoading(msg = "Loading…", type = "spinner") {
  if (type === "grid") {
    app.innerHTML = `
      <div class="skeleton-grid">
        ${Array(12).fill('<div class="skeleton-card"></div>').join("")}
      </div>`;
  } else {
    app.innerHTML = `
      <div class="loading">
        <div class="loading-spinner"></div>
        <span>${esc(msg)}</span>
      </div>`;
  }
  // Restart the fadeIn animation on every new view
  app.style.animation = "none";
  app.offsetHeight; // trigger reflow
  app.style.animation = null;
}

function showError(msg) {
  app.innerHTML = `<div class="error">⚠️ ${esc(msg)}</div>`;
}

function cardTile(card) {
  const img = card.images?.small || card.images?.large || "";
  const sub = [card.set?.name, card.number ? `#${card.number}` : ""]
    .filter(Boolean)
    .join(" · ");
  return `
    <a class="card-tile" href="#/card/${esc(card.id)}">
      <img loading="lazy" src="${esc(img)}" alt="${esc(card.name)}" />
      <div class="card-meta">
        <div class="card-name">${esc(card.name)}</div>
        <div class="card-sub">${esc(sub)}</div>
      </div>
    </a>`;
}

function cardGrid(cards) {
  if (!cards.length) return `<div class="empty">No cards found.</div>`;
  return `<div class="card-grid">${cards.map(cardTile).join("")}</div>`;
}

function pagination(page, totalCount, pageSize, hrefFor) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  if (totalPages <= 1) return "";
  const prevDisabled = page <= 1 ? "disabled" : "";
  const nextDisabled = page >= totalPages ? "disabled" : "";
  return `
    <div class="pagination">
      <button ${prevDisabled} onclick="location.hash='${hrefFor(page - 1)}'">← Prev</button>
      <span class="page-info">Page ${page} of ${totalPages}</span>
      <button ${nextDisabled} onclick="location.hash='${hrefFor(page + 1)}'">Next →</button>
    </div>`;
}

/* ---------- views ---------- */

async function viewHome() {
  setLoading();
  let featured = [];
  try {
    const data = await apiGet(
      "/cards?q=supertype:pokemon%20rarity:%22Rare%20Holo%22&pageSize=12&orderBy=-set.releaseDate"
    );
    featured = data.data || [];
  } catch (e) {
    featured = [];
  }

  app.innerHTML = `
    <section class="hero">
      <h1>The Ultimate <span class="accent">Pokémon</span> Card Database</h1>
      <p class="tagline">Search every card, browse by set, and dig into the details.</p>
      <form class="hero-search" id="hero-search">
        <input type="search" id="hero-search-input" placeholder='Try "venusaur" or "subtypes:mega"' autocomplete="off" />
        <button type="submit">Search</button>
      </form>
      <p class="hints">
        Try
        <a href="#/search?q=charizard">charizard</a> ·
        <a href="#/search?q=subtypes:mega">subtypes:mega</a> ·
        <a href="#/search?q=types:dragon">types:dragon</a>
      </p>
    </section>

    <div class="section-title"><h2>Fresh holos</h2></div>
    ${cardGrid(featured)}
  `;

  const form = document.getElementById("hero-search");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = document.getElementById("hero-search-input").value.trim();
    if (q) location.hash = `#/search?q=${encodeURIComponent(q)}`;
  });
}

/* Build an API query string from the user's search box input.
 * If the user types a Lucene-style query (contains a colon) we pass it through.
 * Otherwise we treat it as a name search. */
function buildQuery(raw) {
  const q = raw.trim();
  if (!q) return "";
  if (/[a-zA-Z.]+:/.test(q)) return q; // looks like a field query
  return `name:"${q.replace(/"/g, "")}*"`;
}

async function viewSearch(params) {
  const raw = params.get("q") || "";
  const page = parseInt(params.get("page") || "1", 10);
  const type = params.get("type") || "";
  const sort = params.get("sort") || "";
  const pageSize = 24;

  document.getElementById("header-search-input").value = raw;
  document.getElementById("hero-search-input")?.setAttribute("value", raw);

  setLoading(`Searching for "${raw}"…`, "grid");

  let qParts = [buildQuery(raw)].filter(Boolean);
  if (type) qParts.push(`types:${type}`);
  const q = qParts.join(" ") || "supertype:pokemon";

  let order = "name";
  if (sort === "newest") order = "-set.releaseDate";
  else if (sort === "oldest") order = "set.releaseDate";
  else if (sort === "name") order = "name";

  try {
    const data = await apiGet(
      `/cards?q=${encodeURIComponent(q)}&page=${page}&pageSize=${pageSize}&orderBy=${order}`
    );
    const cards = data.data || [];
    const total = data.totalCount || cards.length;

    const baseHref = (p) => {
      const sp = new URLSearchParams();
      if (raw) sp.set("q", raw);
      if (type) sp.set("type", type);
      if (sort) sp.set("sort", sort);
      sp.set("page", p);
      return `#/search?${sp.toString()}`;
    };

    const types = ["", "Colorless","Darkness","Dragon","Fairy","Fighting","Fire","Grass","Lightning","Metal","Psychic","Water"];

    app.innerHTML = `
      <div class="section-title">
        <h2>Results for "${esc(raw)}"</h2>
        <span class="count">${total.toLocaleString()} card${total === 1 ? "" : "s"}</span>
      </div>
      <div class="filters">
        <select id="filter-type">
          ${types.map(t => `<option value="${t}" ${t===type?"selected":""}>${t?`Type: ${t}`:"All types"}</option>`).join("")}
        </select>
        <select id="filter-sort">
          <option value="" ${sort===""?"selected":""}>Sort: Name (A–Z)</option>
          <option value="newest" ${sort==="newest"?"selected":""}>Sort: Newest sets</option>
          <option value="oldest" ${sort==="oldest"?"selected":""}>Sort: Oldest sets</option>
        </select>
      </div>
      ${cardGrid(cards)}
      ${pagination(page, total, pageSize, baseHref)}
    `;

    const apply = () => {
      const sp = new URLSearchParams();
      if (raw) sp.set("q", raw);
      const t = document.getElementById("filter-type").value;
      const s = document.getElementById("filter-sort").value;
      if (t) sp.set("type", t);
      if (s) sp.set("sort", s);
      sp.set("page", "1");
      location.hash = `#/search?${sp.toString()}`;
    };
    document.getElementById("filter-type").addEventListener("change", apply);
    document.getElementById("filter-sort").addEventListener("change", apply);
  } catch (e) {
    showError("Couldn't load search results. The API may be rate-limited — try again in a moment.");
  }
}

async function viewSets() {
  setLoading("Loading sets…");
  try {
    const data = await apiGet("/sets?orderBy=-releaseDate&pageSize=250");
    const sets = data.data || [];
    app.innerHTML = `
      <div class="section-title">
        <h2>Browse by Set</h2>
        <span class="count">${sets.length} sets</span>
      </div>
      <div class="set-grid">
        ${sets.map(s => `
          <a class="set-tile" href="#/set/${esc(s.id)}">
            ${s.images?.logo ? `<img class="set-logo" loading="lazy" src="${esc(s.images.logo)}" alt="${esc(s.name)}" />` : ""}
            <div class="set-info">
              <div class="set-name">${esc(s.name)}</div>
              <div class="set-sub">${esc(s.series)} · ${esc(s.releaseDate || "")} · ${s.total || s.printedTotal || "?"} cards</div>
            </div>
          </a>`).join("")}
      </div>
    `;
  } catch (e) {
    showError("Couldn't load sets. Try again in a moment.");
  }
}

async function viewSet(id, params) {
  const page = parseInt(params.get("page") || "1", 10);
  const pageSize = 36;
  setLoading("Loading set…", "grid");
  try {
    const [setData, cardsData] = await Promise.all([
      apiGet(`/sets/${encodeURIComponent(id)}`),
      apiGet(`/cards?q=set.id:${encodeURIComponent(id)}&page=${page}&pageSize=${pageSize}&orderBy=number`)
    ]);
    const set = setData.data;
    const cards = cardsData.data || [];
    const total = cardsData.totalCount || cards.length;

    app.innerHTML = `
      <a class="back-link" href="#/sets">← All sets</a>
      <div class="section-title">
        <h2>${set.images?.logo ? `<img class="set-logo" src="${esc(set.images.logo)}" alt="" style="height:40px;width:auto;vertical-align:middle;margin-right:8px;" />` : ""}${esc(set.name)}</h2>
        <span class="count">${esc(set.series)} · ${esc(set.releaseDate || "")} · ${total} cards</span>
      </div>
      ${cardGrid(cards)}
      ${pagination(page, total, pageSize, (p) => `#/set/${id}?page=${p}`)}
    `;
  } catch (e) {
    showError("Couldn't load this set.");
  }
}

async function viewCard(id) {
  setLoading("Loading card…");
  try {
    const data = await apiGet(`/cards/${encodeURIComponent(id)}`);
    const c = data.data;
    const img = c.images?.large || c.images?.small || "";

    // If we arrived here from a borderline scan with other candidates, offer them.
    let scanBanner = "";
    try {
      const last = JSON.parse(localStorage.getItem(LAST_SCAN_KEY) || "null");
      if (last && last.bestId === id && last.others > 1) {
        scanBanner = `
          <div class="scan-banner">
            📷 Opened the best scan match.
            <a href="#/search?q=${encodeURIComponent(last.query)}">Not the right one? See ${last.others - 1} other match${last.others - 1 === 1 ? "" : "es"} →</a>
          </div>`;
      }
    } catch (e) {
      /* ignore */
    }

    const badges = [];
    if (c.supertype) badges.push(`<span class="badge"><strong>${esc(c.supertype)}</strong></span>`);
    (c.subtypes || []).forEach(s => badges.push(`<span class="badge">${esc(s)}</span>`));
    if (c.rarity) badges.push(`<span class="badge">Rarity: <strong>${esc(c.rarity)}</strong></span>`);
    if (c.hp) badges.push(`<span class="badge">HP: <strong>${esc(c.hp)}</strong></span>`);
    (c.types || []).forEach(t => badges.push(`<span class="badge">${esc(t)}</span>`));

    const attacks = (c.attacks || []).map(a => `
      <div class="attack">
        <div class="attack-head">
          <span class="attack-name">${esc(a.name)}${a.damage ? ` — ${esc(a.damage)}` : ""}</span>
          <span class="attack-cost">${esc((a.cost || []).join(" "))}</span>
        </div>
        ${a.text ? `<div class="attack-text">${esc(a.text)}</div>` : ""}
      </div>`).join("");

    const abilities = (c.abilities || []).map(a => `
      <div class="attack">
        <div class="attack-head"><span class="attack-name">${esc(a.type)}: ${esc(a.name)}</span></div>
        ${a.text ? `<div class="attack-text">${esc(a.text)}</div>` : ""}
      </div>`).join("");

    const weak = (c.weaknesses || []).map(w => `${esc(w.type)} ${esc(w.value)}`).join(", ");
    const resist = (c.resistances || []).map(w => `${esc(w.type)} ${esc(w.value)}`).join(", ");

    // Prices (TCGplayer)
    let priceBlock = "";
    const tp = c.tcgplayer?.prices;
    if (tp) {
      const rows = Object.entries(tp).map(([variant, p]) => `
        <tr>
          <td>${esc(variant)}</td>
          <td>${p.low != null ? "$" + p.low : "—"}</td>
          <td>${p.market != null ? "$" + p.market : "—"}</td>
          <td>${p.high != null ? "$" + p.high : "—"}</td>
        </tr>`).join("");
      priceBlock = `
        <div class="info-block">
          <h3>Market Prices${c.tcgplayer?.url ? ` · <a href="${esc(c.tcgplayer.url)}" target="_blank" rel="noopener">TCGplayer</a>` : ""}</h3>
          <table class="price-table">
            <thead><tr><th>Variant</th><th>Low</th><th>Market</th><th>High</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>`;
    }

    app.innerHTML = `
      <a class="back-link" href="javascript:history.back()">← Back</a>
      ${scanBanner}
      <div class="detail">
        <div class="detail-img"><img src="${esc(img)}" alt="${esc(c.name)}" /></div>
        <div class="detail-info">
          <h1>${esc(c.name)}</h1>
          <p class="subtitle">
            <a href="#/set/${esc(c.set?.id)}">${esc(c.set?.name)}</a>
            · #${esc(c.number)}/${esc(c.set?.printedTotal || c.set?.total || "?")}
            ${c.artist ? ` · Illus. ${esc(c.artist)}` : ""}
          </p>
          <div class="badges">${badges.join("")}</div>

          ${abilities ? `<div class="info-block"><h3>Abilities</h3>${abilities}</div>` : ""}
          ${attacks ? `<div class="info-block"><h3>Attacks</h3>${attacks}</div>` : ""}

          <div class="info-block">
            <h3>Details</h3>
            <dl class="kv">
              ${c.set?.releaseDate ? `<dt>Released</dt><dd>${esc(c.set.releaseDate)}</dd>` : ""}
              ${weak ? `<dt>Weakness</dt><dd>${weak}</dd>` : ""}
              ${resist ? `<dt>Resistance</dt><dd>${resist}</dd>` : ""}
              ${c.retreatCost ? `<dt>Retreat</dt><dd>${c.retreatCost.length}</dd>` : ""}
              ${c.nationalPokedexNumbers ? `<dt>Pokédex №</dt><dd>${esc(c.nationalPokedexNumbers.join(", "))}</dd>` : ""}
              ${c.rarity ? `<dt>Rarity</dt><dd>${esc(c.rarity)}</dd>` : ""}
            </dl>
          </div>

          ${priceBlock}
        </div>
      </div>
    `;
  } catch (e) {
    showError("Couldn't load this card.");
  }
}

/* ---------- card scanner ---------- */

// Module-scope handle so we can stop the camera when leaving the view.
let scanStream = null;

const SCAN_HISTORY_KEY = "pokeguru:scan-history";
const LAST_SCAN_KEY = "pokeguru:last-scan";

function getScanHistory() {
  try {
    return JSON.parse(localStorage.getItem(SCAN_HISTORY_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function addScanHistory(card) {
  if (!card) return;
  const entry = {
    id: card.id,
    name: card.name,
    img: card.images?.small || card.images?.large || "",
    set: card.set?.name || "",
    number: card.number || "",
    ts: Date.now(),
  };
  let hist = getScanHistory().filter((h) => h.id !== entry.id);
  hist.unshift(entry);
  hist = hist.slice(0, 12);
  try {
    localStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(hist));
  } catch (e) {
    /* storage full / unavailable — ignore */
  }
}

function clearScanHistory() {
  try {
    localStorage.removeItem(SCAN_HISTORY_KEY);
  } catch (e) {
    /* ignore */
  }
}

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function renderHistoryHTML() {
  const hist = getScanHistory();
  if (!hist.length) return "";
  return `
    <div class="section-title" style="margin-top:34px;">
      <h2>Recent scans</h2>
      <button id="clear-history" class="btn btn-ghost" style="padding:6px 14px;">Clear</button>
    </div>
    <div class="card-grid">
      ${hist
        .map(
          (h) => `
        <a class="card-tile" href="#/card/${esc(h.id)}">
          <img loading="lazy" src="${esc(h.img)}" alt="${esc(h.name)}" />
          <div class="card-meta">
            <div class="card-name">${esc(h.name)}</div>
            <div class="card-sub">${esc(h.set)}${h.number ? ` · #${esc(h.number)}` : ""} · ${esc(timeAgo(h.ts))}</div>
          </div>
        </a>`
        )
        .join("")}
    </div>`;
}

function stopScanStream() {
  if (scanStream) {
    scanStream.getTracks().forEach((t) => t.stop());
    scanStream = null;
  }
}

/* Pull a likely card name + collector number out of raw OCR text.
 * Pokémon cards print the name large at the top, and a "12/102"-style
 * collector number small at the bottom. We use both to pin the exact card. */
function parseScanText(text) {
  const rawLines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // Collector number like "012/102", "12/102", "TG05/TG30", "SV049"
  let number = null;
  const numRe = /\b([A-Z]{0,3}\d{1,3})\s*\/\s*([A-Z]{0,3}\d{1,3})\b/;
  for (const l of rawLines) {
    const m = l.toUpperCase().match(numRe);
    if (m) { number = m[1].replace(/^0+(?=\d)/, ""); break; }
  }

  // Name: prefer an early line that's mostly letters and not boilerplate.
  const noise = /(BASIC|STAGE|EVOLVES|ENERGY|TRAINER|ABILITY|POK[EÉ]MON|HP|WEAKNESS|RESISTANCE|RETREAT|ILLUS|\d{4})/i;
  let name = "";
  for (const l of rawLines.slice(0, 6)) {
    const cleaned = l.replace(/[^A-Za-z'.\- ]/g, "").trim();
    const letters = (cleaned.match(/[A-Za-z]/g) || []).length;
    if (letters >= 3 && !noise.test(cleaned) && cleaned.length <= 24) {
      name = cleaned;
      break;
    }
  }
  // Fallback: longest plausible alphabetic token group
  if (!name) {
    const cand = rawLines
      .map((l) => l.replace(/[^A-Za-z'.\- ]/g, "").trim())
      .filter((l) => (l.match(/[A-Za-z]/g) || []).length >= 3 && !noise.test(l))
      .sort((a, b) => b.length - a.length)[0];
    name = cand || "";
  }
  // Take just the first 1–2 words of the name (e.g. "Dark Charizard")
  if (name) name = name.split(/\s+/).slice(0, 2).join(" ");

  return { name, number };
}

async function lookupScan(name, number, statusEl) {
  const setStatus = (m) => { if (statusEl) statusEl.textContent = m; };

  // Strategy 1: name + exact number → almost always a single card.
  if (name && number) {
    setStatus(`Matching “${name}” #${number}…`);
    try {
      const q = `name:"${name}*" number:${number}`;
      const data = await apiGet(`/cards?q=${encodeURIComponent(q)}&pageSize=12&orderBy=-set.releaseDate`);
      if (data.data && data.data.length) return data.data;
    } catch (e) { /* fall through */ }
  }
  // Strategy 2: name only.
  if (name) {
    setStatus(`Searching for “${name}”…`);
    try {
      const data = await apiGet(`/cards?q=${encodeURIComponent(`name:"${name}*"`)}&pageSize=24&orderBy=-set.releaseDate`);
      if (data.data && data.data.length) return data.data;
    } catch (e) { /* fall through */ }
  }
  // Strategy 3: number only (last resort).
  if (number) {
    setStatus(`Looking up cards numbered #${number}…`);
    try {
      const data = await apiGet(`/cards?q=${encodeURIComponent(`number:${number}`)}&pageSize=24&orderBy=-set.releaseDate`);
      if (data.data && data.data.length) return data.data;
    } catch (e) { /* fall through */ }
  }
  return [];
}

async function processScanImage(source, statusEl, resultEl) {
  const setStatus = (m) => { if (statusEl) statusEl.textContent = m; };
  resultEl.innerHTML = "";
  setStatus("Reading the card…");

  if (typeof Tesseract === "undefined") {
    setStatus("");
    resultEl.innerHTML = `<div class="error">The OCR engine couldn't load. Please check your connection.</div>`;
    return;
  }

  let text = "";
  try {
    const { data } = await Tesseract.recognize(source, "eng");
    text = data.text || "";
  } catch (e) {
    setStatus("");
    resultEl.innerHTML = `<div class="error">Couldn't read the image. Try a clearer, well-lit photo.</div>`;
    return;
  }

  const { name, number } = parseScanText(text);

  if (!name && !number) {
    setStatus("");
    resultEl.innerHTML = `
      <div class="empty">
        Couldn't make out a card name or number. Try again with the card
        filling the frame, in good light and in focus — or
        <a href="#/search">search by hand</a>.
      </div>`;
    return;
  }

  const cards = await lookupScan(name, number, statusEl);

  if (!cards.length) {
    setStatus("");
    resultEl.innerHTML = `
      <div class="empty">
        I read ${name ? `“<strong>${esc(name)}</strong>”` : ""}${name && number ? " " : ""}${number ? `(#${esc(number)})` : ""}
        but found no match. <a href="#/search?q=${encodeURIComponent(name || number)}">Search it manually</a>.
      </div>`;
    return;
  }

  // Auto-open the single best match, even when OCR is borderline.
  const best = cards[0];
  addScanHistory(best);

  // If there were other plausible prints, stash them so the card page can
  // offer a quick "see other matches" banner.
  if (cards.length > 1) {
    try {
      localStorage.setItem(
        LAST_SCAN_KEY,
        JSON.stringify({
          query: name || number || "",
          bestId: best.id,
          others: cards.length,
          ts: Date.now(),
        })
      );
    } catch (e) {
      /* ignore */
    }
  } else {
    try {
      localStorage.removeItem(LAST_SCAN_KEY);
    } catch (e) {
      /* ignore */
    }
  }

  setStatus(
    cards.length > 1
      ? `Best match: “${best.name}” — opening… (${cards.length - 1} other${cards.length - 1 === 1 ? "" : "s"} available)`
      : "Match found! Opening…"
  );
  location.hash = `#/card/${best.id}`;
}

async function viewScan() {
  stopScanStream();
  app.innerHTML = `
    <div class="section-title"><h2>📷 Card Scanner</h2></div>
    <p class="scan-intro">
      Point your camera at a Pokémon card (or upload a photo) and PokeGuru will
      read its name &amp; number and take you straight to it.
    </p>

    <div class="scanner">
      <div class="scan-stage">
        <video id="scan-video" playsinline muted></video>
        <div class="scan-frame" aria-hidden="true"></div>
        <canvas id="scan-canvas" hidden></canvas>
      </div>

      <div class="scan-controls">
        <button id="scan-start" class="btn">Start camera</button>
        <button id="scan-capture" class="btn btn-primary" disabled>Capture &amp; scan</button>
        <label class="btn btn-ghost" for="scan-file">Upload photo</label>
        <input id="scan-file" type="file" accept="image/*" capture="environment" hidden />
      </div>

      <p id="scan-status" class="scan-status"></p>
      <div id="scan-result"></div>
    </div>

    <p class="hints" style="margin-top:20px;">
      Tip: fill the frame with the card, keep it flat and well-lit. Reading happens
      entirely on your device — no images are uploaded.
    </p>

    <div id="scan-history">${renderHistoryHTML()}</div>
  `;

  const video = document.getElementById("scan-video");
  const canvas = document.getElementById("scan-canvas");
  const startBtn = document.getElementById("scan-start");
  const captureBtn = document.getElementById("scan-capture");
  const fileInput = document.getElementById("scan-file");
  const statusEl = document.getElementById("scan-status");
  const resultEl = document.getElementById("scan-result");

  startBtn.addEventListener("click", async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      statusEl.textContent = "Camera not available here — use “Upload photo” instead.";
      return;
    }
    statusEl.textContent = "Requesting camera…";
    try {
      scanStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      video.srcObject = scanStream;
      await video.play();
      statusEl.textContent = "Camera ready — line up the card and tap “Capture & scan”.";
      captureBtn.disabled = false;
      startBtn.textContent = "Restart camera";
    } catch (e) {
      statusEl.textContent = "Couldn't access the camera. You can still upload a photo.";
    }
  });

  captureBtn.addEventListener("click", () => {
    if (!scanStream) return;
    const w = video.videoWidth, h = video.videoHeight;
    if (!w || !h) return;
    captureBtn.disabled = true;
    startBtn.disabled = true;
    canvas.width = w; canvas.height = h;
    canvas.getContext("2d").drawImage(video, 0, 0, w, h);
    canvas.toBlob((blob) => {
      if (blob) {
        processScanImage(blob, statusEl, resultEl).finally(() => {
          captureBtn.disabled = false;
          startBtn.disabled = false;
        });
      } else {
        captureBtn.disabled = false;
        startBtn.disabled = false;
      }
    }, "image/jpeg", 0.95);
  });

  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (file) {
      captureBtn.disabled = true;
      startBtn.disabled = true;
      processScanImage(file, statusEl, resultEl).finally(() => {
        captureBtn.disabled = false;
        startBtn.disabled = false;
      });
    }
  });

  const wireClear = () => {
    const clearBtn = document.getElementById("clear-history");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        clearScanHistory();
        document.getElementById("scan-history").innerHTML = "";
      });
    }
  };
  wireClear();
}

/* ---------- router ---------- */

function parseHash() {
  let hash = location.hash.replace(/^#\/?/, ""); // strip "#/"
  const [path, query] = hash.split("?");
  const segments = path.split("/").filter(Boolean);
  const params = new URLSearchParams(query || "");
  return { segments, params };
}

function router() {
  const { segments, params } = parseHash();
  window.scrollTo(0, 0);

  // Always release the camera unless we're entering the scanner.
  if (segments[0] !== "scan") stopScanStream();

  if (segments.length === 0) return viewHome();
  switch (segments[0]) {
    case "search": return viewSearch(params);
    case "sets": return viewSets();
    case "set": return viewSet(segments[1], params);
    case "card": return viewCard(segments.slice(1).join("/"));
    case "scan": return viewScan();
    default: return viewHome();
  }
}

/* ---------- init ---------- */

document.getElementById("header-search").addEventListener("submit", (e) => {
  e.preventDefault();
  const q = document.getElementById("header-search-input").value.trim();
  if (q) location.hash = `#/search?q=${encodeURIComponent(q)}`;
});

window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", router);
router();
