---
date: 2020-01-15 10:00:00+00:00
slug: netlify-first-impressions
title: 'Netlify: First Impressions'
description: 'The one where I stop pretending to know Netlify and learn it.'
---

[Netlify](https://www.netlify.com/) is hot right now. It's been hot for a while. It's on my list of tech I pretend to know when people ask. I assume it handles static site hosting and deployment.

![Netlify logo](/images/blog/2020/netlify-logo.png)

[JAMstack](https://jamstack.org/) is a popular/confusing term covering static sites and the new tech surrounding them. I've long adhered to such a philosophy for [personal projects](/2014/07/09/how-i-built-a-static-site-generator/) but stuck to WordPress-like solutions for client work. The necessity of a <abbr title="Content Management System">CMS</abbr> being the main factor, but has "JAMstack" caught up?

I need to catch up for sure. This week I've been learning Netlify.

## Trialing Netlify

I had some issues with the initial Netlify sign-up process. I had to switch browsers to get in. Not a good sign for a one-stop shop for 'modern websites'. Maybe a temporary bug, or unresponsive server? The Twitter community came to my rescue. I was able to use Firefox eventually, after I had authenticated with GitHub.

For this trial I used one of my existing [React projects](https://github.com/dbushell/dbushell-react-example). It's your everyday counting app that I over-engineered to experiment with React Hooks, Redux, and Routing.

Let's see how easy it is to ship on Netlify.

![React example (counter app)](/images/blog/2020/react-example-counter.png)

The build process for this includes:

1. Webpack to bundle React code
2. A simple<sup>†</sup> node script to pre-render three pages

💤<sup>†</sup> 50 lines of code and 50 megabytes of node modules.

All I needed to do after connecting Netlify to my Git repository was to configure two deployment options for the project:

- Build command: `npm run build`
- Publish directory: `public`

Both I'd already set up to work in my local environment.

No additional environment settings were required. Presumably dependencies and config in `packages.json` are used. By default Netlify automatically publishes on every commit to the master branch.

The build and deploy reportedly took around 30 seconds. That'd give me 600 updates per month (on the free plan). That's like 20 per day. I'd be happy with just one, so it's nice to have some leeway to correct 19 spelling mistakes.

For this app I could just run the build locally and commit the `public` directory for deployment. Even just drag & drop the directory and avoid Git integration entirely. But that wouldn't be much of a trial run (nor fun).

The free Netlify plan allows 100GB of bandwidth. I'd be tempted to stick Cloudflare in front to soak up some of that. Even if it is a little redundant.

Except for the initial troubles, Netlify works as expected and was quick too. I can see myself using it as a temporary solution. The CLI makes dev deployment even quicker. For live sites I rarely get involved in hosting and deployment so it's hard to comment on the pricing plans. Some of the add-on prices do seem rather expensive (shrug emoji). I'll report back if I ever test those features.

Overall strong first impressions.

Netlify rating: 3.75 `U+2B50` out of 5.

## Bonus Impressions on Netlify CMS

[Netlify CMS](https://www.netlifycms.org/) is a headless, platform agnostic CMS that can integrate with static site generators like [Gatsby](https://www.gatsbyjs.org/) and [Jekyll](https://jekyllrb.com/). Or in my case, a [ghetto render script](https://github.com/dbushell/dbushell-react-example/blob/master/src/render.jsx).

Unsurprisingly, it's an obvious choice for Netlify sites due to its close integration (for identity authentication in particular).

The CMS is configured through a `config.yml` to define data structure and file location. Then following some authentication you're presented with a front-end UI to edit said data.

I added a couple of fields for my template:

![Netlify CMS editing](/images/blog/2020/netlify-cms.png)

The editor experience is functional. Not much to say there. You get a lot of form fields based on your data. In the background it commits new changes to the Git repo and redeploys to Netlify. A downside to the [JAMstack](https://jamstack.org/) approach is that it's a bit slow to deploy changes.

I deliver a lot of WordPress sites. From an editing perspective those clients would find Netlify CMS rather lacklustre in comparison. However, the pros and cons of each platform go much deeper. I'm not even sure how I'd define "client-friendly". Too many factors. I can imagine scenarios where I'd consider Netlify CMS.

Time well spent and another tool in the belt.

Since writing this article I've tested **Netlify Functions** and wrote about that too: [Building a PWA with Netlify Functions](/2020/01/27/building-a-pwa-with-netlify-functions/).
