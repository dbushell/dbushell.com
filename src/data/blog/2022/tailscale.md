---
date: 2022-08-18 10:00:00+00:00
slug: tailscale
title: 'Tailscale'
description: 'The one where I try a new service'
---

I have a rule of thumb; avoid products and services that advertise on any podcast I listen to. They over hype and under deliver and I always get burnt. This is no more true than with VPNs. So it was a long time before my curiosity got the better of me and I looked into Tailscale.

## What is Tailscale?

[Tailscale](https://tailscale.com) is not your average VPN. I've used VPNs before for two reasons:

* To protect my Internet access from snooping network providers.
* To access client staging servers on their internal network.

Tailscale gives you your own private network that magically connects all your devices. Each device gets an `100.x.y.z` IP address on the VPN.

Say I'm in a coffee shop on public WiFi. My laptop can access my media server at home via my Tailscale network. Traffic is routed securely and encrypted over the WiFi, the Internet, and my LAN at home. It "just works" regardless of any NAT and firewall in the way. See [How Tailscale works](https://tailscale.com/blog/how-tailscale-works/) — it's exceptionally clever.

Prior to using Tailscale I had manually configured OpenWRT and WireGuard on [my home router](/2020/07/02/hardware-home-servers-self-hosted-raspberry-pi/). It's a painful process to set up keys, configure devices, open ports, and lock down access. Tailscale does all this for you.

## iPhone App and Exit Nodes

I configured my Mac Mini at home as an ["exit node"](https://tailscale.com/kb/1103/exit-nodes/) on my Tailscale network. When I'm away from home all my iPhone traffic is routed via the Mini encrypted.

Unfortunately the Tailscale iPhone app drains battery alarmingly fast when active. There has to be some bug here.

<picture class="Image">
  <source
    srcset="/images/blog/2022/tailscale-battery.avif"
    type="image/avif">
  <img
    src="/images/blog/2022/tailscale-battery.png"
    alt="Tailscale iPhone app battery usage"
    loading="lazy"
    width="1170"
    height="395">
</picture>

There is significant drain with the Tailscale app (whether or not iOS attributes battery usage fairly). I was able to leave the WireGuard app connected all day with little overhead. Proton VPN is also nowhere near this hungry.

Like other VPN apps I'd like to see support for _“Connect On Demand”_ (under iOS Settings > VPN). So when I leave my home WiFi the iPhone automatically joins via the exit node. This would alleviate unnecessary battery usage.

## DNS and Droplets

Tailscale can optionally configure a global DNS nameserver for devices.

So why not make my own DNS server? I set up the [Unbound DNS resolver](https://unbound.docs.nlnetlabs.nl/en/latest/) and [Pi-hole](https://pi-hole.net/) on a $5 Digital Ocean droplet (VPS).

Binding this service to port 53 on a public IP address is asking for trouble. Bots can and will find open ports. I’ve done that before accidentally. A friendly bot found it and periodically spammed DNS requests for a domain hosting a website alerting me to the issue. Good bot.

I installed Tailscale on the droplet server. I then bound the DNS service to the Tailscale and loopback interfaces only. Finally I **blocked all inbound traffic** with the droplet firewall. Only outbound traffic is allowed. I don't even need port 22 open for SSH access (Tailscale can handle that too). Now my droplet and DNS service are only accessible to devices on my Tailscale network.

Using a private network this way makes it so easy to access and secure services across the Internet. Without Tailscale I'd have to configure all kinds of authentication and firewall — way out of my comfort zone.

## Privacy

All Tailscale traffic is encrypted with the WireGuard protocol. Tailscale does the magic to synchronise keys and connections between devices. For that to work you obviously have to trust their software and apps. Not all of the official Tailscale software is open source. I'm very interesting in [Headscale](https://github.com/juanfont/headscale) which is an alternate open source implementation of the control server. Unfortunately the iOS app is not compatible yet.

What concerns me somewhat is the data Tailscale collects on internal networks. Their privacy policy is your typical catch-all hand-wavy vague legalese. They need some data for the service to work. But just how much network activity do they collect and log?

At the end of the day, a service like Tailscale lives and dies by its reputation. One privacy blunder would destroy them. Tech-savvy audiences enjoy holding a grudge. As of writing, Tailscale are at least saying and doing the right things for me to take the risk.

I hope their business model allows them to remain independent. I hate to be pessimistic but I fully expect a tech giant to buy them out. That would mean an inevitable decline in quality and ethics. [Their privacy policy](https://tailscale.com/privacy-policy/) makes sure to cover _"Sale of business"_.


* * *

Basically Tailscale does one thing extremely well and the accompanying features aren't bad either. The free tier suits me very well too! It's a shame the iOS app needs work but I expect they'll fix that.
