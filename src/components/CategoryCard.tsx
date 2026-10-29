import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  CategoryDefinition,
  getToolsByCategory,
} from '../utilities/toolRegistry';
import { CategoryIconTile } from './IconResolver';

interface CategoryCardProps {
  category: CategoryDefinition;
  variant?: 'default' | 'compact';
}

export function CategoryCard({ category, variant = 'default' }: CategoryCardProps) {
  const categoryTools = getToolsByCategory(category.id);
  const countLabel = `${categoryTools.length} ${categoryTools.length === 1 ? 'tool' : 'tools'}`;

  if (variant === 'compact') {
    return (
      <Link
        to={category.route}
        className="interactive-card group flex flex-col justify-between rounded-2xl p-4 sm:p-5"
      >
        <div className="flex items-center justify-between gap-2">
          <CategoryIconTile icon={category.icon} category={category.id} size="md" />
          <ArrowRight
            className="w-3.5 h-3.5 text-[var(--text-muted)] opacity-60 group-hover:opacity-100 group-hover:text-[var(--accent-primary)] transition-all duration-150 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-semibold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
            {category.shortName === 'Developer' ? 'Developer Tools' : category.shortName}
          </h3>
          <p className="mt-0.5 text-xs text-[var(--text-muted)] tabular-nums">
            {countLabel}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={category.route}
      className="interactive-card group flex flex-col justify-between rounded-2xl p-5 sm:p-6"
    >
      <div>
        <div className="flex items-center justify-between gap-3">
          <CategoryIconTile icon={category.icon} category={category.id} size="lg" />
          <ArrowRight
            className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-transform duration-150 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </div>

        <h3 className="mt-4 text-base sm:text-lg font-semibold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
          {category.name}
        </h3>

        <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
          {category.shortDescription}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[var(--border-subtle)] pt-3.5 text-xs text-[var(--text-muted)] tabular-nums">
        <span>{countLabel}</span>
        <span className="font-medium text-[var(--accent-primary)]">
          Explore category →
        </span>
      </div>
    </Link>
  );
}
