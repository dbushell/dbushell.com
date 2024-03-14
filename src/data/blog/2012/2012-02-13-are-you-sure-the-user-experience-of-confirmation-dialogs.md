---
date: 2012-02-13 18:46:32+00:00
excerpt: None
slug: are-you-sure-the-user-experience-of-confirmation-dialogs
template: single.html
title: Are You Sure? The UX of Confirmations
---

Imagine for a minute your web app has a "Delete" action. In HTML it takes this form:

````html
<a class="delete" href="#">Delete Item</a>
````

The anchor is styled up with sexy CSS3 and functionality is implemented with an asynchronous JavaScript API call. Because we all care about accessibility (and standards) we provide a "no-JS" fallback:

````html
<a class="delete" href="/item/delete/1/">Delete Item</a>
````

Lovely! It's great to build on top of what works. "Web apps" are still _websites_, after all.

Now, I know what you're thinking, "Delete" is a big commitment! What if the user triggers the link accidentally? What if the user has been conditioned through years of UI exposure to expect a modal window explaining the ramifications, or at least asking for confirmation? We could write a little script (jQuery, naturally) to hijack any element with the class "delete" and throw up a confirmation box. Similar to this:

````javascript
$('a.delete').on('click', function(e) {
  return confirm('Are you sure?');
});
````

Replace `confirm()` with your fancy dialog of choice. The function `[window.confirm](https://developer.mozilla.org/en/DOM/window.confirm)` provides a **native** dialog implemented by the browser. More on that later!

![Browser confirm dialog in Mac OSX](/images/blog/2012/macosx-confirm1.png)

That's quite nice but searching the whole DOM for links is fairly intensive. There will also be the initial delay of execution while we wait for the `DOMContentLoaded` event. Users will quick trigger fingers will be able to click "Delete" and see no confirmation request. We also have the issue of microcopy hardcoded in our script (not the best place for it). We could mess around with additional `data-*` attributes but I have a better idea...

````html
<a class="delete" href="/message/delete/1/"
   onclick="return confirm('Are you sure?')">Delete Item</a>
````

Boom! No dependancies, no need to worry about fast fingers, and browser support dates back to **Netscape**. ([Event handler attributes](http://www.w3.org/TR/html5/webappapis.html#event-handler-attributes) like `onclick` are still a big part of HTML5, in case you were wondering.)

This is perfect for our needs but as you've probably noticed the native confirm dialogs are ugly as hell. On mobile devices (see Android 4.0 and iOS below) the dialogs look slightly better in my opinion. More importantly though, **they work!** Have you ever tried building a custom modal dialog for mobile browsers? Good luck with that!

![Browser confirm dialog on Android 4.0 and iOS](/images/blog/2012/mobile-confirm.png)

**Going native on mobile is undoubtedly the best experience**. Even native mobile apps use native dialogs. Don't even think about trying to implemented fixed positioning in a mobile web browser it will have you in tears (trust me). The question is: how do we go native on mobile, but provide a custom dialog design for desktop browsers like Chrome, while still gaining the benefits of inline event handlers? Check out the one I designed (based on TJ Holowaychuk's [UIKit](http://visionmedia.github.com/uikit/)):

![Custom confirmation dialog](/images/blog/2012/custom-confirm.png)

To provide both native and custom dialogs through `confirm()` we need to override the function.

Our problem is that the native dialog hangs the browser action in a way that we cannot. Any override we create for `window.confirm` must `return false` and then act asynchronously on later events. How can we do this when only a string is passed to the function?

The `onclick` attribute basically creates an event handler like this:

````javascript
function(event) {
  return confirm('Are you sure?');
}
````

Note the `event` parameter. We need to access this object (a [MouseEvent](https://developer.mozilla.org/en/DOM/MouseEvent)) to obtain the original target element and go from there. We could pass it through like this:

````javascript
<a onclick="return confirm('Are you sure?', event)">
````

The native version of `confirm` will ignore the second argument (JavaScript isn't fussy). But that's not very clean, and there is a better way! When we redefine `confirm` we can actually access this event object.

````javascript
window.nativeConfirm = window.confirm;
window.confirm = function(message) {
  var event = window.event || window.confirm.caller.arguments[0];
  // ...
};
````

First we check the `window` object, old Internet Explorer will find an event chillin' there. Other browsers can access the function's caller. If no event exists we just return `window.nativeConfirm(message);` and be done with it. If the event does exist — and we've established that the user experience will be improved with non-native dialogs — we get the target element, read the `href` attribute, pop open a custom dialog with a callback that redirects on success, and `return false` to cancel the default `onclick` action.

My final implementation with extended functionality looks a little something like this:

````html
<a onclick="return confirm('Are you sure?')" href="/action/">Delete Item</a>
````

````javascript
window.nativeConfirm = window.confirm;
window.confirm = function(message, event, callback)
{
  // grab the event and target element (if they exist)
  var e = event || window.event || window.confirm.caller.arguments[0];
  var el = e.target || e.srcElement;

  // go native if preferred, or no event/element
  if (useNativeConfirm() || !e || !el) {
    return window.nativeConfirm(message);
  }

  // open custom dialog with callback function
  fancyConfirm(message, function(result) {
    if (result && el && el['href']) {
      window.location.href = el['href'];
    }
    if (typeof callback === 'function') {
      callback(result);
    }
  });

  // cancel onclick action
  return false;
};
````

By including `useNativeConfirm()` we can do some feature detection and browser investigation to determine what type of dialog to display. **For mobile browsers this is essential.** I'm still thinking about the best way to make this decision but a [Modernizr media query test](http://www.modernizr.com/docs/#mq) for small screens is a good start.

To recap the benefits of this technique:

* Allows for native confirmation dialogs that are immediately present and supported by all browsers with no dependancies.
* Is easily implemented within the HTML.
* Has the ability to provide more attractive dialogs for browsers that can handle them while retaining native dialog use elsewhere (i.e. small screen/mobile).

I'll whip up an example soon. Any thoughts?

Even if you don't like the idea of redefining `window.confirm` or using event handler attributes, I'd still recommend avoiding custom dialogs on mobile devices.
