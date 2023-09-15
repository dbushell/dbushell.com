---
date: 2023-03-20 10:00:00+00:00
slug: ios-pwa-media-session-api
title: 'iOS Web Apps and Media Session API'
description: 'The one where iOS Safari does things'
---

I've been rewriting my [podcast/audiobook PWA](https://github.com/dbushell/mesonic2) (progressive web app). More about that soon. For now I'm excited about one feature.

PWA support on iOS has been lacklustre compared to Android. At least that was true when I switched back to iOS a couple of years ago. At times critical features like background audio playback and IndexedDB have been outright broken on iOS. I had pretty much given up developing my PWA because of such issues.

Well it turns out I missed Safari adding support for the [Media Session API](https://developer.mozilla.org/en-US/docs/Web/API/Media_Session_API) after I first built my app. This allows me to do something like this:

```javascript
navigator.mediaSession.metadata = new MediaMetadata({
  title: 'Web Streams Explained',
  artist: 'Syntax - Tasty Web Development Treats',
  artwork: [{
    src: "https://example.com/artwork.jpg"
  }],
});
```

It works somewhat in macOS:

<figure class="Image">
  <img
    loading="lazy"
    src="/images/blog/2023/macos-control-center.avif"
    alt="macOS control center"
    width="294"
    height="71">
  <figcaption>macOS control center audio playback</figcaption>
</figure>

Although not ever image size and format works. Podcast artwork is too large I'm guessing?

I've yet to get any image working on the iPhone:

<figure class="Image">
  <img
    loading="lazy"
    src="/images/blog/2023/ios-lock-screen.avif"
    alt="iOS lock screen"
    width="585"
    height="300">
  <figcaption>iOS lock screen audio playback</figcaption>
</figure>

I've seen reports suggesting it did work and is now broken but fixed in the current beta. Classic Safari.

**29th March 2023 update: [iOS Safari 16.4](https://webkit.org/blog/13966/webkit-features-in-safari-16-4/) has fixed this bug.**

To solve the "artwork is too big" issue I'm using the browser to generate a smaller image on the fly. The `canvas` element has a `drawImage` to resize it and `toBlob` to generate a temporary URL. For example:

```javascript
let blobURL;
const image = new Image();
image.src = artwork[0].src;
image.addEventListener('load', async () => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  canvas.toBlob((blob) => {
    if (!blob) return;
    if (blobURL) URL.revokeObjectURL(blobURL);
    blobURL = URL.createObjectURL(blob);
    navigator.mediaSession.metadata = new MediaMetadata({
      title: 'Web Streams Explained',
      artist: 'Syntax - Tasty Web Development Treats',
      artwork: [
        {
          src: blobURL,
          type: blob.type,
          sizes: `${canvas.width}x${canvas.height}`
        }
      ]
    });
  });
});
```

This works on macOS so I hope the future iOS Safari fix accepts it.

The Media Session API can also do this:

```javascript
// "audio" is an HTML <audio> node
const forward = () => (audio.currentTime += 30);
const backward = () => (audio.currentTime -= 30);
navigator.mediaSession.setActionHandler('seekbackward', backward);
navigator.mediaSession.setActionHandler('previoustrack', backward);
navigator.mediaSession.setActionHandler('seekforward', forward);
navigator.mediaSession.setActionHandler('nexttrack', forward);
```

These actions allow me to customise the seek duration when skipping forward and backward. iOS shows the "10" icon regardless of the actual duration. I bind it to the track actions too giving my headphones preferential functionality. When I listen to a podcast I never want to skip the entire thing.

Once all this works it'll be a huge quality of life improvement. When I built "v1" almost 2 years ago nothing like this was possible. iOS didn't even show the seek buttons.

It's good to see Safari development improving. Standards support is even leading in some cases. Updates and bug fixes are released at a quicker cadence. It's probably the only Apple software that is getting better. The quality elsewhere, especially on macOS, is declining.
