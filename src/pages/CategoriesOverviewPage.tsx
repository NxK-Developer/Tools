import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getAllCategories } from '../utilities/toolRegistry';
import { usePageMeta } from '../utilities/seo';
import { CategoryCard } from '../components/CategoryCard';

export function CategoriesOverviewPage() {
  usePageMeta({
    title: 'Tool Categories',
    description:
      'Explore all NxK Tools categories: Image Tools, PDF Tools, Text Tools, QR Code Tools, Calculators, and Developer Tools.',
  });

  const categories = getAllCategories();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-enter">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-[var(--text-muted)]">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link to="/" className="hover:text-[var(--text-primary)] transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-[var(--text-primary)]" aria-current="page">
            Categories
          </li>
        </ol>
      </nav>

      <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            Categories
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[var(--text-secondary)]">
            Browse tools organized by workflow: Image, PDF, Text, QR Code, Calculators, and
            Developer Tools.
          </p>
        </div>
        <Link
          to="/tools"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[var(--accent-primary)] hover:underline shrink-0"
        >
          <span>Explore All Tools</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} variant="default" />
        ))}
      </div>
    </div>
  );
}
