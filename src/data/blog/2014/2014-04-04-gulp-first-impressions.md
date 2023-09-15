---
date: 2014-04-04 10:30:42+00:00
excerpt: None
slug: gulp-first-impressions
template: single.html
title: 'Gulp: First Impressions'
---

[Grunt](http://gruntjs.com/) has long been my command line companion of choice. It has served me well. I have no complaints but I've read many obituaries so this week I sat down to test [Gulp](http://gulpjs.com/), its supposed successor. These are my first impressions.

My use case is very particular, see related articles:

* [Automation](/2013/03/12/automation/)
* [The Flat Build](/2013/03/18/the-flat-build/)
* [The Flat Build (2)](/2013/04/05/the-flat-build-2/)
* [Origin](/2013/04/30/origin/)
* [Updates to Origin](/2013/06/10/updates-to-origin/)

Gulp is a build system that runs on [Node](http://nodejs.org/) like Grunt. While Grunt is an all-purpose task runner, Gulp is based around streaming — sending files through filters / pipes to do things like preprocessing, minification, and concatenation.

![gulp](/images/blog/2014/gulp.png)

For a helpful guide see Mark Goodyear's article: [Getting started with gulp](http://markgoodyear.com/2014/01/getting-started-with-gulp/).

I found gulp easy to configure. It took me several hours to convert my entire Grunt build script. This included converting several of my own tasks to stream-based gulp plugins. (I need to brush-up on my understanding of Node streams.) Running a full build was noticeably faster than its Grunt predecessor, despite the likely poor optimisation and metaphorical duct tape.

In my case I'm not sure gulp reaches its full speed potential. I have a lot of bottlenecks: Sass can't compile CSS without PNG / SVG for inline [data URIs](http://css-tricks.com/data-uris/) — images aren't ready until compressed — some fallback images don't exist until they're generated from SVG sources — SVGs are first minimised.

This dependency chain results in a very linear build defeating the main benefit of gulp. My tasks for JavaScript and HTML preprocessing can run concurrently but these were almost instant in Grunt anyway. What I need to do is better configure multiple tasks for half-builds so I can skip bottlenecks, i.e. image related tasks that I don't need to be repeating regularly.

I can definitely see a place for gulp but it won't be taking over my Grunt set-up right now. My requirements just aren't very big or demanding. I'd be replacing like for like.

Still, gulp gets my thumbs-up for whatever that's worth. I'll look at in again in the future if it doesn't get usurped tomorrow (apparently [Broccoli](https://github.com/joliss/broccoli) is the new hotness).
