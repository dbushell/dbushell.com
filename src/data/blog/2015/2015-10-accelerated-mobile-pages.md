---
date: 2015-10-20 10:00:00+00:00
draft: false
slug: accelerated-mobile-pages
template: single.html
title: 'Accelerated Mobile Pages'
---

The [AMP Project](https://www.ampproject.org/) is an initiative by Google to improve the "mobile web".

Accelerated Mobile Pages are an alternate version of their corresponding, canonical web page. They're still HTML but limited — [check the spec](https://github.com/ampproject/amphtml/blob/master/spec/amp-html-format.md). The best way to understand Accelerated Mobile Pages is to see them in action:

![BBC News article responsive and AMP page designs](/images/blog/2015/amphtml-bbc-news.png)

The BBC News website has implemented AMP, screenshotted above (left: responsive page, right: AMP alternative). The responsive page is 410KB with 68 requests, the AMP page is 115KB and 4 requests. The AMP page content is stripped back to the bare minimum for a *single article*. The responsive page has a menu, footer, and several featured & related article components.

![The Guardian news article responsive and AMP page designs](/images/blog/2015/amphtml-the-guardian.png)

The Guardian's AMP pages have a bit more content including a list of related articles just above a footer. The responsive page is 454kb with 67 requests, the AMP page is 127kb and 8 requests. So very similar to BBC News.

I've attempted to implement AMP on my own blog:

![dbushell.com blog article responsive and AMP page designs](/images/blog/2015/amphtml-dbushell.png)

As you can see above, there's very little visual difference (header, footer, and web fonts are gone). In this example my responsive page is 405KB with 8 requests, the AMP page is 48KB and 2 requests. The vast majority of page weight on my website belongs to images. I compress them well but I'm a bit lazy with serving smaller versions, opting to scale down instead. "Responsive images" are on my to-do list.

## Who sees AMP?

It's important to note that AMP is not intended to be a separate m. website in disguise. Responsive design is still "best practice". You don't redirect mobile users to AMP pages and not every page should have an AMP alternative. AMP is best suited to single article content.

So when do users see an AMP page? Well [Google search results](https://www.youtube.com/watch?v=i2_lAEzmOPo) may integrate them soon as demoed in this video. [Twitter are also onboard](https://blog.twitter.com/2015/introducing-accelerated-mobile-pages-0) saying, <q>Over the coming months, we plan to help surface more AMP content in Tweets, making it even easier for our users to browse the mobile web.</q>

We know that speed is a critical factor when deciding whether to read or abandon a website. Especially when casually browsing social media links. AMP gives the ability to preview even lighter versions of web page content in these scenarios.

That said, if Twitter insists on wrapping all URLs with a t.co redirect the whole initiative is pointless on their part. I can't be the only one that finds t.co links take *forever* to resolve, can I?!

## My Thoughts

Google are well known for abandoning projects. [Google Authorship](/2011/07/14/the-social-designer-google-authorship/) comes to mind. However, with big players like The Guardian, BBC News, Twitter, and [WordPress](https://vip.wordpress.com/2015/10/07/mobile-web/) already on board, it'll be very interesting to see just how prevalent AMP becomes.

As to how AMP will affect the web, that depends upon how user agents make use of AMP, and we're seeing little of that at present.

It also depends upon how websites respect the format. Say Google prioritise AMP-lified content in search results. Now the SEO / marketing people get a whiff and AMP is adopted quickly. These same people look at their simple AMP pages and ask: *"Where is the conversion? Where is the call to action?"* and before long AMP pages are full of links encouraging users to visit the full website or download the app which they can use to access the same content as the website but inside a lovely walled garden. Then [WTF Mobile Web](http://wtfmobileweb.com/) in inundated with fresh content.

We'll see. I feel quite positive about this project but I'm sure many will fear Google's influence on the web as they tighten their grip. Is the future 'Accelerated Mobile Websites'? I doubt even Google are big enough to force that, but if they can, it'll be one step at a time.

I'm going to dress up as Google for Halloween.
