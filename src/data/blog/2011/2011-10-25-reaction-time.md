---
date: 2011-10-25 18:43:25+00:00
excerpt: None
slug: reaction-time
template: single.html
title: Reaction Time
---

Last week I wrote about [device optimisation](/2011/10/18/the-thoughtful-touches/) which adds a much needed bit of pragmatism to the holy grail of timeless, device-agnostic website design.

I touched on a technique that I'll expand here because it can be used more generically. If you're going for a responsive layout with interactive elements this makes a massive difference to UX.

## Relative & Responsive

Consider the hero of our theoretical home page design: a full width photo carousel. When the user clicks left or right, or swipes, a new image slides into view from one side.

Let's say we specify that a slide transition has a **1 second** duration. For a page **1000px wide** an image travels at 1px per millisecond, or more usefully, **100px/ds** (deciseconds). Assume this is not too fast, not too slow; a pleasant transition. Now consider the same responsive design viewed on an iPhone at **320px wide**. It still uses the same JavaScript to animate each transition for 1 second but at this size the speed is now **32px/ds**, i.e. rather more sluggish. Check out my very rough [JS Fiddle example](http://jsfiddle.net/dbushell/EXfkU/12/embedded/result/) to see this effect in action.

Speed = distance / time. In responsive design the distances are not constant. We can adjust for this in JavaScript by using the width or height of the animated element to calculate a _relative duration_. In CSS3 we don't have this ability (unless we apply it with JavaScript).

### A Noticeable Effect?

When we add interactivity we purposely slow things down with transitions. This is a good thing; the user has chance to see what's going on. But move things too slowly and frustration will quickly rise. Move things automatically and the user may not even notice (auto-play/auto-rotate sucks).

The perceivable different in my example above is only noticeable towards the larger extremes. If an elements width only varies between a couple hundred pixels it's probably not worth worrying about.

When I built the [aforementioned](/2011/10/18/the-thoughtful-touches/) photography-based website (still in production!) this relative effect was very noticeable. I wrote my JavaScript in standard desktop mode and after a quick round of iPhone testing it become very obvious just how annoyingly slow things were moving at a smaller scale. Relative duration calculations went a _long_ way. It felt snappy, it made the thing usable!

### One More Thing...

It's also worth considering that on touch screens the user implies their desired reaction time.

Think of a casual swipe verses an aggressive "get on with it!" swipe. The iPhone's natural scroll takes this into account and is very responsive as a result. This is hugely valuable information we don't get with a mouse click. Reacting to the user is the best way to improve their experience.

Something to think about!
