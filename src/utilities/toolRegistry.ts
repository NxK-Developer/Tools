export enum ToolCategoryId {
  IMAGE = 'image',
  TEXT = 'text',
  QR = 'qr',
  CALCULATOR = 'calculator',
  PDF = 'pdf',
  DEVELOPER = 'developer',
}

export enum ToolAvailability {
  AVAILABLE = 'available',
  PLANNED = 'planned',
}

export type ToolIconId =
  | 'image-down'
  | 'scaling'
  | 'file-text'
  | 'case-sensitive'
  | 'qr-code'
  | 'percent'
  | 'file-Output'
  | 'files'
  | 'braces'
  | 'image'
  | 'type'
  | 'calculator'
  | 'file-stack'
  | 'code-2';

export interface CategoryDefinition {
  id: ToolCategoryId;
  name: string;
  shortName: string;
  shortDescription: string;
  description: string;
  route: string;
  icon: ToolIconId;
}

export interface ToolDefinition {
  id: string;
  name: string;
  shortDescription: string;
  category: ToolCategoryId;
  route: string;
  icon: ToolIconId;
  availability: ToolAvailability;
  keywords: string[];
  implementationNotes: string;
  instructions: string[];
}

export const CATEGORY_REGISTRY: CategoryDefinition[] = [
  {
    id: ToolCategoryId.IMAGE,
    name: 'Image Tools',
    shortName: 'Image',
    shortDescription: 'Tools for working with your images.',
    description:
      'Client-side utilities for compressing, resizing, and optimizing raster graphics without uploading files to external servers.',
    route: '/category/image',
    icon: 'image',
  },
  {
    id: ToolCategoryId.PDF,
    name: 'PDF Tools',
    shortName: 'PDF',
    shortDescription: 'Combine images into PDF documents and merge multi-page PDF files.',
    description:
      'Document assembly tools designed for organizing and combining PDFs locally in your browser.',
    route: '/category/pdf',
    icon: 'file-stack',
  },
  {
    id: ToolCategoryId.TEXT,
    name: 'Text Tools',
    shortName: 'Text',
    shortDescription: 'Count words, inspect document length, and transform text casing.',
    description:
      'Fast text processing utilities for writers, students, and editors to inspect metrics and normalize formatting.',
    route: '/category/text',
    icon: 'type',
  },
  {
    id: ToolCategoryId.QR,
    name: 'QR Code Tools',
    shortName: 'QR Code',
    shortDescription: 'Generate scannable QR codes for URLs, plain text, and contact strings.',
    description:
      'Utilities for creating clean, customizable QR codes for print and digital sharing.',
    route: '/category/qr',
    icon: 'qr-code',
  },
  {
    id: ToolCategoryId.CALCULATOR,
    name: 'Calculators',
    shortName: 'Calculators',
    shortDescription: 'Run everyday percentage, ratio, and proportional calculations.',
    description:
      'Clear numerical calculators with step-by-step formulas and instant updates as you type.',
    route: '/category/calculator',
    icon: 'calculator',
  },
  {
    id: ToolCategoryId.DEVELOPER,
    name: 'Developer Tools',
    shortName: 'Developer Tools',
    shortDescription: 'Format, validate, and minify structured data such as JSON payloads.',
    description:
      'Inspection and formatting utilities built for debugging API responses and configuration files.',
    route: '/category/developer',
    icon: 'code-2',
  },
];

/**
 * Centralized active tool registry for NxK Tools.
 * Contains only fully implemented, route-backed tools (ToolAvailability.AVAILABLE).
 * Ordered with the 5 core initial tools first (Image Compressor, Image Resizer,
 * Word Counter, QR Code Generator, Percentage Calculator) followed by the remaining
 * implemented utilities (Case Converter, Images to PDF, Merge PDF, JSON Formatter).
 */
