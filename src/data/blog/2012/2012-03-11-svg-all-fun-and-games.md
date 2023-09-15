---
date: 2012-03-11 01:24:52+00:00
excerpt: None
slug: svg-all-fun-and-games
template: single.html
title: SVG, all fun and games!
---

When I wrote [Resolution Independence](http://coding.smashingmagazine.com/2012/01/16/resolution-independence-with-svg/) for Smashing Magazine I focused almost exclusively on SVG (_Scalable Vector Graphics_) to save our souls from high-resolution hell.

SVG is more than just a vector graphic format. I'm here to tell you why it's better than sliced bread and highlight some of the problems you'll encounter in everyday front-end usage.

## Features / Support

As amazing as SVG is (and it really is amazing) its usage is not as simply as "browser support" — another reason why you should [forget that idea](/2012/03/03/forget-about-browser-support/). All modern browsers now [support](http://caniuse.com/#search=SVG) SVG for image elements and CSS backgrounds. But "support" only extends so far. The SVG spec has a whole load of [filter effects](http://www.w3.org/TR/SVG/filters.html), [interactive events](http://www.w3.org/TR/SVG/interact.html), [animation](http://www.w3.org/TR/SVG/animate.html) and [scripting](http://www.w3.org/TR/SVG/script.html) abilities. While some browsers can render basic vector graphics, not all of them offer this additional functionality. Thankfully, browsers seem to ignore what they can't handle making graceful degradation a possibility.

Even when features are available they can be notoriously slow. Applying filters is akin to Photoshopping on low memory. Browsers also have very tight "security" restrictions when using [SVG as an image](https://developer.mozilla.org/en/SVG/SVG_as_an_Image) (something to remember or you'll be scratching your head for hours wondering why the damned thing isn't working). **Inline SVG** is a formidable beast. It's XML within your HTML. It can be styled with CSS and manipulated with JavaScript just like the DOM. Unlike HTML, SVG elements can be [transformed](http://www.w3.org/TR/SVG/coords.html#TransformAttribute) and rotated without advanced CSS3. Powerful stuff this SVG, I'm sure you'll agree.

## Playing Nice

As I design & build more often with SVG I come across as many bugs and inconstancies as I do delights. Most notable are those that affect **scalability**, the whole reason to use SVG in the first place.

All the bugs I've come across are well known by browser developers but fixes aren't trivial. The more interest we generate, the quicker someone will dedicate their time to fix these things. Nobody likes developing unpopular tech. So I ask please, let's put the CSS3 down for a while and iron these suckers out! Not convinced? Try this for size:

### SVG and CSS 3D Transforms

[CSS 3D Transforms](http://24ways.org/2010/intro-to-css-3d-transforms) can be stunning. They can be tacky. Whatever you think, they sure are hell are impressive. The trouble is all elements are rasterised as a flat graphic before the magic happens. (Watch [Webkit in Your Living Room](http://www.youtube.com/watch?v=xuMWhto62Eo) by Netflix developer Matt Seeley to understand why.) This means that anything — including SVG — that is scaled larger, or brought towards the viewport on the z-axis, will pixelate and blur.

### SVG and CSS Backgrounds

With CSS 3D Transforms it's fairly clear why this happens. Manipulating the DOM is an expensive hobby, doing so in 3D space is currently a pipe dream.

There are, however, other situations in which this kind of **early rasterisation** catches us of guard. **Firefox** has a bug (I believe [this one](https://bugzilla.mozilla.org/show_bug.cgi?id=600207)) relating to background images. I've uploaded a [demo and workaround](/demos/svg/scaling-09-03-12/) and a screenshot of the problem below:

![SVG pixelated rendering in Firefox](/images/blog/2012/svg-rendering.png)

 Blurry SVG is obviously not the desired result.

Under certain conditions Firefox rasterises the graphic before applying the `background-size`. What's the solution? Provide a bigger SVG!

That doesn't initially make sense — surely vector graphics are infinite in size by their nature? But remember that all points within an SVG file relate to an initial height & width of the container. These values get translated directly into pixel units. In my Smashing Magazine article I had success changing these values to `em` units but that solution was short lived and probably ill-informed.

The real problem is that my 10×10 star in this example — with points like `5, 8.292` defining it — is rasterised at 10×10 pixels and then blown up. By upping the container size and resizing all points by a factor of 10 (or even 100) I can ensure rasterisation at much large sizes. This can even be done by applying a transform like `transform="scale(100,100)"` to the group, thus avoiding longer points like `500, 829.2` that would bloat file size — nifty!

As with everything this workaround has its own caveats. Browsers that have implementations like Firefox will be forced to rasterise SVG files on canvases far bigger than required. **Bitmap data takes up a lot of memory**. This workaround doesn't come free of charge.

* * *

I'll be working with SVG a lot over the next few months and will be sure to document further eyebrow raisers as I spot them!
