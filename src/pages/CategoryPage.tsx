import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  getCategoryById,
  getToolsByCategory,
  getAllCategories,
  ToolAvailability,
} from '../utilities/toolRegistry';
import { usePageMeta } from '../utilities/seo';
import { PageContainer } from '../components/PageContainer';
import { ToolCard } from '../components/ToolCard';
import { IconResolver } from '../components/IconResolver';

export function CategoryPage() {
  const { categoryId = '' } = useParams<{ categoryId: string }>();
  const category = getCategoryById(categoryId);
  const allCategories = getAllCategories();

  usePageMeta({
    title: category ? `${category.name} — Category` : 'Category Not Found',
    description: category
      ? category.description
      : 'The requested tool category could not be found in the NxK Tools catalog.',
  });

  if (!category) {
    return (
      <PageContainer
        kicker="Category Lookup"
        title="Category Not Found"
        subtitle={`No tool category matches "${categoryId}". Choose one of our supported categories below.`}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'All Tools', to: '/tools' },
          { label: 'Not Found' },
        ]}
      >
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">
            Available Categories
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {allCategories.map((cat) => (
              <Link
                key={cat.id}
                to={cat.route}
                className="flex items-center gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3.5 hover:border-[var(--border-strong)] transition-colors"
              >
                <IconResolver
                  icon={cat.icon}
                  className="w-5 h-5 text-[var(--accent-primary)]"
                />
                <div>
                  <div className="text-sm font-semibold text-[var(--text-primary)]">
                    {cat.name}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {cat.shortDescription}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  const tools = getToolsByCategory(category.id);
  const availableCount = tools.filter(
    (t) => t.availability === ToolAvailability.AVAILABLE
  ).length;

  return (
    <PageContainer
      kicker={`Category · ${tools.length} ${tools.length === 1 ? 'Utility' : 'Utilities'}`}
      title={category.name}
      subtitle={category.description}
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'All Tools', to: '/tools' },
        { label: category.name },
      ]}
      headerRight={
        <Link
          to="/tools"
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2 text-xs font-medium text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] transition-colors whitespace-nowrap"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>All Categories</span>
        </Link>
      }
    >
      {/* Category Summary Strip */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[var(--text-muted)] tabular-nums">
        <div className="flex items-center gap-2">
          <span>{tools.length} registered in this category</span>
          <span aria-hidden="true">·</span>
          <span>{availableCount} available now</span>
          <span aria-hidden="true">·</span>
          <span>{tools.length - availableCount} in development</span>
        </div>
      </div>

      {/* Category Tools Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} showCategory={false} />
        ))}
      </div>

      {/* Sibling Category Switcher */}
      <section
        aria-labelledby="other-categories-heading"
        className="mt-16 border-t border-[var(--border-subtle)] pt-10"
      >
        <h2
          id="other-categories-heading"
          className="text-sm font-semibold text-[var(--text-primary)] mb-4"
        >
          Other Tool Categories
        </h2>
        <div className="flex flex-wrap gap-2">
          {allCategories
            .filter((cat) => cat.id !== category.id)
            .map((cat) => (
              <Link
                key={cat.id}
                to={cat.route}
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2 text-xs font-medium text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] transition-colors whitespace-nowrap"
              >
                <IconResolver
                  icon={cat.icon}
                  className="w-3.5 h-3.5 text-[var(--accent-primary)]"
                />
                <span>{cat.name}</span>
              </Link>
            ))}
        </div>
      </section>
    </PageContainer>
  );
}
