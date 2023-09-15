---
date: 2012-03-20 21:09:51+00:00
excerpt: None
slug: preserving-the-web
template: single.html
title: Preserving the Web
---

Before I ramble on, if you haven't seen Jeremy Keith's talk on time, networks and history, may I point you to his article: [Of Time And The Network](http://adactio.com/articles/5312/). You can also watch his talk from [Webstock '12 on Vimeo](http://vimeo.com/38138120).

In regards to our content he says:

> Publish it. Publish it on the network. Put it out there, using standardised formats. Care for the URLs. Make sure those URLs last. And make lots of copies, and allow people to make lots of copies.

When I first watched this talk I felt somewhat enlightened. Suddenly I understood the importance of archiving our digital history. Then I remembered many occasions in the past where I've had a similar revelation. These occasions had something in common, I was looking for work I'd lost to time.

This domain [dbushell.com] has been online for coming on 9 years but I made many more amateur contributions to the _World Wide Web_ when I was a youngling. Probably embarrasing things, likely many Geocities websites, but _mine_ nonetheless. I've searched many archives but most or my "early years" are lost.

## Preserving a Website

So as it happens I [recently](/2012/03/06/design-heroes/) shut up shop at my _other_ blog [Design Heroes](http://designheroes.co.uk). I scheduled a mass deletion for an upcoming free weekend but — thankfully! — Mr. Keith's video intervened. Now, I have no delusion that my little bookmark blog has any value to others, but I do know I'll kick myself in a decade's time when I think back to the day I deleted several years of my life on a hangover Sunday.

The answer? Perserve the website. I had my doubts about pickling a USB stick so I decided to keep Design Heroes online in suspended animation. This required:

* Minimising external resources.
* Removing the underlying CMS and database.
* Maintaining/redirecting the original URLs.
* Making a copy of the website for download.
* Adding a notice for future visitors.

Design Heroes has just under 1000 pages so manual archival wasn't an attractive option. I started by editing the PHP templates to remove things like social buttons and searching — interactivity that isn't going to work in the deep freeze.

I downloaded the whole website (sans images) with **[Wget](http://www.gnu.org/software/wget/)** and a variation of [this command](http://www.linuxjournal.com/content/downloading-entire-web-site-wget) (first result I got in Google). I found I had to run it a few times to force it through my pagination. I then deleted the CMS templates and uploaded the static HTML pages. I also zipped up the whole thing and added a download link with a liberal license. Finally, A little .htaccess magic was added to throw a 301 permanent redirect on my original URLs to ensure integrity there.

Voilà!

[One preserved website](http://designheroes.co.uk) ready to duplicate and re-host with ease and no dependencies. I reckon this process can be refined and improved. I also think there should be a standardised notice and preservation icon — **let me know your ideas!**
