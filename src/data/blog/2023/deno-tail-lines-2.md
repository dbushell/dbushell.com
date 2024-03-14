---
date: 2023-10-27 10:00:00+00:00
slug: deno-tail-lines-2
title: 'Get in Line, Deno!'
description: 'The one where I read lines even faster'
---

I’ve updated my [Deno Tail Lines](https://github.com/dbushell/deno_tail_lines) module to improve performance. See my [original blog post](/2023/03/14/deno-tail-lines/) for a quick intro. Reading a file backwards is trickier than it sounds!

The Deno standard library has a new [`TextLineStream`](https://deno.land/std@0.204.0/streams/mod.ts?s=TextLineStream). This is a useful addition. However, If you only want the last ten lines, for example, you have to skip through the entire file:

```javascript
import {TextLineStream} from 'https://deno.land/std/streams/mod.ts';
let lines: string[] = [];
const file = await Deno.open('example.log');
const lines = file.readable
  .pipeThrough(new TextDecoderStream())
  .pipeThrough(new TextLineStream());
for await (const line of lines) {
  lines.push(line);
}
lines = lines.slice(-10);
```

Don’t do this! It’s very, *very*, slow when you have thousands of lines. It has to read the entire file into memory too.

That’s why I made **Tail Lines**. It’s many times faster and more efficient only reading the necessary bytes. My first implementation required two passes. One to read the line feed offsets and a second to go back and read text lines. I’ve now refactored the whole thing from scratch to use a single pass and it’s even faster.

The API remains the same:

```javascript
import {tailLines} from 'https://deno.land/x/tail_lines/mod.ts';
const file = await Deno.open('example.log');
for await (const line of tailLines(file, 10)) {
  console.log(line);
}
```

This example will output the last ten lines. For a log file that would be reverse-chronological order.

The `tailLines` function is a small wrapper around a new [TailLineStream](https://github.com/dbushell/deno_tail_lines/blob/main/src/stream.ts) class I’ve coded under the hood.

```javascript
import {TailLineStream} from 'https://deno.land/x/tail_lines/mod.ts';
const file = await Deno.open('example.log');
const stream = new TailLineStream(file);
const textDecoder = new TextDecoder();
for await (const line of stream) {
  console.log(textDecoder.decode(line));
}
```

It's a [readable stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) so you can use pipes:

```javascript
const stream = new TailLineStream(file)
  .pipeThrough(new TextDecoderStream());
for await (const line of stream) {
  console.log(line);
}
```

However, if you just need text decoding use `tailLines` it’s slightly faster.

* * *

Web streams are neat. [I made an XML stream](/2023/10/20/xml-streamify/) recently.

Speaking of lines, I’ve published another project called [Carriageway](https://github.com/dbushell/carriageway).

> Run async and promise-returning functions with limited concurrency and optional rate limiting.

More on that soon!
