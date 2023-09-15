---
date: 2021-02-02 10:00:00+00:00
slug: changing-css-for-good-logical-properties-and-values
title: 'Changing CSS for Good'
description: 'The one where I learn something new in CSS'
---
I’m dropping "`left`" and "`right`" from my lexicon. The new CSS normal is all about [Logical Properties and Values](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties).

This is week four of a large front-end build I'm working on. The primary deliverables are a pattern library alongside two dozen templates. With opportunity for design iteration as code is formalised it's the perfect project. It’s nice to be writing CSS again. I was up to my neck in WordPress & PHP last year. I’ve got a little catching up to do.

One area of improvement is logical properties. The [RTL Styling 101](https://rtlstyling.com/posts/rtl-styling ) guide has been invaluable to my understanding of best design and coding practices.

It can be as easy as replacing left/right with inline start/end. Top/bottom with block start/end. Normal inline flow, Flexbox, and Grid layouts reverse themselves automatically. Turns out I’ve been using logical values for modern layout all this time without even knowing.

The funny thing is the website I’m building is in English. I wasn’t asked to consider right-to-left language support. But CSS logical properties are such a quick win. The only reason not to use them is habit. And *maybe* browser support — but that’s good enough for many cases. Therefore I'm changing how I write CSS for good. The way I see it "`left`" and "`right`" are pretty much deprecated. There are edge cases, but the default has changed.

There’s more to RTL design than flipping stuff. But flippability goes a long way.

A bonus tip: for Google Translate you can add:

```css
.translated-rtl {
  direction: rtl;
}
```

To ensure your responsive CSS adapts.

I've refactored my own website to better support RTL translation with logical properties. Before updating my CSS you can see some of the issues in switching direction:

<p class="Image">
  <img loading="lazy" srcset="
    /images/blog/2021/dbushell-rtl-before@1x.png,
    /images/blog/2021/dbushell-rtl-before@2x.png 2x"
    src="/images/blog/2021/dbushell-rtl-before@1x.png"
    alt="dbushell.com RTL design before CSS logical properties and values"
    width="800"
    height="280">
</p>

After logical CSS changes:

<p class="Image">
  <img loading="lazy" srcset="
    /images/blog/2021/dbushell-rtl-after@1x.png,
    /images/blog/2021/dbushell-rtl-after@2x.png 2x"
    src="/images/blog/2021/dbushell-rtl-after@1x.png"
    alt="dbushell.com RTL design after CSS logical properties and values"
    width="800"
    height="280">
</p>

Obviously these examples are still in English so they look a little weird. I was going to screenshot an Arabic translation but I can't verify the accuracy. What's important is that my coding practices are now inherently friendlier to other languages by default. All the effort is up-front learning.
