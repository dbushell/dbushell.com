---
date: 2024-02-27 10:00:00+00:00
slug: a-fun-line-of-code
title: 'A Fun Line of Code'
description: 'The one where I enjoy coding'
---
Code can be fun and creative. Sometimes I have to rein myself in otherwise I'm prone to writing creative code for creativity's sake. That is not always the most readable. Occasionally though the fun solution is the best.

I was updating my [Deno Audio Duration](https://github.com/dbushell/deno_audio_duration/) package to publish it on [JSR](/2024/02/16/jsr-first-impression/) and I was reminded of a fun bit of code. This script gets the millisecond duration of MP3 and M4A audio files in native Deno without any dependencies. There are existing JavaScript libraries to parse audio files but they're big. All I need is the duration.

One easy method to get duration is by calling `ffprobe` or `exiftool` via [`Deno.Command`](https://deno.land/api@v1.40.5?s=Deno.Command) but this depends on a 3rd party binary. A fast way to bloat Docker images.

MP3 files have no metadata for duration. It must be estimated after parsing frames, sample rate, bitrate, etc. [My MP3 solution](https://github.com/dbushell/deno_audio_duration/blob/v0.2.4/src/mp3.ts) adapted code from other open source projects to use Deno APIs with added types.

M4A audio files, M4B audiobooks, and MP4 videos, use the same container spec which *does* have metadata for duration. [My M4A solution](https://github.com/dbushell/deno_audio_duration/blob/v0.2.4/src/m4a.ts) searches for the "movie header atom" where the secret is stored.

This data is usually at the start of the file. A logical place allowing for fast inspection. However, that is not required. From testing on my audiobook library the metadata can be seemingly anyway, often towards the end. I've even found it smack-bang in the middle of one lengthy audiobook.

That leads us to one of my favourite line(s) of code:

```javascript
export const m4aDuration = async (path: string): Promise<number> => {
  const controller = new AbortController();
  const duration = await Promise.race([
    search(path, controller.signal),
    search(path, controller.signal, true)
  ]);
  controller.abort();
  return duration;
};
```

Specifically `Promise.race`.

[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) might just be my favourite JavaScript API. When combined with `async` `await` writing asynchronous code is fun.

What the code above does it set up two asynchronous calls to search for the MP4 header. The first searches forwards from the start of the file, the second backwards from the end.

The `race` resolves when one of the two returns the duration.

By default the other promise actually continues in the background after the race has resolved. If left alone it either resolve into the ether, or potentially reject not as quietly. To stop it I'm using an `AbortController` to signal it to give up. The internal loop breaks with `if (signal.aborted) break;` and closes the file handle.

This is not the fastest code in the world. But for a native < 100 line implementation it works wonders.

I find the idea of racing code fun! And this is a legitimate use case! Don't @ me and ruin the dream. More than two promises can be raced. Have you ever seen that in the wild?

Have fun coding!
