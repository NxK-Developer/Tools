import React, { useState, useId } from 'react';
import { Copy, Check, RotateCcw, FileText } from 'lucide-react';
import { analyzeText } from '../utilities/toolCalculations';

const SAMPLE_TEXT = `NxK Tools is designed around a straightforward premise: everyday online tasks should not require creating an account or navigating cluttered interfaces.

Paste your draft, essay, documentation, or social post here to inspect word count, character length, sentence count, and keyword frequency in real time.`;

export function WordCounterTool() {
  const textareaId = useId();
  const [text, setText] = useState<string>(SAMPLE_TEXT);
  const [copyTextStatus, setCopyTextStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const metrics = analyzeText(text);

  const handleCopyText = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopyTextStatus('copied');
      setTimeout(() => setCopyTextStatus('idle'), 2000);
    } catch {
      setCopyTextStatus('error');
      setTimeout(() => setCopyTextStatus('idle'), 3000);
    }
  };

  const handleCopySummary = async () => {
    const summary = [
      `Words: ${metrics.words}`,
      `Characters (with spaces): ${metrics.characters}`,
      `Characters (no spaces): ${metrics.charactersNoSpaces}`,
      `Sentences: ${metrics.sentences}`,
      `Paragraphs: ${metrics.paragraphs}`,
      `Lines: ${metrics.lines}`,
      `Estimated reading time: ${metrics.readingTimeMinutes} min`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(summary);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 3000);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Main Editor Column */}
      <div className="lg:col-span-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label
            htmlFor={textareaId}
            className="text-sm font-semibold text-[var(--text-primary)]"
          >
            Writing Area
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setText(SAMPLE_TEXT)}
              className="glass-btn-secondary inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Load Sample</span>
            </button>
            <button
              type="button"
              data-testid="copy-text-btn"
              onClick={handleCopyText}
              disabled={text.length === 0}
              className="glass-btn-secondary inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium disabled:opacity-40 disabled:pointer-events-none cursor-pointer whitespace-nowrap"
            >
              {copyTextStatus === 'copied' ? (
                <>
                  <Check
                    className="w-3.5 h-3.5 text-[var(--status-available-text)]"
                    aria-hidden="true"
                  />
                  <span>Copied Text</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
            <button
              type="button"
              data-testid="clear-text-btn"
              onClick={() => setText('')}
              disabled={text.length === 0}
              className="glass-btn-secondary inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium disabled:opacity-40 disabled:pointer-events-none cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Clear Text</span>
            </button>
          </div>
        </div>

        <textarea
          id={textareaId}
          rows={12}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here to count words, characters, sentences, and paragraphs..."
          className="w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-input)] p-4 text-sm sm:text-base leading-relaxed text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] transition-colors resize-y"
        />
      </div>

      {/* Metrics & Breakdown Column */}
      <div className="lg:col-span-4 space-y-6">
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between gap-2 pb-4 border-b border-[var(--border-subtle)]">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              Live Statistics
            </h2>
            <button
              type="button"
              onClick={handleCopySummary}
              className="glass-btn-secondary inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium cursor-pointer whitespace-nowrap"
            >
              {copyStatus === 'copied' ? (
                <>
                  <Check
                    className="w-3.5 h-3.5 text-[var(--status-available-text)]"
                    aria-hidden="true"
                  />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>
          </div>

          {(copyStatus === 'error' || copyTextStatus === 'error') && (
            <p className="mt-2 text-xs text-[var(--status-danger-text)]">
              Clipboard access was blocked by the browser.
            </p>
          )}

          <dl className="mt-4 grid grid-cols-2 gap-4 tabular-nums">
            <div>
              <dt className="text-xs text-[var(--text-muted)]">Words</dt>
              <dd
                data-testid="metric-words"
                className="mt-1 text-2xl font-bold text-[var(--text-primary)] font-mono"
              >
                {metrics.words}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--text-muted)]">Characters</dt>
              <dd
                data-testid="metric-characters"
                className="mt-1 text-2xl font-bold text-[var(--text-primary)] font-mono"
              >
                {metrics.characters}
              </dd>
            </div>
            <div className="border-t border-[var(--border-subtle)] pt-3">
              <dt className="text-xs text-[var(--text-muted)]">Characters (No Spaces)</dt>
              <dd
                data-testid="metric-characters-no-spaces"
                className="mt-1 text-lg font-semibold text-[var(--text-primary)] font-mono"
              >
                {metrics.charactersNoSpaces}
              </dd>
            </div>
            <div className="border-t border-[var(--border-subtle)] pt-3">
              <dt className="text-xs text-[var(--text-muted)]">Sentences</dt>
              <dd
                data-testid="metric-sentences"
                className="mt-1 text-lg font-semibold text-[var(--text-primary)] font-mono"
              >
                {metrics.sentences}
              </dd>
            </div>
            <div className="border-t border-[var(--border-subtle)] pt-3">
              <dt className="text-xs text-[var(--text-muted)]">Paragraphs</dt>
              <dd
                data-testid="metric-paragraphs"
                className="mt-1 text-lg font-semibold text-[var(--text-primary)] font-mono"
              >
                {metrics.paragraphs}
              </dd>
            </div>
            <div className="border-t border-[var(--border-subtle)] pt-3">
              <dt className="text-xs text-[var(--text-muted)]">Reading Time</dt>
              <dd className="mt-1 text-lg font-semibold text-[var(--text-primary)] font-mono">
                {metrics.readingTimeMinutes === 0
                  ? '0 min'
                  : `~${metrics.readingTimeMinutes} min`}
              </dd>
            </div>
          </dl>
        </div>

        {/* Top Words Table */}
        <div className="glass-panel rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            Frequent Terms
          </h3>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Excluding common English stop words (3+ characters)
          </p>

          {metrics.topWords.length > 0 ? (
            <ul className="mt-4 divide-y divide-[var(--border-subtle)] text-sm tabular-nums">
              {metrics.topWords.map((item) => (
                <li
                  key={item.word}
                  className="flex items-center justify-between py-2"
                >
                  <span className="font-mono text-xs text-[var(--text-primary)]">
                    {item.word}
                  </span>
                  <span className="font-mono text-xs text-[var(--text-secondary)]">
                    {item.count} {item.count === 1 ? 'occurrence' : 'occurrences'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-xs text-[var(--text-muted)]">
              Enter text with words of 3 or more characters to inspect term frequency.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
