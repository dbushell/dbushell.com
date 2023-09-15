---
date: 2016-03-04 10:00:00+00:00
draft: false
slug: css-only-responsive-tables
template: single.html
title: 'CSS only Responsive Tables'
---


Four years ago I shared [an idea](/2012/01/05/responsive-tables-2/) to make tabular data responsive. Browser support was experimental and the workarounds were extremely hacky. I revisited the technique this week, cleaned it up, and I am pleased to say all modern browsers work perfectly.

[See the full demo on CodePen](http://codepen.io/dbushell/full/8e6a1ee85418f3c5abe839647dbcdec5/)

Here's what basic overflow looks like:

![Basic overflow responsive table](/images/blog/2016/responsive-table.png)

And if you want to flip the axis:

![Flipped axis and overflow responsive table](/images/blog/2016/responsive-table-flipped.png)

There are several adjustments you should make to suit your content (breakpoints, min-widths, etc). Read the notes below [the CodePen demo](http://codepen.io/dbushell/full/8e6a1ee85418f3c5abe839647dbcdec5/). The CSS there is also commented.

## Usability

When it comes to responsive tables there is no one size fits all solution. Tables are good for housing a lot of data but on small screens data comparison is difficult because the visible real estate is very limited. There will never be a single plugin that solves this problem.

My solution simply makes `<table>` elements scrollable and offers an optional axis flip if appropriate to the content. It doesn't magically solve the user experience.

Maybe a table isn't the answer!

If you're looking for professional front-end design [give me a shout](/contact/). We can find a more accessible way to display your content.

## Scrolling shadows

Around the time I originally published this idea, **Lea Verou** wrote about [Pure CSS scrolling shadows](http://lea.verou.me/2012/04/background-attachment-local/). The shadows act as a visual indicator for content overflow and invite scrolling. Nicer than a hard cut-off in my opinion.

I've found that `background-attachment: local` is unreliable on mobile devices. My alternate method works well enough to hide and reveal the shadows. I've commented the [CodePen](http://codepen.io/dbushell/full/8e6a1ee85418f3c5abe839647dbcdec5/) CSS to highlight the relevant styles.
