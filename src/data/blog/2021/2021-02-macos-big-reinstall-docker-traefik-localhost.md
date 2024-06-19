---
date: 2021-02-22 10:00:00+00:00
slug: macos-big-reinstall-docker-traefik-localhost
title: 'macOS Big Reinstall'
description: 'The one where I do a fresh reinstall and try something new'
---
<picture class="Image">
  <source
    srcset="/images/blog/2021/macos-big-reinstall@2x.avif"
    type="image/avif">
  <img
    src="/images/blog/2021/macos-big-reinstall@1x.webp"
    alt="macOS Big Reinstall"
    width="960"
    height="460">
</picture>

Sometimes you have to take the nuclear option. After two years of coding on my Mac Mini I had littered the thing with so much developer cruft that getting work done had become a real struggle. Build tools were fighting for dominance in my `$PATH`.

My day job is all Node.js but sometime I get bored. I do things like [build an Android app](https://github.com/dbushell/muteswan) or [compile OpenWrt](https://openwrt.org/docs/guide-developer/start) from source to flash my router. All these projects require downloading a slew of packages to depths of the filesystem unknown to mortals. Accounting for the mess is easy. Tidying it up; not so much.

So I nuked it.

## Backup Strategry

I made several backups before formatting the SSD. Time Machine synced to my NAS. [Carbon Copy Cloner](https://bombich.com) for a full disk image. Multiple cloud syncs. All code committed to remote repos. One last manual thumb stick copy of keys and passwords.

I made a checklist of installed software. Some of [my dotfiles](https://github.com/dbushell/dotfiles) are public. They're boring, I don't stray far from the defaults. I never really had many apps installed to begin with. Adobe stuff, Visual Studio Code, and web browsers. Oh, and the absolute plethora of developer junk – but I've a plan for that.

## Containment Strategy

Now that I have a fresh install of macOS Big Sur I'm not feeling inclined to immediately wreck it with `curl [...] | bash`. I will install the bare minimum. Everything else will run inside Docker containers. More containers than ever before!

For my bread & butter web development projects I've thrown together a [Docker image](https://github.com/dbushell/docker-ubuntu) with the likes of NPM & Node pre-installed. For each project I'll spin up a container using this image or similar. I'll optimise more as I experiment. In my Docker [compose files](https://github.com/dbushell/dbushell.com/blob/main/docker-compose.yml) I can replace the default command with:

```yaml
image: ghcr.io/dbushell/ubuntu
command: >-
  sh -c "npm install
  && npm run build
  && npm start"
```

I'll continue to keep project source repositories on my local system and then mount them to their respective container. It's more convenient to edit that way. The `node_modules` directory and temporary build files are stored inside a Docker volume. That gives me the option to retain or burn them at my leisure.

Build tools are installed in the container too. So instead of:

```shell
npm run build
```

I'd use:

```shell
docker exec [CONTAINER] npm run build
```

Or I could jump into the container shell:

```shell
docker exec -it [CONTAINER] zsh
```

And run tasks as I would before.

For web projects I've set up a [Traefik container](https://github.com/dbushell/docker-traefik) to automatically proxy localhost domains. When I start the container for my personal website for example: `https://dbushell.localhost` is live for testing. For years now I've used Docker to handle [WordPress PHP/MySQL](https://github.com/dbushell/docker-wordpress-scripts/). With this new setup I'm moving more of the toolchain inside the container. Basically all of it.

**The pros:**

* Clean and tidy host system
* Per-project versioning (not just node modules but node itself)

**The cons:**

* Requires more disk space
* Performance cost

In testing, my static website build — around 400 pages + CSS & JS — takes on average 800ms natively and 2000ms inside a container. That's much slower but it's also literally seconds either way. It's not even worth the time to optimise it.

For other projects I'll find or create images as I need them. I gave the [LinuxServer.io](https://www.linuxserver.io) [ffmpeg](https://github.com/linuxserver/docker-ffmpeg) a quick test drive. It works perfectly, though noticeably throttled by the resources allocated to Docker. Acceptable for my rare use cases.

## The Strategy

No more natively installed build tools. That's my development strategy for the foreseeable future. Containers for everything. I hope this will keep my Mac cruft free.

My rather large [Ubuntu base image](https://github.com/dbushell/docker-ubuntu) is excessive but it's useful whilst I'm still figuring out exactly what I need. I'm sure time will tell whether an all-purpose image does the job. One doesn't usually configure a shell prompt inside a container. It's more like Docker glamping than going full Bear Grylls mode.

What do you reckon? If this proves to be a bad idea I can always go back to a local `npm install` or `brew install *`.
