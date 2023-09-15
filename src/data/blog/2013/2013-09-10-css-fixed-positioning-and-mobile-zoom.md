---
date: 2013-09-10 09:01:21+00:00
excerpt: None
slug: css-fixed-positioning-and-mobile-zoom
template: single.html
title: CSS Fixed Positioning and Mobile Zoom
---

**The follow demo is a quick experiment!** _I'm not sharing code because it's horrible and I don't want emails asking if I've got it working on a Blackberry._

Mobile web browsers, unless otherwise informed, will assume a website has been designed for larger screens. They'll render on a large canvas and zoom out. Responsive websites use the [meta viewport tag](https://developer.mozilla.org/en-US/docs/Mozilla/Mobile/Viewport_meta_tag) to tell browsers: "Hey, render at the device width and don't scale please."

````markup
<meta name="viewport" content="width=device-width, initial-scale=1">
````

While the user no longer needs to zoom & pan they still have this ability should they desire it. It _can_ effectively be disabled with the meta tag:

````markup
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
````

But this degrades accessibility for no good reason. **Don't do it.**

## Fixed positioning

A casualty of this set up is [CSS fixed positioning](http://bradfrostweb.com/blog/mobile/fixed-position/). Though not often used to good effect, fixed navigation can be quite appealing on small screens where scrolling back up the the header is tedious. It's more "app like".

**Screens 1 & 2** below show the navigation element fixed to the viewport as the page scrolls. Ignore the page content, those numbers were useful for debugging!

**Screen 3** shows the disaster that is user zooming and fixed elements. **Screen 4** shows my hack (what I hypothesised to be a more desirable result).

![CSS fixed position](/images/blog/2013/css-fixed-position1.png)

Technically what mobile browsers are doing is not a bug. It is the correct result but unfortunately not a nice one.

## How my prototype works

What I'm doing is calculating the zoom level (poorly) with JavaScript and then applying CSS transforms to scale the fixed element back down to normal size. As you might expect there is no smooth transition during zoom. There are a whole host of bugs and edge cases. I've not even attempted cross browser support (hence no code).

## Future merit

After hacking together this prototype I'm not convinced this idea can be achieved to any working effect cross browser and I'm not going to pursue it further. On deeper consideration I'd say it's best just to hide any fixed elements if the user zooms the main content.

**Update:** after Googling I see [PPK on Quirks Mode](http://www.quirksmode.org/blog/archives/2010/12/the_fifth_posit.html) gave this a shot a few years ago. I like his suggestion for `position: device-fixed` or at least some kind of native CSS support.
