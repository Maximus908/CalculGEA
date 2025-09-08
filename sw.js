// sw.js v8 — CalculGEA — AERYSGIN
const CACHE = 'calculgea-v8';
const BASE = '/CalculGEA';
const ASSETS = [
  `${BASE}/`,
  `${BASE}/index.html`,
  `${BASE}/manifest.webmanifest`,
  `${BASE}/apple-touch-icon.png`
];

// Installation : mise en cache des assets
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

// Activation : suppression des anciens caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
