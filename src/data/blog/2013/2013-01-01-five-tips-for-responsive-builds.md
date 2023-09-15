---
date: 2013-01-01 23:21:39+00:00
excerpt: None
slug: five-tips-for-responsive-builds
template: single.html
title: 5 Tips for Responsive Builds
---

If design and content strategy stops when the build phase starts it's time to rethink your process. The role of a modern front-end developer goes beyond following pre-defined blueprints. An iterative, agile-like approach is vital to account for responsive design challenges that inevitably arise as a website takes shape.

With that in mind here are my 5 tips for responsive builds:

## 1. Utilise breakpoint zero

Start by writing HTML in a semantic and hierarchical order. This is dictated by content priority, and a bit of common sense. Apply the basic styles but don't go beyond the default vertical flow. Now as you start to add layout for progressively larger viewports you can address content issues immediately. What gets shunted off screen? What elements are being orphaned? Where is context being lost as the viewport scrolls and content breaks apart? Address these issues now and after every iteration. It will only get harder to reorganise later on.

## 2. Maintain a pattern library

This is a single page where you can dump all components: typography, menus, forms, feature boxes, content modules etc. A place where design meets implementation. It's your website's melting pot. A handy repository that helps keep visual design consistent and code maintainable. I've written previously on [modularity and style guides](/2012/04/23/modularity-and-style-guides/). See this [case study](/2012/06/17/passenger-focus-responsive-web-design-case-study/) for an example.

## 3. Stay proportional to text

Content is king. Content is text (mostly). Every aspect of a responsive design revolves around the space available for it. A browser's base font size is **user defined**. That means everything from margins to media queries should adjust accordingly. Use [relative units](http://www.w3.org/TR/css3-values/#relative-lengths) across your CSS to maintain this relationship. ["The EMs have it"](http://blog.cloudfour.com/the-ems-have-it-proportional-media-queries-ftw/) by _Lyza Gardner_ is an excellent guide. Using pixel units in media queries only limits a website's responsiveness.

## 4. Remember what you're testing

Test your build in multiple browsers as often as you save code (for me that's every few minutes). **Resize your browser** across the full spectrum. Don't mess around with novelty iframes that try to mimic viewport size for "mobile" and "tablet" — you're only ignoring everything in-between. When it comes to testing on other devices do just that. At that point it's about **performance and usability**, not media queries and layout.


## 5. Don't shim old IE

Keep your legacy contracts pain-free. Old desktop browsers need not be fully responsive down to mobile size. Serve a **separate stylesheet** for Internet Explorer 8 and lower using conditional comments (hide the normal stylesheet the same way). This should contain all base styles and the contents of media queries up to a desktop viewport (but not the queries themselves). **CSS preprocessors** can be used to build this automatically. Finally, in this old IE stylesheet add a **min-width** to the root element — basically let it go as small as it can before content is squashed. Now old IE will get a semi-fluid build and you can sleep easy at night.

**Update:** [@justmarkup](https://twitter.com/justmarkup/status/286441851190398976) points me to [Jake Archibald's Sass technique](http://jakearchibald.github.com/sass-ie/) which is excellent.

Found that useful? [Follow me on Twitter](http://twitter.com/dbushell) for regular responsive discussion.
