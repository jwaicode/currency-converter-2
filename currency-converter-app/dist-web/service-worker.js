// Versioned cache names
const STATIC_CACHE = 'static-v2';
const RUNTIME_CACHE = 'runtime-v2';

// Resources that are part of the application shell
const PRECACHE_FILES = [
  '/',                 // index.html
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/currencies.json',        // required by tests & app
  '/assets/currencies.json'  // actual asset location used by the app
];

// INSTALL ────────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  console.log('[SW] Install');
  self.skipWaiting(); // Activate this SW immediately
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(PRECACHE_FILES))
  );
});

// ACTIVATE ───────────────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  console.log('[SW] Activate');
  const currentCaches = [STATIC_CACHE, RUNTIME_CACHE];
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => !currentCaches.includes(key))
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// UTIL: fetch from network & add a copy to runtime cache
async function fetchAndCache(request) {
  const response = await fetch(request);

  // Only cache successful same-origin GET responses
  if (
    response &&
    response.status === 200 &&
    request.method === 'GET' &&
    request.url.startsWith(self.location.origin)
  ) {
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, response.clone());
  }

  return response;
}

// FETCH ──────────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;

  // We only care about GET requests
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // Cache-first strategy for known precached assets
  if (url.origin === self.location.origin && PRECACHE_FILES.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then(
        cached => cached || fetchAndCache(request)
      )
    );
    return;
  }

  // Network-first strategy for everything else (JS bundles, API calls, navigation)
  event.respondWith(
    fetchAndCache(request).catch(() =>
      caches.match(request).then(cached => {
        if (cached) {
          return cached; // serve stale response
        }

        // For navigation requests, fall back to cached index.html
        if (request.mode === 'navigate') {
          return caches.match('/index.html');
        }

        // Generic offline response
        return new Response('Offline. Unable to fetch the requested resource.', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
    )
  );
});