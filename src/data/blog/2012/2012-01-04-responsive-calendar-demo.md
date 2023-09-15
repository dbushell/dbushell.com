---
date: 2012-01-04 23:58:31+00:00
excerpt: None
slug: responsive-calendar-demo
template: single.html
title: Responsive Tables (and a calendar demo)
---

_***Update*** see more [responsive tables](/2012/01/05/responsive-tables-2/) progress (5th Jan)._

A real short post for future reference! I'm experimenting with a **responsive calendar** design and build. See my _very_ rough [responsive calendar demo](/demos/calendar/v1_03-01-12.html).

I've found through trial, error, and much pondering that the idea of a responsive calendar is actually not that complex. My demo needs more considered breakpoints and design tweaks but it proves the concept. I'm thinking about developing it into a fully fledged HTML & CSS baseline for others to build upon.

I'm also looking into more traditional [tabular data](http://www.w3.org/TR/html5/tabular-data.html) as that seems to be trickier to tame in responsive web design. After a lot of Googling and a few tweets with [Harry Roberts](http://twitter.com/csswizardry) and [James Young](http://twitter.com/welcomebrand) (two fellas who know their stuff) it's become apparent that no one has really cracked responsive tables yet.

[Chris Coyier at CSS Tricks](http://css-tricks.com/responsive-data-tables/) presented a good idea in August 2011. His solution requires hard-coded content inside CSS, not good at all for many reasons. [Chris Garret](https://github.com/chrsgrrtt/Responsive-Table) has evolved the idea very recently using `data-*` attributes in HTML and the `content: attr(data-*)` technique in CSS. A great improvement but still limiting. In the end, I'm not convinced the final small-screen view of this technique is really the best solution. The ability to compare related data sets is reduced greatly. That said, I'm at a loss as to where this can be improved.

_My calendar demo also hard-coded the labels "Monday" to "Sunday" within the CSS file. That's only slightly more acceptable until you consider localisation for language support. It's just asking for trouble later on. With more care I believe the calendar format can be nailed. I'll keep you posted!_

[Filament Group](http://filamentgroup.com/lab/responsive_design_approach_for_complex_multicolumn_data_tables/) blogged a different idea in December 2011 that maintains the table appearance by reducing the columns visible. It relies on JavaScript for the _interactive_ choice of visible columns (making it an acceptable use of standards), but again, only suitable for certain data. I've been dreaming up more outlandish uses of JavaScript to change presentation/interaction but as a baseline the visual layout, style and presentation should never require it.

One thing that quickly becomes obvious is that there is **no single solution**. The ideas above may be perfectly adequate for some cases and completely useless for others.

It could be said that tabular data is boring; avoid at all costs! Fair point I'd say — thinking outside the box! Or table in this instance. But then sometimes you can't escape semantics. Why not alternate content? Hide the table and present something else, like pie chart as [Scott Jehl](http://jsbin.com/emexa4) suggested in response to Chris Coyier's experiment. A possibility, but if you're going with a table in the first place it's probably the only suitable format for that quantity of data.

I'm beginning to think that trying to perfectly resize a table within the visible viewport is not the best idea after all. Responsive web design does not make scrolling illegal! Could the solution lie in the realm of — gasp — _horizontal scrolling_?

More research and experimentation required, I'll let you know my findings! Apologies if this post is a bit scatty. It's gone midnight and if I don't publish now I doubt I'll find time until 2013!
