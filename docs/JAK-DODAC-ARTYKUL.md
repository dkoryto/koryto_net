# Jak dodać nowy artykuł na blog

## Szybki start

1. Utwórz plik w folderze `src/posts/nazwa-artykulu.md`
2. Dodaj nagłówek YAML (front matter)
3. Napisz treść w Markdown
4. Zapisz i zrób push na GitHub

---

## Struktura pliku artykułu

```markdown
---
title: Tytuł Twojego artykułu
description: Krótki opis artykułu (2-3 zdania)
date: 2026-03-30
tags:
  - javascript
  - tutorial
---

# Nagłówek główny

Treść artykułu w formacie Markdown...

## Podtytuł

Więcej treści...
```

---

## Pola front matter

| Pole | Wymagane | Opis |
|------|----------|------|
| `title` | Tak | Tytuł artykułu |
| `description` | Tak | Opis wyświetlany na liście artykułów |
| `date` | Tak | Data publikacji (YYYY-MM-DD) |
| `tags` | Opcjonalnie | Lista tagów (kategorii) |

---

## Formatowanie treści (Markdown)

### Nagłówki
```markdown
# H1 - Tytuł główny (używaj tylko raz)
## H2 - Sekcje
### H3 - Podsekcje
#### H4 - Mniejsze podsekcje
```

### Tekst
```markdown
**pogrubienie**
*kursywa*
~~przekreślenie~~
`kod inline`
```

### Listy
```markdown
## Lista nieuporządkowana
- pierwszy element
- drugi element
- trzeci element

## Lista uporządkowana
1. pierwszy krok
2. drugi krok
3. trzeci krok

## Lista zadań (checkboxy)
- [x] Zadanie wykonane
- [ ] Zadanie do zrobienia
```

### Linki
```markdown
[tekst linku](https://example.com)
[link wewnętrzny](/blog/)
[link z tytułem](https://example.com "Tytuł tooltip")
```

### Bloki kodu

**Kod inline:**
```markdown
Użyj funkcji `console.log()` do debugowania.
```

**Blok kodu z podświetleniem składni:**
```markdown
```javascript
function hello() {
  console.log('Hello World!');
}
```
```

**Dostępne języki:** `javascript`, `typescript`, `python`, `html`, `css`, `bash`, `json`, `yaml`, `markdown`, `jsx`, `tsx`

### Cytaty
```markdown
> To jest cytat.
> Może mieć wiele linii.
>
> — Autor
```

### Tabele
```markdown
| Nagłówek 1 | Nagłówek 2 | Nagłówek 3 |
|------------|------------|------------|
| Komórka 1  | Komórka 2  | Komórka 3  |
| Komórka 4  | Komórka 5  | Komórka 6  |
```

### Linia pozioma
```markdown
---
```

---

## Przykładowy artykuł

```markdown
---
title: Jak używać async/await w JavaScript
description: Praktyczny przewodnik po asynchronicznym JavaScript z przykładami kodu
date: 2026-03-30
tags:
  - javascript
  - async
  - tutorial
---

# Jak używać async/await w JavaScript

Async/await to nowoczesny sposób na obsługę operacji asynchronicznych w JavaScript. W tym artykule pokażę Ci, jak go używać.

## Podstawy

 Słowo kluczowe `async` przed funkcją sprawia, że zwraca ona Promise:

```javascript
async function fetchData() {
  return "Dane załadowane";
}

// To samo co:
function fetchData() {
  return Promise.resolve("Dane załadowane");
}
```

## Użycie await

Słowo kluczowe `await` wstrzymuje wykonanie funkcji do momentu rozwiązania Promise:

```javascript
async function getUserData() {
  try {
    const response = await fetch('/api/user');
    const user = await response.json();
    console.log(user);
  } catch (error) {
    console.error('Błąd:', error);
  }
}
```

## Przykład praktyczny

Oto przykład pobierania danych z API:

```javascript
async function loadPosts() {
  try {
    const response = await fetch('https://api.example.com/posts');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('Nie udało się załadować postów:', error);
    return [];
  }
}
```

## Podsumowanie

Async/await sprawia, że kod asynchroniczny wygląda jak synchroniczny, co ułatwia jego czytanie i utrzymanie.

---

**Masz pytania?** Zostaw komentarz poniżej!
```

---

## Dodawanie artykułu - krok po kroku

### 1. Utwórz plik

```bash
# W katalogu projektu
touch src/posts/moj-nowy-artykul.md
```

### 2. Edytuj plik

Otwórz plik w edytorze (VS Code, Vim, itp.) i wypełnij treścią.

### 3. Sprawdź lokalnie

```bash
npm run serve
```

Otwórz http://localhost:8080/koryto_net/blog/ i sprawdź czy artykuł się wyświetla.

### 4. Dodaj do Git i wyślij

```bash
git add src/posts/moj-nowy-artykul.md
git commit -m "Dodano artykuł: Tytuł artykułu"
git push origin main
```

### 5. Poczekaj na deploy

GitHub Actions automatycznie zbuduje i opublikuje stronę (zajmuje to około 1-2 minuty).

---

## Dobre praktyki

### Nazewnictwo plików
- Używaj małych liter
- Zamiast spacji używaj myślników: `moj-artykul.md` ✅, `Moj Artykul.md` ❌
- Unikaj polskich znaków w nazwie pliku
- Bądź opisowy: `jak-uzywac-async-await.md` lepsze niż `js.md`

### Tytuły
- Maksymalnie 60 znaków
- Konkretny i opisowy
- Unikaj clickbaitów

### Opisy
- 1-3 zdania
- Podsumowują o czym jest artykuł
- Zachęcają do przeczytania

### Tagi
- Używaj małych liter
- Maksymalnie 3-5 tagów
- Bądź konsekwentny (np. zawsze `javascript`, nie `js`)
- Popularne tagi: `javascript`, `typescript`, `python`, `tutorial`, `tips`, `news`

### Treść
- Dziel na sekcje (używaj ## i ###)
- Używaj przykładów kodu
- Dodawaj obrazki (zobacz [JAK-DODAC-OBRAZKI.md](./JAK-DODAC-OBRAZKI.md))
- Sprawdzaj pisownię
- Testuj linki

---

## Rozwiązywanie problemów

### Artykuł się nie wyświetla
- Sprawdź format daty (YYYY-MM-DD)
- Upewnij się, że plik ma rozszerzenie `.md`
- Sprawdź czy front matter jest zamknięty w `---`

### Błędy w formatowaniu
- Upewnij się, że bloki kodu mają trzy backticki (```)
- Sprawdź wcięcia w listach
- Upewnij się, że nagłówki mają spację po `#`

### Nie działa podświetlanie składni
- Sprawdź czy podałeś właściwy język: ```javascript
- Sprawdź czy nie ma spacji przed nazwą języka
