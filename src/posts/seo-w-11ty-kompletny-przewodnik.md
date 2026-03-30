---
title: SEO w 11ty - kompletny przewodnik techniczny z wdrożeniem produkcyjnym
description: Profesjonalny przewodnik po optymalizacji SEO dla statycznych stron generowanych przez Eleventy. Od fundamentów po zaawansowane techniki strukturalnych danych, Core Web Vitals i architektury informacji.
date: 2026-03-30
tags:
  - 11ty
  - seo
  - tutorial
  - optymalizacja
---

SEO (Search Engine Optimization) to proces systematycznego dostosowywania strony internetowej do wymagań algorytmów wyszukiwarek. W kontekście statycznych generatorów stron, takich jak **Eleventy (11ty)**, uzyskujemy unikalną przewagę: pełną kontrolę nad generowanym kodem HTML bez narzutu frameworków JavaScriptowych.

Ten artykuł to kompletny przewodnik techniczny, który przeprowadzi Cię przez proces budowy bloga zoptymalizowanego pod kątem wyszukiwarek — od fundamentów architektonicznych po zaawansowane techniki implementacji.

## Dlaczego statyczna architektura ma znaczenie dla SEO?

Przed przystąpieniem do implementacji, zrozummy fundamentalną przewagę architektury statycznej:

### Mechanizm działania algorytmów wyszukiwarek

Wyszukiwarki internetowe, przede wszystkim Google, funkcjonują w oparciu o **crawling** (przeglądanie stron) i **indexing** (indeksowanie treści). Proces ten realizowany jest przez automatyczne roboty (boty/crawlery), które:

1. Odwiedzają stronę i pobierają jej kod źródłowy
2. Analizują strukturę HTML, CSS i JavaScript
3. Ekstrahują treść, metadane i relacje między stronami
4. Przechowują dane w indeksie wyszukiwarki
5. Klasyfikują stronę pod kątem zapytań użytkowników

### Problemy z CSR (Client-Side Rendering)

Tradycyjne aplikacje SPA (Single Page Application), takie jak te zbudowane na React, Vue czy Angular, generują treść dynamicznie w przeglądarce użytkownika. To stwarza fundamentalne wyzwanie:

- Bot może otrzymać pusty lub częściowy HTML
- Wymagane jest renderowanie JavaScriptu (JavaScript Rendering), które zużywa zasoby Googlebot
- Opóźnienia w indeksowaniu nowych treści
- Potencjalne błędy przy skomplikowanym kodzie JS

### Przewaga SSG (Static Site Generation)

Eleventy generuje **czysty, statyczny HTML** w fazie builda:

| Aspekt | Aplikacja SPA | Strona statyczna (11ty) |
|--------|---------------|------------------------|
| **Czas do pierwszego bajta (TTFB)** | Średni-wysoki (serwer + render) | Minimalny (CDN) |
| **Widoczność dla crawlera** | Wymaga JS | Pełna treść w HTML |
| **Zużycie zasobów Google** | Wysokie (rendering JS) | Minimalne |
| **Szybkość indeksowania** | Opóźniona | Natychmiastowa |
| **Core Web Vitals** | Wymagają optymalizacji | Optymalne domyślnie |

## Architektura informacji i struktura projektu

Zanim przejdziemy do kodu, zaprojektujmy strukturę projektu zoptymalizowaną pod kątem SEO i utrzymania:

```
src/
├── _data/
│   └── site.json              # Centralna konfiguracja domeny
├── _includes/
│   ├── layouts/
│   │   ├── base.njk           # Layout główny z kompletnym SEO
│   │   └── post.njk           # Layout dla artykułów
│   └── partials/
│       ├── head-seo.njk       # Izolowane komponenty SEO
│       ├── breadcrumbs.njk    # Nawigacja okruszkowa
│       └── schema-org.njk     # Strukturalne dane
├── assets/
│   ├── css/                   # Krytyczne CSS inline, reszta async
│   ├── js/                    # Minimalny JS, defer/async
│   └── images/                # WebP z fallbackiem
├── posts/                     # Treść: frontmatter + markdown
│   └── [slug]/
│       └── index.md           # Wpis z własnym folderem na obrazy
├── sitemap.xml.njk            # Dynamiczna mapa witryny
├── robots.txt.njk             # Instrukcje dla robotów
├── manifest.json.njk          # PWA i ikony systemowe
├── feed.xml.njk               # Atom/RSS dla subskrypcji
└── opensearch.xml.njk         # Wyszukiwarka w pasku adresu
```

