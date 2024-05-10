---
date: 2023-02-20 10:00:00+00:00
slug: javascript-promise-error-handling
title: 'Promise Error Handling in JavaScript'
description: 'The one where asynchronousity befuddles me '
---

I've been neck deep in asynchronous JavaScript.

Here is a quick test (for my future self). Consider the following code. The URL is purposefully invalid to throw a fetch error. What do you think the output will be?

**Note: all examples are using the [Deno runtime](https://deno.land/).** Other JavaScript environments may not support top-level await. The general principles are the same regardless.

```javascript
const url = 'htp:/domain.whoops!';

console.log('Start');

try {
  await fetch(url);
} catch {
  console.log('catch 1');
}

await fetch(url).catch(() => {
  console.log('catch 2');
});

try {
  await fetch(url).catch(() => {
    console.log('catch 3');
  });
} catch {
  console.log('catch 4');
}

try {
  fetch(url).catch(() => {
    console.log('catch 5');
  });
} catch {
  console.log('catch 6');
}

try {
  fetch(url);
} catch {
  console.log('catch 7');
}

console.log('End');
```

Don't scroll down too far if you don't want to see the answer.

Ready?

The script outputs:

```console
catch 1
catch 2
catch 3
End
catch 5
[error]
```

Bonus points if you got the "End" in the correct order.

The error comes from the last `fetch` that is never caught. The parent `try` block and following code executes before the promise throws an error.

Basically if you `await` a promise returning function the parent `try` block handles the error. If you don't `await` you must chain `.catch()` to handle the error. Even if the parent `try` block is still in scope. For example:

```javascript
const wait = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const asyncFun = async () => {
  await wait(100);
  throw new Error();
};

try {
  asyncFun();
  console.log('A');
  await wait(1000);
  console.log('B');
} catch {
  console.log('C');
}
```

The script only outputs "A" before the error kills it. The error from `asyncFun` is not handled even though the `try` block is still running. So either `await` and `try`/`catch` the promise or `.catch()` it.

*(Interestingly [Bun/WebKit](https://bun.sh/) does output "B" after the error...)*

You don't have to catch it immediately.

```javascript
const wait = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const random = (min, max) =>
  1000 * Math.floor(Math.random() * max + min);

const meaningOfLife = async () => {
  console.log('calculating answer');
  await wait(random(1, 5));
  throw new Error();
};

const answer = meaningOfLife();

await wait(1000);
console.log('going for coffee');
await wait(1000);
console.log('still waiting');
await wait(1000);

try {
  await answer;
} catch {
  console.log('42');
}
```

Does it output "42"? Sometimes! The `meaningOfLife` function takes between one and five seconds before it throws an error. The script waits three seconds before attempting to catch any errors.

You could replace the last `try` block with:

```javascript
console.log(
  await answer.catch(() => '42')
);
```

It's the same effect. We've created a race condition bug. Probably best to avoid this pattern entirely!

*(Again Bun/WebKit continues despite the error and outputs "42", curious...*)

These are contrived examples but it's easy to make similar mistakes in the real world. Especially with functions like `fetch` that take an undetermined amount of time to resolve. You might have a service running for weeks until a remote endpoint goes down causing a `fetch` error. Then you realise wrapping everything like this is not bulletproof:

```javascript
try { /* [...] */ } catch { console.log(`😏`); }
```

Today's lesson is do one of the following:

* `await` promises in a `try`/`catch` block
* chain `.catch()` immediately

Otherwise you cannot guarantee to catch an error. How and where is a combination of preferred coding style and execution order. There are nuances if you want to add `finally` into the mix. If you know why WebKit doesn't exit after the error please let me know [@dbushell](https://twitter.com/dbushell) I have no idea!
