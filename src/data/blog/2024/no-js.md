---
date: 2024-06-22 10:00:00+00:00
slug: no-no-javascript
title: 'No No-JavaScript'
description: 'The one where I revisit an old practice'
---

I'm blogging this quick tip because the old technique is so ingrained I keep forgetting there is a new way.

You ever used that `no-js` class?

```html
<html class="no-js">
  <head>
    <script>
      document.documentElement.classList.replace('no-js', 'js');
    </script>
```

The one that gets replaced by `js` as early as possible?

Maybe not, it seems like few do nowadays. Maybe it's just assumed that JavaScript is enabled? I still add `no-js` out of habit but truth be told I rarely use it. It's for *✨ progressive enhancement ✨* and all that jazz. Useful for styling stuff before JavaScript kicks in (or is disabled).

## CSS New Hotness

Using JavaScript to detect JavaScript was always a bit silly in hindsight. Today CSS has a [scripting media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/scripting) that can be queried.

For example:

```css
@media (scripting: none) {
  .my-component {
    /* no JavaScript */
  }
}
@media (scripting: enabled) {
  .my-component {
    /* 🚀 go JavaScript! */
  }
}
@media not (scripting: enabled) {
  .my-component {
    /**
     * no JavaScript (again)
     * I didn't read the spec about the `none` value
     */
  }
}
```

Isn't that cool?

## A Little History

As far as I know the `no-js` class was popularised by [Modernizr](https://github.com/Modernizr/Modernizr), an influential JavaScript library for feature detection.

```javascript
// Remove "no-js" class from <html> element, if it exists:
(function(H,C){H[C]=H[C].replace(/\bno-js\b/,'js')})(docElement,'className');
```

This early Modernizr implementation was [committed](https://github.com/Modernizr/Modernizr/commit/9a5e9d0ece93f0a7d6c54eed445617456318cfc6#diff-82008d05aae606d6029775b346b1379c3ed6e694e64df2a8fb78f7ac0a61b9e6R424) by [Paul Irish](https://www.paulirish.com) in September 2009. Paul wrote about it in his post [*"Avoiding the FOUC v3.0"*](https://www.paulirish.com/2009/avoiding-the-fouc-v3/) around the same time.

> **I prefer to write unique css for the no-javascript user.** I don’t want to be writing .js in front of every selector for my basic accordion/carousel/etc widgets. It’s terribly tedious. I really just want a .no-js hook.

Paul was referring to the then common practice of adding a `js` class:

```javascript
document.documentElement.className += ' js';
```

My memory unfortunately ends here. Can anyone be credited for earlier uses of a `no-js` or `js` class? If you know of any older blog posts on this matter [@ me on Mastodon](https://fosstodon.org/@dbushell).

Back then `className` was used. Later `classList` became standard.

```javascript
document.documentElement.classList.replace('no-js', 'js');
```

`classList` was not supported in Internet Explorer until IE10 which was released in 2012. IE never supported the `replace` method. It also took an eternity for IE9 to die so `classList` adoption was slow.

The earliest I can remember adding a `no-js` here on [dbushell.com](/) was for [my 2011 design](https://legacy.dbushell.com/2011/). My version was:

```javascript
docHTML = document.getElementsByTagName('html')[0];
docHTML.className = docHTML.className.replace(/\bno-js\b/, '') + ' js';
```

This code is hilariously bad. Why didn't I just use `documentElement`? Why am I replacing the class with an empty string and then concatenating the `js` class? Your guess is as good as mine! At some point in time I went rogue and starting using a `Noscript` class instead of `no-js`. Last week [I committed](https://github.com/dbushell/dbushell.com/commit/e210b72b2969453c61715496cb4c232f69da5df1) a change to finally adopt the new CSS technique.
