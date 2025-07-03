// Name of the cache storage
const CACHE_NAME = 'amirza-cache-v1';

// URL to serve when offline
const OFFLINE_URL = '/offline.html';

// List of assets to pre-cache
const ASSETS = [
  '/',                         
  '/index.html',
  '/offline.html',
  '/tailwindcss.js',
  '/styles.css',               // your CSS file, if any
  '/icons/favicon-16x16.png',
  '/icons/favicon-32x32.png',
  '/icons/apple-touch-icon.png',
  '/icons/android-chrome-192x192.png',
  '/icons/android-chrome-512x512.png'
];

// Install event: open cache and add each asset one by one,
// logging a warning if any individual asset fails to cache.
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

// Activate event: delete any old caches that don't match current CACHE_NAME
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

// Fetch event: handle navigation requests and static asset requests
self.addEventListener('fetch', event => {
  const request = event.request;

  // If it's a navigation request, try network first, fallback to offline page
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // For other requests, try cache first, then network
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request)
          .then(networkResponse => {
            // Optionally, you can cache new requests here:
            // caches.open(CACHE_NAME).then(cache => {
            //   cache.put(request, networkResponse.clone());
            // });
            return networkResponse;
          });
      })
      .catch(err => {
        console.error('Fetch failed:', err);
        // You could return a generic fallback here if you want
      })
  );
});
