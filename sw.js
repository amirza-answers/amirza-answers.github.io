// sw.js

// Cache version — bump this on every change so clients update
const CACHE_NAME = 'amirza-cache-v2';

// Files to precache
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/words",
  "/dist/assets/css/styles.css",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/manifest.json",
  "/site.webmanifest",
  "/icons/favicon-32x32.png",
  "/icons/favicon-16x16.png",
  "/icons/apple-touch-icon.png",
  "/icons/android-chrome-192x192.png",
  // Add more static assets if needed
];

// Install: open the cache and store all ASSETS
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async cache => {
        for (const url of ASSETS) {
          try {
            await cache.add(url);
          } catch (err) {
            console.warn('Failed to cache', url, err);
          }
        }
      })
      .then(() => self.skipWaiting())
  );
});

// Activate: delete old caches
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

// Fetch: 
//  - For navigation (i.e. URL bar or link clicks), try network first; if it fails, serve cached index.html
//  - For other requests, try cache-first, then network
self.addEventListener('fetch', event => {
  const req = event.request;

  // Only handle GET requests
  if (req.method !== 'GET') return;

  // Navigation request?
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          // Optionally update the cached index.html in background
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put('/index.html', copy));
          return res;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Non-navigation: try cache first
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) {
        return cached;
      }
      return fetch(req).then(networkRes => {
        // Optionally cache new resources:
        // caches.open(CACHE_NAME).then(cache => cache.put(req, networkRes.clone()));
        return networkRes;
      });
    })
  );
});
