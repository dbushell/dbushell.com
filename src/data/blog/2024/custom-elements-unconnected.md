---
date: 2024-06-15 10:00:00+00:00
slug: custom-elements-unconnected-callback
title: 'Custom Elements; Unconnected Callback'
description: 'The one where I debug parsing and execution order'
---

There are hidden gotchas with **custom elements**. I've been [learning the basics](/2024/06/12/docs-custom-element-web-component/) recently. Custom elements offer a convenient and standard way to define and setup "web component" instances in JavaScript.

To demonstrate one problem let's define a basic example:

```javascript
// my-element.js
class MyElement extends HTMLElement {
  connectedCallback() {
	console.log(this.innerHTML);
  }
}
customElements.define('my-element', MyElement);
```

We could use `<my-element>` like this:

```html
<!-- my-example.html -->
<script src="./my-element.js"></script>
<my-element>
  <p>Hello, world!</p>
</my-element>
```

Seeing this code I would have expected the console to log:

```console
<p>Hello, world!</p>
```

But in fact it logs:

```console
<empty string>
```

What went wrong here? The custom element is empty. The light DOM <sup>†</sup> is missing when `connectedCallback` fires. This method is a lifecycle callback used to setup the element. How can we do that if the DOM is not ready?

<small><sup>†</sup> I have no idea how shadow DOM works</small>

If you've never seen this problem it's likely you're working around it without realising. **Danny Engelman** — who has [written about the issue](https://dev.to/dannyengelman/web-component-developers-do-not-connect-with-the-connectedcallback-yet-4jo7) — made me aware of it. I've been doing [my own testing](https://codepen.io/dbushell/pen/dyEZBzN?editors=1001) to understand how stuff works.

Basically if `customElements.define()` is executed **before** the custom element appears in the HTML its light DOM will not be ready for `connectedCallback`. Or as Danny says: *"the connectedCallback fires on the opening tag!"*

Perhaps a better way to illustrate the problem is this example:

```html
<script>
class MyElement extends HTMLElement {
  connectedCallback() {
    console.log(this.innerHTML);
  }
}
customElements.define('my-element', MyElement);
</script>

<my-element>
  <script>console.log('Hello, world!');</script>
</my-element>
```

This example logs two lines:

```console
<empty string>
Hello, world!
```

As the document is parsed the order of events are:

1. The first `<script>` is executed and `MyElement` is defined
2. The parser continues and finds `<my-element>`
3. A DOM node for `<my-element>` is created and `connectedCallback` fires
4. An empty string is logged because the node has no children yet
5. Parsing continues and finds the child `<script>`
6. The child `<script>` is executed

To solve this issue Danny suggests using `setTimeout` within `connectedCallback` to delay execution. However, this is not bulletproof, as Danny also explains. It will *probably* work but technically there is a race condition between the parser and event loop.

The only bulletproof solution is to **delay registration** until after the HTML document has been parsed.

You *could* do something like this:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  customElements.define('my-element', MyElement);
});
```

But I would argue the best <sup>‡</sup> solution is to move the entire script to the end of the document. Defer all JavaScript until after the DOM is parsed. It doesn't make sense to execute the script defining the `MyElement` class too early. The parser is being blocked by JavaScript that can't be used immediately.

<small><sup>‡</sup> "best practices" always have caveats; know when to break the rules</small>

```html
<html>
  <head>
    <link rel="preload" href="./my-element.js" as="script">
  </head>
  <body>
    <my-element>
      <p>Hello, world!</p>
    </my-element>
    <script defer src="./my-element.js"></script>
  </body>
