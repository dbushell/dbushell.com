---
date: 2023-09-13 10:00:00+00:00
slug: mesonic2-podcast-index-api
title: 'A Very Helpful API'
description: 'The one where I debug a very helpful API'
---

[Two years ago](https://github.com/dbushell/mesonic) I built my own experimental media server + web app. It plays audiobooks and podcasts. Earlier this year I rewrote [meSonic²](https://github.com/dbushell/mesonic2) from scratch. I corrected old bugs and design flaws in favour of new bugs and design flaws.

I rewrote the [SvelteKit](/2023/06/26/sveltekit-oauth-deno-deploy/) front-end. I coded an [audio duration module](https://github.com/dbushell/deno_audio_duration) to remove a big dependency on `ffmpeg`. I added proper [SQLite](https://github.com/denodrivers/sqlite3) integration. I also made heavy use of the [Podcast Index API](https://podcastindex.org/) to avoid parsing XML feeds.

All in all v2 is a big improvement. There are issues I'll correct in due course, but no showstoppers. That was until last week! Podcasts stopped syncing 😱

## The Error

My app runs in a Docker container. The log was flooding with this error:

```console
02/09/2023 07:22:00 Error: 401 Unauthorized
    at fetchFromFresh (file:///mesonic/server/cache/worker.ts:254:11)
    at eventLoopTick (ext:core/01_core.js:183:11)
    at async fetchAndCache (file:///mesonic/server/cache/worker.ts:196:5)
```

`401 Unauthorized` is the HTTP status returned from the [Podcast Index API](https://api.podcastindex.org/). The API is free to use but requires a key and [authentication headers](https://podcastindex-org.github.io/docs-api/#auth) with each request.

I figured maybe my key had expired. Or maybe I'd been blocked for some reason. In testing my key was still valid. The documentation pages allow you to set a key and test endpoints — very cool. My API key worked just fine.

I edited my code to log the full response body. Adding more console logs is how debugging works, right? Lo and behold the body had an detailed error explanation:

> X-Auth-Date header value is not within the +/- 3 minute time window.  Please see: https://podcastindex-org.github.io/docs-api/#overview--authentication-details

Wow! Much appreciated!

## The Fix

I had the error but I was confused as to why my implementation had stopped working.

The API requires three auth headers:

* `X-Auth-Key` — *"Your API key string"*
* `X-Auth-Date` — *"The current UTC unix epoch time as a string"*
* `Authorization` — *"A SHA-1 hash of the X-Auth-Key, the corresponding secret and the X-Auth-Date value concatenated as a string"*

I guess the date is used this way so that API requests cannot be captured and replayed?

Anyway, since my code had been working unchanged for months, and my API key was still valid, the only explanation was that somehow it started using **the wrong date**.

Nothing wrong with my code:

```javascript
const authKey = env.get('PODCASTINDEX_APIKEY');
const authDate = Math.floor(Date.now() / 1000).toString();
const authorization = await sha1Hash(
  `${authKey}${env.get('PODCASTINDEX_SECRET')}${authDate}`
);
headers.set('x-auth-key', authKey);
headers.set('x-auth-date', authDate);
headers.set('authorization', authorization);
```

Even I'm incapable of coding `Date.now()` wrong. I've made plently of bugs out of [daylight savings](/2020/03/27/debugging-a-todo-app/) before but now being early September this is unrelated.

The Docker container is running inside a [Proxmox virtual machine](/2023/08/08/adventures-in-windows-proxmox-virtualisation/).

I SSH'd into the VM and ran `timedatectl`:

```
               Local time: Tue 2023-09-02 10:05:59 BST
           Universal time: Tue 2023-09-02 09:05:59 UTC
                 RTC time: Tue 2023-09-02 09:05:59
                Time zone: Europe/London (BST, +0100)
System clock synchronized: no
              NTP service: inactive
          RTC in local TZ: no
```

Sure enough the VM date & time was **five minutes behind**.

This was the source of my error. There was nothing to keep time synchronized. I'm guessing the server time slowly drifted as the VM was occasionally restarted. Whatever minimal Debian 12 install I setup had no NTP service. Not something I even thought to consider. In the past I've used Ubuntu where "minimal" has a broader definition.

I fixed this with `apt install chrony`. I restarted the Docker container and the Podcast Index API was happy to accept my requests again!

## The Thanks

Big thanks to the Podcast Index team for such a thoughtful API design and documentation.

I can't imagine how long it would have taken me to find the root cause had it not been for the response body. With only a `401 Unauthorized` to go on I'd have wasted hours testing API credentials on my local machine and failed to replicate the bug.

Not even Docker was able to solve the *"works on my machine"* in this case. Docker in a VM is not as crazy as it sounds. I should blog on that in future.
