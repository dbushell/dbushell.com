---
date: 2021-03-01 10:00:00+00:00
slug: docker-xfce-vnc-remote-desktop-browser-testing
title: 'Web Browsers in Docker'
description: 'The one where I experiment with browser testing'
---
Last week I wrote about my new [Docker strategy for build tools](/2021/02/22/macos-big-reinstall-docker-traefik-localhost/). Following that I wondered if I could containerise **browser testing** too. Not just headless automation, but real click around, inspector tools usage. Admittedly I thought this was a silly idea from the get-go. The results, however, have surprised me.

## The Setup

Docker containers are usually super minimal Linux environments built for a single purpose. But what is stopping me from running a full desktop environment? Aside from common sense, apparently nothing that can’t be solved by procrastination.

[Xfce](https://www.xfce.org/) runs just fine with next to no setup. Ambitiously I tried KDE Plasma but gave up. I was still under the illusion that I'd get real work done later that day.

Docker isn’t a virtual machine and it doesn’t emulate a display. To see anything I set up a VNC server to provide remote desktop access. The VNC client connects to `localhost` port `5901` exposed by the container. I’m using [Screens 4 for macOS](https://edovia.com/en/screens-mac/) as a VNC client. I may try [noVNC](https://novnc.com) for perverse browser-in-browser action.

[I’ve published the Dockerfile on GitHub](https://github.com/dbushell/docker-xfce-vnc). The current image is just under 1.5GB when built.  Kinda beefy but plenty of potential to shrink that significantly.

## Visual Quality and Performance

I’ve used VNC across LAN hosts before and experienced an unreliable image and input loss. I didn't know what to expect here but localhost has worked perfectly.

I use a 27” monitor at 3840×2160 resolution. Initially I configured Xfce at 1080p but the GUI was a little blurry at 1:1 fullscreen. I double it with 2x scaling for a perfect match. With a high DPI the font anti-aliasing & hinting looks good. Different side-by-side on macOS but preference is subjective. The remote refresh rate isn’t 60Hz but it’s constant. I wonder if that’s just a VNC limitation or if I’m missing a setting somewhere? There is no noticeable input latency, nor keystroke loss with fast typing.

The “startup” is effectively instant. I don’t plan to crunch raw numbers but generally speaking the CPU and memory usage is much lower than I expected. Well within a tolerable zone leaving plenty free. I’ve tried running full virtualisation in [VirtualBox](https://www.virtualbox.org/) before and that was an unbearably slow resource hog. Except for the refresh rate, this feels close to native.

## Browsers

Firefox is a simple `apt install`. Edge and Brave require a little more effort. I gave up on Chrome/Chromium because Ubuntu was trying to force a snap package and wouldn't play ball. I don't care to invest time there.

All Chromium-based browsers have a sandbox issues that I don’t fully understand. They will run with a `--no-sandbox` flag but that is ill-advised. It's actively warned against. The `--disable-gpu` flag seems to stop random crashes but I can’t be sure yet.

I found another sandbox fix from [Jess Frazelle](https://blog.jessfraz.com/post/how-to-use-new-docker-seccomp-profiles/) that sets a Docker security profile. I’m follow lead there assuming it can’t be worse. Jess also has [single browser images](https://github.com/jessfraz/dockerfiles) on GitHub. I had no luck with those, but I did find a good write up on [XQuarts by Alessandro Chimetto](http://www.achimetto.me/docker-gui-app-on-macos.html). That may be the answer for macOS. Probably more sensible than running a full desktop environment with VNC. But less fun.

## Why, exactly?

[As mentioned](/2021/02/22/macos-big-reinstall-docker-traefik-localhost/) I was fed up with clutter on my Mac. Chrome and Edge both install background agents. They run at launch and phone home with who knows what data (and possibly [upset system stability](https://chromeisbad.com/)). Google are more competent but Microsoft are no less enthusiastic about data and privacy abuse. Call me paranoid but it’s annoying on principle. Containers give more control and can be purged easily when not in use.

I need access to different browsers for web development if that wasn’t clear. A long time ago I used [BrowserStack](https://www.browserstack.com/) heavily for testing. Such solutions are tediously slow and too unreliable. Full virtual machines share similar pain.

This started as a crazy what-if experiment but it may just prove useful. Ultimately if it has any negative impact on my daily job I’ll have to go back to native installs.
