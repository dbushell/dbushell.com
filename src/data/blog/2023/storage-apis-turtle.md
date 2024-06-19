---
date: 2023-10-02 10:00:00+00:00
slug: storage-apis-downloading-files-for-offline-access
title: 'Storage APIs: Downloading Files for Offline Access'
description: 'The one where Safari does good'
---

In my [ongoing adventure](/2023/09/13/mesonic2-podcast-index-api/) to build a personal media web app I keep finding new web APIs to make it *more awesome*. I've adopted the *Internationalization API* for [natural sorting](/2021/05/17/javascript-natural-alphanumeric-sorting/) and [relative dates](/2021/06/08/javascript-relative-date-time-formatting/) and the [*Media Session API*](/2023/03/20/ios-pwa-media-session-api/) for native integration.

Next I'm improving my use of **file storage APIs** to download and cache audio files for offline playback. A feature that has long been a pain to implement.

[**Turtle**](https://turtle.deno.dev/) is a little demo project I built to understand the new APIs.

<figure class="Image">
  <img
    src="/images/blog/2023/turtle.avif"
    alt="Turtle UI screenshot"
    width="470"
    height="220">
</figure>

Keep reading to learn more!

## Safari is back!

Previously my media app was [using IndexedDB to store files](https://github.com/dbushell/meSonic2/blob/778cd77f0cb6fe5d0afde85fdfd81f31c5d1c391/client/src/lib/offline.ts). IndexedDB is not really designed for that nor it is a pleasant API to use. It was however the best method I found. Except for the time [Safari 14 broke IndexedDB](https://github.com/jakearchibald/safari-14-idb-fix).

I use an iPhone so I'm stuck with Safari (WebKit) which has historically lagged behind on web standards support. Well not long after I had implemented an IndexedDB store, Safari 15.2 added some support for the `StorageManager` API. Now [Safari 17](https://webkit.org/blog/14445/webkit-features-in-safari-17-0/) has improved support and removed the 1 GB limit:

> Now, the origin quota is calculated based on total disk space. This means an origin generally gets a much higher limit, and users will no longer receive permission prompts in Safari.

The [Storage APIs](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API) and OPFS ([origin private file system](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system#browser_compatibility)) give websites access to file storage. This is perfect for my app to download and store audio (usually MP3 between 100–1000 MB). Safari on my iPhone reports over 38 GB quota via `navigator.storage.estimate()`. Safari 17 on macOS gives me over 76 GB. Firefox limits me to 10 GB.

Getting a list of files is as simple as:

```javascript
const dir = await navigator.storage.getDirectory();
for await (const [key, value] of dir.entries()) {
  // Do something...
}
```

No more IndexedDB transactions and events! You will not be missed.

## Stream Download Progress

Reading and writing files is almost as easy. You can even stream a file directly to storage and track download progress. I've whipped up a demo project. Find it at [GitHub](https://github.com/dbushell/deno_turtle/), [CodePen](https://codepen.io/dbushell/pen/ZEVxdBG), and deployed at [**turtle.deno.dev**](https://turtle.deno.dev/).

Safari doesn't support `createWritable` for a writable stream (streams are seriously cool). It does support `createSyncAccessHandle` which is only available inside a Web Worker context (to avoid blocking the main thread). I created a worker that accepts a URL message and posts back download progress.

A reduced example of the worker code:

```javascript

self.addEventListener('message', async (ev) => {
  download(ev.data.url);
});

const download = async (url) => {
  const response = await fetch(url);
  // Get a readable stream and content length
  const reader = response.body.getReader();
  const length = Number.parseInt(response.headers.get('content-length'));

  // Create a new writable file handle
  const root = await navigator.storage.getDirectory();
  const handle = await root.getFileHandle('example', {create: true});
  const writer = await handle.createSyncAccessHandle();

  // Track read bytes as chunks are streamed
  let read = 0;
  while (true) {
    const {done, value} = await reader.read();
    if (done) break;
    writer.write(value);
    read += value.length;
    self.postMessage({url, read, length});
  }

  writer.close();
  self.postMessage({url, length});
};
```

This was possible with IndexedDB before but you have to temporary store the chunks in memory before writing a `Blob` to the database.

My example code is missing all the error handling. One lazy approach would be to wrap the entire `download` function in a `try/catch` statement and post back an error message.

A neat trick is to use an `AbortController` that allows you to cancel the download.

```javascript
try {
  const controller = new AbortController();
  const response = await fetch(url, {signal: controller.signal});
} catch (err) {
  // https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort
  // When abort() is called, the fetch() promise rejects with
  // an Error of type DOMException, with name AbortError.
}
// Cancel the download
controller.abort();
```

Good stuff!

The only bad thing about these APIs is their names. There is the ["Web Storage API"](https://developer.mozilla.org/en-US/docs/Web/API/Storage), aka "Storage", which is the key/value local & session storage. The ["Storage API"](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API) and the ["File System API"](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API) which seem to overlap. The ["Storage Standard"](https://storage.spec.whatwg.org) which attempts to consolidates them all into one API to rule them all, including the IndexedDB and Cache APIs, I think.

Check out my demo at [**turtle.deno.dev**](https://turtle.deno.dev/) to see it in action.

You can find my media player [meSonic² on GitHub](https://github.com/dbushell/mesonic2) (beware: work in progress!)
