---
date: 2011-11-11 08:58:36+00:00
excerpt: None
slug: the-good-the-bad-and-the-logo
template: single.html
title: The Good, the Bad, and the Logo
---

Back in **June 2010** I wrote about [using SVG](/2010/06/30/using-svg-logos/) for your logo. When I realigned my website earlier this year (see: [Designing a new me](/2011/05/25/designing-a-new-me/)) I reverted back to the typical PNG and used the `-webkit-min-device-pixel-ratio` to provide a high-res version.

Well 17 months ago I wasn't as sharp as I am today with front-end standards and for whatever reason I settled on using the `<object>` and `<embed>` elements... what was I smoking? Well anyway, it didn't occur to me that you can provide an SVG file as the source of an `<img>` element or as a background image in CSS — and I've now done just that, look up! [Browser support](http://caniuse.com/#search=SVG) is pretty much across the board.

Now because SVG scales by nature it is resolution independent, meaning I no longer require a media query for the @2x high-res PNG version (that only the iPhone 4 could see). If your logo resizes at different breakpoints (mine gets smaller below 480px) simply allow the `<img>` to scale. Or if you're using a background image in CSS apply a `[background-size](http://www.css3.info/preview/background-size/)` in each media query in which it resizes.

I'm using the [conditional comments trick](http://html5boilerplate.com/docs/The-markup/#ie-html-tag-classes) around my `<html>` element so that Internet Explorer versions below 9 can fallback to a PNG instead of SVG. All very simple and clean! I should probably use a JavaScript test to cover all bases.

I do plan to realign/redesign my website again early next year. I'm also well aware I've made a few mistakes in my current markup and CSS — that's a weasely disclaimer because I'm about to get very deep...

## The H1 Debate

You may have noticed my logo is actually a CSS background applied to the document's first `<h1>`.

Many professional developers and semantic purists including **Harry Roberts** — whom I very much respect — will argue that [you're logo is not a `<h1>`](http://csswizardry.com/2010/10/your-logo-is-an-image-not-a-h1/). I agree with everything Harry says regarding his approach, which _is_ perfectly fine, but there is an alternative. To make sense of that, allow me to explain!

I could say that in my case I don't even have a "logo", more of a stylised typographic illustration of my main heading "David Bushell does design". I could also, in theory, achieve that style using CSS3 and not require an image replacement technique at all thus taking myself out of the equation, but I digress.

My choice relates to the [document outline](http://coding.smashingmagazine.com/2011/08/16/html5-and-the-document-outlining-algorithm/) and the decision to make the website's name a consistent top-level heading on every page across the site. (Whether I've got my document outline perfect is another debate.)

I'd much prefer search engines, assistive technologies, and everything else to see the top-level `<h1>` as the first piece of content in the document rather than an image (like a logo). For this reason the logo is relegated to the realm of "style" and is not a piece of content whose value would be questionable in pole position. This trade off is based on what I consider a more appropriate content hierarchy. I could lead with the `<h1>` and continue with an `<img>` for the logo, but again, it really isn't a valuable piece of content at that prominence. The heading serves to communicate ownership, the logo is merely branding.

If I were to remove the website's name as the top level `<h1>` and instead use the page's first heading — e.g. this article's title "The Good, the Bad, and the Logo" — I may need to promote my logo back into semantic document content and, of course, use an `<img>` element. Or I could make it visible elsewhere with CSS.

Whether the logo needs to be _content_ is secondary to the question: **what should the document's top level `<h1>` be? The website's name, or the page heading? **I know developers, SEO optimists, and others who provide arguments for both cases. (I know many _more_ web practitioners who have no idea of what I'm talking about.) My document's `<header role="banner">` (including the navigation & advertisement) is site-wide, where as my page heading refers to the main `<article role="main">` below.

Content and users come before SEO, in fact, they influence SEO (not vice-versa). On the majority of websites I build I believe that the website's name should lead the content on every page. Whether you use multiple `<h1>` elements as HTML5 allows, or a `<h1>` and `<h2>` for legacy purposes, there is value in having the textual website name lead the content in the semantic markup and document outline. Much more value than an image for branding purposes; this can be applied with other branded styles in CSS. Once we've established that, applying it as a background image to the first `<h1>` is irrelevant to the semantic document, as are the brand colours etc.

**I don't believe a logo needs to be content**. While your logo is an image in one sense, it doesn't have to be an `<img>` in the document. It should never need to be an `<img>` nested inside a `<h1>` either. I am willing to be persuaded on what the `<h1>` should be, but that's a separate debate in my eyes.

There are semantics, and then there are HTML semantics. A "logo" can be interpreted in different ways that don't necessarily conflict with properly built websites.

* * *

Finally, what about logos made purely out of "CSS"? No. Never. That is absolutely, categorically, _**illogical**_. As a quirky esoteric challenge then sure, knock yourself out — but in practice? Don't even joke about it!

I hope you've enjoyed this article!
