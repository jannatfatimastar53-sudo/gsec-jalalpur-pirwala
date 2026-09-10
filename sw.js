const CACHE_NAME = 'gsec-jalalpur-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './assets/images/logo.svg',
  './assets/images/school-building-front.jpg',
  './assets/images/principal-office-session.jpg',
  './assets/images/school-bus-grounds.jpg',
  './assets/images/school-entrance-gate.jpg',
  './assets/images/campus-courtyard-palms.jpg',
  './assets/images/classroom-interactive.jpg',
  './assets/images/therapy-session.jpg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
