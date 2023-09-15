---
date: 2023-06-08 10:00:00+00:00
slug: dev-containers
title: 'Dev Containers!'
description: 'The one where I develop deeper in docker'
---

Two years ago I wrote about my [containment strategy](https://dbushell.com/2021/02/22/macos-big-reinstall-docker-traefik-localhost/#containment-strategy) to keep a macOS install clean. For this I built a [docker sandbox container](https://github.com/dbushell/docker-ubuntu) with all the build tools I use. This kinda worked but it wasn't perfect. One issue I kept running into was having to install `node_modules` both locally and inside the container. Mounting files around that was a pain.

Now I've found the solution: [**Development Containers!**](https://containers.dev/)

Actually this has been on my "to look at" list for months. It's a long list...

<figure class="Image">
  <img
    loading="lazy"
    src="/images/blog/2023/steve-ballmer.gif"
    alt="Steve Ballmer getting very excited for developers"
    width="360"
    height="270">
  <figcaption><em>Containers! Containers! Containers!</em></figcaption>
</figure>

This is a Microsoft lead project with first class VS Code integration. Dev containers allow you to mount an entire workspace inside a container. Meaning that VS Code services and extensions are running right alongside the build tools.

## Figuring it out

I don't learn well by reading documentation and I dread watching YouTube tutorials. I have to get my hands dirty and bang rocks together.

I've taken [my sandbox image](https://github.com/dbushell/docker-ubuntu) and rebased it on Microsoft's base dev container. I've moved the preinstalled build tools to independent "feature packages". For individual projects I can customise `devcontainer.json`.

Like [my website project](https://github.com/dbushell/dbushell.com) for example:

```json
{
  "image": "ghcr.io/dbushell/docker-ubuntu/base",
  "features": {
    "ghcr.io/dbushell/docker-ubuntu/deno:latest": {
      "version": "1.34.0"
    }
  },
  "customizations": {
    "vscode": {
      "extensions": ["GitHub.copilot", "denoland.vscode-deno"]
    }
  }
}
```

This is a great way to customise the exact tools and extensions I need.

Rolling my own packages is an exercise in understanding how stuff works. In practice I'd use the "official" packages especially when collaborating with a team. As experiments go this is surprisingly fun despite how dull the documentation looks.

If you're curious you can [follow my progress on GitHub](https://github.com/dbushell/docker-ubuntu/tree/main/devcontainer). I wouldn't recommend using my images though as they're likely to change and break.

It's only been a few days but I think [VS Code dev containers](https://code.visualstudio.com/docs/devcontainers/containers) are neat 👍
