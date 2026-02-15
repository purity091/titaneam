// TitanEAM Service Worker v1.0.0
const CACHE_NAME = 'titan-eam-v1';
const RUNTIME_CACHE = 'titan-runtime-v1';

// Core assets to precache (app shell)
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/index.css',
    '/manifest.json'
];

// Install: precache core app shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(PRECACHE_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch: Network-first for navigation, Cache-first for static assets
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET and cross-origin requests (except fonts/CDN)
    if (request.method !== 'GET') return;

    // Navigation requests: Network first, fallback to cache (SPA routing)
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                    return response;
                })
                .catch(() => caches.match('/index.html'))
        );
        return;
    }

    // Static assets (JS, CSS, images, fonts): Cache first, network fallback
    if (
        url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot|ico)$/) ||
        url.hostname === 'fonts.googleapis.com' ||
        url.hostname === 'fonts.gstatic.com'
    ) {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached;
                return fetch(request).then((response) => {
                    if (response && response.status === 200) {
                        const clone = response.clone();
                        caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
                    }
                    return response;
                });
            })
        );
        return;
    }

    // CDN resources (Tailwind, esm.sh): Stale-while-revalidate
    if (
        url.hostname === 'cdn.tailwindcss.com' ||
        url.hostname === 'esm.sh'
    ) {
        event.respondWith(
            caches.match(request).then((cached) => {
                const fetchPromise = fetch(request).then((response) => {
                    if (response && response.status === 200) {
                        const clone = response.clone();
                        caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
                    }
                    return response;
                });
                return cached || fetchPromise;
            })
        );
        return;
    }

    // Default: network first
    event.respondWith(
        fetch(request).catch(() => caches.match(request))
    );
});
