---
date: 2012-03-03 18:24:54+00:00
excerpt: None
slug: forget-about-browser-support
template: single.html
title: Browser Support? Forget It!
---

What is meant by "browser support" when creating a website? Ensuring it is accessible by a browser is what I like to think of. Others may dream of pixel-perfection. Whatever "support" entails, browsers that don't make the cut are universally ignored with much delight and little chance of being usable.

It's common practice to maintain a list of supported browsers. Lately, Internet Explorer 7 was stricken from this list by many agencies and freelancers I know. If you're making the active decision to no longer "support" IE7 then you may as well drop support for desktop Opera as well! I certainly haven't seen any sites where Opera even registers in a significant manner. But Opera plays ball, right? It's reliable, it's modern — it just works — so we support it because it's easy.

What we must realise is that supporting a set of browsers does not mean we aim to deliver the exact same user experience across the board.

Here's what my [home page](/) looks like in **Internet Explorer 6**:

![dbushell.com in Internet Explorer 6](/images/blog/2012/v6-ie6.png)

IE6 sees a vertical layout with great typography. There's an assortment of minor aesthetic niceties that are lost but on the whole it's very *accessible*. That's the important thing. Just because I don't "support" IE6 doesn't mean I can't employ a design and build practice that ensures an adequate level of compatibility. I only checked IE6 after development. I knew my process would naturally produce these results based on a few simple techniques to scope style. And because it would take two minutes, I went on to replace the PNG logo with a GIF for IE6 to avoid alpha channel transparency issues (which in turn replaces an SVG logo). A touch of [device optimisation](/2012/01/11/device-optimisation/).

Here's my [website redesign article](/2012/02/27/spring-cleaning-redesigning-dbushell-com/) on the **Amazon Kindle**:

![dbushell.com on the Amazon Kindle](/images/blog/2012/v6-kindle.jpg)

Absolutely perfect! I don't know if many people have read my blog on their Kindle. I would guess not many, if anyone at all. So did I waste my time? How many hours did I spend testing on this device? None. The first and only time I checked was to take a photo. But what if it did look shit on the Kindle, do I go and fix it?

## What Browsers Do I Support?

Between 3rd March **2009** and 3rd March **2010** mobile traffic to my website accounted for 1.3% of visitors. The following 12 months through 2010–2011 saw 2.47%. Over the last 12 months — up until today — my site has seen **8.47% of visitors on mobile devices**. Over the same period Internet Explorer hit 7.18% — for all versions. (Opera was outnumbered by mobile the year before.)

We've seen eras where one browser dominated the scene. Currently we're in a time where none do. All of these mobile devices may not rank highly on their own but as a whole they represent a huge portion of the user base I cannot ignore.

Having a supported list for all the "popular" browsers doesn't cut the mustard anymore. It doesn't reflect reality. Does anyone actually write a whole list of supported mobile devices into a contract? Maybe a vague reference to smartphones "like the iPhone"?

### A Better Perspective

Instead of focusing on versions we should focus on standards and practices that allow our websites to stretch as far back as possible while reaching as far forward as possible. With that in mind **our efforts should still look forward**. An issue in a legacy browser drops away quickly, a new idea in a modern browser has a whole lifecycle to pass through. That's where priorities should lie.

I support browsers that support certain subsets of web standards. The goal is to build in such a way so that any subset is capable of displaying an accessible and attractive website. I maintain and adjust regularly a minimum set of required standards and features based on analytics but the barrier to entry need not be high (see my IE6 screenshot).

The website should reflect the design comps, normally three generic "desktop", "tablet", and "mobile" renderings, but the majority of design is done on a element-by-element, feature-by-feature basis. Browser support is therefore granular. Defining a subset for the whole website does not work, we'd be imagining a fictional browser. The subsets required for one element need not match those of another. **It makes no sense to ever declare any particular browser as 100% "supported". **There is never one definitive example of the website.

I believe questions of support should only be raised when individual elements of a website are planned. If an element is of critical importance to functionality, build it with a wider range of fallbacks. If a layout is essential to usability or call-to-action, design alternatives when the ideal is not possible (you have to do this anyway for a responsive design). Use progressive enhancement techniques to ensure these differences are scoped. **Consider the project budget** to decide if supporting *Element X* for browsers that implement *Feature Y* is worth the investment. Don't blindly follow a support list.

## Forget The Browser Support List

Maintaining a browser support list for clients has the potential to do more damage than good in my opinion. It does not reflect the reality of how websites are built, nor the devices which access them. It gives clients and developers alike the wrong impressive of what we should be trying to achieve. A traditional browser support list is completely ignorant of a website's requirements. It wrongly aims for parity across browsers and leads to much wasted time and money. Labelling individual browsers as all or nothing is madness. Considering what the web's future is shaping up to be like, it's also futile.

We should continue to choose a set of common browsers and devices to test a website but when it comes to support, consider each element of a website individually based on its importance. Decide which subset of web standards each element will support; multiple subsets if you're providing fallbacks to cover a wider array of potential browsers.

It's perfectly OK to say "this feature must work in IE7, it still accounts for a lot of users",  but don't stress yourself with CSS hacks and JavaScript shims when a simple redesign or alternate implementation is possible (and likely more usable for older technology).

My personal website "supports" IE6 and the Amazon Kindle because they support and implement a subset of web standards capable of rendering my design in an accessible way. Not the glamorous way Chrome does, but a highly usable way nonetheless.

It's time to tear up your browser support list!
