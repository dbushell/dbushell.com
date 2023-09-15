---
date: 2011-09-14 13:13:44+00:00
excerpt: None
slug: what-is-mobile
template: single.html
title: What is mobile?
---

Have you ever seen someone walk down the street with a tower strapped to their back and a 24" flatscreen perched on one arm tweeting away? We can assert that anyone "mobile" is more than likely "small-screen" but there is still a strong distinction between the two. "Mobile" suggests either:

* use of a specific handheld device — each model too niche to consider individually for most practical web design decisions (if we subscribe to the "one web" philosophy, which we should).
* or "on the go" activity (a wild assertion to make).
* or even worse: a supposed segregated "mobile web".


Screen size is part of the **user's context** that we _can_ detect and make adjustments for, hence why it's a huge part of _responsive design_. And though we can pretty much guarantee that no one is tapping away on their desktop while riding the bus, we cannot guess their actual situation or intention based on that knowledge alone. This leads to a few important considerations:

* Be careful of assuming browsing habits.
* Be careful of prioritising content and restricting functionality.

In front-end development we do _feature_ detection, not browser or device detection. In design we should be considering what knowledge we have in terms of the user and their context. In reality, we have very few hard facts about either.

When designing websites we have to prioritise content by making a lot of assertions on what the user is trying to achieve. That's somewhat easier for functionality-based websites where a single page may be dedicated to one task. For content-based websites this is a lot harder, particularly if there are business interests to push. Therefore any kind of restriction or removal of content & functionality as a solution to improve usability on small-screens can only lead to user frustration; we're trying to force them down a path they don't necessarily want to take.

We can't escape the need to make guesses in web design, but we can escape the fallacies.

"Mobile" is a term best reserved for native, one-device apps — something we should be very aware of when taking inspiration for small-screen website designs. I'm particularly fond of the [small-screen first](http://stuffandnonsense.co.uk/projects/320andup/) approach, not only because it makes both design & development easier, but also because it so clearly disposes of the wrong ideas.

For a practical example consider contact & location details. We can make a guess that small-screen means mobile "on the go" and provide this information high up. A lot of websites do. But that doesn't mean that on desktop — or more accurately large-screen — we should hide those details away on a hard to find "contact" page. From the limited user knowledge we have it's just as likely the user is rushing out of their office and want to jot down a telephone number. Or perhaps they're sat on a comfy couch, casually browsing for no particular reason.

One last thing: a website is not an app. Though if you intend to use the web and its technologies to create a device-dependent, app-like "web app", well, it's not quite a website either. Hybrids are cool with me, just don't promote them as both without recognising the intrinsic differences. They're entirely different mediums.
