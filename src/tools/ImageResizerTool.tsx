import React, { useState, useEffect, useId } from 'react';
import {
  Upload,
  Download,
  RotateCcw,
  Lock,
  Unlock,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import {
  formatFileSize,
  validateImageFileMetadata,
  calculateAspectLockedDimensions,
  calculatePercentageDimensions,
  clampDimension,
  triggerBrowserDownload,
  SupportedImageMime,
} from '../utilities/mediaAndDocumentUtils';

interface LoadedSourceImage {
  name: string;
  originalBytes: number;
  width: number;
  height: number;
  previewUrl: string;
  mimeType: SupportedImageMime;
}

interface ResizedOutputState {
  blob: Blob;
  previewUrl: string;
  bytes: number;
  width: number;
  height: number;
}

function createSampleResizerImage(): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas 2D context is unavailable.'));
      return;
    }

    const grad = ctx.createLinearGradient(0, 0, 1600, 1000);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.5, '#3730a3');
    grad.addColorStop(1, '#1e293b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1600, 1000);

    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 60, 1480, 880);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 54px sans-serif';
    ctx.fillText('NxK Tools — Aspect Ratio Test Frame', 120, 470);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '30px sans-serif';
    ctx.fillText('Original Resolution: 1600 × 1000 px (16:10)', 120, 535);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to create sample image.'));
          return;
        }
        resolve(
          new File([blob], 'sample-frame-1600x1000.png', { type: 'image/png' })
        );
      },
      'image/png'
    );
  });
}

