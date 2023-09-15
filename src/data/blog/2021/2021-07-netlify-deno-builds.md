---
date: 2021-07-22 10:00:00+00:00
slug: netlify-deno-builds
title: 'Deno Builds on Netlify'
description: 'The one where I use the new hotness'
---
The [Netlify build environment](https://docs.netlify.com/configure-builds/get-started/#build-image-selection) is a [Docker image](https://github.com/netlify/build-image) with preinstalled packages like Node and Python. For sensible reasons the packages are rather "stable", or "outdated", depending on your sensibilities. Environment variables like `NODE_VERSION=16.5` are used to update dependencies if you live on the edge.

If you live too far on the edge, Netlify doesn't provide enough. [Deno](/2021/03/12/built-with-deno/) is notably missing for my purposes. My website is hosted on Netlify and built with my very own bespoke Deno-powered [scuffed static site generator](https://github.com/dbushell/dbushell.com).

To run Deno on Netlify first configure the build command with a shell script:

```toml
[build]
  command = "./src/build.sh"
```

Then install and run Deno within the script:

```shell
#!/bin/bash
curl -fsSL https://deno.land/x/install/install.sh | sh
export PATH="/opt/buildhome/.deno/bin:$PATH"
deno --version
exit 0
```

Replace `deno --version` with `deno run [...]` to run the actual build.

I'm not sure if updating `PATH` is necessary but it can't hurt and I'm too lazy to test.

In practice it will download Deno with every build along with all external JavaScript imports. Not the most efficient process but my deployment take around a minute tops so it's not a big deal. I could manually cache JavaScript dependencies in the repo which might save a few seconds. Though the idea of a `deno_modules` directory makes me uneasy.

I have a feeling Deno might be officially added to Netlify eventually. Of course, this is all just experimental. Most established build tools are written for Node. I'm really interested in [SvelteKit](https://kit.svelte.dev/) and [Astro](https://astro.build/) right now.
