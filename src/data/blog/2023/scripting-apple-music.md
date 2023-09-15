---
date: 2023-01-20 10:00:00+00:00
slug: scripting-apple-music
title: 'Scripting Apple Music'
description: 'The one where I bring JavaScript to Apple Music'
---

Hey. I've been busy!

Last year I started [coding my own **Stream Deck** software](/2022/10/14/deno-usb-hid-stream-deck/) to support plugins via `WebSocket`.

I've also been giving Apple Music a listen (over Spotify). The Music apps on macOS and iOS are rubbish. The macOS app is woefully slow. So the less time spent using it the better. I've also found the sound function keys on the Apple keyboard unreliable.

Apple Music can be controlled with the `osascript` command and AppleScript and better yet JavaScript! The highest tier of scripting languages.

I whipped up this script:

```javascript
// music.js
function run(input) {
  const Music = Application('Music');
  const props = {
    state: 'stopped'
  };
  if (!Music.running) {
    return JSON.stringify(props);
  }
  switch (input[0]) {
    case 'stop':
      Music.stop();
      break;
    case 'play':
      Music.play();
      break;
    case 'pause':
      Music.pause();
      break;
    case 'next':
      Music.nextTrack();
      break;
    case 'previous':
      Music.previousTrack();
      break;
    default:
      break;
  }
  props.state = Music.playerState();
  if (['playing', 'paused'].includes(props.state)) {
    props.id = Music.currentTrack().id();
    props.artist = Music.currentTrack().artist();
    props.album = Music.currentTrack().album();
    props.song = Music.currentTrack().name();
    props.duration = Music.currentTrack().duration();
    props.position = Music.playerPosition();
  }
  return JSON.stringify(props);
}
```

The command `osascript music.js` with no arguments returns:

```json
{
  "state": "playing",
  "id": 2376,
  "artist": "Rick Astley",
  "album": "Whenever You Need Somebody",
  "song": "Never Gonna Give You Up",
  "duration": 213.572998046875,
  "position": 4.849999904632568
}

```

The actual output is unformatted.

Quickly followed by `osascript music.js stop`:

```json
{"state":"stopped"}
```

With Deno I run the command and parse the output. For example:

```javascript
const process = Deno.run({
  cmd: ['osascript', 'music.js', 'play'],
  stdout: 'piped'
});

const [status, stdout] = await Promise.all([
  process.status(),
  process.output()
]);
process.close();

if (status.success) {
  let output = new TextDecoder().decode(stdout);
  output = JSON.parse(output);
  console.log(output);
}
```

With that I've got control over Apple Music in my preferred JavaScript runtime. I run a little Deno service on my Mac that connects to my Stream Deck using a WebSocket. I still need to tidy up and publish the plugin code. [The base framework](https://github.com/dbushell/deno_streamdeck) for this is on GitHub.

Now I wonder what other apps would benefit from a custom keyboard?
