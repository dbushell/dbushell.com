---
date: 2011-05-30 12:01:42+00:00
excerpt: None
slug: dont-tell-me-where-to-click
template: single.html
title: Don't tell me where to click
---

![Click Here - Apple's Magic Mouse](/images/blog/2011/clickhere.jpg)

**"*click here*", "*read more*", "*next*"** – a bad habit that just won't go away, and I'm to blame as much as the next designer (at least the "more" end of the spectrum, if that will save integrity).

Why is "click here" so bad?

> Good link text should not be overly general; don't use "click here." Not only is this phrase device-dependent (it implies a pointing device) it says nothing about what is to be found if the link if followed. Instead of "click here", link text should indicate the nature of the link target, as in "more information about sea lions"

That was written by the W3C, *eleven* years ago! [Read HTML Techniques for Web Content Accessibility Guidelines 1.0 for more information](http://www.w3.org/TR/WCAG10-HTML-TECHS/#link-text). (See I'm learning, soft of.) In the W3C's notes they hinted at three very strong reasons to avoid "click here" links:

1. **It's bad for accessibility**. A lot of assistive technology like screen readers abstract the content of a website. They can separate sections based on semantic HTML and WAI-ARIA roles but more often they dissect content is a simpler manner. Headings on the page can be listed and links can be listed. Imagine what happens when the screen reader abstracts all the links. The user gets a not so helpful list of 'click here', 'click here', 'read more', 'read more', 'read more', 'read more'...
2. **It's device-dependent**. Touchscreens "tap", I'm not sure what Google TV does, but I know my iPhone doesn't "click". Wait, W3C wrote these guidelines in November **2000**? There's a reason we follow web standards.
3. **It's bad content and usability.** This can fall into cognitive accessibility because it's not just about taste for quality copy, many disabilities make reading and comprehension difficult (a disability is not even required). There is no context to this style of linking, it reads poorly and the link attracts more attention than the surrounding text while providing zero information.

There's also another point the W3C didn't mention: *Search Engine Optimisation*. Or as I like to call it [good website design and development](/2011/04/12/seo-is-killing-website-design/) (seriously, the industry would be a better place if clients had never heard the term "SEO", but alas you can't hold back a marketing opportunity).

Search Engines and other HTML parsers have no context, no *semantics* to work with. So if good accessibility and usability guidelines that have been around since the birth of HTML don't persuade you to avoid "click here" links, you might be the sort of person who'll be convinced by "SEO".

## Let's get it right

Why does this problem still exist? I think party because content and copy are often considered *someone else's* problem. It's not even on the client's radar when they're looking for a new 'website design'. The designer assumes copy will be written later down the line. The developer takes responsibility for everything under the hood. Most agencies don't even have a copywriter in house so focus is elsewhere. It's often left to the client to provide the content and unlike us they don't have decades of knowledge.

This is another reason why content should be the centre piece of all web projects.

As a designer, what can I do? I've written how content and design strategy merge in [The Responsive Design Secret](/2011/05/11/the-responsive-design-secret/). In this particular case it's all down to deeper consideration for text-based navigation.

When we have so much opportunity for fancy graphics and interactivity we forget about what the web has always been; a network of linked pages – predominantly text-based. At the start of this article I highlighted other instances of the same problem, "read more" and "next". While our designs cannot demonstrate the omission of "click here" in copy, they can certainly and purposefully avoid these similar examples. With that we can explain to clients and get everybody understanding.

Now, does anyone have any advice for getting a copywriter on board from day one?
