---
date: 2013-03-18 10:46:01+00:00
excerpt: None
slug: the-flat-build
template: single.html
title: The Flat Build
---

The flat build is the process of coding a static website in HTML & CSS without worrying about complete functionality or CMS integration. UI prototypes, responsive design layouts, or even the initial stages of final front-end development.

It's becoming increasingly apparent that merging the design and dev process in an iterative workflow is key to a successful web project.

Getting to the browser sooner — where changes are fast but welcome — makes the flat build an obvious bottleneck to progress. The most apparent issue is shared code. The global elements used across multiple pages. Design and structure is going to change and manually updating flat build files is tedious and prone to fragmentation.

## The old way

it used to be the only time I'd do a flat build was post-design. I'd use PHP includes because CMS integration was the main task at hand; the end game.

````php
<?php include 'header.php'; ?>
````

I was coding up PSDs. My only concern was when to introduce CMS template constructs. Too soon and HTML becomes messy to refactor. Too late and time is wasted with repetitive placeholders. Design was not suppose to change and I consider that a real pain in the arse when it inevitably did.

Now that flat builds are introduced as soon as possible I could continue to use PHP. By definition it's a HTML preprocessor, isn't that exactly what I need? My issue is that PHP will always be required to view the build. I want to compile plain HTML I can view in the browser anywhere I go and quickly chop up when it comes to development (I always build a style guide/pattern library alongside my templates). Running a full stack on my laptop or requiring server deployment is too unwieldy at this stage.

Includes are also not the only requirement for productive flat builds to evolve throughout the project. Asset management can also be a big bottleneck.

## The apps

I'm not surprised we're seeing trendy apps appear to solve this problem. [Hammer](http://hammerformac.com/), [Mixture](http://mixture.io/), and [CodeKit](http://incident57.com/codekit/) all give it a good go. My first recommendation to anyone looking to improve their flat build process would be to trial these apps. An attractive UI tends to be quickly accessible with a small learning curve.

![](/images/blog/2013/hammer-for-mac.png)

For me — and this may be entirely my own flaw — none of these apps quite fit the bill. Because they're "one size fits all" solutions it's difficult to work around them if you have additional requirements. For example, I have SVG assets I want to automatically rasterise as PNG fallbacks.

## Building your own

I like total control and flexibility. I roll my own [automated Grunt tasks](/2013/03/12/automation/) to achieve what these apps do (and more).

The barrier to entry here is extremely high. I can't deny there's a hell of a lot to learn just to understand how all of the pieces work. I know a lot of people don't like this complexity. I agree to some extent with the arguments against but you do have to consider what knowledge is actually a prerequisite.

As long as you're not introducing more work than you're going to save — which is the whole point — I'm all for choosing the tools that suit you and your team. Personally, things like CoffeeScript and HTML abstractions are a step too far for me. I can't however deny other people find them more productive. If I'm not working independently on a project it'd be ignorant of me to default to this Grunt set up. That's the important decision.

💤 _(For some reason — maybe it is irrational — I have a deep hatred for CoffeeScript but ranting here would totally default my own points so I'll hold my tongue!)_

## Missing pieces

Naturally the inclination to do it yourself results in a half-baked solution. My Grunt set up is missing a HTML preprocessor, which if you remember is 50% of this article.

I decided to build my own from scratch. I know, I know, I do actually have a client website I need to build but I figured I'd take some 20% time for personal development. This was primarily a bit of fun to learn more Node (grunt tasks already exists that could achieve this [grunt-preprocess](https://github.com/onehealth/grunt-preprocess/), [grunt-includes](https://github.com/vanetix/grunt-includes), [grunt-replace](https://github.com/outaTiME/grunt-replace)).

It follows Hammer's include syntax:

````markup
<!-- @include _header.html -->
<main role="main">
    <p>Hello World!</p>
</main>
<!-- @include _footer.html -->
````

It can perform multiple passes (to find includes within includes). Includes are matched via name first or path second if you specify a directory:

````markup
<!-- @include blog/_header.html -->
````

Which is quite cool to allow for namespacing.

Feel free to poke around the [code in this gist](https://gist.github.com/dbushell/5186122). It's not an actual project repo yet because it's missing vital features like relative asset/anchor URLs. Manual management of those is even more painful than basic includes.

## Perspective

For me, mastering the flat build process is as much an opportunity to experiment as it is about actually increasing productivity.

By developing my own solution I'm starting to unearth a whole new batch of potential time savers. It's allowed me to closely inspect my build process and how it integrates with design and I have some interesting ideas I want to play with — more on that later!

You might decide to use an app or a task automator like me. I'd been very intrigued if you still prefer to use no tools at all aside from a text editor. Whatever you do, please write about your techniques are requirements.

## Updates

[Middleman](http://middlemanapp.com/) and [Yeoman](http://yeoman.io/) have been mentioned (thanks [@mattberridge](http://twitter.com/mattberridge) and [@patrickhamann](http://twitter.com/patrickhamann)). And of course full-on static site generators like [Jekyll](https://github.com/mojombo/jekyllJekyll) may serve both development and deployment purposes.

[Read: The Flat Build (2)](/2013/04/05/the-flat-build-2/)