export function ImageResizerTool() {
  const fileInputId = useId();
  const widthInputId = useId();
  const heightInputId = useId();
  const formatSelectId = useId();

  const [sourceImage, setSourceImage] = useState<LoadedSourceImage | null>(null);
  const [widthInput, setWidthInput] = useState<string>('800');
  const [heightInput, setHeightInput] = useState<string>('500');
  const [targetWidth, setTargetWidth] = useState<number>(800);
  const [targetHeight, setTargetHeight] = useState<number>(500);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [outputFormat, setOutputFormat] =
    useState<SupportedImageMime>('image/png');
  const [resizedOutput, setResizedOutput] =
    useState<ResizedOutputState | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dimensionError, setDimensionError] = useState<string | null>(null);
  const [resizeRunTrigger, setResizeRunTrigger] = useState<number>(0);

  useEffect(() => {
    return () => {
      if (sourceImage?.previewUrl) URL.revokeObjectURL(sourceImage.previewUrl);
      if (resizedOutput?.previewUrl)
        URL.revokeObjectURL(resizedOutput.previewUrl);
    };
  }, []);

  const validateDimensionStrings = (
    rawW: string,
    rawH: string
  ): { valid: boolean; w: number; h: number; error: string | null } => {
    const trimmedW = rawW.trim();
    const trimmedH = rawH.trim();
    if (!trimmedW || !trimmedH) {
      return {
        valid: false,
        w: 0,
        h: 0,
        error: 'Both width and height are required. Enter positive whole numbers in pixels.',
      };
    }
    const parsedW = Number(trimmedW);
    const parsedH = Number(trimmedH);
    if (
      !Number.isFinite(parsedW) ||
      !Number.isFinite(parsedH) ||
      !Number.isInteger(parsedW) ||
      !Number.isInteger(parsedH)
    ) {
      return {
        valid: false,
        w: 0,
        h: 0,
        error: 'Width and height must be whole pixel numbers (e.g., 800 × 600).',
      };
    }
    if (parsedW <= 0 || parsedH <= 0) {
      return {
        valid: false,
        w: 0,
        h: 0,
        error: 'Dimensions must be greater than 0 pixels.',
      };
    }
    if (parsedW > 8192 || parsedH > 8192) {
      return {
        valid: false,
        w: 0,
        h: 0,
        error: 'Maximum supported canvas dimension is 8192 × 8192 pixels.',
      };
    }
    return { valid: true, w: parsedW, h: parsedH, error: null };
  };

  const loadFile = (file: File) => {
    setErrorMessage(null);
    setDimensionError(null);
    const validation = validateImageFileMetadata(file);
    if (!validation.isValid) {
      setErrorMessage(validation.error);
      return;
    }

    setIsProcessing(true);
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      const detectedMime: SupportedImageMime =
        file.type === 'image/jpeg' || file.type === 'image/webp'
          ? (file.type as SupportedImageMime)
          : 'image/png';

      setSourceImage((prev) => {
        if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
        return {
          name: file.name,
          originalBytes: file.size,
          width: w,
          height: h,
          previewUrl: objectUrl,
          mimeType: detectedMime,
        };
      });
      setWidthInput(String(w));
      setHeightInput(String(h));
      setTargetWidth(w);
      setTargetHeight(h);
      setOutputFormat(detectedMime);
      setIsProcessing(false);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setIsProcessing(false);
      setErrorMessage(
        `Unable to read image dimensions from "${file.name}". Please upload a valid JPEG, PNG, or WebP file.`
      );
    };

    img.src = objectUrl;
  };

  // Render resized canvas output when valid dimensions or format change
  useEffect(() => {
    if (!sourceImage) {
      setResizedOutput(null);
      return;
    }
    if (dimensionError) {
      return;
    }

    const safeW = clampDimension(targetWidth);
    const safeH = clampDimension(targetHeight);
    let cancelled = false;
    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      const canvas = document.createElement('canvas');
      canvas.width = safeW;
      canvas.height = safeH;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        setErrorMessage('Browser HTML5 Canvas context is unavailable.');
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      if (outputFormat === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, safeW, safeH);
      }
      ctx.drawImage(img, 0, 0, safeW, safeH);

      canvas.toBlob(
        (blob) => {
          if (cancelled) return;
          if (!blob) {
            setIsProcessing(false);
            setErrorMessage('Failed to encode resized image.');
            return;
          }
          const nextUrl = URL.createObjectURL(blob);
          setResizedOutput((prev) => {
            if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
            return {
              blob,
              previewUrl: nextUrl,
              bytes: blob.size,
              width: safeW,
              height: safeH,
            };
          });
          setIsProcessing(false);
        },
        outputFormat,
        0.92
      );
    };

    img.src = sourceImage.previewUrl;

    return () => {
      cancelled = true;
    };
  }, [sourceImage, targetWidth, targetHeight, outputFormat, dimensionError, resizeRunTrigger]);

  const handleWidthChange = (rawVal: string) => {
    setWidthInput(rawVal);
    const trimmed = rawVal.trim();
    const parsed = Number(trimmed);

    if (!trimmed || !Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed <= 0 || parsed > 8192) {
      const check = validateDimensionStrings(rawVal, heightInput);
      setDimensionError(check.error);
      return;
    }

    if (sourceImage && lockAspect) {
      const next = calculateAspectLockedDimensions(
        sourceImage.width,
        sourceImage.height,
        'width',
        parsed
      );
      setHeightInput(String(next.height));
      setDimensionError(null);
      setTargetWidth(next.width);
      setTargetHeight(next.height);
    } else {
      const check = validateDimensionStrings(rawVal, heightInput);
      setDimensionError(check.error);
      if (check.valid) {
        setTargetWidth(check.w);
        setTargetHeight(check.h);
      }
    }
  };

  const handleHeightChange = (rawVal: string) => {
    setHeightInput(rawVal);
    const trimmed = rawVal.trim();
    const parsed = Number(trimmed);

    if (!trimmed || !Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed <= 0 || parsed > 8192) {
      const check = validateDimensionStrings(widthInput, rawVal);
      setDimensionError(check.error);
      return;
    }

    if (sourceImage && lockAspect) {
      const next = calculateAspectLockedDimensions(
        sourceImage.width,
        sourceImage.height,
        'height',
        parsed
      );
      setWidthInput(String(next.width));
      setDimensionError(null);
      setTargetWidth(next.width);
      setTargetHeight(next.height);
    } else {
      const check = validateDimensionStrings(widthInput, rawVal);
      setDimensionError(check.error);
      if (check.valid) {
        setTargetWidth(check.w);
        setTargetHeight(check.h);
      }
    }
  };

  const handleApplyResize = () => {
    setErrorMessage(null);
    const check = validateDimensionStrings(widthInput, heightInput);
    if (!check.valid) {
      setDimensionError(check.error);
      return;
    }
    setDimensionError(null);
    setTargetWidth(check.w);
    setTargetHeight(check.h);
    setResizeRunTrigger((prev) => prev + 1);
  };

  const handleScalePreset = (pct: number) => {
    if (!sourceImage) return;
    const next = calculatePercentageDimensions(
      sourceImage.width,
      sourceImage.height,
      pct
    );
    setDimensionError(null);
    setWidthInput(String(next.width));
    setHeightInput(String(next.height));
    setTargetWidth(next.width);
    setTargetHeight(next.height);
  };

  const handleResetImage = () => {
    if (sourceImage?.previewUrl) URL.revokeObjectURL(sourceImage.previewUrl);
    if (resizedOutput?.previewUrl) URL.revokeObjectURL(resizedOutput.previewUrl);
    setSourceImage(null);
    setResizedOutput(null);
    setErrorMessage(null);
    setDimensionError(null);
  };

  const handleLoadSample = async () => {
    setErrorMessage(null);
    setDimensionError(null);
    setIsProcessing(true);
    try {
      const file = await createSampleResizerImage();
      loadFile(file);
    } catch (err) {
      setIsProcessing(false);
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to create sample image.'
      );
    }
  };

  const handleDownload = () => {
    if (!resizedOutput || !sourceImage || dimensionError) return;
    const baseName = sourceImage.name.replace(/\.[^.]+$/, '') || 'image';
    const ext =
      outputFormat === 'image/webp'
        ? 'webp'
        : outputFormat === 'image/jpeg'
        ? 'jpg'
        : 'png';
    triggerBrowserDownload(
      resizedOutput.blob,
      `${baseName}-${resizedOutput.width}x${resizedOutput.height}.${ext}`
    );
  };

  const activeError = errorMessage || dimensionError;

  return (
    <div className="space-y-6">
      {activeError && (
        <div
          role="alert"
          data-testid="resizer-error-alert"
          className="flex items-center gap-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--status-danger-bg)] px-4 py-3 text-xs sm:text-sm font-medium text-[var(--status-danger-text)]"
        >
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{activeError}</span>
        </div>
      )}

      {/* Drag & Drop Upload Area */}
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) loadFile(file);
        }}
        className={`glass-panel rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-colors ${
          isDragging
            ? 'border-[var(--accent-primary)] bg-[var(--accent-soft)]'
            : 'border-[var(--border-strong)]'
        }`}
      >
        <input
          id={fileInputId}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) loadFile(file);
            e.target.value = '';
          }}
          className="sr-only"
        />
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--accent-primary)] shadow-xs">
          <Upload className="w-5 h-5" aria-hidden="true" />
        </div>
        <h2 className="mt-3 text-base sm:text-lg font-semibold text-[var(--text-primary)]">
          Drag &amp; drop an image here to resize
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[var(--text-secondary)]">
          Supports JPEG, PNG, and WebP up to 8192 × 8192 px with optional aspect-ratio locking.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <label
            htmlFor={fileInputId}
            className="glass-btn-primary inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Select Image File</span>
          </label>
          <button
            type="button"
            onClick={handleLoadSample}
            className="glass-btn-secondary inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs sm:text-sm font-semibold cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" aria-hidden="true" />
            <span>Load Sample Image</span>
          </button>
          {sourceImage && (
            <button
              type="button"
              onClick={handleResetImage}
              className="glass-btn-secondary inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs sm:text-sm font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Choose Another Image</span>
            </button>
          )}
        </div>
      </div>

      {/* Resizer Controls & Preview */}
      {sourceImage && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  Target Dimensions
                </h3>
                <button
                  type="button"
                  onClick={() => handleScalePreset(100)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[var(--accent-primary)] hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" aria-hidden="true" />
                  <span>Reset ({sourceImage.width}×{sourceImage.height})</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor={widthInputId}
                    className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5"
                  >
                    Width (px)
                  </label>
                  <input
                    id={widthInputId}
                    type="number"
                    min={1}
                    max={8192}
                    value={widthInput}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    aria-invalid={Boolean(dimensionError)}
                    className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3 py-2 text-sm font-mono text-[var(--text-primary)] focus:border-[var(--accent-primary)] transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor={heightInputId}
                    className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5"
                  >
                    Height (px)
                  </label>
                  <input
                    id={heightInputId}
                    type="number"
                    min={1}
                    max={8192}
                    value={heightInput}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    aria-invalid={Boolean(dimensionError)}
                    className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3 py-2 text-sm font-mono text-[var(--text-primary)] focus:border-[var(--accent-primary)] transition-colors"
                  />
                </div>
              </div>

              {/* Aspect Ratio Lock Toggle */}
              <button
                type="button"
                onClick={() => {
                  const nextLock = !lockAspect;
                  setLockAspect(nextLock);
                  if (nextLock && sourceImage) {
                    const parsedW = parseInt(widthInput, 10);
                    const baseW =
                      Number.isFinite(parsedW) && parsedW > 0
                        ? parsedW
                        : sourceImage.width;
                    const synced = calculateAspectLockedDimensions(
                      sourceImage.width,
                      sourceImage.height,
                      'width',
                      baseW
                    );
                    setDimensionError(null);
                    setWidthInput(String(synced.width));
                    setHeightInput(String(synced.height));
                    setTargetWidth(synced.width);
                    setTargetHeight(synced.height);
                  }
                }}
                aria-pressed={lockAspect}
                className={`flex w-full items-center justify-between rounded-lg border px-3.5 py-2.5 text-xs font-medium transition-colors cursor-pointer ${
                  lockAspect
                    ? 'border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--text-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--text-secondary)]'
                }`}
              >
                <span className="flex items-center gap-2">
                  {lockAspect ? (
                    <Lock className="w-3.5 h-3.5 text-[var(--accent-primary)]" aria-hidden="true" />
                  ) : (
                    <Unlock className="w-3.5 h-3.5 text-[var(--text-muted)]" aria-hidden="true" />
                  )}
                  <span>Preserve original aspect ratio</span>
                </span>
                <span className="font-mono text-[11px] text-[var(--text-muted)]">
                  {lockAspect ? 'Locked' : 'Unlocked'}
                </span>
              </button>

              {/* Quick Scale Presets */}
              <div>
                <span className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">
                  Quick Scale Presets
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {[25, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleScalePreset(pct)}
                      className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] py-1.5 text-xs font-mono font-medium text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor={formatSelectId}
                  className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5"
                >
                  Output Format
                </label>
                <select
                  id={formatSelectId}
                  value={outputFormat}
                  onChange={(e) =>
                    setOutputFormat(e.target.value as SupportedImageMime)
                  }
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3.5 py-2 text-xs sm:text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] transition-colors"
                >
                  <option value="image/png">PNG (.png — Lossless, preserves transparency)</option>
                  <option value="image/jpeg">JPEG (.jpg — Compact, white background)</option>
                  <option value="image/webp">WebP (.webp — Modern compression)</option>
                </select>
              </div>

              <button
                type="button"
                data-testid="resize-image-btn"
                onClick={handleApplyResize}
                disabled={isProcessing}
                className="glass-btn-secondary w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold cursor-pointer disabled:opacity-40"
              >
                <span>{isProcessing ? 'Resizing Image...' : 'Resize Image'}</span>
              </button>

              {resizedOutput && !dimensionError && (
                <div className="border-t border-[var(--border-subtle)] pt-4 flex items-center justify-between text-xs tabular-nums">
                  <span className="text-[var(--text-muted)]">Output Resolution &amp; Size</span>
                  <span
                    data-testid="resized-dimensions-readout"
                    className="font-mono font-semibold text-[var(--text-primary)]"
                  >
                    {resizedOutput.width} × {resizedOutput.height} px ·{' '}
                    {formatFileSize(resizedOutput.bytes)}
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={handleDownload}
                disabled={!resizedOutput || isProcessing || Boolean(dimensionError)}
                className="glass-btn-primary w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>Download Resized Image</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Preview */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-2xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[var(--border-subtle)]">
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                    Resized Output Preview
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] font-mono">
                    Original: {sourceImage.width} × {sourceImage.height} px (
                    {formatFileSize(sourceImage.originalBytes)})
                  </p>
                </div>
                {isProcessing && (
                  <span className="text-xs font-medium text-[var(--accent-primary)]">
                    Resizing...
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-center justify-center overflow-hidden rounded-xl bg-[var(--bg-canvas)] p-3 min-h-[260px] max-h-[440px]">
                {dimensionError ? (
                  <p className="text-xs text-[var(--status-danger-text)] text-center px-4">
                    Enter valid pixel dimensions (1 – 8192 px) to preview the resized image.
                  </p>
                ) : resizedOutput ? (
                  <img
                    src={resizedOutput.previewUrl}
                    alt={`Resized preview (${resizedOutput.width}x${resizedOutput.height})`}
                    className="max-h-[400px] w-auto object-contain rounded"
                  />
                ) : (
                  <p className="text-xs text-[var(--text-muted)]">
                    Rendering resized image...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
