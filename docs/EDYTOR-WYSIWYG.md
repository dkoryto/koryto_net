# Edytor WYSIWYG - Dokumentacja

Kompletny przewodnik po wbudowanym edytorze wpisów.

## Dostęp

Edytor dostępny pod adresem: `/edytor/`

**Uwaga:** Edytor jest ukryty w menu głównym (dostępny tylko bezpośrednio przez URL).

## Funkcjonalności

### 1. Podstawowe pola

| Pole | Wymagane | Opis |
|------|----------|------|
| Tytuł wpisu | Tak | Nagłówek H1, meta title |
| Data publikacji | Tak | Format YYYY-MM-DD |
| Tagi | Nie | Oddzielone przecinkami |
| Opis | Tak | Meta description, zajawka |

### 2. Obrazek wyróżniający

#### Upload lokalny
- Przeciągnij i upuść lub kliknij
- Akceptowane formaty: PNG, JPG, GIF, SVG
- Maksymalny rozmiar: 5MB
- Podgląd przed zapisaniem

#### URL zewnętrzny
- Wklej link do obrazka
- Automatycznie dodawane do frontmatter jako `image:`

### 3. Treść wpisu

Edytor Markdown z toolbar:
- **Pogrubienie** (Ctrl+B)
- **Kursywa** (Ctrl+I)
- **Nagłówki** (H1-H6)
- **Listy** (punktowane, numerowane)
- **Cytaty**
- **Linki** (Ctrl+K)
- **Obrazki**
- **Tabele**
- **Kod** (inline i bloki)
- **Podgląd** (Ctrl+P)
- **Pełny ekran**

### 4. Wstawianie obrazków do treści

#### Zakładka "Z komputera"
- Upload wielu plików jednocześnie
- Galeria przesłanych obrazków
- Kliknij obrazek aby wybrać
- Usuwanie zbędnych plików

#### Zakładka "Z URL"
- URL obrazka
- Tekst alternatywny (alt) - wymagane dla SEO
- Tytuł (title) - opcjonalny
- Szerokość (px) - opcjonalna
- Wyrównanie: lewo/środek/prawo

### 5. Eksport

#### Pobierz plik .md
Generuje pojedynczy plik Markdown z frontmatter.

#### Pobierz ZIP (.md + obrazki)
Generuje archiwum ZIP zawierające:
- `YYYY-MM-DD-tytul.md` - plik wpisu
- `images/` - folder z obrazkami
- `README.txt` - instrukcja instalacji

#### Kopiuj do schowka
Kopiuje zawartość Markdown do schowka.

### 6. Import

#### Wczytaj .md
Pozwala edytować istniejący wpis:
1. Wybierz plik .md
2. Pola formularza zostaną automatycznie wypełnione
3. Edytuj treść
4. Pobierz zaktualizowaną wersję

## Format wyjściowy

### Przykład generowanego Markdown

```markdown
---
title: Jak stworzyłem tego bloga z 11ty
description: Krok po kroku opis budowy statycznej strony z blogiem
date: 2026-03-28
tags:
  - 11ty
  - tutorial
image: /assets/images/moj-obrazek.jpg
---

![Obrazek wyróżniający](/assets/images/moj-obrazek.jpg)

Treść wpisu w **Markdown**...

## Nagłówek sekcji

Przykładowy kod:

```javascript
console.log('Hello 11ty!');
```

Więcej treści...
```

## Struktura ZIP

```
2026-03-28-jak-stworzylem-tego-bloga/
├── 2026-03-28-jak-stworzylem-tego-bloga.md
├── images/
│   ├── moj-obrazek.jpg
│   └── zrzut-ekranu.png
└── README.txt
```

## Instalacja wpisu z ZIP

### Krok 1: Wypakuj ZIP

### Krok 2: Skopiuj pliki

```bash
# Plik .md do folderu posts
cp 2026-03-28-tytul.md src/posts/

# Obrazki do folderu images
cp images/* src/assets/images/
```

### Krok 3: Zbuduj stronę

```bash
npm run build
```

### Krok 4: Wgraj na GitHub

```bash
git add .
git commit -m "Nowy wpis: Tytuł wpisu"
git push
```

## Skróty klawiszowe

| Skrót | Akcja |
|-------|-------|
| Ctrl+B | Pogrubienie |
| Ctrl+I | Kursywa |
| Ctrl+K | Link |
| Ctrl+P | Podgląd |
| F9 | Podgląd side-by-side |
| F11 | Pełny ekran |

## Walidacja

Edytor sprawdza:
- ✅ Wymagane pola (tytuł, data, opis, treść)
- ✅ Poprawność daty (format YYYY-MM-DD)
- ✅ Unikalność tagów
- ✅ Długość opisu (max 160 znaków dla SEO)

## Ograniczenia

1. **Brak automatycznego zapisu** - użyj "Kopiuj do schowka" jako backup
2. **Maksymalny rozmiar obrazków** - 5MB na plik
3. **Obsługiwane formaty** - PNG, JPG, GIF, SVG
4. **Brak integracji z API** - wymagane ręczne kopiowanie plików

## Rozwiązywanie problemów

### Problem: Obrazki nie wyświetlają się po wgraniu

**Rozwiązanie:**
Upewnij się, że obrazki są w `src/assets/images/` a nie tylko w ZIP.

### Problem: Złe formatowanie po wczytaniu .md

**Rozwiązanie:**
Sprawdź czy plik ma poprawny frontmatter (--- na początku).

### Problem: Tagi nie pojawiają się

**Rozwiązanie:**
Upewnij się, że tagi są oddzielone przecinkami bez spacji (lub ze spacjami - edytor je obsłuży).

## Technologie edytora

- **EasyMDE** - WYSIWYG edytor Markdown
- **JSZip** - Generowanie archiwów ZIP
- **FileReader API** - Upload obrazków
- **Clipboard API** - Kopiowanie do schowka
