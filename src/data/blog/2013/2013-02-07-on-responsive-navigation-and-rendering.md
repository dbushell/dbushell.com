---
date: 2013-02-07 09:09:27+00:00
excerpt: None
slug: on-responsive-navigation-and-rendering
template: single.html
title: On Responsive Navigation and Rendering
---

When I launched my [new website](/2013/02/04/a-new-home/) earlier this week I implemented the [off-canvas navigation](http://coding.smashingmagazine.com/2013/01/15/off-canvas-navigation-for-responsive-website/) technique I'd written about for Smashing Magazine. It uses silky smooth CSS transitions and looks great on mobile (if I do say so myself).

A small problem came when I set a high breakpoint. The navigation is always off-canvas up to a width of 60em (that's normally 960px). While it's possible to make the nav element fixed or fluid width — I opted for 70% — it looked awkward on tablet size screens. It's very wide and the menu items are small resulting in masses of whitespace. Some whitespace is good, but this just looked unfinished.

Not any more! I've added an intermediate state:

![responsive navigation](/images/blog/2013/responsive-navigation.png)

## The "app screen"

I'm experimenting with an intermediate state that essentially mimics the app screen we know and love. It utilises the available space for big touch-friendly buttons. This breakpoint sits between 40–60em. I quite like this design. It does feels a bit unusual initally, but then I guess it is — what do you think? [Give me a tweet](http://twitter.com/dbushell).

## A note about CSS transforms

One of the issues with this CSS transitions/transforms is text rendering.

When a web browser renders a page it starts drawing pixels to a single bitmap layer. Separate render layers may be created for things like `<canvas>`, `<video>`, transparency, masking, and other CSS filters. These layers are then composited.

Say for example you do:

````css
.flyout {
    transform: translate3d(-100%, 0, 0);
    transition: transform 500ms ease;
}
.flyout.is-active {
    transform: translate3d(0, 0, 0);
}
````

Web browsers paint the `.flyout` element on its own render layer. After certain effects are applied these layers can be re-composited without having to touch the DOM or recalculate layout (an expensive performance hit). In certain situations, like CSS 3d transforms, the layers are rendered once then shipped over to the GPU for future composites. This hardware acceleration is an amazing speed boost. If the viewport resizes, or any other element changes, it's probable that much of the page layout has to be recalculated (producing fresh render layers).

That's a very high-level overview and I've probably got some terminology wrong, but it gives you an idea of what's happening.

On standard definition displays you'll likely notice the quality of text rendering diminishes. Sub-pixel antialiasing is lost because text is rasterised on the layer and then moved about before the final composition. Text becomes slightly blurry — at least, less perfect than we're used to seeing.

This side-effect is less noticeable during animation and on high pixel density screens. Which will be the standard in a few years. Hopefully. Who am I kidding…

Anyway, I don't think it's a game changer. It's still far better than what users will see on older PCs without ClearType.

💤 _iPad Mini PSD by [Anton Kudin](http://dribbble.com/shots/841755-iPhones-iPad-minis-PSD) and Nokia Lumia 920 by [Matias Gallipoli](http://dribbble.com/shots/780376-lumia-920-yellow)_

