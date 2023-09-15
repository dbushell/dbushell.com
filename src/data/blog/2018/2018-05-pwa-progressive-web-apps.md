---
date: 2018-05-21 10:00:00+00:00
slug: pwa-progressive-web-apps
title: 'PWA: Progressive Web Apps'
description: 'dbushell.com – or dbushell.app if you like redirects – is now a progressive web app ✨'
---

This website – dbushell.com – or [dbushell.app](https://dbushell.app) if you like redirects – is now a **progressive web app!**

What does that mean? Don't let the fancy initialism deceive you. PWAs are websites first and foremost. But they can be installed like an app. What is meant by "app" depends on where it's installed. As of writing it seems like OSes are still uncertain as to how PWAs are to be treated.

For my website the "add to home screen" experience is just a vanity bookmark. Regardless, there are benefits to transforming your website into a PWA.

## Service Workers

[Going Offline](https://abookapart.com/products/going-offline) by Jeremy Keith is a great book. It's my go-to recommendation if you want to understand the power of service workers and the offline experience.

[Last spring](/2017/04/06/the-magic-of-service-workers/) I dabbled with my own service worker and had a chance to discuss them with Jeremy at [All Day Hey!](https://alldayhey.com/) Which incidentally feels like the last time I left the office. I need to get out more!

I would advise writing your own service worker to understand the native APIs. I suspect, like me, you'll find the abundance of Promises to be a little unwieldy. Using [async/await](https://developers.google.com/web/fundamentals/primers/async-functions) can produce more readable code.

Recently I've experimented with [Google's Workbox](https://developers.google.com/web/tools/workbox/) library. It provides abstractions for common caching strategies, amongst other tasks. It can be as simple as providing a URL (or regex pattern):

```javascript
workbox.routing(
  /\.(gif|jpeg|jpg|png|svg)$/,
  workbox.strategies.cacheFirst()
);
```

In the example above all images with a matching file extension are fetched from the cache first if available, otherwise from the network (then cached).

### 🍻 👍 👍

Workbox gets one *clinking beer mugs* and two *thumbs up* emojis from me. The basics are easy to handle and the native APIs are still there to combine with Workbox for more advanced concepts.


## React Everywhere

PWAs don't require anything special on the front-end but if it's that true "app experience" we're after page refreshes are *so uncool*.

I've been using React to [generate my static site](/2017/02/13/react-as-a-static-site-generator/) for over a year now. This requires a bit more than just React ([see my GitHub repo](https://github.com/dbushell/dbushell.com)) but I can reuse most of the React code on the front-end. I added a second step to generate each page as JSON so they load even faster. React 16 introduced `hydrate()` which can efficiently take over server-rendered markup.

I'm using the History API to maintain URLs and native browser navigation. I've also sprinkled in an experimental `IntersectionObserver` to [lazy load images](https://www.smashingmagazine.com/2018/01/deferring-lazy-loading-intersection-observer-api/).

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) is another useful tool from Google.

![Lighthouse report for dbushell.com](/images/blog/2018/dbushell-app-lighthouse.png)

The browser plugin will run an audit and report back in dizzying detail.

Lighthouse isn't easily impressed. I was seeing red lights for days whilst learning new optimisations. I could have sworn it was all green when I checked a few months ago. I suppose the web moves fast and new improvements are forever on the horizon. Ideally these things become second nature but crucial milliseconds can easily slip away if you're not careful.

## Progressive Web

PWAs are really just an encapsulation of modern technologies and the same progressive web development practices that have long proved to build solid websites. For installation they do need an additional [Web Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) file. Because the number of existing standards to define icons and metadata wasn't enough.

If you need help optimising your website or PWA [get in touch!](/contact/)
