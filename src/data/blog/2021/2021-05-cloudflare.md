---
date: 2021-05-14 10:00:00+00:00
slug: cloudflare-dns-pages-workers
title: 'Cloudflare Pages and Workers'
description: 'The one where I go full Cloudflare'
---
I use both [GitHub Pages](https://pages.github.com/) and [Netlify](https://www.netlify.com/) for static web hosting. GitHub Pages are great for project documentation. Netlify allows more control. [Cloudflare Pages](https://pages.cloudflare.com/) is a new contender to the game offering a similar build and deploy process. I have a new side project in the works. A good opportunity to try out Cloudflare Pages.

## The Project

I'm building a new progressive web app to play audiobooks (and later podcasts, maybe). The how and why I'll blog about another time. Here's an early peek:

<p class="Image">
  <img loading="lazy" srcset="
    /images/blog/2021/mesonic-v0-10-0@1x.png,
    /images/blog/2021/mesonic-v0-10-0@2x.png 2x"
    src="/images/blog/2021/mesonic-v0-10-0@1x.png"
    alt="meSonic progressive web app demo screenshot"
    width="375"
    height="480">
</p>

This super secret side project has both a **client** and **server** component. A partial implementation of the Subsonic API sits in between.

The server I'm writing in **Deno**. [I'm liking Deno](/2021/03/12/built-with-deno/) more and more. It will replace my use of [Airsonic](https://github.com/airsonic/airsonic). I've tried many alternatives and in classic programmer fashion decided to do it myself. Anyway, like I said, that's for another blog post...

The client website shown above is built with [SvelteKit](https://kit.svelte.dev/) (and thus Node). I'm using the static adapter for now so it can be hosted anywhere. There is a [Cloudflare Workers adapter](https://github.com/sveltejs/kit/tree/master/packages/adapter-cloudflare-workers) but it's too experimental — even for me — but that could be the end goal.

## Cloudflare Pages

So I have an `npm run build` deal going on for my PWA. Setting up a project with Cloudflare is almost identical to Netlify. You connect to a GitHub repository. You configure the build command and directory. There are optional environment variables. Each deployment gets a unique preview URL. All expected features. If you're using Cloudflare for DNS then custom domains are a cinch.

Anecdotally, I've found Cloudflare can get hung up on the first "Initializing build environment" step. I've also had Netlify stall on me. I suspect actually paying for these services would yield more prompt results.

Netlify is ahead in user experience. They are much clearer about free tier limits and personal usage. I've been looking, but if Cloudflare has a page tallying my monthly build minutes, I cannot find it.

## Cloudflare Workers

My progressive web app is designed to connect to a server. It uses `fetch` cross-origin `POST` requests. If a server is not configured it uses static JSON files that act as fake REST API endpoints to provide test data.

Out of the box my deployment was full of CORS and HTTP errors. If this were Netlify I'd use their `netlify.toml` file to set response headers for the offending URLs. Cloudflare has no comparable file and no more options than described above.

The solution was [Cloudflare Workers](https://workers.cloudflare.com). A different "product" with its own set of tiered limits. This isn't AWS level of confusing, but it's not as intuitive and hand-holdy as Netlify. That said, Workers are magical. They're written like [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers).

To fix my problem I intercept the fake API requests:

```javascript
addEventListener('fetch', (ev) => {
  const {request} = ev;
  if (/\/rest\//.test(request.url) && request.method === 'POST') {
    return ev.respondWith(addHeaders(request));
  }
});
```

With that I fetch the JSON file with a standard `GET` request. Then I return a new response with modified headers.

```javascript
const addHeaders = async (request) => {
  const response = await fetch(request.url);
  const headers = new Headers(response.headers);
  Object.keys(newHeaders).map((name) => {
    headers.set(name, newHeaders[name]);
  });
  return new Response(response.body, {
    status: 200,
    headers
  });
};
```

I'm adding quite a few headers to fake the API response and stop browsers complaining. Whilst I'm here I boost my [Mozilla Observatory](https://observatory.mozilla.org/) score.

```javascript
const newHeaders = {
  'access-control-allow-headers': 'accept, accept-encoding, content-type, content-length, range',
  'access-control-allow-methods': 'POST, GET, HEAD, OPTIONS',
  'access-control-allow-origin': '*',
  'content-type': 'application/json',
  'X-Frame-Options': 'DENY',
  'X-Xss-Protection': '1; mode=block',
  'X-Content-Type-Options': 'nosniff',
  'Strict-Transport-Security': 'max-age=31557600',
  'Referrer-Policy': 'same-origin',
  'Content-Security-Policy': "default-src 'self'; connect-src *; media-src *; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; form-action 'self' base-uri 'none'; frame-ancestors 'none';",
  'Permissions-Policy': 'interest-cohort=()'
};
```

That's some powerful stuff!

The final step is to attach the Worker to a route like `*mesonic.app/*` so it knows which requests to intercept.

Technically it's possible to deploy an entire website to a Cloudflare Worker. So I've read. I'm very interested to see how the SvelteKit adapter handles it. This would allow dynamic "server-side" JavaScript. Workers have got my head in a spin. There's a lot to understand. I'm not entirely sure where my website is deployed — but it works.

## And so...

I'd need to read more of the fine print before I'd be confident using these Cloudflare services full time. The [free tier limits](https://developers.cloudflare.com/workers/platform/limits) are quite extensive. Initial impressions as a developer are positive. My side project will live here for now.

**SvelteKit** was an off-the-cuff choice. Along with [Bootstrap 5](https://getbootstrap.com) they just happened to launch when I needed a head start in prototyping my PWA. I've found both to be delightful to work with. I plan to blog about them as I continue to code. I might show off more of the side project itself too. It's for my own use but out there if you're curious.

## Related articles

* [Natural Alphanumeric Sorting in JavaScript](/2021/05/17/javascript-natural-alphanumeric-sorting/)
