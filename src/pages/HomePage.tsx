import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Monitor, Sliders } from 'lucide-react';
import {
  getAllCategories,
  getAllTools,
  ToolAvailability,
  getCatalogSummary,
} from '../utilities/toolRegistry';
import { usePageMeta } from '../utilities/seo';
import { SearchBar } from '../components/SearchBar';
import { CategoryCard } from '../components/CategoryCard';
import { ToolCard } from '../components/ToolCard';

export function HomePage() {
  usePageMeta({
    title: 'NxK Tools — Powerful Tools. Zero Hassle.',
    description:
      'Access browser-based online utilities for text, images, QR codes, calculations, PDFs, and developer tasks without creating an account.',
  });

  const categories = getAllCategories();
  const allTools = getAllTools();
  const availableTools = allTools.filter(
    (tool) => tool.availability === ToolAvailability.AVAILABLE
  );
  const plannedTools = allTools.filter(
    (tool) => tool.availability === ToolAvailability.PLANNED
  );
  const summary = getCatalogSummary();

  return (
    <div>
      {/* Hero Section */}
      <section className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold text-[var(--accent-primary)]">
              Browser Utility Platform · No Account Required
            </p>
            <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)] balance-text">
              Powerful Tools. Zero Hassle.
            </h1>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-[var(--text-secondary)]">
              Open a tool, complete your task, and move on. NxK Tools organizes essential
              utilities across six focused categories with a clean, distraction-free interface.
            </p>

            {/* Primary Search Anchor */}
            <div className="mt-8 text-left">
              <SearchBar
                placeholder="Search tools (e.g., Word Counter, Case Converter, Percentage, JSON Formatter)..."
                label="Search all tools in the NxK Tools catalog"
              />
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
                <span>Quick access:</span>
                {availableTools.map((tool, index) => (
                  <React.Fragment key={tool.id}>
                    <Link
                      to={tool.route}
                      className="font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                    >
                      {tool.name}
                    </Link>
                    {index < availableTools.length - 1 && (
                      <span aria-hidden="true">·</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        {/* Section 1: Available Tools */}
        <section aria-labelledby="heading-available-tools">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-6">
            <div>
              <h2
                id="heading-available-tools"
                className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]"
              >
                Ready-to-Use Utilities
              </h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Implemented client-side tools ready for immediate use in your browser.
              </p>
            </div>
            <Link
              to="/tools"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-primary)] hover:underline whitespace-nowrap shrink-0"
            >
              <span>Browse full directory ({summary.totalTools})</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {availableTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* Section 2: Browse by Category */}
        <section aria-labelledby="heading-categories">
          <div className="mb-6">
            <h2
              id="heading-categories"
              className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]"
            >
              Browse by Category
            </h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Explore tools organized by workflow domain across {summary.totalCategories} categories.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        {/* Section 3: Planned Catalog Roadmap */}
        <section aria-labelledby="heading-roadmap">
          <div className="mb-6">
            <h2
              id="heading-roadmap"
              className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]"
            >
              Upcoming Modules in the Catalog
            </h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Registered tools currently in active development. Selecting any planned tool displays its specification and scope.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plannedTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* Section 4: Platform Design Principles */}
        <section
          aria-labelledby="heading-principles"
          className="border-t border-[var(--border-subtle)] pt-12"
        >
          <h2
            id="heading-principles"
            className="text-lg font-bold tracking-tight text-[var(--text-primary)]"
          >
            How NxK Tools Works
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-[var(--text-primary)]">
                <Monitor className="w-4 h-4 text-[var(--accent-primary)]" aria-hidden="true" />
                <span>Direct Access Without Accounts</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                Every utility opens directly at its URL. There are no sign-up walls, onboarding
                wizards, or subscription gates blocking basic functionality.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-[var(--text-primary)]">
                <Sliders className="w-4 h-4 text-[var(--accent-primary)]" aria-hidden="true" />
                <span>Local Browser Execution</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                Implemented utilities process your input directly in your browser tab using
                standard JavaScript APIs rather than sending payloads to remote servers.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-[var(--text-primary)]">
                <Layers className="w-4 h-4 text-[var(--accent-primary)]" aria-hidden="true" />
                <span>Transparent Availability Status</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                Tools are marked as available only after their logic is implemented and tested.
                Planned catalog items clearly state their development status.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
