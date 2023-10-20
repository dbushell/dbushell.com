---
date: 2023-10-20 10:00:00+00:00
slug: xml-streamify
title: 'XML Streamify'
description: 'The one where I begrudgingly parse XML'
---

I've only gone and published an XML parsing library!

It's called [XML Streamify](https://github.com/dbushell/xml-streamify) on GitHub and it works like this:

```javascript
for await (const node of parse('https://dbushell.com/rss.xml')) {
  if (node.is('channel', 'item')) {
    console.log(node.first('title')?.innerText);
  }
}
```

This example outputs blog post titles from my RSS feed.

The `parse` function is an async generator in front of a custom [`TransformStream`](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream). `parse` will yield nodes as the XML document if fetched as parsed.

This allows you to work with data *before* the fetch is complete.


```javascript
const controller = new AbortController();
const parser = parse('https://dbushell.com/rss.xml', {
  signal: controller.signal
});
for await (const node of parser) {
  if (node.is('channel', 'lastBuildDate')) {
    console.log(new Date(node.innerText));
    controller.abort();
  }
}
```

This example logs the `lastBuildDate` and then aborts the fetch request thus ending the parse process. It doesn't wait for the entire file to download. This can save time and bandwidth. It's not the fastest XML parser on the market but it gets the job done before other parsers even start. And it is actually quiet fast.

I primarily designed this to handle RSS feeds. Podcast feeds, for example, can be several megabytes with hundreds of episodes. This library makes it possible to read the latest episodes and skip the rest.

## Cross-platform

[XML Streamify](https://github.com/dbushell/xml-streamify) should work in all JavaScript runtimes; Bun, Deno, Node, and web browsers. Bun has issues with the abort controller. [It's not my fault](https://github.com/oven-sh/bun/issues/2489), I think, I'm still debugging.

Right now only Firefox supports [async iterators](https://jakearchibald.com/2017/async-iterators-and-generators/) with a `ReadableStream`. Other browsers can use a [tiny polyfill](https://bugs.chromium.org/p/chromium/issues/detail?id=929585#c10) in the meantime. A frustrating majority of RSS feeds lack the appropriate CORS headers. I thought about building an RSS reader web app but it's practically impossible without at least a proxy server.

This project doesn't aim to be compliant with the full XML spec (No way I'm reading that). It's just enough to handle RSS. It can work with XHTML from limited testing.

This is still early development so the API can change as I test it further. Once it becomes stable I might publish NPM packages etc.