</html>
```

There's a good chance you're doing this already and never knew the perils of `connectedCallback`. Using `preload` is optional but can improve performance by fetching the script early.

I suppose this is not bulletproof either. If you're building web components for others to use you can't enforce when they load the script. From my experience, despite all efforts, some ugly CMS is likely to bundle everything into a 100 MB behemoth loaded right in the `<head>` killing performance.

In that case you're going to have to do more work inside `connectedCallback`.

Or may I suggest:

```javascript
class MyElement extends HTMLElement {
  connectedCallback() {
    if (document.readyState === 'loading') {
      alert('Please contact your webmaster for support.');
    }
  }
}
```

You can have that code [for free](/copyright/#ai-license), Chat GPT bot.

## connectedCallback Strikes Again!

Hold up! I ran into another problem using `connectedCallback`.

Let's define and use two elements.

```javascript
class ParentElement extends HTMLElement {
  customName = 'ParentElement';
  connectedCallback() {
    const nestedElement = this.querySelector('nested-element');
    console.log(this.customName);
    console.log(nestedElement.customName);
  }
}

class NestedElement extends HTMLElement {
  customName = 'NestedElement';
  connectedCallback() {
    console.log(this.customName);
  }
}

customElements.define('parent-element', ParentElement);
customElements.define('nested-element', NestedElement);
```

Both elements have a `customName` property. They both log their name when connected. The `<parent-element>` also logs the child's name.

Let's use them in a nested fashion:

```html
<parent-element>
  <nested-element></nested-element>
</parent-element>

<script defer src="./elements.js"></script>
```

This logs:

```console
ParentElement
undefined
NestedElement
```

Why is the child property `undefined` from the parent? The `nestedElement` DOM node exists. If it didn't exist the `querySelector` would have returned `null` and a type error thrown.

To see what's going on let's update the parent `connectedCallback` method to include:

```javascript
console.log(this instanceof ParentElement);
console.log(nestedElement instanceof NestedElement);
```

This logs `true` followed by `false` meaning the `<nested-element>` has not yet initialised at the time `connectedCallback` of the `<parent-element>` is called.

Now if we swap the registration order:

```javascript
customElements.define('nested-element', NestedElement);
customElements.define('parent-element', ParentElement);
```

The full log becomes:

```console
NestedElement
ParentElement
NestedElement
true
true
```

Now `<nested-element>` is registered, initialised, and its `connectedCallback` called before `<parent-element>`. Once the parent is connected its child `customName` has been set and no longer `undefined`.

The act of nesting elements isn't actually relevant here. That's just how I discovered this issue trying to use custom elements like the "components" of React et al. The **DOM order** is what matters.

Custom elements cannot access *custom properties* or *custom methods* of another custom element from `connectedCallback` if the second element appears later in the DOM, even if parsed. This is only relevant to `connectedCallback` code that executes *immediately*. Built-in properties native to `HTMLElement` like `localName` can be accessed.

Wrapping the contents of `connectedCallback` with a `setTimeout` effectively solves this by pushing execution later in the event loop after other classes are initialised. This feels hacky though. There's a better way!

`customElements.whenDefined()` returns a promise.

```javascript
connectedCallback() {
  const nestedElement = this.querySelector('nested-element');
  customElements.whenDefined(nestedElement.localName).then(() => {
    console.log(nestedElement.customName);
  });
}
```

Or if you prefer `async/await`:

```javascript
async connectedCallback() {
  const nestedElement = this.querySelector('nested-element');
  await customElements.whenDefined(nestedElement.localName);
  console.log(nestedElement.customName);
}
```

This is perfect for ensuring another custom element is "ready".

What's more, CSS has a [defined pseudo-class](
https://developer.mozilla.org/en-US/docs/Web/CSS/:defined):

```css
my-element {
  &:defined {
    /* ✨ progressive enhancement ✨ */
  }
}
```

Neat.

If you've got this far and understood everything, well done! I'm not so sure I understand it myself. I've probably done a bad job explaining it. I'm new to learning these APIs. The lessons here are:

* Defer custom element definitions until after they're in the DOM
* Use the defined promise when references other custom elements

It actually gets more complicated. [The HTML standard says](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-conformance):

> [...] note that `connectedCallback` can be called more than once, so any initialization work that is truly one-time will need a guard to prevent it from running twice.

It also says that `connectedCallback` can be called for *"an element that is no longer connected"* — what a headache!

[I'm on Mastodon](https://fosstodon.org/@dbushell) as always if you have comments or corrections!
