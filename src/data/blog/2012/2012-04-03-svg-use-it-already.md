---
date: 2012-04-03 13:10:11+00:00
excerpt: None
slug: svg-use-it-already
template: single.html
title: SVG, Use it Already
---

Here's the deal: there's no reasonable excuse to avoid using SVG for vector graphics on the Web (with a PNG fallback, primarily for IE < 9 and older Android).

While there are legitimate design problems when using one single file with [icons at multiple sizes](http://www.pushing-pixels.org/2011/11/04/about-those-vector-icons.html), this is not unique to SVG and in the land of — for all intents and purposes — **infinite zoom levels and resolution densities**, retreating back to a single "pixel-perfect" bitmap is not a better option. Cross browser support for [media queries with SVG](http://my.opera.com/ODIN/blog/2009/10/12/how-media-queries-allow-you-to-optimize-svg-icons-for-several-sizes) may one day solve this issue. For now, just use multiple files for an icon used at vastly different sizes (you'd have to do that anyway with bitmaps).

Have a look at The Font Bureau's type specimen for [Neue Haas Grotesk](http://www.fontbureau.com/NHG/specimens/). A perfect example of when SVG just makes sense. Another great place to start using SVG is with a website's logo. That little brand mark that probably reigns in the top-left corner of a website? I'm sure the client would love to see that nice and crisp. Just do it already!

I know SVG is not perfect. There's no hinting; the holy grail of [pixel-perfection](http://simurai.com/post/19895985870/icon-sharpness-limbo) cannot be guaranteed. There's annoying [browser bugs](/2012/03/11/svg-all-fun-and-games/) that potentially mess up the whole scalability thing. But when you actually compare an SVG to a PNG implementation across multiple devices there's only one winner. A bitmap offers a single point at which it isn't blurred, vectors increase that range indefinitely.

When you consider the amazing things we'll be doing with SVG in the future — [animation and scripting](http://blogs.adobe.com/webplatform/2012/03/30/svg-animations-css-animations-css-transitions/) and [sprite stacks](http://simurai.com/post/20251013889/svg-stacks) to name just two — **it's time to start learning now**.

## Fallback Techniques

When using SVG with a CSS `background-image` providing a fallback using the fine art of feature detection is very easy. Use [Modernizr](http://modernizr.com/) to add the `.svg` class to the `<html>` element then you have a hook to specify both sources. If the class is added before the default styles are applied modern browsers won't download both images or flash any content (so put Modernizr in your `<head>`). If you decide to go PNG by default the rare case of no JavaScript and no SVG is covered.

Using SVG with `<img>` elements is a little trickier if you require a bitmap fallback. Start studying the latest techniques for [responsive images](http://www.alistapart.com/articles/responsive-images-how-they-almost-worked-and-what-we-need/) and their [possible solutions](https://github.com/adamdbradley/foresight.js).

SVG is here and it's widely supported.

Oh! By the way, if you do know a legitimate reason to avoid SVG leave a comment :)
