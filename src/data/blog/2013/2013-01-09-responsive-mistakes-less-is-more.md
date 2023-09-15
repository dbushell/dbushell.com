---
date: 2013-01-09 13:27:50+00:00
excerpt: None
slug: responsive-mistakes-less-is-more
template: single.html
title: 'Responsive Mistakes: Less is More'
---

This is **part 2** of my [responsive mistakes mini-series](/2013/01/06/a-mini-series-of-responsive-mistakes/).

Responsive design musing often leans towards a **mobile bias**. It's obvious why. After years of desktop-centric design, mobile is brimming with fresh opportunity.

As it turns out, the mobile perspective is very helpful for us and our clients. Designing for small viewports forces content to the forefront of discussion. Despite this, it still appears to be common practice to simply hide content when space becomes limited.

## Hiding content is bad

While focus is good, over-reduction isn't. We work to understand a website's goals prior to implementation. We can't then start to discard secondary and tertiary business requirements as the screen size reduces. "Mobile" — whether defined by screen size or portability — gives us **no clue** towards the [user's intentions](/2012/03/23/the-mobile-fallacy/).

Hiding content is hiding the problem, not a solution to it.

## Display: none;

We adjust design using CSS Media Queries so it's often within these that we define which elements are visible. Declaring `display: none;` is bad practice:

* **Performance** — content is downloaded regardless.
* **Accessibility** — content may be ignored by [assistive technology](http://www.alistapart.com/articles/now-you-see-me/).
* **SEO** — even Google isn't fond of hidden content and can penalise for it.

As [Laura Kalbag](http://laurakalbag.com/display-none/) reiterates, it's indicative of lazy design. If you absolutely must have different content on larger screens then use [conditional loading](http://24ways.org/2011/conditional-loading-for-responsive-designs/) — but first, consider how you _progressively enhance_ visual presentation…

## Advancing text replacement

Replacement techniques have been around long before responsive design. They're bread and butter for front-end developers. Consider this [off-canvas menu demo](https://dbushell.github.com/Responsive-Off-Canvas-Menu/step4.html) in which I use icons for the navigation buttons.

![responsive off-canvas menu demo](/images/blog/2013/off-canvas-menu.png)

The semantic HTML for the nav open button is a normal hyperlink:

````markup
<a class="nav-button" href="#nav">Navigation</a>
````

In CSS I use an [image replacement](http://www.zeldman.com/2012/03/01/replacing-the-9999px-hack-new-image-replacement/) technique:

````css
.nav-button {
    display: block;
    overflow: hidden;
    text-indent: 100%;
    white-space: nowrap;
    width: 1.875em;
    height: 1.875em;
    background: url("img/nav-icon.svg");
}
````

Basic stuff, but this has more profound implications.

As Paul Robert Lloyd says in [The Web Aesthetic](http://www.alistapart.com/articles/the-web-aesthetic/), _"everything on the web ultimately needs to degrade down to plain text"_. I agree. If we embrace that philosophy it can be taken much further than basic icon replacement.

![social sharing links](/images/blog/2013/social-links1.png)

This blog has social sharing elements after every article. They start life as text links; the canonical version. I transform them into official widgets using [Socialite.js](http://socialitejs.com/). This enhancement could be improved by taking presentation in multiple directions. If the viewport is small, use icons. If the viewport is large, transform into widgets. In future I could even detect and account for _bandwidth_ (they're deceptively heavy).

This is still a fairly small example, but combine it with more intelligent [responsive design patterns](http://bradfrost.github.com/this-is-responsive/patterns.html) and hiding content becomes less of a necessity. It's all about **discoverability** and **accessibility**.

As long as content can be discovered it can be temporarily hidden and even shape-shift into vastly difference forms. For a perfect design example we can look back at the godfather of responsive websites, [The Boston Globe](http://www.bostonglobe.com/):

![The Boston Globe weather feature](/images/blog/2013/boston-globe-weather.png)

If you absolutely have to hide elements or need to reveal them later, I would advise using the `.visuallyhidden` class technique from HTML5 boilerplate (inspired by [Jonathon Snook](http://snook.ca/archives/html_and_css/hiding-content-for-accessibility)):

````css
.visuallyhidden {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
}
````

## A final word

The Web is a design medium. Like any other we cannot be ignorant of its limitations when planning a website's objectives and content. Neither can we be too quick to look for shortcuts. Assuming "mobile" equates to "less" and hiding content based on viewport size is not a solution. Once you stop thinking in absolutes, content becomes a lot more malleable.

[Follow me on Twitter](http://twitter.com/dbushell) for future updates in this series.
