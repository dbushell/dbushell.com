---
date: 2023-10-6 10:00:00+00:00
slug: css-off-canvas-responsive-navigation-revisited
title: 'The Final Off-Canvas Navigation: Revisited'
description: 'The one where I regret using the word "final"'
---

So I may have used the word "final" rather ambitiously when I blogged ["The Final Off-Canvas Navigation?"](/2021/06/17/css-off-canvas-responsive-navigation/) two years ago. At least I left the door open with a question mark? I've since made big changes to the implementation.

## The New (New) Version

Checkout [my new demo on CodePen](https://codepen.io/dbushell/pen/xxmzddB).

All the good stuff remains like focus state, keyboard navigation, right-to-left styles. This is still experimental I don't consider it ready to use just yet.

### Dialog and Popover

Modern web browsers now support [dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) elements and [popover](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) attributes. These two allow for accessible interactivity with zero JavaScript. That means less code. There is no longer a need for the "no script" version that looks and behaves differently. Core functionality just works. I'm using a sprinkling of JavaScript for minor improvements.

### CSS Animations

My previous version used overflow and scroll-snap to show and hide sub-menus. That proved to be janky and gave little control over the transition effect. Now `popover` does the hard work with CSS animations.

Adding an opening transition is easy with the `:popover-open` pseudo-class. Closing transitions are tricky. [Chrome](https://developer.chrome.com/blog/introducing-popover-api/#interactive-entry-and-exit) appears to respect closing animations. Other browsers hide the popover immediately. I don't know what is "spec" here. For now I've used JavaScript to delay the actual `hidePopover()` until the animation ends.

I've also found `::backdrop` transitions to behave strangely for some CSS properties. In fact this pseudo-element behaves just plain weird from my experience.

## Ready to use?

Short answer: I don't know, so I wouldn't recommend it. While browser support is strong it's all very recent. I'd appreciate any accessibility related feedback on this implementation.

Find me at [@dbushell@fosstodon.org](https://dbushell.com/mastodon/) or [email me](/contact/).

A closing thought: do you really want your entire navigation dumped into an off-canvas `<dialog>` modal?
