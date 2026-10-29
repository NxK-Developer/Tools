import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  getAllCategories,
  searchTools,
  ToolCategoryId,
  ToolAvailability,
  getCatalogSummary,
} from '../utilities/toolRegistry';
import { usePageMeta } from '../utilities/seo';
import { PageContainer } from '../components/PageContainer';
import { SearchBar } from '../components/SearchBar';
import { ToolCard } from '../components/ToolCard';

export function ToolsDirectoryPage() {
  usePageMeta({
    title: 'All Tools Directory',
    description:
      'Browse and filter the complete NxK Tools directory by category, keyword, and availability status.',
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';

  const [query, setQuery] = useState<string>(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<ToolCategoryId | 'all'>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<
    ToolAvailability | 'all'
  >('all');

  useEffect(() => {
    const qParam = searchParams.get('q') ?? '';
    if (qParam !== query) {
      setQuery(qParam);
    }
  }, [searchParams]);

  const handleQueryChange = (nextQuery: string) => {
    setQuery(nextQuery);
    if (nextQuery.trim()) {
      setSearchParams({ q: nextQuery }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const categories = getAllCategories();
  const summary = getCatalogSummary();
  const filteredTools = searchTools(query, {
    category: selectedCategory,
    availability: selectedAvailability,
  });

  const handleResetFilters = () => {
    setQuery('');
    setSelectedCategory('all');
    setSelectedAvailability('all');
    setSearchParams({}, { replace: true });
  };

  return (
    <PageContainer
      kicker="Centralized Tool Registry"
      title="All Tools Directory"
      subtitle={`Search and filter all ${summary.totalTools} utilities across ${summary.totalCategories} categories (${summary.availableTools} available now, ${summary.plannedTools} in development).`}
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'All Tools' }]}
    >
      {/* Search & Filter Controls */}
      <div className="space-y-4 border-b border-[var(--border-subtle)] pb-6 mb-6">
        <SearchBar
          value={query}
          onChange={handleQueryChange}
          showDropdown={false}
          placeholder="Filter directory by tool name, description, or keyword..."
          label="Filter tools directory"
        />

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between pt-2">
          {/* Category Filter Buttons */}
          <div
            role="group"
            aria-label="Filter by category"
            className="flex flex-wrap items-center gap-1.5"
          >
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-[var(--accent-primary)] text-[var(--accent-contrast)]'
                  : 'bg-[var(--bg-canvas)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-[var(--accent-primary)] text-[var(--accent-contrast)]'
                    : 'bg-[var(--bg-canvas)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Availability Status Filter */}
          <div
            role="group"
            aria-label="Filter by availability"
            className="flex items-center gap-1 rounded-lg bg-[var(--bg-canvas)] p-1 border border-[var(--border-subtle)] self-start lg:self-auto shrink-0"
          >
            <button
              type="button"
              onClick={() => setSelectedAvailability('all')}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedAvailability === 'all'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              All ({summary.totalTools})
            </button>
            <button
              type="button"
              onClick={() => setSelectedAvailability(ToolAvailability.AVAILABLE)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedAvailability === ToolAvailability.AVAILABLE
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Available ({summary.availableTools})
            </button>
            <button
              type="button"
              onClick={() => setSelectedAvailability(ToolAvailability.PLANNED)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedAvailability === ToolAvailability.PLANNED
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              In Development ({summary.plannedTools})
            </button>
          </div>
        </div>
      </div>

      {/* Results Count Header */}
      <div className="mb-4 flex items-center justify-between text-xs text-[var(--text-muted)] tabular-nums">
        <span>
          Showing {filteredTools.length} of {summary.totalTools} tools
        </span>
        {(query.trim() !== '' ||
          selectedCategory !== 'all' ||
          selectedAvailability !== 'all') && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="font-medium text-[var(--accent-primary)] hover:underline cursor-pointer"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Tool Grid or Empty State */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-6 py-14 text-center">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            No matching tools found
          </h2>
          <p className="mt-1.5 text-sm text-[var(--text-secondary)] max-w-md mx-auto">
            No tools matched your current search query and filter combination. Try clearing
            your filters or searching for another term.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-xs font-medium text-[var(--accent-contrast)] hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </PageContainer>
  );
}
