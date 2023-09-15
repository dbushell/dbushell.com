---
date: 2011-01-15 21:57:44+00:00
excerpt: None
slug: transitioning-as-a-web-designer
template: single.html
title: Transitioning as a Web Designer
---

"Web Designer" is one of the most exciting job titles in the design category. That's because — and bear with me here — what was once an acceptable website design in a particular year may no longer be acceptable to produce the next.

For the last couple of years at [Base Creative](http://www.basecreative.eu/) I've been designing **fixed-width** websites using the [960 Grid System](http://960.gs) to guide. The grid obviously provides all the benefits of any design grid and is still a safe bet size wise (for desktop browsing anyway). Designing on the grid is ingrained into my Photoshop workflow but I make a point of avoiding the grid/column CSS & markup suggested by 960. A lightweight HTML5 structure tailored to each design is all that's allowed by my perfectionism.

This technique fits your common everyday desktop and can potentially be very usable on mobiles, depending on the complexity and quantity of content. Good mobile browsers (the iPhone, for example) solve any small screen usability problems better than efforts made in the design. That's not to say mobile devices have the burden to provide this solution, a purpose built mobile website is a thing of beauty, it's just that most projects don't have the investment for it.

A fixed-width website can be made responsive using CSS media queries. For a content-based website (like this blog) media queries are more than effective enough to provide a mobile experience. To date I've only used them in my personal projects, but this year I plan to introduce these principles into client work. The restraint so far has been how to make sure clients understand that this is an advantage in increasing usability and focusing on call-to-action where possible. For a website that requires a lot of UI and functionality a mobile app is still the best solution.

**The websites I've designed this way have proved to work very well for clients, but is fixed-width the best I can do?**

What has been traditionally labelled as "fluid" layouts, basically adjustable to the full width of the page, does not suit readability nor usability. The lack of control over line lengths and proportional scale offends my classically trained eye for general aesthetics (read: good taste).

However, there is an in-between. My fixed-width sites have an outer container of just under 1000 pixels centred using **_margin: 0 auto;_**. It doesn't take much to replace the width with **_max-width_** and **_min-width_** values giving flexibility while retaining control over what's visually acceptable. Elements inside are either fixed in size or set to a percentage depending on what's more beneficial to a resizing. Combine this with block-level floating, media queries, and other CSS3 treats like multi-column layout and you have one hell of a power build.

The [1140px CSS Grid System](http://cssgrid.net) is an excellent example and perfect to design on. Just keep in mind how you plan elements to resize and again, build to fit rather than relying on the generic column markup.

At Base Creative we have made a considered decision to drop IE6 browser support on most new projects. **We design websites for the future, not the 20th century.** Responsive design takes a lot more attention to detail but it is vital for a modern website. The web design techniques that I've made a transition to over the last year ensure a great web experience on all devices, from phones to tablets and back to the desktop. Build this on the foundations of accessibility, aesthetics, content, call-to-action and usability and you have an excellent website.

The way I make websites today is not the way it has been done in the past, it is not the way it will be done in years to come, but it is _the best way_ for the present and foreseeable future.

_Transitioning_ as a web designer is a necessity.
