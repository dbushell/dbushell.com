---
date: 2023-04-17 10:00:00+00:00
slug: docker-vpn-proxy-container
title: 'Docker VPN and Proxy Containers'
description: 'The one where I tunnel through Docker'
---

Setting up a VPN in a Docker container is very useful. You can utilise it in various ways without tunneling your entire network traffic through the VPN.

I'm currently using [ProtonVPN](https://protonvpn.com/) and [Protonwire](https://github.com/tprasadtp/protonvpn-docker) as the container. It wouldn't be too difficult to roll your own container if the VPN has CLI software (or OpenVPN or WireGuard config).

My Docker compose starts with:

```yaml
services:
  protonvpn:
    container_name: protonvpn
    image: ghcr.io/tprasadtp/protonwire:latest
    networks:
      # Docker network to provide VPN access
      - vpn
    ports:
      # Expose port of the proxy container
      - "1080:1080/tcp"
```

The `vpn` network is an external [overlay network](https://docs.docker.com/network/overlay/) referenced in the config:

```yaml
networks:
  vpn:
    external: true
```

And created like so:

```shell
docker network create -d overlay --attachable vpn
```

A `bridge` network can work if the containers are on a single machine. An `overlay` network allows docker containers on other machines to connect (via [docker swarm mode](https://docs.docker.com/engine/swarm/)).

Containers on the same bridge or overlay network can add:

```yaml
    network_mode: "container:protonvpn"
```

This forces the container to use the VPN for internet access.

Using the VPN is not limited to other containers.

In the same `docker-compose.yml` config I added a proxy service:

```yaml
  socks5:
    image: serjs/go-socks5-proxy
    container_name: socks5
    environment:
      - PROXY_PORT=1080
    depends_on:
      - protonvpn
    network_mode: "service:protonvpn"
```

Because `network_mode` is set to the VPN container the proxy port is not exposed here but on the vpn container. The proxy container allows VPN access from outside Docker by apps on the local system or network.

Proxy usage examples:

## Command Line

Many command line apps like `curl` allow you to specify a proxy option:

```shell
curl --proxy socks5://127.0.0.1:1080 https://icanhazip.com/
```

They may also respect the `https_proxy` environment variable:

```shell
https_proxy=socks5://127.0.0.1:1080 curl https://icanhazip.com/
```

## JavaScript / Deno

[Deno has an unstable API](https://deno.land/api@v1.32.3?unstable=&s=Deno.createHttpClient) that allows you to proxy fetch requests:

```javascript
const client = Deno.createHttpClient({
  proxy: {
    url: `socks5://127.0.0.1:1080`
  }
});
const response = await fetch(`https://icanhazip.com/`, {client});
console.log(await response.text());
```

## Firefox Tabs

[Firefox Multi-Account Containers](https://addons.mozilla.org/en-GB/firefox/addon/multi-account-containers/) is an official plugin by Mozilla. The plugin allows you to create sessions where local storage like cookies are separated. You can also configured these sessions to use a HTTP proxy.

<img
  src="/images/blog/2023/firefox-socks5-proxy.avif"
  alt="Firefox Multi-Account Containers"
  width="334"
  height="134">

This set up means that browsing the web using a VPN is as simple as opening a new tab. You could have multiple tabs open using multiple VPNs whilst others use non.

## Why?

For one, there's the obvious questionable content like downloading cars and seeding linux ISOs. It's also useful to test/hammer APIs when you're too lazy to read the documentation. Or you have a crazy idea like transfering files via web push notifications.

If you value your privacy and data at all you're probably aware of how insidious tracking and fingerprinting is across the web. I use a VPN to watch YouTube, for example.

I'm not going to promote one particular VPN but just warn that free/cheap should not be an attractive proposition for VPN services.

## DNS

Bear in mind that DNS queries may not be proxied using this set up. I have a separate and rather complicated set up to handle DNS (I should blog about that some day...). At the very least configure your router with an upstream DNS service like [Quad9](https://www.quad9.net/).

* * *

**Update:** I've written [VPN Containers (Part 2)](/2023/09/01/docker-vpn-proxy-container-part-2/)!

* * *

Have suggestions to improve this set up? [@dbushell](https://dbushell.com/twitter/)!

