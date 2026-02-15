// TitanEAM Service Worker v2.0.0
// IMPORTANT: Bump version on every deploy to invalidate old caches
const CACHE_VERSION = 'v2';
const CACHE_NAME = `titan-eam-${CACHE_VERSION}`;

// Install: immediately activate (skip waiting)
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// Activate: delete ALL old caches to prevent stale content
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch: Network-first for everything to prevent white screens
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Navigation requests (HTML pages): Always network-first
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Cache a fresh copy
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                    return response;
                })
                .catch(() => {
                    // Offline fallback: serve cached index.html
                    return caches.match('/index.html');
                })
        );
        return;
    }

    // All other requests: Network-first with cache fallback
    event.respondWith(
        fetch(request)
            .then((response) => {
                // Only cache successful responses
                if (response && response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                }
                return response;
            })
            .catch(() => {
                return caches.match(request);
            })
    );
});
