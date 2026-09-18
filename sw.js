const CACHE_NAME = 'gsec-jalalpur-v7';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './404.html',
  './styles.css?v=3.2',
  './app.js?v=3.1',
  './manifest.json',
  './assets/images/logo.svg',
  './assets/images/school-building-front.jpg',
  './assets/images/school-bus-grounds.jpg',
  './assets/images/school-entrance-gate.jpg',
  './assets/images/campus-courtyard-palms.jpg',
  './assets/images/classroom-interactive.jpg',
  './assets/images/therapy-session.jpg'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network-first caching strategy with offline fallback
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // Clone and store fresh response
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => caches.match(e.request).then((cached) => cached || caches.match('./index.html')))
  );
});
