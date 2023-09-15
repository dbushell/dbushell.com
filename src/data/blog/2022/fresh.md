---
date: 2022-07-27 10:00:00+00:00
slug: is-fresh-fresh-and-astro-and-bun
title: 'Is Fresh, fresh?'
description: 'The one where I go on about server side rendering'
---

Before I discuss the main topic; a few thoughts on [Astro!](https://astro.build/)

I love static websites. Static websites are super fast *"in the cloud"* and *"on the edge"*. Unfortunately static site generators (SSGs) are not so quick.

## Astro!

To learn Astro I rejiggered my website (the one you're reading now) to fit into it. Astro seems to be the trendiest of the SSG bunch right now. My Astro blog has one layout and six page routes. The layout sidebar/footer includes my 10 most recent blog posts.

In the half dozen `.astro` pages I added:

```jsx
import Layout from '@layouts/Layout.astro';
const posts = await Astro.glob('/blog/**/*.md');
// ---
<Layout latest={posts.slice(0, 10)}>
```

Duplicating the `glob` seems inefficient and is by far the slowest part of the build. In a React or Svelte app I'd just pass the data down from a higher component. In Astro, page routes are the highest level. Unless I misunderstand? Presumably the `glob` is cached? [Please tell me](https://twitter.com/dbushell) if I'm doing it wrong.

Anyway, my Astro-ified website takes around **50–60 seconds** to build just shy of 400 pages. Painfully slow by impatient standards.

I'll stick with my [my own SSG script](/2021/03/12/built-with-deno/) that I hacked together last year. It was an exercise in learning Deno. It uses the same svelte components, handles markdown and pagination, and builds the same website in **under 3 seconds**. Despite being terrible code with many quirks for the sake of experimentation.

That said I'd still reach for an off-the-shelf tool for client projects.

Anyway, if builds are slow why not just skip them?

## No build no problem

That's the idea of SSR (server-side rendering). JavaScript runs on the server and generates static HTML on-request. The same front-end components are used. "Hydration" in the browser can be optional.

[Astro has this option](https://docs.astro.build/en/guides/server-side-rendering/). [SvelteKit](https://kit.svelte.dev/) is built on this philosophy. [Next.js](https://nextjs.org/) is the popular all-in-one solution. [Fresh](https://fresh.deno.dev/) is the latest project that has piqued my interest.

**Fresh** is built with Deno and ideal to run on [Deno Deploy](https://deno.com/deploy). With Deno you get **TypeScript** and **JSX** built in. That means not only no build step but **no compilation step** either. Just deploy and run on the server. I've actually started using TypeScript more regularly because Deno makes it so painless.

So Fresh is very fresh in deployment but it's lacking everywhere else. There is no pagination support for example. Documentation was also missing for some features when I tested (like the `<Head>` component).

Fresh is not doing anything special other than existing on the Deno ecosystem. What it demonstrates does put the long compile and build times of other platforms to shame. SSR without the friction is fantastic. Fresh is a compelling showcase that's missing table stake features.

Advances in JavaScript tooling — both front-end and back-end — are great to see. But it's silly how often projects start from scratch.

Also on my radar...

## Fresh from the oven

[Bun](https://bun.sh/) is a new contender to Node. Like Deno, it handles TypeScript and JSX. It's more compatible with Node, implementing Node APIs and `node_modules` resolution algorithm. I find Deno's solution to imports to be vastly superior but I can appreciate the value in legacy compatibility.

I've yet to experiment with Bun. I have a few self-hosted Raspberry Pi projects I've been dying to try with it. Now that [linux-aarch64](https://github.com/oven-sh/bun/releases/tag/bun-v0.1.5) builds are available I've no excuse (other than time).

There's no "Bun Deploy" platform yet so hosting is DIY. I wonder if we'll see SSR tooling target Bun specifically? I hope with Deno and Bun gaining popularity we'll start to see more platform agnostic JavaScript. At least more consideration to decoupling runtimes.

I've recently deployed a tiny client website on Netlify. The static build sits behind a [Netlify Edge Function](https://docs.netlify.com/netlify-labs/experimental-features/edge-functions/) which is a native Deno environment. I'm still predicting [Netlify will add Deno](/2021/07/22/netlify-deno-builds/) to its main build image. Now I wonder if Bun will become an option?

Anyway, another rambling blog over. I'll try to keep future posts on topic.
