---
date: 2020-08-05 10:00:00+00:00
slug: i-have-only-gone-and-redesigned-my-website-again
title: 'I’ve Only Gone and Redesigned my Website, Again'
description: 'The one where I redesign my website for the tenth time.'
---
This is the tenth iteration of my website in about as many years. It's hard to keep track. I have the old versions on ice somewhere (and a project in mind).

[My last redesign](/2016/02/29/a-bit-of-a-new-look/) back in 2016 – that seems so long ago! – was a fairly large rebrand. Overall I'm happy with the job I did. It added much needed vitality to my old monochromatic style. Maybe I over did it? Either way, I've grown a little tired of it and felt motivated to give the site a fresh coat of paint.

My primary goals for this design were to:

* Find a new harmony between my past designs
* Keep the colourful brand but return to a more minimal style
* Lose the framed layout and allow whitespace to flow
* **Do it all in four days**

I'm really liking the results. What do you think?

It's not "finished" but there is enough to launch and build upon.

My old homepage was probably a little over-designed in retrospect. Especially with the animations. Sub-pages were a bit boring. I never got around to actually designing them. This time I've started with a single template that feels more balanced across all pages.

## Design Process

For weeks I'd been mulling over design ideas and sketching them in a barely comprehensible fashion. I wasn't planning any content changes so sketches didn't quite visualise all I had in mind. On a client-free day inspiration struck and I moved into Adobe XD to experiment with the colour palette and typography.

<p class="Image">
  <img loading="lazy" srcset="
    /images/blog/2020/dbushell-2k20-adobe-xd@1x.png,
    /images/blog/2020/dbushell-2k20-adobe-xd@2x.png 2x"
    src="/images/blog/2020/dbushell-2k20-adobe-xd@1x.png"
    alt="dbushell.com prototype designs in Adobe XD"
    width="666"
    height="802">
</p>

By my fourth coffee I was pretty chuffed with where the design was heading. I hadn't nailed it but I was on the right track. By the afternoon I'd fallen into a slump and was just pushing pixels. This was my cue to move into code. I opened up CodePen and found my groove again. The following morning I'd basically designed and built the base template. It was fairly late in the day when I decided to flip the layout. From that moment everything fell into place and I started focusing on the finer details.

## Front-end Features

A secondary goal of this project was to rewrite my CSS from scratch. I threw away all the legacy code. Some of it was IE6 years old. This gave me an opportunity to:

* Use modern CSS grid layout
* Use CSS custom properties
* Set up an improved static build workflow

I used the [Utopia calculator](https://utopia.fyi/) by **James Gilyead** & **Trys Mudford** as the foundation for my typographic scaling. I was playing around with something similar, though much more basic, for my [MuteSwan project](https://muteswan.dbushell.com/). Utopia is cleverer that anything I could code.

### Dark Mode

My new design comes with a dark mode theme!

<p class="Image">
  <img loading="lazy" srcset="
    /images/blog/2020/dbushell-2k20-darkmode@1x.png,
    /images/blog/2020/dbushell-2k20-darkmode@2x.png 2x"
    src="/images/blog/2020/dbushell-2k20-darkmode@1x.png"
    alt="dbushell.com dark mode design"
    width="1024"
    height="384">
</p>

This is possible by the power of [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties). Click the lightbulb in the top-left corner. It will soon be activated automatically via media queries once I've perfected it. Check back very soon for a blog post discussing this feature.

### SVG Favicon

I bookmarked **Antoine Boulanger's** article ["Are you using SVG favicons yet?"](https://medium.com/swlh/are-you-using-svg-favicons-yet-a-guide-for-modern-browsers-836a6aace3df) a while ago and have been delivering SVG icons for clients ever since. Prior to that I'd just assumed `favicon.ico` was a relic never to change. Thanks Antoine!

My own favicon was based on a raster image of my origami crane mascot. I launched Adobe Illustrator and whipped up a quick vector version.

<p class="Image">
  <img loading="lazy" srcset="
    /images/blog/2020/dbushell-2k20-favicon@1x.png,
    /images/blog/2020/dbushell-2k20-favicon@2x.png 2x"
    src="/images/blog/2020/dbushell-2k20-favicon@1x.png"
    alt="dbushell.com SVG favicon"
    width="512"
    height="256">
</p>

Kinda rough but at 16×16 it works far better than I was expecting. One day I'll vectorize it in more detail as I'd like to experiment with it on my homepage too.

### React

I'm still using React to server-side render static pages. I've disabled the [front-end hydration](/2018/05/21/pwa-progressive-web-apps/) of the entire page for now. That configuration did allow pages to load via smaller JSON requests but the service worker didn't cache the canonical HTML page. Because the site wasn't a SPA — "single page app" – a refresh of those URLs hit a cold cache. Anyway, I could have fix that but suffice it to say I'm avoiding any technical debt for now.

### Netlify Hosted

I've been dipping my toes in the Netlify pond for [side projects](/2020/06/08/pwa-web-crypto-encryption-auto-sign-in-redux-persist/) and I'm finally sold. The tipping point was Netlify's [Large Media](https://docs.netlify.com/large-media/overview/) solution. It uses [Git Large File Storage](https://git-lfs.github.com/) and basically keeps 50MBs of binary data out of my repo. I was worried I'd need to update my build process to reference random CDN URLs but thankfully not.

My old hosting solution was GitHub Pages fronted by Cloudflare. My [contact form](/contact/) is still hooked up to AWS. I may eventually move that over to Netlify Forms.

## Archival Project

As I alluded to in the opening paragraph I've kept all the old versions of my website in one form or another. I'd like to stick the homepages up on sub-domains for a nostalgia trip. That may be my next side project.

The one area of my site I'm still not happy with is [my portfolio](/showcase/). Most of my client work in recent years can't really be shown off in this format. For now I'll leave it up as-is until I decide what to do. That and more tweaks to the new design are in the pipeline. I'll be blogging in more detail on certain aspects.

To stay up to date [follow me on Twitter](https://twitter.com/dbushell) or [subscribe to my RSS feed](https://dbushell.com/rss.xml) – yep, that still exists!

Source code is on [GitHub](https://github.com/dbushell/dbushell.com) as always if you're interested in the custom build process.
