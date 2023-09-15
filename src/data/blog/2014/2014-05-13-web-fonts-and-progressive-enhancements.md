---
date: 2014-05-13 10:16:29+00:00
excerpt: None
slug: web-fonts-and-progressive-enhancements
template: single.html
title: Web Fonts & Enhancements
---

Yesterday I found myself thoroughly impressed with [Laura Kalbag's](http://laurakalbag.com/) effort to ensure the [Indie Tech Summit](http://indietech.org/summit/) website remains well designed.

![Indie Tech Summit web fonts](/images/blog/2014/indie-tech-web-fonts.png)

In the screenshot above you can see the page design before and after web fonts have loaded. This is a superb example of **progressive enhancement**.

Had web fonts failed to load I wouldn't have known otherwise. Of course, in comparison the preferred design look so much nicer, but what's important is that should this not be available, nothing looks noticeably broken.

Laura is able to control the design this way because the web fonts are loaded via JavaScript and CSS has been written to address both scenarios.

## Asynchronicity

By themselves web fonts aren't dependant on JavaScript but many font providers require it to control usage and deter theft. Regardless, given their relatively large download size and our desire for progressive enhancement, I find asynchronous JavaScript loading to be a useful practice.

In my [latest portfolio piece](/2014/05/07/responsive-design-for-uwe-wittwer/) I too have taken advantage of web font loading in order to improve the website's typography:

![Uwe Witter typography design](/images/blog/2014/uwe-wittwer-kerning.png)

As illustrated in the screenshot above, with [Futura PT from Typekit](https://typekit.com/fonts/futura-pt) spacing between letters — particularly the "w" and "e" — is uneven and requires manual adjustment. Without JavaScript to load and detect font availability I'd be stuck with bad kerning. In which case I'd rather see the more generic system font.

Usually I'll strive for simplicity wherever possible. In this case I wish a single `@font-face` CSS declaration was enough without messing around with JavaScript. Such is life as a front-end developer I suppose. It's rarely simple but that's ok. We first understand the problem then we decide the most appropriate solution. If that includes prioritising design integrity, even better.
