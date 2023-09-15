---
date: 2015-01-26 13:38:24+00:00
excerpt: None
slug: use-svg-part-1
template: single.html
title: Use SVG (part 1)
---

As you know I'm a big fan of using SVG whenever possible.

💤 See my articles ['Resolution Independence With SVG'](http://www.smashingmagazine.com/2012/01/16/resolution-independence-with-svg/) (Jan 2012) and ['A Primer to Front-end SVG Hacking'](/2013/02/04/a-primer-to-front-end-svg-hacking/) (Feb 2013) for a retrospective.

I'm always looking for the most viable technique; browser support is always changing and content management is an oft-forgotten requirement (or 'restriction', depending how you look at it).

When building a front-end I split graphical assets into two categories:

1. "content" — images that'll change in relation to the content (likely via a CMS)
2. "UI" — anything that's integral to the website design

Naming isn't important, recognising different use cases is. We could sprite up UI icons, maybe even embed them within stylesheets — in *Part 2* I'll look at these techniques — but using images inside content realistically requires individual files. That's the reality / state of CMS today.

## The content `<img>`

For individual "content" images there's no better alternative than a good ol' fashioned `<img>` element. It'll work<sup>*</sup> with both SVG and raster sources (PNG, JPEG, etc) — whatever the website owner uploads.

💤 * providing the server and CMS whitelist the MIME type: `image/svg+xml` (a common oversight)

In my opinion [browser support](http://caniuse.com/#feat=svg) is good enough today that an SVG fallback isn't required.

**However!**

With responsive design, Internet Explorer doesn't scale the `<img>` as one might expect when using SVG. Let's use this common pattern as an example:

````markup
<article class="media">
  <img class="media__image" src="smile.svg" alt="Smiley">
  <div class="media__body">
    <p><strong>Media object with SVG image.</strong> … </p>
  </div>
</article>
````

````css
.media__image {
  max-width: 20%;
}
````

Testing with both SVG and PNG assets reveals a problem unique to IE (as of today, all SVG supporting versions; 9–11):

![IE SVG scaling](/images/blog/2015/IE-svg-scaling.png)

Usually, with responsive images, we can just set `max-width` in CSS and they will scale to fit (but no larger than the source). In IE this doesn't work; the aspect ratio is not respected (screenshot above).

We need to explicitly set a `width` on the image. In this case:

````css
.media__image {
  width: 20%;
  max-width: 300px;
}
````

Or, we could explicitly set a global default and use a `max-width` on a parent element (requiring extra markup):

````css
img {
  display: block;
  width: 100%;
}

.media__image {
  max-width: 20%;
}
````

````markup
<article class="media">
  <div class="media__image">
    <img src="smile.svg" alt="Smiley">
  </div>
  <div class="media__body">
    <p><strong>Media object with SVG image.</strong> … </p>
  </div>
</article>
````

The same idea applies when floating an image to allow text to wrap around:

![IE SVG Float](/images/blog/2015/IE-svg-float.png)

````markup
<article class="prose">
  <img src="smile.svg" class="prose__image">
  <p><strong>Media object with SVG image.</strong> … </p>
</article>
````

Ideally all we need to use is `.prose__image { max-width: 20%; }` and the image will scale to these conditions:

* no wider than 20% of the parent element
* no wider than the source image width (300px)

However, to avoid the IE aspect ratio distortion, you'll either have to explicitly set a width — `.prose__image { width: 20%; }` — or define a global `<img>` width of 100% and use `max-width` here. This unfortunately means the second point is no longer met by any browser. An additional parent element would be required like our media object example above. This may be difficult if the image is embedded inside a CMS WYSIWYG — ew! but that's a bigger problem...

## In conclusion

So the lesson here is that if you want your "content" images to be responsive and support both SVG and raster image formats — and why wouldn't you? — it's not good enough to simply provide an `<img>` element in the templates. It needs an explicit width, and probably a wrapping element for full control.

Sounds simply, but if you've never used / tested SVG images before in IE this "bug" can be a real nuisance.  If you want to test for yourself I've upload the SVG scaling: [problem](/demos/svg/2015-01-26/svg-scale-problem.html), [solution](/demos/svg/2015-01-26/svg-scale-solution.html), and [float](/demos/svg/2015-01-26/svg-float.html) demos.

In *Part 2* of this article I'll look at SVG techniques for the "UI" use case.

That's when the fun begins!
