---
date: 2012-10-23 13:04:54+00:00
excerpt: None
slug: the-real-cost-of-retina
template: single.html
title: The Real Cost of Retina
---

When the new iPad went on sale earlier this year the interest in high-resolution website design skyrocketed. We saw an influx of half-baked "[Retina](/2012/07/13/vector-graphics-retina-and-you/)" solutions.

Alongside this the bigger picture — so to speak — of [responsive images](http://www.w3.org/community/respimg/) produced lengthy debate. We're starting to see the fruits of that labour with a new [picture element proposal](http://responsiveimagescg.github.com/picture-element/). This is a good thing but it's not perfect.

To accurately serve the best image we need to know:

* Screen resolution *
* Screen pixel density
* Connection bandwidth

The first two can be achieved today with [CSS3 media queries](http://www.w3.org/TR/css3-mediaqueries/). Understanding connection bandwidth is still a long way away (see [The Network Information API](http://dvcs.w3.org/hg/dap/raw-file/tip/network-api/Overview.html) and [HTTP Client Hints](https://docs.google.com/document/d/1xCtGvPbvVLacg45MWdAlLBnuWa7sJM1cEk1lI6nv--c/mobilebasic?pli=1)). I've seen responsive image implementations that claim to estimate this — they're not good enough. And even if we achieve this trifecta we're forgetting a forth point:

* Device bandwidth cap

Mobile contracts have extortionate data costs (at least in the UK). It's not getting any better. With [EE's LTE pricing plan](http://www.theverge.com/2012/10/22/3539628/ee-lte-price-plans) you can pay £36/month for a whopping 500mb. As many have widely mocked today: at full throttle — averaging 15mbps — that allowance is going to last you a staggering five minutes or so. Just splendid.

We may think that serving high-res images on a website is going to drastically enhance the experience, but are we considering the real cost? I'll tell you one thing:

**Please spare me your high-res "Retina-ready" images!**

I can't afford it. At least for the foreseeable future.

Seek [resolution independence](http://coding.smashingmagazine.com/2012/01/16/resolution-independence-with-svg/) by employing a design style more suited to the [medium](/2012/09/25/what-is-the-medium/). More visuals through CSS and SVG; less bitmap data.

*** Update:** this should actually say the size of an image's containing element, [thanks Paul](http://twitter.com/paulrobertlloyd/status/260732321081200640)!


