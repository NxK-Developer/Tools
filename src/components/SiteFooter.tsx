import React from 'react';
import { Link } from 'react-router-dom';
import { getAllCategories, getAllTools, ToolAvailability } from '../utilities/toolRegistry';

export function SiteFooter() {
  const categories = getAllCategories();
  const availableTools = getAllTools().filter(
    (tool) => tool.availability === ToolAvailability.AVAILABLE
  );
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand & Tagline */}
          <div>
            <Link
              to="/"
              className="text-base font-bold tracking-tight text-[var(--text-primary)]"
            >
              NxK Tools
            </Link>
            <p className="mt-2 text-sm font-medium text-[var(--text-secondary)]">
              Powerful Tools. Zero Hassle.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
              A browser-first utility platform for everyday tasks across text, images,
              calculations, QR codes, PDFs, and developer workflows. No account required.
            </p>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h2 className="text-xs font-semibold text-[var(--text-primary)]">
              Categories
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={cat.route}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Available Utilities */}
          <div>
            <h2 className="text-xs font-semibold text-[var(--text-primary)]">
              Active Utilities
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {availableTools.map((tool) => (
                <li key={tool.id}>
                  <Link
                    to={tool.route}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/tools"
                  className="text-xs font-medium text-[var(--accent-primary)] hover:underline"
                >
                  View all 9 catalog tools →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Platform & Legal */}
          <div>
            <h2 className="text-xs font-semibold text-[var(--text-primary)]">
              Platform & Policies
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  About NxK Tools
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Contact & Feedback
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[var(--border-subtle)] pt-6 sm:flex-row sm:items-center sm:justify-between text-xs text-[var(--text-muted)]">
          <p>© {currentYear} NxK Tools. Built for straightforward browser-based workflows.</p>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/tools" className="hover:text-[var(--text-primary)] transition-colors">
              Tool Directory
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/privacy" className="hover:text-[var(--text-primary)] transition-colors">
              Privacy
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/terms" className="hover:text-[var(--text-primary)] transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
