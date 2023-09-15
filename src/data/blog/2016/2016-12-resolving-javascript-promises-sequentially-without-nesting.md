---
date: 2016-12-16 10:00:00+00:00
draft: false
slug: resolving-javascript-promises-sequentially-without-nesting
template: single.html
title: 'Working with Promises'
---

JavaScript [promises](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) are a handy way to write asynchronous code. It’s common to have multiple promises resolve in parallel or series.

Let’s say you have several functions that return a promise:

```javascript
function act1() {
  return new Promise((resolve, reject) => {
    // do something that might reject...
    resolve();
  });
}
```

It’s easy to run these functions in parallel:

```javascript
Promise.all([act1(), act2(), act3()]).then(() => {
  // all promises fulfilled!
}).catch(err => {
  // something went wrong!
});
```

But how to run them sequentially? One way is to nest the promises:

```javascript
act1().then(() => {
  act2().then(() => {
    act3().then(() => {
      // all promises fulfilled!
    });
  });
}).catch(err => {
  // something went wrong!
});
```

Nesting gets uglify real fast and some consider it an anti-pattern.

My alternative method is to create an array of promise-returning functions and then use `Array.reduce` to run them one by one:

```javascript
[act1, act2, act3].reduce(
  (p, fn) => p.then(fn),
  Promise.resolve()
).then(() => {
  // all promises fulfilled!
}).catch(err => {
  // something went wrong!
});
```

If you’re not familiar with [reduce](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) it iterates over an array passing a value between each iteration. Usually you would concatenate a string or extend an object. In this example the value is the next promise. `Promise.resolve()` is used to start the chain.

Seems like a cleaner solution than nesting?

Here’s a CodePen:


<iframe width="100%" height="265" scrolling="no" title="Resolve Promises sequentially without nesting" src="//codepen.io/dbushell/embed/yVQKar/?height=150&theme-id=0&default-tab=js&embed-version=2" frameborder="no" allowtransparency="true" allowfullscreen="true">See the Pen <a href="https://codepen.io/dbushell/pen/yVQKar/">Resolve Promises sequentially without nesting</a> by David Bushell (<a href="https://codepen.io/dbushell">@dbushell</a>) on <a href="https://codepen.io">CodePen</a>.</iframe>



[Matt Hinchliffe](https://twitter.com/i_like_robots) shared his library of [promise patterns](https://www.npmjs.com/package/promise-patterns) that includes a similar function. I’ve also been experimenting with JavaScript [generators](https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Iterators_and_Generators) and [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)/[await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await).
