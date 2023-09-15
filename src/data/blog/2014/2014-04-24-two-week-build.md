---
date: 2014-04-24 09:47:51+00:00
excerpt: None
slug: two-week-build
template: single.html
title: Two Week Build
---

From concept to launch the [new version](/2014/04/21/spring-refresh/) of my website clocked just over two weeks of development time. This article documents assorted aspects of that process.

## Initial Concept

![dbushell.com design in Photoshop](/images/blog/2014/dbushell-photoshop.png)

What you see above is the extent of my ’shopping for the new design. I probably wasted more time setting up those ridiculous guides than I did mocking up the visual concept. Still, for an afternoon's work I found it a worthwhile exercise. I had a checklist in my head of requirements I wanted the new site to address. Getting this far was enough to give me confidence in the design concept.

Rather than aspiring to produce a brand new design from nothing I consider my annual website update as an iteration on what's worked before. Over the year I'll make notes on things I should improve based on what is and isn't performing.

## Code and Content

Whether I'm in Photoshop or a code editor, I try to avoid placeholder content. Grammar and spelling aren't that important at this stage, but rationale is paramount. If I'm designing with nonsense there is no reason for the choices I make.

I gave myself a head start using a stripped back version of my [Tales theme](/2014/02/17/introducing-tales/) (which itself is based of [Origin](/2013/04/30/origin/)). A quick export / import into a local WordPress install gave me a platform with real content to build and design upon.

## Typography

My website is 90% blog which is why the new design is a single layout. Usually I'll set-up a "style guide" page to visualise all typographic elements, but with hundreds of already published articles for reference, this step was unnecessary.

I spent a solid day tweaking CSS until I was happy with font sizes and vertical spacing. I revisited these styles many times later on. In fact, I'm not sure I'm finished yet! A bit of post-launch polish is always good.

Inspired by Marcin Wichary's work at [Medium](https://medium.com/p/7c03a9274f9), I'm using `linear-gradient` to give fine control over hyperlink underlines. Combined with `text-shadow` to clear descenders this is a very pretty technique:

![CSS link styles on dbushell.com](/images/blog/2014/dbushell-link-style.png)

The standard `text-decoration: underline;` is too obtrusive and `border-bottom` tends to sit too low when used with a generous line height.

In the past I've opted to [scope typographic styles](/2012/04/18/scoping-typography-css/). Nowadays I'm in two minds as to whether the pros outweigh the cons. However, in developing this website I've found that only scoping advanced styles is a nice balance. This effect is applied after web fonts have loaded to ensure the background position is correct.

````css
.wf-active .prose a {
  text-shadow: 2px 0 0 #f2f0e6, -2px 0 0 #f2f0e6;
  background-image: linear-gradient(to left, rgba(61, 156, 204, 0.5), rgba(61, 156, 204, 0.5));
  background-position: 0 1.05882em;
  background-repeat: repeat-x;
  background-size: 1px 1px;
}
````

That's some verbose CSS required to restyle against varying background colours (not to mention font size). For this reason I'm using the technique sparingly. At smaller sizes, like the copyright notice, a standard underline suffices.

**Droid Serif** is a personal favourite. The font is free to self-host under the Apache License but I'm using [Typekit](https://typekit.com/) for ease-of-use (and to justify my subscription). Fonts are loaded asynchronously because I'd rather have a flash of content than none at all.

## Performance Budget

Speaking of web fonts, they account for almost 50% of my [home page](/) download. Sounds excessive, but at a grand total of **248kb** my website is positively slim. Given the design's emphasis on typography I find these bytes are well spent.

A run through [WebPageTest](http://www.webpagetest.org/result/140422_NR_MTQ/) gives strong local results:

![dbushell.com performance test](/images/blog/2014/dbushell-webpagetest.png)

Aside from [Varnish Cache](/2013/02/15/performance-varnish-cache-wordpress/) on my server I'm not doing anything special. Typekit and Google Analytics' expire headers are giving me a “C” at the end which isn't too worrying. For a handful of small resources I'm not sure using a CDN is worth the investment, or maybe it is… something I need to explore.

## Inline SVG

I've built many websites with font icons, many others with SVG sprites, but I'm now a full convert to inline SVG using the `<use>` technique (see [Codrops](http://tympanus.net/codrops/2013/11/27/svg-icons-ftw/) and [CSS-Tricks](http://css-tricks.com/svg-sprites-use-better-icon-fonts/) for details). At least for icons that are used globally.

For example, I can reference my navigation icon:

````markup
<a class="nav-open" href="#nav">
    <span>Menu</span>
    <svg viewbox="0 0 35 35"><use xlink:href="#svg--nav"></use></svg>
</a>
````

And I can apply CSS like so:

````css
.nav-open svg {
    fill: #b3b0aa;
}
.no-inlinesvg .nav-open {
    background-image: url("../img/nav.png");
}

````

With feature detection and [automation](/2013/06/10/updates-to-origin/) it takes little effort to provide a fallback PNG.

## jQuery Prototyping

Like Photoshop, my use of jQuery comes more from experience than necessity. I'm perfectly capable of writing JavaScript with no dependencies but I'm still quicker coding proof of concepts with a bit of assistance. For larger websites with a lot of interactive functionality — and / or multiple developers — I often prefer to stick with jQuery. In this case because the effects are minor and supplementary, once the design was finalised I rewrote everything without jQuery (saving 85kb).

## Onwards

So that's a little bit of what I've been up to this month. An efficient use of time I'd say. The benefits of moving into code almost immediately cannot be understated. I'm pleased with the results and feedback has been positive — much appreciated!

*[CDN]: Content Delivery Network
