import React, { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import {
  Instagram,
  MessageCircle,
  Copy,
  Check,
  AlertCircle,
  User,
  ExternalLink,
  Info,
  RotateCcw,
} from 'lucide-react';
import { usePageMeta } from '../utilities/seo';
import {
  DEVELOPER_CONFIG,
  buildWhatsAppMessageUrl,
} from '../utilities/developerConfig';

interface PreparedMessage {
  name: string;
  topic: string;
  message: string;
}

export function ContactPage() {
  usePageMeta({
    title: `Get in Touch — Contact ${DEVELOPER_CONFIG.productBrand}`,
    description: `Contact ${DEVELOPER_CONFIG.productBrand} and ${DEVELOPER_CONFIG.developerBrand} (Founder: ${DEVELOPER_CONFIG.founder}) via Instagram (${DEVELOPER_CONFIG.instagram.developer.handleOrNumber}, ${DEVELOPER_CONFIG.instagram.personal.handleOrNumber}) or WhatsApp (${DEVELOPER_CONFIG.whatsapp.handleOrNumber}).`,
  });

  const formId = useId();
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('General Feedback');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [prepared, setPrepared] = useState<PreparedMessage | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedTopic = topic.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) {
      setError('Please enter your name before preparing your message.');
      setPrepared(null);
      return;
    }
    if (trimmedName.length < 2) {
      setError('Please enter a name with at least 2 characters.');
      setPrepared(null);
      return;
    }
    if (!trimmedMessage) {
      setError('Please enter a message.');
      setPrepared(null);
      return;
    }
    if (trimmedMessage.length < 5) {
      setError('Please enter a message of at least 5 characters.');
      setPrepared(null);
      return;
    }

    setError(null);
    setPrepared({
      name: trimmedName,
      topic: trimmedTopic || 'General Inquiry',
      message: trimmedMessage,
    });
  };

  const handleResetForm = () => {
    setName('');
    setTopic('General Feedback');
    setMessage('');
    setError(null);
    setPrepared(null);
    setCopied(false);
  };

  const formattedBody = prepared
    ? `Hello ${DEVELOPER_CONFIG.developerBrand},\nName: ${prepared.name}\nTopic: ${prepared.topic}\n\n${prepared.message}`
    : '';

  const handleCopy = async () => {
    if (!formattedBody) return;
    try {
      await navigator.clipboard.writeText(formattedBody);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  const whatsappDirectWithText = prepared
    ? buildWhatsAppMessageUrl(prepared)
    : DEVELOPER_CONFIG.whatsapp.url;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-enter">
      {/* Header matching Mockup 07. Contact Page */}
      <header className="max-w-2xl mb-8 sm:mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent-primary)]">
          {DEVELOPER_CONFIG.productBrand} · {DEVELOPER_CONFIG.developerBrand}
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
          Get in Touch
        </h1>
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
          Have a question, feature suggestion, or bug report for{' '}
          <strong>{DEVELOPER_CONFIG.productBrand}</strong>? Reach out directly to{' '}
          <strong>{DEVELOPER_CONFIG.developerBrand}</strong> (Founder:{' '}
          <strong>{DEVELOPER_CONFIG.founder}</strong>) on Instagram or WhatsApp.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 items-start">
        {/* Left Column: Direct Contact Channels from Centralized Configuration */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Direct Contact Channels
          </h2>

          {/* Developer Instagram Card */}
          <div className="liquid-glass-panel rounded-2xl p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                  <Instagram className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[var(--text-muted)]">
                    {DEVELOPER_CONFIG.instagram.developer.label}
                  </div>
                  <div className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                    {DEVELOPER_CONFIG.instagram.developer.handleOrNumber}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
              {DEVELOPER_CONFIG.instagram.developer.description}
            </p>
            <a
              href={DEVELOPER_CONFIG.instagram.developer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="liquid-glass-panel w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-border)] hover:text-[var(--accent-primary)] transition-colors min-h-[42px]"
            >
              <Instagram className="w-4 h-4 text-[var(--accent-primary)]" aria-hidden="true" />
              <span>Open {DEVELOPER_CONFIG.instagram.developer.handleOrNumber}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
            </a>
          </div>

          {/* Personal Instagram Card */}
          <div className="liquid-glass-panel rounded-2xl p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                  <Instagram className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[var(--text-muted)]">
                    {DEVELOPER_CONFIG.instagram.personal.label}
                  </div>
                  <div className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                    {DEVELOPER_CONFIG.instagram.personal.handleOrNumber}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
              {DEVELOPER_CONFIG.instagram.personal.description}
            </p>
            <a
              href={DEVELOPER_CONFIG.instagram.personal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="liquid-glass-panel w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-border)] hover:text-[var(--accent-primary)] transition-colors min-h-[42px]"
            >
              <Instagram className="w-4 h-4 text-[var(--accent-primary)]" aria-hidden="true" />
              <span>Open {DEVELOPER_CONFIG.instagram.personal.handleOrNumber}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
            </a>
          </div>

          {/* WhatsApp Contact Card */}
          <div className="liquid-glass-panel rounded-2xl p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                  <MessageCircle className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[var(--text-muted)]">
                    {DEVELOPER_CONFIG.whatsapp.label}
                  </div>
                  <div className="text-sm sm:text-base font-bold text-[var(--text-primary)] tabular-nums">
                    {DEVELOPER_CONFIG.whatsapp.handleOrNumber}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
              {DEVELOPER_CONFIG.whatsapp.description}
            </p>
            <a
              href={DEVELOPER_CONFIG.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-glass w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-white transition-all min-h-[42px]"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>Chat on WhatsApp ({DEVELOPER_CONFIG.whatsapp.handleOrNumber})</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" aria-hidden="true" />
            </a>
          </div>

          {/* Developer Identity Card */}
          <div className="liquid-glass-panel rounded-2xl p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                <User className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[var(--text-primary)]">
                  {DEVELOPER_CONFIG.developerBrand}
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  Founder: {DEVELOPER_CONFIG.founder}
                </div>
              </div>
            </div>
            <Link
              to="/developer"
              className="text-xs font-semibold text-[var(--accent-primary)] hover:underline whitespace-nowrap"
            >
              Developer Profile →
            </Link>
          </div>
        </div>

        {/* Right Column: Message Composer & Direct Handoff Form */}
        <div className="lg:col-span-7">
          <div className="liquid-glass-panel rounded-3xl p-6 sm:p-8 space-y-5">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                Prepare a Direct Message
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[var(--text-secondary)]">
                Compose your message below to validate and format it for WhatsApp or Instagram.
              </p>
            </div>

            {/* Transparent Notice explaining no backend form service is configured */}
            <div className="flex items-start gap-2.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 text-xs leading-relaxed text-[var(--text-secondary)]">
              <Info
                className="w-4 h-4 shrink-0 text-[var(--accent-primary)] mt-0.5"
                aria-hidden="true"
              />
              <span>
                <strong>Client-Side Notice:</strong> Because {DEVELOPER_CONFIG.productBrand}{' '}
                runs 100% locally in your browser without a backend form server, this form
                does not automatically transmit messages in the background. After validating
                your fields below, you can open your message directly in{' '}
                <strong>WhatsApp ({DEVELOPER_CONFIG.whatsapp.handleOrNumber})</strong> or copy
                it to send on <strong>Instagram</strong>.
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {error && (
                <div
                  role="alert"
                  className="flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--status-danger-bg)] px-4 py-3 text-xs font-medium text-[var(--status-danger-text)]"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor={`${formId}-name`}
                    className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5"
                  >
                    Your Name
                  </label>
                  <input
                    id={`${formId}-name`}
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`${formId}-topic`}
                    className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5"
                  >
                    Topic
                  </label>
                  <select
                    id={`${formId}-topic`}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] transition-colors"
                  >
                    <option value="General Feedback">General Feedback</option>
                    <option value="Tool Suggestion">Tool Suggestion</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Collaboration">Collaboration</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor={`${formId}-message`}
                  className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5"
                >
                  Message
                </label>
                <textarea
                  id={`${formId}-message`}
                  rows={5}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Write your question, feedback, or tool request..."
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] p-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] transition-colors resize-y"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  className="btn-primary-glass flex-1 rounded-xl py-3.5 px-5 text-sm font-semibold text-white transition-all cursor-pointer min-h-[44px]"
                >
                  Validate &amp; Prepare Message
                </button>
                {(name || message || prepared) && (
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="liquid-glass-panel inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-3.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer min-h-[44px]"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </form>

            {prepared && (
              <div
                role="region"
                aria-label="Prepared message actions"
                className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4 animate-enter"
              >
                <div>
                  <span className="text-xs font-bold text-[var(--accent-primary)]">
                    Message Ready — Choose How to Send
                  </span>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                    Your message has been validated locally. Because no server-side mail
                    service is configured, use one of the direct links below to send your
                    message to <strong>{DEVELOPER_CONFIG.developerBrand}</strong>:
                  </p>
                </div>

                <pre className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3 text-xs font-mono text-[var(--text-primary)] whitespace-pre-wrap overflow-x-auto">
                  {formattedBody}
                </pre>

                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href={whatsappDirectWithText}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary-glass inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold text-white min-h-[40px]"
                  >
                    <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Send via WhatsApp ({DEVELOPER_CONFIG.whatsapp.handleOrNumber})</span>
                    <ExternalLink className="w-3 h-3 opacity-80" aria-hidden="true" />
                  </a>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="liquid-glass-panel inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold text-[var(--text-primary)] cursor-pointer min-h-[40px]"
                  >
                    {copied ? (
                      <>
                        <Check
                          className="w-3.5 h-3.5 text-[var(--status-available-text)]"
                          aria-hidden="true"
                        />
                        <span>Copied to Clipboard</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Copy Message</span>
                      </>
                    )}
                  </button>

                  <a
                    href={DEVELOPER_CONFIG.instagram.developer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="liquid-glass-panel inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-border)] transition-colors min-h-[40px]"
                  >
                    <Instagram className="w-3.5 h-3.5 text-[var(--accent-primary)]" aria-hidden="true" />
                    <span>DM {DEVELOPER_CONFIG.instagram.developer.handleOrNumber}</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
