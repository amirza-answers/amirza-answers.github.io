const CACHE_NAME = "amirza-pwa-cache-v1";

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

// Install event: cache static files
self.addEventListener("install", event => {
  console.log("[Service Worker] Install");
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("[Service Worker] Caching app shell");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event: cleanup old caches
self.addEventListener("activate", event => {
  console.log("[Service Worker] Activate");
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event: serve from cache, fallback to index.html for navigation
self.addEventListener("fetch", event => {
  if (event.request.mode === "navigate") {
    // Always return index.html for navigations
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match("/index.html");
      })
    );
  } else {
    // For other requests, try cache first
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});
