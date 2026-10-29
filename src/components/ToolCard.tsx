import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import {
  ToolDefinition,
  ToolAvailability,
  getCategoryById,
} from '../utilities/toolRegistry';
import { IconResolver } from './IconResolver';

interface ToolCardProps {
  tool: ToolDefinition;
  showCategory?: boolean;
}

export function ToolCard({ tool, showCategory = true }: ToolCardProps) {
  const category = getCategoryById(tool.category);
  const isAvailable = tool.availability === ToolAvailability.AVAILABLE;

  return (
    <Link
      to={tool.route}
      className="group flex flex-col justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 hover:border-[var(--border-strong)] transition-colors"
    >
      <div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--accent-primary)]">
            <IconResolver icon={tool.icon} className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {isAvailable ? (
              <>
                <CheckCircle2
                  className="w-3.5 h-3.5 text-[var(--status-available-text)]"
                  aria-hidden="true"
                />
                <span className="font-medium text-[var(--status-available-text)]">
                  Available
                </span>
              </>
            ) : (
              <>
                <Clock
                  className="w-3.5 h-3.5 text-[var(--status-planned-text)]"
                  aria-hidden="true"
                />
                <span className="font-medium text-[var(--status-planned-text)]">
                  In development
                </span>
              </>
            )}
          </div>
        </div>

        <h3 className="mt-4 text-base font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
          {tool.name}
        </h3>

        <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
          {tool.shortDescription}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[var(--border-subtle)] pt-3.5 text-xs text-[var(--text-muted)]">
        <div className="flex items-center gap-2">
          {showCategory && category && (
            <>
              <span>{category.name}</span>
              <span aria-hidden="true">·</span>
            </>
          )}
          <span>{isAvailable ? 'Open tool' : 'View specification'}</span>
        </div>
        <ArrowRight
          className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] group-hover:translate-x-0.5 transition-all"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}
