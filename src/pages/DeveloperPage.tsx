import React from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  ShieldCheck,
  Zap,
  Layers,
  ArrowRight,
  Instagram,
  MessageCircle,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { usePageMeta } from '../utilities/seo';
import { NxKLogo } from '../components/NxKLogo';
import { getCatalogSummary } from '../utilities/toolRegistry';
import { DEVELOPER_CONFIG } from '../utilities/developerConfig';

export function DeveloperPage() {
  usePageMeta({
    title: `Meet the Developer — ${DEVELOPER_CONFIG.founder} (${DEVELOPER_CONFIG.developerBrand})`,
    description: `Meet ${DEVELOPER_CONFIG.founder}, Founder of ${DEVELOPER_CONFIG.developerBrand} and creator of ${DEVELOPER_CONFIG.productBrand} — ${DEVELOPER_CONFIG.tagline}`,
  });

  const summary = getCatalogSummary();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-enter space-y-12">
      <header className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent-primary)]">
          MEET THE DEVELOPER
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
          {DEVELOPER_CONFIG.developerBrand}
        </h1>
        <p className="mt-2 text-base sm:text-lg font-semibold text-[var(--text-secondary)]">
          Founder: {DEVELOPER_CONFIG.founder}
        </p>
        <p className="mt-4 text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
          <strong>{DEVELOPER_CONFIG.productBrand}</strong> (&ldquo;
          {DEVELOPER_CONFIG.tagline}&rdquo;) is designed and developed by{' '}
          <strong>{DEVELOPER_CONFIG.developerBrand}</strong>, founded by{' '}
          <strong>{DEVELOPER_CONFIG.founder}</strong>. The platform is built to give people
          easy, immediate access to practical online utilities without mandatory registration
          or unnecessary friction.
        </p>
      </header>

      {/* Primary Profile & Contact Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 liquid-glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
            <NxKLogo size="lg" />
            <div className="text-xs font-semibold text-[var(--text-secondary)]">
              {DEVELOPER_CONFIG.productBrand} · {DEVELOPER_CONFIG.tagline}
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              Every utility in the {DEVELOPER_CONFIG.productBrand} catalog—spanning Image
              compression and resizing, PDF merging and conversion, Text analysis, QR Code
              generation, Calculators, and Developer formatting—is engineered to process data
              directly in the user&apos;s browser wherever practical.
            </p>
            <p>
              By combining standard client-side Web APIs with a responsive Liquid Glass
              interface, <strong>{DEVELOPER_CONFIG.developerBrand}</strong> focuses on three
              core principles: <strong>Simplicity</strong>, <strong>Speed</strong>, and{' '}
              <strong>Privacy</strong>.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-[var(--accent-primary)] tabular-nums">
                {summary.availableTools}
              </div>
              <div className="mt-1 text-xs text-[var(--text-secondary)]">Active Tools</div>
            </div>
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-[var(--accent-primary)] tabular-nums">
                {summary.totalCategories}
              </div>
              <div className="mt-1 text-xs text-[var(--text-secondary)]">Categories</div>
            </div>
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-[var(--accent-primary)]">
                Client-Side
              </div>
              <div className="mt-1 text-xs text-[var(--text-secondary)]">Browser Execution</div>
            </div>
          </div>
        </div>

        {/* Direct Contact Details Card */}
        <div className="lg:col-span-5 liquid-glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Developer &amp; Contact Channels
            </h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                  <User className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs text-[var(--text-muted)]">Founder &amp; Brand</div>
                  <div className="text-sm font-semibold text-[var(--text-primary)]">
                    {DEVELOPER_CONFIG.founder} · {DEVELOPER_CONFIG.developerBrand}
                  </div>
                </div>
              </div>

              <a
                href={DEVELOPER_CONFIG.instagram.developer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 hover:border-[var(--accent-border)] transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                    <Instagram className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-[var(--text-muted)]">Developer Instagram</div>
                    <div className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors truncate">
                      {DEVELOPER_CONFIG.instagram.developer.handleOrNumber}
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
              </a>

              <a
                href={DEVELOPER_CONFIG.instagram.personal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 hover:border-[var(--accent-border)] transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                    <Instagram className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-[var(--text-muted)]">Personal Instagram</div>
                    <div className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors truncate">
                      {DEVELOPER_CONFIG.instagram.personal.handleOrNumber}
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
              </a>

              <a
                href={DEVELOPER_CONFIG.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 hover:border-[var(--accent-border)] transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                    <MessageCircle className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-[var(--text-muted)]">WhatsApp</div>
                    <div className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors truncate">
                      {DEVELOPER_CONFIG.whatsapp.handleOrNumber}
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={DEVELOPER_CONFIG.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-glass inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-semibold text-white"
            >
              <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Chat on WhatsApp</span>
            </a>
            <Link
              to="/contact"
              className="liquid-glass-panel inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
            >
              <span>Contact Page</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* Technologies Used in the Project */}
      <section aria-labelledby="dev-technologies-heading">
        <div className="max-w-2xl mb-5">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">
            <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Technology Stack</span>
          </div>
          <h2
            id="dev-technologies-heading"
            className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]"
          >
            Built With Modern Web Standards
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[var(--text-secondary)]">
            Core technologies used in building and running {DEVELOPER_CONFIG.productBrand}:
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {DEVELOPER_CONFIG.technologies.map((tech) => (
            <div
              key={tech.name}
              className="liquid-glass-panel rounded-2xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="text-sm font-bold text-[var(--text-primary)]">
                  {tech.name}
                </div>
                <div className="mt-0.5 text-xs font-medium text-[var(--accent-primary)]">
                  {tech.role}
                </div>
                <p className="mt-2.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                  {tech.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Engineering Principles */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="liquid-glass-panel rounded-3xl p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            <Zap className="w-5 h-5" aria-hidden="true" />
          </div>
          <h3 className="mt-4 text-base font-bold text-[var(--text-primary)]">
            Zero Hassle Workflow
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            Open any utility directly and complete your task immediately—no registration walls
            or unnecessary steps.
          </p>
        </div>

        <div className="liquid-glass-panel rounded-3xl p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <h3 className="mt-4 text-base font-bold text-[var(--text-primary)]">
            Local Browser Processing
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            Where applicable, images, PDFs, text inputs, and calculations are processed
            directly in your browser tab.
          </p>
        </div>

        <div className="liquid-glass-panel rounded-3xl p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            <Layers className="w-5 h-5" aria-hidden="true" />
          </div>
          <h3 className="mt-4 text-base font-bold text-[var(--text-primary)]">
            Liquid Glass Design
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            Crafted with translucent surfaces, balanced typography, and adaptive Light and
            Dark themes across desktop and mobile.
          </p>
        </div>
      </div>
    </div>
  );
}
