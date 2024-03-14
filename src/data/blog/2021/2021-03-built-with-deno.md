---
date: 2021-03-12 10:00:00+00:00
slug: built-with-deno
title: 'Built with Deno'
description: 'The one where I ditch perfectly good code for the new shiny'
---
Things are moving fast over in [Denoland](https://deno.land). When I last checked in Deno was decidedly beta. Revisiting this month I see words like "stabilization" in the release notes. If there's one thing a JavaScript fiend like myself revels in it's dropping reliable and proven code for a shiny new replacement. Deno is just that; a full replacement for Node.

If you view my page source you might see:

```html
<meta name="generator" content="deno 1.8 | svelte 3.35.0">
```

That meta tag is a little spice I’ve mixed into [my personal static site generator](https://github.com/dbushell/dbushell.com). It’s nothing complicated. Just a few build scripts to server-side render Svelte templates with data from markdown files. I had written it in Node. Now I’ve translated it into Deno.

## Deno: First Impressions

Truthfully this isn't my first time with Deno but it's my first project of any real significance. [The Deno Manual](https://deno.land/manual@v1.8.0/introduction) has a good introduction so I won't bore you. Below are my initial thoughts after using Deno "in production".

<p class="Image">
  <img loading="lazy"
    src="/images/blog/2021/deno-logo.svg"
    alt="Deno logo"
    width="200"
    height="200">
</p>

Deno is good. Deno feels modern.

Compared to Node the [Deno API](https://doc.deno.land/builtin/stable) and [standard library](https://deno.land/std) are easier to work with. That should be a given because they were designed with years of hindsight. Everything is async and promise-based. Node is keeping up but it can only go so far without breaking APIs.

### Modules

There is no NPM equivalent for Deno. There doesn't need to be. Deno uses [ES modules](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/) and URL imports. Modules can be versioned in the URL. Optional [import maps](https://github.com/WICG/import-maps) allow for tidier name resolution. Modules are cached globally (no `node_modules`). All good stuff.

Many NPM packages work with Deno. It's all JavaScript after all. There is even an official [Node compatibility module](https://deno.land/std@0.90.0/node) to bridge the gap. The biggest pain is compatibility with some CommonJS and `require` code. The same pain found writing modern Node with ES modules. CDNs like [ESM](https://esm.sh/) and [Skypack](https://cdn.skypack.dev/) attempt to automate compatibility but they're not perfect.

### Runtime

Deno includes built in support for code formatting, linting, testing, bundling, and more. It does seem like a lot for the Deno project to maintain. Will core functionality suffer? What about bloat? Take this recent [documentation commit](https://github.com/denoland/deno/commit/c1fe86b15c2566e7281a74e3a4b61775f4f120ea#diff-56f8d2b8c873ba84c43d98f257eeec70dc5901f0b9635db6f90bd874b914e97d):

```diff
- the ~15 megabyte zipped executable
+ the ~25 megabyte zipped executable
```

It refers to how Deno "is runnable with nothing more than [ ... bytes]" – how often will that line be rewritten? It would be nice to have a slim Deno build without the extras. I'm running a Deno web server on a Raspberry Pi that only needs `deno run`.

That said, I'm all for reducing dependencies. Having the full suite of tools in Deno could keep development simple.

Security permissions are a valuable feature. Although I can see myself defaulting to:

```shell
deno run --allow-all --unstable
```

Whilst developing, for lazy convenience. That's a me problem I guess.

## Finally

**Deno is very intriguing.** I will maintain my own website built with Deno for the foreseeable future so I can keep watch. It's too early to adopt for client projects.

The big question is does Deno improve upon Node enough to justify the change? From my limited experience I see many improvements and big potential. Deno may prove to be better in the long run, but better isn't a guarantee to replace "good enough" – and Node is plenty good enough.

I can imagine a tipping point where compatibility is such that `deno` becomes a drop-in replacement for `node`. Until then I don't see Deno usurping Node. Even then, it's difficult to justify replacing the incumbent. There are many reasons not too.

## Netlify

Early last year I wrote my [first impressions on Netlify](/2020/01/15/netlify-first-impressions/). Ever since then I've used Netlify to host my projects. Netlify builds using a [Docker image](https://github.com/netlify/build-image) with Node and other tools installed. Sadly the build environment does not include Deno yet.

I could just build locally and upload static files. However, pushing source to Github with continuous deployment makes me feel like a professional. As it turns out I can just download and run any old binary.

```toml
# netlify.toml
[build]
  publish = "./public"
  command = "./src/deno/netlify.sh"
```

```shell
#!/bin/bash
curl -fsSL https://deno.land/x/install/install.sh | sh
/opt/buildhome/.deno/bin/deno --version
```

This adds an extra minute to the build. Not ideal but I do get plenty of free build minutes with Netlify. I could add the binary to my Git repo — I think Netlify does some caching between builds. That wouldn't be nice to maintain (not to mention it's 75MB (unzipped)).

Anyway, if you use Node keep an eye on Deno. It has momentum.
