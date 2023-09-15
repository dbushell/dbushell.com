---
date: 2016-12-02 10:00:00+00:00
draft: false
slug: my-thoughts-on-react
template: single.html
title: 'My thoughts on React'
---

I've been playing with [React](https://facebook.github.io/react/) for some time now. React is:

> "A JavaScript library for building user interfaces".

Unlike other libraries something about React just clicked with me. Back in October a client project came along that presented a golden opportunity to develop a web app. I decided to use React, and I now consider myself comfortable in its ecosystem.

Below this huge logo are some of my thoughts on React.

![the React logo](/images/blog/2016/react_logo_og.png)

React has its own [JSX syntax](https://facebook.github.io/react/docs/jsx-in-depth.html) for writing components. JSX tightly couples HTML with JavaScript in a readable fashion. It does not adhere to a ‘separation of concerns’ in that regard. Rather, it fully embraces the alternative.

This isn't a React tutorial but here are two contrived examples that hopefully illustrate my thoughts later. I present a simple button and toolbar:

```jsx
const Button = props => {
  return (
    <button className="button" onClick={props.onClick}>{props.label}</button>
  );
};
```


```jsx
const Toolbar = props => {
  return (
    <nav className="toolbar">
      <Button onClick={props.undo} label="Undo"/>
      <Button onClick={props.redo} label="Redo"/>
    </nav>
  );
};
```

Apologies for the lack of syntax highlighting.

There are imperfections to JSX for sure. The `class` HTML attributes become `className` for example (the former is a reserved keyword in JavaScript). Components without children must use self-closing tags — flashback to the days of XHTML.

By the way, if you’ve never used React, the components you define like `<Toolbar/>` can be re-used like HTML elements in other components. They exist in JSX-world only. When React writes to the DOM it uses your semantic HTML underneath.

Despite the quirks I’ve fostered a preference for using JSX over HTML templating used by other libraries. Writing [stateless functional components](https://medium.com/@housecor/react-stateless-functional-components-nine-wins-you-might-have-overlooked-997b0d933dbc#.r9ygr5pbk) that are presentational-only further satisfies my fondness for readable code. (I’m using [Redux](http://redux.js.org/) to manage state. A topic for another day.)

## Transpiling

JSX is not native JavaScript so it must be transpiled. For this I’m using [Babel](https://babeljs.io/). And with Babel as a dependency comes ~~an excuse~~ the ability to use [new JavaScript features](https://babeljs.io/docs/learn-es2015/). I’ve fallen in love with arrow functions and the rest/spread operator. These things may not be supported in web browsers but we can transpile them away.

So the necessity to transpile code before it can run is a bit iffy. But it’s trivial for me to write Gulp watch tasks to do this in the background.

I was flirting with the idea of using [TypeScript](https://www.typescriptlang.org/) (or [Flow](https://flowtype.org/)). Decided against it. Too much new tech at once and I’d be one of ‘those’ developers.

## Dependencies

I suspect a few readers are already balking over the number of names and acronyms I’ve already dropped. A year ago I wrote [“I don't do Angular, is that OK?”](/2015/02/04/i-dont-do-angular-is-that-ok/). I deliberated over what I should know as a professional front-end developer.

The piece [“How it feels to learn JavaScript in 2016”](https://hackernoon.com/how-it-feels-to-learn-javascript-in-2016-d3a717dd577f) by _Jose Aguinaga_  sums up this quandary from an amusing, if cynical, perspective shared by many.

As with all tools and technology some amount of prerequisite knowledge is required. Efficient development of React requires a bit of transpiling and automation know-how. Coding in plain JavaScript requires understanding of web standards. That, in turn, requires computer literacy — and so on up and down the dependency chain. Obviously knowing how to turn on a computer is assumed but to me it seems somewhat arbitrary, or at least highly subjective, where to draw the line.

I still don’t "do Angular" but now I do do React.

That’s the worst sentence I’ve ever written.

Anyway, my point is that rejecting new technology on the premise that it introduces complexity is simply wrong if said tech _proves_ to make life easy for those involved (not drive-by Githubers). For me — and I ~~hope~~ plan for those reading my documentation — React make coding web apps a delightful experience.

What makes React special is its singular focus on user interface. It doesn't box you into a framework. It doesn't force you to solve app architecture problems too early. From my own usage I believe this makes React the most approachable library of its ilk.

## One last thing...

It would be criminal not to give a shout-out to [Preact](https://preactjs.com/). A magical _"fast 3kB alternative to React with the same ES6 API"_ written by [Jason Miller](https://github.com/developit).

[Vue](https://vuejs.org/) and [Inferno](https://github.com/trueadm/inferno) are also on my radar.
