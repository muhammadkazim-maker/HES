/**
 * School Discipline Tracker - Service Worker (v3.0 Multi-User Collaborative)
 * Enables 100% offline functionality, caching static assets with Network-First strategy
 * for navigation to ensure live updates sync seamlessly.
 */

const CACHE_NAME = 'hes-discipline-v3.0-multi';
const ASSETS_TO_CACHE = [
  './discipline.html',
  './discipline-manifest.json',
  './assets/css/discipline.css?v=multi2',
  './assets/js/firebase-config.js?v=multi2',
  './assets/js/discipline-auth.js?v=multi2',
  './assets/js/discipline-app.js?v=multi2',
  './assets/images/logo.png',
  './assets/images/hadi-education-logo.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching offline discipline tracker assets v3.0');
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
  const url = new URL(event.request.url);

  // Network-first for HTML navigation requests to always receive live collaborative updates
  if (event.request.mode === 'navigate' || url.pathname.endsWith('discipline.html')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => caches.match('./discipline.html'))
    );
    return;
  }

  // Cache-first, network fallback for static images, css, and scripts
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (event.request.url.startsWith('http') || event.request.url.includes('fonts.googleapis'))
        ) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      });
    })
  );
});
