---
date: 2013-06-10 13:29:49+00:00
excerpt: None
slug: updates-to-origin
template: single.html
title: Updates to Origin
---

Back in April I published my [front-end starting point](/2013/04/30/origin/) on GitHub. It includes basic HTML & CSS and many [Grunt](http://gruntjs.com/) tasks to automate compilation, minification, optimisation, and rasterisation.

## What's new

My custom [SVG rasterisation task](https://github.com/dbushell/dbushell-Origin/blob/master/tasks/rasterize.js) was poorly written. It brought my laptop to a standstill while churning through as many phantom.js processes as there were SVG files. I've now improved that, mostly with a sexy progress bar:

![rasterize task](/images/blog/2013/rasterize.png)

<del>There's probably a faster way using a single phantom.js instance but by the time I figure that out I won't need PNG fallbacks for legacy browsers…</del> **Update:** I've now published [grunt-svg2png](https://npmjs.org/package/grunt-svg2png) to NPM and improved the speed performance dramatically! Instead of 30 seconds it's done in less than 5.

Because I'm generating some raster graphics on the fly I've had to manually optimise them using the ImageOptim desktop app. Now thanks to Jamie Mason's awesome [Grunt-ImageOptim](https://github.com/JamieMason/grunt-imageoptim) and [ImageOptim-CLI](https://github.com/JamieMason/ImageOptim-CLI) that's no longer the case! My automated build process now goes:


1. Create build folder
2. Compile HTML templates
3. Compile CSS (Sass with Compass)
4. Copy assets (images, fonts, JavaScript)
5. Minify JavaScript
6. Optimise and rasterise SVG
7. Optimise raster images


The whole process takes less than a minute and I have a production ready [flat build](/2013/04/05/the-flat-build-2/). I could do more with JavaScript (concatenation and testing) but my usual work hasn't mandated much attention here. I should probably normal(-ise/-ize) spelling at some point.
