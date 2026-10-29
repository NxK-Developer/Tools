import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ResponsiveNavigation } from './ResponsiveNavigation';
import { NxKLogo } from './NxKLogo';

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full px-3 sm:px-6 lg:px-8 pt-3 pb-2 pointer-events-none">
      <div
        className={`pointer-events-auto mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between gap-2 sm:gap-4 lg:gap-6 rounded-2xl px-3.5 sm:px-6 transition-all duration-200 ${
          isScrolled ? 'liquid-glass-bar liquid-glass-bar-scrolled' : 'liquid-glass-bar'
        }`}
      >
        {/* Left Zone: NxK Tools Logo & Wordmark */}
        <Link
          to="/"
          aria-label="NxK Tools — Home"
          className="group inline-flex items-center rounded-xl py-1 pr-2 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)]"
        >
          <NxKLogo size="md" />
        </Link>

        {/* Center & Right Zones: Primary Nav, Search, Theme Toggle, Explore Tools CTA, Mobile Menu */}
        <ResponsiveNavigation />
      </div>
    </header>
  );
}
