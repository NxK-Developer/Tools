import QRCode from 'qrcode';
import { PDFDocument, PageSizes, rgb, StandardFonts } from 'pdf-lib';

export const MAX_IMAGE_FILE_BYTES = 50 * 1024 * 1024; // 50 MB
export const MAX_PDF_FILE_BYTES = 100 * 1024 * 1024; // 100 MB

export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export type SupportedImageMime = (typeof SUPPORTED_IMAGE_TYPES)[number];

export interface FileValidationResult {
  isValid: boolean;
  error: string | null;
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return '0 B';
  }
  if (bytes === 0) return '0 B';
  if (bytes < 1024) {
    return `${Math.round(bytes)} B`;
  }
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(kb < 10 ? 2 : 1)} KB`;
  }
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

export interface CompressionSavings {
  originalBytes: number;
  compressedBytes: number;
  deltaBytes: number;
  percentChange: number;
  isSmaller: boolean;
  summaryLabel: string;
}

export function calculateCompressionSavings(
  originalBytes: number,
  compressedBytes: number
): CompressionSavings {
  if (originalBytes <= 0 || compressedBytes < 0) {
    return {
      originalBytes: Math.max(0, originalBytes),
      compressedBytes: Math.max(0, compressedBytes),
      deltaBytes: 0,
      percentChange: 0,
      isSmaller: false,
      summaryLabel: '0% change',
    };
  }

  const deltaBytes = originalBytes - compressedBytes;
  const rawPct = (deltaBytes / originalBytes) * 100;
  const roundedPct = Number(Math.abs(rawPct).toFixed(1));
  const isSmaller = deltaBytes > 0;

  let summaryLabel = 'No size change';
  if (deltaBytes > 0) {
    summaryLabel = `Saved ${formatFileSize(deltaBytes)} (−${roundedPct}%)`;
  } else if (deltaBytes < 0) {
    summaryLabel = `Increased by ${formatFileSize(Math.abs(deltaBytes))} (+${roundedPct}%)`;
  }

  return {
    originalBytes,
    compressedBytes,
    deltaBytes,
    percentChange: Number(rawPct.toFixed(1)),
    isSmaller,
    summaryLabel,
  };
}

export function validateImageFileMetadata(file: {
  name: string;
  type: string;
  size: number;
}): FileValidationResult {
  if (!file || file.size === 0) {
    return {
      isValid: false,
      error: `The file "${file?.name || 'selected'}" is empty (0 bytes).`,
    };
  }
  if (file.size > MAX_IMAGE_FILE_BYTES) {
    return {
      isValid: false,
      error: `"${file.name}" exceeds the 50 MB local browser processing limit.`,
    };
  }
  const normalizedType = file.type.toLowerCase();
  const hasValidMime = SUPPORTED_IMAGE_TYPES.includes(
    normalizedType as SupportedImageMime
  );
  const hasValidExt = /\.(jpe?g|png|webp)$/i.test(file.name);

  if (!hasValidMime && !hasValidExt) {
    return {
      isValid: false,
      error: `"${file.name}" is not a supported image format. Please choose a JPEG, PNG, or WebP file.`,
    };
  }
  return { isValid: true, error: null };
}

export function validatePdfFileMetadata(file: {
  name: string;
  type: string;
  size: number;
}): FileValidationResult {
  if (!file || file.size === 0) {
    return {
      isValid: false,
      error: `The file "${file?.name || 'selected'}" is empty (0 bytes).`,
    };
  }
  if (file.size > MAX_PDF_FILE_BYTES) {
    return {
      isValid: false,
      error: `"${file.name}" exceeds the 100 MB local browser processing limit.`,
    };
  }
  const isPdfMime = file.type.toLowerCase() === 'application/pdf';
  const isPdfExt = /\.pdf$/i.test(file.name);
  if (!isPdfMime && !isPdfExt) {
    return {
      isValid: false,
      error: `"${file.name}" is not a PDF file. Please select a valid .pdf document.`,
    };
  }
  return { isValid: true, error: null };
}

export interface Dimensions {
  width: number;
  height: number;
}

export const MAX_IMAGE_DIMENSION = 12000;

export function clampDimension(value: number): number {
  if (!Number.isFinite(value) || value < 1) return 1;
  return Math.min(MAX_IMAGE_DIMENSION, Math.round(value));
}

export function calculateAspectLockedDimensions(
  originalWidth: number,
  originalHeight: number,
  changedAxis: 'width' | 'height',
  newValue: number
): Dimensions {
  const safeOrigW = Math.max(1, originalWidth);
  const safeOrigH = Math.max(1, originalHeight);
  const ratio = safeOrigW / safeOrigH;
  const clampedNew = clampDimension(newValue);

  if (changedAxis === 'width') {
    return {
      width: clampedNew,
      height: clampDimension(clampedNew / ratio),
    };
  } else {
    return {
      width: clampDimension(clampedNew * ratio),
      height: clampedNew,
    };
  }
}

export function calculatePercentageDimensions(
  originalWidth: number,
  originalHeight: number,
  percentage: number
): Dimensions {
  const safePct = Math.max(1, Math.min(500, Number.isFinite(percentage) ? percentage : 100));
  const scale = safePct / 100;
  return {
    width: clampDimension(originalWidth * scale),
    height: clampDimension(originalHeight * scale),
  };
}

export type QrErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface QrGenerationOptions {
  text: string;
  width?: number;
  margin?: number;
  errorCorrectionLevel?: QrErrorCorrectionLevel;
  darkColor?: string;
  lightColor?: string;
}

export interface QrGenerationResult {
  isValid: boolean;
  dataUrl: string | null;
  error: string | null;
}

export async function generateQrCodeDataUrl(
  options: QrGenerationOptions
): Promise<QrGenerationResult> {
  const trimmed = options.text.trim();
  if (!trimmed) {
    return {
      isValid: false,
      dataUrl: null,
      error: 'Enter a URL or text string to generate a QR code.',
    };
  }
  if (trimmed.length > 2000) {
    return {
      isValid: false,
      dataUrl: null,
      error: 'Input exceeds the maximum supported QR payload length of 2,000 characters.',
    };
  }

  try {
    const width = Math.max(128, Math.min(2048, options.width ?? 512));
    const margin = Math.max(0, Math.min(10, options.margin ?? 2));
    const dataUrl = await QRCode.toDataURL(trimmed, {
      width,
      margin,
      errorCorrectionLevel: options.errorCorrectionLevel ?? 'M',
      color: {
        dark: options.darkColor || '#0f172a',
        light: options.lightColor || '#ffffff',
      },
    });
    return {
      isValid: true,
      dataUrl,
      error: null,
    };
  } catch (err) {
    return {
      isValid: false,
      dataUrl: null,
      error: err instanceof Error ? err.message : 'Failed to generate QR code.',
    };
  }
}

export type PdfPagePreset = 'a4' | 'letter' | 'fit';
export type PdfOrientation = 'auto' | 'portrait' | 'landscape';
export type PdfMarginPreset = 'none' | 'small' | 'standard';

export interface PreparedImageForPdf {
  name: string;
  bytes: Uint8Array;
  mimeType: 'image/jpeg' | 'image/png';
  width: number;
  height: number;
}

export function getMarginPoints(marginPreset: PdfMarginPreset): number {
  switch (marginPreset) {
    case 'none':
      return 0;
    case 'small':
      return 20;
    case 'standard':
    default:
      return 36;
  }
}

export async function createPdfFromImages(
  images: PreparedImageForPdf[],
  options?: {
    pagePreset?: PdfPagePreset;
    orientation?: PdfOrientation;
    marginPreset?: PdfMarginPreset;
  }
): Promise<{ pdfBytes: Uint8Array; pageCount: number }> {
  if (!images || images.length === 0) {
    throw new Error('At least one image is required to generate a PDF document.');
  }

  const pagePreset = options?.pagePreset ?? 'a4';
  const orientation = options?.orientation ?? 'auto';
  const margin = getMarginPoints(options?.marginPreset ?? 'standard');

  const pdfDoc = await PDFDocument.create();

  for (const imgInput of images) {
    const embeddedImage =
      imgInput.mimeType === 'image/png'
        ? await pdfDoc.embedPng(imgInput.bytes)
        : await pdfDoc.embedJpg(imgInput.bytes);

    const imgW = embeddedImage.width;
    const imgH = embeddedImage.height;

    if (pagePreset === 'fit') {
      const pageWidth = imgW + margin * 2;
      const pageHeight = imgH + margin * 2;
      const page = pdfDoc.addPage([pageWidth, pageHeight]);
      page.drawImage(embeddedImage, {
        x: margin,
        y: margin,
        width: imgW,
        height: imgH,
      });
    } else {
      const baseSize =
        pagePreset === 'letter' ? PageSizes.Letter : PageSizes.A4;
      const isLandscape =
        orientation === 'landscape' ||
        (orientation === 'auto' && imgW > imgH);

      const pageWidth = isLandscape ? baseSize[1] : baseSize[0];
      const pageHeight = isLandscape ? baseSize[0] : baseSize[1];

      const availableW = Math.max(10, pageWidth - margin * 2);
      const availableH = Math.max(10, pageHeight - margin * 2);

      const scale = Math.min(availableW / imgW, availableH / imgH);
      const drawW = imgW * scale;
      const drawH = imgH * scale;

      const x = (pageWidth - drawW) / 2;
      const y = (pageHeight - drawH) / 2;

      const page = pdfDoc.addPage([pageWidth, pageHeight]);
      page.drawImage(embeddedImage, {
        x,
        y,
        width: drawW,
        height: drawH,
      });
    }
  }

  const pdfBytes = await pdfDoc.save();
  return {
    pdfBytes,
    pageCount: pdfDoc.getPageCount(),
  };
}

export async function inspectPdfPageCount(pdfBytes: Uint8Array): Promise<number> {
  const doc = await PDFDocument.load(pdfBytes);
  return doc.getPageCount();
}

export async function mergePdfDocuments(
  pdfBuffers: Uint8Array[]
): Promise<{ pdfBytes: Uint8Array; totalPages: number; pageCounts: number[] }> {
  if (!pdfBuffers || pdfBuffers.length < 2) {
    throw new Error('Select at least two PDF documents to merge.');
  }

  const mergedPdf = await PDFDocument.create();
  const pageCounts: number[] = [];

  for (const buffer of pdfBuffers) {
    const sourceDoc = await PDFDocument.load(buffer);
    const count = sourceDoc.getPageCount();
    pageCounts.push(count);
    const copiedPages = await mergedPdf.copyPages(
      sourceDoc,
      sourceDoc.getPageIndices()
    );
    for (const page of copiedPages) {
      mergedPdf.addPage(page);
    }
  }

  const pdfBytes = await mergedPdf.save();
  return {
    pdfBytes,
    totalPages: mergedPdf.getPageCount(),
    pageCounts,
  };
}

export async function createSamplePdfBytes(
  title: string,
  subtitle: string,
  accentHex: [number, number, number] = [0.26, 0.22, 0.79]
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const page = pdfDoc.addPage(PageSizes.A4);
  const { width, height } = page.getSize();

  page.drawRectangle({
    x: 48,
    y: height - 130,
    width: width - 96,
    height: 64,
    color: rgb(accentHex[0], accentHex[1], accentHex[2]),
  });

  page.drawText('NxK Tools — Sample PDF Document', {
    x: 64,
    y: height - 92,
    size: 11,
    font: fontRegular,
    color: rgb(0.95, 0.96, 1),
  });

  page.drawText(title, {
    x: 64,
    y: height - 114,
    size: 18,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page.drawText(subtitle, {
    x: 48,
    y: height - 175,
    size: 13,
    font: fontBold,
    color: rgb(0.1, 0.12, 0.16),
  });

  page.drawText(
    'This sample PDF was generated locally in your browser using pdf-lib to verify PDF merging and page ordering.',
    {
      x: 48,
      y: height - 205,
      size: 10.5,
      font: fontRegular,
      color: rgb(0.3, 0.33, 0.38),
      maxWidth: width - 96,
      lineHeight: 16,
    }
  );

  return pdfDoc.save();
}

export function triggerBrowserDownload(
  blobOrDataUrl: Blob | string,
  filename: string
): void {
  if (typeof document === 'undefined') return;
  const link = document.createElement('a');
  let objectUrl: string | null = null;

  if (typeof blobOrDataUrl === 'string') {
    link.href = blobOrDataUrl;
  } else {
    objectUrl = URL.createObjectURL(blobOrDataUrl);
    link.href = objectUrl;
  }

  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  if (objectUrl) {
    setTimeout(() => URL.revokeObjectURL(objectUrl!), 3000);
  }
}
