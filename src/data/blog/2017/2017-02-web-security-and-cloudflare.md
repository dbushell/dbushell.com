---
date: 2017-02-17 10:00:00+00:00
slug: web-security-and-cloudflare
title: 'Web Security and Cloudflare'
description: 'How I improved my website security with Cloudflare and unlocked a new page speed achievement.'
---

I've never had to deal with SSL certificates before. That's always been someone else's responsibility. Being ignorant of the technical details, the idea of setting up SSL/TLS wrong scares me. The idea of my visitors seeing those browser warnings scares me even more. And they're getting scarier by the year.

![Browser security warnings](/images/blog/2017/web-security-warnings.png)

I listened to an episode of [ShopTalk podcast](http://shoptalkshow.com/episodes/250-web-security-april-king-alex-sexton/) with guests April King and Alex Sexton. They talk web security. I won't paraphrase the whole discussion but one point sold me. It's possible for a man-in-the-middle to inject anything into an unsecured web page. One could fake security messages in an attempt to phish information. Or inject advertisement (the example given). Unsolicited ads actually makes me angriest. I used to wonder why anyone would attack _my_ website, but I realise that is missing the point. It doesn't always matter what the website is for such attacks to work.

I'm in. Encryption across the entire web.

## Cloudflare

There are a couple of free options I know of. [Let’s Encrypt](https://letsencrypt.org/) and [Cloudflare](https://www.cloudflare.com/). I opted to go with Cloudflare since they offer more services (DNS management, CDN caching). They also have a handy article: _[Secure and fast GitHub Pages with CloudFlare](https://blog.cloudflare.com/secure-and-fast-github-pages-with-cloudflare/)_.

So that's what I set up.

![Cloudflare setup](/images/blog/2017/cloudflare-setup.png)

Cloudflare has a great on-boarding process. You enter your domain and a video guide plays whilst Cloudflare scans DNS records. You're then shown the new configuration — which you now understand — along with new nameservers, should you choose to continue. It was reassuring to see correct handling of my email records. So I clicked 'continue'.

🔒 It's Long overdue, but that little padlock is now protecting my website. Or it should be if DNS propagates and I don't need a VPN to check it's working. My ISP seems to be the last place on earth to update their cache.

I've also unlocked a new achievement by using Cloudflare. The final green checkbox on [webpagetest.org](https://www.webpagetest.org/) that has eluded me for so many years.

![dbushell.com Web page test results](/images/blog/2017/dbushell-webpagetest.png)

That's rather pleasing to see.
