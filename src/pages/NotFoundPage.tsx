import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import { getAllTools, ToolAvailability } from '../utilities/toolRegistry';
import { usePageMeta } from '../utilities/seo';
import { PageContainer } from '../components/PageContainer';
import { SearchBar } from '../components/SearchBar';
import { ToolCard } from '../components/ToolCard';

export function NotFoundPage() {
  const location = useLocation();

  usePageMeta({
    title: '404 — Page Not Found',
    description:
      'The requested route does not exist on NxK Tools. Search the tool registry or return to the homepage.',
  });

  const availableTools = getAllTools().filter(
    (t) => t.availability === ToolAvailability.AVAILABLE
  );

  return (
    <PageContainer
      kicker="404 Error"
      title="Page Not Found"
      subtitle={`No page or utility matches the URL path "${location.pathname}".`}
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: '404 Not Found' }]}
    >
      <div className="space-y-12">
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8 max-w-2xl">
          <div className="flex items-center gap-2.5 text-sm font-semibold text-[var(--text-primary)]">
            <Compass className="w-5 h-5 text-[var(--accent-primary)]" aria-hidden="true" />
            <span>Find what you were looking for</span>
          </div>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Search the centralized tool registry below, or navigate back to the homepage or
            full directory.
          </p>

          <div className="mt-5">
            <SearchBar
              placeholder="Search tools by name or category..."
              label="Search tools from 404 page"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-xs font-semibold text-[var(--accent-contrast)] hover:bg-[var(--accent-primary-hover)] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Return to Homepage</span>
            </Link>
            <Link
              to="/tools"
              className="inline-flex items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-4 py-2 text-xs font-medium text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] transition-colors"
            >
              Open All Tools Directory
            </Link>
          </div>
        </div>

        <section aria-labelledby="not-found-suggested-heading">
          <h2
            id="not-found-suggested-heading"
            className="text-base font-semibold text-[var(--text-primary)] mb-4"
          >
            Available Utilities
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {availableTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