### Dlaczego ten układ jest optymalny?

- **Separacja odpowiedzialności**: SEO w osobnych partials, łatwe do modyfikacji
- **Organizacja treści**: Każdy wpis w osobnym folderze ułatwia zarządzanie zasobami
- **Automatyzacja**: Pliki `.njk` z `permalink` generują pliki statyczne automatycznie
- **Skalowalność**: Struktura działa dla 10, 100 i 1000 wpisów

## 1. System zarządzania metadanymi

### Fundamentalne znaczenie meta tagów

Meta tagi to dane o danych — informacje, które nie są widoczne bezpośrednio na stronie, ale są fundamentalne dla:

- **Wyszukiwarek**: `description` wpływa na CTR (Click-Through Rate) w SERP
- **Mediów społecznościowych**: Open Graph kontroluje wygląd udostępnień
- **Platform wiadomości**: Twitter Cards, LinkedIn rich previews
- **Przeglądarek**: `viewport`, `theme-color`, `canonical`

### Implementacja systemu zmiennych SEO

W pliku `src/_includes/layouts/base.njk` implementujemy hierarchiczną logikę metadanych:

```html
<!DOCTYPE html>
<html lang="pl" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  
  {# 
    HIERARCHIA METADANYCH:
    1. Wartość z frontmatter (najwyższy priorytet)
    2. Wartość domyślna z site.json
    3. Fallback zapobiegający pustym wartościom
  #}
  {%- set pageTitle = title | default(site.title) -%}
  {%- set pageDescription = (description | default(site.description)) | truncate(155) -%}
  {%- set pageUrl = site.url + page.url -%}
  {%- set pageImage = image | default(site.url + '/assets/images/og-default.png') -%}
  {%- set pageType = 'article' if '/posts/' in page.url else 'website' -%}
  {%- set pageDate = date | default(site.buildDate) -%}
  
  {# Tytuł z sufiksem brandu dla rozpoznawalności #}
  <title>{% if title and title != site.title %}{{ title }} | {% endif %}{{ site.title }}</title>
  
  {# Podstawowe metadane indeksujące #}
  <meta name="description" content="{{ pageDescription }}">
  <meta name="keywords" content="{{ tags | join(', ') if tags else site.defaultKeywords }}">
  <meta name="author" content="{{ site.author.name }}">
  <meta name="copyright" content="{{ site.author.name }}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  
  {# Canonical — fundamentalny dla unikania duplikatów treści #}
  <link rel="canonical" href="{{ pageUrl }}">
  
  {# Hreflang dla wersji językowych (nawet jeśli mamy tylko PL) #}
  <link rel="alternate" hreflang="pl" href="{{ pageUrl }}">
  <link rel="alternate" hreflang="x-default" href="{{ pageUrl }}">
  
  {# Open Graph protokół dla mediów społecznościowych #}
  <meta property="og:site_name" content="{{ site.title }}">
  <meta property="og:title" content="{{ pageTitle }}">
  <meta property="og:description" content="{{ pageDescription }}">
  <meta property="og:type" content="{{ pageType }}">
  <meta property="og:url" content="{{ pageUrl }}">
  <meta property="og:image" content="{{ pageImage }}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="{{ pageTitle }}">
  <meta property="og:locale" content="pl_PL">
  
  {# Twitter Cards z rich preview #}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="{{ site.social.twitter }}">
  <meta name="twitter:creator" content="{{ site.social.twitter }}">
  <meta name="twitter:title" content="{{ pageTitle }}">
  <meta name="twitter:description" content="{{ pageDescription }}">
  <meta name="twitter:image" content="{{ pageImage }}">
  
  {# PWA i ikony systemowe #}
  <link rel="manifest" href="{{ '/manifest.json' | url }}">
  <meta name="theme-color" content="#6366f1">
  <link rel="apple-touch-icon" href="{{ '/assets/icons/apple-touch-icon.png' | url }}">
</head>
<body>
  {{ content | safe }}
</body>
</html>
```

