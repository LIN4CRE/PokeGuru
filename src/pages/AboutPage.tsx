import { Book, Search, Layers, Github, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl pb-12">
      {/* Hero Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">
          About <span className="text-[var(--accent)]">PokeGuru</span>
        </h1>
        <p className="mt-4 text-lg text-[var(--muted)]">
          A fast, modern, and open Pokémon TCG card database built for collectors.
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-[1fr_300px]">
        <div className="space-y-8">
          {/* Mission */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">The Project</h2>
            <p className="text-[var(--text)] leading-relaxed">
              PokeGuru was created to provide a streamlined, high-performance interface for searching and browsing Pokémon cards.
              Whether you're looking for the latest Scarlet & Violet chase cards or researching vintage Base Set holographic cards,
              our goal is to get you the data you need without the bloat.
            </p>
          </section>

          {/* Features */}
          <section>
            <h2 className="mb-6 text-2xl font-bold">Key Features</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
                <Zap size={24} className="mb-3 text-yellow-400" />
                <h3 className="font-semibold">Fast & Lightweight</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">Built with Vite 7 and React 19 for near-instant load times and smooth transitions.</p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
                <Search size={24} className="mb-3 text-blue-400" />
                <h3 className="font-semibold">Advanced Search</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">Full support for Lucene-style queries to find exactly the cards you need.</p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
                <Book size={24} className="mb-3 text-[var(--accent)]" />
                <h3 className="font-semibold">UK Card Wiki</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">A comprehensive database of every English-language set released in the UK since 1999.</p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
                <ShieldCheck size={24} className="mb-3 text-green-400" />
                <h3 className="font-semibold">Privacy Focused</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">No trackers, no ads, and no user data collection. Just pure Pokémon data.</p>
              </div>
            </div>
          </section>

          {/* Search Tags Documentation */}
          <section id="tags">
            <h2 className="mb-4 text-2xl font-bold text-[var(--accent-2)]">Search Tags</h2>
            <p className="mb-4 text-[var(--muted)]">
              Master the search engine using field tags. Use the format <code className="rounded bg-[var(--bg-soft)] px-1 text-[var(--accent)]">field:value</code>.
            </p>
            <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[var(--bg-soft)] text-[var(--muted)]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Tag</th>
                    <th className="px-4 py-3 font-semibold">Description</th>
                    <th className="px-4 py-3 font-semibold">Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  <tr>
                    <td className="px-4 py-3 font-mono text-[var(--link)]">name:</td>
                    <td className="px-4 py-3">Search by specific name</td>
                    <td className="px-4 py-3"><code>name:pikachu</code></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-[var(--link)]">types:</td>
                    <td className="px-4 py-3">Filter by energy type</td>
                    <td className="px-4 py-3"><code>types:fire</code></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-[var(--link)]">subtypes:</td>
                    <td className="px-4 py-3">Filter by stage or card type</td>
                    <td className="px-4 py-3"><code>subtypes:vmax</code></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-[var(--link)]">supertype:</td>
                    <td className="px-4 py-3">Filter by Card, Energy, or Trainer</td>
                    <td className="px-4 py-3"><code>supertype:trainer</code></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-[var(--link)]">rarity:</td>
                    <td className="px-4 py-3">Filter by card rarity</td>
                    <td className="px-4 py-3"><code>rarity:"Rare Holo"</code></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-[var(--link)]">set.name:</td>
                    <td className="px-4 py-3">Filter by expansion name</td>
                    <td className="px-4 py-3"><code>set.name:evolutions</code></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-[var(--link)]">hp:</td>
                    <td className="px-4 py-3">Search by HP value or range</td>
                    <td className="px-4 py-3"><code>hp:[150 TO *]</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-soft)] p-6">
            <h3 className="mb-4 text-lg font-bold">Project Info</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-[var(--muted)]">Version</span>
                <span className="font-mono font-medium text-[var(--text)]">1.0.0</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-[var(--muted)]">Status</span>
                <span className="flex items-center gap-1.5 font-medium text-green-400">
                  <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  Live
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-[var(--muted)]">License</span>
                <span className="font-medium text-[var(--text)]">MIT</span>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-[var(--border)]">
              <a
                href="https://github.com/lin4cre/PokeGuru"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--text)] py-2 text-sm font-semibold text-[var(--bg)] hover:opacity-90 transition-opacity"
              >
                <Github size={18} />
                View on GitHub
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
            <h3 className="mb-3 text-lg font-bold">Credits</h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">
              Special thanks to the Pokémon TCG API for providing the underlying data that makes this project possible.
            </p>
            <a
              href="https://pokemontcg.io"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm font-medium text-[var(--link)] hover:underline"
            >
              pokemontcg.io
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
