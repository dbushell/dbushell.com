---
date: 2013-11-08 11:15:03+00:00
excerpt: None
slug: form-label-design
template: single.html
title: Form Label Design
---

Web forms are often a tedious experience. There's a lot to be said for keeping questions to a minimum. Do I really need to enter my name across three fields, can't you just call me "Dave"?

To save space and reduce visual noise it's become quite common to repurpose HTML placeholders. But as we should all know: [Placeholder Attribute Is Not A Label!](http://www.webaxe.org/placeholder-attribute-is-not-a-label/) For semantics and accessibility a real `<label>` should precede its corresponding `<input>` field.

![placeholder label problems](/images/blog/2013/placeholder-label-problems.png)

**Matt D. Smith** recently shared a [floating label pattern](http://mattdsmith.com/float-label-pattern/) for an iOS app:

![floating label form animation](/images/blog/2013/form-animation.gif)

💤 Copyright © [Matt D. Smith](http://dribbble.com/shots/1254439--GIF-Float-Label-Form-Interaction)

Quite a nice idea if you ask me. I'm not suggesting it should be the default and I don't plan to copy the idea myself in projects but as an experiment I tried to create the effect in HTML & CSS.

With JavaScript this would be easy but where's the fun in that?

Here is [my result on CodePen](http://codepen.io/dbushell/full/ruDAb):

See the Pen [ruDAb](http://codepen.io/dbushell/pen/ruDAb) by David Bushell ([@dbushell](http://codepen.io/dbushell)) on [CodePen](http://codepen.io)

The HTML is very simple so providing fall back styles for older browsers should be easy (IE9 and below don't support `placeholder` attributes).

````markup
<div class="field">
  <label class="field__label" for="form-name">Name</label>
  <input class="field__input" required type="text" placeholder="Name…" id="form-name">
</div>
````

## The Need for JavaScript

It's impossible to tell if an input field is empty with CSS selectors (the `:empty` pseudo-class represents any element that has no children). My experiment abuses `:valid` and because the input field has a `required` attribute it becomes invalid when empty. For this reason the technique only works as expected on `<input type="text">`. With more complex validation requirements, like an email, the floating label won't appear immediately.

So after all that JavaScript would be advised to achieve this effect properly. And with JavaScript the CSS would be half as confusing. And you could use nice transitions. Ah well.
