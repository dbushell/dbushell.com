---
date: 2013-01-28 14:25:25+00:00
excerpt: None
slug: gloople-responsive-design-review
template: single.html
title: 'Gloople: Responsive Design Review'
---

Following last year's [Passenger Focus](/2012/06/17/passenger-focus-responsive-web-design-case-study/) case study, today I present the **Gloople** responsive design review. Gloople is an ecommerce platform with emphasis on social and mobile. We designed and built the website at [Browser](http://www.browserlondon.com).

_Please bear in mind this is a beta registration launch. The final site, fully optimised, and the ecommerce platform will arive later this year. Sign up for updates._

![Gloople responsive website design on multiple devices](/images/blog/2013/gloople-devices.jpg)

User experience, accessibility, and performance were at the heart of the design direction behind the new Gloople website. As [I wrote](/2013/01/06/a-mini-series-of-responsive-mistakes/) earlier this year, responsive design should go beyond simply stacking content vertically on smaller devices.

With Gloople we've implemented various design patterns to improve navigation and content discovery. If you saw my [off-canvas navigation](http://coding.smashingmagazine.com/2013/01/15/off-canvas-navigation-for-responsive-website/) article on Smashing Magazine, you'll recognise a similar technique with the registration form (pictured above). CSS transforms & transitions are excellent for animation performance.

On the features page you'll see an accordion-to-modal pattern.

![](/images/blog/2013/gloople-modal-accordion.jpg)

This was surprisingly simple to implement. My biggest concern was making the modal scrollable should it not fit exactly on screen. Rather than absolutely positioning the modal over the main content, I fixed the main element, thus allowing the modal to sit in the normal document flow — I'll upload a demo of this technique soon!

## Scalable Graphics

You'll immediately notice the amount of SVG (scalable vector graphics) we're using on Gloople. The illustrative, flat-colour aesthetic is as much about creating a modern brand as it is about creating a style suitable for the Web — fast loading; high definition.

![](/images/blog/2013/gloople-icons.png)

Small icons in the fixed header are embedded straight into the stylesheet to reduce HTTP requests: `background-image: url('data:image/svg+xml;base64,[data]');`

Generating CSS with [Compass](http://compass-style.org/) makes this workflow a breeze. When the SVG assets are edited we just rebuild the CSS. No manual encoding.

There are SVG optimisers like [SVGO](https://github.com/svg/svgo/) to reduce file size by removing unnecessary meta data, elements, and whitespace (this is on the to-do list). Unfortunately a few browsers have rendering bugs — e.g. [Chrome on Android](http://code.google.com/p/chromium/issues/detail?id=161982) (now fixed) — that result in early rasterisation. You may opt for a 2x resolution PNG if sharp definition is priority _right now_.

## Inline SVG

For the larger feature page illustrations we're writing SVG directly inline of the HTML (view-source to see what I mean).

![](/images/blog/2013/gloople-features.png)

In the PHP template this is outputted straight into the rendered HTML. The page source looks something like this:

````markup
<div class="feature-image is-svg" data-no-svg="fallback.png">
  <!--[if (gt IE 8)]><!-->
    <svg xmlns="http://www.w3.org/2000/svg" height="200px" width="200px">
      <!--[svg data...]-->
    </svg>
  <!--<![endif]-->
</div>
````

[Conditional comments](http://www.quirksmode.org/css/condcom.html) hide the SVG element from IE<8 to avoid parsing errors. In this scenario I'm using [Modernizr's](http://modernizr.com/docs/#features-misc) inline SVG detection to replace with fallback PNG images if required.

In truth, this is not easy to _content manage_. Two images, raster & vector, need to be art-worked and uploaded. Anyone know a command line tool to create a rasterised version of an SVG image? That would be the preferred deployment step.

## Responsive Images

Of course, you can't deny a website of photography. The big hero images are automatically cropped at three difference dimensions (small, medium, large). I then modified Scott Jehl's [picture element polyfill](https://github.com/scottjehl/picturefill); rather than simply providing the smallest image as default, I'm using the [cookies technique](http://blog.keithclark.co.uk/responsive-images-using-cookies/) to predict which of the three images is best suited. Rather experimental — I wasn't planning to ship it — but it actually works quite well.

## Media Queries and Sass

For Gloople I decided to switch things up by moving from global breakpoints to a more modular pattern. I found[ Jake Archibald's old IE](http://jakearchibald.github.com/sass-ie/) mixin useful. Sass includes are broken down by modular, .e.g. features, pricing, blog. Each of these files has their own set of media queries particular to their content. This makes it so much easier to understand how each modular changes. While you can no longer see an overview of what happens to _everything_ at a particular breakpoint, that's what the browser is for.

![](/images/blog/2013/gloople-vertical-height.jpg)

Finally, you may have read my article on [height-based queries and viewport units](/2012/11/19/responsive-bases-vertical-spaces/) (recognise the early prototype?). I'm employing CSS vertical height units in moderation; they're very buggy. On iOS devices the height calculations seemed to bear no resemblance to the viewport. I've had to disable them on iOS. I think only Chrome on the desktop works well… despite the issues, I believe this aspect of responsive design deserves its primetime.

This was my final project as an employee at Browser. Though I've left London to move back up North, I do hope it isn't the last time I work with those fine folk :)

Thanks to Erik K for the [Surface template](http://dribbble.com/shots/860650-Freebie-Microsoft-Surface-RT-psd-and-ai-templates), and ~slaveoffear for the [Nexus 4](http://slaveoffear.deviantart.com/art/Nexus-4-PSD-339422726).
