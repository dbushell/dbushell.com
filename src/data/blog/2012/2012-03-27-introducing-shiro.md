---
date: 2012-03-27 08:15:02+00:00
excerpt: None
slug: introducing-shiro
template: single.html
title: Introducing Shiro
---

**Update — March 19th, 2013:** [please read this article for updates!](/2013/03/19/on-responsive-layout-and-grids/)

I've always taken a very liberal/aggressive approach to progressive enhancement. Older browsers get accessible content but layout is limited and aesthetic styles are better lost completely than hacked on with nasty techniques.

Every website is different of course. When I redesigned my [personal website](/2012/03/03/forget-about-browser-support/) I had a large list of "required" standards to see the optimal version. That's cool; my audience is on the cutting edge of browser tech. I wasn't too worried about delivering complex layout to old versions of IE. Our latest project at [Browser](http://www.browserlondon.com/) sees an audience that is almost **50% Internet Explorer —** and a great many lower than version 8. (I spat my coffee out too.)

We've designed a bold visual style that looks very modern but won't depend on any fancy CSS. Great, but what about layout? Producing a basic linear format for such a large percentage of visitors isn't the "best possible experience" I like to take about. I've been working on a solution...

## Hello Shiro

To solve this little conundrum I've been experimenting with a basic responsive grid that can transform into a fixed-width layout in IE6–8 (which don't support media queries). All with a tiny 1000 byte JavaScript shim. Shiro is a building block for your mobile-first build, it won't fix further IE bugs but it's a nice start.

[Visit the Shiro preview](http://shiro.dbushell.com/) and have a hack around.

Here's what it looks like in IE6:

![Shiro in IE6](/images/blog/2012/shiro-ie6.png)

PS, I will be dogfooding this in the coming weeks so expect updates!
