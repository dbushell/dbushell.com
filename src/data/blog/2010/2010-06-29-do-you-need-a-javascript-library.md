---
date: 2010-06-29 20:52:55+00:00
excerpt: None
slug: do-you-need-a-javascript-library
template: single.html
title: Do you need a JavaScript library?
---

Over the last few years JavaScript has gone through a renaissance.

From a buggy unpredictable add-on, to a mature _superfast_ piece of kit, JavaScript is an integral component to any website. To prove this I'd present libraries like [jQuery](http://jquery.com/), [Modernizr](http://www.modernizr.com/) and [Raphaël](http://raphaeljs.com/) (to name a few of my favourites).

But the question of the day is: **do you actually need a JavaScript library?**

Libraries like jQuery are incredible tools but they can add significant weight to the page. They are so far abstracted from the core javascript that makes them it's very easy to grind the processor to death with the simplest of tasks. Of course, the benefit of ease-of-use and fast implementation can out-weight the negatives, but **learning jQuery is not the same as learning JavaScript**.

I've seen and development myself many websites that have one single JavaScript feature. For such a site I've often chose to link in jQuery and then a plugin like [Nivo Slider](http://nivo.dev7studios.com/) – an extra 7kb. I've always felt this approach was lazy. When I was presented with the same task yesterday I wrote my own custom photo rotating code taking up about 10 lines (and jQuery). I felt significantly happier after building the site, I don't like excess!

There is an element of "reinventing the wheel" there, but when the wheel fits a tractor and I'm on a push bike I'm happy with that.

On another site I included the Modernizr library so that I could detect the [HTML5 placeholder attribute](http://diveintohtml5.org/forms.html) and replicate it with jQuery if it didn't exist in older browsers. When I came to build the new version of this site (dbushell.com) I wanted to do the same thing but felt guilty bloating it out with another JavaScript library. Instead of throwing Modernizr into the mix without a care I decided to dive inside and see how it actually worked. After a few minutes I reduced my code requirements to a few lines:

```javascript
var f = document.createElement('input');
var placeholder = !!('placeholder' in f);
if (!placeholder) {
  /* jQuery to replicate placeholder attribute */
}
```

Modernizr is an absolutely outstanding piece of JavaScript but it's also a perfect example of one you'll almost always never need in its entirety. By hacking around inside you can make huge improvements to the size and speed of your website _and_ your own knowledge of JavaScript. The majority of Modernizr can be reduced down to tiny chunks for each feature (in fact version 2.0 looks like it will be a module based JS library).

So next time you need a library or plugin think twice. With a little know how you can achieve the same thing with significantly less code and no excess waste.

💤 Ironically it was Paul Irish (who co-created Modernizr) that gave me the idea of looking deeper at JavaScript libraries from his excellent blog post and video [10 Things I Learned from the jQuery Source](http://paulirish.com/2010/10-things-i-learned-from-the-jquery-source/).

