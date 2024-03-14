---
date: 2020-06-01 10:00:00+00:00
slug: bubblewrap-twa-pwa-apps-android-studio
title: 'Bubblewrap Apps in Android Studio'
description: 'The one where I redesign my PWA and dive head first into Android Studio.'
---

[Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) is a convenient tool to generate an Android app from a Progressive Web App. I used it to [bundle my PWA](/2020/03/05/bundle-a-pwa-as-an-android-app/) recently.

It's run from the command line:

```shell
bubblewrap init --manifest "https://muteswan.dbushell.com/manifest.webmanifest"
```

Bubblewrap generates the build config and assets for the app. Continuing with `bubblewrap build` results in an `.apk` if you've installed the Android build tools.

I opted to open the project in [Android Studio](https://developer.android.com/studio/index.html) and poke around. I was able to build a signed `.aab` bundle — something the Google Play store shows a preference for. I also took the app for a spin on various device emulators.

## App Icons

Following a small design refresh of [**Mute Swan**](https://muteswan.dbushell.com/) I needed to update and fix the generated icons. On some devices they were clipped awkwardly.

<p class="Image">
  <img loading="lazy" srcset="
    /images/blog/2020/muteswan-icons-broken@1x.png,
    /images/blog/2020/muteswan-icons-broken@2x.png 2x"
    src="/images/blog/2020/muteswan-icons-broken@1x.png"
    alt="Mute Swan icons (broken)"
    width="340"
    height="100">
</p>

I could use Bubblewrap again to re-generate the icons but that wouldn't fix the clipping. I found the offending assets in this directory:

```
app/src/main/res
```

There is an awful lot of size variations to edit by hand. Has no one heard of vector graphics? Anyway, after some trial and error I learnt that editing them all at once in Android Studio is effortless.

Control/right-click on the `res` directory and select _"New > Image Asset"_.

<p class="Image">
  <img loading="lazy" srcset="
    /images/blog/2020/muteswan-android-studio@1x.png,
    /images/blog/2020/muteswan-android-studio@2x.png 2x"
    src="/images/blog/2020/muteswan-android-studio@1x.png"
    alt="Mute Swan in Android Studio"
    width="744"
    height="250">
</p>

You'll see this UI:

<p class="Image">
  <img loading="lazy" srcset="
    /images/blog/2020/muteswan-android-studio-icons@1x.png,
    /images/blog/2020/muteswan-android-studio-icons@2x.png 2x"
    src="/images/blog/2020/muteswan-android-studio-icons@1x.png"
    alt="Mute Swan app icons in Android Studio"
    width="1045"
    height="725">
</p>

In this modal you can configure the _"Background Layer"_. I entered a solid colour to match my icon. When you click _"Next"_ you'll see a list of files that will be overwritten — confirm to save the new icons.

And that's it!

The new icons are used in the next build. The app version number should be bumped up. This can be edited in `app/build.gradle` — or found under _"File > Project Structure > Modules > Default Config"_ tab if you prefer a GUI.

## The fun continues...

Once a TWA/PWA is built there aren't many reasons to re-build it. Other than updating icons. The app is still a website and can be updated at will. I pushed [my new design](https://muteswan.dbushell.com/) live whilst waiting for Google to approve the store release. An app with more than one user might require a more sophisticated, timed update!

### Test Devices

Another neat thing you can do with the Android dev tools is install an app on a real device via USB.

I've an old Nexus 7, and a new Fire 7 — which feels like the 7 year-old device – both rooted with custom Android ROMs. Developer mode and USB debugging needs to be activated on the device. I don't think rooting is necessary, that was another project.

After connecting via USB run:

```shell
adb install app/release/app-release.apk
```

The app is install as it would be via the store. Test away!

I'll continue to explore Android Studio and look for other opportunities to improve the PWA experience.

## Related articles

* [Bundle a PWA as an Android App](/2020/03/05/bundle-a-pwa-as-an-android-app/)
* [Debugging a Todo App](/2020/03/27/debugging-a-todo-app/)
* [Bubblewrap Apps in Android Studio](/2020/06/01/bubblewrap-twa-pwa-apps-android-studio/)
* [PWA Encryption and Auto Sign-in](/2020/06/08/pwa-web-crypto-encryption-auto-sign-in-redux-persist/)

Last updated: June 2020.
