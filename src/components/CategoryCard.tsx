import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import {
  CategoryDefinition,
  getToolsByCategory,
  ToolAvailability,
} from '../utilities/toolRegistry';
import { IconResolver } from './IconResolver';

interface CategoryCardProps {
  category: CategoryDefinition;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const categoryTools = getToolsByCategory(category.id);
  const availableCount = categoryTools.filter(
    (t) => t.availability === ToolAvailability.AVAILABLE
  ).length;

  return (
    <Link
      to={category.route}
      className="group flex flex-col justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 hover:border-[var(--border-strong)] transition-colors"
    >
      <div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--accent-primary)]">
            <IconResolver icon={category.icon} className="w-5 h-5" />
          </div>
          <ArrowUpRight
            className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </div>

        <h3 className="mt-4 text-base font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
          {category.name}
        </h3>

        <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
          {category.shortDescription}
        </p>
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-[var(--border-subtle)] pt-3.5 text-xs text-[var(--text-muted)] tabular-nums">
        <span>
          {categoryTools.length} {categoryTools.length === 1 ? 'tool' : 'tools'}
        </span>
        <span aria-hidden="true">·</span>
        <span
          className={
            availableCount > 0
              ? 'font-medium text-[var(--status-available-text)]'
              : 'text-[var(--text-muted)]'
          }
        >
          {availableCount > 0 ? `${availableCount} live` : 'In development'}
        </span>
      </div>
    </Link>
  );
}
