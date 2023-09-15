---
date: 2013-02-04 21:05:44+00:00
excerpt: None
slug: a-primer-to-front-end-svg-hacking
template: single.html
title: A Primer to Front-end SVG Hacking
---

Using [SVG](https://developer.mozilla.org/en/docs/SVG) (Scalable Vector Graphics) on websites is a lot safer than many front-end developers think. Authoring aside — I wouldn't suggest trying to hand-code an illustration more complex than a triangle* — the standard is well supported in browsers today and perfect for [resolution independence](http://coding.smashingmagazine.com/2012/01/16/resolution-independence-with-svg/) when CSS and icon fonts aren't suitable.

💤 _* Quick fire question: at which corner does this right-angle triangle point?_

````markup
<polygon points="0,100 0,0 100,0 "/>
````

I'm going to walk you through many conceivable implementations:

## Image Elements

Basic usage is as simple as swapping out a regular raster graphic — PNG, JPEG, or GIF — with an SVG file. Here's an example in HTML:

````markup
<img src="image.svg">
````

According to the [can I use](http://caniuse.com/#search=SVG) compatibility table only Internet Explorer 8 and lower, and Android Browser 2 lack support. They will download and fail to render the image.

With client side fallbacks we can't avoid the initial download. We could swap out the element source with JavaScript if there's an error:

````markup
<img src="image.svg" onerror="this.onerror=null; this.src='image.png'">
````

That's cute but I can't imagine many circumstances where it would be the best solution. You can achieve similar results with feature detection:

````javascript
if (!Modernizr.svg) {
    $('img[src$=".svg"]').each(function()
    {
        $(this).attr('src', $(this).attr('src').replace('.svg', '.png'));
    });
}
````

**Ben Howdle** and **Jack Smith** have written [SVGeezy](http://benhowdle.im/svgeezy/) that does this without Modernizr or jQuery dependencies. Though if you do include [Modernizr](http://modernizr.com/) detection in the `<head>` of your HTML document you can do a nicer — read: less noticeable — "switcheroo" with CSS.

````markup
<div id="logo">
    <img src="logo.svg">
</div>
````

````css
.lt-ie9 #logo,
.no-svg #logo {
    background: url("logo.png");
    _background-image: url("logo.gif");
}
.lt-ie9 #logo img,
.no-svg #logo img {
    opacity: 0;
    filter: alpha(opacity=0);
}
````

You'll notice I've used the "lt-ie9" class. You can apply this to the `<html>` element using [conditional comments](http://www.quirksmode.org/css/condcom.html). That provides an extra fail-safe if somehow JavaScript is disabled in old IE. Oh, and the `_background-image` and GIF — that's an IE6 transparency fix! Totally optional.

With the techniques above the worse case scenario is that two assets are downloaded. Eventually those legacy browsers will fade away and you can remove the fallbacks.

## CSS Background Images

Like I mentioned, you can use SVG anywhere images are permitted:

````css
.illustration {
    background-image: url('image.svg');
}
````

And just like raster graphics, you can base64 encode them right into the stylesheet to help reduce HTTP requests:

````css
.illustration {
    background-image: url('data:image/svg+xml;base64,[data]');
}
````

To aid readability you may even attempt such audacity as this:

````css
.illustration {
    background-image: url('data:image/svg+xml;charset=utf-8,<svg></svg>');
}
````

I've thrown up a [UTF-8 test case](/demos/svg/utf8uri/test2.html) and the results from quick testing show only Webkit based Safari and Chrome are happy with this arrangement. But this isn't quite right…

It may not be immediately obvious but my pseudo code above is not a valid data URI. While the contents are UTF-8 encoded, the URI itself needs to be [URI encoded](http://en.wikipedia.org/wiki/Percent-encoding). View the source of my last demo in the [test case](/demos/svg/utf8uri/test2.html) to see why this is ultimately pointless! The base64 version is always smaller.

## Object Elements

If you were experimenting with SVG a couple of years ago like I was you'll be more familiar with the object element:

````markup
<object type="image/svg+xml" data="image.svg">
    <img src="fallback.png">
</object>
````

This is the oldest method we have. And of course, data URIs are possible here too:

````markup
<object type="image/svg+xml" data="data:image/svg+xml;base64,[data]">
    <img src="fallback.png">
</object>
````

If the browser doesn't recognise the object element's MIME type it won't download the SVG file but the "fallback" image inside is always downloaded. Again, we're not doing things quite right. There is a better solution and those crafty devils at [ClearLeft](http://clearleft.com/) are sporting it in their logo markup. The answer? Simply use CSS to apply the fallback image:

````markup
<object id="logo" type="image/svg+xml" data="logo.svg">
    <div>logo description</div>
</object>
````

````css
#logo div {
    width: 300px;
    height: 50px;
    background-image: url("logo.png");
}
````

The object element effectively replaces it's default content with the SVG data. Only if the browser doesn't support SVG does the element inside get styled. This to my knowledge is the best way to use SVG without any overhead.

## Inline of HTML

With the methods highlighted above we actually lose a lot of SVG's potential. For security reasons [SVG as an image](https://developer.mozilla.org/en-US/docs/SVG/SVG_as_an_Image) has scripting and external resource loading disabled in Firefox (and from my testing Webkit browsers follow suit).

To unleash full power you either need to view an SVG file directly in the browser (not very handy for website development), or write it inline of HTML:

````markup
<!--[if (gt IE 8)]><!--><svg></svg><!--<![endif]-->
````

This is something I've [recently experimented](/2013/01/28/gloople-responsive-design-review/) with to reduce HTTP requests. One drawback is that the browser can't cache the image to be used across multiple locations. It does however mean you can [style SVG with CSS](https://developer.mozilla.org/en-US/docs/CSS/Getting_Started/SVG_and_CSS) — and via the document stylesheet too which is a maintainability bonus.

Browsers that don't support inline SVG aren't going to like the taste of it (hence the conditional comments for old IE). In my use case, an object element with a data URI may have been the better choice.

## The Holy Grail

There is one technique where SVG will shine in future. That's the use of [fragment identifiers](http://www.w3.org/TR/SVG/linking.html#LinksIntoSVG) — **Peter Gasston** has a friendlier explanation in his article: [Better SVG Sprites With Fragment Identifiers](http://www.broken-links.com/2012/08/14/better-svg-sprites-with-fragment-identifiers/), as does **Simurai**: [SVG Stacks](http://simurai.com/post/20251013889/svg-stacks). Firefox and IE10 are leading the charge here ([compatibility table](http://caniuse.com/svg-fragment)).

Finally, when experimenting with SVG you'll find a few browsers get a bit rasterisation-happy and that lovely resolution independence is destroyed. But fear not these bugs are getting ironed out quicker than you can find them! But if you do notice peculiarities, make sure to file a UFO sighting with the authorities.

I hope that has served as a primer for front-end usage. The right technique really depends upon whether you're SVG for UI elements or simply illustrative purposes.

Protip: you can also minify SVG — [SVG Optimzer](https://github.com/svg/svgo) is a great tool.

Pro-protip: **Scott Jehl's** [grunticon](https://github.com/filamentgroup/grunticon) automagically converts SVG files to PNG and data URIs.

💤 That triangle points top-left. I would also have accepted north-west.

