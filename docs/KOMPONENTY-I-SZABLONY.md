# Komponenty i Szablony

Techniczna dokumentacja systemu szablonów i komponentów używanych w projekcie.

## Szablony Nunjucks

### Layouty

#### `base.njk` - Bazowy layout

Główny layout zawierający cały HTML, meta tagi, SEO i strukturę strony.

**Zmienne wejściowe:**
- `title` - tytuł strony
- `description` - opis strony (SEO)
- `tags` - tagi dla meta keywords
- `image` - obrazek Open Graph

**Bloki:**
- `content` - główna treść strony

**Funkcjonalności:**
- Generowanie meta tagów SEO
- Schema.org JSON-LD
- Open Graph / Twitter Cards
- Breadcrumbs Schema
- Preconnect i preload zasobów

#### `post.njk` - Layout wpisu

Rozszerza `base.njk`, dedykowany dla wpisów bloga.

**Zmienne z frontmatter:**
- `title` - tytuł wpisu
- `description` - opis wpisu
- `date` - data publikacji
- `tags` - tagi wpisu

**Komponenty:**
- Nagłówek z datą, czasem czytania i tagami
- Treść artykułu
- Powiązane wpisy (3 sztuki)
- Nawigacja poprzedni/następny wpis

### Partiale

#### `header.njk` - Nagłówek

Zawiera logo i menu nawigacyjne.

**Funkcjonalności:**
- Responsywne menu (hamburger na mobile)
- Podświetlanie aktywnej strony (`aria-current`)
- Nawigacja: Home, Blog, Archiwum, O mnie

#### `footer.njk` - Stopka

Zawiera informacje o prawach autorskich i linki społecznościowe.

**Zmienne z `site.json`:**
- `site.author` - autor
- `site.currentYear` - aktualny rok
- `site.social` - linki do social media

**Ikony:**
- RSS Feed
- GitHub
- LinkedIn

#### `breadcrumbs.njk` - Okruszki chleba

Automatycznie generowana nawigacja okruszkowa.

**Logika:**
```nunjucks
{% if page.url != "/" %}
  Home > [kategoria] > [tytuł]
{% endif %}
```

**Wsparcie dla:**
- Strona główna
- Wpisy (Home > Blog > Tytuł)
- Tagi (Home > Blog > Tag: nazwa)
- Archiwum (Home > Archiwum)
- Strony statyczne

## Komponenty CSS

### Klasy layoutu

```css
.container          /* Kontener max 1400px */
.container--narrow  /* Kontener wąski 900px */
.container--content /* Kontener treści 1100px */
```

### Karty wpisów

```css
.post-card          /* Główna karta */
.post-card__meta    /* Meta data (data, tagi) */
.post-card__tag     /* Tag jako link */
.post-card__title   /* Tytuł wpisu */
.post-card__excerpt /* Zajawka */
.post-card__footer  /* Stopka (czytaj więcej, czas) */
```

### Przyciski

```css
.btn                /* Bazowy przycisk */
.btn--primary       /* Główny (gradient) */
.btn--secondary     /* Drugorzędny */
.btn--ghost         /* Przezroczysty */
.btn--small         /* Mniejszy */
```

### Efekty i animacje

```css
/* Fade in przy scrollu */
.hero, .post-card, .section {
  animation: fadeIn 0.6s ease-out;
}

/* Gradientowy pierścień */
.about-image-wrapper::before {
  animation: gradientRotate 3s linear infinite;
}

/* Pulsujący cień */
.about-image-wrapper::after {
  animation: pulseGlow 2s ease-in-out infinite;
}
```

## Komponenty JavaScript

### Motyw (theme toggle)

```javascript
// Zapisywanie preferencji
localStorage.setItem('theme', 'light|dark');

// Odczytywanie preferencji systemowych
window.matchMedia('(prefers-color-scheme: dark)').matches
```

### Pasek postępu czytania

```javascript
// Obliczanie postępu
const progress = (scrollTop / scrollHeight) * 100;
progressBar.style.width = progress + '%';
```

### Kopiowanie kodu

```javascript
// Automatyczne dodawanie przycisków do bloków kodu
const codeBlocks = document.querySelectorAll('pre code');
codeBlocks.forEach((codeBlock) => {
  // Tworzenie wrappera i przycisku
  // Kopiowanie do schowka
});
```

## System tagów

### Generowanie stron tagów

Plik `tag.njk` używa paginacji 11ty do generowania stron dla każdego tagu:

```yaml
---
pagination:
  data: collections
  size: 1
  alias: tag
  filter:
    - posts
    - all
permalink: /tag/{{ tag | slugify }}/
---
```

### URL-e tagów

- `/tag/11ty/` - wpisy o 11ty
- `/tag/tutorial/` - tutoriale
- `/tag/seo/` - wpisy o SEO

## Struktura frontmatter

### Minimalna wersja

```yaml
---
title: Tytuł wpisu
date: 2026-03-30
---
```

### Pełna wersja

```yaml
---
title: Tytuł wpisu
description: Opis dla SEO i list
date: 2026-03-30
tags:
  - javascript
  - tutorial
image: /assets/images/featured.jpg
modified: 2026-03-31
---
```

## Mapowanie kolekcji

11ty automatycznie tworzy kolekcje:

```javascript
// Kolekcja "posts" - wszystkie wpisy
// Kolekcja "all" - wszystkie strony
// Kolekcje per tag - np. collections.javascript
```

Dostęp w szablonach:

```nunjucks
{{ collections.posts }}
{{ collections.javascript }}
{{ collections.all }}
```

## Responsywność

### Breakpointy

```css
/* Mobile first */
@media (min-width: 640px)  /* sm */
@media (min-width: 768px)  /* md */
@media (min-width: 1024px) /* lg */
@media (min-width: 1280px) /* xl */
```

### Przykłady użycia

```css
/* Grid dla kart wpisów */
.posts-grid {
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .posts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

## Dostępność (A11y)

### Atrybuty ARIA

```html
<nav aria-label="Główna nawigacja">
  <a aria-current="page">Home</a>
  <button aria-expanded="false" aria-controls="menu">
</nav>
```

### Focus styles

```css
a:focus-visible,
button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Debugowanie

### Włączenie debugowania 11ty

```bash
DEBUG=* npx eleventy
# lub
npm run debug
```

### Sprawdzenie kolekcji

```javascript
// W eleventy.config.js
console.log(collections.posts);
```

### Weryfikacja zmiennych

```nunjucks
<!-- W szablonie -->
<pre>{{ page | dump }}</pre>
<pre>{{ site | dump }}</pre>
```
