---
date: 2024-01-19 09:00:00+00:00
slug: svg-icons-with-css-masks
title: 'SVG Icons with CSS Masks'
description: 'The one where I combines the powers of CSS and SVG'
---

Have you ever inlined SVG icons inside a CSS stylesheet?

It can improve performance by reducing HTTP requests if done selectively.

I do this all the time using a custom property and `background-image` to make **reusable icons**. One downside is the inability to change or transition colours easily. I've recently discovered a new technique that solves this issue using the [`mask` property](https://developer.mozilla.org/en-US/docs/Web/CSS/mask).

## Masking Icons

Go ahead and jump straight to my [**CodePen demo**](https://codepen.io/dbushell/pen/yLwVJbm) and hover, or focus, over both buttons. See the difference in icon colour change. That will demonstrate what I'm talking about below.

For my examples I'm using this Bootstrap icon:

<figure class="Image">
  <img
    loading="lazy"
    fetchpriority="low"
    src="/images/blog/2024/bootstrap-arrow-right.svg"
    alt="Arrow right icon"
    width="160"
    height="160">
    <figcaption><a href="https://icons.getbootstrap.com/icons/arrow-right/" rel="noopener noreferrer" target="_blank">Arrow right</a> icon from Bootstrap (MIT license)</figcaption>
</figure>

In SVG code that is:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
  <path d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"/>
</svg>
```

I've stripped out any colour and presentation attributes. There is only a single `<path>` element which will default to a black fill.

This can be inlined as a CSS custom property using a [Data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs).

```css
:root {
  --arrow: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"/></svg>');
}
```

Depending on your SVG you may need some URI character encoding (e.g. `#` to `%23`). I'm not sure if the `;utf8` suffix is necessary in modern browsers.

In the past I would reuse this icon in pseudo elements.

```css
button::after {
  background: var(--arrow) center center / 100% auto no-repeat;
  content: "";
  display: block;
  height: 1rem;
  width: 1rem;
}
```

You get the idea; create an empty square and set the icon as a background image. The icon colour is the colour of the original SVG.

My new technique is a small change:

```css
button::after {
  background: currentColor;
  mask: var(--arrow) center center / 100% auto no-repeat;
  /** other props... */
}
```

The `mask` property is the exact same value and syntax as `background` was previously. Now `background` is using the parent `button` colour.

Here's the [**CodePen demo**](https://codepen.io/dbushell/pen/yLwVJbm) again.

## Use Cases

Neat, right? This is technique perfect for:

* Button icons
* List bullet points
* Custom checkbox icons

Especically when the icon changes colour depending on interactive state, or light and dark theming, for example. This only works for single colour icons. If you need multi-colour you're best inlining the SVG in the HTML rather than CSS.

[Browser support for `mask`](https://caniuse.com/?search=mask) is coming along nicely.

* * *

Exactly 12 years ago this month  I wrote [*"Resolution Independence With SVG"*](https://www.smashingmagazine.com/2012/01/resolution-independence-with-svg/) for **Smashing Magazine**. Back then Internet Explorer 9, which introduced SVG support, was still taking market share from IE8. Kinda wild I'm still figuring out the best way to do icons!
