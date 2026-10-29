import React from 'react';
import { usePageMeta } from '../utilities/seo';
import { PageContainer } from '../components/PageContainer';

export function TermsPage() {
  usePageMeta({
    title: 'Terms of Use',
    description:
      'Review the terms of use and conditions for accessing the NxK Tools online utility platform.',
  });

  return (
    <PageContainer
      kicker="Legal & Platform Terms"
      title="Terms of Use"
      subtitle="Guidelines and conditions governing your use of the NxK Tools web application."
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Terms of Use' }]}
    >
      <div className="max-w-3xl space-y-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8 text-sm leading-relaxed text-[var(--text-secondary)]">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[var(--text-primary)]">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using NxK Tools, you agree to use the utilities responsibly and in
            compliance with applicable laws. If you do not agree with these terms, please
            discontinue use of the website.
          </p>
        </section>

        <section className="space-y-2 border-t border-[var(--border-subtle)] pt-6">
          <h2 className="text-base font-bold text-[var(--text-primary)]">
            2. &ldquo;As-Is&rdquo; Utility Provision
          </h2>
          <p>
            NxK Tools is provided on an &ldquo;as-is&rdquo; and &ldquo;as-available&rdquo;
            basis without warranties of any kind. Users are responsible for verifying critical
            calculations, formatted data structures, and document outputs before relying on
            them in production, academic, or financial contexts.
          </p>
        </section>

        <section className="space-y-2 border-t border-[var(--border-subtle)] pt-6">
          <h2 className="text-base font-bold text-[var(--text-primary)]">
            3. Incremental Development & Availability
          </h2>
          <p>
            NxK Tools is developed incrementally. Tools marked as &ldquo;Available&rdquo; in
            the catalog are active for immediate use, while tools marked as &ldquo;In
            development&rdquo; represent planned modules whose routes and specifications are
            reserved in the platform architecture.
          </p>
        </section>

        <section className="space-y-2 border-t border-[var(--border-subtle)] pt-6">
          <h2 className="text-base font-bold text-[var(--text-primary)]">
            4. Acceptable Use
          </h2>
          <p>
            You agree not to attempt to disrupt the availability of the platform or use its
            utilities for unlawful purposes.
          </p>
        </section>
      </div>
    </PageContainer>
  );
}
