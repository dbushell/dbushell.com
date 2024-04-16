---
date: 2024-04-16 10:00:00+00:00
slug: htmx-and-modern-javascript
title: 'HTMX Is So Cool I Rolled My Own!'
description: 'The one where I reject JavaScript UI libraries'
---

[HTMX](https://htmx.org/) is hot right now. HTMX rejects modern JavaScript UI in favour of server-rendered HTML. It's not a new concept it's an evolution of old ideas. It builds on how we did things before the front-end got all bloated with React.

Popular HTMX examples are infinite scroll, live search results, etc. I must have implemented those a 100 different ways. I wish I had HTMX ten years ago. HTMX does not solve all of the problems that React et al. try to solve. It even appears rather limiting to me. But *within* those limits HTMX is gold.

I like how **Carson Gross** — HTMX author — talks about HTMX on the recent [PodRocket podcast episode](https://podrocket.logrocket.com/htmx-v2-carson-gross). He says HTMX is not a "magic bullet" and:

> I think some of the ideas behind HTMX are probably more important than HTMX

I think so too.

## The Experiment

I wanted to give HTMX a fair try. Reading documentation only goes so far. Actually *using* code is the real test and I found a good use for HTMX.

I recently refactored the server for my self-hosted [podcast web app](https://github.com/dbushell/sauroPod). The previous iteration used [SvelteKit](https://kit.svelte.dev/). I'm a big fan of SvelteKit but it can be overwhelming for smaller websites.

I replaced SvelteKit with my own janky [DinoSsr](https://ssr.rocks/) project I've been hacking away on. I also use it to [build my static site](/2024/02/14/super-fast-builds/) and [serve my bookmark blog](/2024/01/24/cotton-coder/). DinoSsr is primarily server-side. It can serve components as front-end "islands" but they do not provide full page interactivity. This is a problem for my audio player component. It needs to persist as I navigate between pages otherwise the listening experience is swiftly ended.

Let's take a look:

<figure class="Image">
  <img
    loading="lazy"
    decoding="async"
    fetchpriority="low"
    src="/images/blog/2024/sauropod-components.avif"
    alt="sauroPod screenshots"
    width="4012"
    height="2440">
</figure>

The left-hand screenshot about shows the [sauroPod](https://github.com/dbushell/sauroPod) design without annotation. The middle screenshot has all the Svelte components highlighted. SvelteKit magically handled all UI updates and front-end routing. It was really nice; maybe I should have kept it.

The right-hand screenshot highlights my new build. Here only the audio player component has front-end JavaScript. DinoSsr purposefully does not attempt client-side routing. Navigation reloads the entire page ending any playback. Not ideal.

I recognised an opportunity to use HTMX here. I have a handful of pages that differ in the `<main>` section I've highlighted orange on the screenshot above. With HTMX I can progressively enhance links and update this section without reloading the page. Thus keeping the audio component intact.

I tried HTMX and it worked great!

Then I immediately removed HTMX and decided to roll my own.

But first:

## A Few Thoughts on HTMX

In my case HTMX is a replacement for front-end Svelte. But not a 'drop-in' replacement like React would be. It's a dramatic shift in thinking. I find that refreshing.

Although HTMX ships as a JavaScript library to progressively enhance the front-end, most of the HTMX implementation is done on the back-end. HTMX does not prescribe code for the back-end. You must bring your own server templates and configuration.

HTTP requests that serve HTML are effectively the HTMX API. There's nuance in configuring HTTP headers to ensure correct caching. [It's all documented](https://htmx.org/docs/#caching) but I think server related docs should be introduced earlier for JavaScript addicts like myself.

Minor nitpick but I'm not keen on the `hx-*` prefixed HTML attributes where `data-*` should be used (with [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset)). Why use non-standard when a standard exists?

Larger nitpick: HTMX documentation has a lot of `<div>` examples:

```html
<div hx-put="/messages">
    Put To Messages
</div>
```

> When a user clicks on this div, issue a PUT request to the URL /messages and load the response into the div

Did I mistake this for a React tutorial? Users should not be *clicking* `<div>` elements.

In my opinion some of the more advanced HTMX examples using inline JavaScript get a bit nasty. Those show the limits of declarative attribute templating.

Criticisms aside, I think HTMX offers a limited but useful feature set that can enhance many common web design patterns. If I hated it I wouldn't take the time to blog about it!

## Rolling My Own

So anyway, immediately after successfully adding HTMX I removed it! I had so much fun I decided to write my own mini version using the same ideas.

I used the same `last-modified` and `if-modified-since` HTTP headers and `304` response to allow caching fetch requests. I used [`pushState`](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState) and [`popstate`](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event) for basic history integration. I added a bit of code to extract and replace `<title>` elements. Inspired by the [HTMX preload extension](https://htmx.org/extensions/preload/) I built in preloading using pointer events. This gives a little performance boost by starting the fetch request before the `click` event is fired. I suspect as I dogfood my implementation I'll find stuff I've missed. It's working well so far.

[Source code](https://github.com/dbushell/sauroPod/blob/main/src/browser/state.ts) for my experiment is on GitHub. It's very basic but it demonstrates how little JavaScript is actually needed in the browser. By using HTMX — or *"we have HTMX at home"* — my codebase has become much smaller and simpler.

## Front-end JavaScript

Templates and 'components' are practically necessary to organise and reuse code for all but the smallest of websites. That can be done server-side using PHP, Ruby, Go, anything, even JavaScript. Does that need to be replicated in the browser? Or worse, *only* in the browser? With the popularity of React et al. many of us have stopped asking that question.  This project has reminded me the answer is an emphatic *No*.

Front-end JavaScript fatigue is real. I'm guilty myself of over-engineering JS UI despite preferring good old server templates. I don't even think HTMX is that good but the philosophy behind it embarrasses the modern JavaScript developer. For that I appreciate it very much.
