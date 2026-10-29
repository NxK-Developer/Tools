import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  ToolDefinition,
  getCategoryById,
} from '../utilities/toolRegistry';
import { CategoryIconTile } from './IconResolver';

interface ToolCardProps {
  tool: ToolDefinition;
  showCategory?: boolean;
  variant?: 'default' | 'large';
}

export function ToolCard({
  tool,
  showCategory = true,
  variant = 'default',
}: ToolCardProps) {
  const category = getCategoryById(tool.category);

  if (variant === 'large') {
    return (
      <Link
        to={tool.route}
        className="interactive-card group flex flex-col justify-between rounded-2xl p-6 sm:p-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)]"
      >
        <div>
          <div className="flex items-center justify-between gap-4">
            <CategoryIconTile icon={tool.icon} category={tool.category} size="lg" />
            <ArrowRight
              className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-transform duration-150 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </div>

          {showCategory && category && (
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              {category.shortName}
            </p>
          )}

          <h3 className="mt-1.5 text-lg sm:text-xl font-bold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
            {tool.name}
          </h3>

          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            {tool.shortDescription}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={tool.route}
      className="interactive-card group flex items-start justify-between gap-3.5 rounded-2xl p-4 sm:p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)]"
    >
      <div className="flex items-start gap-3.5 min-w-0">
        <CategoryIconTile
          icon={tool.icon}
          category={tool.category}
          size="md"
          className="mt-0.5"
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm sm:text-base font-semibold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
              {tool.name}
            </h3>
            {showCategory && category && (
              <span className="rounded-md bg-[var(--bg-elevated)] border border-[var(--border-subtle)] px-2 py-0.5 text-[11px] font-medium text-[var(--text-muted)] whitespace-nowrap">
                {category.shortName}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)] line-clamp-2">
            {tool.shortDescription}
          </p>
        </div>
      </div>

      <ArrowRight
        className="mt-1 w-4 h-4 shrink-0 text-[var(--text-muted)] opacity-70 group-hover:opacity-100 group-hover:text-[var(--accent-primary)] transition-all duration-150 group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  );
}
