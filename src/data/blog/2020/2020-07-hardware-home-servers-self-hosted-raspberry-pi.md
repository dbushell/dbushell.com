---
date: 2020-07-02 10:00:00+00:00
slug: hardware-home-servers-self-hosted-raspberry-pi
title: 'Hardware and Self Hosting'
description: 'The one where I set up a local “Internet of Things”.'
---

Today my main computer is a Mac Mini 2018. Quite likely the last Mac I'll buy for day-to-day work. I'd like it to last a little longer than previous ones. Following Apple's ARM chip announcement I have my doubts about future support.

Here's my office setup:

<p class="Image">
  <img loading="lazy" srcset="
    /images/blog/2020/self-hosted-hardware@1x.jpg,
    /images/blog/2020/self-hosted-hardware@2x.jpg 2x"
    src="/images/blog/2020/self-hosted-hardware@1x.jpg"
    alt="self hosted hardware"
    width="1080"
    height="525">
</p>

I was a dual-monitor person for years. That changed when I realised how often my second screen was burning Slack. Yeah, that had to change. I now keep a tablet by my side. Saves on space and electricity.

That top drawer contains a couple of [Raspberry Pis](https://www.raspberrypi.org/). On top is an extendable stand-up desk. Cable management was tricky.

## Old Macs and Linux

I've been using Linux to rescue my old Mac Mini (2014) and older Macbook Air (2010). Both drowned in the wake of Apple's macOS updates.

Linux has given these devices new life. I was using the old Mini to dual boot Windows 10 for browser testing. After upgrading to the new Mini – notably with 32GB RAM – I can use a virtual machine for IE. I keep the laptop around for portability. It's my second device for coding and blogging out-of-office.

<p class="Image">
  <img loading="lazy" srcset="
    /images/blog/2020/linux-macbook-air@1x.jpg,
    /images/blog/2020/linux-macbook-air@2x.jpg 2x"
    src="/images/blog/2020/linux-macbook-air@1x.jpg"
    alt="Linux Macbook Air"
    width="1080"
    height="525">
</p>

I've hopped around half a dozen Linux distros to see what's new. It's been 15 years since I last used desktop Linux. I settled on a basic Arch + Gnome install on my laptop. I'll probably stick Manjaro or Linux Mint on the old Mini.

I'd seriously consider Linux fulltime if it wasn't for Adobe software. Linux has its issues but the Apple tax is a serious cost of business I'd prefer to do without.

## Raspberry Pis

Scattered around my appartment I have an original RPi 1B (2012), a RPi 3B (2016), a RPi 4B (2019), and a RPi Zero W, if I can remember which outlet it's plugged into. These devices have been my gateway to Linux on the server over the years and a big source of hobby projects.

The **Raspberry Pi 1B** is hooked up to my router via Ethernet and USB power. No separate power supply. It runs [DietPi](https://dietpi.com/) — overclocked, why not — and [WireGuard](https://www.wireguard.com/). I use it as a VPN for my mobile phone to encrypt my way through dodgy networks like public WiFi. With [OpenWrt](https://openwrt.org/) on my router configured with firewall rules, Fail2Ban scripts and the like, it's as locked down as I can make it.

The **Raspberry Pi 3B** is my go-to device for experimentation. I've connected a low powered 128GB SSD via a USB to SATA adapter. The speeds aren't ideal but the drive is powered without a brick. For a while it was syncing crypto blockchains because that was a thing to do.

A major bottleneck with earlier Raspberry Pi's is their limited 100Mbit Ethernet adapter sharing a bus with the USB hub.

## Self Hosting

The **Raspberry Pi 4** is my home server / self-hosted box. I've recently switch to Ubuntu Server 20.04 LTS for that 64-bit OS goodness. The hardware appears to cope powering two USB 3 drives although I've yet to stress both at once. They are an enclosed 2TB Seagate 2.5" HDD and a 240GB WD Green M.2 SATA SDD.

I'm using Docker containers to run:

* [Traefik](https://containo.us/traefik/) reverse proxy with Let's Encrypt for:
* [Gitea](https://gitea.io) — private Git repos
* [Pi-hole](https://pi-hole.net/) — DNS / tracker blocking
* [Jellyfin](https://jellyfin.org/) — media server (before that Emby, before that MiniDLNA)
* [WebThings Gateway](https://iot.mozilla.org/gateway/) — home IoT / automation

I considered a Bitwarden instance but it scares me. I tried GitLab but its pricing tiers and features were confusing.

Generally I find the "Internet of Things" a load of rubbish. It's a privacy and security nightmare. Smart devices are destined to be abandonware long before their lifespan. Manufacturers insist on using their own unnecessarily cloud services for critical functionality whilst failing to provide updates.

That said, I do have a few smart lights. They're useful and I'm 90% sure they don't have hidden spyware. I'd previously managed these with Google Home before I de-googled my life. I tried Samsung SmartThings but the UX was painful.

I also tested [Home Assistant](https://www.home-assistant.io/) for a while. It's light-years ahead of anything else. Ultimately I found the material design web UI to be off-putting.  I prefer the much simpler Mozilla WebThings for my limited requirements. For the Elgato _Key Light Air_ on my desk [I coded my own adapter](https://github.com/dbushell/elgato-key-light-air-adapter).

The fantastic thing about using containers is how easily I can backup the compose files and config volumes. If my RPi suffers an SD card failure I can rebuild a new one without too much pain.

A couple of podcasts have really inspired these projects:

* [Linux Unplugged](https://linuxunplugged.com/)
* [Self-Hosted](https://selfhosted.show/)

Well worth a listen. Incredibly, I've still got idle CPU and memory on my RPi 4 for more self-hosted projects. [@ me ideas!](https://twitter.com/dbushell)
