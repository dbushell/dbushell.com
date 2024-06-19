---
date: 2023-08-16 10:00:00+00:00
slug: wordpress-6-3-breaking-decades-of-css
title: 'WordPress 6.3; breaking decades of CSS!'
description: 'The one where I regret developing for WordPress (again)'
---

I dread WordPress updates.

I've long bemoaned [the Gutenberg problem](/2021/08/03/wordpress-has-a-gutenberg-problem/). There are so many issues with Gutenberg — [quite literally](https://github.com/WordPress/gutenberg/issues) — that it's impossible to encapsulate them all into a single cry for help.

## WordPress Breaks CSS

The latest **WordPress 6.3** ships with breaking CSS changes that can easily mess up existing themes and introduce visual bugs.

In fact, something as simple as a [CSS Reset](https://meyerweb.com/eric/tools/css/reset/) is broken in WordPress 6.3.

Almost every website I've ever worked on has done this:

```css
p {
  margin: 0;
}
```

That is, removing the browser default styles (like paragraph margin). I'm pretty sure the concept of a CSS reset predates WordPress itself. It's an extremely common practice and, regardless of necessity, *should* be harmless.

Note the `p` selector in the above code has a [specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity) of `0-0-1`.


### Gutenberg Block Gap

WordPress Gutenberg is a block-based content editor. It has several layout blocks, like columns, that make use of a configurable ["block gap"](https://developer.wordpress.org/block-editor/how-to-guides/themes/theme-json/#what-is-blockgap-and-how-can-i-use-it). The block gap is used for consistent visual spacing between blocks.

<figure class="Image" id="figure-1">
  <img
    src="/images/blog/2023/gutenberg-blocks.avif"
    alt="screenshot of the Gutenberg block list view"
    width="350"
    height="160">
    <figcaption>Figure 1</figcaption>
</figure>

If we define the block gap to be `1rem` for our theme then WordPress will generate inline CSS for the various Gutenberg blocks.

**WordPress 6.2.2** generated styles that included:

```css
body .is-layout-flow > * + * {
  margin-block-start: 1rem;
  margin-block-end: 0;
}
```

That's somewhat of a gnarly selector. But it has a specificity of `0-1-1` — higher than the reset margin, so we're good, we want the vertical spacing between blocks this provides.

*Personally I prefer to use bottom margin, but I've learnt not to fight WordPress.*

In **WordPress 6.3** this changed to:

```css
:where(body .is-layout-flow) > * {
  margin-block-start: 1rem;
  margin-block-end: 0;
}
```

*Why `body` exists in either selector isn't clear...*

Anyway, this new code lowers the specificity to `0-0-0` — **zero**.

Generally speaking, a lower specificity for base Gutenberg styles is a good thing. They're foundational. Low specificity allows custom themes to override styles without resorting to overly specific and verbose selectors. Or worse, using an `!important` as a last resort.

**The problem is: WordPress can't just change specificity like that!**

**That's a breaking change!** 😱

But they did. And they shipped it. And they broke themes.

In the example I've shown here, reducing the specificity to zero means the block gap fails to override even a basic CSS reset. This introduces a visual bug with missing space between blocks. How many websites have been built upon, and around, the base Gutenberg styles of 6.2 and earlier? The latest WordPress 6.3 update has the potential to break any of them.

That's not cool.

I confirmed this issue on a brand new WordPress 6.3 install. I created a new theme with a basic CSS reset stylesheet. I added a page with a column block and two paragraphs (as depicted previously in [figure 1](#figure-1)).

<figure class="Image">
  <img
    src="/images/blog/2023/gutenberg-blocks-render.avif"
    alt="screenshot of the HTML paragraphs with missing block gap"
    width="445"
    height="140">
    <figcaption>Figure 2</figcaption>
</figure>

As expected the block gap is missing between paragraphs.

For a new theme it's not too difficult to work around. If you can figure out why it's not working. But WordPress should not be shipping breaking changes. Developers shouldn't have to find such workarounds.

WordPress 6.3 also added this new doozy:

```css
:where(body .is-layout-flow) > :last-child:last-child {
  margin-block-end: 0;
}
```

Which has a specificity of `0-2-0` — but more importantly *never existed before*. This too can — [and already has](https://github.com/WordPress/gutenberg/issues/53468) — broken websites.

This is not the first time I've experience CSS breaking bugs with WordPress updates. There is a pattern here.

## Why does this happen?

Gutenberg first appear in [WordPress 5.0](https://wordpress.org/documentation/wordpress-version/version-5-0/) almost five years ago. It still fails to address many of the major and heavy criticisms.

This issues I've highlighted are a product of seemingly incohesive CSS strategy and lack of CSS expertise. If I'm wrong, it's certainly not evident due to rushed releases for self-imposed deadlines. Gutenberg has been spitting out styles with reckless abandon and frankly it's been a nightmare to work with. CSS is not even one of the bigger concerns raised around Gutenberg.

Gutenberg is a mess, and WordPress *is* Gutenberg.

I hate to be negative but issues like this *make me look bad*. How can I continue to deliver themes to clients if future WordPress updates are going to break them?

Please WordPress developers, pull the breaks! Clean up the [backlog](https://github.com/WordPress/gutenberg/issues).

**Update:** I've submitted a [GitHub issue](https://github.com/WordPress/gutenberg/issues/53717) which has further context and discussion.
