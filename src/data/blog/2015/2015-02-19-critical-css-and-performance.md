---
date: 2015-02-19 16:58:05+00:00
excerpt: None
slug: critical-css-and-performance
template: single.html
title: Critical CSS and Performance
---

[I built my website](/2014/04/24/two-week-build/) last year with a strong focus on **front-end performance**.

This week inspired by Scott Jehl's article ["How we make RWD sites load fast as heck"](http://www.filamentgroup.com/lab/performance-rwd.html) and Callum Hart's ["Non-blocking UI's with interface previews"](http://www.callumhart.com/blog/non-blocking-uis-with-interface-previews) I decided to revisit my code and give it another boost. The trick to getting content on screen faster is removing [render-blocking CSS](https://developers.google.com/speed/docs/insights/OptimizeCSSDelivery). When the browser sees a stylesheet —

````markup
<link rel="stylesheet" href="style.css">
````

— it will not render further until it's downloaded.

By inlining critical CSS the browser can start to render immediately while the rest is downloaded asynchronously. What is critical CSS? Anything [above the fold](http://iamthefold.com/) apparently. [PageSpeed Insights](http://developers.google.com/speed/pagespeed/insights/) is a useful tool. My original stylesheet was only 35KB so I was skeptical that I'd see any improvements. Nevertheless, I manually extracted 10KB of typographic and layout styles to inline.

My page `<head>` now looks something like this:

````markup
<noscript><link rel="stylesheet" href="combined.css"></noscript>
<style> /* 10KB of inline CSS */ </style>
<script> /* ... */ loadCSS('style.css'); </script>
````

* `<noscript>` as a fallback to provide the original stylesheet
* 10KB of inline CSS that can be rendered straight away
* JavaScript to asynchronously download more (see [loadCSS](https://github.com/filamentgroup/loadCSS) by Filament Group)

## The Results

To see if this technique improves 'time to visible content', I’m using [Chrome’s device emulator](https://developer.chrome.com/devtools/docs/device-mode) to throttle the network speed to its slowest setting: GPRS (50Kbps 500ms RTT), equivalent to an awful 2G signal.

In relatable numbers that’s a download speed of 6.25KB/s. Therefore my homepage, weighing in at 220KB, will take at least 35 seconds to download at this speed (not accounting for latency).

In [the video below](https://vimeo.com/119967106) you can see my site download before and after optimisation.

<p class="b-post__image"><span class="b-fitvid" style="padding-top:56.25%"><iframe src="https://player.vimeo.com/video/119967106?color=99cc66" frameborder="0" allowfullscreen="allowfullscreen"></iframe></span></p>

If you've been paying attention the point of this optimisation isn't to download the entire page faster, but to render content sooner. The results are impressive. Across multiple tests I've found that content is on screen **at least 6 seconds earlier** than before.

Of course, with faster networks the difference becomes less apparent. Subsequent visits can benefit from browser caching which negates the main issue, but given the nature of my blog traffic a primed cache isn't common.

I'm rather happy with that!

There's still work to do though. I get the sense that some of the later assets are tripping over themselves. I want to ensure that non-critical, asynchronous CSS is still prioritised before other resources.

Have some thoughts? Let me know [@dbushell](http://twitter.com/dbushell).
