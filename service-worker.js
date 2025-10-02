const CACHE_NAME = 'bcu-cache-v1';
const urlsToCache = [
  '/blackcabunite/',
  '/blackcabunite/index.html',
  '/blackcabunite/manifest.json',
  '/blackcabunite/icon-192.png',
  '/blackcabunite/icon-512.png'
];

// Install: cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
    ))
  );
});

// Fetch: cache-first strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchResponse => {
        if(fetchResponse.ok) {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, fetchResponse.clone()));
        }
        return fetchResponse;
      });
    }).catch(() => {
      if(event.request.mode === 'navigate') {
        return caches.match('/blackcabunite/index.html');
      }
    })
  );
});
