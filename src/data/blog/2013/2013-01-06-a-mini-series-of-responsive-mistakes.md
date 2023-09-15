---
date: 2013-01-06 15:27:47+00:00
excerpt: None
slug: a-mini-series-of-responsive-mistakes
template: single.html
title: Responsive Mistakes (a mini-series)
---

Last week I shared some front-end experience with [5 tips for responsive builds](/2013/01/01/five-tips-for-responsive-builds/). It received positive feedback so I thought it'd be fun to continue with a new mini-series. This month I'll be focusing on the _mistakes_ we make. Without further ado, let's start with the biggest:

## Smart Phone, Tablet, Desktop

As a composition to highlight the benefits of responsive design, or to show off one's craftsmanship in a portfolio, this device trio is an appealing visual.

And that's all it's good for. For one thing, it ignores every _other_ device capable of displaying a website: feature phones, TVs, projectors, kiosks, ebook readers, printed paper, and even fridges, to name but a few; the list — for all intents and purposes — is endless.

Designing with three distinct devices in mind is misguided (even more so if you only care for Apple products). The Web is ubiquitous and it's our job to design for _what we know_, not what we prefer. As far as we're concerned there are devices with varying viewport sizes and connectivity. They have different input methods, e.g. mouse, keyboard, touchscreen, touchpad, stylus, remote, gaming pad, voice, and movement sensors. What's more, each device has a unique subset of web standards it supports and _many_ other features that give us a mere fragment of a clue towards user context.

## The solution

Acknowledge how little is known about the user's context. Realise that **trying to categorise devices is a futile exercise**. As [Jason Grigsby says](http://blog.cloudfour.com/responsive-design-for-apps-part-1/):

> Any attempt to draw a line around a particular device class has as much permanence as a literal line in the sand.

Design and build for an entirely fluid viewport ([don't forget height](/2012/11/19/responsive-bases-vertical-spaces/)). Allow content to dictate design breakpoints. Remember that responsive design is not just about fitting content into layouts that negate zooming. Consider the effects of scrolling too; how is usability affected when elements move off screen?

Give affordance in your design, for example, provide a healthy amount of whitespace around interactive elements for thin pointers and fat fingers. Only get specific after **feature detection **and then **progressively enhance** from an accessible baseline.

Finally, don't get caught up in the "mobile-first" hype without thinking. Look at your website's analytics and future projections. Optimise for _today_ from a **business perspective**. A device-agnostic mindset is undoubtedly our best stance as designers but sometimes other factors may supersede (with caution). After all, design is not timeless and the Web evolves quickly.

## Coming up next…

Understanding what we're actually designing for is the first hurdle. Over the next few weeks I'll be introducing other responsive design mistakes and how to avoid them — and I've made/overcome a few!

[Follow me on Twitter](http://twitter.com/dbushell) for future updates in this series.
