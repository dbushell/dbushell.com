---
date: 2023-11-24 10:00:00+00:00
slug: json-anything
title: 'JSON Anything'
description: 'The one where I extend JSON'
---

Did you know that `JSON.stringify` and `JSON.parse` can take more than one argument?

Perhaps like me you've done:

```javascript
JSON.stringify(data, null, 2);
```

To output readable JSON with 2 space formatting — the correctly amount of whitespace. But what is that `null` all about? Surely I've researched this before and forgotten.

## JSON basics

Standard JSON values include the primitives:

* `boolean`
* `null`
* `number`
* `string`

And then `array` and `object` collections of all those and each other.

Although a [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) looks very similar to an `array`, and [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) like an `object`, they cannot be serialised as JSON. That is unless you take advantage of the mythical **2nd argument**.

## JSON enhanced

`JSON.stringify` takes a `replacer` as the 2nd argument and `JSON.parse` takes a corresponding `reviver`. These are two functions that receive a `key/value` pair and return the `value`. For `replacer` the returned `value` must be a standard JSON value. For the `reviver` the value can be anything.

In the example below the `replacer` converts a `Set` and `Map` into a standard JavaScript object. I've come up with a simple notation to retain enough information for later.

```javascript
const replacer = (key, value) => {
  if (value instanceof Set || value instanceof Map) {
    return {
      _class: value.constructor.name,
      _value: [...value]
    };
  }
  return value;
};
```

Let's see it in action:

```javascript
const set = new Set();
set.add('apples');
set.add('oranges');
set.add('bananas');

const map = new Map();
map.set('apples', 'red');
map.set('oranges', 'purple');
map.set('bananas', 'yellow');

const data = {set, map};

const serialized = JSON.stringify(data, replacer, 2);

console.log(serialized);
```

This example will output the JSON:

```json
{
  "set": {
    "_class": "Set",
    "_value": [
      "apples",
      "oranges",
      "bananas"
    ]
  },
  "map": {
    "_class": "Map",
    "_value": [
      [
        "apples",
        "red"
      ],
      [
        "oranges",
        "purple"
      ],
      [
        "bananas",
        "yellow"
      ]
    ]
  }
}
```

The order in which entries are added to a Set and Map can be significant. My JSON conversion should retain that order. I'm using `[...value]` to convert both into an array. That is shorthand for `Array.from(value.values())` and `Array.from(value.entries())` for a Set and Map respectively. Sets iterate over their values; Maps over their entries.

Now to get this back into JavaScript we need a `reviver` that understands this notation:

```javascript
const reviver = (key, value) => {
  if (value && typeof value === 'object') {
    if (value._class === 'Set') return new Set(value._value);
    if (value._class === 'Map') return new Map(value._value);
  }
  return value;
};
```

Note that I'm checking `value` is truthy because `null` is technically an object type.

If you're playing a round of code golf:

```javascript
const reviver = (k, v) =>
  v?._class ? new globalThis[v._class](v._value) : v;
```

I figured the former version was more appropriate.

Anyway, following on from my previous example:

```javascript
const deserialized = JSON.parse(serialized, reviver);
console.log(deserialized);
```

This will output a real instance of `Set` and `Map`.

It's important to note that these are not the same instances as before.

```javascript
console.log(map === deserialized.map);
```

This equals `false`.

However, they do have the exact same data.

```javascript
const s1 = JSON.stringify(map, replacer);
const s2 = JSON.stringify(deserialized.map, replacer);
console.log(s1 === s2);
```

This equals `true`.

Using this technique you could serialise almost anything as JSON providing it is "pure". That is to say, the same input produces the same output. At least pure enough for your use case.

I've thrown this code into a [CodePen](https://codepen.io/dbushell/pen/YzBvPRG) if you want to have a play around.

See you later! I'm out to buy fruit with my JSON shopping list 😎✌️
