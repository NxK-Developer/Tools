import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface PageContainerProps {
  title?: string;
  subtitle?: string;
  kicker?: string;
  breadcrumbs?: BreadcrumbItem[];
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}

export function PageContainer({
  title,
  subtitle,
  kicker,
  breadcrumbs,
  headerRight,
  children,
}: PageContainerProps) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--text-muted)]">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <li key={`${crumb.label}-${idx}`} className="flex items-center gap-1.5">
                  {crumb.to && !isLast ? (
                    <Link
                      to={crumb.to}
                      className="hover:text-[var(--text-primary)] transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span
                      aria-current={isLast ? 'page' : undefined}
                      className={isLast ? 'font-medium text-[var(--text-primary)]' : ''}
                    >
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && (
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      {(title || subtitle || kicker) && (
        <header className="mb-8 sm:mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-[var(--border-subtle)] pb-6">
          <div className="max-w-3xl">
            {kicker && (
              <p className="text-xs font-medium text-[var(--accent-primary)] mb-2">
                {kicker}
              </p>
            )}
            {title && (
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--text-primary)] balance-text">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
                {subtitle}
              </p>
            )}
          </div>
          {headerRight && <div className="shrink-0">{headerRight}</div>}
        </header>
      )}

      {children}
    </div>
  );
}
