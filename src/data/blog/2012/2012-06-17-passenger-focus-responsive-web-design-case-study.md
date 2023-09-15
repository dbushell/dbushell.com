---
date: 2012-06-17 18:42:49+00:00
excerpt: None
slug: passenger-focus-responsive-web-design-case-study
template: single.html
portfolio: true
title: A Responsive Design Case Study
---

The many-device Web we use today has unearthed new design methodologies.

Designing one website for 3.5"–30" screens and [everything between and beyond](http://instagr.am/p/L8lH0VHIw2/) is a tricky challenge. The Web is like any other medium; it has limitations. You wouldn't try to print a super thin font or full-colour photography on uncoated newspaper stock and expect high fidelity. The Web is much the same. Large, highly textured graphics just do not fit. Today's technology makes that all the more apparent. I've written a lot about vector graphics with [SVG](/2012/04/03/svg-use-it-already/) (and CSS) yet simply [doing away with raster graphics](http://mir.aculo.us/2012/06/14/more-than-meets-the-eye/) is too much of a compromise.

I'm very pleased with the balance we've struck at [Browser](http://www.browserlondon.com/) with our latest project [Passenger Focus](http://www.passengerfocus.org.uk/). It really takes advantage of the Web as a unique medium.

![Passenger Focus website design](/images/blog/2012/passenger-focus.png)

I won't talk too much about the pre-design/build stage of this website because that's very dependent on the brief and who's involved (client and agency side). The design was led by several basic questions: "what does the organisation aim to achieve?", "what do _users_ aim to achieve?", and "what do we actually have to work with (i.e. content)?". These things tend not to be rocket science. [User testing](/2012/04/30/notes-from-user-testing/) confirmed the direction we were taking.

For those wondering, the process did involve a lot of 'traditional' wireframing and Photoshop mockups. Incidentally, two techniques that have received the proverbial death sentence by many in the industry. When you know what you're aiming for, the tools you use are entirely subjective.

## Inside a Responsive Design

For the range of projects we do at [Browser](http://www.browserlondon.com/), **responsive design** just makes sense. I reckon I could argue strongly in favour of it for _any website_ but let's leave that debate aside for now. Here's a look inside this website's development:

### Graphics

We could have easily thrown together a full-width rotating hero full of dynamic train photography and smiling commuters. We had an abundance (of the former, at least). But would that have solved anything? It certainly would have introduced the impossible problem of responsive images. I sense a growing naivety amongst many in the industry that — perhaps blinded by the latest Apple product — simply providing double resolution images to high-PPI devices is a solution. Zoom and bandwidth, not to mention the reality of the full device range, destroys that myth. Instead we created a design that doesn't _rely_ on raster graphics. They're part of the supporting cast.

### Content

What's a website without content? It's the lead role. I'd say the most successful part of this website is the structure and planning of its textual content hierarchy. That said, content alone does not make a great website. What it does do is give you a solid platform to build upon. With content-first methods I see a trend towards polarising elements of a website between 'of critical important' and unnecessary 'superficial decoration'. Perhaps this is a way of tackling the challenges of responsive design. From my experience and observation I don't see that line of thought working particularly well.

### Style Guide

The [Passenger Focus website style guide](http://www.passengerfocus.org.uk/style-guide/) is online for everyone to see. This was the influence for my article [Modularity and Style Guides](/2012/04/23/modularity-and-style-guides/) back in April where I describe style guides as_ "the perfect place to start a website build and a modular base"_.

![Passenger Focus style guide](/images/blog/2012/pf-styleguide.png)

[Scoped typographic style](/2012/04/18/scoping-typography-css/) is another useful technique employed here. One thing I've found is that while it's good to maintain a vertical text rhythm within sections, doing so throughout the whole length of the website is a waste of time. Let the rhythm break after the header and pick it up again in the main content area. The spacing in-between bears relevance to other proportions.

### Responsive Grid

The website makes use of my code-named [Shiro experiment](http://shiro.dbushell.com/). This is a responsive grid using a box-sizing technique to mitigate rounding errors from too many percentage margins. It also avoids the hassle of removing right-side only margins on the end column when the column count varies. Outlined in blue below you can see the extent to which my grid CSS is actually used.

![Passenger Focus website grid design](/images/blog/2012/pf-grid.png)

Though we _designed_ on a 16 column grid in Photoshop, trying to build a whole website constrained to a pre-defined set of column blocks is not ideal. Use grid structures within sections and don't be afraid to write bespoke layout code to match. I won't be releasing any downloadable framework for Shiro because grids are always unique per project, but feel free to pillage what you like! For future projects I'm also keeping a close eye on [Gridset](http://gridsetapp.com/).

### Media Queries

I take a predominantly 'mobile first' approach to media queries. I find, however, that using max-width queries to target very small screens is an excellent way to scope style. While the design only differs slightly between progressively larger screens, when you compare extremes the smallest mobile experience is _very different_ from the largest desktop one. Scoping styles in both directions is not without its pain, but I find the practice easier than continually restyling the same element over and over.

### Breakpoints

The breakpoints at which a design rejigs itself are very much dependent on content. Passenger Focus has over a dozen breakpoints targeted with both min and max-width queries. Some making major style changes, others minor tweaks. The website's absolute minimum width is 15em (240px at the default 1em = 16px) and maximum width is 72.5em (1160px). Should there be a _maximum_ width? Line length ultimately requires a certain limit, after that do we scale to fit? I'm not entirely sure yet.

It's a big mistake to only design and build for pixel widths of 320, 768 and 1024 up (i.e. iPhone and iPad sizes). I know its tempting to make things look perfect on your expensive gadgets, but by doing so you're very likely sidelining the majority of users. I do hope the [iPhone 5 aspect ratio rumours](http://news.cnet.com/8301-13579_3-57448037-37/iphone-5-to-offer-4-inch-16-9-screen-with-hd-camera-says-analyst/) are true as this will shatter many perfectly crafted iPhone only 'adaptive' designs. I need to stop getting annoyed by how many designers let Apple influence and dictate their craft. I often fall for the charm too but thinking outside the fruit bowl once in a while is massively important.

### Browser Support

Once you stop worrying about [browser support](/2012/03/03/forget-about-browser-support/) as an all-or-nothing requirement your front-end development actually improves. Consider things on a granular level. Use feature detection and fallbacks to varying degrees. The only exception I make is to serve a different (fixed-width) layout stylesheet to IE < 9. This is a compilation of the contents of media queries up to a width of 64em (1024px). IE7 is still a first-class citizen for [Passenger Focus](http://www.passengerfocus.org.uk/). In IE7 & 8 the width has some flexibility, but it's not responsive (nor does it really need to be). If you're considering [dropping IE support](/2012/04/02/dropping-ie-support/) you really need to question your build technique first.

[Internet Explorer virtual machines](http://osxdaily.com/2011/09/04/internet-explorer-for-mac-ie7-ie8-ie-9-free/) are great for testing, as is the [Opera Mobile emulator](http://www.opera.com/developer/tools/mobile/).

![Passenger Focus on Opera Mobile emulator](/images/blog/2012/pf-opera-mobile1.png)

Obviously nothing beats real hands-on device testing otherwise quirks from different versions are easily missed. Assuming all iOS and Android devices use Webkit-based browsers identical to Chrome will lead to very visible bugs being shipped.

## Final Thoughts

Last year I shared [three ideas](/2011/12/15/web-design-2012-and-beyond/) that I'd be mulling over when making websites in 2012. **Accessibility**, **scalability**, and **interactivity**. I can confidently say we've nailed the first two with this project. As for interactivity, we haven't made much new ground (unless you can count being touch-friendly as progress). For the nature of this project that's not a huge concern.

I've discussed before about overly content-centric strategies leading to [restrictive design](/2012/05/26/the-restriction-of-type/). There's a growing echo of responsive design being "boring". It's a concern not without substance. If I were to add a fourth idea to my list it would be **creativity**. Something I believe will regain momentum as the technicalities of responsive design are resolved.

Follow [@browserlondon](http://twitter.com/browserlondon) to keep up with our future work.
