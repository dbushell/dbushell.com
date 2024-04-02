---
date: 2024-04-02 10:00:00+00:00
slug: offscreen-canvas-and-web-workers
title: 'Offscreen Canvas and Web Workers'
description: 'The one where I generate PNGs on an off-screen canvas'
---

The `OffscreenCanvas` API is now supported in all modern browsers. Before I was using `canvas` to generate [media session thumbnails](/2023/03/20/ios-pwa-media-session-api/) for my [podcast player](https://github.com/dbushell/sauroPod/). Now I can take this code off-screen!

Out with the old:

```javascript
const canvas = document.createElement('canvas');
canvas.width = 512;
canvas.height = 512;
const context = canvas.getContext('2d');
```

In with the new:

```javascript
const canvas = new OffscreenCanvas(512, 512);
const context = canvas.getContext('2d');
```

Presumably the lack of DOM improves performance? I've no idea. What I care about is that `OffscreenCanvas` is available in **Web Workers**. That includes the **Service Worker**. It's even possible to transfer canvas data between the main thread and a worker. [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas#examples) has some great examples.

## Service Worker

The server for [my web app](https://github.com/dbushell/sauroPod/) is lazy and only proxies podcast artwork. Apple recommends 3000×3000 i.e. *massive*. For the 40-ish podcasts I subscribe that is over 18 megabytes. It's a self-hosted server on my local network but still — ouch. Images that large demand a lot of device memory regardless of adequate bandwidth.

That's a lot of data for images that are primarily small thumbnails.

<figure class="Image">
  <img
    loading="lazy"
    decoding="async"
    fetchpriority="low"
    src="/images/blog/2024/sauropod.avif"
    alt="sauroPod screenshot"
    width="455"
    height="767">
    <figcaption>My self-hosted web app has be redesigned and refactored several times.</figcaption>
</figure>

It's time to resize images!

I should really do this server-side but theoretically my podcast player could exist all client-side. The browser could process RSS feeds without a proxy. Except when feeds are missing CORS headers. That's why I use a server. But let's imagine I have no server.

I can use a Service Worker to fetch the initial artwork and cache a resized version for all future responses using `OffscreenCanvas`.

Example service worker code:

```javascript
// Create reusable canvas
const offscreen = new OffscreenCanvas(512, 512);
const context = offscreen.getContext('2d');

self.addEventListener('fetch', (ev) => {
  // Only handle image requests
  const url = new URL(ev.request.url);
  if (url.pathname.startsWith('/artwork/')) {
    ev.respondWith(artwork(ev));
  }
});

const artwork = async (ev) => {
  const cache = await caches.open('artwork');
  // 1. Return from cache
  let response = await cache.match(ev.request);
  if (response) return response;
  // 2. Or fetch from network
  response = await fetch(ev.request);
  if (!response.ok || response.status !== 200) {
    return response;
  }
  // 3. Use canvas to resize
  let blob = await response.blob();
  context.drawImage(await createImageBitmap(blob), 0, 0, 512, 512);
  blob = await offscreen.convertToBlob({type: 'image/png'});
  // 4. Create new headers
  const headers = new Headers(response.headers);
  headers.set('content-type', blob.type);
  headers.set('content-length', blob.size);
  // 5. Create new response
  const {status, statusText} = response;
  response = new Response(await blob.arrayBuffer(), {
    status, statusText, headers
  });
  await cache.put(ev.request, response.clone());
  return response;
}
```

## How it Works

All requests go through the service worker `fetch` event listener. Requests for artwork URLs are handled and the rest are ignored.

1. I check the cache and immediately return any matches. A match means the artwork has already been processed.
2. I do a `fetch` request for the artwork. If this fails I return the response and let the browser handle errors.
3. I draw and resize the artwork onto the canvas. Then I convert it to a PNG. This is the magic of `OffscreenCanvas` in web workers!
4. New headers are created based on the original response. The `content-type` and `content-length` headers are corrected for the new image.
5. I create a new response with the new data. Before I return this I put a cloned copy in the cache for future requests to match in step 1.

Bear in mind that service workers will cache responses indefinitely. Cache busting strategies are not implemented in the code above. There's too much to discuss on the topic here but I'd be remiss if I didn't warn you!

Because this is all client-side I can't avoid the initial 18 megabyte load when the cache is empty. All subsequent loads will be significantly faster, smaller, and kinder to the CPU and memory.

## Resize Algorithm

I'm using the `drawImage` method and there is some noticeable image aliasing on the result. Maybe you can see in the example below.

The original [Syntax podcast](https://syntax.fm) artwork is 1724×1724. The top-left image below was resized to 128×128 using Photoshop. The top-right image was resized to 128×128 using `OffscreenCanvas`. The second row I've upscaled both images in Photoshop so it's easier to see the aliasing effect.

<figure class="Image">
  <img
    loading="lazy"
    src="/images/blog/2024/offscreen-canvas-render.png"
    alt="Syntax podcast artwork at different size renders"
    width="512"
    height="384">
</figure>

It's clear that Photoshop has a better scaling and anti-aliasing algorithm. I've tested both Firefox and Safari on macOS and the results are similar.

The [HTML spec](https://html.spec.whatwg.org/multipage/canvas.html#dom-context-2d-drawimage-dev) says:

> This specification does not define the precise algorithm to use when scaling an image down

Ha! Anyway, this isn't much of an issue. On high pixel-per-inch displays it's hardly noticeable.

That said, with `canvas` you do have access to the raw pixel data. Would it be crazy to implement your own resize algorithm? Almost definitely yes. Crazy and slow. But what about using Web GPU? That would be a fun project...
