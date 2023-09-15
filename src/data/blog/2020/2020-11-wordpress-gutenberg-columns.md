---
date: 2020-11-02 10:00:00+00:00
slug: wordpress-gutenberg-columns-block-css-styles
title: 'Stylin’ WordPress Gutenberg Columns Block'
description: 'The one where I battle with CSS specificity #wordpress #css #gutenberg'
---

If there's one thing I've learnt working with WordPress it is not to fight core functionality — and especially not to reinvent it. With the Gutenberg editor that means allowing the default blocks and their default structural styles. Doing so helps maintain content compatibility across themes and plugins.

## The Columns Block

The `core/columns` block is a good example. Upon inserting a new columns block you're presented with an initial placeholder to configure it.

<p class="Image">
  <img loading="lazy" srcset="
    /images/blog/2020/wp-columns-block@1x.png,
    /images/blog/2020/wp-columns-block@2x.png 2x"
    src="/images/blog/2020/wp-columns-block@1x.png"
    alt="WordPress Gutenberg columns block configuration"
    width="435"
    height="279">
</p>

Selecting the _"50 / 50"_ option sets up a two column layout for example. Each column has its own set of inner blocks to edit in the Gutenberg way.

<p class="Image">
  <img loading="lazy" srcset="
    /images/blog/2020/wp-columns-block-2@1x.png,
    /images/blog/2020/wp-columns-block-2@2x.png 2x"
    src="/images/blog/2020/wp-columns-block-2@1x.png"
    alt="WordPress Gutenberg columns block with two columns"
    width="641"
    height="143">
</p>

Coding a custom layout block similar to `core/columns` isn't too difficult once you understand Gutenberg's React code. The difficult part is understanding Gutenberg's React code. There isn't much in the way of organised documentation. I just look at the [source code](https://github.com/WordPress/gutenberg/tree/master/packages/block-library/src) and work backwards. But wherever possible, it's best to utilise a core block if one fits.

## Custom CSS

> Core blocks include default structural styles. These are loaded in both the editor and the front end by default. An example of these styles is the CSS that powers the columns block. Without these rules, the block would result in a broken layout containing no columns at all.
>
> <cite>[Theme Support — Default block styles](https://developer.wordpress.org/block-editor/developers/themes/theme-support/#default-block-styles)</cite>

```php
add_theme_support( 'wp-block-styles' );
```

If you're keeping the core blocks — which is advisable — you'll also want their default styles. If you opt-out of those you've got a lot of work ahead of you.

The `core/columns` HTML is very simple. Looking at the _"30 / 70 — Two columns; one-third, two-thirds split"_ for example:

```markup
<div class="wp-block-columns">
  <div class="wp-block-column" style="flex-basis:33.33%">
    <p>Column one inner blocks</p>
  </div>
  <div class="wp-block-column" style="flex-basis:66.66%">
    <p>Column two inner blocks</p>
  </div>
</div>
```

We can see a hint that it's using Flexbox layout. The [default style](https://github.com/WordPress/gutenberg/blob/master/packages/block-library/src/columns/style.scss) selectors have low specificity so they're not too painful to override. What is painful are the `max-width` and `min-width` media queries. Gems like this:

```css
@media (min-width: 600px) and (max-width: 781px) {
  .wp-block-column {
    flex-basis: calc(50% - 16px) !important;
    flex-grow: 0;
  }
  .wp-block-column:nth-child(2n) {
    margin-left: 32px;
  }
}
```

Well that isn't easy to override if a responsive design has different breakpoints.

One trick is to nuke the default styles:

```css
.wp-block-column,
.wp-block-columns {
  all: initial;
}
```
This is very effective on the front-end but has issues in the [editor styles](https://developer.wordpress.org/block-editor/developers/themes/theme-support/#editor-styles). (There are Gutenberg styles applied to the same elements.)

### From Flexbox to Grid

I've been experimenting with another trick to style the columns block:

```css
.wp-block-columns {
  display: grid;
  grid-gap: 30px;
}

.wp-block-columns > * {
  grid-column: 1 / -1;
  margin: 0 !important;
}
```

The default columns use **Flexbox layout**. Switching to **Grid layout** invalidates almost everything, including the media queries. The only addition is to remove the margin (`grid-gap` handles that instead). I'm using a child selector instead of the column class so that it catches the placeholder element in the editor styles too.

With everything reset I can use a mobile-first approach starting with a single column. The next breakpoint moves to a two column layout. In this example I'm using a 12 column grid template (that becomes nicely divisible later).

```css
@media (min-width: 600px) {
  .wp-block-columns {
    grid-template-columns: repeat(12, 1fr);
  }

  .wp-block-column {
    grid-column-start: auto;
    grid-column-end: span 6;
  }

  .wp-block-column:only-child {
    grid-column-end: span 12;
  }
}
```

The final breakpoint varies depending on the block configuration.

```css
@media (min-width: 900px) {
  /* Three column layout */
  .wp-block-column:not([style*='flex-basis']):nth-last-child(3):first-child,
  .wp-block-column:not([style*='flex-basis']):nth-last-child(3):first-child
    ~ .wp-block-column {
    grid-column-end: span 4;
  }

  /* "25 / 50 / 25" layout */
  .wp-block-column[style*='25%'] {
    grid-column-end: span 3;
  }
  .wp-block-column[style*='50%'] {
    grid-column-end: span 6;
  }

  /* "30 / 70" and "70 / 30" layouts */
  .wp-block-column[style*='33.33%'] {
    grid-column-end: span 4;
  }
  .wp-block-column[style*='66.66%'] {
    grid-column-end: span 8;
  }
}
```

First I use a [quantity query](https://alistapart.com/article/quantity-queries-for-css/) to detect a three column layout. It's a little gnarly but it works.

Then I use attribute selectors to set column widths for other preset layouts. The `core/columns` block adds inline `flex-basis` rules. Those are now ignored but I can still adjust the new grid column spans with them.

That's all there is too it. A relatively tidy set of styles that can be tweaked to match any design and responsive breakpoints.

## CodePen Example

I've set up a [CodePen demo](https://codepen.io/dbushell/pen/5bb1dddad83514f8a9a8ed8e39f8a8a7) for this code.

Works ok, right? I'd be interested in feedback and other ideas [@dbushell](https://twitter.com/dbushell).

## Considerations

My rational behind this approach is to leave WordPress as default as possible. I could opt-out of the default styles. Or use build tools and pre-processors to bring in block styles selectively. That's added work and maintenance.

If more than three columns are added they'll just be 50% width and wrap to the next row. I could add another *quantity query* to set `grid-column-end: span 3;` to support four columns in a row. Or `span 2;` to support six columns etc. Five columns (evenly sized) won't work unless I change the parent `grid-template-columns`. It just depends what the design needs.

One caveat here is that the _"Percentage width"_ column setting — if you can find it — will be ignored outside of the presets. I can live without that because the themes I build are opinionated designs and don't afford that level of flexibility.

I hope one day WordPress provides more control over customising defaults. I have a bottle of champagne ready for the day I can disable the drop-cap!

