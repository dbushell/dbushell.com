---
date: 2014-02-03 13:18:52+00:00
excerpt: None
slug: simple-grids-with-css-multi-column-layout
template: single.html
title: Simple Grids with CSS Multi-Column Layout
---

Last week I began researching CSS layout — what's achievable with the various spec modules — and _grid systems_ (the myriad of solutions from [960gs](http://960.gs) to [Zen Grids](http://zengrids.com/)). My notes have quickly grown to thesis-level — I do eventually plan to publish something — but for now here's a nice example demonstrating what is sure to be my take-away message: _keep it simple_.

The image below shows a very minimal design for my website's footer (menu and copyright notice) as it appears in a small viewport:

![Menu layout (small / mobile screen)](/images/blog/2014/menu-small.png)

The HTML (sans class attributes for readability) is basic:

````markup
<ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about/">About</a></li>
    <li><a href="/services/">Services</a></li>
    <li><a href="/portfolio/">Portfolio</a></li>
    <li><a href="/blog/">Blog</a></li>
    <li><a href="/contact/">Contact</a></li>
</ul>
<p><small>Copyright &copy; David Bushell</small></p>
````

I'm building this website with a "mobile-first" mentality — I'll assume you know how _media queries_ work — so as the screen width increases I want my footer menu to align to three columns:

![Menu layout (medium / tablet screen)](/images/blog/2014/menu-medium.png)

If I was building on top of a framework or grid system I might be inclined to over-think the CSS here. I'd probably have to add extra elements in my mark-up to represent columns; adhering to the grid system's conventions. That might even force me to split the menu across multiple list elements. Ugly stuff! Let's keep it simple.

In this situation [CSS Multi-column Layout](http://www.w3.org/TR/css3-multicol/) is the perfect solution.

````css
.footer-menu {
    column-count: 3;
    column-gap: 1.75em;
}
````

Two declarations are all I need to style the menu. List items will naturally flow into the three columns regardless of how many there may be in future.

Taking the design further, you can see my desired layout for large screens (aka "desktop") in the image below. I've also overlaid my grid design so you can see alignment.

![Menu layout (large / desktop screen)](/images/blog/2014/menu-large.png)

I've actually designed this website using _two_ grids, one with _six columns_, and a second with _nine columns_. Hopefully you can see above how they overlap and work together.

In this final layout the copyright notice spans 2-of-6 columns (⅓), and the menu spans 4-of-6 columns (⅔). The menu itself — still with multi-column styles applied — is now nested and aligning to the nine column grid (each menu item fitting neatly across 2-of-9 columns).

Sounds complicated but the CSS isn't. Here's one way:

````css
.footer {
    overflow: hidden;
}
.footer-copyright {
    float: left;
}
.footer-menu {
    float: right;
    width: 66.666%;
    padding-left: 0.875em;
    box-sizing: border-box;
    column-count: 3;
    column-gap: 1.75em;
}
````

Good old floats!

This code is quite lazy but it does the job well enough. However, at this stage it is of course possible that following a site-wide coding convention for grids is a better idea. I've written a basic intro here: [On Responsive Layout and Grids](/2013/03/19/on-responsive-layout-and-grids/) — a "grid system" doesn't need to be complicated.

Whether you utilise a pre-made grid system, define one of your own, or just write bespoke layout code like I've done above, it is important to bear in mind _maintainability_ and _scalability_. Writing completely bespoke styles every time on an as-and-when basis isn't a great idea. But neither is trying to force everything into a single grid system.

CSS has a lot to offer. Mix and match coding techniques to find the simplest method and abstract common patterns to keep your CSS tidy and reusable.

*[HTML]: HyperText Markup Language
