import React from 'react';
import { Link } from 'react-router-dom';
import { User, ArrowRight, ExternalLink, MessageCircle, Instagram } from 'lucide-react';
import { getAllCategories } from '../utilities/toolRegistry';
import { DEVELOPER_CONFIG } from '../utilities/developerConfig';
import { NxKLogo } from './NxKLogo';

export function SiteFooter() {
  const categories = getAllCategories();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      aria-label="Site footer"
      className="mt-20 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] backdrop-blur-xl transition-colors"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12">
          {/* Column 1: Brand, Tagline, Developer Credit & Contact Buttons */}
          <div className="lg:col-span-5 space-y-4">
            <Link
              to="/"
              aria-label="NxK Tools — Home"
              className="group inline-flex items-center rounded-xl py-0.5 pr-2"
            >
              <NxKLogo size="md" />
            </Link>

            <p className="text-xs sm:text-sm font-semibold text-[var(--accent-primary)]">
              {DEVELOPER_CONFIG.tagline}
            </p>

            <p className="text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)] max-w-sm">
              Everything you need. Nothing you don&apos;t. Practical, browser-first online tools
              for images, PDFs, text, QR codes, calculations, and developer workflows.
            </p>

            {/* Developer Credit & Contact Links */}
            <div className="pt-2 space-y-2.5 text-xs text-[var(--text-secondary)]">
              <p className="font-semibold text-[var(--text-primary)]">
                {DEVELOPER_CONFIG.attribution}
              </p>
              <p className="flex flex-wrap items-center gap-1.5">
                <User
                  className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0"
                  aria-hidden="true"
                />
                <span>Founder: {DEVELOPER_CONFIG.founder}</span>
                <span aria-hidden="true">·</span>
                <Link
                  to="/developer"
                  className="inline-flex items-center gap-0.5 font-semibold text-[var(--accent-primary)] hover:underline"
                >
                  <span>Meet the Developer</span>
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
              </p>

              {/* Direct Instagram & WhatsApp Contact Buttons */}
              <div className="pt-1 flex flex-wrap items-center gap-2">
                <a
                  href={DEVELOPER_CONFIG.instagram.developer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Developer Instagram @nxk-developer (opens in a new tab)"
                  className="liquid-glass-panel inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--accent-border)] hover:text-[var(--accent-primary)] transition-colors whitespace-nowrap"
                >
                  <Instagram className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
                  <span>{DEVELOPER_CONFIG.instagram.developer.handleOrNumber}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60 shrink-0" aria-hidden="true" />
                </a>

                <a
                  href={DEVELOPER_CONFIG.instagram.personal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Personal Instagram @_its.nishant (opens in a new tab)"
                  className="liquid-glass-panel inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--accent-border)] hover:text-[var(--accent-primary)] transition-colors whitespace-nowrap"
                >
                  <Instagram className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
                  <span>{DEVELOPER_CONFIG.instagram.personal.handleOrNumber}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60 shrink-0" aria-hidden="true" />
                </a>

                <a
                  href={DEVELOPER_CONFIG.whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contact on WhatsApp +91 7050809305 (opens in a new tab)"
                  className="btn-primary-glass inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-white transition-all whitespace-nowrap"
                >
                  <MessageCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>WhatsApp: {DEVELOPER_CONFIG.whatsapp.handleOrNumber}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Tool Categories */}
          <div className="lg:col-span-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Tool Categories
            </h2>
            <ul className="mt-3.5 space-y-2.5 text-xs sm:text-sm">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={cat.route}
                    className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/categories"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent-primary)] hover:underline"
                >
                  <span>Browse All Categories</span>
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="lg:col-span-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Quick Links
            </h2>
            <ul className="mt-3.5 space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link
                  to="/"
                  className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/tools"
                  className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  All Tools
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  Search Tools
                </Link>
              </li>
              <li>
                <Link
                  to="/tools/image-compressor"
                  className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  Image Compressor
                </Link>
              </li>
              <li>
                <Link
                  to="/tools/word-counter"
                  className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  Word Counter
                </Link>
              </li>
              <li>
                <Link
                  to="/tools/qr-code-generator"
                  className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  QR Code Generator
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company & Legal (About, Meet the Developer, Contact, Privacy Policy, Terms of Use) */}
          <div className="lg:col-span-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              About &amp; Legal
            </h2>
            <ul className="mt-3.5 space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/developer"
                  className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  Meet the Developer
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Attribution & Legal Bar */}
        <div className="mt-10 flex flex-col gap-3 border-t border-[var(--border-subtle)] pt-6 sm:flex-row sm:items-center sm:justify-between text-xs text-[var(--text-muted)]">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>© {currentYear} {DEVELOPER_CONFIG.productBrand}.</span>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-[var(--text-primary)]">
              {DEVELOPER_CONFIG.attribution}
            </span>
            <span aria-hidden="true">·</span>
            <Link
              to="/developer"
              className="font-medium text-[var(--accent-primary)] hover:underline"
            >
              Meet the Developer (Founder: {DEVELOPER_CONFIG.founder})
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/about" className="hover:text-[var(--text-primary)] transition-colors">
              About
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/contact" className="hover:text-[var(--text-primary)] transition-colors">
              Contact
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/privacy" className="hover:text-[var(--text-primary)] transition-colors">
              Privacy Policy
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/terms" className="hover:text-[var(--text-primary)] transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
