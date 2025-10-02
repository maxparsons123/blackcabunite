const CACHE_NAME = "bcu-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

// Install - cache app shell
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activate - clean old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(
        names.filter(name => name !== CACHE_NAME)
             .map(name => caches.delete(name))
      )
    )
  );
});

// Fetch - serve from cache first, then network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request).then(fetchResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          // Cache only same-origin requests
          if (fetchResponse.url.startsWith(location.origin)) {
            cache.put(event.request, fetchResponse.clone());
          }
          return fetchResponse;
        });
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match("/index.html");
        }
      });
    })
  );
});
