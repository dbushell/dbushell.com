---
date: 2013-07-25 14:58:54+00:00
excerpt: None
slug: progressive-viewports
template: single.html
title: Progressive Viewports
---

Implementing off-canvas navigation requires a fair amount of effort in the realms of front-end performance and "viewport management" but the general principles are simple. Once you've cracked them you can create some brilliant responsive and interactive interfaces.

## Viewport set-up

I've decided to write a mostly high-level introduction here without getting bogged down in code. My [Smashing Magazine article](http://coding.smashingmagazine.com/2013/01/15/off-canvas-navigation-for-responsive-website/) sets a good foundation for practical implementation and I'm using the same navigation example here.

Essentially we need two elements:

1. The **viewport** that hides content overflow.
2. The **wrapper** that moves content behind the viewport.

The illustration below shows the **viewport** (parent) and the **wrapper** (child) outlined with _red_ and _black_ borders respectively:

![viewport layout](/images/blog/2013/viewport.svg)

You can see the **wrapper** is bigger than the **viewport** that masks it. This allows us to hide parts of the interface (like the menu in this example).

To size elements correctly make the **wrapper** width a percentage of the **viewport** — e.g. `150%` — then use relative percentages to size child elements —  e.g. `33.333%` for the menu and `66.666%` for the main content. Effectively the menu is now 50% of the **viewport** and we can position the **wrapper** `left: -50%;` to hide it off-canvas — its default resting state.

## State interaction

To transition the interface between states we toggle a class on the viewport. This class is used as a selector to change CSS transforms on the **wrapper**. With JavaScript we add a click or touch event on the nav button to toggle the class. We could even detect a swipe-in from the left of the viewport (if we're fancy). This was the premise of my article: [Implementing Off-Canvas Navigation For A Responsive Website](http://coding.smashingmagazine.com/2013/01/15/off-canvas-navigation-for-responsive-website/) so head there for more information.

For performance — 60 frames-per-second — we need to use **CSS transitions** and **transforms** and not JavaScript animation that iterates over a CSS property (i.e. jQuery animate).

Hopefully that makes sense!

## Responsive design

With responsive design we can adjust the size of the content inside the **wrapper** and even ignore the state class at certain breakpoints.

The illustration below is similar to my website — it shows the menu taking full width of the **viewport** on a mobile screen and positioned always-visible on a desktop screen:

![off-canvas navigation breakpoints](/images/blog/2013/off-canvas-breakpoints.svg)

In my demo I use absolute positioning for the menu but you could use flexbox or floats & clearfix to ensure the **wrapper** gets height. How you position content inside the **wrapper** is very dependant on your design.

## Accessible fallbacks

If CSS transitions are not supported use progressive enhancement so that a basic accessible state always exists. For off-canvas navigation I use the [footer-anchor pattern](http://adactio.com/journal/6338/) Jeremy Keith writes about. By default the contents of our **wrapper** element are arranged like so:

![off-canvas footer-anchor fallback](/images/blog/2013/off-canvas-fallback.svg)

Only after feature detection should we arrange the elements outside of the viewport (or however we decide to style each state).

## Nesting viewports

With this off-canvas navigation example we're using the entire browser window as the **viewport** but there's no reason we can't use a smaller element within the page.

In the illustration below we can see a typical list view. The **outer-viewport** represents the mobile browser window that naturally hides overflow. The **inner-viewport** represents a single list item with hidden controls to the right. These could be swiped into view.

![nested viewport](/images/blog/2013/nested-viewport.svg)

Prior to progressive enhancement kicking in, the hidden controls would sit visible within the list item. Not the best use of space but accessible as a worse case scenario. Or perhaps they could be hidden entirely if non-critical? Or replaced with an "edit" link  that provides functionality on a separate page. Whatever fallback exists is really a question of design and user experience so I can't say for sure what's appropriate.

## Progressive viewports

Hopefully you can see this pattern of **viewport** and content **wrapper** can be used to create a wide variety of interactive interfaces at all sizes. I strongly advice using CSS to transition states otherwise frame rate barely exists in mobile browsers (yes, even Safari).

And don't forgot to progressively enhance!
