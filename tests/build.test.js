/**
 * Testy weryfikujące poprawność buildu strony
 * Uruchom: npm test
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const SITE_DIR = path.join(__dirname, '..', '_site');
const SRC_DIR = path.join(__dirname, '..', 'src');

// Kolory do wyświetlania w konsoli
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`${colors.green}✓${colors.reset} ${name}`);
    passed++;
  } catch (err) {
    console.log(`${colors.red}✗${colors.reset} ${name}`);
    console.log(`  ${colors.red}${err.message}${colors.reset}`);
    failed++;
  }
}

function fileExists(filePath) {
  return fs.existsSync(path.join(SITE_DIR, filePath));
}

function readFile(filePath) {
  return fs.readFileSync(path.join(SITE_DIR, filePath), 'utf-8');
}

console.log('\n🧪 Uruchamianie testów buildu...\n');

// ============== TESTY ==============

// 1. Testy krytycznych plików
console.log('📁 Krytyczne pliki:');

test('index.html istnieje', () => {
  assert.ok(fileExists('index.html'), 'Plik index.html nie istnieje');
});

test('robots.txt istnieje', () => {
  assert.ok(fileExists('robots.txt'), 'Plik robots.txt nie istnieje');
});

test('sitemap.xml istnieje', () => {
  assert.ok(fileExists('sitemap.xml'), 'Plik sitemap.xml nie istnieje');
});

test('llms.txt istnieje', () => {
  assert.ok(fileExists('llms.txt'), 'Plik llms.txt nie istnieje');
});

test('feed.xml istnieje', () => {
  assert.ok(fileExists('feed.xml'), 'Plik feed.xml nie istnieje');
});

test('manifest.json istnieje', () => {
  assert.ok(fileExists('manifest.json'), 'Plik manifest.json nie istnieje');
});

// 2. Testy CSS i fontów
console.log('\n🎨 Style i czcionki:');

test('main.css istnieje', () => {
  assert.ok(fileExists('assets/css/main.css'), 'Plik main.css nie istnieje');
});

test('fonts.css jest inline w HTML (nie osobny plik)', () => {
  const content = readFile('index.html');
  assert.ok(!content.includes('href="/assets/css/fonts.css"'), 
    'fonts.css powinien być inline, nie osobnym plikiem');
  assert.ok(content.includes('@font-face'), 
    'Brak definicji @font-face inline w HTML');
});

test('Czcionki lokalne istnieją (400)', () => {
  assert.ok(fileExists('assets/fonts/inter-latin-400-normal.woff2'), 'Brak czcionki 400');
});

test('Czcionki lokalne istnieją (500)', () => {
  assert.ok(fileExists('assets/fonts/inter-latin-500-normal.woff2'), 'Brak czcionki 500');
});

test('Czcionki lokalne istnieją (600)', () => {
  assert.ok(fileExists('assets/fonts/inter-latin-600-normal.woff2'), 'Brak czcionki 600');
});

test('Czcionki lokalne istnieją (700)', () => {
  assert.ok(fileExists('assets/fonts/inter-latin-700-normal.woff2'), 'Brak czcionki 700');
});

// 3. Testy JavaScript
console.log('\n📜 JavaScript:');

test('main.js istnieje', () => {
  assert.ok(fileExists('assets/js/main.js'), 'Plik main.js nie istnieje');
});

test('search.js istnieje', () => {
  assert.ok(fileExists('assets/js/search.js'), 'Plik search.js nie istnieje');
});

test('search-index.js istnieje', () => {
  assert.ok(fileExists('assets/js/search-index.js'), 'Plik search-index.js nie istnieje');
});

test('sw.js istnieje', () => {
  assert.ok(fileExists('assets/js/sw.js'), 'Plik sw.js nie istnieje');
});

// 4. Testy stron
console.log('\n📄 Strony:');

test('Strona /blog/ istnieje', () => {
  assert.ok(fileExists('blog/index.html'), 'Strona blog nie istnieje');
});

test('Strona /o-mnie/ istnieje', () => {
  assert.ok(fileExists('o-mnie/index.html'), 'Strona o-mnie nie istnieje');
});

test('Strona /search/ istnieje', () => {
  assert.ok(fileExists('search/index.html'), 'Strona search nie istnieje');
});

test('Strona /archiwum/ istnieje', () => {
  assert.ok(fileExists('archiwum/index.html'), 'Strona archiwum nie istnieje');
});

// 5. Testy treści
console.log('\n📝 Wpisy blogowe:');

test('Wpisy w /posts/ istnieją', () => {
  const postsDir = path.join(SITE_DIR, 'posts');
  assert.ok(fs.existsSync(postsDir), 'Katalog posts nie istnieje');
  const posts = fs.readdirSync(postsDir).filter(f => 
    fs.statSync(path.join(postsDir, f)).isDirectory()
  );
  assert.ok(posts.length > 0, `Brak wpisów w katalogu posts (znaleziono: ${posts.length})`);
});

// 6. Testy zawartości plików
console.log('\n🔍 Zawartość plików:');

test('robots.txt ma poprawną strukturę', () => {
  const content = readFile('robots.txt');
  assert.ok(content.includes('User-agent:'), 'Brak User-agent w robots.txt');
  assert.ok(content.includes('Sitemap:'), 'Brak Sitemap w robots.txt');
});

test('llms.txt ma poprawną strukturę', () => {
  const content = readFile('llms.txt');
  assert.ok(content.startsWith('# koryto.net'), 'llms.txt nie zaczyna się od H1');
  assert.ok(content.includes('>'), 'llms.txt nie zawiera blockquote');
  assert.ok(content.includes('##'), 'llms.txt nie zawiera sekcji H2');
});

test('index.html używa lokalnych czcionek (inline)', () => {
  const content = readFile('index.html');
  assert.ok(content.includes('@font-face'), 'Brak inline @font-face');
  assert.ok(content.includes('/assets/fonts/inter-latin'), 'Brak preload lokalnych czcionek');
  assert.ok(!content.includes('fonts.googleapis.com'), 'Nadal używa Google Fonts');
});

test('index.html nie ma łańcucha zależności z Google Fonts', () => {
  const content = readFile('index.html');
  assert.ok(!content.includes('fonts.gstatic.com'), 'Nadal używa fonts.gstatic.com');
});

test('CSS zawiera poprawione kolory kontrastu', () => {
  const content = readFile('assets/css/main.css');
  // Sprawdź czy używamy poprawionych kolorów
  const hasCorrectDark = content.includes('--color-text-muted: #a8b0bc') || 
                         content.includes('--color-text-muted:#a8b0bc');
  const hasCorrectLight = content.includes('--color-text-muted: #495057') ||
                          content.includes('--color-text-muted:#495057');
  assert.ok(hasCorrectDark && hasCorrectLight, 
    'CSS nie zawiera poprawionych kolorów kontrastu');
});

test('feed.xml jest poprawnym XML', () => {
  const content = readFile('feed.xml');
  assert.ok(content.includes('<?xml'), 'Brak deklaracji XML');
  assert.ok(content.includes('<feed'), 'Brak root elementu feed');
  assert.ok(content.includes('<entry>'), 'Brak wpisów w feed');
});

test('sitemap.xml jest poprawnym XML', () => {
  const content = readFile('sitemap.xml');
  assert.ok(content.includes('<?xml'), 'Brak deklaracji XML');
  assert.ok(content.includes('<urlset'), 'Brak root elementu urlset');
  assert.ok(content.includes('<url>'), 'Brak URLi w sitemap');
});

// 7. Testy struktury HTML
console.log('\n🏗️ Struktura HTML:');

test('index.html ma podstawowe elementy', () => {
  const content = readFile('index.html');
  assert.ok(content.includes('<!DOCTYPE html>'), 'Brak DOCTYPE');
  assert.ok(content.includes('<html lang="pl">'), 'Brak lang="pl"');
  assert.ok(content.includes('<meta charset="UTF-8">'), 'Brak charset UTF-8');
  assert.ok(content.includes('<meta name="viewport"'), 'Brak viewport');
  assert.ok(content.includes('<main'), 'Brak elementu main');
  assert.ok(content.includes('id="main-content"'), 'Brak id main-content');
});

test('index.html zawiera meta tagi SEO', () => {
  const content = readFile('index.html');
  assert.ok(content.includes('<meta name="description"'), 'Brak meta description');
  assert.ok(content.includes('<meta name="author"'), 'Brak meta author');
  assert.ok(content.includes('<link rel="canonical"'), 'Brak canonical');
});

test('Strony mają theme-color', () => {
  const content = readFile('index.html');
  assert.ok(content.includes('name="theme-color"'), 'Brak theme-color');
});

// ============== PODSUMOWANIE ==============

console.log('\n' + '='.repeat(50));
console.log(`Testy zakończone: ${colors.green}${passed} passed${colors.reset}, ${failed > 0 ? colors.red : ''}${failed} failed${colors.reset}`);
console.log('='.repeat(50) + '\n');

process.exit(failed > 0 ? 1 : 0);
