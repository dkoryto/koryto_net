---
title: Architektura i implementacja bloga na Eleventy — od koncepcji do deploymentu
description: Kompletny przewodnik techniczny budowy nowoczesnego bloga z użyciem Eleventy. Architektura projektu, konfiguracja środowiska, lokalny development i zdalny deployment na GitHub Pages.
date: 2026-03-28
tags:
  - 11ty
  - tutorial
  - architektura
---

Ten artykuł dokumentuje kompletny proces budowy bloga opartego na **Eleventy (11ty)** — od decyzji architektonicznych, przez konfigurację środowiska developerskiego, aż po automatyzację deploymentu. Nie jest to tutorial krok-po-kroku, lecz techniczna dokumentacja decyzji projektowych z gotowymi do użycia fragmentami kodu.

## Dlaczego Eleventy?

Przed wyborem technologii przeanalizowałem dostępne opcje w kategoriach kluczowych dla projektu długoterminowego:

| Kryterium | WordPress | Gatsby/Next.js | Eleventy |
|-----------|-----------|----------------|----------|
| **Złożoność** | Wysoka (PHP + baza) | Średnia (React + GraphQL) | Minimalna |
| **Wydajność** | Wymaga optymalizacji | Dobra (ale JS hydration) | Optymalna (czysty HTML) |
| **Bezpieczeństwo** | Wymaga aktualizacji | Zależy od konfiguracji | Maksymalne (statyczne pliki) |
| **Koszty hostingu** | Wymagany serwer PHP | CDN (darmowy) | CDN (darmowy) |
| **Kontrola nad HTML** | Ograniczona | Średnia (abstrakcja React) | Całkowita |
| **Czas buildu** | N/A | 30-120s (duże projekty) | < 5s |

Eleventy wygrał ze względu na **zero-abstrakcyjność** — dostaję dokładnie ten HTML, który napiszę, bez narzutu frameworka. To fundamentalne dla:
- Optymalizacji SEO (pełna kontrola nad strukturą)
- Czasu ładowania (brak JavaScriptu do hydracji)
- Długowieczności projektu (niezależność od trendów frontendowych)

## Architektura projektu

Zastosowałem podejście **folder-per-feature** z separacją odpowiedzialności:

```
project-root/
├── src/                          # Źródła (input dla 11ty)
│   ├── _data/                    # Globalny stan aplikacji
│   │   └── site.json             # Konfiguracja domeny, autora, SEO
│   ├── _includes/                # Komponenty wielokrotnego użytku
│   │   ├── layouts/              # Layouty stron
│   │   │   ├── base.njk          # Layout główny z pełnym SEO
│   │   │   └── post.njk          # Layout artykułu
│   │   └── partials/             # Częściowe szablony
│   │       ├── header.njk
│   │       ├── footer.njk
│   │       └── breadcrumbs.njk
│   ├── assets/                   # Zasoby statyczne (kopiowane 1:1)
│   │   ├── css/
│   │   ├── js/
│   │   └── images/
│   ├── posts/                    # Treść artykułów
│   │   └── [slug]/               # Folder na wpis + jego zasoby
│   │       ├── index.md
│   │       └── images/
│   ├── index.njk                 # Strona główna
│   ├── blog.njk                  # Archiwum wpisów
│   ├── o-mnie.md                 # Strona statyczna
│   └── 404.md                    # Strona błędu
├── _site/                        # Output (generowany, gitignored)
├── .github/
│   └── workflows/
│       └── deploy.yml            # CI/CD pipeline
├── eleventy.config.js            # Konfiguracja builda
├── package.json
└── .gitignore
```

### Dlaczego taka struktura?

**`_data/site.json`** — centralna konfiguracja eliminująca magiczne stringi z szablonów. Zmiana domeny wymaga edycji jednego pliku.

**`_includes/layouts/` vs `_includes/partials/`** — rozdzielenie layoutów (pełne strony) od partials (komponenty). Layouty używają dziedziczenia, partials są includowane.

