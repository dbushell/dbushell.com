---
date: 2010-07-04 14:53:04+00:00
excerpt: None
slug: the-balance-of-web-design
template: single.html
title: The Balance of Web Design
---

_Before I present another awesome feature of my own website, I'd like to briefly discuss the theory behind website design:_

When we speak about "website design" our initial thoughts centre around the aesthetic style. In reality the secret to good website design is content layout on the individual pages, and the content structure of the whole website.

Delivering content correctly is paramount to the success of a website (and therefore success of its design), the actual aesthetics are of secondary importance.

### Aesthetic Design

If we think about other areas of design like print advertisement – the balance shifts in favour of aesthetics. Ads need to catch the eye and stir up emotion with strong visuals. Aesthetic design is incredibly subjective. A style needs to be found that is most attractive to the target audience. The more we move away from a neutral design the more people we alienate, hence the importance of knowing the audience.

### Layout and Structure Design

This part of the design process is less subjective and more influenced by human behaviour. In regards to typography for example there are many rules that are generally regarded as good practice, essentially making content more readable. In regards to website usability the rule book is more like a library. Everything from the wording of a headline to the placement of a "buy now" button has a dramatic affect on the audience.

This is why aesthetic design is always of secondary importance to a website. If we take a step back and look at a website like [Amazon](http://amazon.co.uk), it's not particularly pretty, but it's clear they've invested heavily in usability.

### Evolution of the Web

The way in which we access websites has changed substantially in the last few years. With the arrival of smart phone touch-screens the rule book for website usability has to be rewritten.

_And I'm not going to do that._

But I have been playing around with a cool CSS technique that allows for a more fluid device-dependant content structure. I am (of course) talking about [CSS Media Queries](http://www.w3.org/TR/css3-mediaqueries/). I'm still learning the ins and outs so I won't ruin the Internet with another poorly written tutorial but I would like to show off what I've done with this blog.

So if you reach down to the bottom corner and drag the browser window to various widths you'll notice a change in layout. The content flows from single to multiple columns and the twitter feed jumps underneath when there's little room (this is the iPhone view too). I've only tested it on the iPhone 3GS so I don't know how iPhone 4 with its super awesome high-res Retina display will look (but I'm sure it makes any website look good).

There are a couple of annoying things like the **column-break-after** property seemingly being ignored – resulting in abandoned heading tags at the bottom of a column if you're unlucky. Images also have a wonderful experience, which is why I'm keeping the fixed-width template for older posts.

And if you're using Internet Explorer, you'll probably wonder what I'm talking about.

In the end I'm one step closer on my vague mission to make my website perfect in every situation (see previous post on [Using SVG Logos](/2010/06/30/using-svg-logos/)). In regards to whether multiple content columns are actually a good thing for usability, I haven't the foggiest! Let me know your "experience" in a comment and I'll be sure to follow up with a report.

**Quick update (7th July)** to link to this post ["On Problems"](http://mindgarden.de) which presents an excellent philosophy on "responsive design" with some great links for further reading. The blog is another example of media query usage that predates my attempt by many moons!
