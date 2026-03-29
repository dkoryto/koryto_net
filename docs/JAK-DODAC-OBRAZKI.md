# Jak dodawać obrazki do artykułów

## Spis treści
- [Szybki start](#szybki-start)
- [Rodzaje obrazków](#rodzaje-obrazków)
- [Dodawanie obrazków](#dodawanie-obrazków)
  - [Obrazek w treści artykułu](#1-obrazek-w-treści-artykułu)
  - [Obrazek wyróżniający (featured image)](#2-obrazek-wyróżniający-featured-image)
  - [Galeria zdjęć](#3-galeria-zdjęć)
- [Formaty plików](#formaty-plików)
- [Optymalizacja obrazków](#optymalizacja-obrazków)
- [Rozwiązywanie problemów](#rozwiązywanie-problemów)

---

## Szybki start

1. Skopiuj obrazek do `src/assets/images/posts/`
2. W artykule użyj: `![Opis obrazka](/assets/images/posts/nazwa-obrazka.jpg)`
3. Zrób commit i push

---

## Rodzaje obrazków

| Typ | Lokalizacja | Użycie |
|-----|-------------|--------|
| Obrazki w artykułach | `src/assets/images/posts/` | Zdjęcia w treści artykułów |
| Obrazki ogólne | `src/assets/images/` | Logo, favicon, tło |
| Obrazki zewnętrzne | URL zewnętrzny | Hotlinkowane zdjęcia |

---

## Dodawanie obrazków

### 1. Obrazek w treści artykułu

#### Krok 1: Przygotuj obrazek
- Zoptymalizuj rozmiar (max 1200px szerokości)
- Użyj formatu WebP lub JPG (zdjęcia), PNG (zrzuty ekranu)
- Nadaj opisową nazwę: `docker-kontenery.jpg` ✅, `IMG_1234.jpg` ❌

#### Krok 2: Skopiuj do folderu
```bash
cp ~/obrazy/moj-obrazek.jpg src/assets/images/posts/
```

#### Krok 3: Dodaj do artykułu

**Podstawowa składnia:**
```markdown
![Opis obrazka dla czytników ekranu](/assets/images/posts/docker-kontenery.jpg)
```

**Obrazek z tytułem (tooltip):**
```markdown
![Opis obrazka](/assets/images/posts/docker-kontenery.jpg "Tytuł obrazka - pojawi się po najechaniu")
```

**Obrazek jako link:**
```markdown
[![Opis obrazka](/assets/images/posts/maly.jpg)](/assets/images/posts/duzy.jpg)
```

#### Krok 4: Pełny przykład artykułu z obrazkami

```markdown
---
title: Wprowadzenie do Docker
description: Jak używać kontenerów Docker w projektach
date: 2026-03-30
tags:
  - docker
  - devops
  - tutorial
---

# Wprowadzenie do Docker

Docker to platforma do tworzenia, wdrażania i uruchamiania aplikacji w kontenerach.

## Co to są kontenery?

Kontenery to lekkie, przenośne środowiska wykonawcze.

![Diagram architektury Docker](/assets/images/posts/docker-architektura.jpg)

## Instalacja

Zainstaluj Docker ze strony oficjalnej.

![Ekran instalacji Docker Desktop](/assets/images/posts/docker-instalacja.png "Docker Desktop na macOS")

## Podstawowe komendy

```bash
docker --version
docker run hello-world
```

Poniżej zrzut ekranu z terminala:

![Wynik komendy docker run](/assets/images/posts/docker-terminal.png)

## Podsumowanie

Docker ułatwia zarządzanie środowiskami deweloperskimi.
```

---

### 2. Obrazek wyróżniający (featured image)

Aby dodać obrazek wyświetlany na liście artykułów, użyj front matter:

```markdown
---
title: Mój artykuł
description: Opis artykułu
date: 2026-03-30
tags:
  - tutorial
image: /assets/images/posts/featured.jpg
---
```

Następnie zmodyfikuj szablon `src/_includes/layouts/post.njk` aby wyświetlać ten obrazek.

---

### 3. Galeria zdjęć

Aby stworzyć prostą galerię, użyj HTML wewnątrz Markdown:

```markdown
## Galeria projektu

<div class="gallery">

![Zdjęcie 1](/assets/images/posts/projekt-1.jpg)
![Zdjęcie 2](/assets/images/posts/projekt-2.jpg)
![Zdjęcie 3](/assets/images/posts/projekt-3.jpg)

</div>
```

I dodaj do CSS (`src/assets/css/main.css`):

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.gallery img {
  border-radius: 12px;
  width: 100%;
  height: 200px;
  object-fit: cover;
}
```

---

## Formaty plików

| Format | Kiedy używać | Uwagi |
|--------|--------------|-------|
| **WebP** | Zawsze gdy możliwe | Najlepsza kompresja, wspiera przezroczystość |
| **JPG/JPEG** | Zdjęcia, obrazy z wieloma kolorami | Dobry stosunek jakości do rozmiaru |
| **PNG** | Zrzuty ekranu, grafiki z przezroczystością | Większy rozmiar, ale bezstratny |
| **SVG** | Ikony, loga, proste grafiki | Wektor - skaluje się nieskończenie |
| **GIF** | Proste animacje | Unikaj - duży rozmiar, ograniczona paleta |

---

## Optymalizacja obrazków

### Przed dodaniem obrazka:

#### 1. Zmień rozmiar
Maksymalna szerokość: **1200px** (strona ma max 1200px szerokości)

**Przy użyciu ImageMagick:**
```bash
convert duze-zdjecie.jpg -resize 1200x -quality 85 mniejsze-zdjecie.jpg
```

**Przy użyciu ffmpeg:**
```bash
ffmpeg -i input.png -vf "scale=1200:-1" -q:v 2 output.jpg
```

#### 2. Skonwertuj do WebP
```bash
# Używając cwebp (z pakietu libwebp)
cwebp -q 85 zdjecie.jpg -o zdjecie.webp

# Batch konwersja wszystkich JPG
for file in *.jpg; do cwebp -q 85 "$file" -o "${file%.jpg}.webp"; done
```

#### 3. Online tools (bez instalacji)
- [Squoosh.app](https://squoosh.app/) - najlepszy, porównuje jakość
- [TinyPNG](https://tinypng.com/) - prosty, automatyczny
- [ImageOptim](https://imageoptim.com/mac) - dla macOS

### Automatyczna optymalizacja (opcjonalnie)

Możesz dodać skrypt do `package.json`:

```json
{
  "scripts": {
    "optimize-images": "npx @squoosh/cli --webp '{quality:85}' 'src/assets/images/posts/*.{jpg,png}'"
  }
}
```

---

## Zalecane rozmiary

| Typ obrazka | Szerokość | Wysokość | Format | Max rozmiar |
|-------------|-----------|----------|--------|-------------|
| Zdjęcie w treści | 1200px | dowolna | WebP | 200 KB |
| Zrzut ekranu | 1200px | dowolna | WebP/PNG | 300 KB |
| Ikona/mala grafika | 200px | 200px | SVG/PNG | 20 KB |
| Obrazek wyróżniający | 1200px | 630px (2:1) | WebP | 150 KB |

---

## Rozwiązywanie problemów

### Obrazek się nie wyświetla

**Sprawdź ścieżkę:**
```markdown
❌ /assets/images/post/zdjecie.jpg    (brak "s" w posts)
❌ assets/images/posts/zdjecie.jpg    (brak / na początku)
✅ /assets/images/posts/zdjecie.jpg
```

**Sprawdź czy plik istnieje:**
```bash
ls -la src/assets/images/posts/nazwa-pliku.jpg
```

**Sprawdź wielkość liter:**
```markdown
❌ /assets/images/posts/Zdjecie.jpg
✅ /assets/images/posts/zdjecie.jpg
```

### Obrazek jest za duży / wolno się ładuje
- Zmniejsz rozmiar do max 1200px szerokości
- Skonwertuj do WebP
- Zmniejsz jakość do 80-85%

### Obrazek jest rozmyty
- Nie powiększaj małych obrazków
- Użyj oryginału w wyższej rozdzielczości
- Sprawdź czy nie masz włączonego `object-fit: cover` jeśli nie chcesz przycinać

### Brak przezroczystości
- JPG nie wspiera przezroczystości
- Użyj PNG lub WebP z kanałem alpha

---

## Przykładowa struktura folderu

```
src/assets/images/
├── favicon.svg              # Ikona strony
├── posts/                   # Obrazki do artykułów
│   ├── docker-architektura.webp
│   ├── docker-instalacja.png
│   ├── javascript-promise.webp
│   ├── typescript-generics.png
│   └── ...
└── ...
```

---

## Dodawanie obrazka - checklista

- [ ] Obrazek ma opisową nazwę (bez polskich znaków, małe litery)
- [ ] Rozmiar nie przekracza 1200px szerokości
- [ ] Format to WebP/JPG/PNG (nie GIF)
- [ ] Rozmiar pliku poniżej 500 KB
- [ ] Dodano opis alt dla dostępności
- [ ] Obrazek jest zoptymalizowany
- [ ] Sprawdziłem czy obrazek wyświetla się lokalnie (`npm run serve`)
- [ ] Obrazek jest dodany do commita (`git add`)
