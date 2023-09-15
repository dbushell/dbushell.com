---
date: 2020-09-07 10:00:00+00:00
slug: getting-svelte-js
title: 'Getting Svelte'
description: 'The one where I roll with two frameworks and rewrite my website in Svelte.'
---

[Svelte](https://svelte.dev/) is a JavaScript framework that has continued to intrigue me.

> Svelte is a radical new approach to building user interfaces. Whereas traditional frameworks like React and Vue do the bulk of their work in the browser, Svelte shifts that work into a compile step that happens when you build your app.

![Svelte logo](/images/blog/2020/svelte-logo-horizontal.svg)

An interesting prospect. If I need interactivity on a website I normally write plain old JavaScript with no framework. If the requirements are more demanding I'll look towards React — but only if the thing is a full-on "web app". There's a large gap between nothing and React. I need to spend more time with Svelte but I'm starting to see it as a lighter option that fits into that gap.

As an experiment I've started to use **both React & Svelte** to build my website!

Hang on, it's not as ghastly as it sounds...

## Why React?

Personally I've found React to be a rather elegant solution at its core. By that I mean the way you define pure, reusable UI components. Once state and logic gets involved that's another story. It can get ugly, fast.

Where I've found React to be most powerful is **server-side rendering** (SSR). For [dbushell.com](https://dbushell.com) I use it as a templating language for static site generation. It's almost perfect for that job. I find JSX quick and easy to code. A small gripe is the necessity for attributes like `className` and `htmlFor` (in place of `class` and `for`).

For a short time I was shipping the React library to the browser. I was originally doing full hydration with a router to avoid a refresh between page navigation. I dropped that in favour of a normal web experience. It wasn't worth the cost. Now I'm just reviving individual components like my contact form.

```javascript
import ContactForm from './contact-form.jsx';
ReactDOM.hydrate(
  <ContactForm />,
  document.querySelector('#contact-form')
);
```

React is a lot of JavaScript to execute and has a noticeable impact on performance. I switched to [Preact](https://preactjs.com/) to save bytes. However, it still felt expensive for such basic interactivity. I'd usually just write some vanilla JavaScript in this scenario. I do for most client websites. For my personal site I figured it was an opportunity to try something new.

## Why Svelte?

I think Svelte could fit into that gap between nothing and React. Instead of shipping React and a few of my components to the browser, I rewrote them in Svelte.

```javascript
import ContactFrom from './contact.svelte';
const form = new ContactFrom({
  target: document.querySelector('#contact-form')
});
```

This cut my JavaScript bundle size in half — significantly more if I was using full fat React. My Svelte contact form replaces the React server render without attempting any hydration. I've been looking into Svelte hydration but it seems a little under-developed right now. [A GitHub issue](https://github.com/sveltejs/svelte/issues/4308) suggests:

> [...] setting the innerHTML to '' and doing client side render is faster and cleaner

Which is basically my approach.

In truth, my contact form interactivity is so simple using any framework is a bit much. The Svelte cost is a small one so I'll keep it around for now. This experiment has given me better understanding and appreciation for what Svelte does. I'll continue to play with it.

## Svelte SSR

I was tempted to get Svelte SSR working for my entire website. It only took a couple of hours to rewrite my React components. Initial tests show  a **10% faster build**. Granted, both React and Svelte take under one second to build around 300 pages.

If Svelte proves to be as maintainable as React I might just drop the latter. Of course, it's rather impractical and silly to maintain both React and Svelte components. Despite my love for JSX I have to admit that Svelte components may have the edge in readability.

## Early Impressions of Svelte

For sprinkling interactive components onto a web page, Svelte's overhead is minimal and feels more appropriate than React. The coding structure feels more natural too. I like the cleaner separation of JavaScript and HTML. JSX is perfect for templating but difficult to tame the more business logic gets involved. I have yet to dive deeper into state management in Svelte so I can't compare further.

Svelte's claim to compile to "framework-less vanilla JS" is a tiny bit disingenuous. For a start that paints the idea of a "framework" as being a bad thing. Secondly, Svelte actually does bundle a framework of sorts. It's small but it exists. And that's fine, because complexity has to go somewhere. Providing some code abstraction in a framework is a good thing. Svelte hits the sweet spot in this area. It does a lot of clever compile time stuff and makes React's runtime framework look like a monolith.

My default is still vanilla JavaScript but if I need a little more front-end help I'll be reaching for Svelte before I consider React. I didn't think Svelte would work as well for static site generation but I'm close to making the switch.

Whilst I work more with Svelte I'm listening through the back catalogue of the [Svelte Radio podcast](https://www.svelteradio.com/). There I learnt about **Tan Li Hau's** blog series on ["Compile Svelte in your head"](https://lihautan.com/compile-svelte-in-your-head-part-1/) which has been a great resource for me.
