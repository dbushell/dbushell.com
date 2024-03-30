---
date: 2024-03-04 10:00:00+00:00
slug: jsr-second-look
title: 'JSR: Second Look'
description: 'The one where I try out a fancy new JavaScript repository (again)'
---
I blogged my [JSR: First Impressions](/2024/02/16/jsr-first-impression/) a couple of weeks ago. Since then [JSR](https://jsr.io/) has [officially launched](https://deno.com/blog/jsr_open_beta) in open beta. My article proved timely and received a lot of attention. JSR has already made changes so I figured a second look was required.

## Open Source

The [JSR GitHub repository](https://github.com/jsr-io) has also gone public. The primary components are a Rust API, PostgreSQL database, and [Fresh](https://fresh.deno.dev/) website.

Everything is hosted on Google's cloud services. Notably the Fresh front-end is not hosted on [Deno Deploy](https://deno.com/deploy) despite it being the flagship project <sup>†</sup>. Which is a good thing honestly, I've found Deno Deploy to be a little too slow and unreliable. Maybe it's not just me.

Open source and MIT licensed is good to see. I cloned the [@jsr-io/jsr GitHub repo](https://github.com/jsr-io/jsr) and ran `deno task prod:frontend`. Fresh started on `localhost:8000` but auth/login failed. I went back to RTFM ([prerequisites](https://github.com/jsr-io/jsr?tab=readme-ov-file#prerequisites)). Once I had `jsr.test` resolving to localhost and visited that URL everything worked. It connects to the production database API. I edited a few pages, Fresh automated updated, good stuff indeed.

There is an [open issue](https://github.com/jsr-io/jsr/issues/144) about mirroring package sources and data.

💤 <sup>†</sup> Fresh is built by the Deno team and featured prominently on the Deno Deploy [landing page](https://deno.com/deploy), [manual start page](https://docs.deno.com/deploy/manual), and is the first template on the "New Project" page within Deno Deploy.

## Types and NPM

The issues I had with types for Node & Bun are reportedly fixed.

JSR has a new [Node CLI](https://github.com/jsr-io/jsr-npm) which is now the recommended way to install JSR packages for Node:

```shell
npx jsr add @dbushell/carriageway
```

I don't use Node often but this looks more convenient.

## Bun is Here!

I raised a question around the curious omission of Bun. Now Bun has been added alongside the other runtimes.

<figure class="Image">
  <img
    loading="lazy"
    decoding="async"
    fetchpriority="low"
    src="/images/blog/2024/jsr-runtimes.avif"
    alt="JSR runtime support"
    width="430"
    height="134">
</figure>

I was mulling over a conspiracy theory as to Bun's whereabouts.

## Browser Support

Last time I failed to comment on how browser support on JSR is a binary option. As every web developer knows JavaScript API support in browsers is varied. My [@ssr/velocirouter](https://jsr.io/@ssr/velocirouter) package uses the [URLPattern API](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern). Only Deno and Chromium browsers support it natively without a polyfill. I opted to check *"Browsers Supported"* but I'd like a way to point people to the documentation that is more nuanced.

I have [opened an issue](https://github.com/jsr-io/jsr/issues/164) to discuss more browser compatibility options.

## Package Scores

I'd highly recommend [Syntax episode #737](https://syntax.fm/show/737/jsr-the-new-typescript-package-registry-npm-killer) with guest **Luca Casonato**. They discuss one problem with NPM; older packages are prioritised in search simply due to them accumulating more downloads over time.

JSR wants to solve that and package score may be one factor:

<figure class="Image">
  <img
    loading="lazy"
    decoding="async"
    fetchpriority="low"
    src="/images/blog/2024/jsr-score.avif"
    alt="JSR score card example"
    width="354"
    height="396">
</figure>

Check out my [@dbushell/carriageway](https://jsr.io/@dbushell/carriageway/score) package for example.

Scoring criteria is currently:

* Has a readme or module doc
* Has examples in the readme or module doc
* Has module docs in all entrypoints
* Has docs for most symbols
* No slow types are used
* Has a description
* At least one runtime is marked as compatible
* At least two runtimes are marked as compatible

That last bullet point means that any runtime-specific package like my [Deno Audio Duration](https://jsr.io/@dbushell/audio-duration) has a maximum score of 94%. I'm OK with that.

Otherwise it's not difficult to get 100% if you make a token effort towards documentation. You can even cheat this with worthless comments. Scores are colour coded: Red — below 60% — Orange — 60–90% — and Green for 90%+. I can imagine this score calculation changing over time. It's not a perfect methodology but I like the concept.

I would like to see download stats and GitHub stars being surfaced. They are metrics of questionable relevance but together help paint a picture of overall package quality.

## @scope Squatting

The [Syntax episode](https://syntax.fm/show/737/jsr-the-new-typescript-package-registry-npm-killer) also raised the concerns over name squatting. JSR has reserved some names of popular NPM packages. Obvious abuse will be handed over to the "rightful" owner; potentially controversial. However, packages will remain immutable once published, even if scope ownership changes hands. I can't think of a better solution myself. JSR has the unenviable task of moderation in that respect. Anyway, there's been no land rush for names.

On that note the `@db` scope was picked up by the [Deno SQLite](https://jsr.io/@db/sqlite) package. More than worthy. I'm glad I didn't take it for my own vanity!

## Deno Dependency Woes

I published my experimental [DinoSsr](https://ssr.rocks) web framework to JSR a little too soon. It was working fine until the Deno 1.41 update. Now it errors:

```
error: Uncaught (in promise) TypeError: Importing https://deno.land/x/esbuild@v0.20.0/mod.js blocked.
JSR packages cannot import non-JSR remote modules for security reasons.
```

This error comes from me attempting to load esbuild dynamically:

```typescript
const esbuildWasm = 'https://deno.land/x/esbuild@v0.20.0/wasm.js';
const esbuildMod = 'https://deno.land/x/esbuild@v0.20.0/mod.js';
// Use WASM module in Deno Deploy runtime
const esbuild = Deno.env.has('DENO_REGION')
  ? await import(esbuildWasm)
  : await import(esbuildMod);
```

My code was working until [this Deno fix landed](https://github.com/denoland/deno/pull/22623). In fairness I was bypassing and "cheating" the JSR static analyzer. I can only blame myself but this does highlight one downside of JSR for Deno packages.

JSR packages can import from `jsr:` and `npm:` and even `node:` built-ins. JSR packages *cannot* import HTTP modules for "security reasons". That's kinda awkward because the Deno ecosystem is built upon HTTP imports. That was a big part of Deno's philosophy when a registry was deemed unnecessary.

I have a dependency on [esbuild](https://github.com/evanw/esbuild). In turn esbuild for Deno has a dependency on [denoflate](https://deno.land/x/denoflate@1.2.1/mod.ts). So I can't publish to JSR until they do. If they do. They have no obligation to. Imagine the pain if this chain of dependencies was longer than two.

I could try to vendor in these sub-dependencies but I'd rather not bloat my package that way. Do I fork and re-publish these packages under my own scope? A lot of maintenance work. What happens if people search for these packages? That'd be a mess. I don't want my version to become the de facto package for these projects simply by publishing first. I opened one [JSR package request](https://github.com/evanw/esbuild/issues/3678) but I can't expect anything.

JSR is clearly aimed at being "the Deno registry" in everything but name. Ironically though it's harder to publish Deno packages to JSR because dependencies become a blocker.

## Successful Launch?

JSR uptake has been, dare I suggest, slow? — if that's even a fair statement after less than a week into the launch. What would fast look like? As I type this the 1000th package was published. Quantity is obviously not everything, but that's not many. Let's see if that pace picks up before judging too harshly. JSR has added some cool features. If it continues to improve I can see uptake climbing.

Sentiment around JSR seems mixed from my perspective. I've read a fair bit of skepticism and negativity. The same that lingers around discussions of Deno. It's not just that Node is "good enough" or the usual anti-JavaScript crowd. Deno just seems to leave a bad taste in the mouths of many.

In my [First Impressions](/2024/02/16/jsr-first-impression/) article I said:

> For Deno and TypeScript coders I think JSR will be the place to publish packages going forward.

That got quoted by a few blogs. Perhaps I should have said "a place" instead of "the place". Ideally JavaScript packages should be published in registries, in code repos — everywhere that makes sense. I'll remain positive and open towards JSR but I'm not going all-in.
