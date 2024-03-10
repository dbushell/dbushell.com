---
date: 2024-03-10 10:00:00+00:00
slug: css-button-styles-you-might-not-know
title: 'CSS Button Styles You Might Not Know'
description: 'The one where I demo some lesser-known CSS for stylin’ buttons'
---
Buttons are everywhere!

We can use all sorts of fancy CSS to style a button. I prefer using Flexbox layout for example. In this blog post I share a few lesser-known CSS styles.

Let's use this example code:

```html
<button type="submit" class="button">
  <img href="icon.svg" alt="">
  <span>Sign in</span>
</button>
```

## Touch Actions

Have you ever repeatedly tapped on a button only for the page to zoom in unexpectedly? Rewind and fast-forward buttons in an audio player for example. This unwanted side effect can be removed with `touch-action`:

```css
.button {
  touch-action: manipulation;
}
```

The `manipulation` value disables gestures like *'double-tap to zoom'*. Other gestures like *'panning'* and *'pinch to zoom'* are unaffected. An extra benefit is that the browser no longer needs to delay the `click` event waiting for a second tap.

Some articles and comments suggest a "fix" by disabling zoom entirely with the [viewport meta tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag) in HTML — never do this!

## Accidental Selection

Many websites style important links to look like a button. It's common to use a shared class like `.button`. For example:

```html
<a class="button" href="/sign-in">Sign in</a>
```

Another unwanted side effect of repeatedly tapping buttons is that text content can be selected and highlighted by mistake. This can be disabled too:

```css
.button {
  user-select: none;
}
```

The `user-select` property can be used to make inner text unselectable. This is a default style in Firefox but not other browsers. Use this sparingly! Safari may still need a `-webkit` prefix depending on when you're reading this.

## Browse...

There is another hidden button that is often missing from stylesheets.

```html
<input type="file">
```

The file input includes a button in its shadow DOM. The default appearance varies between browser and operating system.

<figure class="Image">
  <img
    loading="lazy"
    fetchpriority="low"
    src="/images/blog/2024/browse-file-input.avif"
    alt="Screenshot of a file input rendered by Firefox on macOS"
    width="178"
    height="22">
    <figcaption>A file input can look like this</figcaption>
</figure>

Fear not! CSS can handle this button too:

```css
.button,
::file-selector-button {
  /* fancy */
}
```

`::file-selector-button` is a CSS pseudo-element that can style the browse button. All modern browsers support it. I had no idea myself until recently.

## Visual Focus

Accessibility is for everyone. I like using keyboard navigation to tab through interactive elements. Sadly I've lost count of how many clients have asked me to *"remove that ugly border"* around focused buttons.

Button focus state can be improved with two tricks:

```css
.button {
  &:focus {
    outline: none;
  }
  &:focus-visible {
    outline: 2px solid magenta;
    outline-offset: 2px;
  }
}
```

First, I replace the default `focus` pseudo-class with `focus-visible`. MDN has a long section on [focus vs focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible#focus_vs_focus-visible). Basically it's what the original should have been in hindsight.

Second, I use `outline-offset` to give some breathing room between the focus ring and the button itself. If the button has a prominent `border` style the `outline` would sit flush against it looking like a double border. Adding an offset makes the focus state more visible.

One thing to note is that `::file-selector-button` does not get focus, rather the parent `input` does, so apply styles there.

## Logical Size

```css
.button {
  inline-size: fit-content;
}
```

This style makes the button width use the available space but doesn't exceed the `max-content` of the button. Except that I'm using `inline-size` and not `width`.

`width` is a banned property in my stylesheets!

To find out why your homework is to study up on: [CSS logical properties and values](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values). Also check out: [Right-to-left Styling 101](https://rtlstyling.com/posts/rtl-styling) — an invaluable guide.

## Buttoning Up

All together the button styles I've discussed here are:

```css
.button,
::file-selector-button {
  inline-size: fit-content;
  touch-action: manipulation;
  user-select: none;
}

* {
  &:focus {
    outline: none;
  }
  &:focus-visible {
    outline: 2px solid magenta;
    outline-offset: 2px;
  }
}
```

This is part of my button default styles.

Often I will use SVG for icons. Either inline of HTML or inline of the CSS depending on use case (see my [CSS mask tutorial](/2024/01/19/svg-icons-with-css-masks/) for an example).

And yes that's native [CSS nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/Nesting_selector)! Although I still use post-processing to flatten selectors. [Lightning CSS](https://lightningcss.dev/) is my current tool of choice. I might have [said goodbye](/2023/05/15/css-upgrades-spring-2023-edition/) to CSS processing a little too early.

Have I missed anything important? [Tell me on Mastodon!](https://fosstodon.org/@dbushell)

And someone [buy me a coffee](/tip/) please, I'm parched!
