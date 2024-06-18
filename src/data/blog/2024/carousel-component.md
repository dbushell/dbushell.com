---
date: 2024-06-18 10:00:00+00:00
slug: carousel-web-component
title: 'Carousel Web Component'
description: 'The one where I combine custom elements'
---

Last week I shared a [dots custom element](/2024/06/12/docs-custom-element-web-component/) in preparation for building a larger carousel web component. I've mocked up most of the carousel now.

All the pieces are on CodePen:

* [Dots custom element](https://codepen.io/dbushell/full/xxNXqVW)
* [Slides custom element](https://codepen.io/dbushell/full/vYweorw)
* [Carousel custom element](https://codepen.io/dbushell/full/NWVwdae)

Note the **"⚠️ Under development!"** warning. These are prototypes I don't consider ready for production yet (but they're close).

A few years ago I built a ["Mostly CSS Responsive Carousel"](https://codepen.io/dbushell/full/mdWGWJZ). For some reason I forgot to blog about it but I guess someone did because the Pen got plenty of views. The goal was to use CSS overflow and scroll snapping to make a usable carousel without JavaScript. That was novel at the time but table stakes now.

The goal of this new carousel is for me to:

* Learn custom elements
* Improve accessibility
* Use modern [baseline](https://developer.mozilla.org/en-US/docs/Glossary/Baseline/Compatibility) APIs

**Disclaimer:** yes I know the web does not want *yet another carousel*. I learn by doing, and I've already [learned a lot](/2024/06/15/custom-elements-unconnected-callback/).

## Baseline Improvements

There are many new web standards I'm taking advantage of:

CSS properties like `aspect-ratio` and `scroll-behavior` are now widely available making life so much easier.

`-webkit-overflow-scrolling: touch` is no longer necessary to fix momentum scrolling on iOS.

[`overscroll-behavior-inline: contain`](https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior-inline) is used to avoid unwanted interactions with the parent page. At least it should... I'm seeing Safari erroneously trigger the "back" history, tsk.

The global [`inert` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert) is perfect for inactive and out of view slides.

The [`:defined` pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:defined) allows for progressive enhancement by knowing when JavaScript has executed. I should find more opportunity to use this. Similarly, `:state` gives access to [custom state](https://developer.mozilla.org/en-US/docs/Web/CSS/:state) from JavaScript (though it's not baseline yet).

The [`onscrollend` event](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollend_event) is a godsend. But not baseline — come on Safari, you can do it!

Like last time, Safari is the browser lagging behind. Unlike last time, I'm far more positive that Safari developers are on the ball. I've noticed several browser bugs have been fixed. I was seeing weird inconsistencies in how CSS properties behave together, especially with grid layout. That's all gone now.

## Composable Elements

I'm undecided on whether splitting the carousel component into two sub-elements, dots and slides, is worth the effort. It leads to duplicate code with each implementing their own `next` and `previous` methods, etc. On the plus side, if a design doesn't want dots, they're easy to strip out.

I wonder if a base class is useful. For example:

```javascript
class BaseElement extends HTMLElement {
  #childSelector;
  constructor(childSelector = null) {
    super();
    this.#childSelector = childSelector ?? '& > *';
  }
  get customChildren() {
    return Array.from(this.querySelectorAll(this.#childSelector));
  }
  next() {
    /* generic implementation */
  }
}
```

Then the sub-elements can inherit and configure the base class:

```javascript
class DotsElement extends BaseElement {
  constructor() {
    super('& > button');
  }
}
```

With a base class the custom elements don't need to reimplement common methods and properties. Useful, or overcomplicating?

I bet there are many custom element frameworks that have a base class providing common patterns. I know the [Lit library](https://lit.dev) has `LitElement`. I should research more. In fact I should research custom elements in general. I'm just out here playing with code, I haven't even bothered to read the spec yet!
