import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  searchTools,
  getAllCategories,
  ToolCategoryId,
} from '../utilities/toolRegistry';
import { usePageMeta } from '../utilities/seo';
import { SearchBar } from '../components/SearchBar';
import { ToolCard } from '../components/ToolCard';

export function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<ToolCategoryId | 'all'>('all');

  useEffect(() => {
    const q = searchParams.get('q') ?? '';
    if (q !== query) {
      setQuery(q);
    }
  }, [searchParams]);

  usePageMeta({
    title: query.trim() ? `Search: "${query.trim()}"` : 'Search Tools',
    description: 'Search the complete NxK Tools collection by name, category, or keyword.',
  });

  const handleQueryChange = (next: string) => {
    setQuery(next);
    if (next.trim()) {
      setSearchParams({ q: next }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const categories = getAllCategories();
  const results = searchTools(query, { category: selectedCategory });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-enter">
      <header className="mb-6 sm:mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-primary)]">
          Tool Search
        </p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          {query.trim() ? `Search Results for "${query.trim()}"` : 'Search NxK Tools'}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[var(--text-secondary)]">
          Find any utility across Image, PDF, Text, QR Code, Calculators, and Developer Tools.
        </p>
      </header>

      <div className="space-y-4 mb-8">
        <SearchBar
          value={query}
          onChange={handleQueryChange}
          showDropdown={false}
          placeholder="Search tools by name, category, or task..."
          label="Search tools"
          autoFocus
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            role="group"
            aria-label="Filter search results by category"
            className="flex flex-wrap items-center gap-2"
          >
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'btn-primary-glass text-white'
                  : 'liquid-glass-panel text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              All ({searchTools(query).length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'btn-primary-glass text-white'
                    : 'liquid-glass-panel text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {cat.shortName}
              </button>
            ))}
          </div>

          <span className="text-xs text-[var(--text-muted)] tabular-nums">
            {results.length} {results.length === 1 ? 'result' : 'results'} found
          </span>
        </div>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          {results.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="liquid-glass-panel rounded-2xl px-6 py-14 text-center">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            No tools matched &ldquo;{query}&rdquo;
          </h2>
          <p className="mt-1.5 text-sm text-[var(--text-secondary)] max-w-md mx-auto">
            Try searching for keywords like &ldquo;compress&rdquo;, &ldquo;resize&rdquo;,
            &ldquo;PDF&rdquo;, &ldquo;word&rdquo;, &ldquo;QR&rdquo;, or &ldquo;JSON&rdquo;.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                handleQueryChange('');
                setSelectedCategory('all');
              }}
              className="btn-primary-glass rounded-full px-5 py-2 text-xs font-semibold text-white cursor-pointer"
            >
              Show All Tools
            </button>
            <Link
              to="/categories"
              className="liquid-glass-panel rounded-full px-5 py-2 text-xs font-semibold text-[var(--text-primary)]"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