### Konfiguracja globalna (site.json)

Plik `src/_data/site.json` stanowi centralne źródło prawdy:

```json
{
  "title": "koryto.net",
  "tagline": "Blog o technologii, programowaniu i architekturze oprogramowania",
  "description": "Praktyczne artykuły o web development, JavaScript, Node.js i optymalizacji wydajności. Od fundamentów po zaawansowane wzorce projektowe.",
  "url": "https://dkoryto.github.io/koryto_net",
  "buildDate": "2026-03-30",
  "defaultKeywords": "blog, technologia, programowanie, web development, javascript",
  "author": {
    "name": "Dariusz Koryto",
    "email": "dariusz@example.com",
    "jobTitle": "Software Engineer",
    "url": "https://github.com/dkoryto"
  },
  "social": {
    "twitter": "@dkoryto",
    "github": "https://github.com/dkoryto",
    "linkedin": "https://linkedin.com/in/dkoryto"
  },
  "organization": {
    "name": "koryto.net",
    "logo": "https://dkoryto.github.io/koryto_net/assets/images/logo.png"
  }
}
```

### Dlaczego te metadane są kluczowe?

**Meta Description (155-160 znaków)**
Nie wpływa bezpośrednio na ranking, ale fundamentalnie na CTR. Dobrze napisany opis może zwiększyć klikalność o 5-15%.

**Canonical URL**
Eliminuje problem duplikatów treści (duplicate content), który może rozpraszać "moc SEO" między wieloma URL-ami tej samej treści.

**Open Graph Image (1200×630px)**
To standardowy format dla Facebooka, LinkedIn i innych platform. Obrazy z tekstem nakładanym zwiększają zaangażowanie o 30-80%.

## 2. Strukturalne dane Schema.org (JSON-LD)

### Czym są strukturalne dane?

Strukturalne dane to ustandaryzowany format (JSON-LD) opisu zawartości strony, który pozwala wyszukiwarkom nie tylko indeksować treść, ale **rozumieć jej znaczenie semantyczne**.
n
Implementacja strukturalnych danych umożliwia:
- **Rich Snippets** — rozszerzone wyniki wyszukiwania (gwiazdki, ceny, daty)
- **Knowledge Graph** — panel wiedzy z boku wyników wyszukiwania
- **Voice Search Optimization** — odpowiedzi asystentów głosowych
- **Breadcrumbs w SERP** — ścieżka nawigacyjna pod wynikiem

### Implementacja dla artykułów (BlogPosting)

W pliku `src/_includes/partials/schema-org.njk`:

```html
{% if '/posts/' in page.url %}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "{{ site.url }}{{ page.url }}"
  },
  "headline": "{{ title }}",
  "description": "{{ description }}",
  "image": {
    "@type": "ImageObject",
    "url": "{{ image | default(site.url + '/assets/images/og-default.png') }}",
    "width": 1200,
    "height": 630
  },
  "author": {
    "@type": "Person",
    "name": "{{ site.author.name }}",
    "url": "{{ site.author.url }}",
    "jobTitle": "{{ site.author.jobTitle }}"
  },
  "publisher": {
    "@type": "Organization",
    "name": "{{ site.organization.name }}",
    "logo": {
      "@type": "ImageObject",
      "url": "{{ site.organization.logo }}",
      "width": 600,
      "height": 60
    }
  },
  "datePublished": "{{ date | isoDate }}",
  "dateModified": "{{ modified | default(date) | isoDate }}",
  "keywords": "{{ tags | join(', ') }}",
  "articleSection": "{{ tags[0] | default('Technologia') }}",
  "inLanguage": "pl-PL",
  "isAccessibleForFree": true
}
</script>
{% endif %}
```

### Struktura WebSite z akcją wyszukiwania

Implementacja "Sitelinks Searchbox" — wyszukiwarki bezpośrednio w wynikach Google:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "{{ site.title }}",
  "description": "{{ site.description }}",
  "url": "{{ site.url }}",
  "publisher": {
    "@type": "Organization",
    "name": "{{ site.organization.name }}",
    "logo": "{{ site.organization.logo }}"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "{{ site.url }}/search/?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "inLanguage": "pl-PL"
}
</script>
```

### Breadcrumbs z mikrodanymi

Nawigacja okruszkowa (breadcrumbs) poprawia UX i pozwala Google wyświetlić ścieżkę w wynikach wyszukiwania:

```html
{% set breadcrumbs = [{url: "/", title: "Strona główna"}] %}

