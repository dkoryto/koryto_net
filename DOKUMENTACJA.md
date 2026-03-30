# 📚 Dokumentacja koryto.net

Kompleksowa dokumentacja projektu osobistej strony z blogiem opartej na 11ty (Eleventy).

## 📋 Spis treści

1. [Przegląd projektu](#przegląd-projektu)
2. [Architektura i technologie](#architektura-i-technologie)
3. [Struktura projektu](#struktura-projektu)
4. [Funkcjonalności](#funkcjonalności)
5. [Konfiguracja](#konfiguracja)
6. [Instrukcje użytkowania](#instrukcje-użytkowania)
7. [SEO i optymalizacja](#seo-i-optymalizacja)
8. [Uruchamianie lokalne i na własnym serwerze](#uruchamianie-lokalne-i-na-własnym-serwerze)
9. [Deployment](#deployment)
10. [Rozwiązywanie problemów](#rozwiązywanie-problemów)

---

## Przegląd projektu

**koryto.net** to nowoczesny, statyczny blog osobisty zbudowany przy użyciu 11ty (Eleventy). Strona łączy w sobie elegancki design, wysoką wydajność i zaawansowane funkcje SEO.

### Kluczowe cechy

- ⚡ **Błyskawiczne ładowanie** - statyczny HTML bez zbędnego JavaScriptu
- 🎨 **Dwa motywy** - ciemny i jasny z automatycznym zapisem preferencji
- 📱 **Responsywność** - optymalizacja pod wszystkie urządzenia
- 🔍 **SEO-first** - kompletna optymalizacja pod wyszukiwarki
- ✍️ **Edytor WYSIWYG** - wizualny edytor wpisów z obsługą obrazków
- 📊 **Analityka** - Plausible Analytics (privacy-friendly)

---

## Architektura i technologie

### Stack technologiczny

| Komponent | Technologia | Wersja |
|-----------|-------------|--------|
| Generator | 11ty (Eleventy) | 3.1.5 |
| Szablony | Nunjucks | - |
| Stylowanie | CSS3 (zmienne CSS) | - |
| Składnia | highlight.js | - |
| Edytor | EasyMDE | 2.18.0 |
| Archiwizacja | JSZip | 3.10.1 |
| Hosting | GitHub Pages | - |

### Zalety wybranych technologii

**11ty (Eleventy)**
- Zero konfiguracji dla podstawowych zastosowań
- Pełna kontrola nad generowanym HTML
- Wsparcie dla wielu silników szablonów
- Ekstremalnie szybki build

**Nunjucks**
- Dziedziczenie szablonów
- Makra i filtry
- Logiczne struktury sterujące
- Zgodność z Jinja2

---

## Struktura projektu

```
koryto_net/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD - automatyczny deployment
├── docs/
│   ├── JAK-DODAC-ARTYKUL.md    # Przewodnik dodawania artykułów
│   └── JAK-DODAC-OBRAZKI.md    # Instrukcja obsługi obrazków
├── src/                        # Źródła projektu
│   ├── _data/
│   │   └── site.json           # Globalne dane strony
│   ├── _includes/
│   │   ├── layouts/
│   │   │   ├── base.njk        # Bazowy layout (SEO, meta tagi)
│   │   │   └── post.njk        # Layout dla wpisów
│   │   └── partials/
│   │       ├── breadcrumbs.njk # Okruszki chleba
│   │       ├── footer.njk      # Stopka
│   │       └── header.njk      # Nagłówek z menu
│   ├── assets/
│   │   ├── css/
│   │   │   ├── main.css        # Główne style
│   │   │   └── syntax.css      # Podświetlanie składni
│   │   ├── js/
│   │   │   └── main.js         # Skrypty (motyw, progress, copy code)
│   │   └── images/
│   │       ├── profile.jpg     # Zdjęcie profilowe
│   │       └── posts/          # Obrazki do artykułów
│   ├── posts/                  # Wpisy bloga (.md)
│   ├── archiwum.njk            # Strona archiwum
│   ├── blog.njk                # Lista wpisów z paginacją
│   ├── edytor.njk              # WYSIWYG edytor wpisów
│   ├── feed.xml.njk            # RSS/Atom feed
│   ├── index.njk               # Strona główna
│   ├── manifest.json.njk       # PWA manifest
│   ├── o-mnie.md               # Strona o mnie
│   ├── robots.txt.njk          # Instrukcje dla robotów
│   ├── sitemap.xml.njk         # Mapa strony
│   └── tag.njk                 # Strony tagów
├── _site/                      # Wygenerowana strona (gitignore)
├── eleventy.config.js          # Konfiguracja 11ty
├── package.json                # Zależności npm
└── README.md                   # Podstawowa dokumentacja
```

---

## Funkcjonalności

### 1. System blogowy

#### Wpisy
- Format Markdown z frontmatter
- Automatyczna kolekcja sortowana po dacie
- Wsparcie dla tagów
- Powiązane wpisy (na podstawie wspólnych tagów)
- Szacowany czas czytania

#### Archiwum
- Grupowanie wpisów po roku i miesiącu
- Chronologiczna lista wszystkich wpisów

#### Tagi
- Automatyczne generowanie stron dla każdego tagu
- Chmura tagów z linkami

### 2. SEO i Meta dane

#### Meta tagi
- Tytuł i opis dla każdej strony
- Canonical URLs
- Open Graph (Facebook)
- Twitter Cards
- Hreflang (pl / x-default)

#### Schema.org
- BlogPosting dla wpisów
- WebSite dla strony głównej
- BreadcrumbList dla okruszków
- Person dla autora

#### Techniczne SEO
- Sitemap.xml z priorytetami
- Robots.txt
- RSS/Atom feed
- Manifest.json (PWA)

### 3. UI/UX

#### Motywy
- Ciemny (domyślny) i jasny motyw
- Zapisywanie preferencji w localStorage
- Automatyczne wykrywanie systemowych preferencji

#### Nawigacja
- Pasek postępu czytania
- Przycisk "do góry"
- Okruszki chleba (breadcrumbs)
- Paginacja bloga

#### Treść
- Podświetlanie składni kodu
- Przyciski "Kopiuj kod"
- Lazy loading obrazków
- Responsywne embedy

### 4. Edytor WYSIWYG

#### Funkcje
- Wizualna edycja Markdown (EasyMDE)
- Upload obrazków (przeciągnij i upuść)
- Podgląd na żywo
- Generowanie frontmatter
- Pobieranie jako .md lub ZIP
- Wczytywanie istniejących plików .md

#### Pola formularza
- Tytuł wpisu
- Data publikacji
- Tagi
- Opis (meta description)
- Obrazek wyróżniający (z uploadiem)
- Treść (z toolbar Markdown)

---

## Konfiguracja

### Plik `site.json`

```json
{
  "title": "koryto.net",
  "description": "Blog o technologii, programowaniu i projektach",
  "url": "https://dkoryto.github.io/koryto_net",
  "author": "Dariusz Koryto",
  "currentYear": 2026,
  "social": {
    "github": "https://github.com/dkoryto",
    "linkedin": "https://www.linkedin.com/in/dariuszkoryto/",
    "twitter": ""
  }
}
```

### Filtry w Eleventy

| Filtr | Opis | Przykład |
|-------|------|----------|
| `dateDisplay` | Formatowanie daty (pl-PL) | `{{ date \| dateDisplay }}` |
| `isoDate` | Format ISO dla meta tagów | `{{ date \| isoDate }}` |
| `limit` | Ograniczenie liczby elementów | `{{ posts \| limit(5) }}` |
| `readingTime` | Szacowany czas czytania | `{{ content \| readingTime }}` |
| `truncate` | Skracanie tekstu | `{{ text \| truncate(160) }}` |
| `hasCommonTags` | Filtrowanie po wspólnych tagach | `{{ posts \| hasCommonTags(tags, url) }}` |
| `groupByYear` | Grupowanie po roku | `{{ posts \| groupByYear }}` |

### Zmienne CSS

```css
:root {
  /* Kolory - tryb ciemny */
  --color-bg: #0f0f11;
  --color-surface: #1a1a1e;
  --color-surface-elevated: #242429;
  --color-text: #e8e8ec;
  --color-text-muted: #9ca3af;
  --color-primary: #6366f1;
  --color-primary-light: #818cf8;
  --color-secondary: #22d3ee;
  --color-accent: #f472b6;
  
  /* Layout */
  --max-width: 1400px;
  --max-width-narrow: 900px;
  --max-width-content: 1100px;
}

[data-theme="light"] {
  /* Kolory - tryb jasny */
  --color-bg: #ffffff;
  --color-surface: #f8f9fa;
  /* ... */
}
```

---

## Instrukcje użytkowania

### Dodawanie nowego wpisu

#### Metoda 1: Edytor WYSIWYG (zalecana)

1. Wejdź na `/edytor/`
2. Wypełnij wymagane pola:
   - Tytuł
   - Data
   - Opis
   - Treść
3. Dodaj obrazki przez przeciągnij-i-upuść lub URL
4. Kliknij "Pobierz ZIP (.md + obrazki)"
5. Wypakuj ZIP do folderu projektu:
   - `.md` → `src/posts/`
   - obrazki → `src/assets/images/`
6. Uruchom `npm run build`

#### Metoda 2: Ręcznie (dla zaawansowanych)

1. Utwórz plik `src/posts/YYYY-MM-DD-tytul-wpisu.md`
2. Dodaj frontmatter:
```markdown
---
title: Tytuł wpisu
description: Krótki opis
date: 2026-03-30
tags:
  - tag1
  - tag2
---

Treść wpisu w Markdown...
```
3. Dodaj obrazki do `src/assets/images/`
4. Uruchom `npm run build`

### Dodawanie obrazków

#### W treści wpisu

```markdown
![Alt text](/assets/images/nazwa-obrazka.jpg)
```

#### Z atrybutami HTML

```markdown
<img src="/assets/images/obrazek.jpg" alt="Opis" width="800" loading="lazy">
```

#### Optymalizacja
- Format: JPG dla zdjęć, PNG dla grafik z przezroczystością
- Maksymalna szerokość: 1200px
- Lazy loading: automatycznie dodawane

---

## SEO i optymalizacja

### Struktura URL

| Strona | URL | Priorytet |
|--------|-----|-----------|
| Home | `/` | 1.0 |
| Blog | `/blog/` | 0.9 |
| Wpis | `/posts/tytul-wpisu/` | 0.8 |
| Tag | `/tag/nazwa-tagu/` | 0.5 |
| Archiwum | `/archiwum/` | 0.4 |

### Core Web Vitals

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Optymalizacje

1. **Lazy loading** - obrazki ładowane przy przewijaniu
2. **Preconnect** - wcześniejsze połączenie z zewnętrznymi zasobami
3. **Minifikacja** - HTML/CSS/JS w produkcji
4. **Prefetch** - DNS prefetch dla Google Fonts

---

## Uruchamianie lokalne i na własnym serwerze

### Wymagania systemowe

- **Node.js** w wersji 18 lub nowszej
- **npm** (instaluje się razem z Node.js)
- **Git** (opcjonalnie, do klonowania repozytorium)

### Instalacja i uruchomienie lokalne

#### Krok 1: Pobierz projekt

```bash
# Klonowanie repozytorium (jeśli masz git)
git clone https://github.com/dkoryto/koryto_net.git
cd koryto_net

# LUB pobierz ZIP i wypakuj
# Wypakuj archiwum i przejdź do folderu
```

#### Krok 2: Instalacja zależności

```bash
npm install
```

Instaluje wszystkie wymagane pakiety (11ty, Nunjucks, itp.)

#### Krok 3: Uruchomienie serwera deweloperskiego

```bash
npm run serve
```

Serwer uruchomi się na: **http://localhost:8080/koryto_net/**

**Funkcjonalności serwera deweloperskiego:**
- Hot reload - automatyczne odświeżanie przy zmianach
- Watch mode - obserwacja plików źródłowych
- Source maps - łatwiejsze debugowanie

#### Krok 4: Zatrzymanie serwera

Naciśnij `Ctrl+C` w terminalu

### Komendy dostępne w projekcie

| Komenda | Opis |
|---------|------|
| `npm run serve` | Serwer deweloperski z hot reload |
| `npm run build` | Build produkcyjny (folder `_site/`) |
| `npm run debug` | Tryb debugowania z logami |

### Uruchomienie na własnym serwerze (self-hosting)

#### Opcja 1: Serwer WWW (Apache/Nginx)

##### Przygotowanie plików

```bash
# Zbuduj wersję produkcyjną
npm run build

# Pliki do wgrania znajdują się w folderze _site/
```

##### Konfiguracja Nginx

```nginx
server {
    listen 80;
    server_name twoja-domena.pl;
    root /ścieżka/do/projektu/_site;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # Cache static files
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Try files
    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    # Error pages
    error_page 404 /404.html;
}
```

##### Konfiguracja Apache (.htaccess)

```apache
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>

# Cache static files
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Rewrite rules
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ $1.html [L]
</IfModule>
```

#### Opcja 2: Docker

##### Dockerfile

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/_site /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
```

##### docker-compose.yml

```yaml
version: '3.8'

services:
  blog:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
```

Uruchomienie:

```bash
docker-compose up -d
```

#### Opcja 3: Netlify / Vercel / Cloudflare Pages

##### Netlify

1. Zaloguj się do Netlify
2. "Add new site" → "Import an existing project"
3. Połącz z GitHub i wybierz repozytorium
4. Ustawienia build:
   - **Build command:** `npm run build`
   - **Publish directory:** `_site`

##### Vercel

1. Zaloguj się do Vercel
2. "Add New Project"
3. Importuj z GitHub
4. Framework Preset: **Other**
5. Build Command: `npm run build`
6. Output Directory: `_site`

##### Cloudflare Pages

1. Zaloguj się do Cloudflare
2. Pages → "Create a project"
3. Połącz z Git
4. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `_site`

### Zmiana konfiguracji dla własnej domeny

#### 1. Zmień `pathPrefix` w `eleventy.config.js`

Dla własnej domeny (np. `twojadomena.pl`):

```javascript
// Zmień z:
pathPrefix: "/koryto_net/"

// Na (pusta ścieżka dla root):
pathPrefix: "/"
```

Dla subdomeny (np. `blog.twojadomena.pl`):

```javascript
pathPrefix: "/"
```

#### 2. Zaktualizuj `site.json`

```json
{
  "title": "koryto.net",
  "description": "Blog o technologii...",
  "url": "https://twojadomena.pl",
  "author": "Dariusz Koryto"
}
```

#### 3. Przebuduj stronę

```bash
npm run build
```

### Wymagania serwera

| Zasób | Wymagania |
|-------|-----------|
| Przestrzeń dyskowa | ~50MB (bez obrazków) |
| RAM | Minimum 512MB |
| Procesor | Dowolny (statyczne pliki) |
| PHP/Node | Nie wymagane |
| Baza danych | Nie wymagana |

### Automatyczny deployment (opcjonalnie)

#### GitHub Actions dla własnego serwera (FTP/SFTP)

```yaml
name: Deploy to Server
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
      
      # SFTP Deployment
      - name: Deploy via SFTP
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          password: ${{ secrets.PASSWORD }}
          source: "_site/*"
          target: "/var/www/html/"
```

---

## Deployment

### Automatyczny (GitHub Actions)

Przy każdym pushu do `main`:

```yaml
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

### Ręczny

```bash
# Build
npm run build

# Deploy (jeśli skonfigurowany gh-pages)
npm run deploy
```

---

## Rozwiązywanie problemów

### Problem: Zdjęcia nie wyświetlają się

**Rozwiązanie:**
- Sprawdź ścieżkę - musi zaczynać się od `/assets/images/`
- Upewnij się, że plik jest w `src/assets/images/`
- Po dodaniu obrazka uruchom `npm run build`

### Problem: Wpis nie pojawia się na liście

**Rozwiązanie:**
- Sprawdź format daty w frontmatter (YYYY-MM-DD)
- Upewnij się, że plik jest w `src/posts/`
- Sprawdź poprawność YAML (brak tabów, tylko spacje)

### Problem: Style się nie ładują

**Rozwiązanie:**
- Sprawdź czy plik CSS jest w `src/assets/css/`
- Wyczyść cache przeglądarki
- Sprawdź konsolę przeglądarki (F12)

---

## Licencja

MIT License - Dariusz Koryto

---

## Kontakt

- **Email:** przez LinkedIn
- **LinkedIn:** https://www.linkedin.com/in/dariuszkoryto/
- **GitHub:** https://github.com/dkoryto
- **Strona:** https://dkoryto.github.io/koryto_net/
