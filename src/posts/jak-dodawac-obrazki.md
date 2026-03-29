---
title: Jak dodawać obrazki do artykułów - przykład
description: Praktyczny przykład użycia obrazków w artykułach na blogu. Zobacz jak to działa!
date: 2026-03-29
tags:
  - tutorial
  - 11ty
  - obrazki
---

# Jak dodawać obrazki do artykułów - przykład

Ten artykuł pokazuje jak używać obrazków w treści wpisów. Jest to przykład praktyczny - zobacz źródło tego pliku aby zobaczyć składnię.

## Podstawowa składnia

Aby dodać obrazek, użyj następującej składni Markdown:

```markdown
![Opis obrazka](/assets/images/posts/nazwa-pliku.jpg)
```

## Ważne zasady

### 1. Lokalizacja obrazków

Wszystkie obrazki do artykułów wrzucamy do folderu:

```
src/assets/images/posts/
```

### 2. Formaty plików

| Format | Kiedy używać |
|--------|--------------|
| **WebP** | Najlepszy - używaj zawsze gdy możliwe |
| **JPG** | Zdjęcia, obrazy z wieloma kolorami |
| **PNG** | Zrzuty ekranu, grafiki z przezroczystością |
| **SVG** | Ikony, loga, proste grafiki wektorowe |

### 3. Optymalizacja

Przed dodaniem obrazka:
- Zmień rozmiar do **max 1200px** szerokości
- Skonwertuj do WebP jeśli to możliwe
- Upewnij się, że plik ma **poniżej 500 KB**

## Przykłady użycia

### Obrazek z tytułem (tooltip)

```markdown
![Ekran startowy](url "Tytuł pojawiający się po najechaniu")
```

### Obrazek jako link

```markdown
[![Miniaturka](url-miniatury)](url-pełnego-obrazka)
```

## Placeholdery (tymczasowe obrazki)

Jeśli nie masz jeszcze własnych obrazków, możesz użyć placeholderów:

**via.placeholder.com:**
```markdown
![Przykładowy obrazek](https://via.placeholder.com/800x400/6366f1/ffffff?text=Przykładowy+obrazek)
```

**picsum.photos (losowe zdjęcia):**
```markdown
![Losowe zdjęcie](https://picsum.photos/800/400)
```

**placehold.co (z tekstem):**
```markdown
![Obrazek z tekstem](https://placehold.co/600x400/1a1a1e/818cf8?text=Twój+tekst)
```

## SVG jako obrazki

Możesz też tworzyć proste diagramy w SVG:

```markdown
![Diagram](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWE0MDJlIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzgxOGNmOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByenkaxhhxWRvd3kgU1ZHPC90ZXh0Pgo8L3N2Zz4=)
```

## Galeria

Aby stworzyć galerię, użyj HTML wewnątrz Markdown:

```markdown
<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">

![Obrazek 1](url1)
![Obrazek 2](url2)

</div>
```

## Checklista przed publikacją

- [ ] Obrazek ma opisową nazwę pliku
- [ ] Obrazek jest zoptymalizowany (rozmiar, format)
- [ ] Dodano tekst alt (`![alt text]`) dla dostępności
- [ ] Ścieżka jest poprawna (`/assets/images/posts/`)
- [ ] Obrazek wyświetla się poprawnie lokalnie
- [ ] Obrazek jest dodany do git (`git add`)

## Więcej informacji

Pełną dokumentację znajdziesz w pliku: [docs/JAK-DODAC-OBRAZKI.md](https://github.com/dkoryto/koryto_net/blob/main/docs/JAK-DODAC-OBRAZKI.md)

---

**Podsumowanie:**
1. Wrzuć obrazek do `src/assets/images/posts/`
2. Użyj `![opis](/assets/images/posts/nazwa.jpg)` w artykule
3. Zoptymalizuj przed dodaniem
4. Zrób commit i push

To wszystko! 🎉
