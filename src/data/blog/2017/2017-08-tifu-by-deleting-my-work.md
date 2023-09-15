---
date: 2017-08-15 10:00:00+00:00
slug: tifu-by-deleting-my-work
title: '#TIFU by deleting my work'
description: 'I lost two days’ work 😱 (and restored it from Chrome’s cache 😅)'
---

Ever get that feeling you’ve lost something?

![me after deleting two days’ work](/images/blog/2017/scared-spongebob.gif)

I’ve long been a paying user of CodePen. It’s nice for sharing snippets, quick mock-ups, or messing around with code. [CodePen Projects](https://codepen.io/pro/projects) is a newish addition. It provides a more complete development environment.

A mini-project came along for a client that gave me the perfect excuse to try CodePen Projects.

Development was smooth. Right up until my main JavaScript file disappeared. I can’t say for sure why. I was dragging files around. Renaming stuff. The UI started to feel a little clunky. I had several instances of the project open. All I know is my file had vanished. A bug? Most likely my own stupidity. No way of knowing for sure. All I know is there was a distinct lack of two day’s worth of JavaScript.

It was good code too, I’d even commented it.

The slow realisation that I may have to rewrite everything from memory was agonising. Refusing that fate, I thought long and hard…

🤔

Chrome’s cache!

I navigated to `chrome://cache/` (in Chrome, obviously). A quick search found the JavaScript file I’d lost. I then converted the hex dump to binary ([this Stack Overflow answer](https://stackoverflow.com/a/31616371) provided a solution). These hex dumps look like they can contain gzipped data, so an extra step may be necessary to decode. I didn’t have too.

I’m very lucky!

I’m also — for the time being — returning to my offline editor which can backup and commit to source control. I do love me some CodePen, it's not to blame here, but for larger projects I'm not comfortable without backups.

I was thinking of writing a script to make pulling files from the browser cache easier. But ensuring I'll never need to again is time better spent.

Be careful out there!
