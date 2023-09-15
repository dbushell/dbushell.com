const version = `{{version}}`;
const cacheName = `dbushell-${version}`;

const precache = [
  `/`,
  `/assets/fonts/komika-title.woff2`,
  `/assets/images/dbushell-logotype.svg?v=${version}`,
  `/assets/js/app.min.js?v=${version}`,
  '/about/',
  '/blog/',
  '/contact/',
  '/services/'
];

self.addEventListener('install', (ev) => {
  console.log(`install`);
  self.skipWaiting();
  ev.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(precache)));
});

self.addEventListener('activate', (ev) => {
  console.log(`activate`);
  ev.waitUntil(self.clients.claim());
  ev.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

const fromCache = (request) =>
  caches.open(cacheName).then((cache) => cache.match(request));

const updateCache = (request, response) =>
  caches.open(cacheName).then((cache) => cache.put(request, response));

const fetchAndCache = (ev) =>
  fetch(ev.request)
    .then((response) => {
      if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
      }
      ev.waitUntil(updateCache(ev.request, response.clone()));
      return response;
    })
    .catch((err) => {
      console.log(err);
    });

self.addEventListener('fetch', (ev) => {
  if (ev.request.method !== 'GET') {
    return;
  }
  const url = new URL(ev.request.url);
  if (/\.dev$/.test(url.hostname)) {
    return;
  }
  ev.respondWith(
    fromCache(ev.request).then((response) => {
      if (response) {
        console.log(`from cache: ${url.pathname}`);
        ev.waitUntil(fetchAndCache(ev));
        return response;
      }
      console.log(`from fetch: ${url.pathname}`);
      return fetchAndCache(ev);
    })
  );
});
