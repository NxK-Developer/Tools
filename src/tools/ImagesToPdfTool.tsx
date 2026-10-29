import React, { useState, useEffect, useId } from 'react';
import {
  Upload,
  Download,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  Sparkles,
  FileCheck2,
  RotateCcw,
} from 'lucide-react';
import {
  formatFileSize,
  validateImageFileMetadata,
  createPdfFromImages,
  PreparedImageForPdf,
  PdfPagePreset,
  PdfOrientation,
  PdfMarginPreset,
  triggerBrowserDownload,
} from '../utilities/mediaAndDocumentUtils';

interface QueuedImageItem {
  id: string;
  name: string;
  sizeBytes: number;
  width: number;
  height: number;
  previewUrl: string;
  preparedBytes: Uint8Array;
  preparedMime: 'image/jpeg' | 'image/png';
}

function fileToPreparedImage(file: File): Promise<QueuedImageItem> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Browser HTML5 Canvas context is unavailable.'));
        return;
      }

      const targetMime: 'image/jpeg' | 'image/png' =
        file.type === 'image/png' ? 'image/png' : 'image/jpeg';

      if (targetMime === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
      }
      ctx.drawImage(img, 0, 0, w, h);

      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            URL.revokeObjectURL(objectUrl);
            reject(new Error(`Failed to process "${file.name}".`));
            return;
          }
          const arrayBuffer = await blob.arrayBuffer();
          resolve({
            id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            name: file.name,
            sizeBytes: file.size,
            width: w,
            height: h,
            previewUrl: objectUrl,
            preparedBytes: new Uint8Array(arrayBuffer),
            preparedMime: targetMime,
          });
        },
        targetMime,
        0.92
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(
        new Error(
          `Could not decode "${file.name}". Please choose a valid JPEG, PNG, or WebP image.`
        )
      );
    };

    img.src = objectUrl;
  });
}

function createSampleSlideFile(
  slideNumber: number,
  title: string,
  bgHex: string
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas context unavailable'));
      return;
    }

    ctx.fillStyle = bgHex;
    ctx.fillRect(0, 0, 1000, 700);

    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 4;
    ctx.strokeRect(48, 48, 904, 604);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText(`Page ${slideNumber}: ${title}`, 90, 320);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '24px sans-serif';
    ctx.fillText('NxK Tools · Client-Side Images to PDF Compiler', 90, 375);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to create sample slide'));
          return;
        }
        resolve(
          new File([blob], `sample-page-0${slideNumber}.jpg`, {
            type: 'image/jpeg',
          })
        );
      },
      'image/jpeg',
      0.92
    );
  });
}

