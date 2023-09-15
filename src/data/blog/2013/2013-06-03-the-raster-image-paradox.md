---
date: 2013-06-03 15:43:34+00:00
excerpt: None
slug: the-raster-image-paradox
template: single.html
title: The Raster Image Paradox
---

The recent [Clown Car Technique](http://coding.smashingmagazine.com/2013/06/02/clown-car-technique-solving-for-adaptive-images-in-responsive-web-design/) is a clever use of SVG but as with all "adaptive image" solutions for responsive web design it's not something I'd be comfortable using.

## One image to rule them all

When I build web pages I generally come to the conclusion that using a single image is a sensible bet. Nothing fancy, just a good ol' accessible image element:

````markup
<img src="handshake.jpg" alt="an ethnically diverse handshake">
````

Even at the possible expense of wasted bandwidth and low definition — heck, even up-scaling — this introduces less complexity and concern than any "responsive/adaptive image" technique I've seen to-date. They're all hacks. They all break things. Even the web standard proposals can't decide which image would be appropriate to load. Too many edge cases. Are users even going to notice less than perfect image definition? Does a fast connection and high pixel density mean users even want higher quality? Not likely on [mobile data plans](/2012/10/23/the-real-cost-of-retina/).

Here's what I do. I recognise the web as it is today and design for a suitable average. This requires a bit of performance calorie counting. But guess what? The web has limitations. Sometimes I'll opt for a technique to load variations but it's far from a default requirement.

## Give it a few years

I've [always hated](/2012/07/13/vector-graphics-retina-and-you/) the buzzword Retina® when used in lieu of "high pixel density". The point at which pixels become distinguishable relates directly to density and distance from the eye. Despite the advertising nothing we see today is close to perfection. The iPhone 4 first introduced Apple's Retina screen which packed twice the number of pixels compared to past iPhones. Many other manufacturers have devices that surpass the iPhone Retina pixel density. We will see density double again soon ([here's a rumour](http://appleinsider.com/articles/13/05/28/rumor-apple-to-double-iphone-5s-retina-resolution-to-15m-pixels)).

When ultra-high pixel density screens appear on the market are we suppose to provide an "@4x" version of all raster images on the web? There's no magic compression algorithm that will keep file size down. Are we to expect connectivity to improve at the same pace?

We may find techniques of the Clown Car variety useful in small doses but regardless of what's a hack and what's a web standard, nothing will "solve" adaptive images. The real solution will always be a sensible medium. An intelligent consideration for budget. That solution exists today.
