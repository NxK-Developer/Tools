import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layers, Compass } from 'lucide-react';
import {
  getCategoryById,
  getToolsByCategory,
  getAllCategories,
} from '../utilities/toolRegistry';
import { usePageMeta } from '../utilities/seo';
import { ToolCard } from '../components/ToolCard';
import { CategoryIconTile } from '../components/IconResolver';

export function CategoryPage() {
  const { categoryId = '' } = useParams<{ categoryId: string }>();
  const category = getCategoryById(categoryId);
  const allCategories = getAllCategories();

  usePageMeta({
    title: category ? category.name : 'Category Not Found',
    description: category
      ? category.description
      : 'The requested tool category could not be found in the NxK Tools catalog.',
  });

  if (!category) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-enter">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            Category Not Found
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[var(--text-secondary)]">
            No tool category matches &ldquo;{categoryId}&rdquo;. Choose one of our categories
            below.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allCategories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.route}
              className="interactive-card group flex items-center gap-3.5 rounded-2xl p-4 sm:p-5"
            >
              <CategoryIconTile icon={cat.icon} category={cat.id} size="md" />
              <div>
                <div className="text-sm font-semibold text-[var(--text-primary)]">
                  {cat.name}
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  {cat.shortDescription}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const tools = getToolsByCategory(category.id);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-enter">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-5 text-xs text-[var(--text-muted)]">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link to="/" className="hover:text-[var(--text-primary)] transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              to="/categories"
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              Categories
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-[var(--text-primary)]" aria-current="page">
            {category.name}
          </li>
        </ol>
      </nav>

      {/* Header matching Mockup 04. Category Page (Image Tools) */}
      <header className="mb-8 sm:mb-10">
        <div className="flex items-start gap-4">
          <CategoryIconTile
            icon={category.icon}
            category={category.id}
            size="lg"
            className="mt-0.5"
          />
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              {category.name}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[var(--text-secondary)]">
              {category.shortDescription}
            </p>
          </div>
        </div>
      </header>

      {/* Large Frosted Glass Tool Cards matching Mockup 04, or Empty State if category has 0 tools */}
      {tools.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} variant="large" />
          ))}
        </div>
      ) : (
        <div
          role="status"
          className="liquid-glass-panel rounded-3xl px-6 py-12 text-center max-w-xl mx-auto"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            <Layers className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-base sm:text-lg font-bold text-[var(--text-primary)]">
            No tools available in {category.name} yet
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
            New utilities for {category.name} are planned. In the meantime, explore our
            active tools across other categories.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/tools"
              className="btn-primary-glass inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-semibold text-white"
            >
              <Compass className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Browse All Tools</span>
            </Link>
            <Link
              to="/categories"
              className="liquid-glass-panel inline-flex items-center rounded-full px-5 py-2.5 text-xs font-semibold text-[var(--text-primary)]"
            >
              View All Categories
            </Link>
          </div>
        </div>
      )}

      {/* Consistent Category Navigation Strip */}
      <section
        aria-labelledby="other-categories-heading"
        className="mt-14 border-t border-[var(--border-subtle)] pt-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            id="other-categories-heading"
            className="text-sm font-semibold text-[var(--text-primary)]"
          >
            Browse Categories
          </h2>
          <Link
            to="/tools"
            className="text-xs font-semibold text-[var(--accent-primary)] hover:underline"
          >
            View all tools →
          </Link>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {allCategories.map((cat) => {
            const isCurrent = cat.id === category.id;
            return (
              <Link
                key={cat.id}
                to={cat.route}
                aria-current={isCurrent ? 'page' : undefined}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                  isCurrent
                    ? 'btn-primary-glass text-white'
                    : 'liquid-glass-panel text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span>{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
