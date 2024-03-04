---
date: 2024-02-16 10:00:00+00:00
slug: jsr-first-impression
title: 'JSR: First Impressions'
description: 'The one where I try out a fancy new JavaScript repository'
---

Until now [Deno](https://deno.com/) did not have or need a package registry. That may be changing with [JSR](https://jsr.io/) — *one JavaScript Registry to rule them all...*

In the early days of Deno you would import dependencies from a URL:

```javascript
import * as fs from 'https://deno.land/std@0.216.0/fs/mod.ts';
```

This freaked developers out. But it's actually no less secure than installing from `npm`. It's just more direct and can be tedious with long URLs. It became [convention](https://docs.deno.com/runtime/tutorials/manage_dependencies) to create a `deps.ts` to re-export 3rd party dependencies from one file:

```javascript
// deps.ts
export * as fs from 'https://deno.land/std@0.216.0/fs/mod.ts';
export * as path from 'https://deno.land/std@0.216.0/path/mod.ts';
```

And then import them like so:

```javascript
import {fs, path} from './deps.ts';
```

This practice is helpful to keep dependencies in one place and reduce repetitive code. Later Deno added support for the [Import Maps](https://docs.deno.com/runtime/manual/basics/import_maps) web standard. This JSON file serves a similar purpose to manage dependencies:

```json
{
  "imports": {
    "fs": "https://deno.land/std@0.216.0/fs/mod.ts"
  }
}
```

```javascript
import {ensureDir} from 'fs';
```

Deno provides an official hosting service at [`deno.land/x`](https://deno.land/x) for 3rd party modules. You can even import directly from GitHub with the `raw.githubusercontent.com` URL. I've found JavaScript CDNs like [esm.sh](https://esm.sh) useful for stubborn [CommonJS](https://en.wikipedia.org/wiki/CommonJS) modules.

More recently Deno added support for [package.json](https://docs.deno.com/runtime/manual/node/package_json). Deno development throughout 2023 had a major focus on compatibility with Node and NPM. Now you can import from `npm:chalk` or `node:fs` for example. This has allowed many Node projects to be executed in the Deno runtime.

## So why JSR now?

[JSR](https://jsr.io/) is called the *"JavaScript Registry"* and not the *"Deno Registry"*. That's because it's designed to work with all JavaScript runtimes. Beta invites are going out if you join the waitlist. I've been exploring it this week.

Here is what I understand so far.

### TypeScript

**JSR is TypeScript first.** You can publish a TypeScript package to JSR and import it without compilation or `.d.ts` files. Deno has always been able to run native TypeScript. For JSR in Deno you import using the `jsr:` specifier. For example:

```javascript
import * as mod from "jsr:@std/bytes@0.216";
```

JSR is backwards compatible with Node. You add the registry to `.npmrc`:

```
@jsr:registry=https://npm.jsr.io
```

And then use any Node package manager to install from JSR:

```
npm install @jsr/std__bytes
```

TypeScript packages are automatically compiled to run under Node. This looks like a killer feature to me. Although I rarely code for Node anymore; it still seems to be stuck in Common JS hell. JSR is strictly for ECMAScript modules. Anything that promotes ESM is a good thing in my opinion.

### Compatibility

<figure class="Image">
  <img
    loading="lazy"
    fetchpriority="low"
    src="/images/blog/2024/jsr-package-compatibility.avif"
    alt="JSR package compatibility icons"
    width="522"
    height="132">
</figure>

Packages on JSR have a **"Works with"** label to show compatibility. This must be manually configured and you can lie. I expect that will lead to some pains with unintentional mislabelling, or untested breaking changes leading to incompatibility. I wonder if these labels can be automated? That'd be a lot of work if technically possible.

### Scopes

All package names are scoped with a `@prefix` like my package `@dbushell/carriageway`. Accounts are limited to creating three scopes. Scopes can have multiple members and admins who can manage packages under them.

This helps discourage name squatting a little... maybe? There are only 148 packages published as I write this. Nothing is technically stopping me from yoinking a scope like `@svelte` or `@react`.

I was thinking about using my initials `@db` as my primary personal scope. I opted for `@dbushell` to match my domain and GitHub account. I'll let someone braver take `@db` — hopefully for a worthy database project.

### Documentation

JSR packages can be linked and published from a GitHub repo. See my [Carriageway](https://github.com/dbushell/carriageway/) repository for example. [On JSR](https://jsr.io/@dbushell/carriageway@0.9.0) it looks like this:

<figure class="Image">
  <img
    loading="lazy"
    fetchpriority="low"
    src="/images/blog/2024/jsr-package-documentation.avif"
    alt="JSR package documentation"
    width="1190"
    height="650">
</figure>

The README markdown is front and centre just like the [NPM page](https://www.npmjs.com/package/carriageway). Additional documentation is generated from TypeScript and optional [JSDoc](https://jsdoc.app/) comments. Similar to how Deno's [3rd party hosting](https://deno.land/x/carriageway@v0.8.1/mod.ts) documentation works. This is lovely stuff. My code is self-documenting, after all 😏

You can browse all the source code right on JSR. On NPM only the `files` listed in `package.json` can be browsed — often a compiled & minified "dist" version — which is rather useless. JSR is much smarter about only delivering the necessary files so manual configuration isn't necessary like NPM.

### Where is Bun?

[Bun](https://bun.sh/) is another JavaScript runtime that is TypeScript first like Deno, but implements Node APIs along with it's own. You can use JSR packages via a Node package manager in Bun. However, the types get lost.

<figure class="Image">
  <img
    loading="lazy"
    fetchpriority="low"
    src="/images/blog/2024/jsr-package-bun-ts.avif"
    alt="JSR package in a Bun typescript file"
    width="655"
    height="185">
</figure>

In the screenshot above the first import is my NPM package which I added  manual types with `index.d.ts`. The second import is my JSR package. It exists and the code executes but VS Code is getting confused. JSR is delivering this for Node so the TypeScript is compiled to JavaScript without types. JSR boasts:

> Native TypeScript Integration: Write TypeScript natively without the hassle of creating .d.ts files. It’s TypeScript as it’s meant to be—straightforward and efficient.

But unless I'm doing it wrong (possible), Bun is left in the cold.

Is this something I can solve, or JSR can solve? Or does Bun need to implement additional support for JSR? It's getting late on a Friday so I'll leave those questions open! I'm on [Mastodon](https://fosstodon.org/@dbushell) and [Twitter](https://twitter.com/dbushell) (for now) if you can enlighten me!

I would like to see Bun added to the **"Works with"** compatibility label at least.

### Update for 27 Feb 2024

Bun has now been added! And apparently types have been fixed for NPM installs. I can see type definition files in the node module directory. VS Code is still giving me an error but that's likely a configuration issue on my part.

## Finally

Those are my thoughts on the [JSR JavaScript registry](https://jsr.io/) after using it for a couple of days. You can import JSR packages today without access to the invite-only website. Obviously the site will open to the public at some point.

For Deno and TypeScript coders I think JSR will be the place to publish packages going forward. Especially if they're cross-runtime compatible.

Will JSR ever usurp NPM? Unlikely, but like Deno did, I hope JSR can light a fire under Node & NPM and push them to modernise faster. Node still does not have first class ESM support without a flag. Is there a future where Node, like Bun, has first class TypeScript support? Will types come to the ECMAScript standard? Now I'm dreaming.

Anyway, JSR is neat. TypeScript support and NPM compatibility are the killer features. Other improvements over NPM are small but welcome.

### Update for 4 Mar 2024

I've blogged: [JSR: Second Look](/2024/03/04/jsr-second-look/) with a lot more to discuss!
