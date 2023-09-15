---
date: 2012-04-23 09:45:28+00:00
excerpt: None
slug: modularity-and-style-guides
template: single.html
title: Modularity and Style Guides
---

Last week I wrote about [scoping typographic styles](/2012/04/18/scoping-typography-css/) to introduce the concept of **modularity** in CSS. In that example, I removed the common globally defined text styles — for paragraphs, headings and lists etc — and scoped them with a `.text` class to be applied to any block of text-based content. This technique gives us more control and less conflicts.

It's one of many techniques I use in front-end website development. Below I'll introduce a few more and how I link them together for the ultimate _Power Up_ ★

_**Disclaimer:** there's no holy grail to building a website!_

## Modularity

If you're familiar with [SMACSS](http://smacss.com/), [OOCSS](https://github.com/stubbornella/oocss/wiki) or [BEM](http://coding.smashingmagazine.com/2012/04/16/a-new-front-end-methodology-bem/) you'll understand the concept of creating reusable "blocks" or "modules". These are patterns, both visually and in code, that can be reused and expanded upon when building web pages. Done right, time and complexity are significantly reduced. If you tackle each page one at a time, element by element, you end up repeating the same code over and over again. Methodologies like modularity solve the repetition problem exponentially as a website grows.

Before you get modular you need something to build.

## Style Guides

**[Style guides](http://24ways.org/2011/front-end-style-guides)** (or pattern libraries) are the _perfect_ place to start a website build and a modular base. They bridge the gap between design and development. They're somewhat similar to a traditional brand guidelines but contain less fluff & nonsense and 100% practical code examples.

A good style guide starts with the basics like typography (see above) and moves onto more complex arrangements of content and UI elements, like navigation and form constructs.

**The benefits of building a style guide first are enormous:**

* It shows the design elements you have at your disposal.
* Its shows the design elements you _lack_.
* It defines the modular HTML/CSS building blocks for the whole website.
* It provides an accessible baseline on which to build upon.
* It allows you to test code early in browsers and on devices.
* Oh, and it leaves a design & build blueprint for future development.

Building the guide highlights weaknesses in a design (before it's too late) and sets  you on the path to build simplicity. Just throw all the elements onto one very long page; don't waste too much time formatting it. The benefits are so incredible — I feel embarrassed for not utilising the style guide sooner! I use to consider them as _additional_ work but actually it results in far less. Whether you choose to expose and bill the style guide to the client is a question for another day. If you're a developer just do it anyway; it'll make your life a whole lot easier.

What's next? Continue building the website, you've already started.

At this point you'll have written a whole lotta CSS and HTML. In fact, if your style guide is comprehensive enough you'll have written the vast majority of it! Save that as your `base.css` or `global.css` and you could pretty much mark up the rest of the website with a vertical layout, i.e. the initial "mobile"/small-screen breakpoint, or _breakpoint zero_ (since more capable small-screen devices may get advanced interactive layout beyond this).

_**Remember:** the usability of a responsive design is directly proportional to the quality, planning, and arrangement of content. Don't dismiss a technique that takes advantage of screen size for a problem it never claims to solve._

The next step is to provide layout (at progressively wider sizes using media queries if you're going responsive). I use a combination of [global and layout css](http://adactio.com/journal/4494/) (also seen in the [Goldilocks Approach](http://goldilocksapproach.com/))  and ["Mobile First" CSS](http://nicolasgallagher.com/mobile-first-css-sass-and-ie/) with legacy IE support. The reason I go further with a separate IE stylesheet is so `layout.css` doesn't need to be afraid of advanced styling. It also means I can throw in the occasional `max-width` media query without issues. Yes, they're legal.

And that's it for now. I won't go too far into how to actually structure your HTML & CSS. There's too many factors to set out a single system. If you want to dabble with CSS pre-processors that's great; whatever suits you. I have my own theories I may share soon — I'm not one for conforming to the general consensus! — but that's for another day :)

On a similar topic, have a read of  Paul Robert Lloyd's [Build a responsive site in a week: designing responsively (part 1)](http://www.netmagazine.com/tutorials/build-responsive-site-week-designing-responsively-part-1) over at .net magazine. I'm liking the cut of his jib.


