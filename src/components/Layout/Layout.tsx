import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from '../UI/ScrollToTop';
import BackToTop from '../UI/BackToTop';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main className="mx-auto w-full max-w-[1180px] flex-1 px-4 py-7 animate-fade-in md:px-6">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
