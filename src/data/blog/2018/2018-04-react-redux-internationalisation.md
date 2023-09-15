---
date: 2018-04-05 10:00:00+00:00
slug: react-redux-internationalisation
title: 'React & Redux - Internationalisation'
description: 'A simple technique for translatable React user interfaces.'
---

Internationalisation, i18n, localisation – whatever you prefer – can be tricky if your code does not support the ability to translate user interface text.

When writing React it's easy to hard-code UI text right into the JavaScript. This is not good if your website or app needs to support multiple languages. **Even if you only support one language** the technique below allows text to be edited without re-transpiling the React source.

Here's an [example on CodePen](https://codepen.io/dbushell/pen/aYjvaW/):


<iframe width="100%" height="300" scrolling="no" title="React & Redux - Internationalisation" src="//codepen.io/dbushell/embed/aYjvaW/?height=300&theme-id=0&default-tab=result&embed-version=2" frameborder="no" allowtransparency="true" allowfullscreen="true">See the Pen <a href="https://codepen.io/dbushell/pen/aYjvaW/">React &amp; Redux - Internationalisation</a> by David Bushell (<a href="https://codepen.io/dbushell">@dbushell</a>) on <a href="https://codepen.io">CodePen</a>.</iframe>


Below I document the technique I've been using over:

## Setting up the state

I like to adhere to [Redux](https://redux.js.org/) principles even for smaller apps. Sure, the boilerplate code can be a little tedious to set up, but it more than pays for itself when debugging.

I start by adding two properties to my Redux state:

```json
{
  "lang": "en",
  "i18n": {}
}
```

The `lang` property is the translation key to be used. It can be anything but mimicking the [HTML lang attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang) seems logical. The `i18n` property maps these keys to text strings for each component name.

Using my [CodePen example](https://codepen.io/dbushell/pen/aYjvaW/):

```json
"i18n": {
  "en": {
    "Menu": {
      "desc": "This app is translated into %1$d languages:",
      "enButton": "English",
      "deButton": "German",
      "esButton": "Spanish"
    }
  },
  "de": {
    "Menu": {
      "desc": "Diese App ist in %1$d Sprachen übersetzt:",
      "enButton": "Englisch",
      "deButton": "Deutsche",
      "esButton": "Spanisch"
    }
  }
}
```

The likelihood of my German being correct is low but you get the idea. If properties like `desc` need to include variables I format for [sprinf](https://github.com/alexei/sprintf.js). Sprintf is well known and a tiny dependency. This is necessary because sentence structure will change per language. If I were to try and concatenate partial strings and variables within a component it would not work.

## Mapping state to props

Once the translations are ready it's time to connect. To continue the example, I start with this basic component:

```jsx
const Menu = props => (
  <div>
    <p>This app is translated into {props.langCount} languages:</p>
    <button>English</button>
    <button>German</button>
    <button>Spanish</button>
  </div>
);
```

All the text is hard-coded and the `langCount` property is inflexible. Let's update the component to accept translatable strings:

```jsx
const Menu = props => (
  <div>
    <p>{sprintf(props.i18n.desc, props.langCount)}</p>
    <button>{props.i18n.enButton}</button>
    <button>{props.i18n.deButton}</button>
    <button>{props.i18n.esButton}</button>
  </div>
);
```

Now we have a stateless functional component ready. We'll need to create a container to map Redux state to these properties:

```jsx
const mapStateToProps = state => ({
  langCount: Object.keys(state.i18n).length
});

const MenuContainer = translate(
  'Menu',
  mapStateToProps
)(Menu);
```

You'll notice I'm not using `connect()` from [react-redux](https://github.com/reactjs/react-redux). Instead I have a similar custom `translate()` function that accepts the component name as the first parameter. Both functions are HOCs [(higher-order components)](https://reactjs.org/docs/higher-order-components.html).

> a higher-order component is a function that takes a component and returns a new component

Here is the full source of `translate()`:

```jsx
function translate(name, mapStateToProps, mapDispatchToProps) {
  return WrappedComponent => {
    const TranslatedComponent = props => {
      // find translations or use defaultProps
      props.i18n = props.i18n.hasOwnProperty(props.lang)
        ? props.i18n[props.lang][name]
        : undefined;
      return <WrappedComponent {...props} />;
    };
    // set a name for debugging
    TranslatedComponent.displayName = `Translate(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      'Component'})`;
    // return HOC connected to state
    return connect(
      state => ({
        ...(mapStateToProps ? mapStateToProps(state) : {}),
        lang: state.lang,
        i18n: state.i18n
      }),
      dispatch => ({
        ...(mapDispatchToProps ? mapDispatchToProps(dispatch) : {})
      })
    )(TranslatedComponent);
  };
}
```

The first parameter `name` references the object key within the state translation data. This can be anything but I find it useful to match component names for simplicity. Basically the `translate()` function is a convenient wrapper for `connect()` that establishing an internationalisation conventions.

Not all components need to be connected to the Redux state directly. Nor is it practical to do so if a component is reusable and context changes. In such cases I'd connect the parent and pass the relevant i18n properties.

In the example if the `<button>` was its own React component I'd do:

```jsx
<CustomButton label={props.i18n.enButton} />
```

I've kept `translate()` to a basic implementation here. It can be extended to provide more advanced logic to resolve translations. Or you could provide access to `mergeProps` of `connect()` if required.

## To summarise!

This technique achieves the following results:

* all user interface text is abstracted into one place
* UI text is editable without searching through each component
* UI text can be translated into multiple languages
* `state.lang` defines the translation in use

If you look at [my CodePen demo](https://codepen.io/dbushell/pen/aYjvaW/) you can see the Redux actions to change language through `mapDispatchToProps`.

How you include `state.i18n` is up to you:

* import a JSON file and compile it into the JavaScript
* output JSON to (and retrieve from) the global object
* load JSON via an API call

This is a simple but practical solution. Even if you're only supporting one language it is beneficial to abstract UI text in this manner. It also allows you to make use of a content management system to provide the translations. You could even try to detect the users default language and set the initial state.

There are more advanced solutions but I've found Redux and this simple abstraction of `connect()` to be easy and adequate for small apps.
