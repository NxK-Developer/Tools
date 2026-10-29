import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import {
  getToolById,
  getCategoryById,
  getToolsByCategory,
  getAllTools,
  ToolAvailability,
} from '../utilities/toolRegistry';
import { usePageMeta } from '../utilities/seo';
import { PageContainer } from '../components/PageContainer';
import { ToolCard } from '../components/ToolCard';
import { IconResolver } from '../components/IconResolver';
import { WordCounterTool } from '../tools/WordCounterTool';
import { CaseConverterTool } from '../tools/CaseConverterTool';
import { PercentageCalculatorTool } from '../tools/PercentageCalculatorTool';
import { JsonFormatterTool } from '../tools/JsonFormatterTool';

function renderImplementedTool(toolId: string): React.ReactNode | null {
  switch (toolId) {
    case 'word-counter':
      return <WordCounterTool />;
    case 'case-converter':
      return <CaseConverterTool />;
    case 'percentage-calculator':
      return <PercentageCalculatorTool />;
    case 'json-formatter':
      return <JsonFormatterTool />;
    default:
      return null;
  }
}

export function ToolPage() {
  const { toolId = '' } = useParams<{ toolId: string }>();
  const tool = getToolById(toolId);
  const category = tool ? getCategoryById(tool.category) : undefined;

  usePageMeta({
    title: tool ? tool.name : 'Tool Not Found',
    description: tool
      ? tool.shortDescription
      : 'The requested utility could not be found in the NxK Tools registry.',
  });

  if (!tool) {
    const availableTools = getAllTools().filter(
      (t) => t.availability === ToolAvailability.AVAILABLE
    );

    return (
      <PageContainer
        kicker="Registry Lookup"
        title="Tool Not Found"
        subtitle={`No utility with identifier "${toolId}" exists in the NxK Tools registry.`}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'All Tools', to: '/tools' },
          { label: 'Not Found' },
        ]}
      >
        <div className="space-y-6">
          <p className="text-sm text-[var(--text-secondary)]">
            Try choosing one of our available utilities below or return to the full tool
            directory.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {availableTools.map((item) => (
              <ToolCard key={item.id} tool={item} />
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  const isAvailable = tool.availability === ToolAvailability.AVAILABLE;
  const activeComponent = isAvailable ? renderImplementedTool(tool.id) : null;
  const relatedTools = getToolsByCategory(tool.category).filter((t) => t.id !== tool.id);
  const fallbackAvailable = getAllTools().filter(
    (t) => t.availability === ToolAvailability.AVAILABLE && t.id !== tool.id
  );

  return (
    <PageContainer
      kicker={`${category?.name ?? 'Utility'} · ${
        isAvailable ? 'Available' : 'In Development'
      }`}
      title={tool.name}
      subtitle={tool.shortDescription}
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'All Tools', to: '/tools' },
        ...(category ? [{ label: category.name, to: category.route }] : []),
        { label: tool.name },
      ]}
      headerRight={
        <Link
          to={category ? category.route : '/tools'}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2 text-xs font-medium text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] transition-colors whitespace-nowrap"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Back to {category ? category.name : 'Directory'}</span>
        </Link>
      }
    >
      {/* Workspace Area: Live Tool or Honest Planned Specification */}
      {isAvailable && activeComponent ? (
        <div>{activeComponent}</div>
      ) : (
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--status-planned-text)]">
              <Clock className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-[var(--status-planned-text)]">
                  Module Status: Planned in Catalog
                </span>
                <span aria-hidden="true" className="text-[var(--text-muted)]">
                  ·
                </span>
                <span className="font-mono text-[var(--text-muted)]">ID: {tool.id}</span>
              </div>

              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                {tool.name} is scheduled for an upcoming incremental release
              </h2>

              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                In accordance with NxK Tools architectural standards, utilities are enabled
                only when their complete client-side processing pipeline is implemented and
                verified. This page serves as the registered route and specification shell for{' '}
                <strong>{tool.name}</strong>.
              </p>

              <div className="border-t border-[var(--border-subtle)] pt-4 mt-4">
                <h3 className="text-xs font-semibold text-[var(--text-primary)]">
                  Planned Technical Specification
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                  {tool.implementationNotes}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/tools"
                  className="inline-flex items-center justify-center rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-xs font-medium text-[var(--accent-contrast)] hover:bg-[var(--accent-primary-hover)] transition-colors"
                >
                  Browse Available Utilities
                </Link>
                {category && (
                  <Link
                    to={category.route}
                    className="inline-flex items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-4 py-2 text-xs font-medium text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    More in {category.name}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Related or Ready-to-Use Utilities */}
      <section
        aria-labelledby="related-tools-heading"
        className="mt-16 border-t border-[var(--border-subtle)] pt-10"
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            id="related-tools-heading"
            className="text-base font-semibold text-[var(--text-primary)]"
          >
            {relatedTools.length > 0
              ? `More in ${category?.name ?? 'This Category'}`
              : 'Other Available Utilities'}
          </h2>
          <Link
            to="/tools"
            className="text-xs font-medium text-[var(--accent-primary)] hover:underline"
          >
            View all tools →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(relatedTools.length > 0 ? relatedTools : fallbackAvailable.slice(0, 3)).map(
            (item) => (
              <ToolCard key={item.id} tool={item} />
            )
          )}
        </div>
      </section>
    </PageContainer>
  );
}
