const CACHE_NAME = "bcu-cache-v1";
const urlsToCache = [
  "/blackcabunite/",
  "/blackcabunite/index.html",
  "/blackcabunite/manifest.json",
  "/blackcabunite/icon-192.png",
  "/blackcabunite/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

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

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request).then(fetchResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          if (fetchResponse.url.startsWith(location.origin) || fetchResponse.url.includes("unpkg.com")) {
            cache.put(event.request, fetchResponse.clone());
          }
          return fetchResponse;
        });
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match("/blackcabunite/index.html");
        }
      });
    })
  );
});
