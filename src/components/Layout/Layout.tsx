import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import MobileNav from './MobileNav';
import ScrollToTop from '../UI/ScrollToTop';
import BackToTop from '../UI/BackToTop';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <ScrollToTop />
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-[1180px] flex-1 px-4 py-7 animate-fade-in md:px-6 pb-24 sm:pb-7 outline-none"
      >
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
      <BackToTop />
    </div>
  );
}
