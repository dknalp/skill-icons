import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, '../../icons');
const outDir = join(__dirname, '../lib');
const outFile = join(outDir, 'icons.json');

const files = readdirSync(iconsDir);
const icons = {};
for (const file of files) {
  if (!file.endsWith('.svg')) continue;
  const name = file.replace('.svg', '').toLowerCase();
  icons[name] = readFileSync(join(iconsDir, file), 'utf8');
}

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, JSON.stringify(icons));
console.log(`✓ Built ${Object.keys(icons).length} icons → lib/icons.json`);
