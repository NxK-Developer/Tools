import {
  TOOL_REGISTRY,
  CATEGORY_REGISTRY,
  ToolDefinition,
  CategoryDefinition,
  ToolCategoryId,
  ToolAvailability,
  getCategoryById,
} from './toolRegistry';

export interface HighlightSegment {
  text: string;
  matched: boolean;
}

export interface IndexedToolDocument {
  id: string;
  tool: ToolDefinition;
  category: CategoryDefinition | undefined;
  normalizedName: string;
  normalizedId: string;
  normalizedDescription: string;
  normalizedCategoryName: string;
  normalizedKeywords: string[];
  aliases: string[];
  searchableTokens: string[];
}

export interface ToolSearchResult {
  tool: ToolDefinition;
  category: CategoryDefinition | undefined;
  score: number;
  matchedBy: string;
  nameHighlights: HighlightSegment[];
  descriptionHighlights: HighlightSegment[];
}

export interface CategorySearchResult {
  category: CategoryDefinition;
  toolCount: number;
  availableCount: number;
  score: number;
}

export interface RegistrySearchResponse {
  query: string;
  normalizedTerms: string[];
  tools: ToolSearchResult[];
  categories: CategorySearchResult[];
  totalMatches: number;
}

const TOOL_ALIASES: Record<string, string[]> = {
  'image-compressor': ['shrink', 'reduce file size', 'tinypng', 'minify image', 'jpg', ' lossy'],
  'image-resizer': ['crop', 'scale', 'resolution', 'pixel', 'px', 'aspect'],
  'word-counter': ['char count', 'letter count', 'essay length', 'words', 'chars', 'frequency'],
  'case-converter': ['capitalization', 'caps', 'pascalcase', 'kebab', 'snake', 'camel', 'lower', 'upper'],
  'qr-code-generator': ['barcode', '2d code', 'wifi qr', 'link to qr', 'scanner'],
  'percentage-calculator': ['percent change', 'margin', 'markup', 'growth', 'ratio', 'fraction'],
  'images-to-pdf': ['photo to pdf', 'combine pictures', 'print to pdf', 'jpeg to pdf'],
  'merge-pdf': ['combine pdf', 'join pdf', 'concat pdf', 'binder'],
  'json-formatter': ['beautify json', 'json lint', 'json parser', 'pretty json', 'minify json', 'api payload'],
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s\-_]/g, ' ')
    .split(/[\s\-_]+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

/**
 * Builds an in-memory searchable index from the centralized tool registry.
 */
export function buildToolSearchIndex(
  tools: ToolDefinition[] = TOOL_REGISTRY
): IndexedToolDocument[] {
  return tools.map((tool) => {
    const category = getCategoryById(tool.category);
    const normalizedName = tool.name.toLowerCase();
    const normalizedId = tool.id.toLowerCase();
    const normalizedDescription = tool.shortDescription.toLowerCase();
    const normalizedCategoryName = (category?.name ?? tool.category).toLowerCase();
    const normalizedKeywords = tool.keywords.map((k) => k.toLowerCase());
    const aliases = (TOOL_ALIASES[tool.id] ?? []).map((a) => a.toLowerCase());

    const tokenSet = new Set<string>([
      ...tokenize(normalizedName),
      ...tokenize(normalizedId),
      ...tokenize(normalizedDescription),
      ...tokenize(normalizedCategoryName),
      ...normalizedKeywords.flatMap(tokenize),
      ...aliases.flatMap(tokenize),
    ]);

    return {
      id: tool.id,
      tool,
      category,
      normalizedName,
      normalizedId,
      normalizedDescription,
      normalizedCategoryName,
      normalizedKeywords,
      aliases,
      searchableTokens: Array.from(tokenSet),
    };
  });
}

// Singleton pre-indexed registry for fast O(N) lookups across keystrokes
const PREBUILT_INDEX: IndexedToolDocument[] = buildToolSearchIndex(TOOL_REGISTRY);

export function getSearchIndex(): IndexedToolDocument[] {
  return PREBUILT_INDEX;
}

/**
 * Splits text into matched and unmatched segments for safe, XSS-free UI highlighting.
 */
export function highlightTextSegments(
  text: string,
  terms: string[]
): HighlightSegment[] {
  const cleanTerms = terms
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 0);

  if (cleanTerms.length === 0 || !text) {
    return [{ text, matched: false }];
  }

  // Sort longer terms first to prevent partial sub-matches from splitting longer matches
  const sortedTerms = Array.from(new Set(cleanTerms)).sort((a, b) => b.length - a.length);
  const escaped = sortedTerms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');

  const parts = text.split(pattern);
  const segments: HighlightSegment[] = [];

  for (const part of parts) {
    if (!part) continue;
    const isMatch = sortedTerms.some((term) => part.toLowerCase() === term);
    segments.push({ text: part, matched: isMatch });
  }

  return segments.length > 0 ? segments : [{ text, matched: false }];
}

export interface SearchIndexOptions {
  category?: ToolCategoryId | 'all';
  availability?: ToolAvailability | 'all';
  limit?: number;
}

/**
 * Queries the searchable index and returns ranked tool and category matches.
 */
