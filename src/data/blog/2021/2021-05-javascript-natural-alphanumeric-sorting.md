---
date: 2021-05-17 10:00:00+00:00
slug: javascript-natural-alphanumeric-sorting
title: 'Natural Alphanumeric Sorting in JavaScript'
description: 'The one where I tackle a problem harder than it first appears'
---
I'm building a **progressive web app** (PWA, aka website) to play audiobooks. [It's a side project](/2021/05/14/cloudflare-dns-pages-workers/) that is teaching me a lot. The seemingly simple features are some of the hardest to implement. Natural alphanumeric sorting is one problem that took me half a day to solve. It's reminiscent of [an issue I debugged](/2020/03/27/debugging-a-todo-app/) in my todo app which initially seemed to work just fine.

First a visual update on my PWA because it's all code to follow:

<p class="Image">
  <img loading="lazy" srcset="
    /images/blog/2021/mesonic-v0-13-1@1x.png,
    /images/blog/2021/mesonic-v0-13-1@2x.png 2x"
    src="/images/blog/2021/mesonic-v0-13-1@1x.png"
    alt="meSonic progressive web app demo screenshot"
    width="420"
    height="560">
</p>

Yes those are [Bootstrap](https://getbootstrap.com/) styles. My next blog topic.

## The Problem

Say you have a list of files with a naming convention like "Chapter [n]" i.e.:

* Chapter 1
* Chapter 2
* …
* Chapter 10

These files needs to be played in the correct order. They make up an audiobook. We're talking tens of chapters, not hundreds, so the sorting algorithm efficiency isn't a concern.

In the code I'm writing there are three places the sorting can occur. The original directory read order (varies by OS and filesystem). The SQLite database query. Or somewhere in the JavaScript code (server or client side).

First I tried two naive approaches.

A truncated SQL example:

```sql
ORDER BY `name` ASC
```

A JavaScript example:

```javascript
anArray.sort((a, b) => a.localeCompare(b));
```

Both approaches will handle alphanumerical sorting. On first glance, anyway. That is until you have **10 or more** files. Then the sorted order becomes:

1. Chapter 1
2. Chapter 10
3. Chapter 2
4. Chapter 3

As we know, technically correct is the best kind of correct. I'm solving the wrong problem. What I actually want is a "natural" sort order. It took me a while to figure out what to even search for. I found a handful of green check marks on Stack Overflow that looked promising.

One solution suggested:

```sql
ORDER BY CAST(`name` as INTEGER) ASC
```

This only works in the specific circumstance where files are named numerically such as "1" to "10" with no latin characters.

Another answer suggested:

```sql
ORDER BY LENGTH(`name`), `name` ASC
```

This works for my original example because "Chapter 10" is longer than "Chapter 9" so it gets sorted in a lower bucket.

### Problem solved?

Nope. I'm not testing with enough real world data. [Moby Dick from LibriVox](https://librivox.org/moby-dick-by-herman-melville) is on my reading list. I read just over half the ebook edition a long time ago. I'd like to finish it in audiobook form because reading is hard.

The book's files are named like:

1. Chapter 000: Etymology and Extracts
2. Chapter 001-002
3. Chapter 003
4. Chapter 004-007

Hmm, sorting this in SQL might be a lost cause.

I still have an opportunity to use JavaScript. The answer to all problems in life. After hours of head-scratching I finally stumble upon the [ECMAScript Internationalization API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/Collator) which provided the answer.

> The `Intl.Collator` object enables language-sensitive string comparison.

I initialise a collator:

```javascript
const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base'
});
```

Which provides a `compare` method for sorting:

```javascript
anArray.sort((a, b) => collator.compare(a, b));
```

And with that the magic happens.

Browser support for this JavaScript goes back to IE11. Node and Deno on the server both include the API.

A simple solution once you know how but one that is tricky to search for. It's the type of bug that doesn't immediately stand out. It's difficult to catch without a variety of test data. I suspect my code still isn't perfect if I were to throw non-latin characters at it.

There are other workarounds. Like enforcing numeric file names and then displaying alternate metadata. My server code currently requires a certain directory structure — Author > Book > Chapter — and I'd like to keep that to a minimum.

I'm quite pleased to have learnt something new here — one of the main reasons I work on these side projects is to educate myself.

## Related articles

* [Cloudflare Pages and Workers](/2021/05/14/cloudflare-dns-pages-workers/)
