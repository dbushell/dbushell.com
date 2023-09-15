---
date: 2017-04-19 10:00:00+00:00
slug: typescript-instead-of-react-proptypes
title: 'TypeScript over React PropTypes'
description: 'I ditched React PropTypes in favour of TypeScript to see how things stacked up.'
---

[React v15.5.0](https://facebook.github.io/react/blog/2017/04/07/react-v15.5.0.html) is here and the `React.PropTypes` module gives a deprecation warning. Moving forward you'll find it in it's own [package](https://github.com/reactjs/prop-types).

I've always used React PropTypes because it seemed like the 'right way' to do things. Runtime validation has obvious value but in my experience there are three big negatives to it:

1. PropTypes are tedious to write
2. PropTypes bloat production code
3. Runtime validation is slow and I miss errors

I solve the first thing with more coffee. I solve the second with Babel transform plugins to drop them from production. Thing three; coffee again perhaps (solution or problem?). There must be a better way, right?

## TypeScript

[TypeScript](https://www.typescriptlang.org/) "is a typed superset of JavaScript that compiles to plain JavaScript".

TypeScript (and [Flow](https://flow.org/en/)) has been on my radar for a long time. I've yet to learn most of what's possible but enough to get going. [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) provides the type defintions for React (and myriad other libraries).

In place of PropTypes I can add a type interface for functional components:

```jsx
interface ButtonProps {
  text: string,
  shadow?: boolean
}

const Button: React.SFC<ButtonProps> = props => {
  return ( /* [...] */ );
};
```

Now when I use the `<Button/>` component my editor shows useful info like missing props and specific types:

![TypeScript in action with React development](/images/blog/2017/dbushell-button-typescript.gif)

That sure beats runtime validation.

TypeScript is more than a React PropTypes replacement. It adds a whole lot to JavaScript and I'm keen to learn it. Not least because my franken-website is a hybrid of TypeScript and Babel compilation. Promise me you won't look.

By the way. As you probably know, I'm [statically generating](/2017/02/13/react-as-a-static-site-generator/) my website with React. I figured, why not make it universal?

If you open the dev console and type:

```js
dbushell.universal();
```

Hit return, it'll fetch in Preact and stuff. Now have a click around. There should no longer be a page refresh. This is still in the experimental stage but it looks to be working as intended! [Tweet me opinions @dbushell](https://twitter.com/dbushell).

Check back soon for more on that.
