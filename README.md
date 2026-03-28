# koryto.net

Moja osobista strona domowa z blogiem, zbudowana przy użyciu [11ty (Eleventy)](https://www.11ty.dev/) i hostowana na GitHub Pages.

## 🚀 Technologie

- **[11ty (Eleventy)](https://www.11ty.dev/)** - Statyczny generator stron
- **[Nunjucks](https://mozilla.github.io/nunjucks/)** - Silnik szablonów
- **[GitHub Pages](https://pages.github.com/)** - Hosting
- **CSS3** - Nowoczesny, ciemny motyw z gradientami

## 📝 Funkcje

- ⚡ Szybka statyczna strona
- 🎨 Nowoczesny, ciemny design
- 📱 W pełni responsywna
- ♿ Dostępna (ARIA, semantyczny HTML)
- 🔍 SEO-friendly
- 🧪 Składnia kodu z podświetlaniem

## 🛠️ Lokalny development

```bash
# Instalacja zależności
npm install

# Serwer deweloperski z hot reload
npm run serve

# Build produkcyjny
npm run build
```

## 📁 Struktura projektu

```
├── src/
│   ├── _data/           # Dane globalne
│   ├── _includes/       # Szablony
│   │   ├── layouts/     # Layouty stron
│   │   └── partials/    # Częściowe szablony
│   ├── assets/          # CSS, JS, obrazy
│   ├── posts/           # Wpisy na blogu
│   └── *.njk, *.md      # Strony
├── .github/workflows/   # CI/CD
└── eleventy.config.js   # Konfiguracja
```

## 📝 Dodawanie nowego wpisu

Utwórz plik `src/posts/nazwa-wpisu.md`:

```markdown
---
title: Tytuł wpisu
description: Krótki opis
date: 2026-03-29
tags:
  - tag1
  - tag2
---

Treść wpisu w Markdown...
```

## 📄 Licencja

MIT
