---
date: 2013-03-12 18:26:36+00:00
excerpt: None
slug: automation
template: single.html
title: Automation
---

I used to believe hand-crafting every line of code was a necessity. [I u-turned on that opinion](/2012/08/27/im-bored-with-code/) and adopted **CSS preprocessors** with much gusto last year.

It wasn't so much the syntactical learning curve that initially put me off — they're familiar if you've done any kind of programming — it was the perceived "added complexity" they would bring. For what, one more barrier to entry? The value I've since found:

* Code maintainability with includes.
* Understandable media query breakpoints across modular patterns.
* Relief from the repetition of vendor prefixes and fallbacks.

CSS preprocessors have become integral to my workflow. I don't go overboard. It's very important to refrain from doing things differently for the sake of it. Yet I now find it painful to work without them.

## A new process

I cringe when I think of the amount of PSDs I used to produce. When I first started working agency-side it was expected that the client would see a minimum of three design mock-ups to choose from. I did well whittling that process down to a single, evolving design.

These days there are no final design mock-ups. No sign-off stage. Design and build happens at the same time. I do very little "designing in the browser" — writing code doesn't exactly allow creativity to flow in that sense — but I get there fast.

This change in methodology has highlighted many more bottlenecks in my design and front-end development. CSS preprocessors were just the tipping point. Today I'm using [Grunt](http://gruntjs.com/) which performs the following tasks for me:

* CSS preprocessing with [Sass](http://sass-lang.com/) (via [Compass](http://compass-style.org/))
* JavaScript linting and minifying with [UglifyJS](https://github.com/mishoo/UglifyJS)
* SVG optimisation/minifying with [SVGO](https://github.com/svg/svgo)
* SVG rasterisation *

💤 _* to create PNGs from SVGs I use a [PhantomJS](http://phantomjs.org/) script (heavily based on [Grunticon](https://github.com/filamentgroup/grunticon))_

I'm even working on my own Node.js tasks to build HTML includes for faster prototyping. I really like [Hammer for Mac](http://hammerformac.com/) but its all-or-nothing simplicity sits awkwardly with my additional requirements. [Mixture](http://mixture.io/) is another tool I look forward to testing.

## Dependancy

For projects I'm working on alone these tools have sped up my workflow massively but I worry I'm becoming too dependant.

[Scott Kellum](http://scottkellum.com/blog/specializing-yourself-into-a-corner.html) has an internal conflict I know all too well:

> I'm not saying these tools aren't valuable because they absolutely are. They are just introducing fragmentation into our community and I am noticing how much of a part of it I have become. I want to share my code with _everyone_ who writes CSS, not a subset of that group.

Sharing and working with others; occasions where I'll have to down tools and do things the old fashioned way? That may be painful, but when I look at how complex browsers are becoming the price of automation is one I'm happy to pay.

And what of fragmentation? That is inevitable in my opinion. When I [wrote](http://coding.smashingmagazine.com/2013/01/15/off-canvas-navigation-for-responsive-website/) and [spoke](/2013/03/03/a-responsive-day-out/) about responsive navigation recently I shared a lot of practical techniques and concepts. The final code; that was less important. Implementation is becoming too nuanced for copy & paste examples. When it comes to sharing I'm starting to find more value in the automated process rather than the final output.

Automation, for me, is here to stay.
