---
date: 2023-09-26 10:00:00+00:00
slug: adios-netlify-hola-cloudflare-pages
title: 'Adios Netlify!'
description: 'The one where I move my website from Netlify to Cloudflare pages'
---

I'm moving my website hosting from **Netlify** to [**Cloudflare Pages**](/2021/05/14/cloudflare-dns-pages-workers/)! If you can read this I was successful. If not... oh dear!

I first tried Netlify back in January 2020. I wrote some [first impressions](/2020/01/15/netlify-first-impressions/) and experimented with [Netlify functions](/2020/01/27/building-a-pwa-with-netlify-functions/). I initially planned to host projects on both Netlify and Cloudflare for a few weeks before settling on one. But then three years happened and I became too lazy to move. Until now.

## Tipping Point

There are a few reasons to prefer Cloudflare but what pushed me was on September 1st [Netlify quietly deprecated their "Large Media"](https://answers.netlify.com/t/large-media-feature-deprecated-but-not-removed/100804) Git LFS service. If they sent emails I never got one. That irked me a little but I never paid them a penny so who am I to complain.

I use Git LFS for my blog images; around 50MB. GitHub now offers large file storage so I decided to move there. Having no clue how LFS works, I made a right mess trying to move files. Ultimately I had to delete the entire repo and [start again](https://github.com/dbushell/dbushell.com). Goodbye stars, and forks — always found it odd people forked my personal blog.

## Builds

Another reason I ditched Netlify was builds. I found it easier to simply build locally or use a GitHub Action. Relying on Netlify just added an unnecessary step.

For this website, which is Markdown, Svelte templates, and a custom Deno build script (no fancy framework), my Netlify build times were 90% [downloading the Deno runtime](/2021/07/22/netlify-deno-builds/). Netlify still haven't added Deno to their build image. I'm surprised considering their edge functions are backed by the Deno Deploy platform.

Anyway, even if I were to use Node it'd be quicker to build without Netlify.

## Functions

Earlier this year I moved away from Netlify Functions to a Cloudflare Worker to [PGP encrypt my contact form](/2023/07/14/pgp-email-encryption-aws-cloudflare-worker/). Workers are much more powerful and on "the edge". I have other workers to handle things like redirects.

## Cloudflare

So in the end I was no longer using any of Netlify's features. Literally just a static host. I've always used Cloudflare for DNS, TLS, and caching. Since I'm now using Workers too it made perfect sense to use Cloudflare Pages for hosting.

Cloudflare custom [404 pages](https://developers.cloudflare.com/pages/platform/serving-pages/) are basically the same as Netlify. Controlling [HTTP headers](https://developers.cloudflare.com/pages/platform/headers/) is similar too. Although it took me several commits because I failed to read the documentation carefully. You can also use a Worker to modify headers.

I still like Netlify but for my personal requirements it doesn't make sense. So thanks for the free hosting! I'm sure I'll be back.
