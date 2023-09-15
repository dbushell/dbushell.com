---
date: 2016-07-12 10:00:00+00:00
draft: false
slug: new-origins
template: single.html
title: 'New Origins'
---

Greetings! It's been a while, hasn't it? The last few months were busy for me. That's a good thing I suppose, I certainly need to earn a living.

The only real downside of plentiful client work is the lack of time for my own projects. One of those, codename: “Origin”, is my personal **front-end starter kit**. Whatever I’m delivering — be it WordPress themes, Shopify stores, or custom CMS templates — I always start with a static HTML build. Origin is primarily two things:

1. a simple set of [CSS patterns](https://dbushell.github.io/dbushell-Origin/dev.html) that I find useful for 90% of builds
2. [Grunt tasks](https://github.com/dbushell/dbushell-Origin) to automate the build progress (Sass, etc)

The idea is to save myself hours of repetitive work when starting a new website. However, it has started to feel heavy-handed. Over the last couple of years I’ve observed that only two tasks are crucial to me for speedy development: Sass, and simple HTML templating. I don’t need Grunt re-minifiying my JavaScript every edit. Nor do I need an intermediate version of images that get copied and compressed into the build directory.

Time to go back to basics.

## What’s changed?

Originally I had decided to only save source files in the repo (not the compiled build). Going forward I’m committing the build directory. Sometimes I just want to checkout an older project and see it in the browser without having to install dependencies or run build tasks.

I’ve removed all tasks and intermediate stages for JavaScript and images. Now they only exist in `./build/assets/`.
I’ve found that such tasks were overcomplicating the matter. This is especially true when my clients have their own deployment process making my efforts redundant. Intermediate versions of images were also wasteful because the original source is usually a PSD backed up elsewhere.

Finally, I’ve really cut back on the “opinionated CSS”. There’s almost no design, just pure CSS patterns. Well there is a little design, but it follows my personal conventions and patterns I find common enough to warrant inclusion.

[Origin is on GitHub](https://github.com/dbushell/dbushell-Origin). It’s really just for me but you may discover ideas to improve your own workflow. [Tweet me](https://twitter.com/dbushell) if you do!
