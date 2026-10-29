export interface WordCountMetrics {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTimeMinutes: number;
  topWords: Array<{ word: string; count: number }>;
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'that', 'this', 'with', 'from', 'your', 'have', 'are',
  'was', 'were', 'will', 'would', 'could', 'should', 'into', 'about', 'than',
  'then', 'them', 'they', 'their', 'there', 'here', 'what', 'when', 'where',
  'which', 'while', 'who', 'whom', 'whose', 'why', 'how', 'not', 'but', 'you',
  'our', 'out', 'all', 'any', 'can', 'had', 'has', 'her', 'his', 'its', 'may',
  'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'let', 'put',
  'say', 'she', 'too', 'use', 'one', 'also', 'been', 'more', 'some', 'such',
]);

export function analyzeText(input: string): WordCountMetrics {
  if (!input || input.trim().length === 0) {
    return {
      words: 0,
      characters: input ? Array.from(input).length : 0,
      charactersNoSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      lines: input ? input.split(/\r\n|\r|\n/).length : 0,
      readingTimeMinutes: 0,
      topWords: [],
    };
  }

  // Use Array.from so astral Unicode characters (emojis, CJK extensions) count accurately as 1 character
  const characters = Array.from(input).length;
  const charactersNoSpaces = Array.from(input.replace(/\s/g, '')).length;

  // Match Unicode letters/numbers words across Latin, Devanagari, Cyrillic, Arabic, etc., falling back to whitespace tokens
  const unicodeWordMatches = input.match(/[\p{L}\p{M}\p{N}]+(?:['’-][\p{L}\p{M}\p{N}]+)*/gu);
  const wordTokens =
    unicodeWordMatches && unicodeWordMatches.length > 0
      ? unicodeWordMatches
      : input
          .trim()
          .split(/\s+/)
          .filter((token) => token.length > 0);
  const words = wordTokens.length;

  const sentenceMatches = input
    .split(/[.!?।！？]+/u)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const sentences = sentenceMatches.length;

  const paragraphMatches = input
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  const paragraphs = paragraphMatches.length;

  const lines = input.split(/\r\n|\r|\n/).length;
  const readingTimeMinutes = words === 0 ? 0 : Math.max(1, Math.ceil(words / 200));

  const frequencies = new Map<string, number>();
  for (const raw of wordTokens) {
    const cleaned = raw.toLowerCase().replace(/^[^\p{L}\p{M}\p{N}]+|[^\p{L}\p{M}\p{N}]+$/gu, '');
    if (Array.from(cleaned).length >= 3 && !STOP_WORDS.has(cleaned)) {
      frequencies.set(cleaned, (frequencies.get(cleaned) ?? 0) + 1);
    }
  }

  const topWords = Array.from(frequencies.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 6)
    .map(([word, count]) => ({ word, count }));

  return {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    lines,
    readingTimeMinutes,
    topWords,
  };
}

export enum CaseFormat {
  UPPERCASE = 'uppercase',
  LOWERCASE = 'lowercase',
  TITLE_CASE = 'title-case',
  SENTENCE_CASE = 'sentence-case',
  CAMEL_CASE = 'camel-case',
  PASCAL_CASE = 'pascal-case',
  SNAKE_CASE = 'snake-case',
  KEBAB_CASE = 'kebab-case',
}

function splitIntoWords(input: string): string[] {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_\-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((w) => w.replace(/[^a-zA-Z0-9]/g, ''))
    .filter(Boolean);
}

export function convertCase(input: string, format: CaseFormat): string {
  if (!input) return '';

  switch (format) {
    case CaseFormat.UPPERCASE:
      return input.toUpperCase();

    case CaseFormat.LOWERCASE:
      return input.toLowerCase();

    case CaseFormat.TITLE_CASE:
      return input
        .toLowerCase()
        .replace(/\b([a-z])/g, (match) => match.toUpperCase());

    case CaseFormat.SENTENCE_CASE:
      return input
        .toLowerCase()
        .replace(/(^\s*[a-z]|[.!?]\s+[a-z])/g, (match) => match.toUpperCase());

    case CaseFormat.CAMEL_CASE: {
      const words = splitIntoWords(input);
      return words
        .map((w, idx) => {
          const lower = w.toLowerCase();
          return idx === 0 ? lower : lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join('');
    }

    case CaseFormat.PASCAL_CASE: {
      const words = splitIntoWords(input);
      return words
        .map((w) => {
          const lower = w.toLowerCase();
          return lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join('');
    }

    case CaseFormat.SNAKE_CASE: {
      const words = splitIntoWords(input);
      return words.map((w) => w.toLowerCase()).join('_');
    }

    case CaseFormat.KEBAB_CASE: {
      const words = splitIntoWords(input);
      return words.map((w) => w.toLowerCase()).join('-');
    }

    default:
      return input;
  }
}

export interface PercentageCalculationResult {
  isValid: boolean;
  value: number | null;
  formatted: string;
  formulaDescription: string;
}

export function calculatePercentOf(percent: number, total: number): PercentageCalculationResult {
  if (!Number.isFinite(percent) || !Number.isFinite(total)) {
    return {
      isValid: false,
      value: null,
      formatted: '—',
      formulaDescription: 'Enter valid numbers in both fields.',
    };
  }
  const value = (percent / 100) * total;
  const rounded = Number(value.toFixed(4));
  return {
    isValid: true,
    value: rounded,
    formatted: rounded.toString(),
    formulaDescription: `(${percent} ÷ 100) × ${total} = ${rounded}`,
  };
}

export function calculateWhatPercent(part: number, whole: number): PercentageCalculationResult {
  if (!Number.isFinite(part) || !Number.isFinite(whole)) {
    return {
      isValid: false,
      value: null,
      formatted: '—',
      formulaDescription: 'Enter valid numbers in both fields.',
    };
  }
  if (whole === 0) {
    return {
      isValid: false,
      value: null,
      formatted: 'Undefined (division by 0)',
      formulaDescription: 'The base value cannot be zero.',
    };
  }
  const value = (part / whole) * 100;
  const rounded = Number(value.toFixed(4));
  return {
    isValid: true,
    value: rounded,
    formatted: `${rounded}%`,
    formulaDescription: `(${part} ÷ ${whole}) × 100 = ${rounded}%`,
  };
}

export function calculatePercentageChange(fromValue: number, toValue: number): PercentageCalculationResult {
  if (!Number.isFinite(fromValue) || !Number.isFinite(toValue)) {
    return {
      isValid: false,
      value: null,
      formatted: '—',
      formulaDescription: 'Enter valid starting and ending numbers.',
    };
  }
  if (fromValue === 0) {
    return {
      isValid: false,
      value: null,
      formatted: 'Undefined (starting value is 0)',
      formulaDescription: 'Starting value cannot be zero when computing percentage change.',
    };
  }
  const diff = toValue - fromValue;
  const value = (diff / Math.abs(fromValue)) * 100;
  const rounded = Number(value.toFixed(4));
  const direction = rounded > 0 ? 'increase' : rounded < 0 ? 'decrease' : 'no change';
  const sign = rounded > 0 ? '+' : '';
  return {
    isValid: true,
    value: rounded,
    formatted: `${sign}${rounded}% (${direction})`,
    formulaDescription: `((${toValue} − ${fromValue}) ÷ |${fromValue}|) × 100 = ${sign}${rounded}%`,
  };
}

export interface JsonFormatResult {
  isValid: boolean;
  output: string;
  error: string | null;
  stats: {
    keysCount: number;
    sizeBytes: number;
    type: string;
  } | null;
}

function sortJsonKeysRecursively(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortJsonKeysRecursively);
  }
  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
      a.localeCompare(b)
    );
    const sortedObj: Record<string, unknown> = {};
    for (const [k, v] of entries) {
      sortedObj[k] = sortJsonKeysRecursively(v);
    }
    return sortedObj;
  }
  return value;
}

function countKeysRecursively(value: unknown): number {
  if (Array.isArray(value)) {
    return value.reduce((sum, item) => sum + countKeysRecursively(item), 0);
  }
  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    return (
      entries.length +
      entries.reduce((sum, [, child]) => sum + countKeysRecursively(child), 0)
    );
  }
  return 0;
}

export function formatAndValidateJson(
  rawInput: string,
  options?: { indent?: number; minify?: boolean; sortKeys?: boolean }
): JsonFormatResult {
  if (!rawInput || rawInput.trim().length === 0) {
    return {
      isValid: false,
      output: '',
      error: 'Enter or paste a JSON payload to validate and format.',
      stats: null,
    };
  }

  try {
    const parsed = JSON.parse(rawInput);
    const transformed = options?.sortKeys ? sortJsonKeysRecursively(parsed) : parsed;
    const indent = options?.minify ? 0 : (options?.indent ?? 2);
    const output = options?.minify
      ? JSON.stringify(transformed)
      : JSON.stringify(transformed, null, indent);

    const rootType = Array.isArray(parsed)
      ? `Array (${parsed.length} items)`
      : parsed === null
      ? 'null'
      : typeof parsed;

    return {
      isValid: true,
      output,
      error: null,
      stats: {
        keysCount: countKeysRecursively(parsed),
        sizeBytes: new TextEncoder().encode(output).length,
        type: rootType,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid JSON syntax.';
    return {
      isValid: false,
      output: '',
      error: message,
      stats: null,
    };
  }
}
