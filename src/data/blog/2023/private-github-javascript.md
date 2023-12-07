---
date: 2023-12-07 10:00:00+00:00
slug: private-github-javascript-imports
title: 'Private GitHub and JavaScript Imports'
description: 'The one where I generate auth tokens'
---
Are you using GitHub as a poor CDN?

For example I could import my new [VelociRouter](https://github.com/dbushell/velocirouter) project:

```javascript
import {Router} from 'https://raw.githubusercontent.com/dbushell/velocirouter/v0.5.1/mod.ts';
```

The GitHub URL is even versioned using a git tag. However, `raw.githubusercontent.com` is not a good CDN because it lacks appropriate cache headers and it serves code with a `text/plain` content type. Regardless, it's still a useful place to publish code during development, even using private repositories.

If you try to access a private GitHub repo URL you'll see a `?token=` query string attached. These tokens are short-lived, maybe 10 minutes, after which the URL returns 404. It's possible to create a longer lasting token to use with `import` and `fetch`.

*BTW: VelociRouter is now public and published as a [3rd party Deno module](https://deno.land/x/velocirouter@v0.5.1) and as [velocirouter-js on NPM](https://www.npmjs.com/package/velocirouter-js). More on that in another post!*

## GitHub Token

The first thing you need is a GitHub token. The newer *"Fine-grained token"* is the least privileged and can be locked down to specific repos. GitHub likes to move settings but you can currently find that under:

*Settings > Developer Settings > Personal access tokens > Fine-grained tokens*

The only permission you need to select is *"Contents"* with *"Access: Read-only"*. This will automatically select *"Metadata"* as an additional mandatory permission.

<figure class="Image">
  <img
    loading="lazy"
    src="/images/blog/2023/github-permissions.avif"
    alt="GitHub access token permissions"
    width="774"
    height="298">
</figure>

## Token Usage

You can test it with <code>curl</code>:

```bash
curl -H "Authorization: Bearer github_pat_XXX" https://raw.githubusercontent.com/.../code.js
```

Add a real URL of course. You can <code>fetch</code> anything:

```javascript
const token = 'github_pat_XXX';
const url = 'https://raw.githubusercontent.com/.../code.js';
const response = await fetch(url, {
  headers: {
    authorization: `Bearer ${token}`
  }
});
```

Deno has the `DENO_AUTH_TOKENS` env variable. See [Private Modules and Repositories](https://docs.deno.com/runtime/manual/basics/modules/private) for documentation. This can be added to the shell environment:

```bash
export DENO_AUTH_TOKENS="github_pat_XXX@raw.githubusercontent.com"
```

Deno uses this token when importing modules from that URL hostname. Other sources can be added using a semi-colon delimiter.

There is probably a way to do this with Node but package dependencies and ES modules in Node are a mess I don't care to work with.

I've found this useful for GitHub actions when I run build scripts that need access to private repos. Tokens can last up to a year, plenty long enough to forget it exists and wonder why the build has broken.
