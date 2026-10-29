import React, { useState, useEffect, useId } from 'react';
import { Download, RotateCcw, AlertCircle, CheckCircle2, QrCode } from 'lucide-react';
import {
  generateQrCodeDataUrl,
  QrErrorCorrectionLevel,
  triggerBrowserDownload,
} from '../utilities/mediaAndDocumentUtils';

const QR_PRESETS = [
  {
    label: 'Website URL',
    value: 'https://nxktools.example/tools',
  },
  {
    label: 'Wi-Fi Access',
    value: 'WIFI:T:WPA;S:NxK_Guest_Network;P:ZeroHassle2026;;',
  },
  {
    label: 'Contact Note',
    value: 'NxK Tools — Powerful Tools. Zero Hassle.',
  },
];

export function QrCodeGeneratorTool() {
  const textInputId = useId();
  const sizeSelectId = useId();
  const eccSelectId = useId();
  const marginSelectId = useId();

  const [inputText, setInputText] = useState<string>(
    'https://nxktools.example/tools'
  );
  const [size, setSize] = useState<number>(512);
  const [eccLevel, setEccLevel] = useState<QrErrorCorrectionLevel>('M');
  const [margin, setMargin] = useState<number>(2);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generateTrigger, setGenerateTrigger] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;
    setIsGenerating(true);

    generateQrCodeDataUrl({
      text: inputText,
      width: size,
      margin,
      errorCorrectionLevel: eccLevel,
    }).then((result) => {
      if (cancelled) return;
      setIsGenerating(false);
      if (result.isValid && result.dataUrl) {
        setQrDataUrl(result.dataUrl);
        setErrorMessage(null);
      } else {
        setQrDataUrl(null);
        setErrorMessage(result.error);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [inputText, size, eccLevel, margin, generateTrigger]);

  const handleGenerateQr = () => {
    if (!inputText.trim()) {
      setQrDataUrl(null);
      setErrorMessage('Please enter text or a URL to generate a QR code.');
      return;
    }
    setGenerateTrigger((prev) => prev + 1);
  };

  const handleDownloadPng = () => {
    if (!qrDataUrl) return;
    triggerBrowserDownload(qrDataUrl, `nxk-qrcode-${size}x${size}.png`);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Column: Input & QR Parameters */}
      <div className="lg:col-span-7 space-y-6">
        <div className="glass-panel rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor={textInputId}
              className="text-sm font-semibold text-[var(--text-primary)]"
            >
              URL or Text Content
            </label>
            <div className="flex flex-wrap items-center gap-1.5">
              {QR_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setInputText(preset.value)}
                  className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setInputText('')}
                disabled={inputText.length === 0}
                className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          <textarea
            id={textInputId}
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter a website URL (https://...), plain text, or Wi-Fi string..."
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] p-3.5 text-sm leading-relaxed text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] transition-colors resize-y"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-2 border-t border-[var(--border-subtle)]">
            <div>
              <label
                htmlFor={sizeSelectId}
                className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5"
              >
                PNG Resolution
              </label>
              <select
                id={sizeSelectId}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3 py-2 text-xs sm:text-sm font-mono text-[var(--text-primary)] focus:border-[var(--accent-primary)] transition-colors"
              >
                <option value={256}>256 × 256 px</option>
                <option value={512}>512 × 512 px</option>
                <option value={1024}>1024 × 1024 px</option>
              </select>
            </div>

            <div>
              <label
                htmlFor={eccSelectId}
                className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5"
              >
                Error Correction
              </label>
              <select
                id={eccSelectId}
                value={eccLevel}
                onChange={(e) =>
                  setEccLevel(e.target.value as QrErrorCorrectionLevel)
                }
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3 py-2 text-xs sm:text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] transition-colors"
              >
                <option value="L">Low (7% recovery)</option>
                <option value="M">Medium (15% recovery)</option>
                <option value="Q">Quartile (25% recovery)</option>
                <option value="H">High (30% recovery)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor={marginSelectId}
                className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5"
              >
                Quiet Zone Margin
              </label>
              <select
                id={marginSelectId}
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3 py-2 text-xs sm:text-sm font-mono text-[var(--text-primary)] focus:border-[var(--accent-primary)] transition-colors"
              >
                <option value={1}>1 module (Compact)</option>
                <option value={2}>2 modules (Standard)</option>
                <option value={4}>4 modules (Wide)</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            data-testid="generate-qr-btn"
            onClick={handleGenerateQr}
            disabled={isGenerating}
            className="glass-btn-primary w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold cursor-pointer disabled:opacity-40"
          >
            <QrCode className="w-4 h-4" aria-hidden="true" />
            <span>{isGenerating ? 'Generating QR Code...' : 'Generate QR Code'}</span>
          </button>
        </div>
      </div>

      {/* Right Column: Live QR Preview & PNG Download */}
      <div className="lg:col-span-5">
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between h-full space-y-5">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3.5">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              Generated QR Code
            </h2>
            {qrDataUrl && !isGenerating ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--status-available-text)]">
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Ready ({size}px)</span>
              </span>
            ) : null}
          </div>

          <div className="flex flex-1 items-center justify-center rounded-xl bg-[var(--bg-canvas)] p-6 min-h-[240px]">
            {qrDataUrl ? (
              <img
                data-testid="qr-code-preview-img"
                src={qrDataUrl}
                alt="Generated QR code preview"
                className="h-52 w-52 rounded-lg bg-white p-2 object-contain shadow-xs"
              />
            ) : (
              <div
                role="alert"
                data-testid="qr-error-alert"
                className="text-center max-w-xs space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--status-danger-bg)] p-4 text-[var(--status-danger-text)]"
              >
                <AlertCircle
                  className="w-6 h-6 mx-auto"
                  aria-hidden="true"
                />
                <p className="text-xs font-medium">
                  {errorMessage ?? 'Please enter text or a URL to generate a QR code.'}
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            data-testid="download-qr-btn"
            onClick={handleDownloadPng}
            disabled={!qrDataUrl || isGenerating}
            className="glass-btn-primary w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>Download PNG ({size} × {size} px)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
