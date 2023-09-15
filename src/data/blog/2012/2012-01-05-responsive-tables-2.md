---
date: 2012-01-05 19:53:02+00:00
excerpt: None
slug: responsive-tables-2
template: single.html
title: Responsive Tables (2)
---

<div class="b-boxed b-boxed--dark u-dark">
<h3>NEW: <a href="/2016/03/04/css-only-responsive-tables/">CSS only Responsive Tables</a></h3>
<p>See the link above for more recent developments.</p>
</div>

My [last article on responsive tables](/2012/01/04/responsive-calendar-demo/) was very popular so I've only gone and implemented the idea that I was alluding to with horizontal scrolling!

![Responsive Tables (2)](/images/blog/2012/rt_05_01_12.png)

See [Responsive Tables Demo (2)](/2016/03/04/css-only-responsive-tables/) — **in a modern browser!** Webkit browsers handle both tables perfectly. Firefox & Opera handle the first version. The second version plays with/abuses the [flexible box layout](http://www.w3.org/TR/css3-flexbox/) and only works with a `-webkit-` prefix.

I'm confident with more ingenuity I can get this idea working in IE9. Please note: this is far from perfected!

_* **Update 10th Jan:** as the comments below note this technique (as is here) won't work on a lot of older mobile browsers. Scrolling functionality could be replicated with JavaScript (if the layout works). Feature detection would be needed to make this viable, falling back to a layout like [Chris Coyier's](http://css-tricks.com/responsive-data-tables/)._

Something to consider: once you go block, you can't go back! Changing the display of a table and its rows & cells to block level is a lot easier than re-implementing the [table model](http://www.w3.org/TR/CSS2/tables.html) with CSS. Important to note because it's commonly advised to build responsive websites from small to large (think [320 and up](http://www.stuffandnonsense.co.uk/projects/320andup/)). Good advise, though not gospel. I've found with tables it may be better to have the larger traditional table version as default and use `max-width` media queries to scale down. Food for thought, anyway.

I like this concept. Usability is up for debate. Is it intuitive enough? It keeps data side-by-side and doesn't take up a lot of space. I'm going to keep experimenting — appreciate the feedback so far!
