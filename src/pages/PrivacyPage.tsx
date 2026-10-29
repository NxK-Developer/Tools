import React from 'react';
import { usePageMeta } from '../utilities/seo';
import { PageContainer } from '../components/PageContainer';

export function PrivacyPage() {
  usePageMeta({
    title: 'Privacy Policy',
    description:
      'Read how NxK Tools handles browser storage, theme preferences, and local client-side tool inputs.',
  });

  return (
    <PageContainer
      kicker="Legal & Data Handling"
      title="Privacy Policy"
      subtitle="Clear, plain-language explanation of how the NxK Tools platform processes data in your browser."
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Privacy Policy' }]}
    >
      <div className="max-w-3xl space-y-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8 text-sm leading-relaxed text-[var(--text-secondary)]">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[var(--text-primary)]">
            1. Client-Side Utility Processing
          </h2>
          <p>
            In this foundational version of NxK Tools, implemented utilities (such as the Word
            Counter, Case Converter, Percentage Calculator, and JSON Formatter) process text
            and numbers directly inside your web browser using standard JavaScript APIs. We do
            not operate a backend database to store the text or numbers you type into these
            utilities.
          </p>
        </section>

        <section className="space-y-2 border-t border-[var(--border-subtle)] pt-6">
          <h2 className="text-base font-bold text-[var(--text-primary)]">
            2. No Mandatory Accounts
          </h2>
          <p>
            NxK Tools does not require user registration, login credentials, or personal
            profiles to access any utility in the catalog.
          </p>
        </section>

        <section className="space-y-2 border-t border-[var(--border-subtle)] pt-6">
          <h2 className="text-base font-bold text-[var(--text-primary)]">
            3. Local Storage Usage
          </h2>
          <p>
            We use your browser&apos;s built-in <code className="font-mono text-xs">localStorage</code>{' '}
            solely to remember your interface preferences—specifically the{' '}
            <code className="font-mono text-xs">nxk-theme</code> key (<code className="font-mono text-xs">light</code>{' '}
            or <code className="font-mono text-xs">dark</code>). You can clear this preference at
            any time through your browser settings.
          </p>
        </section>

        <section className="space-y-2 border-t border-[var(--border-subtle)] pt-6">
          <h2 className="text-base font-bold text-[var(--text-primary)]">
            4. Future Feature Updates
          </h2>
          <p>
            As additional utilities are implemented in future iterations, this policy will be
            updated if any tool introduces optional third-party integrations or network
            requests.
          </p>
        </section>
      </div>
    </PageContainer>
  );
}
