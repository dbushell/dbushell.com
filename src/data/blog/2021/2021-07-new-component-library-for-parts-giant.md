---
date: 2021-07-01 10:00:00+00:00
slug: new-component-library-for-parts-giant
title: 'A New Component Library for Parts Giant'
description: 'The one where I revisit an old client'
---

[Back in 2015](/2016/01/04/css-framework-for-partsgiant/) I built the front-end for [Parts Giant](https://www.partsgiant.com/). Following a successful five years of e-commerce, Parts Giant handed me a similar brief with a refreshed design. Five years is a _long time_ on the web. This was an opportunity to showcase that evolution and deliver a thoroughly modern front-end component library building on past success.

<figure class="Image">
  <img loading="lazy" srcset="
      /images/blog/2021/parts-giant-design@1x.webp 1240w,
      /images/blog/2021/parts-giant-design@2x.webp 2480w"
    sizes="(min-width: 48rem) 50vw, 86vw"
    src="/images/blog/2021/parts-giant-design@1x.webp"
    alt="Parts Giant website design"
    width="1240"
    height="415">
  <figcaption>The new home, category, and product page templates.</figcaption>
</figure>

In this case study I’ll go in-depth on a handful of topics related to this project.

Jump to a topic of interest:

- [Building Blocks](#building-blocks)
- [Flexbox and Grid Layout](#flexbox-and-grid-layout)
- [Sidebar and Modal Filters](#sidebar-and-modal-filters)
- [Navigation](#navigation)
- [Deliverables](#deliverables)

## Building Blocks

To build a website I first loosely itemise components into a three tier hierarchy. There are many names for a methodology like this but I don't strictly adhere to any one in particular. I find being overly rigid on rules does not compliment the nature of front-end. One must be pragmatic and not get hung up on conventions for conventions sake.

<figure class="Image">
  <img loading="lazy" srcset="
      /images/blog/2021/parts-giant-library@1x.webp 440w,
      /images/blog/2021/parts-giant-library@2x.webp 880w"
    sizes="(min-width: 48rem) 50vw, 86vw"
    src="/images/blog/2021/parts-giant-library@1x.webp"
    alt="Parts Giant component library"
    width="440"
    height="400">
  <figcaption>The component library in Fractal.</figcaption>
</figure>

[Fractal](https://fractal.build/) is my current tool of choice for documentation and presentation.

The first component tier is the most primitive. It comprises singular 'elements' like a button or form field. I also fit typographic styles, colours, and common units like spacing into this tier as CSS custom properties.

<p class="Image">
  <img loading="lazy" srcset="
      /images/blog/2021/partsgiant-button-states@1x.png,
      /images/blog/2021/partsgiant-button-states@2x.png 2x"
    src="/images/blog/2021/partsgiant-button-states@1x.png"
    alt="Parts Giant button component states"
    width="350"
    height="84">
</p>

I've recently written on the topic of [**CSS focus state**](/2021/04/30/accessibility-css-focus-state/) with several examples from this project. Improving accessibility was a key aspect here. I've also started to write CSS that is naturally adaptable to [**right-to-left styling**](/2021/02/02/changing-css-for-good-logical-properties-and-values/). All the components I built for Parts Giant are RTL-ready.

A long time ago "browser testing" used to be a job I reluctantly tackled after coding full page templates. I still do a final sweep, but I now primarily test on a component-by-component basis to catch issues early. I do this whilst testing responsiveness, interactivity, and accessibility — so it's time well spent. At this early stage it's easier to tweak design accordingly if that is needed.

The final tier of 'container' components each represent a horizontal slice of a page. The header or a product listing, for example. The middle tier — I simply call 'blocks' — is literally everything else. A three tier component library suits how I mentally break up a web page. I find a more granular delineation is of little coding benefit. Towards the end of development I may break out other categories if it aids discovery in the documentation. This is just my preference, I'll happily work with other methodologies if I'm not leading the project.

## Flexbox and Grid Layout

Since the original website was built the options for CSS layout have expanded immensely.

<figure class="Image">
  <img loading="lazy" srcset="
      /images/blog/2021/parts-giant-product-grid@1x.webp 990w,
      /images/blog/2021/parts-giant-product-grid@2x.webp 1980w"
    sizes="(min-width: 48rem) 50vw, 86vw"
    src="/images/blog/2021/parts-giant-product-grid@1x.webp"
    alt="Parts Giant product listing"
    width="990"
    height="454">
  <figcaption>Product listing: old design (left) and new design (right).</figcaption>
</figure>

The old code used the classic [float and clearfix](https://css-tricks.com/all-about-floats/) technique. This was not intuitive nor easy to use but it's all we had at the time. The new version uses CSS Grid. Hallelujah! A sane and logical layout system. CSS Flexbox and Grid are real game changers.

Each product uses the [card pattern](/2021/04/30/accessibility-css-focus-state/#the-card) which itself uses Flexbox layout in a column direction. This allows for equal height cards with the card footer aligned to the bottom.

<figure class="Image">
  <img loading="lazy" srcset="
      /images/blog/2021/parts-giant-forms@1x.webp 820w,
      /images/blog/2021/parts-giant-forms@2x.webp 1640w"
    sizes="(min-width: 48rem) 50vw, 86vw"
    src="/images/blog/2021/parts-giant-forms@1x.webp"
    alt="Parts Giant form layout"
    width="820"
    height="504">
  <figcaption>Form layout example for a shipping address.</figcaption>
</figure>

CSS Grid allowed for a simple responsive form layout without superfluous markup. An e-commerce website has a lot of forms. With this quick baseline we had plenty of time to tailor bespoke styles for the more complicated forms.

## Sidebar and Modal Filters

Aside the product listing grid is a sidebar with various filters. This was redesigned and coded to be modular allowing any arrangement of panels.

<figure class="Image">
  <img loading="lazy" srcset="
      /images/blog/2021/parts-giant-color-filter@1x.webp 560w,
      /images/blog/2021/parts-giant-color-filter@2x.webp 1120w"
    sizes="(min-width: 48rem) 50vw, 86vw"
    src="/images/blog/2021/parts-giant-color-filter@1x.webp"
    alt="Parts Giant colour filter"
    width="560"
    height="101">
  <figcaption>Colour filter panel: old design (left) and new design (right).</figcaption>
</figure>

Several minor visual tweaks were made for an overall major improvement. General size and spacing has been bumped up a notch. The active selection and interaction states are clearer.

Under the hood the panels use a `<details>` element for interactivity free from JavaScript. A custom colour property is used to style each option (in [HSL values](<https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl()>)). This allows a bit more flexibility than the inline `background-color` style that was used previously.

A reduced code example:

```html
<details open>
  <summary>Colors</summary>
  <label style="--color: 25, 100%, 50%;">
    <input type="checkbox" />
    <span>Orange</span>
  </label>
</details>
```

On smaller screens, where there is no space for a sidebar, the filters are moved inside a pop-up modal. By default the modal is hidden and empty and thus considered a progressive enhancement. It's "nice to have" functionality but not absolutely critical for browsing.

<figure class="Image">
  <img loading="lazy" srcset="
      /images/blog/2021/parts-giant-filter@1x.webp 890w,
      /images/blog/2021/parts-giant-filter@2x.webp 1780w"
    sizes="(min-width: 48rem) 50vw, 86vw"
    src="/images/blog/2021/parts-giant-filter@1x.webp"
    alt="Parts Giant filters"
    width="890"
    height="600">
  <figcaption>Product filter sidebar and modal designs.</figcaption>
</figure>

The modal footer remains visible above any overflow using `position: sticky`. The same accordion-like design remains allowing panels to be toggled open and closed. Altogether a nice user experience.

JavaScript is used to switch between sidebar and modal. The CSS breakpoint is read once from the document style to avoid hard-coding it:

```javascript
const style = window.getComputedStyle(document.documentElement);
const breakpoint = style.getPropertyValue('--breakpoint-sidebar');
```

Then in a debounced window `resize` event a media query is used:

```javascript
const isSidebar = window.matchMedia(`(min-width:${breakpoint})`).matches;
```

If the sidebar breakpoint is not active, the `<form>` node — which contains the filter panels — is moved from the sidebar parent to the modal parent (or vice-versa). The appropriate ARIA attributes and styles are toggled so that only one of the parents is visible. This technique avoids have two duplicate form templates.

## Navigation

Parts Giant was designed with many avenues for product navigation and discovery. Mega-menus, keyword search, and filtering to name a few. The existing content structure has proved successful so that remained the same in the new design.

The new component library helped finalise the design of UI components to ensure they worked in regards to both aesthetics and overall usability.

<figure class="Image">
  <img loading="lazy" srcset="
      /images/blog/2021/parts-giant-pagination@1x.webp 673w,
      /images/blog/2021/parts-giant-pagination@2x.webp 1346w"
    sizes="(min-width: 48rem) 50vw, 86vw"
    src="/images/blog/2021/parts-giant-pagination@1x.webp"
    alt="Parts Giant pagination"
    width="673"
    height="64">
  <figcaption>Pagination UI components.</figcaption>
</figure>

[CSS custom properties](https://css-tricks.com/a-complete-guide-to-custom-properties/) are ideal to codify design tokens like size and colour. They ensure consistency across components and avoid duplicate code.

The new website introduces an off-canvas navigation for smaller screens.

<figure class="Image">
  <img loading="lazy" srcset="
      /images/blog/2021/parts-giant-off-canvas@1x.webp 1079w,
      /images/blog/2021/parts-giant-off-canvas@2x.webp 2158w"
    sizes="(min-width: 48rem) 50vw, 86vw"
    src="/images/blog/2021/parts-giant-off-canvas@1x.webp"
    alt="Parts Giant off-canvas navigation"
    width="1079"
    height="634">
  <figcaption>The off-canvas menu variations.</figcaption>
</figure>

Check out my blog post on the topic of [**off-canvas navigation**](/2021/06/17/css-off-canvas-responsive-navigation/). I've published a generic version of this pattern that I'll continue to maintain and repurpose for other projects.

## Deliverables

I'm not a fan of over-producing fancy deliverables full of fluffy prose and decorated with my logo all over. I've had to work with pretty PDFs before and they're only good for eating up a budget. My component libraries are delivered in a metaphorical cardboard box, aka a git repository, that includes:

- One CSS stylesheet + SCSS source files
- Around two dozen static HTML templates
- A directory of accompanying assets
- Documentation
- Documentation!
- Documentation!!

As mentioned I used [Fractal](https://fractal.build/) to document this component library. Included are visual code examples for each component and their variations. I also kept a change-log updated as I went along with a list of additions and amends. It's a simple but effective way to show the client what's new without bombarding them with emails.

The new stylesheet — despite providing significantly more components — has shrunk from 147KB to 93KB. Minified and compressed to just under 14KB. The templates hit a perfect 100 on [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/). As they should; they're static with placeholder content. Not a bad starting point though!

This was a large project and I'll likely have more topics to blog about and generic patterns to evolve and share.
