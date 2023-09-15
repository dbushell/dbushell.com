---
date: 2011-10-01 13:03:06+00:00
excerpt: None
slug: building-for-future-design
template: single.html
title: Building for Future Design
---

2011 is vanishing fast!

I've been busy working hard at my new home ([Browser](http://www.browsercreative.com/)) refining my front-end coding skills.

My focus has been on honing the semantic and accessible nature of the websites we build. That is the underlying requirement I need to fulfil my mandate of designing superb user experiences. It's really all about pushing website design forward. To do that you can't ignore the foundations.

Gone are the days where a beautifully interactive website will suffice that consists of surface quality and little more. Websites with only that concern don't last. They don't convert sales, they piss off more users than they seduce. But that doesn't mean that websites have to be boring and rigidly static. It's my job to lay the groundwork so that we can enhance user experience while maintaining _accessible_ interactivity.

## Looking forward

Earlier this year I wrote about [Bringing Interactivity To Your Website With Web Standards](http://coding.smashingmagazine.com/2011/02/03/bringing-interactivity-to-your-website-with-web-standards/) for _Smashing Magazine_ showcasing some of the experimental techniques in practice today.

In recent months Adobe demonstrated with [Edge](http://labs.adobe.com/technologies/edge/) and [Muse](http://muse.adobe.com/) that you can build animation and interactivity _with_ web standards and still get it **disastrously wrong**. (I'll explain how to do it _right_ below.) I [had](/2011/08/01/adobe-edge-preview/) high hopes for Edge and I do believe the future of web design will continue to move away from its print design influences, but I must remember that websites are more than just skin deep. Aesthetics should not be priority.

The web is the world's digital information archive. It's built upon open standards to ensure accessibility on any connected device. As practitioners we have a responsibility to maintain that basic principle. If we do that we can be [Future Friendly](http://futurefriend.ly/). We can experiment with new design paradigms and we can take advantage of new technology.

## Building the foundations

With my new job and opportunity to work on some very large scale responsive UI designs I've spent a lot of time reviewing my build practice. Designing these websites is great fun. Experimentation in design leads to innovation, but however safe or radical of a design we deliver to the clients, actually implementing it properly is the most important part.

This is a condensed version of my build workflow. In reality it's not entirely as linear as I've listed here but in theory I find this a useful way to consider it.

It goes a little something like this:

* Write the website's entire HTML using only elements and tags that make semantic sense.
* I think about _content_, not the design (use dummy content if need be). Any images are content, they supplement the textual information.
* Make sure the [document outline](http://coding.smashingmagazine.com/2011/08/16/html5-and-the-document-outlining-algorithm/) is correct.
* Add in [WAI-ARIA](http://www.w3.org/TR/wai-aria/) — not as scary and the name suggests.
* Add in [Microformats](http://microformats.org/) or [Schema](http://schema.org/) (and [Open Graph](http://developers.facebook.com/docs/opengraph/) if a soul has been sold).

At this stage if you cannot access every single page and piece of content on the website (in theory, let's ignore backend architecture), **the website build is seriously flawed**. I can't stress that enough!

* Apply CSS until the website resembles the design.
* I argue strongly in favour of separating general style (typography, colour etc) from layout. Using media queries I can deliver a website that fits onto any device.
* Follow a progressive enhancement approach using advanced CSS3 to apply more detailed styles.
* Any visual design that can't be produce with CSS is delivered with a sprite image (or an individual image as last resort, never in the HTML unless it's also content).
* Avoid editing the HTML by adding superfluous elements simply to ease styling.
* Avoid illogical CSS hacks, they only lead to more crazy hacks down the line.
* Write a [print stylesheet](http://printstylesheet.dbushell.com/). If I've separated aesthetics from layout (using the small-screen first approach) this is very easy — I can just hide everything apart from the main content/article.

At this stage I have a working, _accessible_ website with content separate from style. It will purposefully deliver progressively better aesthetics to more modern browsers. It will also shape itself to fit on any size screen _without_ simply [removing content or functionality](/2011/09/14/what-is-mobile/) (without very strong cause). The code is also perfectly optimised for search engines. Next:

* I write the JavaScript.

That last one sounds isolated but the two stages prior are critical prerequisites. JavaScript should not break any of the fundamental web principles I've previously ensured. The most important being: the user should be able to access and link to anyway content directly with a URL. Just because JavaScript is client-side doesn't mean that I can abuse CSS and HTML in non-standard ways. Stay semantic. Stay accessible. Stay usable.

That's a very brief overview of the process and as I've said, in reality it's less linear than that with so many intricacies and best-practices not listed here. At some point the server side code needs to be incorporated (at which point depends on those involved).

## Progressing forward

I post this as a reminder to myself because there is a forever growing opportunity to improve the design and user experience towards the end of this process.

JavaScript is booming, CSS is becoming very powerful in more than just aesthetic style; its animations, transforms and transitions can be combine with JavaScript in wonderful ways, though a lot of the interactive techniques we're using today are still experimental.

If the future of website design lies on this horizon — and I strongly believe it does — we must ensure a solid foundation to build upon. We must maintain the principles that make the web so resilient and with that we can envision how our _access_ is changing. As standards progress so do the devices we use to access the web. They will be the big game changers in website design.
