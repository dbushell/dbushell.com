---
date: 2017-02-13 10:00:00+00:00
slug: react-as-a-static-site-generator
title: 'React as a Static Site Generator'
description: 'I wrote my own SSG using React (because I could).'
---

Two years ago I converted my website from WordPress to a [static build process](/2015/05/11/wordpress-to-metalsmith/). It has served me well but the final process was rather messy. Hacks and plumbing to get Metalsmith plugins working _my way_ didn't helped.

Time for a new project!

**Abstract**: rebuild my website using [React](https://facebook.github.io/react/) as the template engine for a bespoke static site generator. Learn more Node and ES6 along the way.

**Rationale**: because I can. 

**Result:** If you're reading this I have succeeded.

## Why React?

In January I wrapped up a long contract to build a React/Redux web app. I found React to be [an intuitive solution](/2016/12/02/my-thoughts-on-react/) to manage UI. React fits nicely with the modular thinking I apply when coding HTML & CSS. I'm aware of existing static site generators that use React. I decided to roll my own for the fun of it.

## Writing the React Components

I got off to a false start. Last year's [redesign project](/2016/02/29/a-bit-of-a-new-look/) was a bit rushed in development and I wanted to fix some issues. It was a mistake to attempt to refactor HTML & CSS whilst translating everything into JSX. I got lost in a [refactoring tunnel](https://speakerdeck.com/csswizardry/refactoring-css-without-losing-your-mind).

Restart. Step one: write components with existing markup. Step two: improve modularity once my site is rendering (still to do as of writing this).

![Example code for my React components](/images/blog/2017/dbushell-react-components.png)

All my [React components](https://github.com/dbushell/dbushell.com/tree/master/src/components) are functional/stateless. There is no logic to them because I'm don't plan to render client-side. I don't need to worry about an API serving data to the browser. My build script parse data and pass it along to React properties once to render HTML.

Some components — e.g. the [Bio](https://github.com/dbushell/dbushell.com/tree/master/src/components/bio)[graphy] — load default props from a JSON file. Lazier components have data hardcoded in the HTML ([Newletter](https://github.com/dbushell/dbushell.com/blob/master/src/components/newsletter/index.jsx) for example). When I get time I'll do a proper job abstracting these. It's not an urgent task because I doubt I'll ever need more than one instance.

![dbushell.com build process data flow](/images/blog/2017/dbushell-react-dataflow.svg)

The [Blog](https://github.com/dbushell/dbushell.com/tree/master/src/components/blog) component is an interesting one. It displays recent posts and appears on all pages. It too loads JSON. I have a task to update this file before rendering (rather than passing new props from the parent). The reason for that is incidental, but it does allow pages to render with up-to-date content without parsing all of the blog data again.

I'm storing page content like blog articles as Markdown with YML front matter. A result of exporting WordPress to a format Metalsmith liked. This has proven good enough and I see no reason to change.

An improvement I've made is to render syntax highlighting rather than doing it in the browser. I'm using [Marked](https://github.com/chjj/marked) and [Prism](http://prismjs.com/) for that. Components receive HTML content as a property and use the aptly named [dangerouslySetInnerHTML](https://facebook.github.io/react/docs/dom-elements.html#dangerouslysetinnerhtml).

```javascript
marked.setOptions({
  smartypants: true,
  langPrefix: 'language-',
  highlight: (code, lang) => Prism.highlight(code, Prism.languages[lang])
});

/**
 * Reduced example from a React component. The `html` prop has been
 * passed through Marked with Prism.
 */
render() {
  const html = () => {
    return {__html: props.html};
  };
  return (
    <div className="post" dangerouslySetInnerHTML={html()}/>
  );
}
```

This seems like an acceptable solution. I see no reason to convert the inner content to React elements only to render back to HTML immediately.

I render everything inside the body tag with React. I'm using Handlebars to glue together the final page. This allows me to inline CSS with header/footer partials. It's simpler and less fussy about formatting. For the same reason I'm also using Handlebars to build my RSS and Sitemap XML files. This avoid any workarounds for namespaced attributes.

## Hello GitHub Pages

I've been hosting personal websites on a VPS for a long time. The VPS was useful, if not a bit overkill, for WordPress hosting. I first bought it to experiment with Node services, NGINX, and Varnish caching. More recently — in fact for almost two years now — it was doing nothing but hosting static files.

Time to be frugal. Why pay VPS prices when GitHub Pages is free?

For convenience my website exists within two repositories. The [source code](https://github.com/dbushell/dbushell.com) and the [static build](https://github.com/dbushell/dbushell.github.io). I have the latter repo cloned as a directory within the former (but ignored by Git). This way when I run my build task the static build repo is the destination.

In regards to performance, GitHub Pages does a decent job. There's some caching and CDN stuff I need to sort out at some point.

## Up Next

Now that I've rebuilt my website from stratch and it's indistinguishable from itself prior to doing this work, I plan to:

* Refactor modularity and trim down CSS
* Consider going isomorphic/universal (unlikely)
* Return to my regular blogging schedule

By the way, if you're reviewing my build scripts and thinking _"what in the world..."_ — you're not alone! I've had some fun for the sake learning new JavaScript features (async/await in particular). Just know that this is not code I'd deliver to a client!
