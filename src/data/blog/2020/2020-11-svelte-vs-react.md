---
date: 2020-11-16 10:00:00+00:00
slug: svelte-vs-react
title: 'Svelte vs React'
description: 'The one where I review Svelte again after using it in production.'
---

[My early impressions of Svelte](/2020/09/07/getting-svelte-js/) were positive but my test drive didn't venture far. Since then I've built a more substantial client website using Svelte in part. Using it in production has given me a greater understanding. I'm comparing [**Svelte**](https://svelte.dev/) to [**React**](https://reactjs.org/) because the latter has been my tool of choice for years. A few key differences have come to mind.

Topics from the basic to the more advanced:

1. [Component and Props](#component-and-props)
2. [Event Handling](#event-handling)
3. [Reactivity and Hooks](#reactivity-and-hooks)

If you're short on time skip ahead to section 3 for the juicer parts.

This is a subjective review.

## Component and Props

I like to use [pure functional components](https://en.wikipedia.org/wiki/Pure_function) wherever possible. Lifting state and logic as high as is sensible. It improves reusability and I find leads to more readable code.

Consider the following **React** component:

```jsx
const Pagination = (props) => {
  return (
    <p>{props.start} – {props.stop} of {props.total}</p>
  );
};
export default Pagination;
```

In **Svelte** this component would be:

```svelte
<script>
  export let start;
  export let stop;
  export let total;
</script>

<p>{start} – {stop} of {total}</p>
```

Even with this basic example the `export` statements start to feel a little bit verbose. It's necessary to define props in this way so Svelte can do its magic. A minor tedium for the lazy like me. However, defining default props is easier in Svelte:

```js
export let start = 1;
```

Whereas in React I might add:

```js
const {start = 1} = props;
```

Side note: I really hate `defaultProps` and `propTypes` — especially since React moved away from class-based components.

Side side note: I wonder how **TypeScript** works with Svelte? Something to investigate. In theory I like its use with React props — I've just never gotten past compiler errors. Serious, [can anyone help me](https://twitter.com/dbushell) with a no-nonsense TypeScript & React setup?

In Svelte I understand it's possible to do `$$props.start` or possibly `export let props;` as a single object. I suspect both are bad ideas. Perhaps for an end-of-the-line component such a shortcut wouldn't matter. Then again, it's best to practice best practices everywhere.

Components with basic props are used with identical syntax in both React & Svelte:

```jsx
<Pagination start={1} stop={10} total={42} />
```

Or by spreading some object:

```jsx
<Pagination {...paginationProps} />
```

That's neat.

Both are concise in this area and I don't have a strong preference.

For components I'm finding Svelte to be a little easier on the eyes. I like the forced separation of the script and template in Svelte. But I also like the power of JSX expressions. In React it's all just fancy JavaScript so you can do some really ugly things composing a component. I've had to rethink how I write components in Svelte with its templating syntax but I've never felt stuck. It might actually stop me doing ugly things.

In React I'll sometimes write multiple components in one file and only export the parent. That's not possible in Svelte but nothing a bit of folder organisation can't solve. It's suprising how minor differences can affect workflow and habits.

### A Note on Vue 3

I've recently given [**Vue 3**](https://v3.vuejs.org/) another glance. It's a notable and popular adversary. Admittedly it's the framework I'm least familiar with but I find components awkward in comparison. How Svelte handles reactivity makes Vue look outdated. So much of Vue's template syntax being tied to DOM nodes is highly off-putting to me. I can't see myself opting for Vue but I will give version 3 a fair shake soon.

## Event Handling

In React I might pass a callback function to a child component as a prop.

```jsx
const Pagination = ({onNext}) => {
  return (
    <button type="button" onClick={onNext}>Next Page</button>
  );
};
export default Pagination;
```

The parent:

```jsx
import Pagination from './Pagination.jsx';

const App = () => {
  const onNext = () => {
    console.log('Do something...');
  };
  return (
    <Pagination onNext={onNext} />
  );
};
```

The parent component handles the event and does "something".

This can be done the same way in Svelte:

```svelte
<script>
  export let onNext;
</script>

<button type="button" on:click={onNext}>Next Page</button>
```

```svelte
<script>
import Pagination from './Pagination.svelte';

const onNext = () => {
  console.log('Do something...');
};
</script>

<Pagination {onNext} />
```

[Try a live demo in the Svelte REPL](https://svelte.dev/repl/9bf7f999087948f79aaf1c1f4ccc5630?version=3.29.4).

Svelte provides another way to dispatch and handle custom events.

```svelte
<script>
  import {createEventDispatcher} from 'svelte';

  const dispatch = createEventDispatcher();

  const onNext = () => {
    dispatch('next');
  };
</script>

<button type="button" on:click={onNext}>Next Page</button>
```

```svelte
<script>
import Pagination from './Pagination.svelte';

const onNext = () => {
  console.log('Do something...');
};
</script>

<Pagination on:next={onNext} />
```

The parent component uses a custom event directive to listen instead of passing a callback. If the parent doesn't handle the event itself it and can forward it up:

```svelte
<Pagination on:next />
```

And then the parent of the parent can handle it:

```svelte
<PaginationContainer on:next={onNext} />
```

[My second REPL demo](https://svelte.dev/repl/e7b738323b26452b88ee54924b00dffd?version=3) might be easier to understand this concept. It's like the opposite of passing a callback down through props. Svelte custom events don't naturally bubble up without forwarding them. I'm not entirely sure when one should prefer this technique. I've found callback props easier to manage.

### Event Modifiers

Svelte also has shorthand modifiers for directives:

```svelte
<form on:submit|preventDefault={onSubmit}> ... </form>
```

Without the modifier — or similarly in React — I'd do:

```js
const onSubmit = (ev) => {
  ev.preventDefault();
  console.log('Do something...');
};
```

Perhaps it's my React background but I prefer to avoid using modifiers. The alternative keeps handler code in one place; less logic in the template.

## Reactivity and Hooks

This is where Svelte and React really start to differ and I get tripped up.

Consider this basic React component:

```jsx
const App = () => {
  const time = Date.now();
  const [count, setCount] = useState(0);
  const onClick = () => setCount(count + 1);
  return (
    <>
      <button onClick={onClick}>Clicks: {count}</button>
      <p>Time: {time}</p>
    </>
  );
};
```

When the button is clicked the `count` state increments, the component re-renders, and the `time` is updated in the process.

A similar but subtly different Svelte component:

```svelte
<script>
  const time = Date.now();
  let count = 0;
  const onClick = () => (count++);
</script>

<button on:click={onClick}>Clicks: {count}</button>
<p>Time: {time}</p>
```

The difference in Svelte is that `time` never updates.

The Svelte script only runs once when the component is initialized. Unlike the React component which is essentially a render function that runs with every update. In Svelte the local `count` variable becomes "reactive" due to compiler magic. It's concise and clever but not always intuitive.

To effectively freeze time in React we'd do this:

```js
const [time] = useState(Date.now());
```

Thus making the component behave more like its Svelte counterpart.

Or to make the original Svelte component behave more like React:

```js
import {beforeUpdate} from 'svelte';
let time;
beforeUpdate(() => (time = Date.now()));
```

I could also do:

```js
$: time = Date.now() || count;
```

This works but it's terrible code! It's a [reactive statement](https://svelte.dev/docs#3_$_marks_a_statement_as_reactive) in Svelte.

> Reactive statements run immediately before the component updates, whenever the values that they depend on have changed.

What makes my example bad is that I using `|| count;` – which is basically dead code – to force reactivity. It's code golf for the sake of fewer lines.

Back to the point.

I've found myself getting tripped up in Svelte because I'm so used to writing React render functions. In Svelte the lead `<script>` is effectively the component constructor. This is a fundamental difference in Svelte components.  It's not inherently a bad one. However, I do find the logical code flow tricker to follow in Svelte due to reactivity. I can't be so quick to criticise Svelte in this regard until I've used it more.

A less obvious difference in my examples is the `onClick` event handler function. In Svelte it is created once. In React a new function is created every update.

React has the `useCallback` hook to improve efficiency.

```js
const onClick = useCallback(() => setCount(count => count + 1), []);
```

This is a necessary by-product of React's move from classes to functional components. In reality you can get away without `useCallback`. The performance hit can be negligible with limited components and infrequent updates. I prefer the practice of using it anyway.

### And so...

I really like Svelte. I like React just fine too, but I'm finding Svelte to have less overhead for my use cases. In future I'll likely write more on this topic. There is so much more to compare. I could go deeper into state management but neither framework is overly prescriptive.

Svelte is now my go-to UI framework. I'll still be writing a lot of [React for WordPress Gutenberg](/2020/05/08/wordpress-gutenberg-react-acf-example-blocks/). And as mentioned, I'll give Vue 3 another chance.

Which JavaScript framework do you prefer? [Tweet me @dbushell!](https://twitter.com/dbushell)

Bonus points if you reply "none".
