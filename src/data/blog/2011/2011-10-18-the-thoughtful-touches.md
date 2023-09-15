---
date: 2011-10-18 19:59:22+00:00
excerpt: None
slug: the-thoughtful-touches
template: single.html
title: The Thoughtful Touches
---

I just finished building a website!

I'm afraid it's not live just yet but there are a few thoughts I'd like to share, so if you can get your imagination running I promise not to waste your time! (No refunds.)

It's different than other websites I've built because it's 90% photography — think fullscreen slideshows. While the website is 100% fluid (no breakpoints in CSS layout) there are breakpoints in functionality. Our CMS can generate and cache an image at various sizes which allows me to provide JSON data containing URLs for small, medium & large images. JavaScript detects the browser width and generates the gallery. See [Jason Grigsby's responsive image research](http://www.cloudfour.com/responsive-imgs/) for more techniques.

I've also optimised the animation speed at different breakpoints.

A 1280px image that slides in stage-right on a desktop needs far more transition time than a 320px image on a mobile screen. If both were to take one second, the large image/screen combo would slide across lightning fast while the smaller experience would crawl. Animations adjust responsively to keep speed relative.

I wrote the entirely gallery from scratch because I couldn't find anything that performed well enough. JavaScript animations lag too easily. CSS transitions & 3D transforms came to the rescue (touch events are not for the faint-hearted) but that's for another article! [Supersized](http://www.buildinternet.com/project/supersized/) and [PhotoSwipe](http://www.photoswipe.com/) are similar projects; I'll probably release mine soon.

The whole thing works perfectly right down to IE7. It's even accesible without JavaScript (one full size image instead of the slideshow).

It is however, _best viewed_ on an **iPhone** or **iPad**.

The transitions, animations, and touch events offer an exceptional user experience. The breakpoints (image size and effect speed) are all optimised around Apple's devices. The iPhone 4 even gets its own high-res logo and sprite. These devices received a lot of attention.

## Wait, One Web?

Why so much focus on Apple devices if we're suppose to subscribe to the "one web" philosophy?

Here's the thing: the two ideas are not necessarily mutually exclusive. The website is fully accessible, fully future-proof. Every page and photo has its own URL. While JavaScript and CSS3 makes the site feel silky smooth, neither are required — but there are **three** fallback techniques to ensure interactivity.

When you get the basics right is there any reason not to go the extra mile for specific devices? Particularly when the client and the users have specific uses in mind. (This particular website will be heavily demoed on an iPad.) I've always taken the progressive enhancement approach and opted for feature detection over device detection (none of that here) but I've never thoroughly consider device _optimisation_ until now. It's fairly easy to pick breakpoints that verge on some average, but there's always an opportunity to consider the best possible experience on specific devices and browsers. After all, is that not what we do with IE stylesheets? Sometimes the average doesn't suit anything.

There is "one web" but there is only one device in the user's hand. Relying on a specific device or browser is bad, offering something special when possible is not.

* * *

I would highly recommend watching Aral Balkan's talk "The Future is Native" from Fronteer 2011. The first 20 minutes sums up the perfect attitude towards user experience and he really makes you think about the crossover between native and the web. His notion "write once, optimise everywhere" is a great thought.

<p class="b-post__image"><span class="b-fitvid" style="padding-top:56.25%"><iframe src="https://player.vimeo.com/video/30659519?title=0&byline=0&portrait=0" frameborder="0" width="400" height="225"></iframe></span></p>

[Aral Balkan | The Future is Native | Fronteers 2011](http://vimeo.com/30659519) from [Fronteers](http://vimeo.com/fronteers) on [Vimeo](http://vimeo.com).

* * *

Oh, and I'll show off the website I'm talking about as soon as it launches!
