---
date: 2023-09-01 10:00:00+00:00
slug: docker-vpn-proxy-container-part-2
title: 'VPN Containers (Part 2)'
description: 'The one where I tunnel through Docker (again)'
---

I recently wrote about *["Docker VPN and Proxy Containers"](/2023/04/17/docker-vpn-proxy-container/)* to provide easy VPN access for containers and other software.

For the last few months my setup used [Protonwire](https://github.com/tprasadtp/protonvpn-docker) and a [Go Socks5 proxy](https://github.com/serjs/socks5-server). This combination had issues. Protonwire moved away from the now deprecated [ProtonVPN CLI](https://github.com/ProtonVPN/protonvpn-cli). The new official CLI ["doesn’t run on headless servers"](https://protonvpn.com/support/linux-vpn-tool/) which I feel is a glaring design flaw. Anyway, the unofficial Protonwire moved to its own Bash scripts to manage connectivity. I found the new version to be unreliable. The proxy I was using was even less reliable forcing me to restart the container often. Ideally this should be set and forget.

## Gluetun

Eventually I found [Gluetun](https://github.com/qdm12/gluetun) which is described as a:

> VPN client in a thin Docker container for multiple VPN providers, written in Go, and using OpenVPN or Wireguard, DNS over TLS, with a few proxy servers built-in.

With Gluetun it's easy to configure [Firewall networking](https://github.com/qdm12/gluetun-wiki/blob/main/setup/options/firewall.md).

For LAN and [Tailscale](https://tailscale.com/kb/1015/100.x-addresses/) networks I added:

```ini
FIREWALL_OUTBOUND_SUBNETS=192.168.0.0/16,100.64.0.0/10
```

Without any firewall rules the VPN container is completely isolated which may be desirable. For Docker networks something like `172.16.0.0/12` may be needed. I'm guessing, I've not needed that right now.

I've only had Gluetun running for a week but my previous setup failed to achieve uptime longer than a few days. So far so good. Gluetun is looking like a winner!

For a brief spell I tried the [linuxserver.io WireGuard](https://github.com/linuxserver/docker-wireguard) container. It does work but manually configured WireGuard isn't fun. It lacks any additional features to help with DNS, health check, and firewall configuration. I still needed an accompanying proxy service. Gluetun is the all-in-one solution I was looking for.
