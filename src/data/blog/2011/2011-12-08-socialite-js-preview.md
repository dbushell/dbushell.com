---
date: 2011-12-08 13:14:28+00:00
excerpt: None
slug: socialite-js-preview
template: single.html
title: Socialite.js Preview
---

You've all seen social sharing buttons. Twitter's "tweet", Facebook's "like" etc.

Here's a screenshot from a popular blog to refresh your memory:

![Social Sharing Buttons](/images/blog/2011/Screen-shot-2011-12-05-at-09.31.42.png)

They have their place on a website if used intelligently — that's a big *if*! They're difficult to design around and a nightmare for front-end development.

The *copy-and-paste* code for each button includes a default element and a `<script>`. On the `DOMContentLoaded` event the `<script>` replaces all instances of the default element with an `<iframe>` — a portal into the sharing shrine of the respective social network.

Many people paste both element and `<script>` together where the button sits on the page. This is wrong! It's best practice to move the `<script>` to document's end; before the closing `</body>` — **you only need it once**. The first script activates all button instances on the page, the second bails immediately. Neither will run until the end of the document when the event fires. No point requesting it early.

These `<script>`s and subsequent `<iframe>`s are massive! They request a boat load of resources that get mixed in with everything else still trying to load. Not good at all.

Here are the issues with sharing buttons:

* Their activation scripts run on the `DOMContentLoaded` and download a mass of resources.
* They all have different defaults, most of which are inaccessible and empty elements.
* It's not easy to implement multiple instances and very difficult to activate new buttons after load.

I've had enough!

I've been developing a website that runs head first into all of this nonsense. It's a responsive design that only displays global sharing buttons on larger screens. Simply hiding them with CSS is not good enough, the browser shouldn't download them at all. I'm also loading in JSON content to display items in a modal window for easy browsing. The items are prime for sharing but activating new buttons is a real pain.

I'm fed up of seeing websites hang while these gems are downloading. That experience sucks.

I've written a solution:

## Previewing Socialite.js

[Socialite.js](http://socialitejs.com) handles the activation of sharing buttons for you. All you need to do is write the default element any way you care and then activate it with Socialite, any time you wish!

The basic implementation looks like this:

````markup
<a class="socialite twitter" href="http://twitter.com/share" data-url="http://socialitejs.com" data-via="dbushell">
Share on Twitter
</a>
````

At the end of your document include `<script src="socialite.js"></script>` and in further scripts — when you're ready — activate buttons like so:

````javascript
Socialite.load();
````

Or be more specific with a context:

````javascript
Socialite.load(document.getElementById('social-buttons'));
````

Or activate a single button directly:

````javascript
Socialite.activate(document.getElementById('like-button'), 'facebook');
````

If you're using JavaScript elsewhere (I'm guessing jQuery?) you can run `Socialite.load` at the end of your `$(document).ready()` function, or after any event. On "ready" may still start downloading button resources while your page resources are coming in. You could activate buttons on article hover like [TechCrunch](http://techcrunch.com/) (which has a very primitive implementation of what Socialite does).

The added benefit of this script is that you can provide more accessible defaults for each button. So instead of Facebook's empty `<div>`, or LinkedIn's empty `<script>`, you can have a friendly link to the alternate sharing URLs. Socialite maps all `data-*` attributes to the corresponding customisation properties each button provides (I aim to normalise that soon).

Learn more at [Socialitejs.com](http://socialitejs.com) and grab the code at [GitHub](https://github.com/dbushell/Socialite).

Socialite is still in development but the basic implementation is working so you should be safe to give it a test drive. A final "version 1" will be released soon.

Please let me know your experiences!
