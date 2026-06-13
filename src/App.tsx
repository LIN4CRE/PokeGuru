import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/UI/ErrorBoundary';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import CardDetailPage from './pages/CardDetailPage';
import SetsPage from './pages/SetsPage';
import SetDetailPage from './pages/SetDetailPage';
import ScannerPage from './pages/ScannerPage';
import WikiPage from './pages/WikiPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * PokeGuru — A fast, open Pokémon TCG card database
 *
 * Built with React 19, TypeScript, and Tailwind CSS 4
 * Data powered by pokemontcg.io API
 *
 * Features:
 * - Advanced card search with Lucene-style field queries
 * - Browse all official TCG sets
 * - Detailed card info with real-time market prices
 * - 🇬🇧 UK Card Wiki — every English set from Base Set (1999) to today
 * - Card scanner UI (OCR-ready)
 * - Mobile-responsive dark theme
 * - In-memory + sessionStorage API caching
 * - Error boundary for resilient UX
 */
export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="card/:id" element={<CardDetailPage />} />
            <Route path="sets" element={<SetsPage />} />
            <Route path="set/:id" element={<SetDetailPage />} />
            <Route path="wiki" element={<WikiPage />} />
            <Route path="scanner" element={<ScannerPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
