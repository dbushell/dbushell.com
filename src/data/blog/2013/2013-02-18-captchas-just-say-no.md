---
date: 2013-02-18 19:59:48+00:00
excerpt: None
slug: captchas-just-say-no
template: single.html
title: 'CAPTCHAs: Just Say No'
---

A couple of years ago I wrote [In Search Of The Perfect CAPTCHA](http://coding.smashingmagazine.com/2011/03/04/in-search-of-the-perfect-captcha/) for Smashing Magazine. It was always a wild goose chase (but I knew that).

I still get asked regularly how to deal with spam. It isn't easy.

I keep seeing new solutions pop up touted as an alterative to CAPTCHAs. Here's the deal: replacing character recognition with other kinds of human tests — like pin the tail on the donkey — **that's still a CAPTCHA!**

![CAPTCHA](/images/blog/2013/CAPTCHA.png)

Is this an experience you really want to force upon your users? It's actually _worse_ in my opinion. At least the likes of [reCAPCHA](http://en.wikipedia.org/wiki/ReCAPTCHA) have been ingrained into our psyche (even if they're often illegible). Some stupid Flash game is just that; stupid. It looks terrible. It looks like an advertisement. It's tacky. It's still a lock you're forcing your users to tediously pick.

![Still a CAPTCHA](/images/blog/2013/STILL-A-CAPTCHA.png)

And guess what? **It's still a CAPTCHA!**

_"Completely Automated Public Turing test to tell Computers and Humans Apart"_. It doesn't matter how you dress up your test. I get it. Spam is the bane of the webmaster's life, but the solution isn't to make it the customers problem. CAPTCHAs are the equivalent of TSA agents harassing innocent people at the US border. (I also enjoy [Paul Boag's analogy](http://boagworld.com/usability/dealing-with-spam/).)

More to the point, CAPTCHAs aren't even an entire solution to spam. It costs a matter of dollars to employ real humans in developing nations to submit thousands of forms.

## What is the answer?

If there was a silver bullet we wouldn't have the nonsense above. Ideally your system should track and detect automated or fraudulent behaviour. The reality is that not even Twitter, Facebook, or Google can do this 100% effectively. Big banking institutions can't either. If the incentive is high enough, people will find a way to cheat the system.

Developers can implement invisible "honey pots" and time checks to detect automated spam invisibly. For open comment forms I can't recommend [Akismet](http://akismet.com/) enough. I route my email through Google Mail. It strips almost all spam.

Other techniques may include email or text message verification. There are so many spam targets online you just needs to be harder to crack than the average website. You may consider 3rd party authenticated login that is more sophisticated than what you can develop, e.g. social login, OpenID, BrowserID — perhaps not ideal experiences themselves but still better than another CAPTCHA.

At the end of you day you'll have to deal with spam and unwanted activity. That's the price of running a website.

Make things difficult for the bad guys, not 99% of honest users.
