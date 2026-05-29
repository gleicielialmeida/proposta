const CACHE_NAME = 'campello-proposta-v4';
const ASSETS = [
  '/proposta/',
  '/proposta/index.html',
  '/proposta/manifest.json',
  '/proposta/icon-192.png',
  '/proposta/icon-512.png',
  '/proposta/07-lockup-horizontal-sobre-branco.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      return cached || fetch(event.request).catch(function() {
        if (event.request.destination === 'document') {
          return caches.match('/proposta/index.html');
        }
      });
    })
  );
});
