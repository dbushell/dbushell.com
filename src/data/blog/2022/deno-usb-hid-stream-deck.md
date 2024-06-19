---
date: 2022-10-14 10:00:00+00:00
slug: deno-usb-hid-stream-deck
title: 'Deno Stream Deck'
description: 'The one where I code my own Stream Deck software'
---

[The **Stream Deck**](https://www.elgato.com/en/stream-deck) is a rather pricey keyboard. Each key is a programmable LCD at ~72×72 pixels depending on device. Like all Elgato products, the Stream Deck is designed for broadcasting but can be repurposed for general use.

The official Stream Deck software is a drag & drop UI with extensions. For non-techy users it's well designed with strong functionality.

To much ire Elgato have made little effort to support Apple Silicon. On macOS running on Rosetta the software is janky, bloated, and resource heavy. To Elgato's credit their devices — I own a few — have developer documentation and APIs not locked behind proprietary apps. If their software isn't up to par, I'll write my own! In JavaScript, of course!

<picture class="Image">
  <source
    srcset="/images/blog/2022/stream-deck.avif"
    type="image/avif">
  <img
    src="/images/blog/2022/stream-deck.jpg"
    alt="my Stream Deck attached to a Raspberry Pi running custom software"
    width="1008"
    height="756">
</picture>

So I did. It's running on a **Raspberry Pi** (zero 2 w). My intent is to go wireless. The Stream Deck housing is big enough to fit the Pi and a USB battery pack inside (I hope).


## Human Interface

Stream Decks are [USB HIDs](https://en.wikipedia.org/wiki/USB_human_interface_device_class) (human interface devices).

There is a low-level multi-platform [dynamic library](https://github.com/libusb/hidapi/) to interface with them. **Node.js** has a [popular bindings package](https://github.com/node-hid/node-hid/). One option I could have used.

There is also an experimental [WebHID API](https://developer.mozilla.org/en-US/docs/Web/API/WebHID_API) spec in the works. Only [chromium browsers](https://caniuse.com/?search=webhid) have some support for it. I was hoping **Deno** would have an unstable API ready but that's on low priority due to [difficulties in reliable testing](https://github.com/denoland/deno/issues/13893).

I like Deno too much to fall back to Node. I figured I could write similar Deno bindings for the HID dynamic library. [Deno FFI](https://deno.land/manual@v1.26.1/runtime/ffi_api) (foreign function interface) is the ticket. I stumbled around cross referencing the [C header file](https://github.com/libusb/hidapi/blob/master/hidapi/hidapi.h) and [types table](https://deno.land/manual@v1.26.1/runtime/ffi_api#supported-types) in the Deno docs. Decoding strings was a bit of guess work but I got there.

I've published my library as [Deno USB HID API](https://github.com/dbushell/deno_usbhidapi).

A basic search for connected devices is coded like:

```javascript
const vendorId = 0x0fd9; // Elgato
hid.enumerate(vendorId).forEach((hidInfo) => {
  // e.g. "Stream Deck MK.2"
  console.log(hidInfo.product);
});
```

The bindings are extremely fast but prone to segfaults if you do something unexpected. For example: trying to close a device pointer that isn't open. There is no `try` catching these errors. You need to be aware of what the dynamic library functions tolerate.

## Stream Deck Library

I've published another library called [**Deno Stream Deck**](https://github.com/dbushell/deno_streamdeck). This is a foundation for writing custom Stream Deck software. It uses my generic HID library to:

* safely manage a device connection
* set key brightness levels
* write key image data
* read key input asynchronously
* dispatch events

Usage example:

```javascript
import {DeckType, StreamDeck} from 'https://deno.land/x/deno_streamdeck/mod.ts';

const deck = new StreamDeck(DeckType.MK2);

deck.addEventListener('keyup', ({detail: {key}}) => {
  const [x, y] = deck.getKeyXY(key);
  console.log(`Key press at index ${key} coords ${x}-${y}`);
});
```

I owe a lot of gratitude to the [Python Stream Deck library](https://github.com/abcminiuser/python-elgato-streamdeck/) for the specifics of writing data to the device. That project was a big inspiration. I've basically written the same thing in JavaScript because I don't like coding python! But also because it's fun to hack around and learn things by doing it yourself.

## Next Step

Another reason for using Deno is the fantastic [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) support. My Stream Deck software architecture is based around web sockets. The Raspberry Pi is running a web server. Client plugins can connect, register their own keypad, and listen to events. The server has a little website that mirrors the Stream Deck on a `canvas` element. Key states can be monitored and simulated via the browser.

The nice thing about the server/client setup is that the Stream Deck can be wireless. It's not permanently tethered to a single desktop computer like the official Elgato software. I can have separate clients running on independent machines. So when my MacBook Air wakes up, for example, it reconnects and new controls for it appear on the Stream Deck.

I've written a client to control my lights — as shown in the photo earlier. That plugin interacts with [Home Assistant](https://www.home-assistant.io/) via another web socket. Web sockets are cool.

Anyway, a lot of work in progress! For now "real work" has taken priority. At least I'm not working in the dark! Although with energy prices today I'm opting to.

More to share on this in the coming months I hope.
