---
date: 2021-01-11 10:00:00+00:00
slug: self-hosted-raspberry-pi-docker
title: 'Self Hosted (part 2)'
description: 'The one where I expand my Raspberry Pi collection 🍓'
---
This is a follow up to [my ongoing adventures in self-hosting](/2020/07/02/hardware-home-servers-self-hosted-raspberry-pi/). My goal is to avoid 3rd party internet services that have a habit of unreliable connectivity, tracking, and bait-and-switch payment models. It's also just a fun nerdy hobby.

As a home server I’ve been running a Raspberry Pi 4 (4GB) with Ubuntu on the SD card and an external USB drive attached. Services are all Docker containers (except Pi-hole, which I didn't realise I could container at the time).

Santa was kind enough to deliver an [Argon ONE M.2 case](https://www.argon40.com/argon-one-m-2-case-for-raspberry-pi-4.html). I picked up a new RPi 4 8GB model to avoid having to tear down my old server too early. That’s my excuse, I wasn’t just being greedy with the RAM.

<p class="Image">
  <img loading="lazy"
    src="/images/blog/2021/argon-one-m2.jpg"
    alt="Argon ONE M.2 case for Raspberry Pi 4"
    width="1024"
    height="640">
</p>

The Argon case is neat. Like the Flirc cases I've been using they act as a giant heat sink. Argon includes a programmable fan for active cooling too. The best feature though is the enclosed SSD. Mostly enclosed — the USB bridge isn’t ideal but I understand the design choice. On a scale of not a Cylon, to definitely a Cylon, the Argon ONE M.2 ranks respectably.

My goal with this case was to boot straight off of the SSD and remove the SD card entirely. Thus removing the biggest bottleneck with RPis.

It seems like new RPis have the updated firmware allowing [USB mass storage boot](https://www.raspberrypi.org/documentation/hardware/raspberrypi/bootmodes/msd.md). I flashed Raspberry Pi OS onto an SD card and booted in to make sure. I also had to use `raspsi-config` to change the boot order. Amazon practically gives away Sandisk SD cards during their sales so I’ve no shortage of those.

## Operating Systems

The official RPi OS is still 32-bit and I've found the packages to be rather outdated. I flashed Ubuntu Server 20.04 onto the SSD. Some boot file config was required. I had issues with the compressed Linux kernel. If I reboot after a kernel update without fixing it I’d have to mount the drive to another machine to do so. I made no notes so I'll inevitably forget. Not really a problem because I’m running all services in Docker containers now with external back-ups for the mounted data. I can nuke and pave quickly should I need to.

After giving the new RPi 4 8GB a few days to prove itself reliable I shut down my old server on the 4GB RPi. With that free I experimented USB booting **Manjaro ARM** minimal edition. Manjaro booted no problem. I could immediately SSH to the first time setup script. Compared to Ubuntu, the number of default packages and system services is much smaller and the initial memory footprint is tiny. The parent OS doesn’t really matter because I’m using Docker containers for everything. Though I am finding a preference for Arch-based Linux and every bit of free memory is valuable. I’ll run both for a few months before deciding which OS to use longterm.

The final hardware change I made was to retire my old RPi 1B. I figured out how to setup WireGuard on my router for a more secure entry point into my LAN. No more port forwarding.

As for other software changes, I've made quite a few. I'll leave that for my next blog update. Shout out to [Perfect Media Server](https://perfectmediaserver.com/). I'm giving that a good read.
