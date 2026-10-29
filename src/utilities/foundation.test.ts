import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TOOL_REGISTRY,
  PLANNED_TOOL_REGISTRY,
  CATEGORY_REGISTRY,
  ToolCategoryId,
  ToolAvailability,
  searchTools,
  getToolById,
  getCategoryById,
  getToolsByCategory,
  getPlannedToolsByCategory,
  getCatalogSummary,
} from './toolRegistry';
import {
  DEVELOPER_CONFIG,
  buildWhatsAppMessageUrl,
} from './developerConfig';
import {
  analyzeText,
  convertCase,
  CaseFormat,
  calculatePercentOf,
  calculateWhatPercent,
  calculatePercentageChange,
  formatAndValidateJson,
} from './toolCalculations';
import {
  formatFileSize,
  calculateCompressionSavings,
  validateImageFileMetadata,
  validatePdfFileMetadata,
  calculateAspectLockedDimensions,
  calculatePercentageDimensions,
  generateQrCodeDataUrl,
  createSamplePdfBytes,
  inspectPdfPageCount,
  mergePdfDocuments,
} from './mediaAndDocumentUtils';
import { resolveInitialTheme } from './theme';

test('tool registry contains all 9 active catalog tools across 6 categories and keeps planned PDF backlog internal', () => {
  assert.equal(CATEGORY_REGISTRY.length, 6);
  assert.equal(TOOL_REGISTRY.length, 9);
  assert.equal(PLANNED_TOOL_REGISTRY.length, 2);

  for (const cat of CATEGORY_REGISTRY) {
    assert.ok(cat.shortName.length > 0);
  }
  for (const tool of TOOL_REGISTRY) {
    assert.equal(tool.instructions.length, 3);
    assert.equal(tool.availability, ToolAvailability.AVAILABLE);
  }
  for (const planned of PLANNED_TOOL_REGISTRY) {
    assert.equal(planned.availability, ToolAvailability.PLANNED);
  }

  const summary = getCatalogSummary();
  assert.equal(summary.totalTools, 9);
  assert.equal(summary.availableTools, 9);
  assert.equal(summary.plannedTools, 2);

  const plannedPdf = getPlannedToolsByCategory(ToolCategoryId.PDF);
  assert.equal(plannedPdf.length, 2);
});

test('centralized DEVELOPER_CONFIG matches exact supplied identity and contact URLs', () => {
  assert.equal(DEVELOPER_CONFIG.productBrand, 'NxK Tools');
  assert.equal(DEVELOPER_CONFIG.tagline, 'Powerful Tools. Zero Hassle.');
  assert.equal(DEVELOPER_CONFIG.developerBrand, 'NxK Developer');
  assert.equal(DEVELOPER_CONFIG.founder, 'Nishant Singh');
  assert.equal(
    DEVELOPER_CONFIG.instagram.developer.url,
    'https://www.instagram.com/nxk-developer/'
  );
  assert.equal(
    DEVELOPER_CONFIG.instagram.personal.url,
    'https://www.instagram.com/_its.nishant/'
  );
  assert.equal(DEVELOPER_CONFIG.whatsapp.url, 'https://wa.me/917050809305');
  assert.ok(
    buildWhatsAppMessageUrl({
      name: 'Alex',
      topic: 'Feedback',
      message: 'Hello NxK',
    }).startsWith('https://wa.me/917050809305?text=')
  );
});

