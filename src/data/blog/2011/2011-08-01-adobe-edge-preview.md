---
date: 2011-08-01 20:22:09+00:00
excerpt: None
slug: adobe-edge-preview
template: single.html
title: Adobe Edge Preview
---

My first foray into programming was **Flash ActionScript** and thus I've always had a place in my heart for the damned software. (With the release of ActionScript 3 I even learnt a bit about _real_ programming.) Even now — despite my flag waving for web standards — I do still secretly love Flash, regardless of how deprecated it may appear.

### A missed opportunity

I think Adobe are well aware of how the web is moving away from Flash. It's a bit unfair, because although web developers prefer their beloved standards, the big guns still prefer proprietary software and walled gardens. Flash _could_ have (with work) been a strong candidate for mobile app development, until Apple knifed that possibility.

### A fight back

With the release of the **[Adobe Edge Preview](http://labs.adobe.com/technologies/edge/)** I shouldn't think anyone will be surprised of Adobe's next strategy: high fidelity productivity software for the web that runs in the browser; no plugin required, all the standards you've yearned for.

> Adobe® Edge is a new web motion and interaction design tool that allows designers to bring animated content to websites, using web standards like HTML5, JavaScript, and CSS3.

You can't fault that, can you?

My initial reaction on [Google+](https://plus.google.com/112664170427933857280/posts/9xK75W2nxFU) was:

> Adobe Edge — a nightmare worse than Flash, or the forerunner in an inevitable shift towards automated tools as web development becomes too complex for hand-crafted code?

Since then I've played with it more and found a few points of interest:

* Adobe Edge makes use of **jQuery**. In fact it appears to be built right on top of the JavaScript library.
* A lot of CSS transforms and properties are being manipulated here. Multiple techniques are being used to support all browsers (like a good JS library should).
* It's fairly chunky. I racked up a whopping 150kb with a simple image fade and rotate (not including the image). But is that really too much these days? A few web fonts can produce similar baggage. Just like jQuery the initial weight starts to pays for itself the more functionality is implemented.
* The stage and timeline are very reminiscent of the Flash authoring tool and it all compiles down to JSON. Will we be able to write "Edge" without the software provided? The answer seems to be _yes_; at least I've managed to manually rewrite the timeline fairly easily.

While Edge may be limited to producing annoying animated advertising now, I suspect it won't be long before we see interactivity based on events and user input, and dare I say audio and video manipulation?

Combine that with an authoring tool as powerful as Flash and you suddenly have web app production software and ease-of-use the likes of which we've never seen. All standards based, all _Apple_-proof.

### Something to consider...

At this year's [DIBI conference](/2011/06/09/design-it-build-it-dibi/) **Inayaili de León** gave an interesting talk entitled _The Mechanical Revolution_. She raised the very real and pragmatic idea that we should _let go_ of our hand-crafted ideals; allow the machine to work for us.

Is that not what Adobe Edge aims to do?

Our precious web standards are only going to get more complex. It's already challenging enough to keep up with HTML and CSS. For many JavaScript is now a specialism.

Let's not forget that Flash provided us with online video and interactivity years before anything else and continues to lead in many areas. Adobe are not going to simply call it a day. They have an immensely talented group of engineers and developers, and this Edge preview signifies an intelligent shift in their web strategy - one that is probably more considered than that of the Flash naysayers.

At the end of the day it's our use of these tools that matters.

Adobe Edge is not going to be a solution for making websites in the way most accessibility minded developers evangelise, but it could make Flash redundant on the web. Being based on open web standards I do see potential for a website to start from an accessible baseline and progress into an interactive "app". Or maybe I wish... I'm reserving the right to protest for now.

### [Update - 4th August]

Not content with hope and pure speculation I posted on the Adobe forums with the provocatively titled: [Edge - another walled garden?](http://forums.adobe.com/thread/885158). I'm pleased with both the response and openness from Adobe:


> Your suggestions good and we are looking at ways to enable more control over the markup.  For Edge Preview 1 we made the decision to attach the animation and content to the HTML at runtime to maintain a clean separation from the HTML markup in order to make it easier to integrate with different dynamic server environments.
>
> We are definitely NOT building a "walled garden" with Edge. We chose HTML as the file format that Edge works with in order to enable folks to work directly in an open format. We will be publishing the Edge runtime API in a future preview with the intent of making it available to code against as we add support for interactivity to Edge.
>
> opening externally-written HTML files in Edge is definitely worth getting into. You can go back and forth between Edge and an editor pretty well, and it's a totally different experience than building something from scratch in the tool.

That's answered my main concern for now.

It would seem we'll be able to use Edge to add interactivity to semantically _accessible_ HTML with full control over default/fallback states. It won't stop amateurs creating all-Edge websites like we see with Flash—and I get a cold sweat thinking of how to retort the "but it's web standards?" response—but it _will_ be useful for professionals; a powerful authoring tool to replace hand coded jQuery.
