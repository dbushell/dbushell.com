---
date: 2011-11-24 22:35:53+00:00
excerpt: None
slug: window-resize-in-javascript
template: single.html
title: Window Resize in JS
---

I will write a full article on responsive website design & JavaScript soon, but for now here's a quick snippet! (With a little help from jQuery, naturally.)

````javascript
var resizeTimeout, win = $(window);
win.bind('resize', function()
{
	if (resizeTimeout) clearTimeout(resizeTimeout);
	resizeTimeout = setTimeout(function()
	{
		var width = win.width();
		/* do responsive stuff... */
	}, 100);
});
````

The basic idea is that you don't want to be hammering the window resize event because it gets fired repeatedly when a user manually resizes their browser. Instead you should use a short timeout to wait for resizing to end.

You may ask, why am I using JavaScript at all, surely pure CSS media queries are better? For most circumstances they are, but when you're applying interactivity to a website, that experience can differ greatly depending on the screen size. My latest build involves a lot of Google Maps work but only for larger screens (an alternate — and default before JS kicks in — content design is presented to suit smaller screens). Loading in the whole Google Maps JavaScript library ignorant of usage is a heavy burden on bandwidth.

I'm using this technique to load JavaScript and other content like high-res images very late in the game. If the window never reaches the larger breakpoints no unused resources are ever wasted.

More soon!
