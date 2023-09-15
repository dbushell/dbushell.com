---
date: 2014-07-09 12:03:42+00:00
excerpt: None
slug: how-i-built-a-static-site-generator
template: single.html
title: How I built a Static Site Generator
---

<div class="b-boxed b-boxed--dark u-dark">
  <h3>NEW: <a href="/2017/02/13/react-as-a-static-site-generator/">React as a Static Site Generator</a></h3>
  <p>I now used React! See my new approach above.</p>
</div>

I used to build websites with nothing but a text editor.

Now I have an [army of tools](/2014/06/10/dependency-overload/) at my finger tips. When I began to establish [my Grunt tasks](/2013/04/30/origin/) I wanted something basic for HTML. My biggest gripe was *repetition*. The simple concept of "includes" was all I wanted.

At the time static site generators and templating scared me (still does, in fact). What I wanted was so minimal I was hesitant to invest time into a large set-up. Looking around for options, I liked the way [Hammer for Mac](http://hammerformac.com/docs/tags) implemented tags:

````markup
<!-- @include _header.html -->
````

That looked neat, so as a Friday afternoon project I wrote a cheap and cheerful Grunt task called ["htmlizr"](https://github.com/dbushell/dbushell-Origin/blob/d4d38b2893b372c7620bcc5fd75a649a89766a00/tasks/htmlizr.js) to achieve a similar effect. I've been using that for almost a year now, stitching together websites big and small.

There's been two additions I've felt the need for:


* The ability to repeat HTML includes with varying data
* The ability to toggle HTML classes based on context


**Variety:** if a page lists user profiles, for example, I'd include the same pattern multiple times. Variety here would look more realistic and test the integrity of the design.

**Context:** the most common example would be a way to highlight the current page in the main navigation (a single include).

## Inspiration & Inception

It was Brad Frost's article on ["Designing with Dynamic Content"](http://bradfrostweb.com/blog/post/designing-with-dynamic-content/) that finally pushed me to employ a more robust tool. While his project [Pattern Lab](http://patternlab.io/) does more than I want, its use of [Mustache](http://mustache.github.io/) templates looked perfect.

A quick search found [this Grunt plugin](https://github.com/haio/grunt-mustache-html) by Zhong Yu which compiles Mustache templates with global and template-specific data.

To understand exactly how it worked I rewrote the task line-for-line. It was an excellent starting point. I've since adapted the plugin to incorporate my personal preferences and a few experimental features.

Checkout **[dbushell-grunt-Mustatic](https://github.com/dbushell/dbushell-grunt-mustatic)** on GitHub.

💤 I've prefixed the name with `dbushell-` to indicate it's still very much a work in progress. It's likely to follow an unpredictable roadmap. All code is under the MIT license!

### How does it work?

My `templates` directory follows this structure:

````
templates/
  +-- base.html
  +-- base.json
  |
  +-- pages/
  |     +-- index.html
  |     +-- index.json
  |
  +-- partials/
        +-- header.html
        +-- footer.html
        +-- nav.html

````

A minimal `base.html` would look like this:

````markup
<!DOCTYPE html>
<html lang="{{lang}}">
<head>
    <meta charset="{{charset}}">
    <title>{{title}}</title>
</head>
<body>
{{>content}}
</body>
</html>
````

The three variables: `lang`, `charset`, and `title`, can be first defined in `base.json`. The `title` variable can then be overridden in the template-specific `index.json`.

This solves my requirement for includes (or "partials") with varying data, but what about context changes? Mustache is a logic-less templating language. It's the responsibility of the controller to change data based on context.

Let's say my `base.json` defines navigation like so:

````javascript
"nav": {
    "items": [
        { "name": "Home", "url": "index.html" },
        { "name": "About", "url": "about.html" },
        { "name": "Design", "url": "services/design.html" }
    ]
}
````

My navigation partial might look like this:

````markup
{{#nav}}
<nav role="navigation">
    {{#items}}
    <a class="{{class}}" href="{{url}}">{{name}}</a>
    {{/items}}
</nav>
{{/nav}}
````

Notice the additional `class` variable that is not defined in our data. This can be added automatically as each page is rendered. If the `url` matches the current page; add an "active" HTML class. I've written a *pre-render* function to address this scenario.

More context awareness is required for URLs. When the navigation partial is rendered within the services page a link to `index.html` should actually be `../index.html` because it's a level deeper than the homepage.

One solution might be to write *absolute* URLs. Simply prefixing with `/` would allow URLs to resolve properly on any domain at root level, but not locally from `file://`. My solution was to write a *post-render* function that converts all relative URLs based on template depth. This assumes all URLs are written relative to root level (like those in my navigation example).

## Reinventing the Wheel

Now at this point I realise I'm well on the way to building my own static-site generator (of which [myriad already exist](http://www.staticgen.com/)). I suppose you could say [my Grunt tasks](https://github.com/dbushell/dbushell-Origin) as a whole are exactly that. A DIY solution that's more flexible and interchangeable.

It's entirely possible I could have invested this time to learn an existing tool, but where's the fun? It's nice to have personal projects that result in practical uses.

At the end of the day I'm not forcing these dependencies upon my clients. They want the output — the rendered HTML, CSS, and JavaScript. Even if they need CMS templates in another language I often find it quicker to build a flat website first anyway. How I get there is a matter of personal taste.

For front-end development I find it rewarding to utilise, develop, and combine small solutions that do just enough and nothing more. As oppose to an all-in-one solution. They often become a brick wall when minor preferences or requirements can't be addressed.

What do you use? [Send me a Tweet!](http://twitter.com/dbushell)
