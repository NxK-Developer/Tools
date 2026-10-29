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
}

export const CATEGORY_REGISTRY: CategoryDefinition[] = [
  {
    id: ToolCategoryId.IMAGE,
    name: 'Image Tools',
    shortDescription: 'Compress, resize, and prepare image assets directly in your browser.',
    description:
      'Client-side utilities for optimizing and resizing raster graphics without uploading files to external servers.',
    route: '/category/image',
    icon: 'image',
  },
  {
    id: ToolCategoryId.TEXT,
    name: 'Text Tools',
    shortDescription: 'Count words, inspect document length, and transform text casing.',
    description:
      'Fast text processing utilities for writers, students, and editors to inspect metrics and normalize formatting.',
    route: '/category/text',
    icon: 'type',
  },
  {
    id: ToolCategoryId.QR,
    name: 'QR Tools',
    shortDescription: 'Generate scannable QR codes for URLs, plain text, and contact strings.',
    description:
      'Utilities for creating clean, customizable QR codes for print and digital sharing.',
    route: '/category/qr',
    icon: 'qr-code',
  },
  {
    id: ToolCategoryId.CALCULATOR,
    name: 'Calculator Tools',
    shortDescription: 'Run everyday percentage, ratio, and proportional calculations.',
    description:
      'Clear numerical calculators with step-by-step formulas and instant updates as you type.',
    route: '/category/calculator',
    icon: 'calculator',
  },
  {
    id: ToolCategoryId.PDF,
    name: 'PDF Tools',
    shortDescription: 'Combine images into PDF documents and merge multi-page PDF files.',
    description:
      'Document assembly tools designed for organizing and combining PDFs locally.',
    route: '/category/pdf',
    icon: 'file-stack',
  },
  {
    id: ToolCategoryId.DEVELOPER,
    name: 'Developer Tools',
    shortDescription: 'Format, validate, and minify structured data such as JSON payloads.',
    description:
      'Inspection and formatting utilities built for debugging API responses and configuration files.',
    route: '/category/developer',
    icon: 'code-2',
  },
];

/**
 * Centralized tool registry for NxK Tools.
 * Rule: Only mark tools as ToolAvailability.AVAILABLE when their actual
 * client-side functionality is implemented and tested.
 */
