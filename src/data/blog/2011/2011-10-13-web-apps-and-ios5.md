---
date: 2011-10-13 20:58:35+00:00
excerpt: None
slug: web-apps-and-ios5
template: single.html
title: Web Apps and iOS5
---

One less advertised feature of iOS5 is Mobile Safari CSS support for **`position:fixed`**. Much overdue, and very useful for creating "web apps" where navigation bars are fixed to the viewport's edge (top or bottom), allowing content to scroll naturally underneath.

Some mobile bowsers already support this (see [Mobile HTML5](http://mobilehtml5.org/) and [When can I use...](http://caniuse.com/#search=position)) and all modern [desktop browsers](http://www.quirksmode.org/css/contents.html) do (as you would probably expect).

The term "web app" is rather irrelevant, a website is a *website*, though functionality based mobile — *ahem, small screen* — websites are where this fixed positioning technique can be handy; it replicates the design paradigm that many native apps employ.

In the past we've had to either:

1. Use JavaScript to regularly reposition elements accordingly based on the documents scroll offset (to keep them in view). Very noticeably laggy and thus unacceptable.
2. Use **`position:absolute`** (top & bottom) on all containing elements so that the document is never larger than the viewport, then re-implement scrolling on the main container with JavaScript and touch event listeners. This is *OK* — Google's Ryan Fioravanti [explains how](http://code.google.com/mobile/articles/webapp_fixed_ui.html) — but it does cause gotchas with form elements, and trying to re-implement the smooth, native scrolling of the iPhone seems silly.

The lack of fixed positioning in Mobile Safari is a real headache for creating web apps. Matteo Spinelli — *the developer of [iScroll](http://cubiq.org/iscroll-4)* — knows this [all too well](http://cubiq.org/ios5-the-first-true-web-app-ready-platform). He envisions a future where most "native apps" are simply wrappers for responsive websites. A distinctly advantageous method:

> Web apps are much more than position:fixed or webGL. You can update them on the fly, build your own business model on them, ask for a subscription fee, have your users pay for additional features, or make them completely free.

And most importantly, the same app or website can be made accessible on all web devices, just like a good website should. There are many disadvantages of course, but those are for another article :)

## Maintaining legacy support

Should we rejoice in the fact that iOS5 now supports **`position:fixed`**?

Yes, but we're not quite home free. We still have to support the non-upgraders, the pre-iOS5 users. The trouble is that there's no easy way to check browser support for fixed positioning. Keep an eye on the [Modernizr discussion](https://github.com/Modernizr/Modernizr/issues/167) for the latest developments.

Once a trustworthy test is established we can start implementing the fixed positioning technique and use the old JavaScript method as a fallback. Let's not forget older devices. Calling a website a "web app" does not make it excusable to only support one or two devices (in my opinion). We're talking about graceful degradation as usual.

It's worth noting that iOS5 has also added support for **`overflow:scroll`** and **`-webkit-overflow-scrolling:touch`**, meaning that other native style interactions can be replicated a lot easier.

I've designed and built [mobile specific](/showcase/my-life-listed/) websites before, as well as many more fully responsive websites. With techniques like this I can see a future where responsive website designs can deliver a natively styled and packaged "web app" that is also accessible on normal mobile & desktop web browsing.

A preferable future, I'm sure you'll agree.
