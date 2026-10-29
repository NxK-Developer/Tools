import React, { useState, useId } from 'react';
import { Copy, Check, RotateCcw } from 'lucide-react';
import { CaseFormat, convertCase } from '../utilities/toolCalculations';

const CASE_OPTIONS: Array<{ id: CaseFormat; label: string; example: string }> = [
  { id: CaseFormat.SENTENCE_CASE, label: 'Sentence case', example: 'Quick brown fox.' },
  { id: CaseFormat.TITLE_CASE, label: 'Title Case', example: 'Quick Brown Fox' },
  { id: CaseFormat.UPPERCASE, label: 'UPPERCASE', example: 'QUICK BROWN FOX' },
  { id: CaseFormat.LOWERCASE, label: 'lowercase', example: 'quick brown fox' },
  { id: CaseFormat.CAMEL_CASE, label: 'camelCase', example: 'quickBrownFox' },
  { id: CaseFormat.PASCAL_CASE, label: 'PascalCase', example: 'QuickBrownFox' },
  { id: CaseFormat.SNAKE_CASE, label: 'snake_case', example: 'quick_brown_fox' },
  { id: CaseFormat.KEBAB_CASE, label: 'kebab-case', example: 'quick-brown-fox' },
];

export function CaseConverterTool() {
  const inputId = useId();
  const outputId = useId();
  const [sourceText, setSourceText] = useState<string>(
    'Powerful Tools. Zero Hassle. Built for fast browser workflows.'
  );
  const [activeFormat, setActiveFormat] = useState<CaseFormat>(CaseFormat.TITLE_CASE);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');

  const transformedText = convertCase(sourceText, activeFormat);

  const handleCopy = async () => {
    if (!transformedText) return;
    try {
      await navigator.clipboard.writeText(transformedText);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2000);
    } catch {
      setCopyState('error');
      setTimeout(() => setCopyState('idle'), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Format Selector Bar */}
      <div>
        <p className="text-xs font-semibold text-[var(--text-muted)] mb-2.5">
          Select Target Case Format
        </p>
        <div
          role="group"
          aria-label="Case conversion formats"
          className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8"
        >
          {CASE_OPTIONS.map((option) => {
            const isSelected = activeFormat === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setActiveFormat(option.id)}
                aria-pressed={isSelected}
                className={`flex flex-col items-start justify-between rounded-lg border px-3 py-2.5 text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-soft)] text-[var(--text-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span className="text-xs font-semibold whitespace-nowrap">
                  {option.label}
                </span>
                <span className="mt-1 truncate w-full text-[11px] font-mono text-[var(--text-muted)]">
                  {option.example}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dual Pane Input / Output */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Source Text */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor={inputId}
              className="text-sm font-semibold text-[var(--text-primary)]"
            >
              Original Text
            </label>
            <button
              type="button"
              onClick={() => setSourceText('')}
              disabled={sourceText.length === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Clear</span>
            </button>
          </div>
          <textarea
            id={inputId}
            rows={9}
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Enter text to convert..."
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] p-4 text-sm sm:text-base leading-relaxed text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] transition-colors resize-y"
          />
        </div>

        {/* Converted Output */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor={outputId}
              className="text-sm font-semibold text-[var(--text-primary)]"
            >
              Converted Result ({CASE_OPTIONS.find((o) => o.id === activeFormat)?.label})
            </label>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!transformedText}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-primary)] px-3 py-1 text-xs font-medium text-[var(--accent-contrast)] hover:bg-[var(--accent-primary-hover)] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer whitespace-nowrap"
            >
              {copyState === 'copied' ? (
                <>
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Copy Result</span>
                </>
              )}
            </button>
          </div>
          <textarea
            id={outputId}
            rows={9}
            readOnly
            value={transformedText}
            placeholder="Converted output will appear here..."
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 text-sm sm:text-base leading-relaxed font-mono text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-y"
          />
          {copyState === 'error' && (
            <p className="text-xs text-[var(--status-danger-text)]">
              Could not access clipboard automatically. Select the text above and press Ctrl+C / Cmd+C.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