export const TOOL_REGISTRY: ToolDefinition[] = [
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    shortDescription: 'Reduce image file size without losing quality.',
    category: ToolCategoryId.IMAGE,
    route: '/tools/image-compressor',
    icon: 'image-down',
    availability: ToolAvailability.AVAILABLE,
    keywords: ['image', 'compress', 'optimize', 'size', 'jpeg', 'png', 'webp', 'quality'],
    implementationNotes:
      'Active module: HTML5 Canvas re-encoding pipeline with before/after byte comparison and local download.',
    instructions: [
      'Drop a local JPEG, PNG, or WebP image into the browser workspace or load the sample image.',
      'Select an output format, adjust the compression quality slider, and click Compress Image to compare file size savings.',
      'Download the optimized image directly to your device.',
    ],
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    shortDescription: 'Resize images to your desired dimensions with aspect ratio lock.',
    category: ToolCategoryId.IMAGE,
    route: '/tools/image-resizer',
    icon: 'scaling',
    availability: ToolAvailability.AVAILABLE,
    keywords: ['image', 'resize', 'dimensions', 'width', 'height', 'scale', 'aspect ratio'],
    implementationNotes:
      'Active module: Dimension scaling canvas workspace with aspect ratio lock and percentage scale presets.',
    instructions: [
      'Select an image file from your computer or mobile device, or load the sample frame.',
      'Specify target width and height in pixels with aspect ratio locked, or choose a percentage preset.',
      'Click Resize Image and download the resized image in PNG, JPEG, or WebP format.',
    ],
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    shortDescription: 'Count words, characters, sentences, paragraphs, and reading time.',
    category: ToolCategoryId.TEXT,
    route: '/tools/word-counter',
    icon: 'file-text',
    availability: ToolAvailability.AVAILABLE,
    keywords: ['text', 'word', 'counter', 'character', 'length', 'sentences', 'paragraphs', 'reading time'],
    implementationNotes:
      'Active module: Instant client-side lexical analysis with Unicode support and word frequency breakdown.',
    instructions: [
      'Type or paste your text directly into the writing area.',
      'Review live counts for words, characters, characters excluding spaces, sentences, and paragraphs.',
      'Use Copy Text or Clear Text to manage your draft, or Copy Summary to save the metrics.',
    ],
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    shortDescription: 'Create downloadable QR codes from text or URLs.',
    category: ToolCategoryId.QR,
    route: '/tools/qr-code-generator',
    icon: 'qr-code',
    availability: ToolAvailability.AVAILABLE,
    keywords: ['qr', 'barcode', 'generator', 'url', 'scan', 'matrix'],
    implementationNotes:
      'Active module: Client-side Reed-Solomon QR matrix renderer with high-resolution PNG export.',
    instructions: [
      'Enter a destination URL, text note, or Wi-Fi configuration string.',
      'Click Generate QR Code and choose your desired PNG resolution, error correction level, and margin.',
      'Download the generated QR code as a crisp PNG file.',
    ],
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    shortDescription: 'Calculate percentages, ratios, and percentage changes easily and quickly.',
    category: ToolCategoryId.CALCULATOR,
    route: '/tools/percentage-calculator',
    icon: 'percent',
    availability: ToolAvailability.AVAILABLE,
    keywords: ['calculator', 'percentage', 'math', 'discount', 'change', 'increase', 'decrease', 'ratio'],
    implementationNotes:
      'Active module: Three-way interactive percentage solver with formula explanations.',
    instructions: [
      'Choose the calculation card that matches your question: Percentage of a Value, Ratio to Percentage, or Percentage Change.',
      'Enter numeric values into the two input fields and click Calculate.',
      'Read the formatted result and the underlying mathematical formula shown underneath.',
    ],
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    shortDescription: 'Convert text between UPPERCASE, lowercase, Title Case, camelCase, and snake_case.',
    category: ToolCategoryId.TEXT,
    route: '/tools/case-converter',
    icon: 'case-sensitive',
    availability: ToolAvailability.AVAILABLE,
    keywords: ['text', 'case', 'uppercase', 'lowercase', 'title case', 'camelcase', 'snake_case', 'kebab-case'],
    implementationNotes:
      'Active module: Multi-format text case transformer with one-click copy and sample presets.',
    instructions: [
      'Select your target case style (such as Title Case, camelCase, or snake_case) from the format bar.',
      'Enter or paste your source text into the Original Text field on the left.',
      'Copy the converted output from the right-hand pane using the Copy Result button.',
    ],
  },
  {
    id: 'images-to-pdf',
    name: 'Images to PDF',
    shortDescription: 'Convert and combine JPG, PNG, and WebP images into a printable PDF file.',
    category: ToolCategoryId.PDF,
    route: '/tools/images-to-pdf',
    icon: 'file-Output',
    availability: ToolAvailability.AVAILABLE,
    keywords: ['pdf', 'images', 'convert', 'jpg to pdf', 'png to pdf', 'document'],
    implementationNotes:
      'Active module: Client-side page layout composer and binary PDF stream generator with preview.',
    instructions: [
      'Add one or more JPEG, PNG, or WebP images to the page queue.',
      'Use the up/down arrows to arrange page order and choose page size, orientation, and margin.',
      'Click Generate PDF to preview and download the compiled PDF document locally.',
    ],
  },
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    shortDescription: 'Combine multiple PDF files in your selected order into one document.',
    category: ToolCategoryId.PDF,
    route: '/tools/merge-pdf',
    icon: 'files',
    availability: ToolAvailability.AVAILABLE,
    keywords: ['pdf', 'merge', 'combine', 'join', 'document', 'pages'],
    implementationNotes:
      'Active module: Multi-file PDF page tree combiner with custom ordering queue and preview.',
    instructions: [
      'Add two or more PDF files to the document merge queue.',
      'Use the up and down arrow buttons to arrange the files in the exact sequence they should appear.',
      'Click Merge PDFs to preview and download the combined PDF file directly in your browser.',
    ],
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    shortDescription: 'Format, validate, minify, and beautify JSON data with error reporting.',
    category: ToolCategoryId.DEVELOPER,
    route: '/tools/json-formatter',
    icon: 'braces',
    availability: ToolAvailability.AVAILABLE,
    keywords: ['developer', 'json', 'formatter', 'validator', 'minify', 'pretty print', 'syntax', 'beautify'],
    implementationNotes:
      'Active module: Strict JSON parser, recursive key sorter, indentation controller, and error inspector.',
    instructions: [
      'Paste raw or minified JSON into the Raw JSON Input editor on the left.',
      'Toggle between 2 Spaces, 4 Spaces, or Minify, and optionally enable alphabetical key sorting.',
      'If the JSON is valid, copy the formatted output; if invalid, inspect the syntax error message to locate the issue.',
    ],
  },
];

