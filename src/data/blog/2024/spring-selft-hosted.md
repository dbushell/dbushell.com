---
date: 2024-03-25 10:00:00+00:00
slug: self-hosted-update-spring-2024
title: 'Spring 2024: Self-Hosted Update'
description: 'The one where I get a new toy to hack around on'
---

Spring has arrived in the UK! I can tell because the Canadian Geese are pairing off and getting territorial. A charging goose will put a spring in your step.

This also arrived:

<figure class="Image">
  <img
    loading="lazy"
    src="/images/blog/2024/zimablade-nas-kit.avif"
    alt="Top-down photo of the ZimaBlade sitting on its hard drive enclosure"
    width="1351"
    height="1554">
    <figcaption>ZimaBlade NAS Kit</figcaption>
</figure>

## ZimaBlade

It's the crowd-funded [ZimaBlade](https://www.crowdsupply.com/icewhale-technology/zimablade) single board computer. I gambled on the quad-core NAS kit. Specs include: 4 core CPU, 16GB RAM, 32 GB eMMC, PCIe 2.0 x4, SATA 3.0. Hard drives are not included. The PCIe and SATA ports make it unique.

I pre-ordered the **ZimaBlade** for $203 USD including taxes and shipping not long before the **Raspberry Pi 5** was announced.
## Raspberry Pi 5

Last year I managed to get a first batch Pi 5 along with accessories:

* Pi 5 + power supply + fan case - £104
* [NVMe Base](https://shop.pimoroni.com/products/nvme-base) - £14
* Crucial P3 Plus 500GB NVMe - £36

That's a total of £154 GBP (~$194 USD). Similar cost to the ZimaBlade for a "usable" setup. Pi's are expensive unless you're prepared to tank performance with SD card boot.

<figure class="Image">
  <img
    loading="lazy"
    decoding="async"
    fetchpriority="low"
    src="/images/blog/2024/raspberry-pi-5-nvme-base.avif"
    alt="Close-up photo of the Pi 5 case modification"
    width="1560"
    height="982">
    <figcaption>Raspberry Pi 5 with NVMe Base</figcaption>
</figure>

I hacked the Pi 5 case to fit the NVMe underneath. I literally used a tiny hack saw through the SD card slot to make space for the ribbon cable to flow. Quite a tidy mod! An SD card still fits if needed — I used that to prepare the bootable NVMe. The PCIe is officially rated Gen 2 speeds but can run at Gen 3 — that's faster than the ZimaBlade. Check out [Jeff Geerling's blog](https://www.jeffgeerling.com/blog/2023/nvme-ssd-boot-raspberry-pi-5) for a guide.

I'll be using these alongside my current devices:

## MacMini

In my [last self-hosted update](/2023/08/08/adventures-in-windows-proxmox-virtualisation/) I was playing around with Proxmox on a 2018 MacMini. I'm using it to run containers and virtual machines for all my self-hosted services. Although Proxmox runs fine it was taking minutes to boot. An uncomfortable wait. I managed to build a custom kernel based on [this project](https://github.com/AdityaGarg8/pve-edge-kernel-t2) and [t2linux](https://wiki.t2linux.org/). I didn't actually fix things like Bluetooth — don't need it anyway — but I did get it booting faster. Unfortunately I still have repeated issues with every Proxmox update.

## Beelink

My [Beelink](/2023/08/08/adventures-in-windows-proxmox-virtualisation/#attempt-3--beelink) is now a router running [OPNsense](https://opnsense.org/). It's incredible. No more network issues. I've tried a few WiFi/router combos but even the expensive ones are prone to issues. Beelink + switch + WiFi access point has been perfect. The Beelink also runs a VPN exit node using [Tailscale](https://tailscale.com/) and DNS with [AdGuardHome](https://github.com/AdguardTeam/AdGuardHome).

## New Uses

I want to rebuild the **Mac Mini** and see if I can fix Proxmox permanently. Or maybe just retire and sell it. That means moving all my containers and VMs onto other devices. It'll be a slow process.

For the **ZimaBlade** the obvious choice is a mini [NAS](https://en.wikipedia.org/wiki/Network-attached_storage). I've installed Proxmox on it too. I'm going to try out both [TrueNAS Scale](https://www.truenas.com/truenas-scale/) and [Unraid](https://unraid.net). I expect Unraid to be more suitable at this size. With only 32GB eMMC storage I'd have to run most VMs from a NAS share. It should make a great download and media server. I'd also like to try PCI passthrough with a graphics card if I can find a suitable one.

The **Pi 5** has a slower CPU and only 8GB RAM but has the much faster and larger 500GB NVMe. This would be a good home for my [Gitea server](https://about.gitea.com/). The Pi doesn't run Proxmox but everything is Docker-ised. I'll probably house a lot of services here.


I've shelved my older 2014 Mac Mini. It's basically an antique now.

That's all for now!
