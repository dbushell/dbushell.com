---
date: 2021-06-17 10:00:00+00:00
slug: css-off-canvas-responsive-navigation
title: 'The Final Off-Canvas Navigation?'
description: 'The one where I try writing a click-baity title'
---
Eight years ago I wrote a (then) modern guide to [implementing off-canvas navigation](https://www.smashingmagazine.com/2013/01/off-canvas-navigation-for-responsive-website/) for **Smashing Magazine**. My [original demo](https://dbushell.github.io/Responsive-Off-Canvas-Menu/step4.html)  is still online (links in the article are broken). It's rather quaint by today's standards.

Back in 2013 responsive design was not yet fully accepted as the norm. Unthinkable! JavaScript was needed to fix the `nav` element in IE. Between then and now I must have written over a hundred variations of this pattern improving it over time. I've often advised against it as it can encourage lazy information architecture.

## The New Version

Check out [**my new demo on CodePen**](https://codepen.io/dbushell/full/yLMEogE).

I think I've finally nailed it... well I am at least happy with the latest iteration but I'll continue to tweak it. I've listed the key features on the demo page and expanded upon them below. It's all built with accessibility and performance as a priority.

### Progressive Enhancement

The navigation works **without JavaScript**. It's set up using the *"jump to menu"* and *"return to top of page"* anchor pattern with the `<nav>` element at the end of the document. Sub-menus are accessible with the aid of `:target` selectors.

### Scroll Snap

[CSS Scroll Snap](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Scroll_Snap/Basic_concepts) is the magic behind the sub-menus. The sub-menu `<ul>` elements sit side-by-side with the parent overflow hiding all but the active menu. Each sub-menu link references their target to activate them, e.g. `<a href="#menu-2">`.

### Optional Animations

Because the sub-menus use native browser scrolling, transitions back and forth are added with a single CSS declaration: `scroll-behavior: smooth`. The `prefers-reduced-motion` media query is used first to respect user preference.

The main open & close off-canvas animation uses JavaScript to toggle various CSS transform transitions. [My example](https://codepen.io/dbushell/full/yLMEogE) has some opinionated design to demonstrate effects like overlay transparency. For simplicity, the no-JS default contains no motion.

### Accessible Markup

I've taken care to use appropriate elements and ARIA attributes. To the best of my research and testing I've implemented this correctly. Feedback is very welcome [@dbushell](https://dbushell.com/twitter/).

### Focus State and Keyboard Navigation

I'm all about [focus state](/2021/04/30/accessibility-css-focus-state/) and `focus-visible` means no more weak "ugly design" excuses. Generally speaking, using a pointer — mouse, finger, etc — leaves no focus outline; keyboard navigation does. Ultimately it's for the browser to decide. The "Escape" key can be used to close the menu. To trap and restore focus I've borrowed a technique from **Kitty Giraudel's** fantastic [A11y Dialog](https://github.com/KittyGiraudel/a11y-dialog).

### Right-to-Left Styles

RTL styling is supported out of the box. [CSS logical properties and values](/2021/02/02/changing-css-for-good-logical-properties-and-values/) make this fairly trivial to provide. The document attribute `<html dir="rtl">` is used to change the JavaScript animation. A reasonable requirement, I think?

You could, of course, partially invert the design regardless of language direction. I feel like most LTR designs I see nowadays use a right-hand-side menu but it's not a hard rule.

### Sticky Header

The demo features a bonus "sticky header" technique. That's a common complimentary pattern and easy to do efficiently with an [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).

## Browser Support

Modern browsers are very good. Unfortunately Safari is a step behind them. I'll save my PWA rant for another day; my off-canvas navigation works fine in Safari. There are a few niceties that require JavaScript polyfills (`scroll-behavior` and `focus-visible`). Personally I'd opt to avoid unnecessary JavaScript. In this case the polyfills are lean enough that I wouldn't put up much of a fight if project stakeholders questioned it.

### Plugin? React?

No "plugin" I'm afraid. An MIT licensed [CodePen demo](https://codepen.io/dbushell/full/yLMEogE) is all I'm maintaining! The nuances are too varied to provide a configurable plugin. Doing so would bloat the code with more settings than actual functionality and make it less adaptable. I might work on a few design variations to show how flexible it can be.

There's nothing that couldn't be reimplemented in component frameworks like React or Svelte. No DOM nodes are added or removed. Only attributes and temporary styles are modified. If the components are only rendered once you could run the JavaScript as-in after everything is mounted. Or go ahead and fully integrate it to bind elements etc! I'm guessing if you know those frameworks my JavaScript should be simple.

Like I said I'm still working on this and constructive feedback is welcome [@dbushell](https://dbushell.com/twitter/)!
