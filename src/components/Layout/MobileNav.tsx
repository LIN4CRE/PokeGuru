import { Link, useLocation } from 'react-router-dom';
import { Home, Wallet, Book, Search, Layers } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function MobileNav() {
  const location = useLocation();

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/collection', icon: Wallet, label: 'Vault' },
    { to: '/wiki', icon: Book, label: 'Wiki' },
    { to: '/sets', icon: Layers, label: 'Sets' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-[var(--border)] bg-[rgba(15,17,21,0.8)] px-2 pb-safe backdrop-blur-xl sm:hidden">
      {navItems.map(({ to, icon: Icon, label }) => {
        const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

        return (
          <Link
            key={to}
            to={to}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1 transition-all active:scale-90",
              isActive ? "text-[var(--accent)]" : "text-[var(--muted)]"
            )}
          >
            <Icon size={20} strokeWidth={isActive ? 3 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
            {isActive && (
              <div className="absolute top-0 h-0.5 w-6 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
