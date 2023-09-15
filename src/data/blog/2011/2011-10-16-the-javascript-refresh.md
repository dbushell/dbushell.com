---
date: 2011-10-16 16:30:09+00:00
excerpt: None
slug: the-javascript-refresh
template: single.html
title: The JavaScript Refresh
---

Those of us who care a little about progressive enhancement and accessibility will be well aware of the "JavaScript refresh". This is when the page initially renders — visible to the user — before deferred JavaScript kicks in. Think jQuery's `$(document).ready()` or similar.

This problem occurs from very good practices. We have to make sure pages are accessible pre-JavaScript. Not because we're worried users are browsing with JavaScript disabled, but to ensure websites do not _rely_ on JavaScript to be accessible (great for SEO too).

There's a nice technique to avoid the annoying visual kick.

## Document Ready?

The trick is understanding how JavaScript executes. For religious jQuery users like I'm forever living inside the [document ready event](http://api.jquery.com/ready/).

> While JavaScript provides the load event for executing code when a page is rendered, this event does not get triggered until all assets such as images have been completely received. In most cases, the script can be run as soon as the DOM hierarchy has been fully constructed.

This means that the whole DOM has loaded and is ready to be manipulated. Sadly for us it also means the web browser has likely rendered the page and all its default visual states. Seeing JavaScript force a re-render is not a nice effect.

The solution? Add a **`.no-js`** class to your opening `html` element, then remove it as soon as possible with JavaScript. In your `head` write:

````markup
<script type="text/javascript">
docHTML = document.getElementsByTagName('html')[0];
docHTML.className = docHTML.className.replace(/\bno-js\b/, '') + ' js';
</script>
````

This replaces your hardcoded **`.no-js`** with a **`.js`** class immediately.

Whether you choose to use write default CSS _for_ JavaScript and use the **`.no-js`** class to override, or do it the other way around, you can now make sure the right CSS is going to be applied the first time, safe in the knowledge that DOM-ready scripts will soon kick in.

What's going on here — JavaScript in the `head` element? If you're familiar with [Modernizr](http://www.modernizr.com/) you'll have seen this before as it uses a similar technique, that's where I stole it from! See [Paul Irish's](http://paulirish.com/2009/avoiding-the-fouc-v3/) example from 2009.

The key to this working is having the JavaScript execute as soon as possible, _before_ the document renders. That's normally a big "no" in development for two reasons: it halts page rendering, and it enters a race condition where the script may try to change elements that haven't loaded yet. In this case we know the `html` element exists and we sacrifice a minuscule performance hit for a bigger reward — no nasty page refreshing and no heavy restyling.

This technique has been around for years but in today's JavaScript-happy world it's good to remind ourselves about staying accessible and [getting the basics right](/2011/10/01/building-for-future-design/) for users.
