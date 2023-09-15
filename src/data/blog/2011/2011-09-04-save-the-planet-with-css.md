---
date: 2011-09-04 18:08:59+00:00
excerpt: None
slug: save-the-planet-with-css
template: single.html
title: Save the planet with CSS!
---

I've been quiet lately (big updates on the horizon) so a quick one for this evening:

My pre-launch checklist for website builds has always include "create print.css". Most of the time I forget (or ignore it). It seems like the default thing to do though. Until you think about it.

Who prints web pages?

I do sometimes. Invoices, receipts, tickets etc. But general content pages? It's 2011! We carry around smartphones with all sorts of apps to access and store information. One of my favourite campaigns last year was [Save as WWF](http://www.saveaswwf.com/en/) — the PDF that can't be printed, and that got me thinking.

Here's my new print.css:

````css
@media only print
{
	body * { display: none !important; }
	body:after { content: "Don't waste paper!"; }
}
````

I'll be using something similar on my personal projects (where printing makes no sense). It doesn't make my content any less accessible, and it's easy to bypass if you're really, _really_ set on printing.

In truth though, it's probably wise to really consider what can be printed. A lot of paper can be saved with a carefully crafted print.css.

What do you think? <del>Maybe I should start a campaign?</del>

### Update!

I did it: [see printstylesheet.dbushell.com](http://printstylesheet.dbushell.com) and join the revolution!

![Print CSS](/images/blog/2011/printcss.png)

Follow the discussion over at [Forrst](http://forr.st/~wah)
