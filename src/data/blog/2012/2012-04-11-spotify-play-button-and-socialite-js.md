---
date: 2012-04-11 13:23:35+00:00
excerpt: None
slug: spotify-play-button-and-socialite-js
template: single.html
title: Spotify & Socialite.js
---

**Spotify** have just released their [Spotify Play Button](https://developer.spotify.com/technologies/spotify-play-button/) allowing you to embed any song or playlist on your website or blog. It's awesome, but it also comes at a cost.

The whole include (which uses an iframe) weights in at close to **500kb** and uses upwards of **30 http requests** alone. Chunky! Chunkier than many web pages.

Using this embedded play button is going to slow down your whole website if implemented poorly. Combine it with other social network goodies from Facebook et al and you're presenting a _very_ long loading experience to your users. That's not good. Speed — or the perception thereof — is massively important. Imagine trying to load a website over a 3G network when half a megabyte of Facebook like button is shipped to your device before anything else. Awful! Yet most websites are still developed this way.

## Asynchronous Loading

This is where asynchronous loading comes into play. Websites should defer the loading on non-critical elements (like sharing buttons and rich media) until the main content has been downloaded and initially rendered. Not a trivial task! Many social networks offer [asynchronous methods](http://css-tricks.com/thinking-async/) but they don't defer for long. I've been developing [Socialite.js](http://socialitejs.com/) for that exact reason.

## Extending Socialite.js

Today I've added the Spotify Play Button to [Socialite.js](http://socialitejs.com/). And if everything works, the link below should by now have magically transformed into a play button!

[Listen to Sexy And I Know It by LMFAO on Spotify](http://open.spotify.com/track/2EZ2KXLqs9zdRVVMMz1IsH)

The crucial thing being that all the hefty loading was done _after_ the main content. Deferring external resources isn't the only benefit of Socialite. Instead of ugly iframes and empty placeholder elements, Socialite allows for more accessible and usable defaults, such as the normal link used above:

````markup
<a href="http://open.spotify.com/track/2EZ2KXLqs9zdRVVMMz1IsH" class="socialite spotify-play" title="Listen to LMFAO!">
	Listen to "Sexy And I Know It" on Spotify
</a>
````

Additionally, with Socialite you can load new instances at any time with JavaScript making web app development a whole lot easier.

Don't bloat your website load — get asynchronous!

Help me develop [Socialite.js over at Github](https://github.com/dbushell/Socialite).
