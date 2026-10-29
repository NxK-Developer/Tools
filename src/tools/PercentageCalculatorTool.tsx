import React, { useState, useId } from 'react';
import { Calculator, RotateCcw, AlertCircle } from 'lucide-react';
import {
  calculatePercentOf,
  calculateWhatPercent,
  calculatePercentageChange,
} from '../utilities/toolCalculations';

export function PercentageCalculatorTool() {
  const idPrefix = useId();

  // Mode 1: What is X% of Y?
  const [pct1, setPct1] = useState<string>('15');
  const [total1, setTotal1] = useState<string>('240');

  // Mode 2: X is what % of Y?
  const [part2, setPart2] = useState<string>('45');
  const [whole2, setWhole2] = useState<string>('180');

  // Mode 3: Percentage change from X to Y
  const [from3, setFrom3] = useState<string>('120');
  const [to3, setTo3] = useState<string>('150');

  const res1 = calculatePercentOf(parseFloat(pct1), parseFloat(total1));
  const res2 = calculateWhatPercent(parseFloat(part2), parseFloat(whole2));
  const res3 = calculatePercentageChange(parseFloat(from3), parseFloat(to3));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Card 1: X% of Y */}
      <section
        aria-labelledby={`${idPrefix}-h1`}
        className="glass-panel flex flex-col justify-between rounded-2xl p-6"
      >
        <div>
          <h2
            id={`${idPrefix}-h1`}
            className="text-base font-semibold text-[var(--text-primary)]"
          >
            1. Percentage of a Value
          </h2>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Find how much a given percentage of a total number equals.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-5 space-y-4"
          >
            <div>
              <label
                htmlFor={`${idPrefix}-pct1`}
                className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5"
              >
                Percentage (%)
              </label>
              <input
                id={`${idPrefix}-pct1`}
                type="number"
                step="any"
                value={pct1}
                onChange={(e) => setPct1(e.target.value)}
                placeholder="e.g. 15"
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm font-mono text-[var(--text-primary)] focus:border-[var(--accent-primary)] transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor={`${idPrefix}-total1`}
                className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5"
              >
                Of Total Value
              </label>
              <input
                id={`${idPrefix}-total1`}
                type="number"
                step="any"
                value={total1}
                onChange={(e) => setTotal1(e.target.value)}
                placeholder="e.g. 240"
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm font-mono text-[var(--text-primary)] focus:border-[var(--accent-primary)] transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                className="glass-btn-primary flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Calculate</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPct1('15');
                  setTotal1('240');
                }}
                className="glass-btn-secondary inline-flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-medium cursor-pointer"
                aria-label="Reset Percentage of a Value"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset</span>
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 border-t border-[var(--border-subtle)] pt-4 tabular-nums">
          <div className="text-xs text-[var(--text-muted)]">Result</div>
          <div
            data-testid="pct-of-result"
            className="mt-1 text-2xl font-bold font-mono text-[var(--text-primary)]"
          >
            {res1.formatted}
          </div>
          {!res1.isValid ? (
            <p
              role="alert"
              className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--status-danger-text)]"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{res1.formulaDescription}</span>
            </p>
          ) : (
            <p className="mt-1.5 text-xs font-mono text-[var(--text-muted)]">
              {res1.formulaDescription}
            </p>
          )}
        </div>
      </section>

      {/* Card 2: X is what % of Y */}
      <section
        aria-labelledby={`${idPrefix}-h2`}
        className="glass-panel flex flex-col justify-between rounded-2xl p-6"
      >
        <div>
          <h2
            id={`${idPrefix}-h2`}
            className="text-base font-semibold text-[var(--text-primary)]"
          >
            2. Ratio to Percentage
          </h2>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Determine what percentage the first value represents of the second value.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-5 space-y-4"
          >
            <div>
              <label
                htmlFor={`${idPrefix}-part2`}
                className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5"
              >
                Part Value (X)
              </label>
              <input
                id={`${idPrefix}-part2`}
                type="number"
                step="any"
                value={part2}
                onChange={(e) => setPart2(e.target.value)}
                placeholder="e.g. 45"
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm font-mono text-[var(--text-primary)] focus:border-[var(--accent-primary)] transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor={`${idPrefix}-whole2`}
                className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5"
              >
                Base Total Value (Y)
              </label>
              <input
                id={`${idPrefix}-whole2`}
                type="number"
                step="any"
                value={whole2}
                onChange={(e) => setWhole2(e.target.value)}
                placeholder="e.g. 180"
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm font-mono text-[var(--text-primary)] focus:border-[var(--accent-primary)] transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                className="glass-btn-primary flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Calculate</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPart2('45');
                  setWhole2('180');
                }}
                className="glass-btn-secondary inline-flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-medium cursor-pointer"
                aria-label="Reset Ratio to Percentage"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset</span>
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 border-t border-[var(--border-subtle)] pt-4 tabular-nums">
          <div className="text-xs text-[var(--text-muted)]">Result</div>
          <div
            data-testid="what-pct-result"
            className="mt-1 text-2xl font-bold font-mono text-[var(--text-primary)]"
          >
            {res2.formatted}
          </div>
          {!res2.isValid ? (
            <p
              role="alert"
              className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--status-danger-text)]"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{res2.formulaDescription}</span>
            </p>
          ) : (
            <p className="mt-1.5 text-xs font-mono text-[var(--text-muted)]">
              {res2.formulaDescription}
            </p>
          )}
        </div>
      </section>

      {/* Card 3: Percentage Increase / Decrease */}
      <section
        aria-labelledby={`${idPrefix}-h3`}
        className="glass-panel flex flex-col justify-between rounded-2xl p-6"
      >
        <div>
          <h2
            id={`${idPrefix}-h3`}
            className="text-base font-semibold text-[var(--text-primary)]"
          >
            3. Percentage Change
          </h2>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Calculate the percentage increase or decrease between two values.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-5 space-y-4"
          >
            <div>
              <label
                htmlFor={`${idPrefix}-from3`}
                className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5"
              >
                Starting Value
              </label>
              <input
                id={`${idPrefix}-from3`}
                type="number"
                step="any"
                value={from3}
                onChange={(e) => setFrom3(e.target.value)}
                placeholder="e.g. 120"
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm font-mono text-[var(--text-primary)] focus:border-[var(--accent-primary)] transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor={`${idPrefix}-to3`}
                className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5"
              >
                Ending Value
              </label>
              <input
                id={`${idPrefix}-to3`}
                type="number"
                step="any"
                value={to3}
                onChange={(e) => setTo3(e.target.value)}
                placeholder="e.g. 150"
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm font-mono text-[var(--text-primary)] focus:border-[var(--accent-primary)] transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                className="glass-btn-primary flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Calculate</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setFrom3('120');
                  setTo3('150');
                }}
                className="glass-btn-secondary inline-flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-medium cursor-pointer"
                aria-label="Reset Percentage Change"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset</span>
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 border-t border-[var(--border-subtle)] pt-4 tabular-nums">
          <div className="text-xs text-[var(--text-muted)]">Result</div>
          <div
            data-testid="pct-change-result"
            className="mt-1 text-2xl font-bold font-mono text-[var(--text-primary)]"
          >
            {res3.formatted}
          </div>
          {!res3.isValid ? (
            <p
              role="alert"
              className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--status-danger-text)]"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{res3.formulaDescription}</span>
            </p>
          ) : (
            <p className="mt-1.5 text-xs font-mono text-[var(--text-muted)]">
              {res3.formulaDescription}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
