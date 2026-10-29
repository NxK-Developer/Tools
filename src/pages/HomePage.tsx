import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Zap,
  UserCheck,
  Shield,
  Compass,
  User,
} from 'lucide-react';
import {
  getAllCategories,
  getToolById,
  ToolDefinition,
} from '../utilities/toolRegistry';
import { usePageMeta } from '../utilities/seo';
import { SearchBar } from '../components/SearchBar';
import { CategoryCard } from '../components/CategoryCard';
import { ToolCard } from '../components/ToolCard';
import { NxKLogoMark } from '../components/NxKLogo';

const FEATURED_TOOL_IDS = [
  'image-compressor',
  'image-resizer',
  'word-counter',
  'qr-code-generator',
  'percentage-calculator',
];

export function HomePage() {
  usePageMeta({
    title: 'NxK Tools — Powerful Tools. Zero Hassle.',
    description:
      "Everything you need. Nothing you don't. Access practical online tools for images, PDFs, text, QR codes, calculations, and developer tasks without creating an account.",
  });

  const categories = getAllCategories();
  const featuredTools: ToolDefinition[] = FEATURED_TOOL_IDS.map((id) =>
    getToolById(id)
  ).filter((t): t is ToolDefinition => Boolean(t));

  const handleScrollToCategories = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById('categories');
    if (el) {
      event.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="animate-enter">
      {/* Hero Section Inspired by Apple Liquid Glass Mockup */}
      <section
        aria-labelledby="hero-heading"
        className="relative pt-7 pb-10 sm:pt-14 sm:pb-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          {/* Decorative Left Floating Glass Pill (Desktop) */}
          <div
            aria-hidden="true"
            className="hidden lg:flex items-center gap-3 liquid-glass-panel rounded-2xl px-4 py-3 absolute left-4 xl:left-10 top-36 -rotate-3 shadow-sm pointer-events-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-[var(--text-primary)]">
                Simple Tools
              </div>
              <div className="text-[11px] text-[var(--text-secondary)]">
                Better Workflow
              </div>
            </div>
          </div>

          {/* Decorative Right Floating 3D Glass N Emblem (Desktop) */}
          <div
            aria-hidden="true"
            className="hidden lg:flex items-center justify-center liquid-glass-panel rounded-3xl p-5 absolute right-6 xl:right-14 top-20 rotate-6 shadow-md pointer-events-none"
          >
            <NxKLogoMark className="w-16 h-16 xl:w-20 xl:h-20" />
          </div>

          {/* Centered Hero Content */}
          <div className="mx-auto max-w-2xl text-center relative z-10">
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent-primary)]">
              YOUR EVERYDAY DIGITAL TOOLKIT
            </p>

            <h1
              id="hero-heading"
              className="mt-3 text-3xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-[var(--text-primary)] leading-[1.12] balance-text"
            >
              Everything you need.
              <br />
              Nothing you <span className="text-[var(--accent-primary)]">don&apos;t.</span>
            </h1>

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-[var(--text-secondary)] max-w-xl mx-auto">
              Compress images, format text, generate QR codes, and handle everyday digital
              tasks with practical, fast online tools—without creating an account.
            </p>

            {/* Functional Tool Search Bar with Search Icon & Clear/Submit Action Buttons */}
            <div className="mt-7 max-w-xl mx-auto text-left">
              <SearchBar
                variant="hero"
                placeholder="Search for a tool..."
                label="Search all tools in the NxK Tools catalog"
              />
            </div>

            {/* Primary & Secondary Hero Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/tools"
                className="btn-primary-glass inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white transition-all whitespace-nowrap min-h-[42px]"
              >
                <span>Explore All Tools</span>
              </Link>
              <a
                href="#categories"
                onClick={handleScrollToCategories}
                className="liquid-glass-panel inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors whitespace-nowrap min-h-[42px]"
              >
                <span>Browse Categories</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Homepage Content Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 space-y-14 sm:space-y-18">
        {/* Section 1: Six Category Cards (Image, PDF, Text, QR Code, Calculators, Developer Tools) */}
        <section
          id="categories"
          aria-labelledby="heading-categories"
          className="scroll-mt-24"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div>
              <h2
                id="heading-categories"
                className="text-lg sm:text-xl font-bold tracking-tight text-[var(--text-primary)]"
              >
                Categories
              </h2>
            </div>
            <Link
              to="/categories"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[var(--accent-primary)] hover:underline"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6 sm:gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                variant="compact"
              />
            ))}
          </div>
        </section>

        {/* Section 2: Featured Tools (Image Compressor, Image Resizer, Word Counter, QR Code Generator, Percentage Calculator) */}
        <section aria-labelledby="heading-featured-tools">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between mb-5 sm:mb-6">
            <div>
              <h2
                id="heading-featured-tools"
                className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]"
              >
                Featured Tools
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[var(--text-secondary)]">
                Quick access to our most popular tools.
              </p>
            </div>
            <Link
              to="/tools"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[var(--accent-primary)] hover:underline whitespace-nowrap shrink-0"
            >
              <span>View all tools</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}

            {/* 6th Card: Direct Link to Complete Tool Directory (Case Converter, Images to PDF, Merge PDF, JSON Formatter) */}
            <Link
              to="/tools"
              className="interactive-card group flex items-start justify-between gap-3.5 rounded-2xl p-4 sm:p-5 border-dashed"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 transition-transform duration-200 group-hover:scale-105">
                  <Compass className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                    Explore All Tools
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)] line-clamp-2">
                    Also includes Case Converter, Images to PDF, Merge PDF, and JSON Formatter.
                  </p>
                </div>
              </div>
              <ArrowRight
                className="mt-1 w-4 h-4 shrink-0 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-transform duration-150 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </section>

        {/* Section 3: Why NxK Tools? */}
        <section aria-labelledby="heading-why-nxk">
          <div className="max-w-2xl mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">
              Built for Everyday Productivity
            </p>
            <h2
              id="heading-why-nxk"
              className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]"
            >
              Why NxK Tools?
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
              Practical utilities designed to get out of your way so you can finish your task
              and move on.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            <div className="liquid-glass-panel rounded-3xl p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                <Zap className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-bold tracking-tight text-[var(--text-primary)]">
                Effortless Ease of Use
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
                Every utility features a clean, distraction-free interface with clear controls,
                instant feedback, and one-click copy or download actions.
              </p>
            </div>

            <div className="liquid-glass-panel rounded-3xl p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                <UserCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-bold tracking-tight text-[var(--text-primary)]">
                No Mandatory Registration
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
                Access every tool immediately without creating an account, signing in, or
                navigating onboarding paywalls.
              </p>
            </div>

            <div className="liquid-glass-panel rounded-3xl p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                <Shield className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-bold tracking-tight text-[var(--text-primary)]">
                Browser-Side Processing
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
                Where applicable, tools process your images, PDFs, text, and calculations
                directly inside your browser tab rather than sending files to a remote server.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Developer Credit & Brand Callout */}
        <section aria-labelledby="heading-developer-credit">
          <div className="liquid-glass-panel rounded-3xl p-6 sm:p-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--accent-primary)]">
                <User className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Designed &amp; Developed by NxK Developer</span>
              </div>
              <h2
                id="heading-developer-credit"
                className="text-base sm:text-lg font-bold tracking-tight text-[var(--text-primary)]"
              >
                Powerful Tools. Zero Hassle. — Founder: Nishant Singh
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
                Crafted with care by <strong>NxK Developer</strong> to make everyday digital
                workflows simpler, faster, and more accessible across desktop and mobile.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/developer"
                className="btn-primary-glass inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-semibold text-white"
              >
                <span>Meet the Developer</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
              <Link
                to="/contact"
                className="liquid-glass-panel inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
