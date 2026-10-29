import React, { useState, useEffect, useRef, useId, useCallback } from 'react';
import {
  Upload,
  Download,
  RotateCcw,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  Info,
} from 'lucide-react';
import {
  formatFileSize,
  calculateCompressionSavings,
  validateImageFileMetadata,
  triggerBrowserDownload,
  SupportedImageMime,
} from '../utilities/mediaAndDocumentUtils';

interface SourceImageState {
  name: string;
  originalBytes: number;
  mimeType: string;
  width: number;
  height: number;
  previewUrl: string;
}

interface CompressedResultState {
  blob: Blob;
  previewUrl: string;
  bytes: number;
  mimeType: SupportedImageMime;
}

function createSampleGraphicFile(): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas 2D context is unavailable.'));
      return;
    }

    const grad = ctx.createLinearGradient(0, 0, 1200, 800);
    grad.addColorStop(0, '#1e1b4b');
    grad.addColorStop(0.5, '#2563eb');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 800);

    for (let i = 0; i < 45; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${(i % 5) * 0.03 + 0.02})`;
      ctx.beginPath();
      ctx.arc(
        (i * 173) % 1200,
        (i * 119) % 800,
        35 + (i % 7) * 18,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText('NxK Tools — Sample High-Res Image', 80, 380);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '26px sans-serif';
    ctx.fillText('1200 × 800 px · Adjust quality slider to compare file size', 80, 435);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to create sample image blob.'));
          return;
        }
        resolve(
          new File([blob], 'sample-landscape-1200x800.jpg', {
            type: 'image/jpeg',
          })
        );
      },
      'image/jpeg',
      0.98
    );
  });
}

export function ImageCompressorTool() {
  const fileInputId = useId();
  const qualityInputId = useId();
  const formatSelectId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sourceImage, setSourceImage] = useState<SourceImageState | null>(null);
  const [compressedResult, setCompressedResult] =
    useState<CompressedResultState | null>(null);
  const [quality, setQuality] = useState<number>(70);
  const [outputFormat, setOutputFormat] =
    useState<SupportedImageMime>('image/jpeg');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (sourceImage?.previewUrl) URL.revokeObjectURL(sourceImage.previewUrl);
      if (compressedResult?.previewUrl)
        URL.revokeObjectURL(compressedResult.previewUrl);
    };
  }, []);

  const runCompression = useCallback(
    (
      src: SourceImageState,
      targetQuality: number,
      targetFormat: SupportedImageMime
    ) => {
      setIsProcessing(true);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = src.width;
        canvas.height = src.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsProcessing(false);
          setErrorMessage('Browser HTML5 Canvas context is unavailable.');
          return;
        }

        // Preserve transparency for PNG and WebP; fill white background when exporting JPEG
        if (targetFormat === 'image/jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0, src.width, src.height);

        const normalizedQuality = Math.max(0.05, Math.min(1, targetQuality / 100));
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              setIsProcessing(false);
              setErrorMessage('Failed to encode compressed image.');
              return;
            }
            const nextPreviewUrl = URL.createObjectURL(blob);
            setCompressedResult((prev) => {
              if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
              return {
                blob,
                previewUrl: nextPreviewUrl,
                bytes: blob.size,
                mimeType: targetFormat,
              };
            });
            setIsProcessing(false);
          },
          targetFormat,
          normalizedQuality
        );
      };

      img.onerror = () => {
        setIsProcessing(false);
        setErrorMessage('Failed to render image for compression.');
      };

      img.src = src.previewUrl;
    },
    []
  );

  const loadFileIntoCompressor = (file: File) => {
    setErrorMessage(null);
    const validation = validateImageFileMetadata(file);
    if (!validation.isValid) {
      setErrorMessage(validation.error);
      return;
    }

    setIsProcessing(true);
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const nextFormat: SupportedImageMime =
        file.type === 'image/webp'
          ? 'image/webp'
          : file.type === 'image/png'
          ? 'image/webp' // WebP preserves PNG transparency while achieving lossy/lossless compression
          : 'image/jpeg';

      const nextSource: SourceImageState = {
        name: file.name,
        originalBytes: file.size,
        mimeType: file.type || 'image/jpeg',
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        previewUrl: objectUrl,
      };

      setSourceImage((prev) => {
        if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
        return nextSource;
      });
      setOutputFormat(nextFormat);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setIsProcessing(false);
      setErrorMessage(
        `Could not decode "${file.name}". Please upload a valid, non-corrupted JPEG, PNG, or WebP image.`
      );
    };

    img.src = objectUrl;
  };

  useEffect(() => {
    if (!sourceImage) {
      setCompressedResult(null);
      return;
    }
    runCompression(sourceImage, quality, outputFormat);
  }, [sourceImage, quality, outputFormat, runCompression]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      loadFileIntoCompressor(file);
    }
    event.target.value = '';
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      loadFileIntoCompressor(file);
    }
  };

  const handleLoadSample = async () => {
    setErrorMessage(null);
    setIsProcessing(true);
    try {
      const sampleFile = await createSampleGraphicFile();
      loadFileIntoCompressor(sampleFile);
    } catch (err) {
      setIsProcessing(false);
      setErrorMessage(
        err instanceof Error ? err.message : 'Could not create sample image.'
      );
    }
  };

  const handleCompressClick = () => {
    if (!sourceImage) {
      setErrorMessage('Please choose or drop an image file first before compressing.');
      return;
    }
    setErrorMessage(null);
    runCompression(sourceImage, quality, outputFormat);
  };

  const handleDownload = () => {
    if (!compressedResult || !sourceImage) return;
    const baseName = sourceImage.name.replace(/\.[^.]+$/, '') || 'image';
    const ext =
      outputFormat === 'image/webp'
        ? 'webp'
        : outputFormat === 'image/png'
        ? 'png'
        : 'jpg';
    triggerBrowserDownload(
      compressedResult.blob,
      `${baseName}-compressed-${quality}q.${ext}`
    );
  };

  const handleReset = () => {
    if (sourceImage?.previewUrl) URL.revokeObjectURL(sourceImage.previewUrl);
    if (compressedResult?.previewUrl)
      URL.revokeObjectURL(compressedResult.previewUrl);
    setSourceImage(null);
    setCompressedResult(null);
    setErrorMessage(null);
  };

  const savings =
    sourceImage && compressedResult
      ? calculateCompressionSavings(
          sourceImage.originalBytes,
          compressedResult.bytes
        )
      : null;

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div
          role="alert"
          className="flex items-center gap-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--status-danger-bg)] px-4 py-3 text-xs sm:text-sm font-medium text-[var(--status-danger-text)]"
        >
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Drag & Drop Upload Area matching Mockup 05. Tool Page (Image Compressor) */}
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
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed p-6 sm:p-10 text-center transition-colors ${
          isDragging
            ? 'border-[var(--accent-primary)] bg-[var(--accent-soft)]'
            : 'border-[var(--border-strong)] bg-[var(--bg-surface)]'
        }`}
      >
        <input
          ref={fileInputRef}
          id={fileInputId}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="sr-only"
        />
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
          <Upload className="w-6 h-6" aria-hidden="true" />
        </div>
        <h2 className="mt-3.5 text-sm sm:text-base font-bold text-[var(--text-primary)]">
          Drag &amp; drop your images here
        </h2>
        <p className="mt-1 text-xs text-[var(--text-muted)]">or</p>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
          <label
            htmlFor={fileInputId}
            className="btn-primary-glass inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-semibold text-white transition-all cursor-pointer min-h-[38px]"
          >
            <Upload className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Choose Files</span>
          </label>
          <button
            type="button"
            onClick={handleLoadSample}
            className="liquid-glass-panel inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors cursor-pointer min-h-[38px]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" aria-hidden="true" />
            <span>Load Sample Image</span>
          </button>
          {sourceImage && (
            <button
              type="button"
              onClick={handleReset}
              className="liquid-glass-panel inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer min-h-[38px]"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Choose Another Image</span>
            </button>
          )}
        </div>

        <p className="mt-3.5 text-xs text-[var(--text-muted)]">
          Supports JPG, PNG, WEBP (Max 50MB) · Processed locally in your browser
        </p>
      </div>

      {/* Compression Quality & Action Bar matching Mockup 05 */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-12 sm:items-end">
          <div className="sm:col-span-7 space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor={qualityInputId}
                className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]"
              >
                Compression Quality
              </label>
              <span
                data-testid="compressor-quality-value"
                className="font-mono text-xs sm:text-sm font-bold text-[var(--accent-primary)] tabular-nums"
              >
                {outputFormat === 'image/png' ? 'Lossless (PNG)' : `${quality}%`}
              </span>
            </div>
            <input
              id={qualityInputId}
              type="range"
              min={10}
              max={100}
              step={1}
              disabled={outputFormat === 'image/png'}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-[var(--accent-primary)] disabled:opacity-40 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[var(--text-muted)]">
              <span>Smaller file (10%)</span>
              <span>Balanced (70%)</span>
              <span>Max quality (100%)</span>
            </div>
          </div>

          <div className="sm:col-span-5">
            <label
              htmlFor={formatSelectId}
              className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5"
            >
              Output Format
            </label>
            <select
              id={formatSelectId}
              value={outputFormat}
              onChange={(e) =>
                setOutputFormat(e.target.value as SupportedImageMime)
              }
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3.5 py-2.5 text-xs sm:text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] transition-colors"
            >
              <option value="image/jpeg">JPEG (.jpg) — Best for photos</option>
              <option value="image/webp">WebP (.webp) — Preserves transparency</option>
              <option value="image/png">PNG (.png) — Lossless transparency</option>
            </select>
          </div>
        </div>

        {/* Transparency & Format Explanation */}
        <div className="flex items-start gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3.5 py-2.5 text-xs text-[var(--text-secondary)]">
          <Info className="w-4 h-4 shrink-0 text-[var(--accent-primary)] mt-0.5" aria-hidden="true" />
          <span>
            Compression results depend on the image format and quality setting.{' '}
            <strong>WebP</strong> and <strong>PNG</strong> preserve alpha transparency, while{' '}
            <strong>JPEG</strong> fills transparent areas with a solid white background.
          </span>
        </div>

        {/* Primary Compress Image Action Button matching Mockup 05 */}
        <div className="flex flex-wrap items-center justify-center sm:justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={handleCompressClick}
            disabled={isProcessing}
            className="btn-primary-glass inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-xs sm:text-sm font-semibold text-white transition-all cursor-pointer min-h-[42px]"
          >
            <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
            <span>{isProcessing ? 'Compressing Image...' : 'Compress Image'}</span>
          </button>

          {sourceImage && (
            <span
              role="status"
              aria-live="polite"
              className="text-xs font-medium text-[var(--text-secondary)]"
            >
              {isProcessing
                ? 'Processing image in browser...'
                : `Ready · ${sourceImage.width} × ${sourceImage.height} px`}
            </span>
          )}
        </div>
      </div>

      {/* Results & Preview Workspace */}
      {sourceImage && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 animate-enter">
          {/* Left Column: File Size Comparison & Download */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  Compression Results
                </h3>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent-primary)] hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" aria-hidden="true" />
                  <span>Reset</span>
                </button>
              </div>

              {savings && (
                <div className="space-y-3 tabular-nums">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3.5">
                      <div className="text-xs text-[var(--text-muted)]">
                        Original File Size
                      </div>
                      <div
                        data-testid="original-file-size"
                        className="mt-1 text-base sm:text-lg font-bold font-mono text-[var(--text-primary)]"
                      >
                        {formatFileSize(savings.originalBytes)}
                      </div>
                    </div>
                    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3.5">
                      <div className="text-xs text-[var(--text-muted)]">
                        Compressed File Size
                      </div>
                      <div
                        data-testid="compressed-file-size"
                        className="mt-1 text-base sm:text-lg font-bold font-mono text-[var(--accent-primary)]"
                      >
                        {isProcessing
                          ? 'Encoding...'
                          : formatFileSize(savings.compressedBytes)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3.5 py-2.5 text-xs font-medium">
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 ${
                        savings.isSmaller
                          ? 'text-[var(--status-available-text)]'
                          : 'text-[var(--text-muted)]'
                      }`}
                      aria-hidden="true"
                    />
                    <span
                      data-testid="compression-savings-summary"
                      className={
                        savings.isSmaller
                          ? 'text-[var(--status-available-text)] font-semibold'
                          : 'text-[var(--text-secondary)]'
                      }
                    >
                      {savings.summaryLabel}
                    </span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleDownload}
                disabled={!compressedResult || isProcessing}
                className="btn-primary-glass w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-white disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer min-h-[44px]"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>Download Image</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Image Preview */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[var(--border-subtle)]">
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    Image Preview
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] font-mono">
                    {sourceImage.name} · {sourceImage.width} × {sourceImage.height} px
                  </p>
                </div>
                {isProcessing && (
                  <span className="text-xs font-medium text-[var(--accent-primary)]">
                    Updating preview...
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-center justify-center overflow-hidden rounded-xl bg-[var(--bg-canvas)] p-3 min-h-[240px] max-h-[420px]">
                {compressedResult ? (
                  <img
                    src={compressedResult.previewUrl}
                    alt={`Compressed preview of ${sourceImage.name}`}
                    className="max-h-[380px] w-auto object-contain rounded"
                  />
                ) : (
                  <p className="text-xs text-[var(--text-muted)]">
                    Encoding preview...
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
