---
date: 2012-06-17 12:39:04+00:00
excerpt: None
slug: nestable-jquery-plugin
template: single.html
title: Nestable jQuery Plugin
---

I've started writing a jQuery plugin called [Nestable — try it out](https://dbushell.github.io/Nestable/).

**Nestable** is an interactive hierarchical list. You can drag and drop to rearrange the order. It even works well on touch-screens. If you're familiar with the way [WordPress](http://codex.wordpress.org/WordPress_Menu_User_Guide) allows the user to manage menus, this will be used for a similar UI.

![Nestable](/images/blog/2012/nestable.png)

The only similar thing I could find was [nestedSortable](https://github.com/mjsarfatti/nestedSortable) by _Manuele J Sarfatti_ which is dependent on jQuery UI. It works perfectly but I have an irrational dislike for jQuery UI. It just seems so heavy! I may eventually make my version with no dependencies but for now vanilla jQuery is required. Nestable is the result of one afternoon's work so it's not fully featured nor fully tested. It does seem to work rather splendidly though.

As always the [code is freely available on GitHub](https://github.com/dbushell/Nestable). That would be a good place to submit feature requests too as I'll no doubt be spend a few more hours hacking this soon.

## Update 28th June 2012

I've pushed quite a few changes to [jQuery Nestable](https://dbushell.github.com/Nestable/):


1. List group IDs to allow drag and drop between lists.
2. Option to change the a maximum depth.
3. Bug fixes.
4. [Documentation!](https://github.com/dbushell/Nestable)


If this doesn't float your boat, other options include [jQuery UI Sortable](http://jqueryui.com/demos/sortable/) (no nested lists), [nestedSortable](https://github.com/mjsarfatti/nestedSortable) an extension, and [jsTree](http://www.jstree.com/) — feature rich! Why is my plugin better? Well it's less than 5kb minified/gzipped and has very lightweight and customisable CSS & HTML. I'm not going to overpower it with too many features, but if I can make it extensible enough it will be very flexible to build upon.

If you're using Nestable, or have any suggestions or issues, please [post an issue on GitHub](https://github.com/dbushell/Nestable/issues) rather than a comment here!
