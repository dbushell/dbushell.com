const CACHE = '%DEPLOY_HASH%';

const PRECACHE = [
  '/assets/fonts/komika-title.woff2',
  '/assets/fonts/raleway-variable.woff2',
  '/assets/fonts/comic-neue-bold-italic.woff2',
  '/assets/images/dbushell-logotype.svg?v=%DEPLOY_HASH%',
  '/',
  '/now/',
  '/about/',
  '/blog/',
  '/contact/',
  '/services/'
];

self.addEventListener('install', (ev) => {
  self.skipWaiting();
  ev.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
});

self.addEventListener('activate', (ev) => {
  ev.waitUntil(self.clients.claim());
  const clearCaches = async () => {
    for (const key of await caches.keys()) {
      if (key !== CACHE) {
        await caches.delete(key);
      }
    }
  };
  ev.waitUntil(clearCaches());
});

self.addEventListener('fetch', async (ev) => {
  if (ev.request.method !== 'GET') {
    return;
  }
  const url = new URL(ev.request.url);
  let cachable = false;
  if (PRECACHE.includes(url.pathname)) {
    cachable = true;
  }
  if (url.pathname.startsWith('/assets/')) {
    cachable = true;
  }
  if (url.pathname.startsWith('/images/')) {
    cachable = true;
  }
  if (!cachable) {
    return;
  }
  // Try cache first
  const cache = await caches.open(CACHE);
  let response = await cache.match(ev.request);
  if (response) {
    ev.respondWith(response);
    return;
  }
  // Try fetch and cache
  response = await fetch(ev.request);
  if (!response.ok || response.status !== 200 || response.type !== 'basic') {
    ev.respondWith(response);
    return;
  }
  await cache.put(ev.request, response.clone());
  ev.respondWith(response);
});
