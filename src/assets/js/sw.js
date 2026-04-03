// Service Worker dla koryto.net
// Strategia: Cache First dla statycznych zasobów, Network First dla HTML
// Cache TTL: 8 godzin

const CACHE_VERSION = 'v2';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const PAGES_CACHE = `pages-${CACHE_VERSION}`;
const IMAGES_CACHE = `images-${CACHE_VERSION}`;

// Czas życia cache w milisekundach (8 godzin)
const CACHE_MAX_AGE = 8 * 60 * 60 * 1000; // 28,800,000 ms

// Zasoby do pre-caching (krytyczne dla pierwszego ładowania)
const PRECACHE_ASSETS = [
  '/',
  '/blog/',
  '/o-mnie/',
  '/assets/css/main.css',
  '/assets/fonts/inter-latin-400-normal.woff2',
  '/assets/fonts/inter-latin-500-normal.woff2',
  '/assets/fonts/inter-latin-600-normal.woff2',
  '/assets/fonts/inter-latin-700-normal.woff2',
  '/assets/js/search.js',
  '/assets/js/main.js',
  '/assets/images/favicon.svg'
];

// Pomocnicza funkcja: sprawdź czy cache wygasł
function isCacheExpired(cachedResponse) {
  if (!cachedResponse) return true;
  
  const cachedTime = cachedResponse.headers.get('sw-cached-time');
  if (!cachedTime) return true;
  
  const age = Date.now() - parseInt(cachedTime, 10);
  return age > CACHE_MAX_AGE;
}

// Pomocnicza funkcja: dodaj timestamp do odpowiedzi
function addCacheTimestamp(response) {
  const headers = new Headers(response.headers);
  headers.set('sw-cached-time', Date.now().toString());
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers
  });
}

// Instalacja - pre-cache krytycznych zasobów
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Aktywacja - czyszczenie starych cache'y
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => !name.includes(CACHE_VERSION))
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Pomocnicza funkcja: czy żądanie to obrazek
function isImage(request) {
  return request.destination === 'image' || 
         /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(request.url);
}

// Pomocnicza funkcja: czy żądanie to strona HTML
function isPage(request) {
  return request.mode === 'navigate' || 
         (request.headers.get('accept') && 
          request.headers.get('accept').includes('text/html'));
}

// Pomocnicza funkcja: czy żądanie to statyczny zasób (CSS, JS, font)
function isStaticAsset(request) {
  return request.destination === 'style' || 
         request.destination === 'script' ||
         request.destination === 'font' ||
         /\.(css|js|woff2?|ttf|otf)$/i.test(request.url);
}

// Fetch - strategie cache'owania
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Pomiń żądania do zewnętrznych domen (np. Google Fonts, analytics)
  if (url.origin !== self.location.origin) {
    return;
  }

  // Pomiukaj API i dynamiczne endpointy
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/search.json')) {
    return;
  }

  // Strategia dla obrazków: Cache First z weryfikacją wieku (max 8h)
  if (isImage(request)) {
    event.respondWith(
      caches.open(IMAGES_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        
        // Jeśli cache istnieje i nie wygasł - użyj go
        if (cached && !isCacheExpired(cached)) {
          // W tle odśwież (stale-while-revalidate)
          fetch(request).then((response) => {
            if (response.ok) {
              cache.put(request, addCacheTimestamp(response.clone()));
            }
          }).catch(() => {});
          
          return cached;
        }
        
        // Cache wygasł lub nie istnieje - pobierz z sieci
        try {
          const response = await fetch(request);
          if (response.ok) {
            cache.put(request, addCacheTimestamp(response.clone()));
          }
          return response;
        } catch (error) {
          // Brak sieci - zwróć wygasły cache jako fallback
          if (cached) return cached;
          throw error;
        }
      })
    );
    return;
  }

  // Strategia dla statycznych zasobów (CSS, JS, fonty): Cache First z TTL
  if (isStaticAsset(request)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        
        // Jeśli cache istnieje i nie wygasł - użyj go
        if (cached && !isCacheExpired(cached)) {
          // W tle sprawdź czy nie ma nowszej wersji
          fetch(request).then((response) => {
            if (response.ok) {
              cache.put(request, addCacheTimestamp(response.clone()));
            }
          }).catch(() => {});
          
          return cached;
        }
        
        // Cache wygasł lub nie istnieje - pobierz z sieci
        try {
          const response = await fetch(request);
          if (response.ok) {
            cache.put(request, addCacheTimestamp(response.clone()));
          }
          return response;
        } catch (error) {
          // Brak sieci - zwróć wygasły cache jako fallback
          if (cached) return cached;
          throw error;
        }
      })
    );
    return;
  }

  // Strategia dla stron HTML: Network First z cache TTL
  if (isPage(request)) {
    event.respondWith(
      caches.open(PAGES_CACHE).then(async (cache) => {
        try {
          // Najpierw spróbuj pobrać z sieci
          const networkResponse = await fetch(request);
          
          if (networkResponse.ok) {
            // Zapisz w cache z timestamp
            cache.put(request, addCacheTimestamp(networkResponse.clone()));
            return networkResponse;
          }
          
          throw new Error('Network response not ok');
        } catch (error) {
          // Sieć niedostępna - spróbuj cache
          const cached = await cache.match(request);
          
          if (cached) {
            // Zwróć cache nawet jeśli wygasł (lepsze niż błąd)
            return cached;
          }
          
          // Fallback dla offline - strona główna
          if (request.mode === 'navigate') {
            const homeCache = await cache.match('/');
            if (homeCache) return homeCache;
          }
          
          throw error;
        }
      })
    );
    return;
  }

  // Domyślnie: sprawdź cache, potem network
  event.respondWith(
    caches.match(request).then(async (cached) => {
      if (cached && !isCacheExpired(cached)) {
        return cached;
      }
      return fetch(request);
    })
  );
});

// Odbieraj komunikaty od klientów (np. "skipWaiting")
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
