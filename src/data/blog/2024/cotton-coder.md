---
date: 2024-01-24 10:00:00+00:00
slug: cotton-coder
title: 'Cotton Coder'
description: 'The one where I launch a new blog'
---

It’s finally happened! My bookmark blog is back!

<figure class="Image">
  <a href="https://cottoncoder.com"
    rel="noopener noreferrer"
    target="_blank">
    <img
      loading="lazy"
      fetchpriority="low"
      src="/images/blog/2024/cotton-coder.avif"
      alt="Cotton Coder"
      width="840"
      height="200">
  </a>
</figure>

🚀 [**Cotton Coder is live!**](https://cottoncoder.com)

> The curated bookmark blog of web dev curiosities

**Cotton Coder** is launching as a small project with large ambitions. It starts life as my new bookmark blog. A blog I've been meaning to revive for a very long time. I used to curate a blog called [Design Heroes](https://designheroes.dbushell.com/) that I permanently archived 12 years go.

This new blog is all about:

* Web design
* Web development
* Web technology

I think you see the pattern. If you read my blog here at `dbushell.com` I'm sure you'll find something useful on [cottoncoder.com](https://cottoncoder.com/).

## Tech Stack

[**Cotton Coder**](https://cottoncoder.com/) is built with **Deno** and **Svelte** using my experimental [DinoSsr](https://ssr.dinoear.com/) framework, another of my [new projects for 2024](/2024/01/08/new-projects-for-2024/). At least for now. I can migrate to SvelteKit easily if I need something more mature.

The blog is backed by a [Deno KV](https://github.com/denoland/denokv) database. I've implemented GitHub OAuth login to protect the content editing routes and API endpoints. The [source is available](https://github.com/dbushell/cottoncoder.com) on GitHub if you're curious.

## Self-Hosted

I was planning to host Cotton Coder on [Deno Deploy](https://deno.com/deploy). Unfortunately right now the isolate cold start times are pretty rough. There is an open [GitHub issue](https://github.com/denoland/deploy_feedback/issues/505). Even the most basic *"Hello World"* example suffers. So it's not just my bad code! I've been using Deno Deploy for things like IoT web hooks and small "edge" function tasks. Those work great. But a website response being delayed by seconds is a performance killer.

Solution: I'm self-hosting for now!

The website lives inside Docker containers, in a Proxmox virtual machine, on a firewalled VLAN, proxied by a [Cloudflare tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/). This saves me from pointing DNS to my public IP and opening port 443 on my router. It should be secure. I'll find out quickly if it's not!

## What's Next

Cotton Coder is not replacing my blog here. I've never used this blog for bookmarks anyway. I'll be publishing to both sites. Over my Christmas break I had a lot of ideas for what Cotton Coder could be. We'll see what bears fruit. Launching this month was important otherwise the site would sit in a private code repo forever.

Get yourself over to 👉 [cottoncoder.com](https://cottoncoder.com)!
