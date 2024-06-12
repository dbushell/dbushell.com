---
date: 2024-06-12 10:00:00+00:00
slug: docs-custom-element-web-component
title: '“Dots” Custom Element (aka Web Component)'
description: 'There one where I jump on a trend'
---

Please accept my half-hearted apology for the awkward title. *Web Components* are hot right now but the name is [considered harmful](https://www.mayank.co/blog/web-components-considered-harmful/) according to **Mayank**. I think Mayank makes a strong argument, but I also want the brand recognition and "SEO juice", so I'm being apologetically greedy with the title.

## The Prototype

Anyway, I've been coding up a "Dots" [custom element](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements). Dots are those little fiddly buttons that are used to navigation carousels and such. Yeah I know [carousels are bad](https://shouldiuseacarousel.com) and I do protest but it's not always my decision.

Look at this GIF:

<figure class="Image">
  <img
    loading="lazy"
    decoding="async"
    fetchpriority="low"
    src="/images/blog/2024/dots-component.gif"
    alt="interacting with the “Dots” component"
    width="220"
    height="60">
</figure>

See my ["Dots" prototype on **CodePen**](https://codepen.io/dbushell/full/xxNXqVW).

Obviously a bunch of dots are useless on their own. I plan to pair them with a carousel component I will create next. Isn't this already a solved problem? I've been researching many carousels all of which are implemented differently. My goal is to build a set of composable elements that can make a carousel or be used elsewhere. Where else can "Dots" be used? I don't know, stop asking hard questions.

I'm looking for feedback, especially on accessibility. [Reach me on Mastodon](https://fosstodon.org/@dbushell).

## Stylin'

This is the least important aspect of the component. I've added just enough CSS for the demo to look nice. The only thing worth noting is the hidden pseudo-element I'm using to expand the target area. Dots are 50% larger than they look and thus easier to poke. The elongated effect is optional and easily removed. I'm not sure if I like it myself, but it's trendy, and makes for a more interesting visual demo.

## Accessible Markup

I figured this would be an simple custom element to code but it's surprisingly tricky. What is the correct markup? I could use a list of buttons:

```html
<dots-component>
  <ol>
    <li>
      <button type="button" aria-selected="true">
        <span>Item 1</span>
      </button>
    </li>
    <li>
      <button type="button">
        <span>Item 2</span>
      </button>
    </li>
  </ol>
</dots-component>
```

Many examples I've researched use a list. Most like [Splide](https://splidejs.com/) use `<ul>` but surely `<ol>` like [Flickity](https://flickity.metafizzy.co/) uses is correct? Regardless, I've opted to go without:

```html
<dots-component>
  <button type="button" aria-selected="true">
    <span>Item 1</span>
  </button>
  <button type="button">
    <span>Item 2</span>
  </button>
</dots-component>
```

Screen readers can announce the list numbers which sounds redundant and confusing with the button labels. I'm adding `role` attributes later which affects this too.

I pondered if `<button>` was correct or whether I should use `<a href="#item-1">` allowing for more progressive enhancement. Since I'm not building the entire carousel (yet) I can't assume fragment links are implemented correctly.

[Bootstrap's carousel](https://getbootstrap.com/docs/4.0/components/carousel/) forgoes any interactive element and expects the user the click a three pixel tall `<li>` — oh dear. [Glide carousel](https://glidejs.com/docs/) is unlisted with `<button>` elements that have no label. Neither claim to be accessible and Bootstrap even says *"carousels are generally not compliant with accessibility standards"*. At least they're honest.

For button labels I considered using `aria-label` instead of the hidden `span`. [W3C's example](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/examples/carousel-2-tablist/) takes this approach. However, W3C also say the [first rule of ARIA](https://www.w3.org/TR/aria-in-html/#rule1) is that you ~~do not talk~~, I mean, let's just quote the doc:

> If you can use a native HTML element or attribute with the semantics and behaviour you require already built in, instead of re-purposing an element and adding an ARIA role, state or property to make it accessible, then do so.

In short: *"If you can use [native HTML] then do so"*. So I did so. **Chris Ferdinandi** has written about other [issues using aria-label](https://gomakethings.com/revisting-aria-label-versus-a-visually-hidden-class/) so I'm avoiding it.

Patterns like [Filament Group's carousel](https://filamentgroup.github.io/fg-carousel/demo/#dots) use `role="tablist"` on the wrapper `role="tab"` on the buttons. I've added these roles as it's one practice that seems uncontested. Apple's VoiceOver does announce the number of tabs during navigation.

Using `aria-selected` on the active button is the accepted attribute for tabs. Initially I thought `aria-current` but that is more appropriate for pagination. Of course, I could use a HTML class for styling, adhering to ARIA rule 1, but this attribute adds context and styling with `[aria-selected="true"]` is a bonus.

The final markup looks like this:

```html
<dots-component role="tablist">
  <button type="button" aria-selected="true" tabindex="0" role="tab">
    <span>Item 1</span>
  </button>
  <button type="button" aria-selected="false" tabindex="-1" role="tab">
    <span>Item 2</span>
  </button>
</dots-component>
```

The custom element JavaScript adds & updates the attributes as needed (notes on `tabindex` below). What do you think? [I'm looking for feedback](https://fosstodon.org/@dbushell).

## Interactive API

I'm more confident on the interactivity stuff. The JavaScript is fairly robust and can handle DOM modifications if buttons are added, removed, etc. Query selectors are not cached (over optimisation). A single `click` event listener is registered to handle pointer navigation.

I've implemented ["The Looper" pattern](https://www.youtube.com/watch?v=vwgihljM2e4) as **Adam Argyle** names it. Basically, like radio input groups, only the active element is in the document tab sequence. This is done using `tabindex` attributes. When a button is focused the whole group can be cycled through using the arrow keys. Right-to-left content flow is accounted for.

### Attributes

My component supports a `disabled` attribute.

```html
<dots-component disabled>
  <!-- buttons -->
</dots-component>
```

Attributes can be toggled with JavaScript in two ways:

```javascript
const dots = document.querySelector('dots-component');
dots.disabled = true; // set directly
dots.removeAttribute('disabled'); // use methods
```

The `disabled` attribute is passed down to all `<button>` children syncing their state.

[**Jeremy Keith**](https://adactio.com/journal/21078) suggests using the `data-` prefix for custom attributes to avoid clashing with possible future global attributes. I recently [criticised HTMX](/2024/04/16/htmx-and-modern-javascript/#a-few-thoughts-on-htmx) for using `hx-` over `data-`. Angular does the same with `ng-`. But those two examples don't usually use custom elements. Custom elements allow for unprefixed attributes which surprises me. There's a lot [more discussion](https://github.com/whatwg/html/issues/2271) but it appears the horse has bolted on this one.

I think my `disabled` attribute is safe — I say hesitantly — because I'm imitating one that already exists. That said, it's not identical because the `:disabled` CSS pseudo-class doesn't work. So perhaps I'm committing the worst sin...

There is a newer [ElementInternals API](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals) that allows for custom state:

```javascript
class DotsElement extends HTMLElement {
  #internals;
  connectedCallback() {
    this.#internals = this.attachInternals();
    this.#internals.states.add('disabled');
  }
}
```

Custom state can be selected with CSS:

```css
dots-component {
  &:state(disabled) {
    pointer-events: none;
  }
}
```

This state does not directly translate to HTML attributes; they must be connected manually. For my use case I still need to propagate the `disabled` attribute down. In the full code I'm using get/set methods along with `attributeChangedCallback`.

The question remains do I stick with `disabled` or used `data-disabled` for the `<dots-component>` custom element?

### Events and Methods

My custom element dispatches a `change` event.

```javascript
const dots = document.querySelector('dots-component');
dots.addEventListener('change', (ev) => {
  console.log(
    `Index: ${ev.detail.activeIndex}`,
    `Label: "${ev.target.activeElement.innerText}"`
  );
});
```

The element has a few methods too:

```javascript
dots.goto(2);
dots.previous();
dots.next();
```

These should be self explanatory.

## Next Step

Play around with the [CodePen demo](https://codepen.io/dbushell/pen/xxNXqVW). Send me [feedback](https://fosstodon.org/@dbushell) so I can perfect it. I feel it's in a good place despite being completely useless by itself!

As mentioned I plan to build the other piece(s) of a carousel pattern. I've attempted that before with my [Mostly CSS Responsive Carousel](https://codepen.io/dbushell/pen/mdWGWJZ). That version doesn't use custom elements and the "dots" were an afterthought.

By the way, I'm using the name `<dots-component>` for lack of a better idea. Suggestions are welcome. Have a good day!
