---
date: 2024-02-14 10:00:00+00:00
slug: super-fast-builds
title: 'Super Fast Builds ⚡'
description: 'The one where I build pages very fast ⚡'
---

I want to see more developers experiment with how they build their websites! Don't just `npm install` a blackhole. Roll your own personal solution. It's fun and rewarding!

## Where it Started

My website is a collection of **Svelte** components and **Markdown** files that combine to build over 400 pages. Over the years I've gone through a wide variety of build tools to output the same static site you're reading now. *"If it ain't broke, don't fix it"* is not a proverb that satisfies the creative itch. I say break it and fix it often!

A while ago I tried using [Astro](https://astro.build/). I found Astro remarkably slow compared to expectations. Astro has gotten faster but there is a trade-off between speed and developer experience. I ditched Astro for an entirely custom [build script](/2021/07/22/netlify-deno-builds/) that was orders of magnitude faster.

My build steps were:

1. Generate a page manifest by traversing markdown files
2. Parse frontmatter and markdown into page content
3. Use [esbuild](https://esbuild.github.io/) to compile Svelte SSR components for each template
4. Render components with content and write the HTML

I was able to parallelise a lot of this work. My entire site was built in under two seconds. Almost 100× faster than Astro at the time (maybe 10× today).

I've Git tagged my [old build script](https://github.com/dbushell/dbushell.com/blob/20240212/src/deno/mod.ts) to keep an snapshot.

## Adding a Framework

Recently I've been developing my own [experimental framework](/2024/01/08/new-projects-for-2024/) called [**DinoSsr**](https://ssr.rocks/). I'm using it to power my new bookmark blog [Cotton Coder](https://cottoncoder.com/) on a [self-hosted](/2024/01/24/cotton-coder/) Deno server. It's starting to develop into something nice and I've learnt a great deal coding it.

DinoSsr renders server-side Svelte templates on request without a build step. As a real world use case I decided to port my blog over. What better way to test my own framework?

DinoSsr uses a mix of [URL Pattern API](https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API) and file-based routing. With my existing Svelte components I created the necessary routes that included:

* `/` – home page
* `/:slug([a-zA-Z0-9-]+)/` – generic page
* `/blog/page/:page(\d+)/` – blog archive
* `/:year(\d+)/:month(\d+)/:day(\d+)/:slug/` – blog article

My blog doesn't have many unique templates.

Routes in DinoSsr export a `load` function to retrieve data for the matching URL (similar to SvelteKit). I have no CMS or database API so I simply reused the generated manifest from my old build script. The manifest includes a list of every page URL and its data.

I already had all the pieces so this whole project only took an afternoon. I was able to make some improvements and fixes to DinoSsr along the way.

## Back to Static

Having my blog on a dynamic web framework is great for local development and writing draft content. However, I want to continue hosting the static site on [Cloudflare Pages](/2023/09/26/adios-netlify-hola-cloudflare-pages/) for now.

[DinoSsr](https://ssr.rocks/) is not a static site generator. At least not by design. But I figured with the manifest, maybe I can just make a `fetch` request for every URL and write responses to disk? The answer was technically yes but dissapointingly slow. Almost **5 minutes** slow — yikes.

Not deterred I started to investigate the bottlenecks.

### Bottleneck #1: static routes

My website has accumulated over 500 images in the 15 years I've been blogging.

A unique feature of the [DinoSsr router](https://ssr.rocks/docs/velocirouter/) is that it passes a request through **all** matching handlers. DinoSsr was adding a unique route for every static file. 500 images meant 500 pointless match tests per request. These static routes used [`serveFile`](https://deno.land/std@0.214.0/http/file_server.ts?s=serveFile) from the Deno Standard Library. The obvious fix was to replace the hundreds of generated routes with a single route using [`serveDir`](https://deno.land/std@0.214.0/http/file_server.ts?s=serveDir). If this single route returns 404 it is ignored.

This fix shredded my build time from 5 minutes to under 10 seconds. It shows the value of testing with the right data.

### Bottleneck #2: object creation

For convenience [VelociRouter](https://github.com/dbushell/velocirouter) accepts a string input like `/:slug([\\w-]+)/` for routes. This is converted to a `URLPattern` instance before the request is tested:

```javascript
pattern = new URLPattern({pathname: input});
const match = pattern.exec(request.url);
```

I was doing this inside the request `handle` function every time it was called. This incurred a surprisingly expensive cost to performance. I changed it to only create the `URLPattern` instance once when the route was first registered.

Build times were shredded again to under 2 seconds.

### Bottleneck #3: fetch

If you remember I'm launching a Deno web server locally and fetching all URLs from the manifest. I theorised that calling `fetch` itself had some overhead:

```javascript
const response = await fetch('http://localhost:8080' + path);
```

Instead I can bypass the web server by calling the DinoSsr router directly:

```javascript
const response = await dinossr.router.handle(request);
```

This had a small but noticeable effect on build time. The end result of optimisation lead to build times below 1 second. Including a server startup around 500ms, it is almost as fast as my old build script.

<figure class="Image">
  <img
    loading="lazy"
    src="/images/blog/2024/static-build.gif"
    alt="screen capture of the build command terminal output"
    width="1200"
    height="190">
    <figcaption>I think I wasted time animating a progress meter in the console output.</figcaption>
</figure>

Not a bad at all considering I now have DinoSsr in the middle. This is now my new build process. For deployment to Cloudflare Pages I'm using a GitHub Actions. It's slower than my MacBook but most time is spent downloading dependencies. The entire action from set-up to deployed is less than a minute.

## Conclusion

I'm not building DinoSsr to compete with SvelteKit or Astro or anything similar. I don't expect anyone to use it outside of the most adventurous of coders. It's [open source](https://github.com/dbushell/dinossr/) so you're welcome to use it, adapt it, laugh at it.

I think web developers should be experimenting more with how they build their own websites. Maybe you prefer PHP or Ruby on the server. That's cool too. Building your own tools can help you appreciate how things work. Go wild! Maybe you like authoring HTML by hand. I can respect that too.
