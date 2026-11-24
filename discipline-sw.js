/**
 * School Discipline Tracker - Service Worker (v8 Fast Performance Engine)
 * High-performance Stale-While-Revalidate caching for 0ms instant launch & offline resilience.
 */

const CACHE_NAME = 'discipline-tracker-v11-supersmooth';
const ASSETS_TO_CACHE = [
  './index.html',
  './discipline.html',
  './issues.html',
  './manifest.json',
  './discipline-manifest.json',
  './assets/css/discipline.css',
  './assets/js/firebase-config.js',
  './assets/js/discipline-auth.js',
  './assets/js/discipline-app.js',
  './assets/images/logo.png',
  './assets/images/hadi-education-logo.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('[SW] Pre-cache partial warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
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

self.addEventListener('fetch', (event) => {
  // Only process GET requests from http/https
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (!url.protocol.startsWith('http')) return;

  // For HTML navigations, prefer fresh network first with fast fallback
  if (event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname === '') {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request) || caches.match('./discipline.html'))
    );
    return;
  }

  // Stale-While-Revalidate: Instant response from cache + background refresh for assets
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => null);

      return cachedResponse || fetchPromise.then(res => res || caches.match('./index.html', { ignoreSearch: true }));
    })
  );
});
