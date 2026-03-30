# koryto.net

Moja osobista strona domowa z blogiem, zbudowana przy użyciu [11ty (Eleventy)](https://www.11ty.dev/) i hostowana na GitHub Pages.

![Build Status](https://github.com/dkoryto/koryto_net/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)

## 🚀 Technologie

- **[11ty (Eleventy)](https://www.11ty.dev/)** - Statyczny generator stron
- **[Nunjucks](https://mozilla.github.io/nunjucks/)** - Silnik szablonów
- **[GitHub Pages](https://pages.github.com/)** - Hosting
- **CSS3** - Nowoczesny, ciemny/jasny motyw z gradientami

## 📝 Funkcje

- ⚡ Szybka statyczna strona
- 🎨 Tryb ciemny i jasny (z zapisywaniem w localStorage)
- 📱 W pełni responsywna
- ♿ Dostępna (ARIA, semantyczny HTML)
- 🔍 SEO-friendly
- 📊 Pasek postępu czytania
- ⬆️ Przycisk przewijania do góry
- 🧪 Składnia kodu z podświetlaniem

## 📚 Dokumentacja

### Dla użytkowników
- **[Dokumentacja projektu](./DOKUMENTACJA.md)** - Kompletna dokumentacja techniczna
- **[Jak dodać artykuł](./docs/JAK-DODAC-ARTYKUL.md)** - Przewodnik po dodawaniu wpisów
- **[Jak dodać obrazki](./docs/JAK-DODAC-OBRAZKI.md)** - Instrukcja obsługi obrazków
- **[Edytor WYSIWYG](./docs/EDYTOR-WYSIWYG.md)** - Dokumentacja edytora

### Dla developerów
- **[Komponenty i Szablony](./docs/KOMPONENTY-I-SZABLONY.md)** - Dokumentacja techniczna szablonów

## 🛠️ Lokalny development

```bash
# Instalacja zależności
npm install

# Serwer deweloperski z hot reload
npm run serve

# Build produkcyjny
npm run build
```

Serwer uruchomi się na: http://localhost:8080/koryto_net/

## 📁 Struktura projektu

```
├── src/
│   ├── _data/           # Dane globalne (site.json)
│   ├── _includes/       # Szablony
│   │   ├── layouts/     # Layouty stron
│   │   └── partials/    # Częściowe szablony
│   ├── assets/          # CSS, JS, obrazy
│   │   ├── css/
│   │   ├── js/
│   │   └── images/
│   │       └── posts/   # Obrazki do artykułów
│   ├── posts/           # Wpisy na blogu
│   ├── index.njk        # Strona główna
│   ├── blog.njk         # Lista wszystkich wpisów
│   └── o-mnie.md        # Strona o mnie
├── docs/                # Dokumentacja
│   ├── JAK-DODAC-ARTYKUL.md
│   └── JAK-DODAC-OBRAZKI.md
├── .github/workflows/   # CI/CD
└── eleventy.config.js   # Konfiguracja 11ty
```

## ✏️ Szybki przykład - dodawanie artykułu

```markdown
---
title: Mój nowy artykuł
description: Krótki opis tego o czym jest artykuł
date: 2026-03-30
tags:
  - javascript
  - tutorial
---

# Mój nowy artykuł

Treść artykułu w **Markdown**...

```javascript
// Przykład kodu
console.log('Hello World!');
```

![Opis obrazka](/assets/images/posts/moj-obrazek.jpg)
```

Więcej szczegółów w [dokumentacji](./docs/JAK-DODAC-ARTYKUL.md).

## 🚀 Deployment

Strona automatycznie deployuje się na GitHub Pages przy każdym pushu do gałęzi `main`.

Adres: https://dkoryto.github.io/koryto_net/

## 📄 Licencja

MIT
