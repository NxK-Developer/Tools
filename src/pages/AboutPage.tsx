import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Eye,
  Sliders,
  User,
  Code2,
  ArrowRight,
  ExternalLink,
  Instagram,
  MessageCircle,
} from 'lucide-react';
import { usePageMeta } from '../utilities/seo';
import { DEVELOPER_CONFIG } from '../utilities/developerConfig';
import { NxKLogo } from '../components/NxKLogo';

export function AboutPage() {
  usePageMeta({
    title: 'About NxK Tools — Powerful Tools. Zero Hassle.',
    description:
      'Learn about NxK Tools (Powerful Tools. Zero Hassle.), our mission to make practical digital utilities accessible without friction, and founder Nishant Singh (NxK Developer).',
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-enter space-y-14">
      {/* Main About Section matching Mockup 06. About Page */}
      <section aria-labelledby="about-heading">
        <header className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent-primary)]">
            {DEVELOPER_CONFIG.productBrand} · {DEVELOPER_CONFIG.tagline}
          </p>
          <h1
            id="about-heading"
            className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)]"
          >
            About NxK Tools
          </h1>
          <p className="mt-2.5 text-base sm:text-lg font-medium text-[var(--text-secondary)]">
            A simple idea. A powerful collection of tools.
          </p>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
            <strong>{DEVELOPER_CONFIG.productBrand}</strong> (&ldquo;{DEVELOPER_CONFIG.tagline}
            &rdquo;) is a modern online utility platform built with one clear purpose: making
            useful digital utilities easy to access without unnecessary friction. Whether you
            are compressing an image, resizing dimensions, counting words, generating a QR
            code, calculating percentages, or formatting JSON, every tool opens immediately in
            your browser without mandatory sign-ups or clutter.
          </p>
        </header>

        {/* 3 Cards Grid matching Mockup 06: Our Mission, Our Vision, Our Values */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
          {/* Card 1: Our Mission */}
          <div className="liquid-glass-panel rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <ShieldCheck className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-lg font-bold text-[var(--text-primary)]">
              Our Mission
            </h2>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
              Build simple tools that solve real problems without registration walls or
              complicated workflows.
            </p>
          </div>

          {/* Card 2: Our Vision */}
          <div className="liquid-glass-panel rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <Eye className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-lg font-bold text-[var(--text-primary)]">
              Our Vision
            </h2>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
              A more productive and creative internet where everyday utilities are fast,
              accessible, and respectful of user focus.
            </p>
          </div>

          {/* Card 3: Our Values */}
          <div className="liquid-glass-panel rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <Sliders className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-lg font-bold text-[var(--text-primary)]">
              Our Values
            </h2>
            <ul className="mt-2 space-y-1 text-xs sm:text-sm text-[var(--text-secondary)]">
              <li>• Simplicity</li>
              <li>• Speed</li>
              <li>• Privacy</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Dedicated Meet the Developer Profile Card */}
      <section
        id="meet-the-developer"
        aria-labelledby="meet-developer-heading"
        className="scroll-mt-24"
      >
        <div className="liquid-glass-panel rounded-3xl p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
            {/* Left Column: Developer Identity & Concise Introduction */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">
                <User className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Meet the Developer</span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
                <div>
                  <h2
                    id="meet-developer-heading"
                    className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]"
                  >
                    {DEVELOPER_CONFIG.developerBrand}
                  </h2>
                  <p className="mt-1 text-sm sm:text-base font-semibold text-[var(--accent-primary)]">
                    Founder: {DEVELOPER_CONFIG.founder}
                  </p>
                </div>
                <NxKLogo size="md" />
              </div>

              <p className="text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
                <strong>{DEVELOPER_CONFIG.productBrand}</strong> (&ldquo;
                {DEVELOPER_CONFIG.tagline}&rdquo;) is designed and developed by{' '}
                <strong>{DEVELOPER_CONFIG.developerBrand}</strong>, founded by{' '}
                <strong>{DEVELOPER_CONFIG.founder}</strong>. The focus behind{' '}
                {DEVELOPER_CONFIG.developerBrand} is building practical, dependable digital
                tools that run cleanly in modern web browsers—helping people finish everyday
                image, document, text, QR, calculation, and formatting tasks quickly.
              </p>

              {/* Direct Contact Buttons (Both Instagram Accounts + WhatsApp) */}
              <div className="pt-2 space-y-2.5">
                <div className="text-xs font-semibold text-[var(--text-primary)]">
                  Connect with {DEVELOPER_CONFIG.developerBrand} &amp; {DEVELOPER_CONFIG.founder}
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href={DEVELOPER_CONFIG.instagram.developer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="liquid-glass-panel inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-border)] hover:text-[var(--accent-primary)] transition-colors whitespace-nowrap min-h-[40px]"
                  >
                    <Instagram className="w-4 h-4 text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
                    <span>Developer: {DEVELOPER_CONFIG.instagram.developer.handleOrNumber}</span>
                    <ExternalLink className="w-3 h-3 opacity-60 shrink-0" aria-hidden="true" />
                  </a>

                  <a
                    href={DEVELOPER_CONFIG.instagram.personal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="liquid-glass-panel inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-border)] hover:text-[var(--accent-primary)] transition-colors whitespace-nowrap min-h-[40px]"
                  >
                    <Instagram className="w-4 h-4 text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
                    <span>Personal: {DEVELOPER_CONFIG.instagram.personal.handleOrNumber}</span>
                    <ExternalLink className="w-3 h-3 opacity-60 shrink-0" aria-hidden="true" />
                  </a>

                  <a
                    href={DEVELOPER_CONFIG.whatsapp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary-glass inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold text-white transition-all whitespace-nowrap min-h-[40px]"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>WhatsApp: {DEVELOPER_CONFIG.whatsapp.handleOrNumber}</span>
                    <ExternalLink className="w-3 h-3 opacity-80 shrink-0" aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/developer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-primary)] hover:underline"
                >
                  <span>View dedicated Developer Profile page</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
                <span aria-hidden="true" className="text-[var(--text-muted)]">
                  ·
                </span>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-primary)] hover:underline"
                >
                  <span>Open Contact Page</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Right Column: Profile Summary Cards */}
            <div className="lg:col-span-5 grid grid-cols-1 gap-3">
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 flex items-center gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                  <User className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs text-[var(--text-muted)]">Founder &amp; Developer Brand</div>
                  <div className="text-sm font-semibold text-[var(--text-primary)]">
                    {DEVELOPER_CONFIG.founder} · {DEVELOPER_CONFIG.developerBrand}
                  </div>
                </div>
              </div>

              <a
                href={DEVELOPER_CONFIG.instagram.developer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 flex items-center justify-between gap-3.5 hover:border-[var(--accent-border)] transition-colors"
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
                className="group rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 flex items-center justify-between gap-3.5 hover:border-[var(--accent-border)] transition-colors"
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
                className="group rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 flex items-center justify-between gap-3.5 hover:border-[var(--accent-border)] transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                    <MessageCircle className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-[var(--text-muted)]">WhatsApp Contact</div>
                    <div className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors truncate">
                      {DEVELOPER_CONFIG.whatsapp.handleOrNumber}
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Genuine Technologies Used in NxK Tools */}
      <section aria-labelledby="technologies-heading">
        <div className="max-w-2xl mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">
            <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Project Architecture</span>
          </div>
          <h2
            id="technologies-heading"
            className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]"
          >
            Technologies Used in {DEVELOPER_CONFIG.productBrand}
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            {DEVELOPER_CONFIG.productBrand} is built with modern client-side web technologies so
            tools load quickly and process data directly in your browser.
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
    </div>
  );
}
