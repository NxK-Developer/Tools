import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  getToolById,
  getCategoryById,
  getToolsByCategory,
  getAllTools,
  ToolAvailability,
} from '../utilities/toolRegistry';
import { usePageMeta } from '../utilities/seo';
import { ToolCard } from '../components/ToolCard';
import { CategoryIconTile } from '../components/IconResolver';
import { WordCounterTool } from '../tools/WordCounterTool';
import { CaseConverterTool } from '../tools/CaseConverterTool';
import { PercentageCalculatorTool } from '../tools/PercentageCalculatorTool';
import { JsonFormatterTool } from '../tools/JsonFormatterTool';
import { ImageCompressorTool } from '../tools/ImageCompressorTool';
import { ImageResizerTool } from '../tools/ImageResizerTool';
import { QrCodeGeneratorTool } from '../tools/QrCodeGeneratorTool';
import { ImagesToPdfTool } from '../tools/ImagesToPdfTool';
import { MergePdfTool } from '../tools/MergePdfTool';

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
    case 'image-compressor':
      return <ImageCompressorTool />;
    case 'image-resizer':
      return <ImageResizerTool />;
    case 'qr-code-generator':
      return <QrCodeGeneratorTool />;
    case 'images-to-pdf':
      return <ImagesToPdfTool />;
    case 'merge-pdf':
      return <MergePdfTool />;
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
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-enter">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            Tool Not Found
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[var(--text-secondary)]">
            No utility with identifier &ldquo;{toolId}&rdquo; exists in NxK Tools. Choose one
            of our available tools below.
          </p>
        </header>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {availableTools.map((item) => (
            <ToolCard key={item.id} tool={item} />
          ))}
        </div>
      </div>
    );
  }

  const isAvailable = tool.availability === ToolAvailability.AVAILABLE;
  const activeComponent = isAvailable ? renderImplementedTool(tool.id) : null;

  const sameCategoryTools = getToolsByCategory(tool.category).filter(
    (t) => t.id !== tool.id
  );
  const otherTools = getAllTools().filter(
    (t) => t.id !== tool.id && t.category !== tool.category
  );
  const sidebarRelatedTools = [...sameCategoryTools, ...otherTools].slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10 animate-enter">
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
            <Link to="/tools" className="hover:text-[var(--text-primary)] transition-colors">
              All Tools
            </Link>
          </li>
          {category && (
            <>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  to={category.route}
                  className="hover:text-[var(--text-primary)] transition-colors"
                >
                  {category.name}
                </Link>
              </li>
            </>
          )}
          <li aria-hidden="true">/</li>
          <li className="font-medium text-[var(--text-primary)]" aria-current="page">
            {tool.name}
          </li>
        </ol>
      </nav>

      {/* Tool Header matching Mockup 05. Tool Page */}
      <header className="mb-7 sm:mb-8 flex items-start gap-4">
        <CategoryIconTile
          icon={tool.icon}
          category={tool.category}
          size="lg"
          className="mt-0.5"
        />
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            {tool.name}
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-[var(--text-secondary)]">
            {tool.shortDescription}
          </p>
        </div>
      </header>

      {/* 2-Column Layout matching Mockup 05: Workspace Left (col-span-8) + How to use & Related Tools Right (col-span-4) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 items-start">
        <div className="lg:col-span-8">
          <div className="liquid-glass-panel rounded-3xl p-4 sm:p-6">
            {isAvailable && activeComponent ? (
              activeComponent
            ) : (
              <div className="p-6 text-center">
                <h2 className="text-lg font-bold text-[var(--text-primary)]">
                  {tool.name} is in development
                </h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  {tool.implementationNotes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: How to use + Related Tools */}
        <aside className="lg:col-span-4 space-y-6">
          {tool.instructions && tool.instructions.length > 0 && (
            <section
              aria-labelledby="how-to-use-heading"
              className="liquid-glass-panel rounded-3xl p-5 sm:p-6"
            >
              <h2
                id="how-to-use-heading"
                className="text-base font-bold tracking-tight text-[var(--text-primary)]"
              >
                How to use
              </h2>
              <ol className="mt-4 space-y-3 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
                {tool.instructions.map((stepText, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="font-semibold text-[var(--text-primary)] shrink-0">
                      {idx + 1}.
                    </span>
                    <span>{stepText}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <section
            aria-labelledby="related-tools-heading"
            className="liquid-glass-panel rounded-3xl p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                id="related-tools-heading"
                className="text-base font-bold tracking-tight text-[var(--text-primary)]"
              >
                Related Tools
              </h2>
              <Link
                to="/tools"
                className="text-xs font-semibold text-[var(--accent-primary)] hover:underline"
              >
                All tools
              </Link>
            </div>

            <div className="space-y-3">
              {sidebarRelatedTools.map((related) => (
                <Link
                  key={related.id}
                  to={related.route}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5 hover:border-[var(--accent-border)] transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <CategoryIconTile
                      icon={related.icon}
                      category={related.category}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors truncate">
                        {related.name}
                      </div>
                      <div className="text-[11px] text-[var(--text-secondary)] truncate">
                        {related.shortDescription}
                      </div>
                    </div>
                  </div>
                  <ArrowRight
                    className="w-4 h-4 shrink-0 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