**`posts/[slug]/index.md`** — każdy wpis w osobnym folderze umożliwia:
- Kolokację treści i zasobów (obrazy obok markdown)
- Przenoszenie wpisów jako atomowych jednostek
- Łatwe zarządzanie permalinkami (`/posts/nazwa/` zamiast `/posts/nazwa.html`)

## Konfiguracja środowiska lokalnego

### Wymagania systemowe

- **Node.js** w wersji LTS (obecnie 20.x) — sprawdź `node --version`
- **npm** lub **yarn** — do zarządzania zależnościami
- **Git** — do kontroli wersji
- **Edytor kodu** z obsługą Nunjucks (VS Code + rozszerzenie "Nunjucks Template")

### Inicjalizacja projektu

```bash
# 1. Utworzenie katalogu projektu
mkdir moj-blog && cd moj-blog

# 2. Inicjalizacja repozytorium git
git init

# 3. Inicjalizacja projektu Node.js
npm init -y

# 4. Instalacja Eleventy
npm install @11ty/eleventy --save-dev

# 5. Instalacja dodatkowych zależności (opcjonalne)
npm install html-minifier --save-dev  # Minifikacja w produkcji
npm install luxon --save-dev          # Zaawansowana obsługa dat
```

### Konfiguracja 11ty (`eleventy.config.js`)

Plik konfiguracyjny definiuje transformacje, kolekcje i filtry:

```javascript
const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  // ═══════════════════════════════════════════════════
  // PASSTHROUGH COPY — pliki kopiowane bez zmian
  // ═══════════════════════════════════════════════════
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");

  // ═══════════════════════════════════════════════════
  // KOLEKCJE — grupowanie treści
  // ═══════════════════════════════════════════════════
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/posts/**/*.md")
      .sort((a, b) => b.date - a.date); // Sortowanie od najnowszych
  });

  // ═══════════════════════════════════════════════════
  // FILTRY — przetwarzanie danych w szablonach
  // ═══════════════════════════════════════════════════
  
  // Formatowanie daty dla czytelnika (np. "28 marca 2026")
  eleventyConfig.addFilter("dateDisplay", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' })
      .setLocale('pl')
      .toFormat('d MMMM yyyy');
  });

  // Formatowanie ISO dla meta tagów i JSON-LD
  eleventyConfig.addFilter("isoDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toISO();
  });

  // Szacowanie czasu czytania (200 słów/min)
  eleventyConfig.addFilter("readingTime", (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  });

  // Skracanie tekstu dla meta description
  eleventyConfig.addFilter("truncate", (text, length = 160) => {
    if (!text || text.length <= length) return text;
    return text.substring(0, length).replace(/\s+\S*$/, '') + '...';
  });

  // ═══════════════════════════════════════════════════
  // TRANSFORMACJE — modyfikacja wygenerowanego HTML
  // ═══════════════════════════════════════════════════
  
  // Lazy loading dla obrazków
  eleventyConfig.addTransform("lazyImages", function(content, outputPath) {
    if (!outputPath || !outputPath.endsWith(".html")) return content;
    return content.replace(
      /<img(?![^>]*loading=)([^>]*)>/gi,
      '<img$1 loading="lazy" decoding="async">'
    );
  });

  // Minifikacja HTML w produkcji
  if (process.env.NODE_ENV === 'production') {
    const htmlmin = require("html-minifier");
    eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
      if (!outputPath || !outputPath.endsWith(".html")) return content;
      return htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      });
    });
  }

  // ═══════════════════════════════════════════════════
  // KONFIGURACJA KATALOGÓW
  // ═══════════════════════════════════════════════════
  return {
    dir: {
      input: "src",           // Katalog źródłowy
      output: "_site",        // Katalog wyjściowy (gitignored)
      includes: "_includes",  // Ścieżka względem input
      data: "_data"           // Ścieżka względem input
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",  // Nunjucks w Markdown
    pathPrefix: "/"  // Dla GitHub Pages: "/nazwa-repo/"
  };
};
```

### Skrypty w `package.json`

