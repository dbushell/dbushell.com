---
date: 2015-01-30 10:00:58+00:00
excerpt: None
slug: use-svg-part-2
template: single.html
title: Use SVG (part 2)
---

On Monday I wrote about [using SVG for content images](/2015/01/26/use-svg-part-1/). Aside from minor workarounds for a peculiar Internet Explorer bug, it's a relatively straight forward task.

I was planning to follow up with a technical overview of **SVG sprites**, but really, I can't write anything better than Sara Soueidan's comprehensive guide: [“An Overview of SVG Sprite Creation Techniques”](http://24ways.org/2014/an-overview-of-svg-sprite-creation-techniques/).

Read that first!

## Browser testing

To truly understand how things works I've been experimenting. I created a single SVG sprite that combines multiple techniques for easy testing. It's worth spending some time inspecting the SVG source as there's quite a lot going on. The sprite contains 3 icons and looks like this when viewed alone:

![SVG Sprite](/images/blog/2015/sprite.png)

See the full source below (scroll past for explanation and findings).

````markup
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="90" viewBox="0 0 30 90">

<!-- define gradients used in "smile" icon -->
<defs>
    <radialGradient id="a" cx="792.922" cy="-762.068" r="7.145" fx="792.818" fy="-762.04" gradientTransform="matrix(2.086 0 0 -2.086 -1642.039 -1580.131)" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#FFFCDE"/>
        <stop offset=".645" stop-color="#F6E76A"/>
        <stop offset="1" stop-color="#FFB738"/>
    </radialGradient>
    <radialGradient id="b" cx="1165.779" cy="-1307.18" r="12.648" gradientTransform="matrix(1.251 0 0 -1.251 -1443.057 -1609.93)" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#777"/>
        <stop offset="1"/>
    </radialGradient>
</defs>

<!-- define "smile" icon (full details + gradients) -->
<symbol id="smile" viewBox="0 0 30 30">
    <path fill="url(#a)" stroke="#9C8C0A" stroke-width=".48" stroke-linecap="round" stroke-linejoin="round" d="M29.5 15c0 8.008-6.49 14.5-14.5 14.5C6.992 29.5.5 23.008.5 15S6.99.5 15 .5 29.5 6.992 29.5 15z"/>
    <path opacity=".677" fill="none" stroke="#fff" stroke-width=".505" stroke-linecap="round" stroke-linejoin="round" enable-background="new" d="M28.78 15c0 7.61-6.17 13.78-13.78 13.78-7.61 0-13.78-6.17-13.78-13.78C1.22 7.39 7.39 1.22 15 1.22c7.61 0 13.78 6.17 13.78 13.78z"/>
    <path opacity=".36" fill="#fff" enable-background="new" d="M25.462 16.297c-2.424 4.2-5.258 7.225-10.303 7.225-4.906 0-8.49-3.485-10.73-7.364 2.045 2.454 5.045 5.274 10.514 5.274 6.533 0 7.674-2.334 10.516-5.135h.002z"/>
    <path fill="url(#b)" d="M25.462 15.73c-2.424 4.196-5.258 7.225-10.303 7.225-4.906 0-8.49-3.488-10.73-7.367 2.045 2.456 5.045 5.277 10.514 5.277 6.533 0 7.675-2.338 10.516-5.137v.002h.002z"/>
    <path opacity=".36" fill="#fff" enable-background="new" d="M12.98 10.667c0 2.01-.904 3.616-2.01 3.616-1.104 0-2.11-1.607-2.11-3.616s.905-3.616 2.01-3.616 2.01 1.61 2.01 3.62h.1v-.003zm7.465 0c0 2.01-.903 3.616-2.01 3.616-1.104 0-2.01-1.607-2.01-3.616s.904-3.616 2.012-3.616c1.104 0 2.008 1.61 2.008 3.62v-.003z"/>
    <path d="M12.98 10.166c0 2.01-.904 3.616-2.01 3.616-1.104 0-2.01-1.607-2.01-3.616 0-2.01.905-3.617 2.012-3.617 1.105 0 2.008 1.602 2.008 3.614v.002zm7.465 0c0 2.01-.903 3.616-2.01 3.616-1.104 0-2.01-1.607-2.01-3.616 0-2.01.904-3.617 2.012-3.617 1.104 0 2.008 1.602 2.008 3.614v.002z"/>
</symbol>

<!-- define "face" icon (features cut out) -->
<symbol id="smile-face" viewBox="0 0 30 30">
    <path d="M15 .26C6.873.26.26 6.873.26 15c0 8.128 6.613 14.74 14.74 14.74 8.128 0 14.74-6.612 14.74-14.74C29.74 6.873 23.128.26 15 .26zm3.438 6.29c1.104 0 2.008 1.603 2.008 3.615 0 2.01-.903 3.617-2.01 3.617-1.104 0-2.01-1.607-2.01-3.616 0-2.01.904-3.617 2.012-3.617zm-7.466 0c1.105 0 2.008 1.603 2.008 3.615 0 2.01-.904 3.617-2.01 3.617-1.104 0-2.01-1.607-2.01-3.616 0-2.01.905-3.617 2.012-3.617zm4.187 16.405c-4.905 0-8.49-3.488-10.73-7.367 2.046 2.456 4.815 5.277 10.284 5.277 6.534 0 8.286-2.338 10.286-5.137v.002h.23c-2.422 4.197-5.026 7.225-10.07 7.225z"/>
</symbol>

<!-- define "features" icon (eyes and smile) -->
<symbol id="smile-features" viewBox="0 0 30 30">
    <path d="M25.462 15.73c-2.424 4.196-5.258 7.225-10.303 7.225-4.905 0-8.49-3.488-10.73-7.367 2.046 2.456 5.046 5.277 10.515 5.277 6.534 0 7.675-2.338 10.516-5.137l.002.002zM12.98 10.166c0 2.01-.904 3.616-2.01 3.616-1.104 0-2.01-1.607-2.01-3.616 0-2.01.905-3.617 2.012-3.617 1.105 0 2.008 1.603 2.008 3.616zm7.465 0c0 2.01-.903 3.616-2.01 3.616-1.104 0-2.01-1.607-2.01-3.616 0-2.01.904-3.617 2.012-3.617 1.105 0 2.008 1.603 2.008 3.616z"/>
</symbol>

<!-- define view locations for each icon -->
<view id="smile-view" viewBox="0 0 30 30" />
<view id="smile-view-face" viewBox="0 30 30 30" />
<view id="smile-view-features" viewBox="0 60 30 30" />

<!-- add icons to document and position to match their corresponding view -->
<use xlink:href="#smile" width="30" height="30" x="0" y="0"></use>
<use xlink:href="#smile-face" width="30" height="30" x="0" y="30"></use>
<use xlink:href="#smile-features" width="30" height="30" x="0" y="60"></use>

</svg>
````

## What's what?

The icons are first defined as `<symbol>` elements. They can be reused on any web page:

![SVG use technique](/images/blog/2015/svg-use-technique.png)

With this technique we can apply basic CSS (e.g. `fill: #0000ff;` used above). Dimensions are required, either via CSS or width / height attributes.

Note that in Chrome <sup>(40)</sup> and Safari <sup>(8.0.2)</sup> (screenshot below) the gradients fail to render if the icon is referenced from an external sprite.

![SVG use gradient fail](/images/blog/2015/svg-use-gradient-fail.png)

If the SVG source is inline of the HTML document the gradients will work. Firefox behaves perfectly; a common theme.

For simple icons — my kinda style — this is my favourite technique because the `<symbol>` elements do not need to be positioned in the sprite. IE does need a bit of [JavaScript help](https://github.com/jonathantneal/svg4everybody) but it's not too painful.

### Other techniques

You may have noticed at the end of my sprite I _did_ position `<use>` elements and define a `<view>` for each icon. This is what you see when viewing the sprite standalone (the `<symbol>` definitions are invisible otherwise). This isn't required for the technique above, but it does enable two more:

![SVG img view](/images/blog/2015/svg-img-view.png)

An `<img>` element looks subjectively neater but the icon can't be styled with CSS. More importantly, as [Sara mentions](http://24ways.org/2014/an-overview-of-svg-sprite-creation-techniques/), Safari is a bit buggy. At least IE plays ball this time!

While you can't use external CSS you can create multiple `view` and `use` combos inside the sprite that reference the same `symbol`. Then style those:

````markup
<view id="smile-view-face-r" viewBox="0 30 30 30" />
<view id="smile-view-face-b" viewBox="0 60 30 30" />
<use style="fill:red;" xlink:href="#smile-face" width="30" height="30" x="0" y="30"></use>
<use style="fill:blue;" xlink:href="#smile-face" width="30" height="30" x="0" y="60"></use>
````

Not too much redundancy, but I prefer my CSS is one place.

Finally, referencing the sprite inside a CSS background sounds very useful:

![SVG CSS background](/images/blog/2015/svg-css-background.png)

Unfortunately **only Firefox** is happy with this technique.

It is possible to simply reference `background: url('sprite.svg')` and set a `background-position` for each icon — i.e. the old fashioned way. However, hard-coding icon positions inside both the SVG and CSS files would be too much hassle for 2015. The perfect sprite technique would not care for positioning and keep all styles in the stylesheet. [SVG stacks](http://simurai.com/blog/2012/04/02/svg-stacks/) may be another method but it too lacks browser support.

## In conclusion

While none of these techniques are perfect. I find it very interesting that it's possible to create a single SVG sprite that supports multiple uses.

I was really hoping that browsers would allow this:

````css
background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><use xlink:href="sprite.svg#smile-face"></use></svg>');
````

but alas, no luck! SVG data URIs work fine, just not xlink references.

The experiments will continue to find the most browser and developer friendly technique. You can [visit my test page](/demos/svg/2015-01-29/svg-sprite.html) to see all the examples above.

Know of anything cool SVG tricks I've missed? [Send me a tweet](http://twitter.com/dbushell).
