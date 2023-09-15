---
date: 2023-05-15 10:00:00+00:00
slug: css-upgrades-spring-2023-edition
title: 'CSS Upgrades – Spring 2023 Edition'
description: 'The one where I finally read the new specs'
---

Spring is here! Along with new browser updates and CSS features. It's time to clean up and upgrade this website!

## Container Queries

Container queries are glorious and [they're everywhere](https://caniuse.com/?search=container)! Nothing more to say, they make life so much easier. I've added a few to improve responsiveness. Game changer.

## Colours

I've moved away from `rgb` and `hsl` to `oklch` with the help of this [OKLCH tool](https://oklch.com/). I'm not a colour expert but `oklch` seems like the best default choice. It's human readable and supports the P3 wide colour gamut. I've boosted the chroma of a few colours beyond sRGB just because I can.

## CSS Nesting

Chromium browsers support native CSS nesting but WebKit and Firefox do not (as of writing). So for now I'm using Post CSS to flatten.

After converting my Sass nesting to native I ran into a gotcha that wasn't easy to understand (because I never read the spec).

My website has fancy bullet point styles:

* This is a fancy list!
* isn't it pretty?

For that I use a `.List` class. Except within blog posts, where I add the same style to "naked" lists within the `.Prose` parent that contains for markdown generated html.

My old SCSS looked like this:

```css
/* SCSS nesting */
.List,
.Prose ul:not([class]) {
  li { /* fancy */ }
}
```

Which compiles to:

```css
/* compiled SCSS nesting */
.List li,
.Prose ul:not([class]) li {
  /* fancy */
}
```

These are two separate selectors.

Native CSS nesting looks almost identical to SCSS. It just requires the `&` to indicate where the parent selector goes.

```css
/* native CSS nesting */
.List,
.Prose ul:not([class]) {
  & li { /* fancy */ }
}
```

Although it looks the same, how native nesting is interpreted has a not so obvious difference. The native version is equivalent to:

```css
/* native CSS nesting equivalent */
:is(.List, .Prose ul:not([class])) li {
  /* fancy */
}
```

This is how browsers interpret the nesting and what Post CSS compiles to.

The [CSS Nesting draft](https://www.w3.org/TR/css-nesting-1/) says:

> The specificity of the nesting selector is equal to the largest specificity among the complex selectors in the parent style rule’s selector list (identical to the behavior of `:is()`).

So instead of two independent selectors like SCSS they are actually intertwined. `.List li` increases in specificity to match `.Prose ul:not([class]) li`. From `0,1,1` to `0,2,2` in this example.

This makes trouble further down when I do something like:

```css
.List--extra-fancy {
  & li { /* extra fancy */ }
}
```

My "modifier" class — that is supposed to take precedence based on source order — is still `0,1,1` in specificity. Meaning styles meant to override `.List li` no longer apply.

This is a bit of a problem as it breaks my methodology.

### Solution 0: perfection

Ideally with my block/modifier convention I would simply use one class like `.List`. Technically I *could* add that class to markdown for my blog. However, with other content management systems (*\*cough\* WordPress*) adding the perfect class names to markup is not always feasible. Utilising the full power of CSS is more pragmatic. Hence a selector like `.Prose ul:not([class]))`.

### Solution 1: separation

I could separate the selectors like so:

```css
.List {
  & li { /* fancy */ }
}
.Prose ul:not([class]) {
  & li { /* fancy */ }
}
```

This is bad for maintainability as I've duplicated the `li` styles.

### Solution 2: important

I could boost the specificity of the modifying styles:

```css
.List--extra-fancy {
  & li { /* extra fancy */ !important; }
}
```

There are many ways to achieve this but it doesn't solve the root of the problem. It's a temporary solution for when you just have to ship code and kick technical debt down the road.

### Solution 3: where

Reducing specificity of the parent selector is another option. This can be done with `:where()` which has zero specificity.

```css
.List,
:where(.Prose ul:not([class])) {
  & li { /* fancy */ }
}
```

The final `:where(.Prose ul:not([class])) li` selector is `0,0,1` — actually `0,1,1` in this case as it assumes the specificity of `.List li`.

I think this is an acceptable solution to avoid unwanted specificity.

### Solution 4: cascade layers

[Cascade Layers](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Cascade_layers) are another modern addition to CSS that have wider browser support than nesting. I've implemented layers like so:

```css
@layer blocks, modifiers;

@layer blocks {
  .List,
  .Prose ul:not([class]) {
    li { /* fancy */ }
  }
}

@layer modifiers {
  .List--extra-fancy {
    li { /* extra fancy */; }
  }
}
```

Specificity within layers is encapsulated. Layers that are defined later always take priority. In the example above I define the layers first to ensure the correct order. This feels like a very tidy solution! The code is readable and succinct.

Cascade layers have their own gotcha. As the [MDN web docs](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Cascade_layers) notes:

> Styles not in a layer, or "unlayered styles", cascade together into a final implicit label.

So if earlier in your stylesheet you have "reset" styles like I do:

```css
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
```

These styles actually take precedence despite originally being ordered first with the lowest specificity. Oh dear! Actually there's an easy solution:

```css
@layer reset, blocks, modifiers;

@layer reset {
  ul { /* ... */ }
}
```

Just wrap in a layer and everything is back to normal.

I'm really liking this pattern. It reenforces the block/modifier convention and solves the nesting specificity issue when gnarly parent selector lists are necessary.

### Thoughts

Reading further in the [CSS nesting spec](https://www.w3.org/TR/css-nesting-1/) provides more information:

> The nesting selector intentionally uses the same specificity rules as the `:is()` pseudoclass, which just uses the largest specificity among its arguments, rather than tracking which selector actually matched.

> This is required for performance reasons; if a selector has multiple possible specificities, depending on how precisely it was matched, it makes selector matching much more complicated and slower.

Makes sense. Nesting is effectively syntactic sugar allowing for easier browser implementation.

> That skirts the question, tho: why do we define & in terms of `:is()`? Some non-browser implementations of Nesting-like functionality do not desugar to `:is()`, largely because they predate the introduction of `:is()` as well. Instead, they desugar directly; however, this comes with its own significant problems, as some (reasonably common) cases can accidentally produce massive selectors, due to the exponential explosion of possibilities.

> Desugaring with `:is()` instead eliminates this problem entirely, at the cost of making specificity slightly less useful, which was judged a reasonable trade-off.

I'm not sure I agree with that rationale. Specificity is the source of all CSS woes and this is a hidden cost. But who am to disagree? I don't participate in spec discussions so I rightfully get what I'm given. I'm happy to have nesting in any guise.

## Goodbye Sass!

With these updates I no longer need the [Sass preprocessor](https://sass-lang.com/). A little sad to let such a useful tool go. I've been using Sass for longer than I can remember. Possibly even prior to even using a Node build process. Or maybe that was an earlier preprocessor, I forget. Anyway, it has been an invaluable tool, and its legacy lives on in new CSS specs. With [`calc()`](https://developer.mozilla.org/en-US/docs/Web/CSS/calc), [custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties), and now [CSS nesting](https://developer.chrome.com/articles/css-nesting/), my need for Sass is all but gone.

I'd normally plug [my Twitter](https://twitter.com/dbushell) but I've now set up Mastodon so [@dbushell@fosstodon.org](https://fosstodon.org/@dbushell) and let me know any mistakes I've made!
