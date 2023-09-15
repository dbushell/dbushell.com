---
date: 2013-01-15 22:37:41+00:00
excerpt: None
slug: re-jquery-animation-vs-css
template: single.html
title: 'Re: jQuery Animation vs CSS'
---

In response to my **Smashing Magazine** article on [implementing off-canvas navigation](http://coding.smashingmagazine.com/2013/01/15/off-canvas-navigation-for-responsive-website/) I received a great [comment by Michael Benin](http://coding.smashingmagazine.com/2013/01/15/off-canvas-navigation-for-responsive-website/#comment-628183):

>[https://github.com/benbarnett/jQuery-Animate-Enhanced](https://github.com/benbarnett/jQuery-Animate-Enhanced)
>
> [https://github.com/gnarf37/jquery-requestAnimationFrame](https://github.com/gnarf37/jquery-requestAnimationFrame)
>
> Dropping in these two plugins should achieve what is accomplished in this article using CSS, and furthermore will utilize RAF. It would be interesting for you to run the same tests against JS/jQuery with these jQuery plugins.

I agreed that these plugins would speed up my [jQuery demo](https://dbushell.github.com/Responsive-Off-Canvas-Menu/step3-jquery.html) but they would never overtake the speed of my [CSS demo](https://dbushell.github.com/Responsive-Off-Canvas-Menu/step4.html) — and that's ignoring the extra overhead and complexity.

The proof is in testing so let's see both in action:

## jQuery Animate Enhanced

[jquery.animate-enhanced](https://github.com/benbarnett/jQuery-Animate-Enhanced) detects CSS transitions and automatically converts your jQuery animation. Basically in theory it's an invisible plug-and-play deal; a quick win. In practice the animation performance is obviously improved, but there are a few issues:

![jQuery Enhanced DOM](/images/blog/2013/jquery-enhanced-html.png)

1. Like my [jQuery demo](https://dbushell.github.com/Responsive-Off-Canvas-Menu/step3-jquery.html) inline styles are left over in the DOM.
2. Likewise, styles are defined within a JavaScript file away from our main CSS.
3. This particular plugin has a [bug](https://github.com/benbarnett/jQuery-Animate-Enhanced/issues/102) — or lacks support — for percentages. That means I have to calculate `$('#nav').width()` on the fly.
4. It causes animation flickering for the reasons highlighted at the end of [my article](http://coding.smashingmagazine.com/2013/01/15/off-canvas-navigation-for-responsive-website/).

**[jQuery Enhanced Demo](https://dbushell.github.com/Responsive-Off-Canvas-Menu/extras/step3-jquery-enhanced.html)**

Issues aside, this plugin basically achieves something close to my final demo (and in fairness, the last two issues could be fixed). However, for the price of jQuery and a plugin — and the first two issues — it's ultimately needless complexity. Do consider this plugin though if you want to retro-fit existing builds.

### jQuery Enhanced timeline

![jQuery Enhanced demo timeline](/images/blog/2013/extras-jquery-enhanced.png)

### timeline for my final demo

![CSS timeline](/images/blog/2013/extras-css.png)

## jQuery requestAnimationFrame

jQuery animation uses a sequence of timeouts to trigger each frame. These timeouts are completely ignorant of the browser's ability to actually render changes in a timely manner. Modern browsers implement [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/DOM/window.requestAnimationFrame) which is far more intelligent.

**[jQuery requestAnimationFrame Demo](https://dbushell.github.com/Responsive-Off-Canvas-Menu/extras/step3-jquery-animation-frame.html)**

Testing this on my Galaxy Nexus shows no noticeable improvement over the basic [jQuery demo](https://dbushell.github.com/Responsive-Off-Canvas-Menu/step3-jquery.html). Animation is still very slow and stuttering.

### jQuery animate timeline

![jQuery animate timeline](/images/blog/2013/extras-jquery.png)

### jQuery requestAnimationFrame timeline

![jQuery requestAnimationFrame demo timeline](/images/blog/2013/extras-jquery-animation-frame.png)

The problem is that regardless of the benefits of requestAnimationFrame, we're still iterating rapidly over an inline style property and the browser just isn't fast enough to calculate the reflow. At the end of the day, you really don't want to be manipulation DOM elements at such speed. requestAnimationFrame is very useful for the likes of canvas animation, but not here.

## Final Thoughts

In case you're wondering, we can't combine _both_ plugins because as soon as CSS transitions are used there is no frame management done by JavaScript.

Finally, my solution keeps all style declarations within one stylesheet — maintainability is a big bonus. Very minimal JavaScript is required to interpret interaction and toggle state classes. Keep it simple — you can rarely improve performance by throwing more JavaScript at it!
