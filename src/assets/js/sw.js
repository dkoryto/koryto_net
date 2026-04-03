// Service Worker dla koryto.net
// Strategia: Cache First dla statycznych zasobów, Network First dla HTML

const CACHE_VERSION = 'v1';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const PAGES_CACHE = `pages-${CACHE_VERSION}`;
const IMAGES_CACHE = `images-${CACHE_VERSION}`;

// Zasoby do pre-caching (krytyczne dla pierwszego ładowania)
const PRECACHE_ASSETS = [
  '/',
  '/blog/',
  '/o-mnie/',
  '/assets/css/main.css',
  '/assets/css/fonts.css',
  '/assets/fonts/inter-latin-400-normal.woff2',
  '/assets/fonts/inter-latin-500-normal.woff2',
  '/assets/fonts/inter-latin-600-normal.woff2',
  '/assets/fonts/inter-latin-700-normal.woff2',
  '/assets/js/search.js',
  '/assets/js/main.js',
  '/assets/images/favicon.svg'
];

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

  // Strategia dla obrazków: Cache First, potem network z aktualizacją cache
  if (isImage(request)) {
    event.respondWith(
      caches.open(IMAGES_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        
        if (cached) {
          // W tle odśwież z cache (stale-while-revalidate)
          fetch(request).then((response) => {
            if (response.ok) {
              cache.put(request, response.clone());
            }
          }).catch(() => {});
          
          return cached;
        }
        
        // Jeśli nie ma w cache, pobierz i zapisz
        const response = await fetch(request);
        if (response.ok) {
          cache.put(request, response.clone());
        }
        return response;
      })
    );
    return;
  }

  // Strategia dla statycznych zasobów (CSS, JS, fonty): Cache First
  if (isStaticAsset(request)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        
        if (cached) {
          // W tle sprawdź czy nie ma nowszej wersji
          fetch(request).then((response) => {
            if (response.ok) {
              cache.put(request, response.clone());
            }
          }).catch(() => {});
          
          return cached;
        }
        
        const response = await fetch(request);
        if (response.ok) {
          cache.put(request, response.clone());
        }
        return response;
      })
    );
    return;
  }

  // Strategia dla stron HTML: Network First z fallbackiem do cache
  if (isPage(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Zapisz w cache dla offline
          const clone = response.clone();
          caches.open(PAGES_CACHE).then((cache) => {
            cache.put(request, clone);
          });
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) {
            return cached;
          }
          // Fallback dla offline - strona główna
          if (request.mode === 'navigate') {
            return caches.match('/');
          }
          throw new Error('Network error and no cache');
        })
    );
    return;
  }

  // Domyślnie: sprawdź cache, potem network
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
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
