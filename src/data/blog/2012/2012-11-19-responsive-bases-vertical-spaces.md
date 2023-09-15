---
date: 2012-11-19 17:45:28+00:00
excerpt: None
slug: responsive-bases-vertical-spaces
template: single.html
title: Responsive Bases & Vertical Spaces
---

Build a **responsive design** and you'll find yourself knee deep in relative units and percentage widths. Media queries are the weapon of choice to adjust CSS on viewport change. Almost every example I've seen (and made) are based exclusively on the viewport width.

What about _height_?

## The Baseline Grid

As an exercise in 'perfection' when I last [updated my website](/2012/02/27/spring-cleaning-redesigning-dbushell-com/) I snapped the vertical rhythm strictly to a typographic baseline grid. In theory this isn't complicated. Just make all vertical spacing a multiple of your line-height. Not that easy in practice. Responsive images and videos — anything with a fluid width and aspect ratio — break the baseline. Trying to maintain it regardless is a headache.

Personally I just don't agree it's worth the hassle. Keep a baseline within textual content areas of course, but across the whole layout? Don't sweat it. Arrange by eye. Or better yet, why not do it _responsively_?

## Responsive Heights

Watch the demo video below and you'll see what I mean.

<p class="b-post__image"><span class="b-fitvid" style="padding-top:56.25%"><iframe src="https://player.vimeo.com/video/53866112?badge=0&color=ffffff" frameborder="0"></iframe></span></p>

Responsive design on two dimensions. And terrible screen recording, apologies for that but I hope it illustrates the point. This is the first prototype of a website we're building at [Browser](http://www.browserlondon.com) that will go live next year. I'll keep you updated. There's a lot of experimentation to follow.

![Vertical spacing with CSS vh units](/images/blog/2012/vertical-spacing.png)

I define all vertical height, margins, and padding as one would do normally, then I progressively enhance with [viewport-percentage units](http://www.w3.org/TR/css3-values/#viewport-relative-lengths) — e.g. `10vh` being equal to 10% of the viewport height. [Modernizr](http://modernizr.com/) provides the hook (it's a "none-core" detect), but you can just write two declarations with the fallback first. Web browsers ignore the second if unsupported.

In the demo above I'm using JavaScript to scale the headline text a la [FitText.js](http://fittextjs.com/) but you could potentially use viewport units to achieve this.

For further tuning use **min/max-height** to limit the range, or scope the style with **height-based media queries**. In my opinion these techniques are massively under-explored. Show me what you can do!

Of the [supporting browsers](http://caniuse.com/#search=vh) Internet Explorer 9 worked without issue. Chrome seems to occasionally fail to repaint on viewport resize. Not a huge issue, I'm considering forcing a repaint with a little bit of JavaScript. iOS 6 faired much worse when I tested on the new iPhone. Not only did viewport resize/rotate fail to repaint properly, but the initial values seemed arbitrarily way off. If I can figure out what's going on there I'll post an update. For now I'm doing device detection to remove feature detection, lovely!

## More Reading...

Naturally, Chris Coyier already has an existing demo taking this further with full [Viewport Sized Typography](http://css-tricks.com/viewport-sized-typography/). Paul Boag also wrote long ago about the value of height-based media queries: [Are Media Queries the answer to the Fold?](http://boagworld.com/dev/are-media-queries-the-answer-to-the-fold/)

How responsive can you go?