```json
{
  "name": "moj-blog",
  "version": "1.0.0",
  "scripts": {
    "start": "eleventy --serve --watch",
    "build": "eleventy",
    "build:prod": "NODE_ENV=production eleventy",
    "clean": "rm -rf _site"
  },
  "devDependencies": {
    "@11ty/eleventy": "^3.0.0",
    "html-minifier": "^4.5.0",
    "luxon": "^3.4.0"
  }
}
```

## Lokalny development

### Uruchomienie serwera deweloperskiego

```bash
# Development z hot-reload
npm start

# Lub bezpośrednio
npx eleventy --serve --watch
```

Serwer deweloperski dostępny pod `http://localhost:8080`. Flagi:
- `--serve` — uruchamia lokalny serwer HTTP
- `--watch` — obserwuje zmiany w plikach i przebudowuje automatycznie

### Workflow podczas pisania artykułu

```bash
# 1. Utwórz folder dla nowego wpisu
mkdir -p src/posts/moj-nowy-wpis

# 2. Utwórz plik z frontmatter
cat > src/posts/moj-nowy-wpis/index.md << 'EOF'
---
title: Tytuł artykułu
description: Krótki opis dla SEO
date: 2026-03-28
tags:
  - 11ty
  - tutorial
---

Treść artykułu w Markdown...
EOF

# 3. Serwer automatycznie przebuduje i odświeży stronę
```

### Debugowanie i inspekcja

Sprawdź wygenerowany kod w katalogu `_site/`:
- `_site/index.html` — strona główna
- `_site/posts/nazwa-wpisu/index.html` — pojedynczy artykuł
- `_site/sitemap.xml` — mapa witryny

## System szablonów Nunjucks

### Layout bazowy (`base.njk`)

Layout to szablon, który otacza treść. Używa dziedziczenia (dziecko rozszerza rodzica):

{% raw %}
```html
<!DOCTYPE html>
<html lang="pl" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  {# Zmienne SEO z hierarchią: frontmatter > site.json > defaults #}
  {% set pageTitle = title | default(site.title) %}
  {% set pageDesc = description | default(site.description) | truncate(160) %}
  
  <title>{% if title %}{{ title }} | {% endif %}{{ site.title }}</title>
  <meta name="description" content="{{ pageDesc }}">
  
  {# Preconnect dla wydajności #}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="dns-prefetch" href="https://fonts.gstatic.com">
  
  {# Style #}
  <link rel="stylesheet" href="{{ '/assets/css/main.css' | url }}">
</head>
<body>
  {% include "partials/header.njk" %}
  
  <main id="main-content">
    {{ content | safe }}
  </main>
  
  {% include "partials/footer.njk" %}
</body>
</html>
```
{% endraw %}

### Layout artykułu (`post.njk`)

Rozszerza layout bazowy i dodaje specyficzne dla artykułu elementy:

{% raw %}
```html
---
layout: layouts/base.njk
---

<article class="post">
  <header class="post-header">
    <div class="container">
      <div class="post-meta">
        <time datetime="{{ date | isoDate }}">
          {{ date | dateDisplay }}
        </time>
        <span class="reading-time">
          {{ content | readingTime }} min czytania
        </span>
      </div>
      <h1 class="post-title">{{ title }}</h1>
      {% if description %}
      <p class="post-description">{{ description }}</p>
      {% endif %}
    </div>
  </header>
  
  <div class="post-content">
    <div class="container">
      {{ content | safe }}
    </div>
  </div>
</article>
```
{% endraw %}

### Składnia Nunjucks — kluczowe elementy

{% raw %}
```html
{# Komentarz (nie pojawia się w HTML) #}

{# Wydruk zmiennej #}
{{ zmienna }}

{# Filtry (przetwarzanie potokowe) #}
{{ tekst | truncate(100) | upper }}

{# Logika warunkowa #}
{% if warunek %}
  <p>Prawda</p>
{% elif inny_warunek %}
  <p>Alternatywa</p>
{% else %}
  <p>Fałsz</p>
{% endif %}

{# Pętla #}
{% for post in collections.posts %}
  <article>
    <h2><a href="{{ post.url }}">{{ post.data.title }}</a></h2>
  </article>
{% endfor %}

{# Include (wstawianie partiali) #}
{% include "partials/header.njk" %}

{# Rozszerzanie layoutu #}
{% extends "layouts/base.njk" %}
{% block content %}
  <p>Treść bloku</p>
{% endblock %}
```
{% endraw %}

