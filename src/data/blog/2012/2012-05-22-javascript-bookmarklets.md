---
date: 2012-05-22 08:10:16+00:00
excerpt: None
slug: javascript-bookmarklets
template: single.html
title: JavaScript Bookmarklets
---

I love a good [JavaScript bookmarklet](http://en.wikipedia.org/wiki/Bookmarklet).

They're [fun to play with](/2012/05/15/pageshift-removing-the-refresh/) and a great way to hack around on a live website with new code _without_ affecting anyone else's experience. They can also become part of your service; think [Readability's 'Read Now'](http://www.readability.com/bookmarklets) or [Pinterest's 'Pin it!'](http://pinterest.com).

A bookmarklet begins with the following shell:

````javascript
javascript:(function(){
    // code...
}());
````

Here we're enclosing a [self-invoking function](http://sarfraznawaz.wordpress.com/2012/01/26/javascript-self-invoking-functions/) within a basic [URI scheme](http://en.wikipedia.org/wiki/URI_scheme) that all browsers understand. When a user clicks the bookmark the browser sees the `javascript:` prefix and executes the code on the current page.

Remember that **jQuery might not be available**. Bookmarklets should be designed to run on any website (or as many as possible), so don't use jQuery in the actual bookmarklet code. I'd suggest using this as an opportunity to learn actual JavaScript rather than relying on libraries and plugins. Either way, you'll need to load in your own external stylesheets and scripts:

````javascript
var script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('charset', 'UTF-8');
script.setAttribute('src', 'http://code.jquery.com/jquery-1.7.2.min.js');
document.documentElement.appendChild(script);
````

The `charset` attribute is important to avoid encoding issues. If you _are_ loading jQuery, wrap it in this to avoid duplication:

````javascript
if (!window.jQuery) {
    // load script...
}
````

If you're sending a query string to `script.js` with page information make sure to use `encodeURIComponent` like so:

````javascript
script.setAttribute('src', 'http://example.com/script.js?r=' + Math.random() + '&title=' + encodeURIComponent(document.title));
````

Another useful trick is to append a random number to the `script.js` URL ensuring — to some extent — that the browser does not load an older version from its cache.

In the event that you need to preload injected scripts, use this pattern:

````javascript
el.onload = el.onreadystatechange = function () {
    var rs = script.readyState;
    if (!rs || rs === 'loaded' || rs === 'complete') {
        script.onload = script.onreadystatechange = null;
        // on load code...
    }
};
````

This situation may occur if you've written a script for normal usage that requires an `init()` function to be called when the document has loaded. You can then do `myNamespace.init()` on load instead of writing a duplicate script that executes immediately. Using both the `onload` and `onreadystatechange` events ensures legacy cross-browser compatibility.

Injecting CSS stylesheets is done in a similar way.

It's best practice to keep your bookmarklet small. I'm pretty sure browsers don't like users bookmarking 10,000 lines of code, but more importantly it has to be updated manually by each user. By loading external files we can make changes easily. However, once someone has installed the bookmarklet you need a way to inform them of major updates. If you don't implement this from the start there is no going back without simply breaking their experience.

Our final bookmarklet boilerplate:

````javascript
javascript:(function(){

// avoid the bookmarklet activating more than once
if (window.MyNamespace) {
    return;
}
window.MyNamespace = { };

var version = 1,
    script  = document.createElement('script');

script.setAttribute('type', 'text/javascript');
script.setAttribute('charset', 'UTF-8');
script.setAttribute('src', 'http://example.com/script.js?r=' + Math.random());
document.documentElement.appendChild(script);

script.onload = script.onreadystatechange = function() {
    var rs = script.readyState;
    if (!rs || rs === 'loaded' || rs === 'complete') {
        script.onload = script.onreadystatechange = null;

        // initialise or warn if older version
        if (version !== window.MyNamespace.version) {
            alert('This bookmarklet is out of date!');
        } else {
            window.MyNamespace.init();
        }
    }
};

}());
````

You could even change the alert message to `window.MyNamespace.bookmarkletUpdate();` for ultimate flexibility. Maybe throw up an "Update Bookmarklet" overlay?

And that's it! Now the whole Web is yours to mess with.
