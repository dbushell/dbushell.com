---
date: 2015-06-01 10:00:00+00:00
draft: false
slug: order-html-vs-css
template: single.html
title: 'Order: HTML vs CSS'
---

Content should follow a logical top-to-bottom order within HTML. CSS is used to change the visual presentation of this content across different viewports.

On small viewports — mobile phones for example — a vertical layout that mimics the HTML order is generally a safe default. For wider viewports it is common to introduce more complex layout that flows LTR (left to right) and TTB (top to bottom).

💤 I’m assuming English language content but the same ideas apply in reverse.

Basic stuff. Design can be a lot more creative.

> Compositional flow determines how the eye is led through a design: where it looks first, where it looks next, where the eye pauses, and how long it stays.
> <cite>Steven Bradley [Design Principles: Compositional Flow And Rhythm](http://www.smashingmagazine.com/2015/04/29/design-principles-compositional-flow-and-rhythm/)</cite>

**What happens when HTML source order differs from CSS presentation order?**

Below I’m going to tackle the technical aspect of this question.

## CSS Layout

CSS layout is not entirely independent of HTML source order. As a rule of thumb CSS follows the language’s natural flow (LTR / TTB). This can be hard to break.

By far the cleanest way to change presentation order I’ve seen is to use [Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/). It has a built in `order` property. [See my CodePen](http://codepen.io/dbushell/full/rVjoBr/) (embedded below) for an example that uses multiple fallback techniques to achieve the same results without Flexbox.


<iframe width="100%" height="300" scrolling="no" title="Reversing HTML Source Order" src="//codepen.io/dbushell/embed/rVjoBr/?height=150&theme-id=0&default-tab=result&embed-version=2" frameborder="no" allowtransparency="true" allowfullscreen="true">See the Pen <a href="https://codepen.io/dbushell/pen/rVjoBr/">Reversing HTML Source Order</a> by David Bushell (<a href="https://codepen.io/dbushell">@dbushell</a>) on <a href="https://codepen.io">CodePen</a>.</iframe>

This demo introduces a three column layout on viewports 640px and wider.

In the first example I’m using basic floats to create a grid. I’m then progressively enhancing to override **with Flexbox** and change the presentation order. You can toggle Flexbox support on/off to see the default order.

In the second example I’m using two very different techniques to achieve the same layout **without Flexbox**. This requires negative margins for the horizontal layout, and rarely used table display values for the vertical layout. The CSS is complicated and unintuitive but it works in IE9.

As you can see life is much easier with Flexbox!

There are other ways to change presentation order. For a basic two column layout you can simply `float` the first column `right` and the second column `left`. You could also consider `position: absolute` if an element has known dimensions, using padding or margins on siblings or the parent to make space.

Know of any other techniques? [Send me a tweet](http://twitter.com/dbushell).
