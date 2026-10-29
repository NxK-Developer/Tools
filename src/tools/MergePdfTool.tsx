import React, { useState, useId, useEffect } from 'react';
import {
  Upload,
  Download,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  Sparkles,
  Files,
  RotateCcw,
} from 'lucide-react';
import {
  formatFileSize,
  validatePdfFileMetadata,
  inspectPdfPageCount,
  mergePdfDocuments,
  createSamplePdfBytes,
  triggerBrowserDownload,
} from '../utilities/mediaAndDocumentUtils';

interface QueuedPdfDocument {
  id: string;
  name: string;
  sizeBytes: number;
  pageCount: number;
  bytes: Uint8Array;
}

export function MergePdfTool() {
  const fileInputId = useId();

  const [documents, setDocuments] = useState<QueuedPdfDocument[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mergedResult, setMergedResult] = useState<{
    bytes: Uint8Array;
    totalPages: number;
    previewUrl: string;
  } | null>(null);

  useEffect(() => {
    return () => {
      if (mergedResult?.previewUrl) {
        URL.revokeObjectURL(mergedResult.previewUrl);
      }
    };
  }, []);

  useEffect(() => {
    setMergedResult((prev) => {
      if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
      return null;
    });
  }, [documents]);

  const handleAddPdfFiles = async (fileList: FileList | File[]) => {
    setErrorMessage(null);
    const files = Array.from(fileList);
    if (files.length === 0) return;

    setIsProcessing(true);
    const loadedDocs: QueuedPdfDocument[] = [];

    for (const file of files) {
      const validation = validatePdfFileMetadata(file);
      if (!validation.isValid) {
        setErrorMessage(validation.error);
        continue;
      }

      try {
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        const pageCount = await inspectPdfPageCount(bytes);
        loadedDocs.push({
          id: `pdf-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: file.name,
          sizeBytes: file.size,
          pageCount,
          bytes,
        });
      } catch {
        setErrorMessage(
          `Could not parse "${file.name}". Ensure it is a valid, unencrypted PDF file.`
        );
      }
    }

    if (loadedDocs.length > 0) {
      setDocuments((prev) => [...prev, ...loadedDocs]);
    }
    setIsProcessing(false);
  };

  const handleLoadSamplePdfs = async () => {
    setErrorMessage(null);
    setIsProcessing(true);
    try {
      const bytesA = await createSamplePdfBytes(
        'Document A — Executive Summary',
        'First document in the merge queue (Page 1)',
        [0.26, 0.22, 0.79]
      );
      const bytesB = await createSamplePdfBytes(
        'Document B — Financial Appendix',
        'Second document in the merge queue (Page 2)',
        [0.08, 0.5, 0.24]
      );

      const fileA = new File([bytesA], '01-executive-summary.pdf', {
        type: 'application/pdf',
      });
      const fileB = new File([bytesB], '02-financial-appendix.pdf', {
        type: 'application/pdf',
      });
      await handleAddPdfFiles([fileA, fileB]);
    } catch (err) {
      setIsProcessing(false);
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to generate sample PDFs.'
      );
    }
  };

  const handleMoveDocument = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= documents.length) return;
    setDocuments((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(index, 1);
      copy.splice(targetIndex, 0, moved);
      return copy;
    });
  };

  const handleRemoveDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const handleMerge = async () => {
    if (documents.length < 2) {
      setErrorMessage('Add at least two PDF files to merge them into one document.');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);
    try {
      const result = await mergePdfDocuments(
        documents.map((doc) => doc.bytes)
      );
      const blob = new Blob([result.pdfBytes], { type: 'application/pdf' });
      const nextPreviewUrl = URL.createObjectURL(blob);
      setMergedResult((prev) => {
        if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
        return {
          bytes: result.pdfBytes,
          totalPages: result.totalPages,
          previewUrl: nextPreviewUrl,
        };
      });
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to merge PDF files.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadMerged = () => {
    if (!mergedResult) return;
    const blob = new Blob([mergedResult.bytes], { type: 'application/pdf' });
    triggerBrowserDownload(
      blob,
      `nxk-merged-document-${mergedResult.totalPages}pages.pdf`
    );
  };

  const totalQueuedPages = documents.reduce(
    (sum, doc) => sum + doc.pageCount,
    0
  );

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

      {/* Drag & Drop PDF Upload Area */}
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
            handleAddPdfFiles(e.dataTransfer.files);
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
          accept="application/pdf,.pdf"
          onChange={(e) => {
            if (e.target.files?.length) {
              handleAddPdfFiles(e.target.files);
            }
            e.target.value = '';
          }}
          className="sr-only"
        />
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--accent-primary)]">
          <Upload className="w-5 h-5" aria-hidden="true" />
        </div>
        <h2 className="mt-3 text-sm sm:text-base font-semibold text-[var(--text-primary)]">
          Drop two or more PDF files here to merge
        </h2>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          Files are combined locally in your browser in the exact order shown below.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <label
            htmlFor={fileInputId}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-xs font-semibold text-[var(--accent-contrast)] hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Select PDF Files</span>
          </label>
          <button
            type="button"
            onClick={handleLoadSamplePdfs}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-4 py-2 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" aria-hidden="true" />
            <span>Load 2 Sample PDFs</span>
          </button>
          {documents.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setDocuments([]);
                setMergedResult((prev) => {
                  if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
                  return null;
                });
                setErrorMessage(null);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Clear Queue</span>
            </button>
          )}
        </div>
      </div>

      {/* PDF Queue & Merge Action Panel */}
      {documents.length > 0 && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                PDF Merge Order ({documents.length}{' '}
                {documents.length === 1 ? 'file' : 'files'} · {totalQueuedPages}{' '}
                {totalQueuedPages === 1 ? 'page' : 'pages'})
              </h3>
              <span className="text-xs text-[var(--text-muted)]">
                Reorder with arrows
              </span>
            </div>

            <ul className="space-y-2.5">
              {documents.map((doc, idx) => (
                <li
                  key={doc.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--bg-canvas)] font-mono text-xs font-semibold text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p
                        data-testid={`queued-pdf-name-${idx}`}
                        className="truncate text-xs sm:text-sm font-semibold text-[var(--text-primary)]"
                      >
                        {doc.name}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] font-mono tabular-nums">
                        {doc.pageCount} {doc.pageCount === 1 ? 'page' : 'pages'} ·{' '}
                        {formatFileSize(doc.sizeBytes)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMoveDocument(idx, -1)}
                      disabled={idx === 0}
                      aria-label={`Move ${doc.name} up`}
                      className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveDocument(idx, 1)}
                      disabled={idx === documents.length - 1}
                      aria-label={`Move ${doc.name} down`}
                      className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveDocument(doc.id)}
                      aria-label={`Remove ${doc.name}`}
                      className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-1.5 text-[var(--status-danger-text)] hover:bg-[var(--status-danger-bg)] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-5">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Merge Summary
              </h3>

              <dl className="space-y-2.5 text-xs tabular-nums">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                  <dt className="text-[var(--text-secondary)]">Documents in Queue</dt>
                  <dd className="font-mono font-semibold text-[var(--text-primary)]">
                    {documents.length}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                  <dt className="text-[var(--text-secondary)]">Total Combined Pages</dt>
                  <dd
                    data-testid="merge-total-pages"
                    className="font-mono font-semibold text-[var(--text-primary)]"
                  >
                    {totalQueuedPages}
                  </dd>
                </div>
              </dl>

              {documents.length < 2 && (
                <p className="text-xs text-[var(--status-planned-text)]">
                  Add at least one more PDF file to enable merging.
                </p>
              )}

              <button
                type="button"
                onClick={handleMerge}
                disabled={isProcessing || documents.length < 2}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent-primary)] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[var(--accent-contrast)] hover:bg-[var(--accent-primary-hover)] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <Files className="w-4 h-4" aria-hidden="true" />
                <span>
                  {isProcessing
                    ? 'Merging PDFs...'
                    : `Merge ${documents.length} PDFs`}
                </span>
              </button>

              {mergedResult && (
                <div className="border-t border-[var(--border-subtle)] pt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs tabular-nums">
                    <span className="font-medium text-[var(--status-available-text)]">
                      Merged PDF Ready ({mergedResult.totalPages} pages)
                    </span>
                    <span
                      data-testid="merged-pdf-size"
                      className="font-mono font-semibold text-[var(--text-primary)]"
                    >
                      {formatFileSize(mergedResult.bytes.byteLength)}
                    </span>
                  </div>

                  <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] overflow-hidden">
                    <iframe
                      title="Merged PDF Output Preview"
                      src={mergedResult.previewUrl}
                      className="w-full h-48 border-0"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadMerged}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--accent-border)] bg-[var(--accent-soft)] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-[var(--accent-contrast)] transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    <span>Download Merged PDF</span>
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
