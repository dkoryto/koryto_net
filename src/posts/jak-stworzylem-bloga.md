---
title: Jak stworzyłem tego bloga z 11ty
description: Krok po kroku opis budowy statycznej strony z blogiem przy użyciu Eleventy
date: 2026-03-28
tags:
  - 11ty
  - tutorial
---

W tym wpisie pokażę Ci, jak krok po kroku stworzyłem tego bloga używając 11ty (Eleventy).

## Czym jest 11ty?

11ty to prosty, ale potężny statyczny generator stron, który:
- Jest szybki (napisany w Node.js)
- Nie narzuca żadnego konkretnego szablonu
- Wspiera wiele silników szablonów (Nunjucks, Liquid, Handlebars, Markdown)
- Ma świetną dokumentację i społeczność

## Struktura projektu

```
├── src/
│   ├── _data/           # Dane globalne (site.json)
│   ├── _includes/       # Szablony wielokrotnego użytku
│   │   ├── layouts/     # Layouty stron
│   │   └── partials/    # Częściowe szablony (header, footer)
│   ├── assets/          # CSS, JS, obrazy
│   ├── posts/           # Wpisy na blogu
│   ├── index.njk        # Strona główna
│   ├── blog.njk         # Lista wszystkich wpisów
│   └── o-mnie.md        # Strona o mnie
├── .eleventy.js         # Konfiguracja 11ty
└── package.json
```

## Konfiguracja

Podstawowa konfiguracja w pliku `eleventy.config.js`:

```javascript
module.exports = function(eleventyConfig) {
  // Kopiowanie plików statycznych
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  
  // Kolekcja postów
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md")
      .sort((a, b) => b.date - a.date);
  });

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
```

## Szablony z Nunjucks

Używam Nunjucks jako głównego silnika szablonów. Layout bazowy wygląda tak:

```html
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <title>{{ title }} | {{ site.title }}</title>
  <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body>
  {{ content | safe }}
</body>
</html>
```

## Wpisy na blogu

Wpis to zwykły plik Markdown z front matter:

```markdown
---
title: Tytuł wpisu
date: 2026-03-28
tags:
  - 11ty
---

Treść wpisu w Markdown...
```

## Stylowanie

Zdecydowałem się na nowoczesny, ciemny motyw z:
- Gradientami w kolorze fioletowo-niebieskim
- Czystą typografią (font Inter)
- Responsywnym designem
- Subtelnymi animacjami

## Deployment na GitHub Pages

Wystarczyło dodać workflow GitHub Actions, który buduje stronę przy każdym pushu:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./_site
```

## Podsumowanie

11ty to świetny wybór dla bloga lub strony portfolio. Jest prosty w obsłudze, ale daje pełną kontrolę nad wygenerowanym kodem.

W następnym wpisie napiszę więcej o optymalizacji wydajności i SEO!