/**
 * Internal backlog of planned future tools (ToolAvailability.PLANNED).
 * Kept separate from active user-facing grids so unimplemented controls are never exposed as fake cards.
 */
export const PLANNED_TOOL_REGISTRY: ToolDefinition[] = [
  {
    id: 'split-pdf',
    name: 'Split PDF',
    shortDescription: 'Extract specific page ranges or split a PDF into individual page files.',
    category: ToolCategoryId.PDF,
    route: '/tools/split-pdf',
    icon: 'file-stack',
    availability: ToolAvailability.PLANNED,
    keywords: ['pdf', 'split', 'extract', 'pages', 'separate'],
    implementationNotes:
      'Planned module: Client-side page range extractor using pdf-lib.',
    instructions: [
      'Upload a multi-page PDF document.',
      'Select page ranges to extract into separate files.',
      'Download the extracted PDF pages locally.',
    ],
  },
  {
    id: 'pdf-page-organizer',
    name: 'PDF Page Organizer',
    shortDescription: 'Reorder, rotate, or remove individual pages inside a PDF document.',
    category: ToolCategoryId.PDF,
    route: '/tools/pdf-page-organizer',
    icon: 'files',
    availability: ToolAvailability.PLANNED,
    keywords: ['pdf', 'organize', 'rotate', 'reorder', 'delete pages'],
    implementationNotes:
      'Planned module: Client-side page manipulation workspace.',
    instructions: [
      'Upload a PDF file to inspect its pages.',
      'Reorder, rotate, or remove selected pages.',
      'Export the updated PDF document.',
    ],
  },
];

export function getAllCategories(): CategoryDefinition[] {
  return CATEGORY_REGISTRY;
}

