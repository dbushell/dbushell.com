---
date: 2023-07-07 10:00:00+00:00
slug: kasm-web-browsers-in-docker
title: 'Kasm – Web Browsers in Docker'
description: 'The one where I browse browsers in Docker'
---

A quick follow up on two previous blog topics:

* [Web Browsers in Docker – March 2021](/2021/03/01/docker-xfce-vnc-remote-desktop-browser-testing/)
* [Docker VPN and Proxy Containers – April 2023](/2023/04/17/docker-vpn-proxy-container/)

Way back in 2021 I had some success dockerising web browsers. More recently I've been realising the utility of VPN containers. This got me thinking, if I were to combine the two ideas I'd have quite the shielded browser. One protecting me on both sides via the VPN and the sandboxed container.

That's when I found [Kasm Workspaces](https://kasmweb.com/).

> "Streaming containerized apps and desktops to end-users."

<figure class="Image">
  <img
    loading="lazy"
    src="/images/blog/2023/kasm-workspaces.avif"
    alt="Kasm Workspaces with web browser containers"
    width="512"
    height="300">
</figure>

The screenshot above is my Kasm web UI. I've installed six web browsers. Kasm can do more than browsers but browsers are my use case.

## How it works

Launching a browser session opens a new tab with a web based VNC client. Sessions can be resumed later or destroyed entirely. Each new session is like a brand new install so application settings and extensions do not persist. This is the feature I want. Have fun fingerprinting a generic Linux container!

Kasm has [documentation for "VPN Sidecar Containers"](https://kasmweb.com/docs/latest/how_to/vpn_sidecar.html#customizing-workspaces). They basically work the same as how I implemented a [vpn proxy container](/2023/04/17/docker-vpn-proxy-container/).

This setup provides a huge win for privacy and safety:

* No native browser agents and telemetry
* Limited exposure to viruses & malware
* Sidestep tracking and fingerprinting
* The usual VPN privacy

Aside from general web browsing Kasm is a great tool for testing web development.

Kasm itself mostly lives in docker containers but it does install stuff on the host system so I'd suggest using a virtual machine. For VMs I'm running [Proxmox](https://www.proxmox.com/) on my "old" Mac Mini. Finally I'm putting a dent in that 32GB of RAM I paid way too much Apple tax on.

Performance is snappy most of the time. There is not much latency running over the local network. Resolution adapts well to the stream quality setting. Text rendering is poor but legible. That would put me off using Kasm for daily work apps. Certain graphically intensive websites do kill performance. Probably due to lack of GPU power. The Mac Mini only has Intel UHD integrated graphics and I'm not sure how Proxmox handles it.
