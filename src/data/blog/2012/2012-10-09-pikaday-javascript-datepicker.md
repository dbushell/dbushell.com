---
date: 2012-10-09 08:03:10+00:00
excerpt: None
slug: pikaday-javascript-datepicker
template: single.html
title: 'Pikaday: JavaScript datepicker'
---

Pikaday is a JavaScript datepicker with a light footprint and easy style-ability with [modular CSS](/2012/04/23/modularity-and-style-guides/). It's in 'developer preview mode' but already looking great:

![Pikaday screenshot](/images/blog/2012/pikaday.png)

## Why now?

Because as much as we like open standards, the [HTML5 input types](http://www.quirksmode.org/html5/inputs.html) lack browser support and are poorly implemented in places; see Chrome (22 as of writing) below:

![Chrome date input](/images/blog/2012/dateinput1.png)

This leaves us with a tricky situation. Normally we can safely use new web standards with the knowledge that non-supporting browsers will simply ignore them, or we can use [feature detection](/2012/03/03/forget-about-browser-support/) to progressively enhance the experience. With the state of the new input types however, this unfortunately means polyfill-only for the foreseeable future.

**Pikaday [demo](https://pikaday.com/) and [source](https://github.com/dbushell/Pikaday) on GitHub.**

What's wrong with the ubiquitous [jQuery UI datepicker](http://jqueryui.com/datepicker/)? This little guy has been my go-to widget for many years. Trouble is the dependencies are very heavy; 50kb+ of JavaScript (minified and compressed), and several image requests. jQuery UI is great (and [very much alive](http://blog.jqueryui.com/2012/10/jquery-ui-1-9-0/)) but to me it feels like an all-or-nothing commitment.

**Pikaday is packed below 5kb** and isn't even dependent on jQuery. It does play well with [Moment.js](http://momentjs.com/) if you need advanced formatting. This datepicker has literally been on my "projects to build" list for _years_. I've seen alternatives since but nothing I've been happy to develop further.

What's next? Please report any bugs and feature requests on the [GitHub issue tracker](https://github.com/dbushell/Pikaday/issues). I'm working on date range and time selection. I'll likely ship it on a live website soon and announce a production-ready version.

(This project has delayed my [redesign](/2012/09/30/groundhog-day/) but rest assured it'll happen soon!)
