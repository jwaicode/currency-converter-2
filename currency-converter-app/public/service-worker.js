const PRECACHE_FILES = [
  '/',                 // root → index.html
  '/index.html',
  '/manifest.json',
  '/currencies.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener("install", (event) => {
  console.log("Service Worker installed");

  // NEW: cache the essential files up-front
  event.waitUntil(
    caches.open('app-shell-v1').then((cache) => cache.addAll(PRECACHE_FILES))
  );
});

// NEW: try cache first, then network; fall back to generic error if both fail
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(
      (cached) => cached || fetch(event.request)
    ).catch(() => new Response(
        'Offline. Unable to fetch the requested resource.',
        { status: 503, statusText: 'Service Unavailable' }
      )
    )
  );
});