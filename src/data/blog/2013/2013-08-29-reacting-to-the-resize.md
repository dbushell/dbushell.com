---
date: 2013-08-29 14:14:54+00:00
excerpt: None
slug: reacting-to-the-resize
template: single.html
title: Reacting to the Resize
---

I'm building a client's website design that is more aware of the viewport than usual. Page headers — think large typography with a background image — cover 100% of the initial view. So too does the navigation; five items presented overlaying the entire screen.

## First but not final

When a page loads the first render — at whatever size the browser viewport happens to be — is not necessarily the final view the user will interact with. Consider the following:

* The user changes the orientation of their device.
* The user decides to expand their desktop browser fullscreen.
* The user initiates split-screen apps (e.g. Windows 8 — great point [@jack_l_smith](https://twitter.com/jack_l_smith/status/372787437317390336))

But let's be less imaginative. **Sometimes users do drag resize handles.**

90% of the time — if you'll pardon the made up statistic — a responsive website design naturally adapts as desired. That's kind of the whole idea. Media queries are written to make the website responsive but sometimes CSS is not enough.

## A little help

To address my client's design ideas I'd prefer to use [viewport percentage units](http://www.w3.org/TR/css3-values/#viewport-relative-lengths) in CSS. Unfortunately [browser support](http://caniuse.com/#feat=viewport-units) and an [iOS bug](http://thatemil.com/blog/2013/06/13/viewport-relative-unit-strangeness-in-ios-6/) mean JavaScript is required to react to the resize. It's possible to listen for a window resize event and then detect the viewport size (see my [example gist](https://gist.github.com/dbushell/6369330)). Media queries can also be tested in javaScript with [matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/window.matchMedia) if we're [conditionally loading](http://adactio.com/journal/5429/). For flexible font sizing [FitText](http://fittextjs.com/) is great example. _Ideally_ visual changes should be done with CSS alone but that's not always possible today.

## Between states

Browsers will repaint the page as fast as possible when resized. Is there ever a scenario where it would be beneficial to add a transitional effect here? I've often seen this idea mocked as if only web developers resize their browser. Obviously not true. But then this:

````css
* { transition: all 500ms ease; }
````

_is_ pretty stupid. All that does it fight against the browsers attempt to render the page. It thrashes the internal layout calculations meaning we're unlikely to stay above 30 FPS required for a smooth transition. Ultimately pointless. With JavaScript — and _a lot_ thereof — this can be controlled, see [Isotope](http://isotope.metafizzy.co/) for example, but is a resize transition really worth the effort? Not in my opinion. However, the idea shouldn't be a developer taboo. There is substance here regardless of implementation practicality.

So I guess my point is:

* Users do resize under many circumstances.
* JavaScript may be required to aid CSS and this requires listening for resize events.
* Transitional effects have future potential and should not be dismissed so quickly.

**Happy resizing!**

_P.S. don't be afraid to resize like crazy to test media queries and layout changes. Nothing wrong with that. Just don't forget device testing to experience real interaction and performance._

*[FPS]: frames per second
