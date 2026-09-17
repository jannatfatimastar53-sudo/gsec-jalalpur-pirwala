const CACHE_NAME = 'gsec-jalalpur-v5';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
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

// Network-first strategy to always show the freshest version
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
