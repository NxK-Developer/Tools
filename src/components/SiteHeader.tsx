import React from 'react';
import { Link } from 'react-router-dom';
import { ResponsiveNavigation } from './ResponsiveNavigation';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Title, single line wordmark */}
        <Link
          to="/"
          className="text-lg font-bold tracking-tight text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors whitespace-nowrap shrink-0"
        >
          NxK Tools
        </Link>

        {/* Zone 2 & Zone 3: Navigation links and right action controls */}
        <ResponsiveNavigation />
      </div>
    </header>
  );
}
