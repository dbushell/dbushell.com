---
date: 2020-02-07 10:00:00+00:00
slug: docker-wordpress-portless-localhost-domains
title: 'Docker, WordPress, and Portless Localhost Domains'
description: 'The one where I share a project to manage WordPress containers in Docker.'
---

The [Docker](https://www.docker.com/) life chooses you. I bet a lot of developers have had a similar introduction. You're brought onto a project and it's like; "_Hey we're using Docker, just run 'docker-compose up'._" they say, "_Sure, I know Docker,_" you shrug. Then you spend the better part of the week debugging.

I've worked on maybe two dozen sites with the help of Docker over the years. The majority of them WordPress. The configuration file I've been using has evolved from a complete mystery that I stole from the experience above, to something I've been able to tweak after 'learning' Docker on the job.

One problem has been a thorn in my side.

## Virtual Hosts

Only one container can listen on localhost port 80 so you end up with:

```
my-blog.localhost:8081
acme-corp.localhost:8082
127.0.0.1:8090
vaporware.localhost:9000
```

Port juggling sucks. Even after avoiding conflicts, having to remember the port number diminishes the value of a domain. The solution is a **reverse proxy**. This can be achieved with [Traefik](https://docs.traefik.io/), which I could not figure out, or [NGINX](https://www.nginx.com/), which I did; [nginx-proxy](https://github.com/jwilder/nginx-proxy/) by _Jason Wilder_ automates like magic.

After finding a happy solution I went back to update older projects. Rather than continuing to maintain what are effectively identical config files, I've bundled a set of reusable templates and scripts into an NPM package.

## Docker WordPress Scripts

I've started a small project to help manage WordPress containers in Docker.

![Docker WordPress Scripts](/images/blog/2020/dws-logo.svg)

Have an early look at [Docker WordPress Scripts on GitHub](https://github.com/dbushell/docker-wordpress-scripts).

DWS helps manage:

* A reusable `docker-compose.yml` template (WordPress, MariaDB, phpMyAdmin)
* A single instance of NGINX and [Portainer](https://www.portainer.io/) with config files
* WordPress CLI installation and set up
* PHP config files

When I start a new WordPress project I can just run:

```
$ dws up

🐹 Success: WordPress is up and running!
phpMyAdmin: ➜ http://pma.wpdemo.localhost
WordPress:  ➜ http://wpdemo.localhost
```

It will spin up new containers for my project and I'm good to go.

The scripts are mostly wrappers for the `docker-compose` command. I no longer need to maintain any config files in individual repositories. But if I wanted to later, I can run `dws eject`. This command copies everything to the project directory and moves WordPress back to `localhost:8080` like my old set up.

### Work in Progress

This is somewhat of a personal project but it solves a fairly common problem so I'm sharing it for anyone to use and adapt. It's lacking in error feedback and I can't provide much support but [@dbushell](https://twitter.com/dbushell) on the chance I have a quick answer.

I'll continue to improve DWS as I work with it in the coming months. The underlying interface with `docker-compose` is rather jury-rigged at the moment but it does the job. There are probably existing APIs I can utilised to improve this part immensely.

If you want to set up a reverse proxy without the help of DWS take a look at the [compose files in this directory](https://github.com/dbushell/docker-wordpress-scripts/tree/master/config).

You can find more extensive [documentation on GitHub](https://github.com/dbushell/docker-wordpress-scripts/blob/master/README.md).

<style>
.b-post [src$="dws-logo.svg"] {
  background: #fff;
  padding: 1.5rem;
  width: 300px;
}
</style>
