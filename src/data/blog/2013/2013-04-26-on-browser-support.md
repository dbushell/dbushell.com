---
date: 2013-04-26 12:37:09+00:00
excerpt: None
slug: on-browser-support
template: single.html
title: On Browser Support
---

The recently launched [jQuery 2.0](http://blog.jquery.com/2013/04/18/jquery-2-0-released/) leaves behind support for IE6–8. This has lead to some interesting opinions on what browsers we should be supporting. Here's my take:

## Defining support

Supporting a browser to me does not mean that a website will be identical in form and function. That is a fool's errand leading to an unmanageable mess of polyfills and hacks.

I consider a browser supported if I **actively test** the core content and functionality — integral to the purpose of the website — is accessible. I'll also take steps to ensure the quality of design and overall experience is on par with the browser's capabilities.

I divide attention proportional to browser usage. I'm not going to deliver the _best possible_ experience IE7 is capable of but it's certainly not going to be broken.

## Deciding where to test

When I tell people I often support IE7 the common response is "why?" — followed by an assertion that browser statistics show IE7 usage is now insignificant enough not to warrant attention. How could you possibly know that? I haven't told you which website I'm building yet!

You see, aggregate statistics are a useful baseline — at least localised, not global — but they become irrelevant if you have data for an existing domain. I look at historical usage numbers, project for the foreseeable future, and only then do I start to decide the appropriate range of browsers to test in. Looking at numbers is not enough to make the final decision.

Other factors to considered include:

## Budget and customers

Projects are more often than not limited in the funds department. Sometimes it's just not financially viable to support and test the long-tail of browsers and devices. This can be a tricky situation in regards to client expectations.

Is the cost of development going to outweigh the loss in revenue that comes from abandoning the less technically astute customers? Imagine a website that sells high value products. A new sale is worth thousands of pounds; suddenly Mr. IE7 user — whom can't get past the JavaScript error on the checkout form — begins to look like a good investment after all.

For this reason alone a blanket list of supported browsers shouldn't be set in stone. When I wrote about [browser support](/2012/03/03/forget-about-browser-support/) last year I said:

> A traditional browser support list is completely ignorant of a website’s requirements. It wrongly aims for parity across browsers and leads to much wasted time and money.

Study requirements in detail. Adjust design and development practices to suit the bottom line. Doing this will tame the client's expectations and make them confident with your advice.

## Effort and time

When the [previous iteration](/2012/03/03/forget-about-browser-support/) of dbushell.com launched last March I supported IE6. Yes, that's a _six_. Why? Because the effort required was minimal. Even though the nature of my website means that Internet Explorer as a whole is barely represented in the logs. When I [realigned this year](/2013/02/04/a-new-home/) the design was more ambitious and I moved the boundaries up to IE8 and above.

There is no universal scale for effort. It comes down to your ability, but if you decide a website must include the latest trendy 3D parallax effect prior to reading the brief you have no right to rant about the state of browsers or the ignorance of users.

The hard fact is good — appropriate — design for the web is not always glamorous. That means reining in the baseline experience and utilising solid progressive enhancement techniques.

Browser support only becomes a pain if you ignore reality.

That may mean saying "no" sometimes to an effect someone has been wowed by on their latest iPad app. And _that_ is probably for the better.
