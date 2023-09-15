---
date: 2011-11-16 19:13:26+00:00
excerpt: None
slug: reaction-time-2
template: single.html
title: Reaction Time (2)
---

A few weeks ago I wrote [Reaction Time](/2011/10/25/reaction-time/) explaining the art of **relative** interactivity.

Today I found another perfect example!

I'm using a technique based on Ariel Flesler's excellent [jQuery scrollTo plugin](http://flesler.blogspot.com/2007/10/jqueryscrollto.html). The plugin scrolls the document until a specific element is in view. The set up: I have several tabs on my page that update content below them. I want to scroll to that content as a visual guide for users to indicate what has changed and to bring it center stage. It's a fully responsive design so on small screens this interaction is very useful.

The simplest jQuery implementation would look like this:

````javascript
var target = $('#target');
$(window).scrollTo(target, { duration: 500 });
````

That will do exactly what I want, once bound to a click event — why go any further?

Because that's going to suck.

The `.scrollTo();` method takes a few options but the basic ones I care about are the *duration* (milliseconds) and an *[easing function](http://api.jquery.com/animate/#easing)* (that "specifies the speed at which the animation progresses at different points within the animation"). I've chosen an [ease-in-out function](http://gsgd.co.uk/sandbox/jquery/easing/) that starts slowly and builds up pace before decelerating again, similar to how a car would travel from A–B providing there are no barriers. I assume, I don't drive so my car analogies are a bit flaky. Just trust me, this easing effect adds a touch of class.

That constant 500 millisecond duration is lazy and unresponsive. The distance I need to scroll is never constant, it depends on where the user has previously scrolled to (prior to clicking a tab). The shorter the distance the quicker we should arrive at the destination.

Here's a generic evolution of my JavaScript:

````javascript
var target = $('#target');

/* get the document height and window height */
var doc_height = $(document).height();
var win_height = $(window).innerHeight();

/* bail if the whole document is visible */
if (doc_height <= win_height)
	return false;

/* get the current scroll offset and target offset */
var offset = $(window).scrollTop();
var target_offset = target.offset().top;

/* calculate a positive distance between the offsets */
var distance = Math.abs(offset - target_offset);

/* if we are scrolling down and can go no further... */
if (offset < target_offset) {
	var max_offset = (doc_height - win_height);
	if (target_offset > max_offset)
		distance -= target_offset - max_offset;
}

/* if there is a need to scroll, wait for updates before doing so */
if (distance) {
	setTimeout(function() {
		$('html:not(:animated),body:not(:animated)').animate(
			{ scrollTop: target_offset },
			distance * 2,
			'easeInOutQuint'
		);
	}, 500);
}
````

The `setTimeout` delay is purely for my benefit because other actions need to happen before scrolling is initiated. The magic number `2` is simply a multiplier to slow things down. What's important is that the animation always starting with a duration *relative* to the distance.

You may ask: **"What's the point, do people really notice such subtleties?"**

To which I would reply: **"No, but they will notice if they're missing."**

It's this sort of care that I believe produces the best possible experience for all devices. Interactivity should aid the user in a way that they're not even conscious is happening — it should *just work*. A lot of JavaScript I see on the web today is a massive distraction. I hope this post illustrates the effort needed in interactive design.
