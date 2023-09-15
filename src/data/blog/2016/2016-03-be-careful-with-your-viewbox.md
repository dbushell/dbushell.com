---
date: 2016-03-01 10:00:00+00:00
draft: false
slug: be-careful-with-your-viewbox
template: single.html
title: 'Be careful with your viewBox'
---

In Sara Soueidan's article: [SVG Style Inheritance and the ‘Flash of Unstyled SVG’](https://sarasoueidan.com/blog/svg-style-inheritance-and-FOUSVG/), Sara explains the importance of having `width`, `height`, and `viewBox` attributes on SVG elements. This reminded me of two issues I ran into last week building my [new design](/2016/02/29/a-bit-of-a-new-look/).

I have an SVG sprite for social icons:

<div class="b-boxed social">
  <style scoped>
  .svg-icon  { display: inline-block; vertical-align: top; margin: 0 2px; width: 42px; height: 42px; fill: #ff6680; }
  </style>
  <svg class="svg-icon" role="presentation">
    <use xlink:href="/assets/img/icons.svg#twitter"></use>
  </svg>
  <svg class="svg-icon" role="presentation">
    <use xlink:href="/assets/img/icons.svg#github"></use>
  </svg>
  <svg class="svg-icon" role="presentation">
    <use xlink:href="/assets/img/icons.svg#codepen"></use>
  </svg>
</div>

These three icons live within a single file (see Sara's guide to [SVG sprites](https://24ways.org/2014/an-overview-of-svg-sprite-creation-techniques/)). To reused an icon is as simple as referencing it like so:

````markup
<svg>
  <use xlink:href="icons.svg#twitter"></use>
</svg>
````

With CSS I can style the size and colour of individual icons, amongst other properties. At least that is the basic principle. Of course, when your asset pipeline is a mess of custom node scripts, what's eventually rendered in the browser can be a delightful surprise.

**My icons weren't displaying at all.**

I checked my SVG sprite source and it looked correct:

````markup
<svg xmlns="http://www.w3.org/2000/svg">
    <symbol id="twitter" viewbox="0 0 34 28">
        <!-- [path data] -->
    </symbol>
    <symbol id="github" viewbox="0 0 28 28">
        <!-- [path data] -->
    </symbol>
    <symbol id="codepen" viewbox="0 0 28 28">
        <!-- [path data] -->
    </symbol>
</svg>
````

I checked my minified SVG sprite source and it looked suspiciously empty:

````markup
<svg xmlns="http://www.w3.org/2000/svg">
</svg>
````

If you're using a minifying tool based on [SVGO](https://github.com/svg/svgo) you need to disable a couple of plugins ('cleanupIDs' and 'removeViewBox'). This will ensure the `<symbol>` elements are not removed from your sprite.

That fixed, I refreshed to find my icons were now visible but not scaling correctly. Regardless of what CSS `width` or `height` values I set they refused to listen. After a brief spell of bewilderment I realised that my minified sprite was still missing the `viewBox` attributes on each `<symbol>`. Browsers will not scale SVG without this attribute.

Why was it being removed? That's because — and this took me an embarrassingly long time to notice — my `viewbox` attributes were lower-case. From testing it seems browsers don't actually care but SVGO is case-sensitive in this scenario. Not recognising the lower-case `viewbox` it was being removed.

I've uploaded an example on [CodePen](http://codepen.io/dbushell/pen/EKaRaV/) to demonstrate:

<iframe width="100%" height="268" scrolling="no" title="SVG icon sprite test case" src="//codepen.io/dbushell/embed/EKaRaV/?height=150&theme-id=0&default-tab=result&embed-version=2" frameborder="no" allowtransparency="true" allowfullscreen="true">See the Pen <a href="https://codepen.io/dbushell/pen/EKaRaV/">SVG icon sprite test case</a> by David Bushell (<a href="https://codepen.io/dbushell">@dbushell</a>) on <a href="https://codepen.io">CodePen</a>.</iframe>


I suppose I've learnt two important lessons here:

* Never remove the `viewBox`
* Beware of meddling tools that do!

It's funny how long front-end problems can take to debug. I sat there comparing my website to a previous one I'd built playing spot-the-difference for the longest time. The solution was no more than a capital "B".
