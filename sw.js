// sw.js v17 — CalculGEA — AERYSGIN
const CACHE = 'calculgea-v17';
const BASE = '/CalculGEA';
const PRECACHE = [
  `${BASE}/`,
  `${BASE}/index.html`,
  `${BASE}/manifest.webmanifest`,
  `${BASE}/apple-touch-icon.png`,
  // Ajoute ici icon-192.png / icon-512.png si présents
];

// Install: pré-cache
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)));
  self.skipWaiting();
});

// Activate: purge anciens caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache d’abord pour assets, réseau d’abord pour index.html
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  // Stratégie réseau-d'abord pour la page principale
  if (url.pathname === `${BASE}/` || url.pathname === `${BASE}/index.html`) {
    e.respondWith(
      fetch(e.request).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return resp;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // Le reste: cache-d'abord, sinon réseau
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
