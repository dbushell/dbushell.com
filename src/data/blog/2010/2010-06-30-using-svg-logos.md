---
date: 2010-06-30 20:20:59+00:00
excerpt: None
slug: using-svg-logos
template: single.html
title: Using SVG Logos
---

_***Update*** 1th November 2011: [The Good, the Bad, and the Logo](/2011/11/11/the-good-the-bad-and-the-logo/)_

If you visited this website recently you may have noticed the new logo/emblem that adorns the top centre of the design. For the last few days that logo was simply a _PNG_ image. Well this evening **I asked myself why?** It's obviously been designed as a vector graphic.

So that is what I made. I saved the logo as an _SVG_ file from Adobe Illustrator and embedded that instead of a raster image. The file is around 20kb at its smallest (see problem below) which I can handle because it looks _super sweet_ on my iPhone 3GS when I zoom in. Just think how it'll look on the iPhone 4's Retina display! Maybe I'll do some browser testing in the Apple store, I got kicked out for that last time...

### A small problem with objects

I've embedding an external _SVG_ file using the `<object>` tag with my original _PNG_ image as a fallback (I hope this works in Internet Explorer! will test tomorrow). The problem with this technique is that I don't think it's possible to have a transparent background – it defaults to a white square. The simple solution I found was to embed a background image within the _SVG_ file. It works perfectly but doubles the file size.

If anyone knows a better solution let me know!

The other issue I came across was keeping the link back to my home page. Even with a jQuery click function the object tag doesn't want to behave. I'm happy to let that go on this website, but with a more traditional top-left logo I'm not so sure.

### Browser compatibility

Someone correct me if I'm wrong but this technique seems pretty fail safe to me as it just falls back to the _PNG_ if there's no _SVG_ support. And I'm well aware that this website requires a modern browser to actually render properly at all, that's the beauty of being my own client!

And if you're wondering why I spent my evening obsessed with vectorising my website, see this article by Aral Balkan: "[How to make your web content look stunning on the iPhone 4’s new Retina display](http://aralbalkan.com/3331)" I found via twitter.
