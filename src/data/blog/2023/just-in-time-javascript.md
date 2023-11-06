---
date: 2023-11-06 10:00:00+00:00
slug: just-in-time-javascript
title: 'Just-in-Time JavaScript'
description: 'The one where I render JavaScript on the fly'
---

Static site generators are cool but they require a build step.

Frameworks like [SvelteKit](https://kit.svelte.dev/) use [Vite](https://vitejs.dev/). For development, Vite basically does the build in the background. It caches and compiles to disk. It uses fancy tricks like *hot module replacement* to streamline the dev experience. Spicy. When it's time to deploy to production there is a slow build step to generate static files.

Frameworks like [Fresh](https://fresh.deno.dev/) boast *"just-in-time rendering"*. Instead of a build step, requests are built and served on the fly. Fresh uses [esbuild](https://esbuild.github.io/) WASM to bundle and render [Preact](https://preactjs.com/). The "build" still happens, and can be cached, it's just less intrusive to deployment.

I like the idea of rendering server side Svelte templates just-in-time. That's basically how PHP works! Let's do it ourselves.

First requirement:

## Dynamic Imports

A single Svelte component eventually compiles into a pure JavaScript function that returns an HTML string. For now forget the framework and focus on a render function:

```javascript
function render() {
  return '<h1>Hello, World!</h1>';
}
export default render;
```

I need to import this and call `render()`.

Obviously you might think:

```javascript
import render from './component.js';
render();
```

But eventually this code will be the output of some compilation and never written to a file. For that I need to use dynamic imports.

Here's one way:

```javascript
const code = `
function render() {
  return '<h1>Hello, World!</h1>';
}
export default render;
`;
const url = `data:text/javascript;base64,${btoa(code)}`;
const mod = await import(url);
console.log(mod.default());
```

I'm using the [native base64](https://developer.mozilla.org/en-US/docs/Web/API/btoa) global function for this example. In practice I would use something like `encodeBase64` from the [Deno standard library](https://github.com/denoland/deno_std/blob/main/encoding/base64.ts) (it's cross-runtime). I'm not sure if base64 it technically required.

This may also work:

```javascript
const url = `data:text/javascript,${code}`;
```

Data URI imports are supported by Deno, Node, Firefox, Chromium browsers, and Safari. The Safari dev console required me to wrap it in an async function. Only Bun errors.

Using a data URI feels a little hacky — I don't know, is it?

Another way is to use a `Blob`:

```javascript
const code = `
function render() {
  return '<h1>Hello, World!</h1>';
}
export default render;
`;
const blob = new Blob([code], {type: 'text/javascript'});
const url = URL.createObjectURL(blob);
const mod = await import(url);
URL.revokeObjectURL(url);
console.log(mod.default());
```

Now that feels like I'm JavaScripting correctly!

This works in all browsers. Bun errors again, as does Node this time (not supported yet). I've opened a [Bun GitHub issue](https://github.com/oven-sh/bun/issues/6851). Bun has the same issue creating dynamic Workers.


Some JavaScript environments, namely Deno Deploy, do not support this. Deno Deploy only allows [statically analyzable](https://deno.com/deploy/changelog#statically-analyzable-dynamic-imports) dynamic imports. What I'm doing is the complete opposite. It's worth noting Deno Deploy is a hosting platform — not a requirement to use the Deno runtime itself. You can host full-fat Deno anywhere.

There is another technique that works everywhere.

**The wrong way:**

```javascript
const code = `
globalThis['render'] = function() {
  return '<h1>Hello, World!</h1>';
}`;
eval(code);
console.log(render());
```

[MDN eval documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) has a whole article on the global `eval()` function. An interesting read, TL;DR: **never use eval**. It is very bad practice.

The better way:

```javascript
const code = `
'use strict';
function render() {
  return '<h1>Hello, World!</h1>';
}
return {default: render};
`;
const mod = Function(code)();
console.log(mod.default());
```

This is a little safer than `eval` and makes use of the `return` statement to mimic a module export. I would discourage doing this client side in a web browser. Websites should set a [content security policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) to block this entirely.

Anyway, that's dynamic imports. Let's take a step back to where the render function came from and why this is useful.

## Just-in-time Svelte

A Svelte component file is a mix of JavaScript, HTML, and CSS (optional).

Let's use this basic example:

```svelte
<script>
  export let heading;
</script>

<h1>{heading}</h1>
```

To render this component I first need to convert it to pure JavaScript. Thankfully the [Svelte compiler](https://svelte.dev/docs/svelte-compiler) does the hard work for us.

*(I'm using Deno for the following examples.)*

```javascript
import * as svelte from 'npm:svelte/compiler';

const component = `
<script>
  export let heading;
</script>
<h1>{heading}</h1>
`;

let {js: {code}} = svelte.compile(component, {
  generate: 'ssr'
});

console.log(code);
```

This will output the Svelte component code:

```javascript
import { create_ssr_component, escape } from "svelte/internal";

const Component = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { heading } = $$props;
  if ($$props.heading === void 0 && $$bindings.heading && heading !== void 0) $$bindings.heading(heading);
  return `<h1>${escape(heading)}</h1>`;
});

export default Component;
```

The `create_ssr_component` function is what generates the actual render function when this code is imported and executed. I can do that by using the technique demonstrated earlier.

```javascript
import * as svelte from 'npm:svelte/compiler';

const component = `<script>export let heading;</script><h1>{heading}</h1>`;

let {js: {code}} = svelte.compile(component, {generate: 'ssr'});

// Fix the dependency import path for Deno
code = code.replace('"svelte/internal"', '"npm:svelte/internal"');

const blob = new Blob([code], {type: 'text/javascript'});
const url = URL.createObjectURL(blob);
const mod = await import(url);
URL.revokeObjectURL(url);

console.log(
  mod.default.render({
    heading: 'Hello, World!'
  }).html
);
```

This will output the rendered HTML:

```html
<h1>Hello, World!</h1>
```

Pretty simple, right? I'm rendering Svelte on the fly without writing to disk. However, using Svelte to template an entire web page is going to take multiple components.

Let's compile this example:

```svelte
<script>
  import Heading from './header.svelte';
</script>

<Heading text="Hello, World!" />
```

The resulting JavaScript:

```javascript
import { create_ssr_component, validate_component } from "svelte/internal";

import Heading from './header.svelte';

const Component = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Heading, "Heading").$$render($$result, { text: "Hello, World!" }, {}, {})}`;
});

export default Component;
```

Do you see the problem? The Svelte compiler is not a bundler.

In this example it does not handle the `Heading` child component. Trying to import this code will error because the relative `./header.svelte` import does not exist. And even if it did, it's not JavaScript yet. I would need to recusively compile and bundle all sub-components into a single file.

## Bundling

As mentioned earlier, The Fresh framework uses esbuild to compile and bundle Preact. There is a [Svelte esbuild plugin](https://github.com/EMH333/esbuild-svelte) too. I'm actually doing something similar to render [my own website](https://github.com/dbushell/dbushell.com/blob/957f2f3085e22d4af147097ad57db9af8ab52816/src/deno/svelte.ts). Although I'm generating a static site, rather than serving requests on the fly.

In theory bundling Svelte for direct import and render isn't too complicated. Against all common sense I decide to write my own!

Meet the [🐝 Svelte Bumble](https://github.com/dbushell/svelte-bumble) bundler and importer (for Deno).

This is experimental and will never be a serious contender but it's a fun little project. Bumble is extremely fragile right now. It's not parsing any JavaScript; just using regular expressions to find & replace imports and exports.

I've even gone so far as to code my own just-in-time web framework. It's like a lightweight mix of ideas from Fresh and SvelteKit. Take an early look at [🦕 DinoSsr](https://github.com/dbushell/dinossr/) if you're curious. Right now DinoSsr only generates static sites. I will probably just use esbuild in the end so I can deliver front-end bundles for hydration.
