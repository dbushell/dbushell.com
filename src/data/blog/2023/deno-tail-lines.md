---
date: 2023-03-14 10:00:00+00:00
slug: deno-tail-lines
title: 'Tail Lines in Deno'
description: 'The one where I read lines'
---

Reading lines from a text file is easy with Deno:

```javascript
import {readLines} from 'https://deno.land/std/io/mod.ts';
const file = await Deno.open('example.log');
for await(const line of readLines(file)) {
  // Do something...
}
file.close();
```

At least, if you're reading from the first line to the last.

To implement this you basically have to read one byte at a time until you find a [newline character](https://en.wikipedia.org/wiki/Newline). That is `0x0A` in hexadecimal and `\n` escaped in a string. Windows uses the `\r\n` sequence so trim off the carriage return byte if you care. Reading one byte from disk is very slow so for speed data needs to be buffered.

There is no magic way to know how many lines there are until the entire file is read. If you want the last 10 lines of a ~1 GB log file with 100000-ish lines it takes an eternitely to read every line and throw away the first 99990.

There is a unix command called `head`:

```shell
head -n 1 example.log
```

And the accompanying `tail`:

```shell
tail -n 1 example.log
```

Where `-n 1` reads N lines from the top or bottom respectively.

The Deno [standard library](https://deno.land/std@0.179.0/io/mod.ts) has plenty of utilities to help read text files. Unfortunately they all work reading forwards. `readLines` is perfect to replicate `head`. There's no direct help for `tail`.

I've had a go at implementing this myself.

[**Checkout Deno Tail Lines on GitHub.**](https://github.com/dbushell/deno_tail_lines)

My module provides two functions. The `tailLine` function returns up to the `maxLines` from the end of a text file.

To read at most the last 10 lines:

```javascript
import {tailLine} from 'https://deno.land/x/tail_lines/mod.ts';
const lines = await tailLine('example.log', 10);
```

The last line of the returned array is the last line of the text file.

The `tailLines` function is an async generator similar to `readLines`. It iterates over lines in reverse. So the first yield is the last line of the text file.

```javascript
import {tailLines} from 'https://deno.land/x/tail_lines/mod.ts';
const file = await Deno.open(path);
for await (const line of tailLines(file)) {
  // Do something...
}
file.close();
```

The `maxLines` parameter is optional for the iterator function.

I've written [more about performance](https://github.com/dbushell/deno_tail_lines#performance) in the repo README but it's very fast for reading a small number of lines from the end of a large file.

Find this module on [GitHub](https://github.com/dbushell/deno_tail_lines) and [Deno](https://deno.land/x/tail_lines).

I accidentally published the module twice on [Deno third party modules](https://deno.land/x) — whoops! Anyone at Deno care to remove the `taillines` module? Kinda makes sense that it is immutable because deleting modules could break project dependencies. But Deno uses URL imports, so this could be solved with HTTP redirects? Anyway, use `tail_lines`.
