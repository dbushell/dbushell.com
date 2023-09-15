---
date: 2012-07-20 12:33:09+00:00
excerpt: None
slug: re-social-media-buttons
template: single.html
title: 'Re: Social Media Buttons'
---

**.net magazine** recently published the [Big question: should we drop social media buttons](http://www.netmagazine.com/features/big-question-should-we-drop-social-media-buttons) with opinions and anecdotes from various professionals.

Two common arguments against them are:

## Page load

**Social widgets are _massive_. They're effectively additional websites sandboxed within tiny iframes and most are poorly optimised. Facebook's "like" button is appalling. This problem cannot be understated and I developed** [Socialite.js](http://socialitejs.com) for exactly that reason. Socialite defers loading and works extremely well. It doesn't reduce the amount of bytes being shipped, but it does let your website load first before the stream is saturated with social extras.

## They don't work

It's often suggested that if people want to share, they'll share regardless of being presented or prompted with functionality to do so. **I cannot disagree with this notion more.** Simplicity and ease-of-use makes a huge different. As designers — insert "UX" if it tickles your fancy — we should know this. Just think of Amazon's patented 1-click payment. Users can be influenced and even manipulated by design. Subtlety is key, overt and obnoxious implementations will fail. But if we're going to make such an argument either way we need objective reasoning. _Statistics_ and _testing_; I've not seen a shred of either in this debate (**edit:** [now I have](http://informationarchitects.net/blog/sweep-the-sleaze-reactions/), thanks [@IA](http://twitter.com/IA)!) Even if we had that, results are almost certainly going to be website and audience specific.

## Better thinking

Of course, simply decorating your website with sharing buttons for every social network under the sun isn't going to be effective. It's a naive "social media strategy" made prevalent by marketers who are now wetting themselves over QR codes.

### Web Intents

Social widgets are a stopgap solution; use with care. I suspect **[Web Intents](http://webintents.org/)** will replace them in the near future, so I guess my conclusion is to avoid ignoring a concept entirely because it lacks sophistication at present. I realise my hypocrisy in dismissing QR codes — [but come on!](http://picturesofpeoplescanningqrcodes.tumblr.com/) I'll happily eat these words if proven wrong.

**Update** some great responses on Twitter:

> @[dbushell](https://twitter.com/dbushell) Making sharing harder can be a good thing; without buttons we might see more considered comments alongside the links people share.
>
> — Paul Lloyd (@paulrobertlloyd) [July 20, 2012](https://twitter.com/paulrobertlloyd/status/226316299146493953)

> @[dbushell](https://twitter.com/dbushell) As for testing: It is incredibly hard. You simply can't A/B test one and the same article on Social Media Buttons or not.
>
> — Oliver Reichenstein (@iA) [July 20, 2012](https://twitter.com/iA/status/226313980795297795)
