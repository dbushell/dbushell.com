---
date: 2012-04-18 11:29:24+00:00
excerpt: None
slug: scoping-typography-css
template: single.html
title: Scoping Typography CSS
---

_I'm writing a very long article on front-end dev builds, this is a quick prelude to that!_

It's common practice to define **global typography style** early in a stylesheet. This makes a lot of sense. After all, a good design has consistent typography with a clear hierarchy throughout. When writing this CSS, [type selectors](http://www.w3.org/TR/CSS2/selector.html#type-selectors) like:

````css
h1 { font-weight: bold; }
p { font-size: 1em; line-height: 1.5em; }
````

are necessary; adding classes to every text element isn't feasible when you consider content managed websites and WYSIWYG editors. You'd have to be a nutter to do `<p class="paragraph">` everywhere. Global styles are great but there are a few catches:

* Unique elements exist that are exceptions to the rule.
* Many UI elements maintain semantics but are visually worlds apart from textual content, e.g. navigation with `<ul>` are rarely designed as simple bullet points.

The first example can easily be solved with small "modifier" classes like `<p class="error">`. The second example requires hard overriding of styles.

The more your website resembles an **application** over a document, the more global typography styles become a pain to build upon. Even heavily content-based websites seem more like an app in the modern world of responsive design. The solution? Just scope typographic styles:

````css
.text h1 { font-weight: bold; }
.text p { font-size: 1em; line-height: 1.5em; }
````

Simply choose a class that makes sense — I swing between `.text` and `.content` — and add it to any element that contains text-based content. This frees the rest of your HTML document from CSS pollution and effectively scopes the typographic style.

That is if you're using a CSS reset, obviously...

_Update: 7th May 2012 - I'm glad to know I'm not the only one doing this, see [Opt-in Typography](http://css-tricks.com/opt-in-typography/) at CSS Tricks and [Global typographic styles suck](http://anthonyshort.me/2012/05/global-typographic-styles-suck) by Anthony Short._
