---
date: 2011-12-15 00:11:13+00:00
excerpt: None
slug: web-design-2012-and-beyond
template: single.html
title: 'Web Design: 2012 and Beyond'
---

The year is ending, I guess it's time to look forward?

2011 has been the best year of my career so far. I left my previous job to join [Browser](http://www.browsercreative.com/), an unexpected but excellent move! I've been refining my front-end development skills and design process. Next year we'll have big websites to launch that I plan to showcase here. For now, a few thoughts on the future of web design.

Three ideas I suspect will be hot (or hotter) topics in the coming months:

### 1. Website Accessibility

I'm not just talking about support for varying disabilities — or the proverbial screen reader, as important as that is — I'm talking about access for _all_ users. We're seeing ever maturing practices in device-agnostic website development. Why? Because web access is hugely diverse in users, devices and browsers. A website cannot be a fixed entity ignorant of that reality. [Responsive website design](http://www.alistapart.com/articles/responsive-web-design/) exploded this year alongside the [mobile first](http://www.lukew.com/ff/entry.asp?933) strategy. If those two ideas aren't part of your process by now you're very much behind. HTML semantics were [challenged](http://coding.smashingmagazine.com/2011/11/11/our-pointless-pursuit-of-semantic-value/) and rightfully [defended](http://coding.smashingmagazine.com/2011/11/12/pursuing-semantic-value/).

Tech giants including [Microsoft](http://msdn.microsoft.com/en-us/library/windows/apps/br211386.aspx), [Adobe](http://labs.adobe.com/technologies/edge/), [Apple](http://www.apple.com/html5/) and [Facebook](https://developers.facebook.com/html5/) — all famous for their internet walled gardens — have publicly stated recognition of the web's future in HTML5. Whether their current plans favour accessibility is debatable but considering the ubiquity of the web and its standards are gaining mainstream understanding, we're seeing a demand from clients and users alike for web access that isn't restricted to one device. I've been presenting initial design mockups to clients on various devices, big and small, for over a year now and it's a brilliant experience. They just get it! They immediately start considering the user and what content is important (and not the logo size).

### 2. Screen Resolution and Scalable Graphics

Responsive design has highlighted to need for [responsive images](http://www.cloudfour.com/responsive-imgs-part-3-future-of-the-img-tag/) for multiple resolutions. The use of [web fonts](http://24ways.org/2011/displaying-icons-with-fonts-and-data-attributes) for icons has also gained popularity, though not quite with me! In my opinion **SVG** is a sleeping web standard that's going to see rejuvenation soon. This year has seen cross-browser support for SVG as a source for `img` elements and the CSS `background-image` property. Scalability is vital when we have screens ranging from 3–30 inches with pixel densities between 100–300 pixels-per-inch all accessing the same site.

If the rumours of [Apple's high res displays](http://www.macrumors.com/2011/12/14/apple-to-launch-2880x1800-resolution-retina-display-macbook-pro-in-q2-2012/) for 2012 are true — and if it's not next year or not Apple it's only a matter of time — the single resolution raster graphics used on the web today are in trouble. They're noticeably poor on high density mobile screens and that difference will only be exaggerated on the larger desktop & laptop screens we'll soon see climbing the dizzying heights of 300 PPI. CSS3 has gone a long way to provide resolution independent styles but SVG is needed for more complex icons, UI elements, logos and vector graphics elsewhere. Pixel units are a rare sight in modern web development.

### 3. Interactivity

We can safely say that fixed-width designs are a thing of the past. I'd also include static layouts as a hangover from the printed page paradigm yet they're still a staple of website design. I'm not suggesting elements should be whizzing around aimlessly but touch screen interfaces are teaching us of a new way to think about accessing content. Is the page reload a thing of the past? With the [JavaScript history object](https://developer.mozilla.org/en/DOM/Manipulating_the_browser_history) we can still maintain the fundamental integrity that URLs give the web while exploring new methods of navigation and interaction. With an inevitable surge in web apps we're in for a UI and UX treat.

* * *

From a web design perspective this raises several points to consider.

Even though interest for Wikipedia's page on [skeuomorphism](http://en.wikipedia.org/wiki/Skeuomorphism) has spiked in the designer demographic recently it may not be wise to follow Apple's native app style for web design influence. It suits single minded apps, not multifaceted websites. One device, not many.

I'm fascinated by the design [Google](http://googleblog.blogspot.com/2011/11/next-stage-in-our-redesign.html) has found new passion and respect for this year (I even replaced my iPhone with a Galaxy Nexus). Even Microsoft — _Microsoft!_ — are looking innovative in this space. Have a play with the [Windows Phone demo](http://m.microsoft.com/windowsphone/en-us/demo/index.html) (that's one for front-end devs to dissect).

Why are Google and Microsoft taking such a different direction in UI design compared to Apple? They're designing for **multiple experiences** with vast differences. That's the challenge we face on the web and they are two players we should be keeping a very close eye on. Microsoft's Metro style for example will span across a magnitude of phones and tablets, not to mention their Windows 8 desktop and TVs via the Xbox.

All of these realities require a more thoughtful approach to website development too.

Every year we see stories about the average [website size increasing](http://royal.pingdom.com/2011/11/21/web-pages-getting-bloated-here-is-why/). I have no doubt you've witnessed and contributed to that growth, I have! Content is becoming richer, constantly testing bandwidth limitations. There's no surprised well structured [CSS](http://www.netmagazine.com/news/best-css-practices-are-killing-us-111641) and efficient JavaScript (and [jQuery](http://24ways.org/2011/your-jquery-now-with-less-suck)) has been a theme lately. This is another reason why visual design must be content-focused.

On a final note: this week I released a preview of **[Socialite.js](http://socialitejs.com)** (much more useful than my banter [print stylesheet](http://printstylesheet.dbushell.com/)). Socialite.js is a tiny script that significantly defers the loading of social sharing buttons like 'Tweet', 'Like' and '+1'. There's no point going through all the effort of optimisation only to let a 'Like' button delay your entire page by seconds! Read my [preview article](/2011/12/08/socialite-js-preview/) and expect a production release soon.

See you in January!
