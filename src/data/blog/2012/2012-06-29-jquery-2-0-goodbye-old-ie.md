---
date: 2012-06-29 08:19:31+00:00
excerpt: None
slug: jquery-2-0-goodbye-old-ie
template: single.html
title: jQuery 2.0, "Goodbye Old IE"
---

jQuery 2.0, expected release "early 2013", will drop support for Internet Explorer 6–8.

> jQuery was conceived specifically to address the differences in browsers, so we’re not going to abandon the essence of our philosophy and simply disregard the millions of active Internet users who (for whatever reasons) still use oldIE. Yet we also want to move ahead and take advantage of modern browsers, especially the growing mobile market.

jQuery version 1.9 will be fully API compatible, so for websites developed in 2013 it will be worth conditionally serving both versions so that modern browsers get a performance boost. The official press release has example code for this: [jQuery Core: Version 1.9 and Beyond](http://blog.jquery.com/2012/06/28/jquery-core-version-1-9-and-beyond/).

## Good News?

In short, yes. This is great news. I've lambasted website owners before for [actively blocking](/2012/04/02/dropping-ie-support/) and [celebrating](/2012/05/08/paydirt-youre-doing-it-wrong/) their lack of IE support, so what makes this news any different?

jQuery is a swiss army knife for JavaScript developers. A lot of front-enders would struggle to list exactly what is does and doesn't do. Very few would understand how it works internally. I could probably count on my hand the number of developers who know everything that it actually 'fixes' in old IE (I'm not sure I do).

jQuery is so pervasive that it is default boilerplate before interactively has even been designed. Most websites use but a fraction of what jQuery is capable of. All of this means that if you need to 'support' IE6–8 then version 1.9 will be perfectly adequate for years to come. Tens of thousands of websites are running perfectly well on older versions.

Just because jQuery 2.0 is dropping support for old IE doesn't mean you _have_ to.

When developing a _website_ always base browser support on past statistics and target audiences, **never global statistics**. Take it to a granular level with a [progressive enhancement](/2012/03/03/forget-about-browser-support/) approach. Unless we're talking about the likes of IE5.5 or Firefox 2, all-or-nothing support for a website on the _whole_ is an unnecessary decision. After all, it's entirely reasonable to expect most websites to work _without_ JavaScript enabled.