{% if '/posts/' in page.url %}
  {% set breadcrumbs = (breadcrumbs.push({url: "/blog/", title: "Blog"}), breadcrumbs) %}
  {% set breadcrumbs = (breadcrumbs.push({url: page.url, title: title}), breadcrumbs) %}
{% elif '/tag/' in page.url %}
  {% set breadcrumbs = (breadcrumbs.push({url: "/blog/", title: "Blog"}), breadcrumbs) %}
  {% set tagName = page.url | replace("/tag/", "") | replace("/", "") | capitalize %}
  {% set breadcrumbs = (breadcrumbs.push({url: page.url, title: "Tag: " + tagName}), breadcrumbs) %}
{% endif %}

{% if breadcrumbs.length > 1 %}
<nav aria-label="Nawigacja okruszkowa">
  <ol itemscope itemtype="https://schema.org/BreadcrumbList">
    {% for crumb in breadcrumbs %}
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      {% if loop.last %}
        <span itemprop="name" aria-current="page">{{ crumb.title }}</span>
      {% else %}
        <a href="{{ crumb.url | url }}" itemprop="item">
          <span itemprop="name">{{ crumb.title }}</span>
        </a>
      {% endif %}
      <meta itemprop="position" content="{{ loop.index }}">
    </li>
    {% endfor %}
  </ol>
</nav>
{% endif %}
```

## 3. Mapa witryny i instrukcje dla robotów

### Protokół Sitemaps

XML Sitemap to plik informujący wyszukiwarki o strukturze witryny. Jest fundamentalny dla:
- Dużych witryn (>500 stron)
- Stron z izolowanymi stronami (osierocone)
- Nowych witryn z małą liczbą linków zwrotnych
- Stron z treścią multimedialną

Implementacja `src/sitemap.xml.njk`:

```xml
---
permalink: /sitemap.xml
layout: null
---
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  {%- for page in collections.all %}
  {%- if not page.url.includes('tag') and not page.url.includes('404') %}
  <url>
    <loc>{{ site.url }}{{ page.url }}</loc>
    <lastmod>{{ page.date | isoDate }}</lastmod>
    {% if page.url == "/" -%}
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    {%- elif '/posts/' in page.url -%}
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    {%- else -%}
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    {%- endif %}
  </url>
  {%- endif %}
  {%- endfor %}
</urlset>
```

### Robots.txt — protokół wykluczania robotów

Plik `src/robots.txt.njk` kontroluje dostęp crawlerów:

```txt
---
permalink: /robots.txt
layout: null
---
# Protocol: robots.txt
# Documentation: https://www.robotstxt.org/robotstxt.html

User-agent: *
Allow: /

# Optymalizacja crawl budget
Disallow: /tag/
Disallow: /404.html

# Sitemap location
Sitemap: {{ site.url }}/sitemap.xml

