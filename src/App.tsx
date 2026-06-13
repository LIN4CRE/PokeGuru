import { HashRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/UI/ErrorBoundary';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import CardDetailPage from './pages/CardDetailPage';
import SetsPage from './pages/SetsPage';
import SetDetailPage from './pages/SetDetailPage';
import ScannerPage from './pages/ScannerPage';
import WikiPage from './pages/WikiPage';
import AboutPage from './pages/AboutPage';
import CollectionPage from './pages/CollectionPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * PokeGuru — A fast, open Pokémon TCG card database
 *
 * Built with React 19, TypeScript, and Tailwind CSS 4
 * Data powered by pokemontcg.io API
 */
export default function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="card/:id" element={<CardDetailPage />} />
            <Route path="sets" element={<SetsPage />} />
            <Route path="set/:id" element={<SetDetailPage />} />
            <Route path="wiki" element={<WikiPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="collection" element={<CollectionPage />} />
            <Route path="scanner" element={<ScannerPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  );
}
