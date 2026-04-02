/**
 * Reads words.txt (one word per line, non-normalized) and writes words.json:
 * { [normalized + whitespace-stripped]: original line }
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const inputPath = join(root, 'words.txt');
const outputPath = join(root, 'words.json');

function normalize(s) {
  return s
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ك/g, 'ک')
    .replace(/[يئ]/g, 'ی')
    .replace(/ؤ/g, 'و')
    .replace(/ۀ|ة/g, 'ه')
    .replace(/[ًٌٍَُِّْ]/g, '')
    .replace(/‌/g, '');
}

function normKey(line) {
  return normalize(line).replace(/\s/g, '');
}

const text = readFileSync(inputPath, 'utf8');
const lines = text.split(/\n/);
const map = Object.create(null);
let skipped = 0;
let duplicateKeys = 0;

for (const line of lines) {
  const raw = line.replace(/\r$/, '').trim();
  if (!raw) continue;
  const key = normKey(raw);
  if (!key) {
    skipped += 1;
    continue;
  }
  if (key in map) {
    duplicateKeys += 1;
    continue;
  }
  map[key] = raw;
}

writeFileSync(outputPath, JSON.stringify(map), 'utf8');
console.log(
  `words.json: ${Object.keys(map).length} entries (skipped empty-key: ${skipped}, duplicate keys: ${duplicateKeys})`
);
