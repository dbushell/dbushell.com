---
date: 2017-04-06 10:00:00+00:00
slug: the-magic-of-service-workers
title: 'The Magic of Service Workers'
description: 'They’re a thing. I used one to make my website more accessible offline and faster online.'
---

They’re a thing. [Google describes](https://developers.google.com/web/fundamentals/getting-started/primers/service-workers) them as a “technical foundation”.

What I’ve learnt is that a service worker is a JavaScript file. It runs in it’s own little world behind a website. That means it can’t access the DOM. What it can do is proxy network requests and access a storage cache.

I'm sure they can do more but I'm still learning.

## Connectivity Issues

If you’ve ever tried to visit a website with no connection you’ll have seen a default browser error page like this:

![Chrome offline page](/images/blog/2017/chrome-offline.png)

Who hasn't, right? This is easily happenable on mobile networks where connections are flaky. Or on poor WiFi networks that balk at more than three devices.

Maybe the connection is fine but a web server fails to response. Maybe a data center has lost power. Maybe a CDN is leaking your request to another user. Service workers can handle these scenarios better.

I've setup a service worker to cache my web pages and assets a user requests. They remain accessible offline. If the user requests a new page they see:

![Service worker offline page](/images/blog/2017/dbushell-offline.png)

Cool, huh?

That's of course if the browser supports service workers.

For a humble portfolio and blog like mine this is a nice-to-have feature. Users can at least return to a page they were reading. For _Progressive Web Apps_ things get a lot more exciting. See the [App Shell Model](https://developers.google.com/web/fundamentals/architecture/app-shell) for example.

A neat trick is to serve a fallback SVG image should any image request fail. Mine in action looks like this:

![Service worker offline image](/images/blog/2017/dbushell-offline-image.png)

It's possible to pre-cache stuff before the user requests it. I'm not sure of the limits. I'm guessing it's ill advised to cache an entire website. My website attempts to cache top-level HTML to boost perceived performance.

As of writing Chrome plays nicely. Firefox seems to be doing stuff (shrugs). It's new technology and a progressive enhancement.

I can see potential for these things.
