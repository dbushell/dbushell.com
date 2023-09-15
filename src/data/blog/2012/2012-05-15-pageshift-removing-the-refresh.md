---
date: 2012-05-15 22:10:48+00:00
excerpt: None
slug: pageshift-removing-the-refresh
template: single.html
title: Pageshift
---

It's 2012, why are we still seeing websites assemble like Optimus Prime?

In January I wrote [Web Design: 2012 and Beyond](/2011/12/15/web-design-2012-and-beyond/) to highlight points of interest for the coming year. On **interactivity** I asked, _"Is the page reload a thing of the past?"_. 'Web apps' are all the rage, and while we shouldn't be trying to copy native (the Web is much more than that), surely it's about damn time to rid our browsers of the page refresh?

Inspiration can be drawn from slide decks like [CSSS](http://leaverou.github.com/CSSS/#intro), [deck.js](http://imakewebthings.com/deck.js/) and [impress.js](http://bartaz.github.com/impress.js/), though they all require very specific markup and single page content. Other solutions built on top of JavaScript MVC frameworks like [Backbone.js](http://documentcloud.github.com/backbone/) require a massive effort to maintain URL [accessible states](http://tomdale.net/2012/05/ember-routing/).

As a Friday coding† experiment I asked myself if I could remove the refresh and add page transitions to a website that was already built...

## Say hello to Pageshift

[Pageshift](https://github.com/dbushell/Pageshift) is undoubtedly the worst thing I've ever written for the Web!

The screencast frame rate below is a little choppy; best to try it yourself. See [Pageshift on GitHub](https://github.com/dbushell/Pageshift) for the code and a neat little bookmarklet you can try on any website. Some work amazingly, others fail spectacularly.

<p class="b-post__image"><span class="b-fitvid" style="padding-top:85%"><iframe src="https://player.vimeo.com/video/42234715" frameborder="0" width="500" height="425"></iframe></span></p>

### This is a prototype!

It does a pretty tidy job of swapping out `<body>` elements with CSS transitions and 3D transforms. A lot of `<head>` meta data is also updated. It even supports the History API. It only works on internal links. All JavaScript gets stripped for the time being until I figure out the best way to handle that.

You could probably use it to turn an existing website into a Powerpoint presentation.

Will I develop this further? Maybe. It was extremely fun to take this far and doing it _without_ jQuery was a big challenge. Ultimately it's just not a good solution! I may develop it to work with individual elements rather than whole pages, that might be useful...

† _Friday coding: a micro-hackathon. Normally an hour or two before beer'o'clock._
