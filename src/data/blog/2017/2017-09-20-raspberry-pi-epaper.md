---
date: 2017-09-20 10:00:00+00:00
slug: raspberry-pi-epaper
title: 'Raspberry Pi + e-Paper module + Node.js'
description: 'I found new toys to play with.'
---

A few weeks ago I was digging through storage and I found an original Raspberry Pi. When I'd bought it years ago interest was lost rather quickly. I wasn't as comfortable with a Unix command line as I am today.

The Raspberry Pi / Arduino / single-board computer ecosystem has exploded since then. Maybe I can make a WiFi router, media server, BitTorent box?

![Raspberry Pi v3 + 1.54inch Waveshare e-Paper module](/images/blog/2017/rpi-epaper.jpg)

## Upgrading to the Pi

I bought a new generation Pi v3 model B because my toaster has more RAM than the original. I should have done prior research and got another brand (there are [better alternatives](https://beebom.com/best-raspberry-pi-3-alternatives/)). The Pi's USB and Ethernet ports share one controller which is a bottleneck. Read/write speeds to external storage have been underwhelming. Dreams of SSD shattered.

Still, it will be fit for – a yet to be decided – purpose.

### Finding a display and enclosure

Although I'm SSH-ing into the Pi I figured a small display would be nice. I'm using the cheap white 'official' case which doesn't fit a display. I had to make room...

![Raspberry Pi + e-Paper module (and case)](/images/blog/2017/rpi-case.jpg)

As you can see, I've done a decent job hacking a hole into the cover. Shame about the screws. Also, ignore those scratch marks. I could have glued the board on the inside without drilling. Nevermind! The cases are cheap enough.

# e-Paper

The display itself is the [**Waveshare 1.54inch e-Paper module**](http://www.waveshare.com/wiki/1.54inch_e-Paper_Module).

It's a neat bit of kit. Low power, no backlight, wide viewing angle. The display supports full and partial update modes. I've had issues with the partial mode fading. I'm new to this GPIO stuff but connecting the wires wasn't too difficult. Understanding the code took a little bit longer.

The wiki provides demos in C++ and Python with varing degrees of readability. As you know I'm a *JavaScript-all-the-things* type of guy. Porting the code over to Node.js was my way of learning what this hardware can do. I've also wrote a custom bitmap-like library to make image processing easier.

I've published my [**rpi-gpio-epaper** package on Github](https://github.com/dbushell/rpi-gpio-epaper). It's undocumented but that is the plan once I finalise the API. If there proves to be more demand than I'm expecting (zero) I'll document faster, so tweet / email me!

Stay tuned for more, if I find a use for this thing.
