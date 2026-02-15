// TitanEAM Service Worker - Self-destruct mode
// This SW immediately unregisters itself and clears all caches
// to fix white screen issues caused by stale cached content

self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((names) => {
            return Promise.all(
                names.map((name) => caches.delete(name))
            );
        }).then(() => {
            return self.registration.unregister();
        }).then(() => {
            return self.clients.matchAll();
        }).then((clients) => {
            clients.forEach((client) => client.navigate(client.url));
        })
    );
});

// Pass ALL requests directly to the network - no caching
self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
});