test('category lookup and category tool filtering work accurately', () => {
  const imageCat = getCategoryById('image');
  assert.ok(imageCat);
  assert.equal(imageCat.route, '/category/image');
  assert.equal(imageCat.shortDescription, 'Tools for working with your images.');

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
  assert.equal(availableOnly.length, 9);

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

test('analyzeText calculates word, character, sentence, and paragraph counts accurately including Unicode', () => {
  const emptyStats = analyzeText('   ');
  assert.equal(emptyStats.words, 0);
  assert.equal(emptyStats.sentences, 0);

  const sample = 'NxK Tools is fast. It processes text locally!\n\nSecond paragraph here.';
  const stats = analyzeText(sample);
  assert.equal(stats.words, 11);
  assert.equal(stats.sentences, 3);
  assert.equal(stats.paragraphs, 2);
  assert.ok(stats.characters > stats.charactersNoSpaces);

  const unicodeStats = analyzeText('नमस्ते दुनिया। Café résumé!');
  assert.equal(unicodeStats.words, 4);
  assert.equal(unicodeStats.sentences, 2);
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

test('formatFileSize and calculateCompressionSavings compute byte savings accurately', () => {
  assert.equal(formatFileSize(512), '512 B');
  assert.equal(formatFileSize(2048), '2.00 KB');
  assert.equal(formatFileSize(2 * 1024 * 1024), '2.00 MB');

  const savings = calculateCompressionSavings(100000, 40000);
  assert.equal(savings.isSmaller, true);
  assert.equal(savings.deltaBytes, 60000);
  assert.equal(savings.percentChange, 60);
});

test('validateImageFileMetadata and validatePdfFileMetadata reject invalid files', () => {
  assert.equal(
    validateImageFileMetadata({ name: 'photo.jpg', type: 'image/jpeg', size: 12000 }).isValid,
    true
  );
  assert.equal(
    validateImageFileMetadata({ name: 'script.exe', type: 'application/x-msdownload', size: 1200 }).isValid,
    false
  );
  assert.equal(
    validateImageFileMetadata({ name: 'empty.png', type: 'image/png', size: 0 }).isValid,
    false
  );

  assert.equal(
    validatePdfFileMetadata({ name: 'doc.pdf', type: 'application/pdf', size: 5400 }).isValid,
    true
  );
  assert.equal(
    validatePdfFileMetadata({ name: 'notes.txt', type: 'text/plain', size: 540 }).isValid,
    false
  );
});

test('calculateAspectLockedDimensions and calculatePercentageDimensions preserve aspect ratio', () => {
  const lockedByWidth = calculateAspectLockedDimensions(1600, 1000, 'width', 800);
  assert.deepEqual(lockedByWidth, { width: 800, height: 500 });

  const lockedByHeight = calculateAspectLockedDimensions(1600, 1000, 'height', 250);
  assert.deepEqual(lockedByHeight, { width: 400, height: 250 });

  const scaled50 = calculatePercentageDimensions(1600, 1000, 50);
  assert.deepEqual(scaled50, { width: 800, height: 500 });
});

test('generateQrCodeDataUrl produces valid PNG data URL and rejects empty input', async () => {
  const emptyRes = await generateQrCodeDataUrl({ text: '   ' });
  assert.equal(emptyRes.isValid, false);
  assert.equal(emptyRes.dataUrl, null);

  const validRes = await generateQrCodeDataUrl({
    text: 'https://nxktools.example',
    width: 256,
    errorCorrectionLevel: 'M',
  });
  assert.equal(validRes.isValid, true);
  assert.ok(validRes.dataUrl?.startsWith('data:image/png;base64,'));
});

test('createSamplePdfBytes and mergePdfDocuments create and merge valid multi-page PDFs', async () => {
  const pdfA = await createSamplePdfBytes('Doc A', 'Page 1');
  const pdfB = await createSamplePdfBytes('Doc B', 'Page 2');

  const countA = await inspectPdfPageCount(pdfA);
  const countB = await inspectPdfPageCount(pdfB);
  assert.equal(countA, 1);
  assert.equal(countB, 1);

  const merged = await mergePdfDocuments([pdfA, pdfB]);
  assert.equal(merged.totalPages, 2);
  assert.deepEqual(merged.pageCounts, [1, 1]);
  assert.ok(merged.pdfBytes.byteLength > pdfA.byteLength);
});
