const CACHE_NAME = "bcu-cache-v1";
const urlsToCache = [
  "/",              // root
  "/index.html",    // your main page
  "/manifest.json", // if you keep a separate manifest
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// Install event - cache app shell
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event - cleanup old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // serve from cache or fetch from network
      return response || fetch(event.request);
    })
  );
});