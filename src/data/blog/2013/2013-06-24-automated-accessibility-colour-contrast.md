---
date: 2013-06-24 15:56:29+00:00
excerpt: None
slug: automated-accessibility-colour-contrast
template: single.html
title: 'Automated Accessibility: Colour Contrast'
---

In my quest to [automate my entire job](/2013/04/30/origin/) I've moved into the realms of testing and accessibility checks. The W3C guidelines on accessibility contain a wealth of advice. Much of it would appear to be common sense. It should be a cornerstone of web design but unfortunately it's often ignored with the focus on surface aesthetic and not the greater use.

I'm guilty myself so I'm keen to implement automated checks into my process.

## Colour Contrast

On [colour contrast](http://www.w3.org/TR/AERT#color-contrast) the W3C say:

> Ensure that foreground and background color combinations provide sufficient contrast when viewed by someone having color deficits or when viewed on a black and white screen

The suggested algorithm is a shade complicated to calculate in your head. Thankfully tools like Lea Verou's [Contrast Ratio](http://leaverou.github.io/contrast-ratio/) make it easy to check colours before use.

![Contrast Ratio](/images/blog/2013/contrast-ratio.png)

Though checking individually before use isn't the most efficient process when design is in flux. I say it's easier to get to know what good contrast looks like.

Make an educated guess; confirm later.

## More powerful tools

There are browser plugins and bookmarklets like [HTML CodeSniffer](http://squizlabs.github.io/HTML_CodeSniffer/) that work well but they occasionally flag false positives. It's remarkably difficult to figure out the final browser render by inspecting the DOM. The only way to know exact colours for sure is to render areas _with_ and _without_ text. I've been experimenting with [PhantomJS](http://phantomjs.org/) to do this.

![checking text contrast on dbushell.com](/images/blog/2013/text-colour.png)

In the screenshot above you can see all the text nodes on my home page — easy to do in the browser to retrieve the computed text colour and size.

From here I set the text nodes to have zero opacity so they're invisible but maintain layout. The page is re-rendered and I can inspect the pixel data for each area to get the _exact_ background colour (after all layers of CSS and images have been painted).

It takes a few seconds but preliminary testing has been very accurate. To be honest the browser plugins do a good enough job but this was a fun little project to hack together. I'll work on it further to generate complete reports along with other W3C guidelines and then throw the code on Github. Any suggestions [send me a tweet](http://twitter.com/dbushell)!
