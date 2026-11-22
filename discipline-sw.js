/**
 * School Discipline Tracker - Service Worker (v3.0 Multi-User Collaborative)
 * Enables 100% offline functionality, caching static assets with Network-First strategy
 * for navigation to ensure live updates sync seamlessly.
 */

const CACHE_NAME = 'hes-discipline-v13-replica';
const ASSETS_TO_CACHE = [
  './discipline.html',
  './issues.html',
  './discipline-manifest.json',
  './assets/css/discipline.css?v=v13replica',
  './assets/js/firebase-config.js?v=v13replica',
  './assets/js/discipline-auth.js?v=v13replica',
  './assets/js/discipline-app.js?v=v13replica',
  './assets/images/logo.png',
  './assets/images/hadi-education-logo.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching offline discipline tracker assets v5');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Clearing old cache', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Network-First for everything when online to ensure fresh code
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request).then(res => res || caches.match('./discipline.html')))
  );
});