export const TOOL_REGISTRY: ToolDefinition[] = [
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    shortDescription: 'Reduce JPEG, PNG, and WebP file sizes with adjustable quality targets.',
    category: ToolCategoryId.IMAGE,
    route: '/tools/image-compressor',
    icon: 'image-down',
    availability: ToolAvailability.PLANNED,
    keywords: ['image', 'compress', 'optimize', 'size', 'jpeg', 'png', 'webp'],
    implementationNotes:
      'Planned module: HTML5 Canvas re-encoding pipeline with before/after byte comparison and local download.',
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    shortDescription: 'Resize images by exact pixel dimensions or percentage scale with aspect ratio lock.',
    category: ToolCategoryId.IMAGE,
    route: '/tools/image-resizer',
    icon: 'scaling',
    availability: ToolAvailability.PLANNED,
    keywords: ['image', 'resize', 'dimensions', 'width', 'height', 'scale', 'aspect ratio'],
    implementationNotes:
      'Planned module: Dimension scaling canvas workspace with preset social and document resolutions.',
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    shortDescription: 'Count words, characters, sentences, paragraphs, and estimated reading time in real time.',
    category: ToolCategoryId.TEXT,
    route: '/tools/word-counter',
    icon: 'file-text',
    availability: ToolAvailability.AVAILABLE,
    keywords: ['text', 'word', 'counter', 'character', 'length', 'sentences', 'paragraphs', 'reading time'],
    implementationNotes:
      'Active module: Instant client-side lexical analysis with word frequency breakdown.',
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    shortDescription: 'Convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, and snake_case.',
    category: ToolCategoryId.TEXT,
    route: '/tools/case-converter',
    icon: 'case-sensitive',
    availability: ToolAvailability.AVAILABLE,
    keywords: ['text', 'case', 'uppercase', 'lowercase', 'title case', 'camelcase', 'snake_case', 'kebab-case'],
    implementationNotes:
      'Active module: Multi-format text case transformer with one-click copy and sample presets.',
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    shortDescription: 'Create downloadable QR codes from URLs, plain text, or Wi-Fi credentials.',
    category: ToolCategoryId.QR,
    route: '/tools/qr-code-generator',
    icon: 'qr-code',
    availability: ToolAvailability.PLANNED,
    keywords: ['qr', 'barcode', 'generator', 'url', 'scan', 'matrix'],
    implementationNotes:
      'Planned module: Client-side Reed-Solomon QR matrix renderer with SVG and PNG export options.',
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    shortDescription: 'Calculate percentages of numbers, percentage ratios, and percentage increase or decrease.',
    category: ToolCategoryId.CALCULATOR,
    route: '/tools/percentage-calculator',
    icon: 'percent',
    availability: ToolAvailability.AVAILABLE,
    keywords: ['calculator', 'percentage', 'math', 'discount', 'change', 'increase', 'decrease', 'ratio'],
    implementationNotes:
      'Active module: Three-way interactive percentage solver with formula explanations.',
  },
  {
    id: 'images-to-pdf',
    name: 'Images to PDF',
    shortDescription: 'Combine one or more JPG and PNG images into a clean, printable PDF document.',
    category: ToolCategoryId.PDF,
    route: '/tools/images-to-pdf',
    icon: 'file-Output',
    availability: ToolAvailability.PLANNED,
    keywords: ['pdf', 'images', 'convert', 'jpg to pdf', 'png to pdf', 'document'],
    implementationNotes:
      'Planned module: Client-side page layout composer and binary PDF stream generator.',
  },
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    shortDescription: 'Combine multiple PDF files in your preferred order into a single document.',
    category: ToolCategoryId.PDF,
    route: '/tools/merge-pdf',
    icon: 'files',
    availability: ToolAvailability.PLANNED,
    keywords: ['pdf', 'merge', 'combine', 'join', 'document', 'pages'],
    implementationNotes:
      'Planned module: Multi-file PDF page tree combiner with drag-to-reorder queue.',
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    shortDescription: 'Validate, pretty-print, minify, and sort keys in JSON data with clear syntax error reporting.',
    category: ToolCategoryId.DEVELOPER,
    route: '/tools/json-formatter',
    icon: 'braces',
    availability: ToolAvailability.AVAILABLE,
    keywords: ['developer', 'json', 'formatter', 'validator', 'minify', 'pretty print', 'syntax'],
    implementationNotes:
      'Active module: Strict JSON parser, recursive key sorter, indentation controller, and error inspector.',
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
  return TOOL_REGISTRY;
}

export function getToolById(toolId: string): ToolDefinition | undefined {
  const normalized = toolId.trim().toLowerCase();
  return TOOL_REGISTRY.find((tool) => tool.id === normalized);
}

export function getToolsByCategory(categoryId: string): ToolDefinition[] {
  const normalized = categoryId.trim().toLowerCase();
  return TOOL_REGISTRY.filter((tool) => tool.category === normalized);
}

export function searchTools(
  query: string,
  options?: {
    category?: ToolCategoryId | 'all';
    availability?: ToolAvailability | 'all';
  }
): ToolDefinition[] {
  const normalizedQuery = query.trim().toLowerCase();
  const categoryFilter = options?.category ?? 'all';
  const availabilityFilter = options?.availability ?? 'all';

  return TOOL_REGISTRY.filter((tool) => {
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
      ...tool.keywords,
    ]
      .join(' ')
      .toLowerCase();

    const terms = normalizedQuery.split(/\s+/).filter(Boolean);
    return terms.every((term) => haystack.includes(term));
  });
}

export function getCatalogSummary() {
  const totalTools = TOOL_REGISTRY.length;
  const availableTools = TOOL_REGISTRY.filter(
    (t) => t.availability === ToolAvailability.AVAILABLE
  ).length;
  const plannedTools = TOOL_REGISTRY.filter(
    (t) => t.availability === ToolAvailability.PLANNED
  ).length;
  const totalCategories = CATEGORY_REGISTRY.length;

  return {
    totalTools,
    availableTools,
    plannedTools,
    totalCategories,
  };
}