export function querySearchIndex(
  rawQuery: string,
  options?: SearchIndexOptions
): RegistrySearchResponse {
  const trimmedQuery = rawQuery.trim().toLowerCase();
  const terms = trimmedQuery.split(/\s+/).filter(Boolean);
  const categoryFilter = options?.category ?? 'all';
  const availabilityFilter = options?.availability ?? 'all';

  const toolResults: ToolSearchResult[] = [];

  for (const doc of PREBUILT_INDEX) {
    if (categoryFilter !== 'all' && doc.tool.category !== categoryFilter) {
      continue;
    }
    if (availabilityFilter !== 'all' && doc.tool.availability !== availabilityFilter) {
      continue;
    }

    // If query is empty, return all filtered tools ordered with available first
    if (terms.length === 0) {
      const baseScore = doc.tool.availability === ToolAvailability.AVAILABLE ? 10 : 5;
      toolResults.push({
        tool: doc.tool,
        category: doc.category,
        score: baseScore,
        matchedBy: doc.category?.name ?? doc.tool.category,
        nameHighlights: [{ text: doc.tool.name, matched: false }],
        descriptionHighlights: [{ text: doc.tool.shortDescription, matched: false }],
      });
      continue;
    }

    let totalScore = 0;
    let allTermsMatched = true;
    let primaryMatchReason = '';

    // Phrase bonus if the full query appears verbatim in name
    if (doc.normalizedName === trimmedQuery) {
      totalScore += 150;
      primaryMatchReason = 'Exact name match';
    } else if (doc.normalizedName.startsWith(trimmedQuery)) {
      totalScore += 90;
      primaryMatchReason = 'Name prefix';
    } else if (doc.normalizedName.includes(trimmedQuery)) {
      totalScore += 60;
      primaryMatchReason = 'Tool name';
    }

    for (const term of terms) {
      let termScore = 0;

      if (doc.normalizedName.split(/\s+/).some((word) => word === term)) {
        termScore += 50;
        if (!primaryMatchReason) primaryMatchReason = 'Tool name';
      } else if (doc.normalizedName.includes(term)) {
        termScore += 35;
        if (!primaryMatchReason) primaryMatchReason = 'Tool name';
      }

      if (doc.normalizedId === term || doc.normalizedId.startsWith(term)) {
        termScore += 30;
        if (!primaryMatchReason) primaryMatchReason = 'Tool ID';
      }

      const matchedKeyword = doc.normalizedKeywords.find(
        (kw) => kw === term || kw.startsWith(term) || kw.includes(term)
      );
      if (matchedKeyword) {
        termScore += matchedKeyword === term ? 28 : 18;
        if (!primaryMatchReason) primaryMatchReason = `Keyword: ${matchedKeyword}`;
      }

      const matchedAlias = doc.aliases.find((alias) => alias.includes(term));
      if (matchedAlias) {
        termScore += 22;
        if (!primaryMatchReason) primaryMatchReason = `Related: ${matchedAlias}`;
      }

      if (
        doc.normalizedCategoryName.includes(term) ||
        doc.tool.category.toLowerCase().includes(term)
      ) {
        termScore += 20;
        if (!primaryMatchReason) {
          primaryMatchReason = `Category: ${doc.category?.name ?? doc.tool.category}`;
        }
      }

      if (doc.normalizedDescription.includes(term)) {
        termScore += 12;
        if (!primaryMatchReason) primaryMatchReason = 'Description match';
      }

      const tokenPrefixMatch = doc.searchableTokens.some((tok) => tok.startsWith(term));
      if (termScore === 0 && tokenPrefixMatch) {
        termScore += 10;
        if (!primaryMatchReason) primaryMatchReason = 'Index token';
      }

      if (termScore === 0) {
        allTermsMatched = false;
        break;
      }

      totalScore += termScore;
    }

    if (!allTermsMatched) {
      continue;
    }

    // Slight tie-breaker boost for available tools
    if (doc.tool.availability === ToolAvailability.AVAILABLE) {
      totalScore += 4;
    }

    toolResults.push({
      tool: doc.tool,
      category: doc.category,
      score: totalScore,
      matchedBy: primaryMatchReason || (doc.category?.name ?? doc.tool.category),
      nameHighlights: highlightTextSegments(doc.tool.name, terms),
      descriptionHighlights: highlightTextSegments(doc.tool.shortDescription, terms),
    });
  }

  toolResults.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.tool.name.localeCompare(b.tool.name);
  });

  const limitedTools =
    options?.limit !== undefined ? toolResults.slice(0, options.limit) : toolResults;

  // Match categories when searching
  const categoryResults: CategorySearchResult[] = [];
  if (terms.length > 0) {
    for (const cat of CATEGORY_REGISTRY) {
      const catHaystack = `${cat.id} ${cat.name} ${cat.shortDescription} ${cat.description}`.toLowerCase();
      const matchesAll = terms.every((term) => catHaystack.includes(term));
      if (matchesAll) {
        const catTools = TOOL_REGISTRY.filter((t) => t.category === cat.id);
        const availableCount = catTools.filter(
          (t) => t.availability === ToolAvailability.AVAILABLE
        ).length;
        const score =
          cat.name.toLowerCase().startsWith(trimmedQuery) ||
          cat.id.toLowerCase() === trimmedQuery
            ? 100
            : 50;

        categoryResults.push({
          category: cat,
          toolCount: catTools.length,
          availableCount,
          score,
        });
      }
    }
    categoryResults.sort((a, b) => b.score - a.score);
  }

  return {
    query: rawQuery,
    normalizedTerms: terms,
    tools: limitedTools,
    categories: categoryResults,
    totalMatches: toolResults.length + categoryResults.length,
  };
}
