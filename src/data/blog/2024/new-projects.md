---
date: 2024-01-08 10:00:00+00:00
slug: new-projects-for-2024
title: 'New Projects for 2024!'
description: 'The one where I start new projects for a new year'
---

Happy New Year! I had free time at the end of 2023. One idea led to another and I ended up writing a new JavaScript web framework. Just what the Internet needs!

The first project is a little smaller in scope:

## VelociRouter

<figure class="Image">
  <img
    loading="lazy"
    fetchpriority="low"
    src="/images/blog/2024/velocirouter-banner.avif"
    alt="VelociRouter website banner"
    width="1080"
    height="406">
</figure>

[**VelociRouter**](https://router.dinoear.com/) is a JavaScript HTTP router inspired by [Polka](https://github.com/lukeed/polka) and [Hono](https://hono.dev/). It takes a `Request` and returns a `Response` using the assigned handlers. What makes VelociRouter unique is that it uses the native [URI Pattern API](https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API) to match routes.

For example:

```javascript
router.get({pathname: '/:name'}, (request, response, {match}) => {
  const {name} = match.pathname.groups;
  return Response.json({message: `Hello, ${name}!`});
});
```

VelociRoute uses native JavaScript objects and does not abstract them in a custom context. This allows you to modify both `request` and `response` as they're passed through matching routes (or return new ones). The project is **beta** status until I finalise the API.

* [VelociRouter documentation](https://router.dinoear.com/)
* [VelociRouter source on GitHub](https://github.com/dbushell/velocirouter)

## DinoSsr

<figure class="Image">
  <img
    loading="lazy"
    fetchpriority="low"
    src="/images/blog/2024/dinossr-banner.avif"
    alt="DinoSsr website banner"
    width="1080"
    height="406">
</figure>

[**DinoSsr**](https://ssr.dinoear.com/) is a small web framework built upon VelociRouter. It started as a proof-of-concept for VelociRouter and has taken on a life of its own.

* Built for [Deno](https://deno.com/) with [Svelte](https://svelte.dev/) server-side templates
* File based + URI Pattern API routing
* Just in time renders (no build step required)
* Easy setup with minimal ceremony

Think of it like a lightweight [SvelteKit](https://kit.svelte.dev/) alternative for primarily static websites. DinoSsr is very much **alpha** status. There are plenty of features I'd like to add but I want to solidify core functionality first. I'm already using DinoSsr for my project websites. I hope to finalise a 1.0 realise this year. I think there are some cool ideas here worth exploring. It's never going to compete with the likes of SvelteKit and it purposefully has a smaller scope.

* [DinoSsr documentation](https://ssr.dinoear.com/)
* [DinoSsr source on GitHub](https://github.com/dbushell/dinossr)

## Pattern Library

I'm sick of [Bootstrap](https://getbootstrap.com/) so I started designing my own personal front-end pattern library. If you had a peek at the homepages for [VelociRouter](https://router.dinoear.com/) and [DinoSsr](https://ssr.dinoear.com/) you'll have seen it. This proved to be the perfect project to brush up on [new web standards](/2023/05/15/css-upgrades-spring-2023-edition/).

I'm using this code alongside DinoSsr for my self-hosted web apps.

<figure class="Image">
  <img
    loading="lazy"
    fetchpriority="low"
    src="/images/blog/2024/homedeck-app.avif"
    alt="smart light control web app"
    width="380"
    height="350">
</figure>

"HomeDeck" is an app to control my lights. It's served by a [Raspberry Pi powering a StreamDeck](/2022/10/14/deno-usb-hid-stream-deck/) for physical buttons. It uses a websocket to [Home Assistant](https://www.home-assistant.io/) hosted on another [Proxmox server](/2023/08/08/adventures-in-windows-proxmox-virtualisation/). The state of proprietary smart home apps is abysmal. Nothing is reliable so built my own solution!

## More...

I also have another project I plan to launch very soon. It will start life as a simple blog but I have much larger plans — we'll see! It may not unfold.

Last year I also released the JavaScript libraries: [XML Streamify](/2023/10/20/xml-streamify/), [Deno Tail Lines](/2023/10/27/deno-tail-lines-2/), and [Carriageway](https://github.com/dbushell/carriageway). I'm having a lot of fun writing server-side JavaScript.
