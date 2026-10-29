import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TOOL_REGISTRY,
  CATEGORY_REGISTRY,
  ToolCategoryId,
  ToolAvailability,
  searchTools,
  getToolById,
  getCategoryById,
  getToolsByCategory,
  getCatalogSummary,
} from './toolRegistry';
import {
  analyzeText,
  convertCase,
  CaseFormat,
  calculatePercentOf,
  calculateWhatPercent,
  calculatePercentageChange,
  formatAndValidateJson,
} from './toolCalculations';
import { resolveInitialTheme } from './theme';

test('tool registry contains all 9 initial catalog tools across 6 categories', () => {
  assert.equal(CATEGORY_REGISTRY.length, 6);
  assert.equal(TOOL_REGISTRY.length, 9);

  const summary = getCatalogSummary();
  assert.equal(summary.totalTools, 9);
  assert.equal(summary.availableTools, 4);
  assert.equal(summary.plannedTools, 5);
});

test('category lookup and category tool filtering work accurately', () => {
  const imageCat = getCategoryById('image');
  assert.ok(imageCat);
  assert.equal(imageCat.route, '/category/image');

  const imageTools = getToolsByCategory(ToolCategoryId.IMAGE);
  assert.equal(imageTools.length, 2);
  assert.deepEqual(
    imageTools.map((t) => t.id),
    ['image-compressor', 'image-resizer']
  );

  const unknownCat = getCategoryById('non-existent');
  assert.equal(unknownCat, undefined);
});

test('searchTools searches across tool names, descriptions, categories, and keywords', () => {
  const qrMatches = searchTools('qr');
  assert.equal(qrMatches.length, 1);
  assert.equal(qrMatches[0].id, 'qr-code-generator');

  const textMatches = searchTools('case');
  assert.equal(textMatches.length, 1);
  assert.equal(textMatches[0].id, 'case-converter');

  const availableOnly = searchTools('', { availability: ToolAvailability.AVAILABLE });
  assert.equal(availableOnly.length, 4);

  const noMatches = searchTools('xyznonexistent123');
  assert.equal(noMatches.length, 0);
});

test('getToolById retrieves exact tool definition', () => {
  const jsonTool = getToolById('json-formatter');
  assert.ok(jsonTool);
  assert.equal(jsonTool.name, 'JSON Formatter');
  assert.equal(jsonTool.availability, ToolAvailability.AVAILABLE);
});

test('resolveInitialTheme honors saved preference and falls back to system theme', () => {
  assert.equal(resolveInitialTheme('dark', false), 'dark');
  assert.equal(resolveInitialTheme('light', true), 'light');
  assert.equal(resolveInitialTheme(null, true), 'dark');
  assert.equal(resolveInitialTheme(null, false), 'light');
  assert.equal(resolveInitialTheme('invalid', true), 'dark');
});

test('analyzeText calculates word, character, sentence, and paragraph counts accurately', () => {
  const emptyStats = analyzeText('   ');
  assert.equal(emptyStats.words, 0);
  assert.equal(emptyStats.sentences, 0);

  const sample = 'NxK Tools is fast. It processes text locally!\n\nSecond paragraph here.';
  const stats = analyzeText(sample);
  assert.equal(stats.words, 11);
  assert.equal(stats.sentences, 3);
  assert.equal(stats.paragraphs, 2);
  assert.ok(stats.characters > stats.charactersNoSpaces);
});

test('convertCase transforms strings across all supported case styles', () => {
  const raw = 'hello world example';
  assert.equal(convertCase(raw, CaseFormat.UPPERCASE), 'HELLO WORLD EXAMPLE');
  assert.equal(convertCase('HELLO WORLD', CaseFormat.LOWERCASE), 'hello world');
  assert.equal(convertCase(raw, CaseFormat.TITLE_CASE), 'Hello World Example');
  assert.equal(convertCase(raw, CaseFormat.CAMEL_CASE), 'helloWorldExample');
  assert.equal(convertCase(raw, CaseFormat.PASCAL_CASE), 'HelloWorldExample');
  assert.equal(convertCase(raw, CaseFormat.SNAKE_CASE), 'hello_world_example');
  assert.equal(convertCase(raw, CaseFormat.KEBAB_CASE), 'hello-world-example');
});

test('percentage calculator functions compute accurate results and handle zero safely', () => {
  const pctOf = calculatePercentOf(25, 240);
  assert.equal(pctOf.isValid, true);
  assert.equal(pctOf.value, 60);

  const whatPct = calculateWhatPercent(45, 180);
  assert.equal(whatPct.isValid, true);
  assert.equal(whatPct.value, 25);

  const divByZero = calculateWhatPercent(10, 0);
  assert.equal(divByZero.isValid, false);

  const pctChange = calculatePercentageChange(80, 100);
  assert.equal(pctChange.isValid, true);
  assert.equal(pctChange.value, 25);
});

test('formatAndValidateJson formats valid JSON, sorts keys, and catches syntax errors', () => {
  const validResult = formatAndValidateJson('{"z":1,"a":{"d":4,"c":3}}', {
    indent: 2,
    sortKeys: true,
  });
  assert.equal(validResult.isValid, true);
  assert.equal(validResult.error, null);
  assert.ok(validResult.output.indexOf('"a"') < validResult.output.indexOf('"z"'));
  assert.equal(validResult.stats?.keysCount, 4);

  const invalidResult = formatAndValidateJson('{invalid json');
  assert.equal(invalidResult.isValid, false);
  assert.ok(invalidResult.error);
});
