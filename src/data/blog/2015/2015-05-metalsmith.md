---
date: 2015-05-11 10:00:00+00:00
draft: false
slug: wordpress-to-metalsmith
template: single.html
title: WordPress to Metalsmith
---

<div class="b-boxed b-boxed--dark u-dark">
  <h3>NEW: <a href="/2017/02/13/react-as-a-static-site-generator/">React as a Static Site Generator</a></h3>
  <p>I now used React instead of Metalsmith. See my new approach above!</p>
</div>

It’s a busy work schedule that is usually to blame for my lack of written output on this blog. That was not the case last month!

## Downtime

As you may have noticed, my website has been going offline frequently. Not good. After several failed attempts to fix the — admittedly self-inflicted — issue I decided a full nuking of my VPS was the only solution.

I use [MAMP](http://MAMP.info) for local WordPress / PHP development. That is where I “backed up” my WordPress install. Before hitting the button of no return I had the foresight to create a static copy of my website using Wget, a technique I’ve used before to [preserve old websites](/2012/03/20/preserving-the-web/). The day was getting late by the time the new server was configured. I uploaded the static copy and made a task to re-install WordPress later that week.

That was the plan until I saw the state of the database. At almost seven years old, and seeing as many redesigns in that time, it had grown into a 60MB behemoth.

A good opportunity to try something new, don’t you think?

## Metalsmith

Last summer I wrote my own Node script for a basic [Mustache](http://mustache.github.io/) templating engine (see: [How I built a Static Site Generator](/2014/07/09/how-i-built-a-static-site-generator/)). This was a fun project and has proven useful in many of my front-end dev jobs. It’s not really a static site generator though. Suitable only for a handful of templates and placeholder content.

![Metalsmith](/images/blog/2015/metalsmith.png)

I considered using [Jekyll](http://jekyllrb.com) to rebuild my site but I was keen to keep my [Grunt workflow](https://github.com/dbushell/dbushell-Origin) for assets. That’s when I remembered [Metalsmith](http://www.metalsmith.io/):

> An extremely simple, pluggable static site generator.

Metalsmith reads files from a directory, passes them through a chain of plugins, and outputs a build. Best of all, it’s all JavaScript / Node.

The first step was to prepare my content.

## Markdown

WordPress can export content as XML. Which is nice but XML hasn’t been “cool” for a long time. After some trial and error I found [Exitwp](https://github.com/thomasf/exitwp) by Thomas Frössman. Exitwp is a Python script that converts WordPress XML to [Markdown](http://daringfireball.net/projects/markdown/) files with a YAML header. The format of choice for static site generators.

I had to modify the script several times to get the output I wanted. A tedious task for one not fond of, or indeed familiar with, Python. Following a final hour of manual editing, I had a directory of **254 articles** in Markdown format.

![dbushell.com articles in markdown files](/images/blog/2015/metalsmith-markdown.png)

## Handlebars Templates

With content ready, step two was to convert my WordPress theme to [Handlebars](http://handlebarsjs.com/). I’d already written a basic Mustache version of my templates so this didn’t take long. I did need to write several helper functions to replicate WordPress functionality.

A basic example uses [Moment.js](http://momentjs.com/) to format dates:

```javascript
Handlebars.registerHelper('moment', function(date, format) {
  return Moment(date).format(format);
});
```

Using this in templates I can write:

```javascript
{{ moment date 'dddd DD MM YYYY' }}
```

— `date` references the YAML metadata heading the relevant Markdown file. Which itself remains in ISO date format (e.g. <code>2015-03-18 10:50:59+00:00</code>).

### Excerpts

I wrote an excerpt helper for my [blog index](/blog/) similar to the WordPress function. This outputs up to 55 words of content without formatting.

```javascript
Handlebars.registerHelper('excerpt', function(contents) {
  if (typeof contents !== 'string') return '';
  var text = striptags(contents),
    words = text.split(' ');
  if (words.length >= 55) {
    text = words.slice(0, 55).join(' ') + ' [&hellip;]';
  }
  return new Handlebars.SafeString('<p>' + text + '</p>');
});
```

I prefer to configure Handlebars myself but an alternate approach would be to use the [Metalsmith excerpts plugin](https://github.com/segmentio/metalsmith-excerpts). This dynamically adds excerpt metadata prior to templating so `{{ this.excerpt }}` is available — whereas my approach requires `{{ excerpt this.contents }}`

I could also manually write excerpts in my Markdown content if I really cared, but who reads excerpts? I’d wager most of my blog readers hit the article page directly via social media or search. An auto-generated excerpt works just fine for me.

## Sitemap

With content and templates in place my website could be built once again. I checked a couple of file diffs with my local WordPress install to ensure both were generating effectively the same HTML.

Now all that was missing was an XML sitemap. To generate this I wrote a Metalsmith plugin inspired by ExtraHop’s [metalsmith-sitemap](https://github.com/ExtraHop/metalsmith-sitemap). A simple solution that uses Handlebars to populate XML templates:

```markup
<url>
  <loc>{{loc}}</loc>{{#if lastmod}}
  <lastmod>{{lastmod}}</lastmod>{{/if}}{{#if changefreq}}
  <changefreq>{{changefreq}}</changefreq>{{/if}}{{#if priority}}
  <priority>{{priority}}</priority>{{/if}}
</url>
```

The entries are compiled into a single `sitemap.xml` file which is added to the Metalsmith files list. This in theory would then flow through the other Metalsmith plugins, if the sitemap plugin wasn’t the last one.

## The Final Build

My final Metalsmith plugin order runs as following:

- [metalsmith-**drafts**](https://github.com/segmentio/metalsmith-drafts)

* remove markdown files marked as draft

- _dbushell-metalsmith-**markup**_

* clean up intermediate code due to imperfect WordPress conversion

- [metalsmith-**markdown**](https://github.com/segmentio/metalsmith-markdown)

* convert Markdown content to HTML

- [metalsmith-**collections**](https://github.com/segmentio/metalsmith-collections)

* create two group for all blog posts and “From the Blog…” list

- [metalsmith-**pagination**](https://github.com/blakeembrey/metalsmith-pagination)

* generate pages for my [blog index](/blog/)

- [metalsmith-**permalinks**](https://github.com/segmentio/metalsmith-permalinks)

* combined with [metalsmith-branch](https://github.com/ericgj/metalsmith-branch)

- _dbushell-metalsmith-**sitemap**_

As you can see, I’m not using Metalsmith to process any assets. I have an existing [Grunt workflow](https://github.com/dbushell/dbushell-Origin) to handle them. I’ve [uploaded my website source](https://github.com/dbushell/dbushell-com) to Github for anyone interested. Both Metalsmith and Grunt build tasks have been combined.

There’s still a little work to do for deployment, but if you’re reading this article, I’ve got things running smoothly enough!

There are plenty of Grunt plugins out there that could recreate what I’ve done with Metalsmith but I do like its focus as <q>an extremely simple, pluggable static site generator</q>. It does that very well.

Now that I’m writing in Markdown format I get to use the lovely [IA Writer Pro](https://ia.net/writer/mac).
