---
date: 2024-06-07 10:00:00+00:00
slug: missing-podcast-durations
title: 'Missing Podcast Durations!'
description: 'The one where I’m left perplexed!'
---

It ain't easy building a personal [podcast app](https://github.com/dbushell/sauroPod/). My struggle this week is *durations*. I noticed recent episodes of [Late Night Linux](https://latenightlinux.com/) were missing them. Same too for the [Lex Fridman Podcast](https://lexfridman.com/podcast/) and [Shop Talk](https://shoptalkshow.com/).

At first I thought something was wrong with my code. After a bit of debugging I discovered that the RSS feeds are simply missing the `itunes:duration` tag. Shop Talk does have the tag for episode 618 but it's zero:

```xml
<itunes:duration>0:00</itunes:duration>
```

What on earth is going on here!

Are we not doing durations any more? Did I miss the memo?

There must be something in common with these podcasts. Their website and feeds are all using WordPress and various podcast plugins. Is that responsible? I can see Lex Fridman uses [Blubrry](https://blubrry.com/), Late Night Linux uses [Libsyn](https://Libsyn.com/), and Shop Talk uses [Simplecast](https://www.simplecast.com/). What role do those services play? Is Apple's iTunes API involved? I have no idea.

Where and when are durations even calculated? I realise I know *absolutely nothing* about podcasts! Do they all use a library like FFMPEG that is bugged? Or my own [crude script](https://jsr.io/@dbushell/audio-duration) — good lord, I hope not!

I think the Shop Talk issue may be unrelated because the tag does at least exist. Is it just coincidence the other two are missing it? Will I ask more questions without answers? I'm stumped for now. I've reached out on Mastodon to see if the authors know.

I have a feeling the durations will suddenly reappear and I'll never know why!

[Someone tell me](https://fosstodon.org/@dbushell) I'm not going crazy!

I'll update here if the mystery is ever solved.
