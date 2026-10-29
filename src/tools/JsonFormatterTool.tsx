import React, { useState, useId } from 'react';
import { Copy, Check, RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatAndValidateJson } from '../utilities/toolCalculations';

const SAMPLE_JSON = `{
  "platform": "NxK Tools",
  "tagline": "Powerful Tools. Zero Hassle.",
  "clientSideOnly": true,
  "categories": ["image", "text", "qr", "calculator", "pdf", "developer"],
  "version": 1
}`;

export function JsonFormatterTool() {
  const inputId = useId();
  const outputId = useId();

  const [rawInput, setRawInput] = useState<string>(SAMPLE_JSON);
  const [indent, setIndent] = useState<number>(2);
  const [minify, setMinify] = useState<boolean>(false);
  const [sortKeys, setSortKeys] = useState<boolean>(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const result = formatAndValidateJson(rawInput, { indent, minify, sortKeys });

  const handleCopy = async () => {
    if (!result.isValid || !result.output) return;
    try {
      await navigator.clipboard.writeText(result.output);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Formatting Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg bg-[var(--bg-canvas)] p-1 border border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={() => {
                setMinify(false);
                setIndent(2);
              }}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                !minify && indent === 2
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              2 Spaces
            </button>
            <button
              type="button"
              onClick={() => {
                setMinify(false);
                setIndent(4);
              }}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                !minify && indent === 4
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              4 Spaces
            </button>
            <button
              type="button"
              onClick={() => setMinify(true)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                minify
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Minify
            </button>
          </div>

          <label className="inline-flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={sortKeys}
              onChange={(e) => setSortKeys(e.target.checked)}
              className="h-4 w-4 rounded border-[var(--border-strong)] accent-[var(--accent-primary)]"
            />
            <span>Sort object keys alphabetically</span>
          </label>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 text-xs">
          {result.isValid ? (
            <div className="inline-flex items-center gap-1.5 text-[var(--status-available-text)] font-medium">
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              <span>Valid JSON</span>
              {result.stats && (
                <>
                  <span aria-hidden="true" className="text-[var(--text-muted)]">
                    ·
                  </span>
                  <span className="font-mono text-[var(--text-secondary)]">
                    {result.stats.keysCount} keys · {result.stats.sizeBytes} B
                  </span>
                </>
              )}
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 text-[var(--status-danger-text)] font-medium">
              <AlertCircle className="w-4 h-4" aria-hidden="true" />
              <span>Syntax Error</span>
            </div>
          )}
        </div>
      </div>

      {/* Input / Output Editors */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor={inputId}
              className="text-sm font-semibold text-[var(--text-primary)]"
            >
              Raw JSON Input
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRawInput(SAMPLE_JSON)}
                className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                Sample
              </button>
              <button
                type="button"
                onClick={() => setRawInput('')}
                disabled={rawInput.length === 0}
                className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          <textarea
            id={inputId}
            rows={13}
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder='Paste JSON here, e.g. {"name": "NxK Tools"}'
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] p-4 text-xs sm:text-sm font-mono leading-relaxed text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] transition-colors resize-y"
          />
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor={outputId}
              className="text-sm font-semibold text-[var(--text-primary)]"
            >
              Formatted Output
            </label>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!result.isValid}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-primary)] px-3 py-1 text-xs font-medium text-[var(--accent-contrast)] hover:bg-[var(--accent-primary-hover)] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer whitespace-nowrap"
            >
              {copyStatus === 'copied' ? (
                <>
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Copied JSON</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          </div>

          {result.isValid ? (
            <textarea
              id={outputId}
              rows={13}
              readOnly
              value={result.output}
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 text-xs sm:text-sm font-mono leading-relaxed text-[var(--text-primary)] resize-y"
            />
          ) : (
            <div
              role="alert"
              className="flex h-[314px] flex-col justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--status-danger-bg)] p-6"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--status-danger-text)]">
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Unable to parse JSON</span>
              </div>
              <p className="mt-2 font-mono text-xs leading-relaxed text-[var(--text-primary)]">
                {result.error}
              </p>
              <p className="mt-3 text-xs text-[var(--text-secondary)]">
                Check for trailing commas, unquoted property names, or missing closing brackets.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