export function ImagesToPdfTool() {
  const fileInputId = useId();
  const pagePresetId = useId();
  const orientationId = useId();
  const marginId = useId();

  const [items, setItems] = useState<QueuedImageItem[]>([]);
  const [pagePreset, setPagePreset] = useState<PdfPagePreset>('a4');
  const [orientation, setOrientation] = useState<PdfOrientation>('auto');
  const [marginPreset, setMarginPreset] = useState<PdfMarginPreset>('standard');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [compiledPdf, setCompiledPdf] = useState<{
    bytes: Uint8Array;
    pageCount: number;
    previewUrl: string;
  } | null>(null);

  useEffect(() => {
    return () => {
      for (const item of items) {
        URL.revokeObjectURL(item.previewUrl);
      }
      if (compiledPdf?.previewUrl) {
        URL.revokeObjectURL(compiledPdf.previewUrl);
      }
    };
  }, []);

  // Invalidate previously compiled PDF output when queue or layout changes
  useEffect(() => {
    setCompiledPdf((prev) => {
      if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
      return null;
    });
  }, [items, pagePreset, orientation, marginPreset]);

  const handleAddFiles = async (fileList: FileList | File[]) => {
    setErrorMessage(null);
    const filesArray = Array.from(fileList);
    if (filesArray.length === 0) return;

    const newItems: QueuedImageItem[] = [];
    for (const file of filesArray) {
      const validation = validateImageFileMetadata(file);
      if (!validation.isValid) {
        setErrorMessage(validation.error);
        continue;
      }
      try {
        const prepared = await fileToPreparedImage(file);
        newItems.push(prepared);
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : `Failed to load "${file.name}".`
        );
      }
    }

    if (newItems.length > 0) {
      setItems((prev) => [...prev, ...newItems]);
    }
  };

  const handleLoadSamplePages = async () => {
    setErrorMessage(null);
    setIsCompiling(true);
    try {
      const slide1 = await createSampleSlideFile(
        1,
        'Architecture Overview',
        '#1e1b4b'
      );
      const slide2 = await createSampleSlideFile(
        2,
        'Visual Verification Report',
        '#0f172a'
      );
      await handleAddFiles([slide1, slide2]);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to create sample images.'
      );
    } finally {
      setIsCompiling(false);
    }
  };

  const handleMoveItem = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    setItems((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(index, 1);
      copy.splice(targetIndex, 0, moved);
      return copy;
    });
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleClearAll = () => {
    for (const item of items) {
      URL.revokeObjectURL(item.previewUrl);
    }
    setItems([]);
    setCompiledPdf((prev) => {
      if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
      return null;
    });
    setErrorMessage(null);
  };

  const handleGeneratePdf = async () => {
    if (items.length === 0) {
      setErrorMessage('Add at least one image before generating a PDF.');
      return;
    }
    setErrorMessage(null);
    setIsCompiling(true);

    try {
      const preparedList: PreparedImageForPdf[] = items.map((item) => ({
        name: item.name,
        bytes: item.preparedBytes,
        mimeType: item.preparedMime,
        width: item.width,
        height: item.height,
      }));

      const result = await createPdfFromImages(preparedList, {
        pagePreset,
        orientation,
        marginPreset,
      });
      const blob = new Blob([result.pdfBytes], { type: 'application/pdf' });
      const nextPreviewUrl = URL.createObjectURL(blob);
      setCompiledPdf((prev) => {
        if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
        return {
          bytes: result.pdfBytes,
          pageCount: result.pageCount,
          previewUrl: nextPreviewUrl,
        };
      });
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to compile PDF document.'
      );
    } finally {
      setIsCompiling(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!compiledPdf) return;
    const blob = new Blob([compiledPdf.bytes], { type: 'application/pdf' });
    triggerBrowserDownload(
      blob,
      `nxk-images-to-pdf-${compiledPdf.pageCount}pages.pdf`
    );
  };

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

      {/* Multi-Image Drag & Drop Zone */}
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
          if (e.dataTransfer.files?.length) {
            handleAddFiles(e.dataTransfer.files);
          }
        }}
        className={`rounded-xl border-2 border-dashed p-6 sm:p-8 text-center transition-colors ${
          isDragging
            ? 'border-[var(--accent-primary)] bg-[var(--accent-soft)]'
            : 'border-[var(--border-strong)] bg-[var(--bg-surface)]'
        }`}
      >
        <input
          id={fileInputId}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            if (e.target.files?.length) {
              handleAddFiles(e.target.files);
            }
            e.target.value = '';
          }}
          className="sr-only"
        />
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--accent-primary)]">
          <Upload className="w-5 h-5" aria-hidden="true" />
        </div>
        <h2 className="mt-3 text-sm sm:text-base font-semibold text-[var(--text-primary)]">
          Drop one or more images to compile into a PDF
        </h2>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          Supports JPEG, PNG, and WebP. Arrange page order below before generating your PDF.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <label
            htmlFor={fileInputId}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-xs font-semibold text-[var(--accent-contrast)] hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Add Images</span>
          </label>
          <button
            type="button"
            onClick={handleLoadSamplePages}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-4 py-2 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" aria-hidden="true" />
            <span>Add 2 Sample Image Pages</span>
          </button>
          {items.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Clear Queue</span>
            </button>
          )}
        </div>
      </div>

      {/* Queue & PDF Page Settings */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Ordered Image Queue */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Image Page Queue ({items.length}{' '}
                {items.length === 1 ? 'page' : 'pages'})
              </h3>
              <span className="text-xs text-[var(--text-muted)]">
                Use arrows to reorder pages
              </span>
            </div>

            <ul className="space-y-2.5">
              {items.map((item, idx) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--bg-canvas)] font-mono text-xs font-semibold text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                      {idx + 1}
                    </span>
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="h-11 w-14 shrink-0 rounded border border-[var(--border-subtle)] object-cover bg-[var(--bg-canvas)]"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                        {item.name}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] font-mono tabular-nums">
                        {item.width} × {item.height} px ·{' '}
                        {formatFileSize(item.sizeBytes)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMoveItem(idx, -1)}
                      disabled={idx === 0}
                      aria-label={`Move ${item.name} up`}
                      className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveItem(idx, 1)}
                      disabled={idx === items.length - 1}
                      aria-label={`Move ${item.name} down`}
                      className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-1.5 text-[var(--status-danger-text)] hover:bg-[var(--status-danger-bg)] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: PDF Layout Options & Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-5">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                PDF Document Settings
              </h3>

              <div>
                <label
                  htmlFor={pagePresetId}
                  className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5"
                >
                  Page Size
                </label>
                <select
                  id={pagePresetId}
                  value={pagePreset}
                  onChange={(e) =>
                    setPagePreset(e.target.value as PdfPagePreset)
                  }
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3.5 py-2 text-xs sm:text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] transition-colors"
                >
                  <option value="a4">A4 Standard (210 × 297 mm)</option>
                  <option value="letter">US Letter (8.5 × 11 in)</option>
                  <option value="fit">Fit Page to Image Dimensions</option>
                </select>
              </div>

              {pagePreset !== 'fit' && (
                <div>
                  <label
                    htmlFor={orientationId}
                    className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5"
                  >
                    Page Orientation
                  </label>
                  <select
                    id={orientationId}
                    value={orientation}
                    onChange={(e) =>
                      setOrientation(e.target.value as PdfOrientation)
                    }
                    className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3.5 py-2 text-xs sm:text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] transition-colors"
                  >
                    <option value="auto">Auto (Match each image aspect)</option>
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
              )}

              <div>
                <label
                  htmlFor={marginId}
                  className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5"
                >
                  Page Margin
                </label>
                <select
                  id={marginId}
                  value={marginPreset}
                  onChange={(e) =>
                    setMarginPreset(e.target.value as PdfMarginPreset)
                  }
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3.5 py-2 text-xs sm:text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] transition-colors"
                >
                  <option value="standard">Standard Margin (0.5 in)</option>
                  <option value="small">Small Margin (0.28 in)</option>
                  <option value="none">No Margin (Full bleed)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleGeneratePdf}
                disabled={isCompiling || items.length === 0}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent-primary)] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[var(--accent-contrast)] hover:bg-[var(--accent-primary-hover)] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4" aria-hidden="true" />
                <span>
                  {isCompiling
                    ? 'Compiling PDF...'
                    : `Generate PDF (${items.length} ${
                        items.length === 1 ? 'Page' : 'Pages'
                      })`}
                </span>
              </button>

              {compiledPdf && (
                <div className="border-t border-[var(--border-subtle)] pt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs tabular-nums">
                    <span className="font-medium text-[var(--status-available-text)]">
                      PDF Ready ({compiledPdf.pageCount}{' '}
                      {compiledPdf.pageCount === 1 ? 'page' : 'pages'})
                    </span>
                    <span
                      data-testid="compiled-pdf-size"
                      className="font-mono font-semibold text-[var(--text-primary)]"
                    >
                      {formatFileSize(compiledPdf.bytes.byteLength)}
                    </span>
                  </div>

                  <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] overflow-hidden">
                    <iframe
                      title="Compiled PDF Output Preview"
                      src={compiledPdf.previewUrl}
                      className="w-full h-48 border-0"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--accent-border)] bg-[var(--accent-soft)] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-[var(--accent-contrast)] transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    <span>Download Compiled PDF</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
