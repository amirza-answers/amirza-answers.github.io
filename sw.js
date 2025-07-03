// sw.js

// 1. Cache version — bump this on every change so clients update
const CACHE_NAME = 'amirza-cache-v3';

// 2. Files to precache (including your /words endpoint)
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/words",                        // your word list endpoint
  "/dist/assets/css/styles.css",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/manifest.json",
  "/site.webmanifest",
  "/icons/favicon-32x32.png",
  "/icons/favicon-16x16.png",
  "/icons/apple-touch-icon.png",
  "/icons/android-chrome-192x192.png",
  "/icons/android-chrome-512x512.png"
];

// 3. Install: open the cache and store all FILES_TO_CACHE one-by-one
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async cache => {
        for (const url of FILES_TO_CACHE) {
          try {
            await cache.add(url);
          } catch (err) {
            console.warn('[ServiceWorker] Failed to cache', url, err);
          }
        }
      })
      .then(() => self.skipWaiting())
  );
});

// 4. Activate: delete any old caches that don’t match the current CACHE_NAME
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// 5. Fetch handler:
//    • Navigation requests → try network, fallback to cached /index.html
//    • Other GET requests   → cache-first, then network
self.addEventListener('fetch', event => {
  const req = event.request;

  // Only handle GET
  if (req.method !== 'GET') return;

  // If this is a navigation request, use network-first with index.html fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          // Update the cache in the background
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put('/index.html', copy));
          return res;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // For other requests, try cache first, then network
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) {
        return cached;
      }
      return fetch(req).then(networkRes => {
        // (Optional) Cache new resources on the fly:
        // caches.open(CACHE_NAME).then(cache => cache.put(req, networkRes.clone()));
        return networkRes;
      });
    })
  );
});
