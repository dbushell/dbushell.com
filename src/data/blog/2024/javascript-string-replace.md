---
date: 2024-02-01 10:00:00+00:00
slug: javascript-string-replace
title: 'Thought You Knew String Replace?'
description: 'The one where I learn something new about something old'
---

You know `String.prototype.replace()` in JavaScript?

This method takes two parameters: `pattern` and `replacement`.

* **Pattern** is usually a string or regular expression. Technically it can be any object with a `Symbol.replace` method (like a `RegExp`).
* **Replacement** is either a string or function that returns a string.

Using a regular expression gives access to capture groups in the replacement.

```javascript
'dbushell.co.uk'.replace(/(.+?\.).*/, '$1com');
```

Here I’m capturing the domain name in group `$1` and replacing the TLD. Check out the MDN docs for [function replacement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_function_as_the_replacement) I'm not going into that here.

If **both parameters** are strings:

```javascript
'dbushell.co.uk'.replace('co.uk', 'com');
```

Simple, right? No gotchas?

## String Replacement Gotchas

Of course there are gotchas! Even with two strings, the replacement string still has special patterns, despite having no capture groups.

* `$&` - Inserts the matched substring
* <code>$&#96;</code> - Inserts the string that precedes the match
* `$'` - Inserts the string that follows the match

Try this example:

```javascript
'badger'.replace('badger', '$& $& $&');
```

If the replacement string happens to contain a dollar sign immediately followed by an ampersand, backtick, or single quote, the output is very confusing if you were oblivious to this feature like I was. Possible another moment of [things I've read and forgot](/2023/11/24/json-anything/).

This issue can be avoided by using an escape character. That is another `$` meaning `$$&` will insert `$&` and not the matched substring. `$$` will insert a single `$` etc.

I discovered this when I tried to blog about [Bun Shell](https://bun.sh/blog/the-bun-shell). Bun Shell uses a [template literal tag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) that happens to be a dollar sign. The example Bun code includes:

```javascript
import { $ } from "bun";
const text = await $`ls *.js`.text();
```

My naive static site generator was doing:

```javascript
const document = template.replace('%CONTENT%', content);
```

When it reached the Bun example in `content` it replaced <code>$&#96;</code> with the entire `template` HTML preceding it. I was thoroughly confused as to why duplicate headers were rendered. I also ran into the same issue before with Svelte's special `$$props` variable and never realised why it came out as `$props` (single dollar). Now I know why!

After blaming everything but my code, I eventually learned about the special patterns noted above. I whipped up a quick helper function to avoid `String.replace` entirely:

```javascript
function replace(subject, search, replace = '', all = false) {
  let parts = subject.split(search);
  if (parts.length === 1) return subject;
  if (!all) parts = [parts.shift(), parts.join(search)];
  return parts.join(replace);
}
```

This is probably a silly solution but I can't figure out the best way to escape my content. I don't want to start adding extra `$` in the source markdown.



I feel like there should be a simple one-liner to escape the replacement content. My google-fu is failing me. There has to be an easy escape technique? Surely this is a solve problem! Let me know what I'm missing on [Mastodon](https://dbushell.com/mastodon/).

I'll update here if I discover the answer.
