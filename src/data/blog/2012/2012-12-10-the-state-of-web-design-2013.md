---
date: 2012-12-10 22:07:34+00:00
excerpt: None
slug: the-state-of-web-design-2013
template: single.html
title: The State of Web Design, 2013
---

To wrap up 2011 [I wrote a few thoughts](/2011/12/15/web-design-2012-and-beyond/) on web design looking forward. Because I found it so helpful to remain focused with this personal reference, I'm doing it again this year.

**I encourage you to do the same!**

This all stemmed from a [tweet](http://twitter.com/dbushell/status/258633483579162624) back in October. It's fine to observe and copy trends, but it's also important to reflect upon your own work and instigate new ideas. They don't need to be revolutionary, but if you don't share your thoughts the evolution of web design becomes mighty slow. So with that, you know what I ask of you!

This is my personal take:

## Improve Responsive

In essence [responsive design](/2012/06/17/passenger-focus-responsive-web-design-case-study/) is about adapting a website to best fit the **device viewport**. One website for [One Web](http://vimeo.com/27484362). We use CSS media queries to build fluid grids and flexible media. It's worth remembering _why_ we do this. By creating a single _device-independent_ website we gain:

* **Accessibility:** a canonical web location without fragmentation of content or users.
* **Maintainability:**  a single codebase to develop and deploy.
* **Usability:** a website that, in theory, is easy to navigate on any device.

That last point — usability — is one we cannot forget. By adapting to the [device width](https://developer.mozilla.org/en-US/docs/Mobile/Viewport_meta_tag) we're removing the need to zoom and pan; a painful way to navigate. But what often happens is that we stack content vertically. This results in endless scrolling.

[As Brad Frost recognises](http://mobile.smashingmagazine.com/2012/08/22/separate-mobile-responsive-website-presidential-smackdown/):

> Scrolling through disparate content types is not a good experience. How do users figure out that other content exists? Finding what they’re looking for becomes a scavenger hunt.

A partial solution I've explored is [adapting to the viewport height](/2012/11/19/responsive-bases-vertical-spaces/). Going further we need to develop more interactive forms of content navigation. I'm a big fan of **off canvas** layouts — [Luke Wroblewski](http://www.lukew.com/ff/entry.asp?1569) and [ZURB](http://www.zurb.com/playground/off-canvas-layouts) can tell you everything. Even simpler is the idea of collapsible content patterns. See [Stuart Robson's accordion to tabs demo](http://www.alwaystwisted.com/post.php?s=2012-10-14-a-responsive-accordian-to-tabs-pattern) (which could easily be fully expanded on large screens). Further to this we may employ [conditional loading](http://24ways.org/2011/conditional-loading-for-responsive-designs/).

There is always a desire — and danger — to adapt to things we don't actually know; context assumptions. Stephanie Rieger reinforces this point in her article: [Mobile users don’t do that](http://stephanierieger.com/mobile-users-dont-do-that/). However, with further development in device API's one day we'll have the data we need. Dan Donald calls this [the reactive web](http://24ways.org/2012/should-we-be-reactive/). I've always erred on the side of caution in this respect — [high-resolution images](/2012/10/23/the-real-cost-of-retina/) are trickier than we think — but it's undoubtedly a benefit if done right.

## Reject Isolation

I'm not discussing **performance** in detail here because I do not believe _responsive design_ is inherently related. Bad performance is indicative of bad development. [Tim Kadlec shares my opinion](http://24ways.org/2012/responsive-responsive-design/) and addresses the solution. Time to brush up on development on both sides of the pipe. I would highlight Dave Olsen's chapter in [The Mobile Book](/2012/12/05/the-mobile-book/) as a perfect place to start.

Regardless of our design and development ability, the biggest factor to a successful website is the **process**. After really getting to grips with prototyping in iterative cycles this year I've radically changed many of my practices. Photoshop remains a useful tool for me but it no longer produces deliverables. Design "sign-off" no longer exists.

I stand by [my statement](/2012/08/27/im-bored-with-code/) that the perceived quality of “hand-crafted” code is becoming too expensive to uphold. CSS pre-processors have allowed me to develop modular patterns while remaining focused on the bigger UX questions. Despite considering myself a front-end designer & developer, I will continue my desire to spend less time coding in 2013. Less head in keyboard, more collaboration with clients, colleagues, and users.

## Break the Paradigm

As Paul Robert Lloyd reminds us, [the web aesthetic](http://www.alistapart.com/articles/the-web-aesthetic/) involves a medium we're yet to fully understand. I believe the next evolution in web design will arise when we truly break away from the paradigm our practices are grounded to. We have to destroy the page metaphor.

As [Mark Boulton notes](http://www.markboulton.co.uk/journal/anewcanon):

> The browser is a flexible window into the web. It grows and shrinks to the users screen size. The user can move it, stretch it, scroll it. The edges are not fixed. It is not a page, but a viewport.

Embrace the viewport.

We're seeing a less linear approach to design and more app-like experiences. [Dmitry Fadeyev on the Usability Post](http://www.usabilitypost.com/2012/12/05/news-sites-redesign-trend/) has recognised this trend. While he takes issue — _"instead of building the site like a physical page, they treat it like a canvas for an app"_ — I actually applaud this thinking. (Dmitry rightly goes on to explain why his examples are ultimately poor form.)

Separating intent from execution, there is _something_ to be inspired by with this trend. Fixed viewport elements are most notable. Done with subtlety they can alleviate the endless scroll and scavenger hunt effect so common to responsive websites.

I believe we can take the concept of what a website is further. We still need to maintain a sense of state because content needs to be accessible via URLs. Users need to grasp the information architecture and remain confident of location. The question is though, why are we reloading the entire page with every link? I think the web industry is suffering from a Flash hangover. We revolt at anything that resembles the capabilities that Flash had over standards based development. With that we're failing to explore interactivity to its fullest potential.

* * *

And with that I'm signing off for the year. Before I go I would love to hear what the _State of Web Design_ means to you. Get blogging and let me know!
