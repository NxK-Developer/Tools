import React, { useState, useId } from 'react';
import { Copy, Check, Mail, AlertCircle } from 'lucide-react';
import { usePageMeta } from '../utilities/seo';
import { PageContainer } from '../components/PageContainer';

interface InquiryNote {
  id: string;
  topic: string;
  subject: string;
  message: string;
  createdAt: string;
}

export function ContactPage() {
  usePageMeta({
    title: 'Contact & Feedback',
    description:
      'Prepare a structured tool request, bug report, or feedback message for the NxK Tools team.',
  });

  const formId = useId();
  const [topic, setTopic] = useState<string>('Tool Request');
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [preparedInquiry, setPreparedInquiry] = useState<InquiryNote | null>(null);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');

  const handlePrepareMessage = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedSubject) {
      setValidationError('Please enter a brief subject for your inquiry.');
      return;
    }
    if (trimmedMessage.length < 10) {
      setValidationError('Please provide a message of at least 10 characters.');
      return;
    }

    setValidationError(null);
    const note: InquiryNote = {
      id: `INQ-${Date.now().toString().slice(-6)}`,
      topic,
      subject: trimmedSubject,
      message: trimmedMessage,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setPreparedInquiry(note);
  };

  const formattedPlainText = preparedInquiry
    ? [
        `Reference: ${preparedInquiry.id}`,
        `Topic: ${preparedInquiry.topic}`,
        `Date: ${preparedInquiry.createdAt}`,
        `Subject: ${preparedInquiry.subject}`,
        '',
        preparedInquiry.message,
      ].join('\n')
    : '';

  const handleCopyPrepared = async () => {
    if (!formattedPlainText) return;
    try {
      await navigator.clipboard.writeText(formattedPlainText);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2000);
    } catch {
      setCopyState('error');
      setTimeout(() => setCopyState('idle'), 3000);
    }
  };

  const mailtoHref = preparedInquiry
    ? `mailto:feedback@nxktools.example?subject=${encodeURIComponent(
        `[${preparedInquiry.topic}] ${preparedInquiry.subject}`
      )}&body=${encodeURIComponent(formattedPlainText)}`
    : '#';

  return (
    <PageContainer
      kicker="Support & Feedback"
      title="Contact NxK Tools"
      subtitle="Have a suggestion for a new utility or found an issue with an existing tool? Prepare a structured message below."
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Form Column */}
        <div className="lg:col-span-7">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8">
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              Inquiry & Feedback Composer
            </h2>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              Because this initial version of NxK Tools operates entirely client-side without a
              backend server, submitting this form formats your inquiry locally so you can copy
              it or open it directly in your email client.
            </p>

            <form onSubmit={handlePrepareMessage} className="mt-6 space-y-5" noValidate>
              {validationError && (
                <div
                  role="alert"
                  className="flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--status-danger-bg)] px-4 py-3 text-xs font-medium text-[var(--status-danger-text)]"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{validationError}</span>
                </div>
              )}

              <div>
                <label
                  htmlFor={`${formId}-topic`}
                  className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5"
                >
                  Inquiry Category
                </label>
                <select
                  id={`${formId}-topic`}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] transition-colors"
                >
                  <option value="Tool Request">Request a New Tool</option>
                  <option value="Bug Report">Report a Bug or Calculation Issue</option>
                  <option value="Accessibility">Accessibility or Theme Feedback</option>
                  <option value="General Inquiry">General Question</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor={`${formId}-subject`}
                  className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5"
                >
                  Subject
                </label>
                <input
                  id={`${formId}-subject`}
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Add CSV to JSON support or feedback on Word Counter"
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor={`${formId}-message`}
                  className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5"
                >
                  Details
                </label>
                <textarea
                  id={`${formId}-message`}
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe the feature, input format, or issue you encountered..."
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] p-3.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] transition-colors resize-y"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-[var(--accent-primary)] px-5 py-2.5 text-xs font-semibold text-[var(--accent-contrast)] hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
              >
                Prepare Structured Inquiry
              </button>
            </form>
          </div>
        </div>

        {/* Output / Info Column */}
        <div className="lg:col-span-5 space-y-6">
          {preparedInquiry ? (
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-[var(--border-subtle)]">
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                  Prepared Inquiry ({preparedInquiry.id})
                </h2>
                <span className="text-xs font-medium text-[var(--status-available-text)]">
                  Ready to Copy or Send
                </span>
              </div>

              <pre className="mt-4 whitespace-pre-wrap rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4 text-xs font-mono text-[var(--text-primary)] leading-relaxed">
                {formattedPlainText}
              </pre>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyPrepared}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-primary)] px-3.5 py-2 text-xs font-medium text-[var(--accent-contrast)] hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
                >
                  {copyState === 'copied' ? (
                    <>
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Copied Inquiry Text</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Copy Inquiry Text</span>
                    </>
                  )}
                </button>

                <a
                  href={mailtoHref}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3.5 py-2 text-xs font-medium text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Open in Email App</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                What to Include in Feedback
              </h2>
              <ul className="mt-3 space-y-2.5 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                <li>
                  <strong className="text-[var(--text-primary)]">Tool Name:</strong> Let us
                  know which utility or planned catalog item you are referencing.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Sample Input:</strong> If
                  reporting a formatting or calculation bug, include a non-sensitive sample
                  input that reproduces the behavior.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Device & Theme:</strong>{' '}
                  Mention whether you are using Light or Dark mode and your screen size if the
                  issue is visual.
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
