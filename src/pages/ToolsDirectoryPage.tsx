import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchX, RotateCcw } from 'lucide-react';
import {
  getAllCategories,
  getAllTools,
  searchTools,
  ToolCategoryId,
  getCategoryById,
} from '../utilities/toolRegistry';
import { usePageMeta } from '../utilities/seo';
import { SearchBar } from '../components/SearchBar';
import { ToolCard } from '../components/ToolCard';

const VALID_CATEGORIES = new Set<string>(Object.values(ToolCategoryId));

export function ToolsDirectoryPage() {
  usePageMeta({
    title: 'All Tools',
    description:
      'Browse and search the complete NxK Tools collection across Image, PDF, Text, QR Code, Calculators, and Developer Tools.',
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const rawCat = searchParams.get('category') ?? 'all';
  const initialCategory: ToolCategoryId | 'all' = VALID_CATEGORIES.has(rawCat)
    ? (rawCat as ToolCategoryId)
    : 'all';

  const [query, setQuery] = useState<string>(initialQuery);
  const [selectedCategory, setSelectedCategory] =
    useState<ToolCategoryId | 'all'>(initialCategory);

  useEffect(() => {
    const qParam = searchParams.get('q') ?? '';
    const catParam = searchParams.get('category') ?? 'all';
    if (qParam !== query) {
      setQuery(qParam);
    }
    const nextCat: ToolCategoryId | 'all' = VALID_CATEGORIES.has(catParam)
      ? (catParam as ToolCategoryId)
      : 'all';
    if (nextCat !== selectedCategory) {
      setSelectedCategory(nextCat);
    }
  }, [searchParams]);

  const syncUrlParams = (nextQuery: string, nextCategory: ToolCategoryId | 'all') => {
    const params: Record<string, string> = {};
    if (nextQuery.trim()) {
      params.q = nextQuery;
    }
    if (nextCategory !== 'all') {
      params.category = nextCategory;
    }
    setSearchParams(params, { replace: true });
  };

  const handleQueryChange = (nextQuery: string) => {
    setQuery(nextQuery);
    syncUrlParams(nextQuery, selectedCategory);
  };

  const handleCategoryChange = (nextCategory: ToolCategoryId | 'all') => {
    setSelectedCategory(nextCategory);
    syncUrlParams(query, nextCategory);
  };

  const handleResetFilters = () => {
    setQuery('');
    setSelectedCategory('all');
    setSearchParams({}, { replace: true });
  };

  const categories = getAllCategories();
  const totalToolsCount = getAllTools().length;
  const filteredTools = searchTools(query, {
    category: selectedCategory,
  });

  const activeCategoryMeta =
    selectedCategory !== 'all' ? getCategoryById(selectedCategory) : undefined;
  const hasActiveFilters = query.trim().length > 0 || selectedCategory !== 'all';

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-enter">
      {/* Page Header matching Mockup 03. All Tools Page */}
      <header className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          All Tools
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[var(--text-secondary)]">
          Browse our complete collection of tools.
        </p>
      </header>

      {/* Search Bar & Category Filter Pills */}
      <div className="space-y-4 mb-6">
        <SearchBar
          value={query}
          onChange={handleQueryChange}
          showDropdown={false}
          placeholder="Search tools..."
          label="Search tools by name, description, or category"
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
          <div
            role="group"
            aria-label="Filter tools by category"
            className="flex flex-wrap items-center gap-2"
          >
            <button
              type="button"
              aria-pressed={selectedCategory === 'all'}
              onClick={() => handleCategoryChange('all')}
              className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[36px] ${
                selectedCategory === 'all'
                  ? 'btn-primary-glass text-white'
                  : 'liquid-glass-panel text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]'
              }`}
            >
              All
            </button>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[36px] ${
                    isSelected
                      ? 'btn-primary-glass text-white'
                      : 'liquid-glass-panel text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  {cat.shortName}
                </button>
              );
            })}
          </div>

          {/* Live Results Count & Reset Control */}
          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-[var(--text-muted)] tabular-nums">
            <span aria-live="polite">
              Showing {filteredTools.length} of {totalToolsCount}{' '}
              {totalToolsCount === 1 ? 'tool' : 'tools'}
              {activeCategoryMeta ? ` in ${activeCategoryMeta.shortName}` : ''}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 font-semibold text-[var(--accent-primary)] hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" />
                <span>Clear filters</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Responsive Tool-Card Grid or Empty State */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} showCategory={true} />
          ))}
        </div>
      ) : (
        <div
          role="status"
          aria-live="polite"
          className="liquid-glass-panel rounded-3xl px-6 py-14 text-center max-w-xl mx-auto my-4"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            <SearchX className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-base sm:text-lg font-bold text-[var(--text-primary)]">
            No matching tools found
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
            No tools matched{' '}
            {query.trim() ? (
              <>
                <strong className="text-[var(--text-primary)]">
                  &ldquo;{query.trim()}&rdquo;
                </strong>{' '}
              </>
            ) : (
              'your current filter '
            )}
            {activeCategoryMeta ? (
              <>
                in{' '}
                <strong className="text-[var(--text-primary)]">
                  {activeCategoryMeta.name}
                </strong>
              </>
            ) : null}
            . Try searching for a different keyword or clearing your filters.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {query.trim() && (
              <button
                type="button"
                onClick={() => handleQueryChange('')}
                className="btn-primary-glass inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs font-semibold text-white cursor-pointer"
              >
                Clear Search
              </button>
            )}
            <button
              type="button"
              onClick={handleResetFilters}
              className="liquid-glass-panel inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors cursor-pointer"
            >
              Show All Tools
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
