---
date: 2013-03-19 11:33:46+00:00
excerpt: None
slug: on-responsive-layout-and-grids
template: single.html
title: On Responsive Layout and Grids
---

I often get asked which responsive grid system I use. This is a very frustrating question because it implies a requirement where I have none. With the myriad solutions presented I can't blame people for thinking they have a choice to make.

This article is my response to that question.

## Anatomy of a grid system

Responsive grid systems can be broken into two main parts:

1. A CSS construct for the basic grid cell/unit
2. A catch-all methodology to cover generic column layout


Most systems I see feature a largely trivial decision around part #1 and a load of nonsense for part #2 — in my opinion. I don't mean to insult those who attempt this. Many smart minds have produced very interesting results worth studying. I call it nonsense because overcomplicating the problem will always produce crazy complex solutions. I believe this comes down to a desire to abstract code too far.

This is how I handle responsive layout:

## Part 1 — the basic unit

There are numerous ways to achieve this. The principle is to align elements as columns with an even gutter between them. Here's a five-column example:

![responsive grid](/images/blog/2013/basic-grid.svg)

I'd be worried if that surprised you but illustrations make a long article look nice. From [experimentation last year](/2012/03/27/introducing-shiro/) I've been using this CSS construct ever since:

````css
.grid {
    @include clearfix;
    margin: 0 -1.5em;
}
.grid-unit {
    box-sizing: border-box;
    display: block;
    float: left;
    padding: 0 1.5em;
    width: 100%;
}
.layout .grid-unit {
    width: 20%;
}
````

The `.grid` class acts as a container for grid units. The unit padding and negative container margins make for very tidy alignment — I'll come back to `.layout` later.

Units are outlined in black in the diagram below:

![responsive grid with margin and padding visible](/images/blog/2013/basic-grid-unit.svg)

You can achieve the same thing with inline blocks or table-cell display. I called this choice trivial. It's not _entirely_ inconsequential. You need to consider browser support and it will affect how you style content inside the grid.

Personally I like to separate these layout elements with an extra `div` to avoid conflicts with visible content styles. You may gasp in horror at the thought of extra markup — I'll be in the pub Friday evening by 6pm. That's literally the only significant consequence.

When support for [CSS Flexbox](http://www.w3.org/TR/css3-flexbox/) hits critical mass I'll likely transition towards that for grid units. It has a magic `order` property that will solve responsive layout _forever_.

## Part 2 — responsive layout

This is the meat and potatoes of a responsive grid system and the reason I ultimately reject many of them. The ones that try to offer pre-defined classes for every possible column arrangement are a lost cause.

In my opinion there's a fundamentally flawed logic in trying to write a generic catch-all solution. You're always going to end up with hundreds of unnecessary variations. If you use classes it's going to look hideously confusing. If you _don't_ use classes it's going to look horrendously perplexing.

I write responsive layout CSS on a per-module basis as-and-when required. Let's say I have four feature boxes on my home page:

![responsive grid layout](/images/blog/2013/grid-layout.svg)

By default they're stacked vertically (I may progressively enhance to a fancy carousel but that's beside the point). On a medium sized viewport I want them two-by-two. Widest breakpoint; one row, four columns.

My HTML is as you'd expect, ignoring possible semantic choices like `section` or `article` elements. I may not even need an extra `div` to style my features:

````markup
<div class="grid home-features">
    <div class="grid-unit"><!-- feature 1 --></div>
    <div class="grid-unit"><!-- feature 2 --></div>
    <div class="grid-unit"><!-- feature 3 --></div>
    <div class="grid-unit"><!-- feature 4 --></div>
</div>
````

The additional CSS I need is minimal:

````css
@media screen and (min-width: 40em) {
    .home-features .grid-unit {
        width: 50%;
    }
}
@media screen and (min-width: 60em) {
    .home-features .grid-unit {
        width: 25%;
    }
}
````

In practice it's a bit more complicated because I'm ignoring vertical spacing here but my basic principle still applies: **avoid defining layout until I need it**.

💤 (In practice I actually use a lot of CSS preprocessor techniques to avoid multiple classes.)

## Abstraction

This doesn't mean I can't abstract and reuse common layouts. If my features module is used beyond the home page I just apply CSS with a non page-specific class name.

Say I reuse the features module on the "blog" page but it's now nested inside another layout with half the available width? I simply abstract the common visual styles with a `.features` class and apply different layout and breakpoints using `.home-features` and now `.blog-features` (or a hook higher up in the DOM).

You can't define good responsive breakpoints until you know content and location. That's another reason to avoid pre-defined systems.

## Job done

I've build websites large and small with this philosophy and I really don't see a situation where it needs to be any more complicated. I love modular CSS as much as the next person but there's a point where it becomes an abstraction too far. Don't solve a problem until it exists. From my experience, trying to find a pre-defined system for every permutation of nested grids is a fool's errand.

## Design vs code

Finally, though a website is designed on a grid doesn't mean we have to replicate it entirely with a single code system. In my [Passenger Focus case study](/2012/06/17/passenger-focus-responsive-web-design-case-study/) I highlight the areas where my technique above kicks in (grid units are outlined in blue):

![Passenger Focus website grid design](/images/blog/2012/pf-grid.png)

The header was designed on the grid but bespoke layout CSS was easier to manage.

So for those who often enquire about my responsive grid "solution" — it's about 10 lines of code. Not a problem that keeps me up at night.
