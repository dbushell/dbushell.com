---
date: 2016-02-29 10:00:00+00:00
draft: false
slug: a-bit-of-a-new-look
template: single.html
title: 'A Bit of a New Look'
---

I redesigned my website!

This iteration has taken longer than usual because the visual changes are much more dramatic. I'm really pleased with the results:

![dbushell.com design circa 2016](/images/blog/2016/dbushell-v8-intro.png)

It's been two years since I last updated the design. That is a record because it's usually an annual tradition. Past updates include: [2014](/2014/04/21/spring-refresh/), [2013](/2013/02/04/a-new-home/), [2012](/2012/02/27/spring-cleaning-redesigning-dbushell-com/), and [2011](/2011/05/25/designing-a-new-me/). Last year I improved [performance](/2015/02/19/critical-css-and-performance/) and [deployment](/2015/05/11/wordpress-to-metalsmith/).

## Business priorities

While I loved the simplicity of my previous homepage, it wasn't selling me as a business. It made for a wonderful portfolio cover but nowadays I need to convert passersby into paying clients. That means content (and sparkles).

I'm in the process of rewriting [my services](/services/) page and I've introduced two new pages speaking directly to [clients](/working-with-clients/) and [web agencies](/working-with-agencies/). The content is, as always, a work in progress.

## Design inspiration

The retro style emerged from the small “For Hire” sign I created for my sidebar/footer last year. It was well received but a few people noted it could be mistaken for an ad because it didn't fit into my design. Too nice to consider removing, I realised it was the ideal starting point to inject more colour and personality into my website.

![dbushell.com brand colours](/assets/images/dbushell-for-hire.svg)

I spent a long time adjusting the colours to discover the perfect palette:

![dbushell.com brand colours](/images/blog/2016/dbushell-v8-colours.svg)

And from here I experimented with typography. I wasn't sure how the script/hand-written style would translate online. It's tricky because such a variety in weights doesn't suit the web. Web fonts are heavy; a big performance cost. Ultimately I knew this style wouldn't be viable to use for headings. I settled on a simple sans-serif, [Futura](https://typekit.com/fonts/futura-pt) being the natural choice.

## Responsive navigation

I've always been a fan of off-canvas navigation but I was concerned my previous version was a little too hidden. Is a link unseen a link unclicked? I'll put that hypothesis to the test. My new design has a fixed header with an overflow menu that prioritises key pages.

![dbushell.com responsive navigation](/images/blog/2016/dbushell-v8-nav.gif)

## The build

I was short on time to complete this project (if I ever wanted to ship something). Rather than building from scratch I decided to use my existing CSS as a foundation. Things have gotten a little messy because I didn't have a clear vision for the design initially. My front-end optimisation has regressed but after launch I'll tighten up the bolts.

Previous incarnations of my website have had ridiculously good support for legacy browsers. Unnecessarily so, but I've always seen it as an exercise in "best practice". When building from the ground up, progressive enhancement makes such support a natural by-product, for the most part! Retrofitting on the other hand isn't so simple and requires more dedicated testing. In the interest of my own sanity I've abandoned old IE. No one would have noticed, I know my analytics, but it still feels a shame to lose that backwards compatibility. That said, it's still looking good in IE9!

## Just because I can

My [old typography](/2014/04/24/two-week-build/#typography) used CSS gradients and text shadows to create custom link underlines. I've taken this one step further:

![dbushell.com link hover effect](/images/blog/2016/dbushell-v8-links.gif)

Yeah I know, the animations are overkill, but so many websites these days don't even underline links. It's a bit of fun for now.

What do you think? Like my new website? Let me know on Twitter [@dbushell](https://twitter.com/dbushell).
