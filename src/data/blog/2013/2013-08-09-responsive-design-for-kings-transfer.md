---
date: 2013-08-09 08:08:35+00:00
excerpt: None
slug: responsive-design-for-kings-transfer
template: single.html
portfolio: true
title: Responsive Design for King’s Transfer
---

The new King’s Transfer website has gone live. I worked on design and front-end development while [Peter Mitchell](http://peterjmit.com/) took care of all things back-end.

This is my third in-depth responsive design[ case study](/showcase/) and my first as a freelancer. I feel it's my best work to-date and that's due to a great client and a real focus on the design process. I've documented the project below to showcase how I like to work.

![King's website design](/images/blog/2013/kings-transfer.png)

_Above: the final design at desktop size, below: as viewed on a LG Nexus 4 mobile._

![King's website design on mobile](/images/blog/2013/kings-transfer-mobile.png)

## Project overview

The client had big plans for the website but the existing design was getting a little dated. I was hired to provide a responsive refresh. The project had a modest budget so we weren't aiming to solve everything at this stage. While we couldn't react to every idea we certainly had room to create a solid platform for future development.

![King's old website](/images/blog/2013/kings-old-website.png)

_Above: the old website in need of a refresh._

## Questions and user stories

My first phone conversation with King's covered general formalities and requirements. After contracts were signed we followed with a detailed analysis of the business and its customers. I followed up with a questionnaire to help reinforce my understanding and to uncover further insights that would impact design.

We wrote around a dozen user stories as a way to outline exactly what we aimed to achieve. These ranged from the simple:

> **US2:** As a home owner I need to know if King’s operates in my area so that I know what services are available locally.

To the more specific:

> **US9:** As a French speaking customer I expect the same user experience and content that English speakers receive.

What this gave us was a set of criteria with which to evaluate direction and focus time and budget. We organised the stories into a loose priority to show importance.

## Content and information architecture

Despite being relatively small the existing website had increased in duplicate content over time due to limitations in the menu structure imposed by the CMS. This lead to fragmented user journeys and likely search engine penalties.

It was a simple enough task to reorganised the content. We sketched out a logical sitemap and took an inventory of content — a complete rewrite isn't always feasible — and referencing the user stories we started to design pages with content alone:

![King's content plan](/images/blog/2013/kings-content.png)

At this stage we had a new website to click around and get a sense for the content hierarchy and general experience. When it comes to "content first" and "content out" design methodologies you can't get more literal than this!

## Design and development

As the above process was in full flow I started to experiment with visual design. Nowadays I'll never deliver high-fidelity design mock-ups for client sign-off but I still find Photoshop useful to quickly sketch strong visuals. Though website development in code has already started I personally find design flourishes [outside of the browser](/2013/05/15/stifling-web-design/).

![King's design mock-ups](/images/blog/2013/kings-design-mockups.png)

This design may appear to have a rich visual aesthetic but it's merely another form of **sketching** and represents **no more than a day's work**. Personally I find this process strikes a nice balance. Another project I'm still working on has involved a lot more pencil sketching. I don't force a particular approach.

This initial stage is about experimentation and forming ideas; designing just enough to be confident moving forward without over committing. Indeed, the client did not even see this work as it would have given the wrong impression. Instead I composed a style tile to illustrative the design language I'd be taking forward:

![King's Transfer design style tile](/images/blog/2013/style-tile.png)

I presented the style tile to the client as we neared completion of the content planning. They were as pleased as I was and we were all confident with the vision.

## Moving further into code

Starting with my [Origin](/2013/04/30/origin/) baseline I began to build a pattern library containing all the visual components in code. This complements modular thinking in HTML and CSS and provides a nice crossover between design and development.

![King's pattern library](/images/blog/2013/kings-pattern-library.png)

As new pages required new components I used the style tile and pattern library as a reference. Working this way gives ample opportunity for browser and device testing. There's no excuse to run into nasty issues (even with legacy browsers). Occasionally I would return to **pencil and paper** to quickly sketch possible arrangements before coding them up.

## Finishing up

I continued to design and build through the main sections of the website with regular client feedback. Taking this approach allowed us to best allocate the time remaining and take advantage of late stage insight. And when design was complete, so was the build.

Hopefully you can see the benefit of working this way. Even as the design for specific pages begins to unfold there's still time to reevaluate. Throughout the project I'm learning more about the business and the client is learning more about web design. Who in the right mind would want to make critical decisions in the early days of a project?

This workflow obviously draws a lot from agile development. Had the project been larger we'd have split the user stories into more defined sprints and iterated in the same way.

## The Result

> Our experience using the commendable services of David Bushell was a true pleasure.  David quickly immersed himself within the workings of our industry, and created a plan that concisely reflected the needs to be addressed.  His clean layouts, graphics & dynamic CSS implementation allows our corporate image to seamlessly cross the various browsers and hardware platforms currently on the market.  Since going live with the current site, we have received nothing but praise about it.</p>
>
> <cite>Jon Home, Director, Asset Management, [King’s Transfer Van Lines Inc.](http://www.kingstransfer.com/)</cite>
