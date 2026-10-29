import React from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../utilities/seo';

export function TermsPage() {
  usePageMeta({
    title: 'Terms of Use',
    description:
      'Review the terms of use and conditions for accessing the NxK Tools online utility platform.',
  });

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-enter">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          Terms of Use
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[var(--text-muted)]">
          Last updated: April 28, 2025
        </p>
      </header>

      <div className="liquid-glass-panel rounded-3xl p-6 sm:p-10 space-y-8 text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using NxK Tools (&ldquo;Powerful Tools. Zero Hassle.&rdquo;),
            you agree to use the utilities responsibly and in compliance with applicable
            laws. If you do not agree with these terms, please discontinue use of the
            website.
          </p>
        </section>

        <section className="space-y-2.5 border-t border-[var(--border-subtle)] pt-6">
          <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
            2. &ldquo;As-Is&rdquo; Utility Provision
          </h2>
          <p>
            NxK Tools is provided on an &ldquo;as-is&rdquo; and &ldquo;as-available&rdquo;
            basis without warranties of any kind. Users are responsible for verifying
            compressed images, resized graphics, merged PDFs, calculations, and formatted
            data structures before relying on them in production, academic, or financial
            contexts.
          </p>
        </section>

        <section className="space-y-2.5 border-t border-[var(--border-subtle)] pt-6">
          <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
            3. Intellectual Property &amp; Attribution
          </h2>
          <p>
            NxK Tools is designed and developed by <strong>NxK Developer</strong> (Founder:{' '}
            <strong>Nishant Singh</strong>). You retain full ownership of all files, images,
            documents, and text you process using the client-side tools on this platform.
          </p>
        </section>

        <section className="space-y-2.5 border-t border-[var(--border-subtle)] pt-6">
          <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
            4. Contact
          </h2>
          <p>
            Questions regarding these Terms of Use may be directed via our{' '}
            <Link
              to="/contact"
              className="font-medium text-[var(--accent-primary)] hover:underline"
            >
              Get in Touch page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
