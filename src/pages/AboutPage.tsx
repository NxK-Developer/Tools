import React from 'react';
import { Link } from 'react-router-dom';
import { getCatalogSummary, getAllCategories } from '../utilities/toolRegistry';
import { usePageMeta } from '../utilities/seo';
import { PageContainer } from '../components/PageContainer';

export function AboutPage() {
  usePageMeta({
    title: 'About NxK Tools',
    description:
      'Learn about the vision, architecture, and design principles behind NxK Tools — Powerful Tools. Zero Hassle.',
  });

  const summary = getCatalogSummary();
  const categories = getAllCategories();

  return (
    <PageContainer
      kicker="Platform Overview"
      title="About NxK Tools"
      subtitle="Powerful Tools. Zero Hassle. A browser-first utility platform built for students, professionals, creators, and developers."
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'About' }]}
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-8">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Why NxK Tools Exists
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
              Routine tasks—counting words in an essay, formatting a JSON payload, converting
              text case, or calculating percentage differences—should not require creating an
              account, installing heavy desktop software, or navigating cluttered interfaces.
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
              NxK Tools provides a centralized, responsive collection of utilities that run
              directly in modern web browsers. Every tool shares a consistent layout, keyboard
              accessibility, and light/dark theme support.
            </p>
          </section>

          <section className="space-y-3 border-t border-[var(--border-subtle)] pt-8">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Architectural Principles
            </h2>
            <dl className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
                <dt className="text-sm font-semibold text-[var(--text-primary)]">
                  Client-Side Execution
                </dt>
                <dd className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
                  Where practical, calculations and text transformations execute locally in
                  your browser tab without requiring a backend database or user login.
                </dd>
              </div>

              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
                <dt className="text-sm font-semibold text-[var(--text-primary)]">
                  Honest Availability Status
                </dt>
                <dd className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
                  Tools in our centralized registry are marked as available only after their
                  implementation is complete and tested. Planned modules clearly show their
                  roadmap status.
                </dd>
              </div>

              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
                <dt className="text-sm font-semibold text-[var(--text-primary)]">
                  Accessible & Responsive
                </dt>
                <dd className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
                  Built with semantic HTML, labeled form controls, visible focus states, and
                  layouts that adapt cleanly from mobile phones to desktop monitors.
                </dd>
              </div>

              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
                <dt className="text-sm font-semibold text-[var(--text-primary)]">
                  Zero Account Friction
                </dt>
                <dd className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
                  No sign-up forms, passwords, or API keys are required to use the initial
                  catalog of utilities.
                </dd>
              </div>
            </dl>
          </section>
        </div>

        {/* Right Sidebar: Current Catalog Snapshot */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              Catalog Status
            </h2>
            <dl className="mt-4 space-y-3 text-sm tabular-nums">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
                <dt className="text-[var(--text-secondary)]">Categories</dt>
                <dd className="font-mono font-semibold text-[var(--text-primary)]">
                  {summary.totalCategories}
                </dd>
              </div>
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
                <dt className="text-[var(--text-secondary)]">Registered Tools</dt>
                <dd className="font-mono font-semibold text-[var(--text-primary)]">
                  {summary.totalTools}
                </dd>
              </div>
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
                <dt className="text-[var(--text-secondary)]">Available Utilities</dt>
                <dd className="font-mono font-semibold text-[var(--status-available-text)]">
                  {summary.availableTools}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[var(--text-secondary)]">Planned Modules</dt>
                <dd className="font-mono font-semibold text-[var(--status-planned-text)]">
                  {summary.plannedTools}
                </dd>
              </div>
            </dl>

            <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
              <h3 className="text-xs font-semibold text-[var(--text-muted)] mb-2.5">
                Supported Domains
              </h3>
              <ul className="space-y-1.5 text-xs">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={cat.route}
                      className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                    >
                      {cat.name} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </PageContainer>
  );
}
