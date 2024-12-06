const CACHE = "%DEPLOY_HASH%";

const PRECACHE = [
  "/assets/fonts/komika-title.woff2?v=%DEPLOY_HASH%",
  "/assets/fonts/raleway-variable.woff2?v=%DEPLOY_HASH%",
  "/assets/fonts/comic-neue-bold-italic.woff2?v=%DEPLOY_HASH%",
  "/assets/images/dbushell-for-hire.svg?v=%DEPLOY_HASH%",
  "/assets/images/dbushell-logotype.svg?v=%DEPLOY_HASH%",
  "/assets/scripts/head.js?v=%DEPLOY_HASH%",
  "/assets/scripts/contact.js?v=%DEPLOY_HASH%",
];

self.addEventListener("install", (ev) => {
  self.skipWaiting();
  ev.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
});

self.addEventListener("activate", (ev) => {
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

const handleFetch = async (ev) => {
  // Try cache first
  const cache = await caches.open(CACHE);
  let response = await cache.match(ev.request);
  if (response?.headers.has("x-sw-cache")) {
    const date = new Date(response.headers.get("x-sw-cache") ?? 0);
    const age = Date.now() - date.getTime();
    if (age < 1000 * 60 * 60 * 24) {
      return response;
    }
  }
  // Try fetch and cache
  response = await fetch(ev.request);
  if (!response.ok || response.status !== 200 || response.type !== "basic") {
    return response;
  }
  const copy = response.clone();
  const { status, statusText } = copy;
  const headers = new Headers(copy.headers);
  headers.set("x-sw-cache", new Date().toISOString());
  await cache.put(
    ev.request,
    new Response(await copy.arrayBuffer(), {
      status,
      statusText,
      headers,
    }),
  );
  return response;
};

self.addEventListener("fetch", (ev) => {
  if (ev.request.method !== "GET") {
    return;
  }
  const url = new URL(ev.request.url);
  let cachable = false;
  if (PRECACHE.includes(url.pathname)) {
    cachable = true;
  }
  if (url.searchParams.get("v") === "%DEPLOY_HASH%") {
    cachable = true;
  }
  if (url.pathname.startsWith("/images/")) {
    cachable = true;
  }
  if (!cachable) {
    return;
  }
  ev.respondWith(handleFetch(ev));
});
