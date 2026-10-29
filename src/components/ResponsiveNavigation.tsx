import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { getAllCategories } from '../utilities/toolRegistry';
import { ThemeToggle } from './ThemeToggle';
import { SearchBar } from './SearchBar';

export interface PrimaryNavItem {
  label: string;
  to: string;
}

export const PRIMARY_NAV_LINKS: PrimaryNavItem[] = [
  { label: 'All Tools', to: '/tools' },
  { label: 'Text', to: '/category/text' },
  { label: 'Developer', to: '/category/developer' },
  { label: 'Calculator', to: '/category/calculator' },
  { label: 'About', to: '/about' },
];

export function ResponsiveNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const categories = getAllCategories();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Desktop navigation links (Zone 2 of Top Bar Contract) */}
      <nav
        aria-label="Primary navigation"
        className="hidden md:flex items-center gap-6 text-sm font-medium"
      >
        {PRIMARY_NAV_LINKS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                isActive
                  ? 'border-[var(--accent-primary)] text-[var(--text-primary)] font-semibold'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Zone 3 right controls: Theme toggle + Mobile menu trigger */}
      <div className="flex items-center gap-2.5 shrink-0">
        <ThemeToggle />

        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation-drawer"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="inline-flex md:hidden items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] transition-colors cursor-pointer min-h-[40px] min-w-[40px]"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" aria-hidden="true" />
          ) : (
            <Menu className="w-5 h-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          role="dialog"
          aria-label="Mobile navigation menu"
          className="fixed inset-x-0 top-[65px] z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 pt-4 pb-6 md:hidden max-h-[calc(100vh-65px)] overflow-y-auto"
          style={{ boxShadow: 'var(--shadow-dropdown)' }}
        >
          <div className="mb-4">
            <SearchBar
              placeholder="Search tools..."
              label="Search tools from mobile menu"
            />
          </div>

          <div className="space-y-4">
            <div>
              <p className="px-2 text-xs font-semibold text-[var(--text-muted)] mb-1.5">
                Primary Pages
              </p>
              <ul className="space-y-1">
                <li>
                  <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[var(--accent-soft)] text-[var(--accent-primary)] font-semibold'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]'
                      }`
                    }
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/tools"
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[var(--accent-soft)] text-[var(--accent-primary)] font-semibold'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]'
                      }`
                    }
                  >
                    All Tools Directory
                  </NavLink>
                </li>
              </ul>
            </div>

            <div className="border-t border-[var(--border-subtle)] pt-3">
              <p className="px-2 text-xs font-semibold text-[var(--text-muted)] mb-1.5">
                Tool Categories
              </p>
              <ul className="grid grid-cols-2 gap-1.5">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <NavLink
                      to={cat.route}
                      className={({ isActive }) =>
                        `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-[var(--accent-soft)] text-[var(--accent-primary)] font-semibold'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]'
                        }`
                      }
                    >
                      {cat.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[var(--border-subtle)] pt-3">
              <p className="px-2 text-xs font-semibold text-[var(--text-muted)] mb-1.5">
                Platform & Policies
              </p>
              <div className="flex flex-wrap gap-2 px-2">
                <Link
                  to="/about"
                  className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1"
                >
                  About
                </Link>
                <span aria-hidden="true" className="text-xs text-[var(--text-muted)] py-1">
                  ·
                </span>
                <Link
                  to="/contact"
                  className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1"
                >
                  Contact
                </Link>
                <span aria-hidden="true" className="text-xs text-[var(--text-muted)] py-1">
                  ·
                </span>
                <Link
                  to="/privacy"
                  className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1"
                >
                  Privacy
                </Link>
                <span aria-hidden="true" className="text-xs text-[var(--text-muted)] py-1">
                  ·
                </span>
                <Link
                  to="/terms"
                  className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1"
                >
                  Terms
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
