import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Home, Layers } from 'lucide-react';
import { getAllTools } from '../utilities/toolRegistry';
import { usePageMeta } from '../utilities/seo';
import { SearchBar } from '../components/SearchBar';
import { ToolCard } from '../components/ToolCard';

export function NotFoundPage() {
  const location = useLocation();

  usePageMeta({
    title: '404 — Page not found',
    description:
      'Page not found. The requested route does not exist on NxK Tools. Return Home or browse All Tools.',
  });

  const allTools = getAllTools();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 animate-enter space-y-12">
      <section
        aria-labelledby="not-found-heading"
        className="liquid-glass-panel rounded-3xl p-6 sm:p-10 lg:p-12 max-w-3xl mx-auto text-center"
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent-primary)]">
          404
        </p>
        <h1
          id="not-found-heading"
          className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)]"
        >
          Page not found
        </h1>
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-[var(--text-secondary)] max-w-xl mx-auto">
          The page or tool at{' '}
          <code className="font-mono text-xs sm:text-sm text-[var(--text-primary)] break-all">
            {location.pathname}
          </code>{' '}
          could not be found. It may have been moved, or the address may be mistyped.
        </p>

        <div className="mt-7 max-w-lg mx-auto text-left">
          <SearchBar
            placeholder="Search for a tool..."
            label="Search tools from 404 page"
          />
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="btn-primary-glass inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white transition-all whitespace-nowrap min-h-[42px]"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/tools"
            className="liquid-glass-panel inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors whitespace-nowrap min-h-[42px]"
          >
            <Compass className="w-4 h-4 text-[var(--accent-primary)]" aria-hidden="true" />
            <span>Browse All Tools</span>
          </Link>
          <Link
            to="/categories"
            className="liquid-glass-panel inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors whitespace-nowrap min-h-[42px]"
          >
            <Layers className="w-4 h-4 text-[var(--accent-primary)]" aria-hidden="true" />
            <span>Categories</span>
          </Link>
        </div>
      </section>

      <section aria-labelledby="not-found-suggested-heading">
        <div className="flex items-center justify-between mb-4">
          <h2
            id="not-found-suggested-heading"
            className="text-lg sm:text-xl font-bold tracking-tight text-[var(--text-primary)]"
          >
            Popular Tools
          </h2>
          <Link
            to="/tools"
            className="text-xs sm:text-sm font-semibold text-[var(--accent-primary)] hover:underline"
          >
            View all tools →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          {allTools.slice(0, 6).map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