## Zdalny deployment na GitHub Pages

### Strategia CI/CD

Zastosowałem podejście **GitOps** — repozytorium jest jedynym źródłem prawdy, a deployment jest efektem ubocznym pusha:

```
Local: git push origin main
              ↓
GitHub: trigger workflow (on: push)
              ↓
Actions: checkout → setup-node → npm ci → npm run build
              ↓
Deploy: artifact ./_site → deploy to gh-pages branch
              ↓
GitHub Pages: serve static files via CDN
```

### Konfiguracja repozytorium

1. **Utwórz repozytorium** na GitHub (np. `username.github.io` dla głównej strony lub `nazwa-repo` dla subścieżki)

2. **Dodaj `.gitignore`**:

```gitignore
# Dependencies
node_modules/
package-lock.json

# Build output
_site/

# Environment
.env
.env.local

# Editor
.vscode/
.idea/
*.swp
```

3. **Włącz GitHub Pages** w ustawieniach repozytorium:
   - Settings → Pages → Source: "Deploy from a branch"
   - Branch: `gh-pages` / `root`

### Workflow GitHub Actions

Plik `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main, master]
  workflow_dispatch:  # Ręczne uruchomienie z UI

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npm run build
        env:
          NODE_ENV: production

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./_site

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Konfiguracja dla subścieżki (pathPrefix)

Jeśli repozytorium nie nazywa się `username.github.io`, strona będzie dostępna pod `username.github.io/nazwa-repo/`. Wymaga to modyfikacji:

```javascript
// eleventy.config.js
return {
  pathPrefix: "/nazwa-repo/",  // Ważne: prowadzący i kończący slash
  // ...
};
```

W szablonach używaj filtra `url`:
```html
<!-- Zawsze generuje poprawną ścieżkę -->
<link rel="stylesheet" href="{{ '/assets/css/main.css' | url }}">

<!-- Dla subścieżki wygeneruje: /nazwa-repo/assets/css/main.css -->
```

### Weryfikacja deploymentu

Po każdym pushu sprawdź:

1. **Status workflow**: GitHub → Actions → wybierz workflow → sprawdź logi
2. **Dostępność**: Otwórz `https://username.github.io/nazwa-repo/`
3. **Konsola przeglądarki**: Brak błędów 404 dla zasobów
4. **Sieć**: Wszystkie zasoby ładują się poprawnie

### Rozwiązywanie problemów

**Błąd 404 dla zasobów CSS/JS**
- Sprawdź czy używasz filtra `| url` we wszystkich ścieżkach
- Zweryfikuj `pathPrefix` w konfiguracji

**Zmiany nie pojawiają się**
- GitHub Pages cache — odczekaj 2-5 minut
- Sprawdź czy workflow zakończył się sukcesem

**Błędy w buildzie**
- Lokalnie uruchom `NODE_ENV=production npm run build`
- Sprawdź logi w GitHub Actions

## Podsumowanie architektoniczne

Kluczowe decyzje projektowe:

1. **SSG zamiast CMS** — maksymalna kontrola, minimalna złożoność, zero kosztów hostingu
2. **Folder-per-post** — kolokacja treści i zasobów ułatwia zarządzanie
3. **Nunjucks zamiast React** — czysty HTML bez runtime overhead
4. **GitHub Actions** — automatyczny deployment bez konfiguracji serwera
5. **Path prefix** — projekt gotowy do deploy na GitHub Pages od pierwszego commita

Następny krok: [optymalizacja SEO dla Eleventy](/posts/seo-w-11ty-kompletny-przewodnik/)
