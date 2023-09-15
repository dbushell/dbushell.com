---
date: 2023-06-26 10:00:00+00:00
slug: sveltekit-oauth-deno-deploy
title: 'SvelteKit and Deno with OAuth and Deploy'
description: 'The one where I am all about server side JavaScript'
---

I'm a fan of [Svelte](https://svelte.dev/) and [SvelteKit](https://kit.svelte.dev/). They're frameworks that work well for both static sites and server-side rendering. The "DX" (developer experience) is way more enjoyable than anything I've done with any React framework.

I've had the opportunity to work on a few SvelteKit projects now. Although I can't share the specific clients I've published a couple of GitHub repos to share more generic and experimental code. I've been having fun mixing SvelteKit with [Deno](https://deno.land).

**In this blog post I discuss:**

* Deploying SvelteKit to Deno Deploy
* Implementing *"Login with GitHub"* for SvelteKit
* Deno for local SvelteKit development
* and more!

## SvelteKit Deno Adapter

I've published a SvelteKit adapter that works with Deno & [Deno Deploy](https://deno.com/deploy). Adapters transpile and bundle the code for a specific platform to serve.

See my project [**sveltekit-adapter-deno**](https://github.com/dbushell/sveltekit-adapter-deno) on GitHub.

There is already [svelte-adapter-deno](https://github.com/pluvial/svelte-adapter-deno) but it doesn't currently work for Deno Deploy. After a lot of digging around [I contributed findings to the issue](https://github.com/pluvial/svelte-adapter-deno/issues/40#issuecomment-1562442842). I've decided to maintain my own project for now. I would have preferred to submit a pull request but my "fix" left basically nothing of the original code. Plus I wanted to experiment with a few ideas and understand the nuances of coding an adapter.

I'm not sure how long I will maintain this going forward. If you need a Deno Deploy adapter keep an eye on both projects.

## SvelteKit Auth

I've published a second repo: [**sveltekit-auth**](https://github.com/dbushell/sveltekit-auth).

It's a barebones SvelteKit app with [GitHub OAuth login](https://docs.github.com/en/apps/creating-github-apps/writing-code-for-a-github-app/building-a-login-with-github-button-with-a-github-app). I've deployed the [demo app](https://sveltekit-auth.deno.dev/) on Deno Deploy. It provides an example of the OAuth login flow and nothing more. Other providers could be implemented in a similar fashion.

It uses the [Authorization Code Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow) and stores the access token in an encrypted server cookie. This is neat because the client is never exposed to the unencrypted token. No malicious browser code can read it. The server does not store the token so SSR on Deno Deploy (or other hosts) is possible with no persistent server-side session data.

How useful is that? I'm not sure, because obviously you'd need some sort of 3rd party data API to do anything useful after login. Theoretically you could provide functionality without storing identifiable user data.

## Local Deno Development

After coding the auth example, [Deno KV](https://deno.com/kv) was introduced, along with an example [Deno KV OAuth](https://github.com/denoland/deno_kv_oauth) project which looks very promising!

Bundled code from [my SvelteKit adapter](https://github.com/dbushell/sveltekit-adapter-deno) would have access to `Deno.openKv` once deployed. Local development is trickier because both SvelteKit and Vite assume to be operating in the Node.js runtime. Thankfully Deno has spent months improving Node and NPM compatibility and can now run Vite to some extent.

Add `deno.json` to the SvelteKit app route:

```json
{
  "tasks": {
    "dev": "deno run --allow-all --unstable --node-modules-dir npm:vite dev"
  }
}

```

Then you can run `deno task dev`. Or just `deno run...` directly without the file above. You'll see Deno even creates a `node_modules` directory. How perverse! SvelteKit server routes can now access the Deno global namespace.

VS Code development is not perfect if you're using TypeScript. If you toggle the `deno.enable` for the [Deno extension setting](https://deno.com/manual@v1.34.3/references/vscode_deno#configuring-the-extension) you'll get import errors. Module import errors can be "fixed" with the `npm:` prefix:

```js
import {json} from 'npm:@sveltejs/kit';
```

This fixes typing even though it's not actually necessary because `deno` is run with `--node-modules-dir`. There are still errors with generated types like:

```js
import type {PageLoad} from './$types';
import {PUBLIC_ORIGIN} from '$env/static/public';
```

I read up on [how SvelteKit does this](https://svelte.dev/blog/zero-config-type-safety) and I'm not sure how to fix it for the Deno language server. So perhaps it's better not to enable the Deno VS Code extension. So rather than adding SvelteKit typing to Deno, let's try the opposite.

It's possible to add internal Deno types to SvelteKit. In the project root run:

```sh
deno --unstable types > src/deno.d.ts
```

This file will get picked up by the SvelteKit auto-generated `tsconfig.json`. Now we have local SvelteKit development with Deno and TypeScript!

Unfortunately I haven't had success yet running `vite build` with Deno. For now Node is required for the production build step. I plan to research further as I'd like to get it working!

The effort I go through to avoid Node...

In all seriousness I actually just use Node for client projects. VS Code [developer containers](/2023/06/08/dev-containers/) are perfect to sandbox the dev environment.

## Alternatives and WebAuthn

For OAuth I tried [Auth.js](https://authjs.dev/) — originally NextAuth.js. It looks promising but I found too many issues and broken documentation links. There's still some work needed to transition it away from a Next.js specific library I suspect.

[Pass Keys](https://passkeys.dev) and [WebAuthn](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API) are the new hotness. I was somewhat successful implementing a prototype login flow with SvelteKit. However the requirements are too varied to "roll your own". I found the [SimpleWebAuthn](https://simplewebauthn.dev) project and am toying with that but it's not quite as plug-and-play as I'd hoped. You do need somewhere to store user data. Webauthn basically replaces storing user passwords with public keys.

## Interested?

I'm open for business so [please contact me](/contact/) if you're looking to build a website. SvelteKit may just be the solution for you!
