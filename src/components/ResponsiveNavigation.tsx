import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight, Search, Compass, User } from 'lucide-react';
import {
  getAllCategories,
  getToolsByCategory,
} from '../utilities/toolRegistry';
import { ThemeToggle } from './ThemeToggle';
import { SearchBar } from './SearchBar';
import { CategoryIconTile } from './IconResolver';

export function ResponsiveNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  const location = useLocation();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchPopoverRef = useRef<HTMLDivElement>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);
  const categoriesButtonRef = useRef<HTMLButtonElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const categoryItemRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const categories = getAllCategories();
  const isCategoryRouteActive =
    location.pathname.startsWith('/category/') || location.pathname === '/categories';
  const isAboutActive =
    location.pathname === '/about' || location.pathname === '/developer';

  // Close menus on route or query change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
    setQuickSearchOpen(false);
  }, [location.pathname, location.search]);

  // Outside click and Escape key handling with focus restoration
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setCategoriesOpen(false);
      }
      if (searchPopoverRef.current && !searchPopoverRef.current.contains(target)) {
        setQuickSearchOpen(false);
      }
      if (
        mobileMenuOpen &&
        mobileDrawerRef.current &&
        !mobileDrawerRef.current.contains(target) &&
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (categoriesOpen) {
          setCategoriesOpen(false);
          categoriesButtonRef.current?.focus();
        } else if (quickSearchOpen) {
          setQuickSearchOpen(false);
          searchButtonRef.current?.focus();
        } else if (mobileMenuOpen) {
          setMobileMenuOpen(false);
          mobileMenuButtonRef.current?.focus();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [categoriesOpen, quickSearchOpen, mobileMenuOpen]);

  const handleCategoriesKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!categoriesOpen) {
        setCategoriesOpen(true);
        setTimeout(() => categoryItemRefs.current[0]?.focus(), 15);
      } else {
        const activeIdx = categoryItemRefs.current.findIndex(
          (el) => el === document.activeElement
        );
        const nextIdx = activeIdx < categories.length - 1 ? activeIdx + 1 : 0;
        categoryItemRefs.current[nextIdx]?.focus();
      }
    } else if (event.key === 'ArrowUp' && categoriesOpen) {
      event.preventDefault();
      const activeIdx = categoryItemRefs.current.findIndex(
        (el) => el === document.activeElement
      );
      const prevIdx = activeIdx > 0 ? activeIdx - 1 : categories.length - 1;
      categoryItemRefs.current[prevIdx]?.focus();
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative rounded-xl px-3.5 py-2 text-xs lg:text-sm font-medium whitespace-nowrap shrink-0 transition-all duration-150 ${
      isActive
        ? 'bg-[var(--accent-soft)] text-[var(--accent-primary)] font-semibold shadow-2xs'
        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
    }`;

  return (
    <>
      {/* Center Zone: Desktop Navigation Links (Home, All Tools, Categories Dropdown, About) */}
      <nav
        aria-label="Primary navigation"
        className="hidden md:flex items-center gap-1 lg:gap-1.5"
      >
        <NavLink to="/" end className={navLinkClass}>
          Home
        </NavLink>

        <NavLink to="/tools" end className={navLinkClass}>
          All Tools
        </NavLink>

        {/* Accessible Categories Dropdown */}
        <div
          ref={dropdownRef}
          className="relative"
          onKeyDown={handleCategoriesKeyDown}
        >
          <button
            ref={categoriesButtonRef}
            type="button"
            onClick={() => {
              setCategoriesOpen((prev) => !prev);
              setQuickSearchOpen(false);
            }}
            aria-expanded={categoriesOpen}
            aria-haspopup="menu"
            aria-controls="header-categories-menu"
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs lg:text-sm font-medium whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer ${
              categoriesOpen || isCategoryRouteActive
                ? 'bg-[var(--accent-soft)] text-[var(--accent-primary)] font-semibold shadow-2xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
            }`}
          >
            <span>Categories</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                categoriesOpen ? 'rotate-180 text-[var(--accent-primary)]' : ''
              }`}
              aria-hidden="true"
            />
          </button>

          {categoriesOpen && (
            <div
              id="header-categories-menu"
              role="menu"
              aria-label="Tool categories"
              className="liquid-glass-popover absolute left-1/2 -translate-x-1/2 top-full z-50 mt-2.5 w-[520px] max-w-[calc(100vw-2rem)] rounded-2xl p-3.5 animate-enter"
            >
              <div className="mb-2.5 flex items-center justify-between border-b border-[var(--border-subtle)] px-2.5 pb-2.5 pt-0.5">
                <span className="text-xs font-semibold text-[var(--text-muted)]">
                  Browse by Tool Category
                </span>
                <Link
                  to="/categories"
                  onClick={() => setCategoriesOpen(false)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent-primary)] hover:underline"
                >
                  <span>View all categories</span>
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {categories.map((cat, idx) => {
                  const catTools = getToolsByCategory(cat.id);
                  const isCurrentCat = location.pathname === cat.route;

                  return (
                    <Link
                      key={cat.id}
                      ref={(el) => {
                        categoryItemRefs.current[idx] = el;
                      }}
                      to={cat.route}
                      role="menuitem"
                      aria-current={isCurrentCat ? 'page' : undefined}
                      onClick={() => setCategoriesOpen(false)}
                      className={`group flex items-start gap-3 rounded-xl p-2.5 transition-colors ${
                        isCurrentCat
                          ? 'bg-[var(--accent-soft)]'
                          : 'hover:bg-[var(--bg-elevated)]'
                      }`}
                    >
                      <CategoryIconTile
                        icon={cat.icon}
                        category={cat.id}
                        size="sm"
                        className="mt-0.5"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-xs font-semibold transition-colors ${
                              isCurrentCat
                                ? 'text-[var(--accent-primary)]'
                                : 'text-[var(--text-primary)] group-hover:text-[var(--accent-primary)]'
                            }`}
                          >
                            {cat.name}
                          </span>
                          <span
                            aria-hidden="true"
                            className="text-[11px] text-[var(--text-muted)]"
                          >
                            ·
                          </span>
                          <span className="text-[11px] text-[var(--text-muted)] tabular-nums">
                            {catTools.length} {catTools.length === 1 ? 'tool' : 'tools'}
                          </span>
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-[11px] text-[var(--text-secondary)]">
                          {cat.shortDescription}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <NavLink
          to="/about"
          className={() => navLinkClass({ isActive: isAboutActive })}
        >
          About
        </NavLink>
      </nav>

      {/* Right Zone: Search Control, Theme Toggle, Explore Tools CTA, and Mobile Menu Button */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Search Trigger + Accessible Search Popover */}
        <div ref={searchPopoverRef} className="relative">
          <button
            ref={searchButtonRef}
            type="button"
            onClick={() => {
              setQuickSearchOpen((prev) => !prev);
              setCategoriesOpen(false);
              setMobileMenuOpen(false);
            }}
            aria-label={quickSearchOpen ? 'Close search' : 'Search tools'}
            aria-expanded={quickSearchOpen}
            aria-controls="header-quick-search-popover"
            title="Search tools"
            className={`inline-flex items-center justify-center gap-1.5 rounded-full border px-2.5 py-2 text-xs font-medium transition-colors cursor-pointer min-h-[38px] min-w-[38px] ${
              quickSearchOpen || location.pathname === '/search'
                ? 'border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--accent-primary)]'
                : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
            }`}
          >
            <Search className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="hidden xl:inline pr-1 text-xs text-[var(--text-muted)]">
              Search...
            </span>
          </button>

          {quickSearchOpen && (
            <div
              id="header-quick-search-popover"
              role="dialog"
              aria-label="Quick tool search"
              className="liquid-glass-popover fixed inset-x-3 top-[68px] sm:absolute sm:inset-x-auto sm:right-0 sm:top-full z-50 sm:mt-2.5 sm:w-96 rounded-2xl p-3.5 animate-enter"
            >
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-[var(--text-muted)]">
                  Quick Search Tools
                </span>
                <Link
                  to="/search"
                  onClick={() => setQuickSearchOpen(false)}
                  className="text-xs font-semibold text-[var(--accent-primary)] hover:underline"
                >
                  Full Search Page →
                </Link>
              </div>
              <SearchBar
                autoFocus
                placeholder="Search tools by name, category, or task..."
                label="Quick search tools in header"
                onSelectResult={() => setQuickSearchOpen(false)}
              />
            </div>
          )}
        </div>

        {/* Light / Dark Theme Toggle */}
        <ThemeToggle />

        {/* Explore Tools Primary CTA */}
        <Link
          to="/tools"
          className="btn-primary-glass hidden sm:inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold text-white whitespace-nowrap shrink-0 min-h-[38px]"
        >
          <span>Explore Tools</span>
        </Link>

        {/* Mobile Compact Menu Button */}
        <button
          ref={mobileMenuButtonRef}
          type="button"
          onClick={() => {
            setMobileMenuOpen((prev) => !prev);
            setQuickSearchOpen(false);
            setCategoriesOpen(false);
          }}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation-drawer"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className={`inline-flex md:hidden items-center justify-center rounded-full border p-2 transition-colors cursor-pointer min-h-[38px] min-w-[38px] ${
            mobileMenuOpen
              ? 'border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--accent-primary)]'
              : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
          }`}
        >
          {mobileMenuOpen ? (
            <X className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Menu className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Compact Navigation Menu (Constrained to Viewport, Never Overflows) */}
      {mobileMenuOpen && (
        <div
          ref={mobileDrawerRef}
          id="mobile-navigation-drawer"
          role="dialog"
          aria-label="Mobile navigation menu"
          className="liquid-glass-popover fixed inset-x-3 top-[68px] z-50 rounded-2xl p-4 md:hidden max-h-[calc(100dvh-84px)] overflow-y-auto overscroll-contain animate-enter"
        >
          {/* Mobile Search Input */}
          <div className="mb-3.5">
            <SearchBar
              placeholder="Search for a tool..."
              label="Search tools from mobile menu"
              onSelectResult={() => setMobileMenuOpen(false)}
            />
          </div>

          <div className="space-y-4">
            {/* Primary Mobile Navigation Links */}
            <div>
              <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                Navigation
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `flex items-center rounded-xl px-3 py-2.5 text-xs font-semibold min-h-[42px] transition-colors ${
                      isActive
                        ? 'bg-[var(--accent-soft)] text-[var(--accent-primary)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]'
                    }`
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/tools"
                  end
                  className={({ isActive }) =>
                    `flex items-center rounded-xl px-3 py-2.5 text-xs font-semibold min-h-[42px] transition-colors ${
                      isActive
                        ? 'bg-[var(--accent-soft)] text-[var(--accent-primary)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]'
                    }`
                  }
                >
                  All Tools
                </NavLink>
                <NavLink
                  to="/categories"
                  className={({ isActive }) =>
                    `flex items-center rounded-xl px-3 py-2.5 text-xs font-semibold min-h-[42px] transition-colors ${
                      isActive
                        ? 'bg-[var(--accent-soft)] text-[var(--accent-primary)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]'
                    }`
                  }
                >
                  Categories
                </NavLink>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `flex items-center rounded-xl px-3 py-2.5 text-xs font-semibold min-h-[42px] transition-colors ${
                      isActive
                        ? 'bg-[var(--accent-soft)] text-[var(--accent-primary)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]'
                    }`
                  }
                >
                  About
                </NavLink>
                <NavLink
                  to="/developer"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold min-h-[42px] transition-colors ${
                      isActive
                        ? 'bg-[var(--accent-soft)] text-[var(--accent-primary)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]'
                    }`
                  }
                >
                  <User className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">Meet Developer</span>
                </NavLink>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `flex items-center rounded-xl px-3 py-2.5 text-xs font-semibold min-h-[42px] transition-colors ${
                      isActive
                        ? 'bg-[var(--accent-soft)] text-[var(--accent-primary)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]'
                    }`
                  }
                >
                  Contact
                </NavLink>
              </div>
            </div>

            {/* Mobile Tool Categories Grid */}
            <div className="border-t border-[var(--border-subtle)] pt-3">
              <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                Tool Categories
              </p>
              <ul className="grid grid-cols-2 gap-1.5">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <NavLink
                      to={cat.route}
                      className={({ isActive }) =>
                        `flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium min-h-[42px] transition-colors ${
                          isActive
                            ? 'bg-[var(--accent-soft)] text-[var(--accent-primary)] font-semibold'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]'
                        }`
                      }
                    >
                      <CategoryIconTile icon={cat.icon} category={cat.id} size="sm" />
                      <span className="truncate">{cat.shortName}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile Footer Action Row */}
            <div className="border-t border-[var(--border-subtle)] pt-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 text-xs text-[var(--text-muted)] px-1">
                <Link
                  to="/privacy"
                  className="py-1 hover:text-[var(--text-primary)] transition-colors"
                >
                  Privacy
                </Link>
                <span aria-hidden="true">·</span>
                <Link
                  to="/terms"
                  className="py-1 hover:text-[var(--text-primary)] transition-colors"
                >
                  Terms
                </Link>
              </div>
              <Link
                to="/tools"
                className="btn-primary-glass inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white min-h-[38px]"
              >
                <Compass className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Explore Tools</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