# Host directive (opcjonalnie, dla Yandex)
Host: {{ site.url | replace("https://", "") | replace("http://", "") }}
```

### Dlaczego wykluczamy /tag/?

Strony tagów często generują **thin content** (treść niskiej jakości) lub duplikaty. Wykluczenie ich z indeksu:
- Koncentruje "moc SEO" na wartościowych stronach artykułów
- Zapobiega kanibalizacji słów kluczowych
- Optymalizuje crawl budget

## 4. Wydajność jako czynnik rankingowy (Core Web Vitals)

Od czerwca 2021 Google oficjalnie uwzględnia **Core Web Vitals** jako czynnik rankingowy. To trzy metryki:

| Metryka | Cel | Mierzy |
|---------|-----|--------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Czas wyrenderowania największego elementu |
| **FID** (First Input Delay) | < 100ms | Responsywność na pierwszą interakcję |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Stabilność wizualną (przesunięcia layoutu) |

### Optymalizacja zasobów krytycznych

W sekcji `<head>` implementujemy hierarchię ładowania:

```html
{# 1. DNS prefetch dla zewnętrznych domen #}
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://unpkg.com">

{# 2. Preconnect z priorytetem #}
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="{{ site.url }}" crossorigin>

{# 3. Preload krytycznych zasobów #}
<link rel="preload" href="{{ '/assets/css/critical.css' | url }}" as="style">
<link rel="preload" href="{{ '/assets/fonts/inter-var.woff2' | url }}" as="font" type="font/woff2" crossorigin>

{# 4. Inline critical CSS (powyżej foldu) #}
<style>
  /* Krytyczne style: layout, typografia, kolory */
  :root{--bg:#0f0f11;--text:#e8e8ec;--font:sans-serif}
  *,*::before,*::after{box-sizing:border-box;margin:0}
  body{font-family:var(--font);background:var(--bg);color:var(--text)}
  /* ... więcej krytycznych stylów ... */
</style>

{# 5. Async load dla reszty CSS #}
<link rel="stylesheet" href="{{ '/assets/css/main.css' | url }}" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="{{ '/assets/css/main.css' | url }}"></noscript>
```

### Transformacje HTML dla optymalizacji

W `eleventy.config.js` dodajemy transformacje:

```javascript
// Lazy loading dla wszystkich obrazków bez atrybutu loading
eleventyConfig.addTransform("lazyImages", function(content, outputPath) {
  if (!outputPath || !outputPath.endsWith(".html")) return content;
  
  // Dodaj loading="lazy" i decoding="async"
  content = content.replace(
    /<img(?![^>]*loading=)([^>]*)>/gi,
    '<img$1 loading="lazy" decoding="async">'
  );
  
  // Priorytet dla pierwszego obrazka (LCP optimization)
  content = content.replace(
    /<img([^>]*)class="([^"]*hero[^"]*)"([^>]*)>/i,
    '<img$1class="$2"$3 fetchpriority="high" loading="eager">'
  );
  
  return content;
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
      conservativeCollapse: true,
      minifyCSS: true,
      minifyJS: true,
      removeEmptyAttributes: true,
      removeRedundantAttributes: true
    });
  });
}
```

### Optymalizacja obrazków

Praktyki dla obrazków w treści:

```html
<!-- Format WebP z fallbackiem -->
<picture>
  <source srcset="/assets/images/photo.webp" type="image/webp">
  <img src="/assets/images/photo.jpg" 
       alt="Opisz co widoczne na zdjęciu, nie że to zdjęcie"
       width="800" height="600"
       loading="lazy" 
       decoding="async">
</picture>

<!-- Responsive images dla różnych urządzeń -->
<img srcset="
    /assets/images/photo-400.webp 400w,
    /assets/images/photo-800.webp 800w,
    /assets/images/photo-1200.webp 1200w
  "
  sizes="(max-width: 600px) 400px, (max-width: 1000px) 800px, 1200px"
  src="/assets/images/photo-800.webp"
  alt="Deskryptywny opis obrazka">
```

## 5. Feeds syndykacji treści (RSS/Atom)

Feed Atom (nowocześniejszy niż RSS 2.0) umożliwia subskrypcję i szybsze indeksowanie nowych wpisów.

```xml
---
permalink: /feed.xml
layout: null
---
<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="pl">
  <title>{{ site.title }}</title>
  <subtitle>{{ site.tagline }}</subtitle>
  <link href="{{ site.url }}/feed.xml" rel="self" type="application/atom+xml"/>
  <link href="{{ site.url }}/" rel="alternate" type="text/html"/>
  <updated>{{ collections.posts | reverse | first | isoDate }}</updated>
  <id>{{ site.url }}/</id>
  <author>
    <name>{{ site.author.name }}</name>
    <uri>{{ site.author.url }}</uri>
  </author>
  
  {%- for post in collections.posts | reverse | limit(20) %}
  <entry>
    <title>{{ post.data.title }}</title>
    <link href="{{ site.url }}{{ post.url }}" rel="alternate" type="text/html"/>
    <published>{{ post.date | isoDate }}</published>
    <updated>{{ post.data.modified | default(post.date) | isoDate }}</updated>
    <id>{{ site.url }}{{ post.url }}</id>
    <summary type="html">{{ post.data.description | escape }}</summary>
    <category term="{{ post.data.tags | first }}" />
  </entry>
  {%- endfor %}
</feed>
```

## 6. Architektura URL i linkowanie wewnętrzne

### Przyjazne URL-e (slugi)

Implementacja w `eleventy.config.js`:

```javascript
eleventyConfig.addFilter("slugify", (input) => {
  const slug = String(input)
    .normalize('NFD')                    // Rozkład polskich znaków
    .replace(/[\u0300-\u036f]/g, '')     // Usuń diakrytyki
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')           // Usuń znaki specjalne
    .replace(/[\s_-]+/g, '-')            // Zamień spacje na myślniki
    .replace(/^-+|-+$/g, '');            // Trim myślniki
  
  return slug;
});
```

### Strategia linkowania wewnętrznego

Linkowanie wewnętrzne przekazuje "link juice" i pomaga Google zrozumieć hierarchię treści:

```html
<!-- Link kontekstowy z anchor text opisującym docelową stronę -->
<p>W artykule o <a href="/blog/seo-w-11ty/">optymalizacji SEO dla Eleventy</a> 
dokładnie opisałem proces implementacji strukturalnych danych.</p>

<!-- Unikaj "click here" lub "czytaj więcej" -->
<!-- ❌ Źle: -->
<a href="/blog/seo/">Czytaj więcej →</a>

<!-- ✅ Dobrze: -->
<a href="/blog/seo/">Kompletny przewodnik SEO dla 11ty z przykładami</a>
```

## 7. Walidacja i monitoring

### Narzędzia do weryfikacji wdrożenia

Po wdrożeniu przetestuj stronę w następujących narzędziach:

| Narzędzie | URL | Co sprawdza |
|-----------|-----|-------------|
| **Rich Results Test** | search.google.com/test/rich-results | Poprawność Schema.org |
| **PageSpeed Insights** | pagespeed.web.dev | Core Web Vitals |
| **Mobile-Friendly Test** | search.google.com/test/mobile-friendly | Responsywność |
| **RSS Validator** | validator.w3.org/feed | Poprawność feedu |
| **Schema Markup Validator** | validator.schema.org | Strukturalne dane |

### Google Search Console — podstawowy monitoring

Dodaj stronę do GSC i monitoruj:
- **Coverage** — indeksowanie i błędy
- **Core Web Vitals** — raport wydajności
- **Performance** — zapytania, CTR, pozycje
- **Enhancements** — rich results i breadcrumbs

## Checklist produkcyjnego wdrożenia SEO

Przed publikacją zweryfikuj:

### Meta i struktura
- [ ] Unikalny `<title>` na każdej stronie (50-60 znaków)
- [ ] Unikalny `meta description` (150-160 znaków)
- [ ] Canonical URL poprawnie ustawiony
- [ ] Open Graph tags dla wszystkich stron
- [ ] Twitter Cards skonfigurowane

### Techniczne SEO
- [ ] Schema.org JSON-LD dla artykułów
- [ ] Breadcrumbs z mikrodanymi
- [ ] XML Sitemap generowany automatycznie
- [ ] Robots.txt zezwalający na indeksowanie
- [ ] HTTPS wymuszony
- [ ] Hreflang dla wersji językowych

### Wydajność
- [ ] LCP < 2.5s (PageSpeed Insights)
- [ ] CLS < 0.1
- [ ] Lazy loading obrazków
- [ ] Minifikacja HTML/CSS/JS
- [ ] Preload krytycznych zasobów
- [ ] WebP dla obrazków z fallbackiem

### Treść i nawigacja
- [ ] Jednoznaczna hierarchia H1-H6 (tylko jeden H1)
- [ ] Atrybuty `alt` dla wszystkich obrazków
- [ ] Linkowanie wewnętrzne między powiązanymi artykułami
- [ ] Przyjazne URL-e ze słowami kluczowymi
- [ ] Atom/RSS feed działający

### Monitoring
- [ ] Strona dodana do Google Search Console
- [ ] Sitemap zgłoszony w GSC
- [ ] Test Rich Results przechodzi bez błędów
- [ ] Test Mobile-Friendly pozytywny

---

Implementacja powyższych praktyk zapewnia solidne fundamenty SEO dla bloga opartego na Eleventy. Pamiętaj, że SEO to proces ciągły — regularnie monitoruj wyniki w Google Search Console i iteracyjnie poprawiaj stronę na podstawie zebranych danych.