export function getCategoryById(categoryId: string): CategoryDefinition | undefined {
  const normalized = categoryId.trim().toLowerCase();
  return CATEGORY_REGISTRY.find((cat) => cat.id === normalized);
}

export function getAllTools(): ToolDefinition[] {
  return TOOL_REGISTRY.filter((tool) => tool.availability === ToolAvailability.AVAILABLE);
}

export function getPlannedTools(): ToolDefinition[] {
  return PLANNED_TOOL_REGISTRY;
}

export function getPlannedToolsByCategory(categoryId: string): ToolDefinition[] {
  const normalized = categoryId.trim().toLowerCase();
  return PLANNED_TOOL_REGISTRY.filter(
    (tool) =>
      tool.category === normalized && tool.availability === ToolAvailability.PLANNED
  );
}

export function getToolById(toolId: string): ToolDefinition | undefined {
  const normalized = toolId.trim().toLowerCase();
  return (
    TOOL_REGISTRY.find((tool) => tool.id === normalized) ??
    PLANNED_TOOL_REGISTRY.find((tool) => tool.id === normalized)
  );
}

export function getToolsByCategory(categoryId: string): ToolDefinition[] {
  const normalized = categoryId.trim().toLowerCase();
  return TOOL_REGISTRY.filter(
    (tool) =>
      tool.category === normalized && tool.availability === ToolAvailability.AVAILABLE
  );
}

/**
 * Unified search and filtering logic shared across Homepage, Header Quick Search,
 * Mobile Navigation Search, All Tools Directory, and Search Results Page.
 * Matches by tool name, category (ID, name, shortName), description, and keywords,
 * and ranks direct name/category matches first. Only exposes AVAILABLE tools by default.
 */
export function searchTools(
  query: string,
  options?: {
    category?: ToolCategoryId | 'all';
    availability?: ToolAvailability | 'all';
  }
): ToolDefinition[] {
  const normalizedQuery = query.trim().toLowerCase();
  const categoryFilter = options?.category ?? 'all';
  const availabilityFilter = options?.availability ?? ToolAvailability.AVAILABLE;

  const sourceList =
    availabilityFilter === 'all'
      ? [...TOOL_REGISTRY, ...PLANNED_TOOL_REGISTRY]
      : availabilityFilter === ToolAvailability.PLANNED
      ? PLANNED_TOOL_REGISTRY
      : TOOL_REGISTRY;

  const matching = sourceList.filter((tool) => {
    if (categoryFilter !== 'all' && tool.category !== categoryFilter) {
      return false;
    }
    if (availabilityFilter !== 'all' && tool.availability !== availabilityFilter) {
      return false;
    }
    if (!normalizedQuery) {
      return true;
    }

    const categoryMeta = getCategoryById(tool.category);
    const haystack = [
      tool.name,
      tool.shortDescription,
      tool.category,
      categoryMeta?.name ?? '',
      categoryMeta?.shortName ?? '',
      categoryMeta?.shortDescription ?? '',
      ...tool.keywords,
    ]
      .join(' ')
      .toLowerCase();

    const terms = normalizedQuery.split(/\s+/).filter(Boolean);
    return terms.every((term) => haystack.includes(term));
  });

  if (!normalizedQuery) {
    return matching;
  }

  return [...matching].sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    const aStarts = aName.startsWith(normalizedQuery) ? 2 : aName.includes(normalizedQuery) ? 1 : 0;
    const bStarts = bName.startsWith(normalizedQuery) ? 2 : bName.includes(normalizedQuery) ? 1 : 0;
    return bStarts - aStarts;
  });
}

export function getCatalogSummary() {
  const availableTools = TOOL_REGISTRY.filter(
    (t) => t.availability === ToolAvailability.AVAILABLE
  ).length;
  const plannedTools = PLANNED_TOOL_REGISTRY.filter(
    (t) => t.availability === ToolAvailability.PLANNED
  ).length;
  const totalTools = availableTools;
  const totalCategories = CATEGORY_REGISTRY.length;

  return {
    totalTools,
    availableTools,
    plannedTools,
    totalCategories,
  };
}
