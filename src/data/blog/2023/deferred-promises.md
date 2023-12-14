---
date: 2023-12-14 10:00:00+00:00
slug: deno-tail-lines-2
title: 'Deferred; Promise with Resolvers'
description: 'The one where I make a promise'
---

[`Promise.withResolvers`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers) is a new JavaScript spec that's landing in a runtime near you soon if it hasn't already.

How is it useful? For example, let's write an asynchronous function that returns your public IP address. We could return a `Promise` the old way:

```javascript
const getAddress = () => new Promise(resolve => {
  fetch('https://icanhazip.com').then((response) => {
    response.text().then((text) => {
      resolve(text);
    });
  });
});
getAddress().then((ipAddress) => {
  console.log(ipAddress);
});
```

If you have experience with `Promise` you'll know how quickly chaining them leads to nested code that's ugly and verbose.

Using `async/await` syntax is so much cleaner:

```javascript
const getAddress = async () => {
  const response = await fetch('https://icanhazip.com');
  return await response.text();
}
const ipAddress = await getAddress();
console.log(ipAddress);
```

So clean! Now let's add the new hotness `withResolvers`:

```javascript
const getAddress = () => {
  const {promise, resolve} = Promise.withResolvers();
  fetch('https://icanhazip.com').then(async (response) => {
    resolve(await response.text());
  });
  return promise;
}
const ipAddress = await getAddress();
console.log(ipAddress);
```

It may not be immediately obvious but `promise` is returned before `fetch` is complete.

So how exactly is this useful? Let's build a file downloader with a cache using deferred promises. I'm using my [Turtle demo](/2023/10/02/storage-apis-downloading-files-for-offline-access/) to throttle a 10KB file download to make the async process more obvious.

```javascript
const cache = new Map();

const fetchBlob = async (url, resolve) => {
  const response = await fetch(url);
  const body = await response.blob();
  resolve(body);
}

const download = (url) => {
  if (cache.has(url)) return cache.get(url);
  const {promise, resolve} = Promise.withResolvers();
  cache.set(url, promise);
  fetchBlob(url, resolve);
  return promise;
}

const url = 'https://turtle.deno.dev/bin';
const p1 = download(url);
const p2 = download(url);

console.log(await p1 === await p2);
```

In this example the logged result is `true` because both calls to `download` return the same promise. The `fetch` is only run once and `download` does not wait for `fetchBlob` to finish.

This is useful! We're able to pass around the `promise`, `resolve` (and `reject`) separately. The [`withResolvers` spec](https://github.com/tc39/proposal-promise-with-resolvers) exists because the deferred promise pattern was *"frequently re-written by developers"*. The spec is now at stage 4 meaning it's ready and shipping.
