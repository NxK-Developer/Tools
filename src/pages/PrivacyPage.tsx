import React from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../utilities/seo';

export function PrivacyPage() {
  usePageMeta({
    title: 'Privacy Policy',
    description:
      'Read how NxK Tools handles browser storage, theme preferences, and local client-side tool inputs.',
  });

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-enter">
      {/* Header matching Mockup 08. Privacy & Terms Page */}
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          Privacy Policy
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[var(--text-muted)]">
          Last updated: April 28, 2025
        </p>
      </header>

      <div className="liquid-glass-panel rounded-3xl p-6 sm:p-10 space-y-8 text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
            1. Information We Collect
          </h2>
          <p>
            We do not require an account to use NxK Tools. We only collect information that
            is necessary for the functionality of the tools and to improve our services. All
            9 utilities—including Image Compressor, Image Resizer, Word Counter, Case
            Converter, QR Code Generator, Percentage Calculator, Images to PDF, Merge PDF,
            and JSON Formatter—process your files and text locally inside your web browser.
          </p>
        </section>

        <section className="space-y-2.5 border-t border-[var(--border-subtle)] pt-6">
          <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Provide and maintain our tools</li>
            <li>Improve user experience and interface accessibility</li>
            <li>Ensure security and prevent abuse</li>
            <li>
              Remember your light or dark theme preference locally via browser{' '}
              <code className="font-mono text-xs">localStorage</code>
            </li>
          </ul>
        </section>

        <section className="space-y-2.5 border-t border-[var(--border-subtle)] pt-6">
          <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
            3. Data Sharing
          </h2>
          <p>
            We do not sell, rent or share your personal information with third parties. Files
            and text processed inside our client-side tools remain on your device.
          </p>
        </section>

        <section className="space-y-2.5 border-t border-[var(--border-subtle)] pt-6">
          <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
            4. Developer &amp; Contact Information
          </h2>
          <p>
            NxK Tools is designed and developed by <strong>NxK Developer</strong> (Founder:{' '}
            <strong>Nishant Singh</strong>). If you have any questions regarding this Privacy
            Policy, please reach out through our{' '}
            <Link
              to="/contact"
              className="font-medium text-[var(--accent-primary)] hover:underline"
            >
              Contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
