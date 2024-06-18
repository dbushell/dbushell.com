---
date: 2020-03-05 10:00:00+00:00
slug: bundle-a-pwa-as-an-android-app
title: 'Bundle a PWA as an Android App'
description: 'The one where I bundle my totally unique PWA as an Android app.'
---

A [Progressive Web App (PWA)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) is a website with a few extra pieces.

PWAs can be installed or bookmarked from the browser using "Add to Home Screen". On Android 9 doing this via Firefox (v68, left) and Chrome (v80, right) gives two different results on my Samsung S8:

<p class="Image">
  <img loading="lazy" srcset="
    /images/blog/2020/ms-homescreen-icons@1x.png,
    /images/blog/2020/ms-homescreen-icons@2x.png 2x"
    src="/images/blog/2020/ms-homescreen-icons@1x.png"
    alt="Mute Swan PWA Homescreen Icons"
    width="340"
    height="180">
</p>

The Firefox icon isn't desirable. Although the Firefox bookmark does open like a fullscreen app, Chrome uses [WebAPK](https://developers.google.com/web/fundamentals/integration/webapks) to wrap the PWA. This offers better Android integration. However, the app wont be listed in the Play Store.

Not quite a first-class citizen.

## Building an APK

To get into an app store an APK is required (the package format for apps). Why is this desirable? For better discoverability and monetisation perhaps. Or just for fun — usually my rationale on such projects.

With [Trusted Web Activities (TWA)](https://developers.google.com/web/updates/2019/02/using-twa) this is fairly easy. TWA is a way to use Chrome sans the UI inside an Android app. An app that is effectively just a portal to the PWA. It's sandboxed and can't access native APIs. Just like WebAPK then, but the result is an app bundle that can be uploaded to the store.

## The PWA

The process begins with a PWA, obviously, with all the trimmings.

I developed an archetypal todo app, but with a twist. The twist is I made it. That means I can only blame myself when it hinders productivity.

Check out: [**MuteSwan**](https://muteswan.dbushell.com/)

It doesn't really scale well beyond mobile, [I'm working on that...](https://codepen.io/dbushell/pen/mdJPzrP)

**Mute Swan** is a short-term daily planner for todos and memos. Add items for the upcoming week. See a history of the past seven days. The app is centred around “today” and older items are automatically deleted.

<p class="Image">
  <img loading="lazy" srcset="
    /images/blog/2020/ms-screenshot@1x.png,
    /images/blog/2020/ms-screenshot@2x.png 2x"
    src="/images/blog/2020/ms-screenshot@1x.png"
    alt="Mute Swan PWA Screenshot"
    width="360"
    height="640">
</p>

~~And of course, Mute Swan is available on Google Play.~~ **Update:** no longer published.

Here's how:

## Android Studio

I followed [Jeff Delaney's guide](https://fireship.io/lessons/pwa-to-play-store/). He goes through the key steps to install Android Studio dev environment and submit test releases to the Play Store.

If you follow the rabbit hole you'll find [Llama Pack](https://github.com/GoogleChromeLabs/llama-pack). It appears to be the most up-to-date tool to generate a TWA boilerplate project. This is all that's needed to bundle the app. There is also [PWA Builder](https://github.com/pwa-builder/pwabuilder-android-twa) which looks similar but I haven't tested it.

In theory this only needs to be done once as the TWA app is just a wrapper. All future updates can be done on the PWA side. I suppose it may be justified to submit a new release for the sake of appearances. Users will see changes regardless without an app update (unless the service worker is caching indefinitely).

## Establishing Trust

The "Trusted" part of TWA comes from [Digital Asset Links](https://developers.google.com/digital-asset-links/v1/getting-started). For the PWA a JSON file must be accessible on a public URL on the same domain. This includes the app bundle fingerprint which basically proves ownership and allows the app to run without Chrome UI (like the address bar).

```json
// https://muteswan.dbushell.com/.well-known/assetlinks.json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "app.muteswan.android",
    "sha256_cert_fingerprints": [
      "D6:04:9A:74:08:FA:90:45:13:6D:25:C4:86:A4:E0:31:8D:CD:72:DF:50:0B:F5:2F:6C:A0:E1:98:A8:D6:65:6F"
]}}]
```

If "app signing by Google Play" is enabled, the "SHA-256 certificate fingerprint" from the Play Console should be used.

If the fingerprints do not match users will see the Chrome address bar and other UI. Users may even see an "Add to Home Screen" prompt which is rather confusing. The emulator screenshot below demonstrates this problem.

<p class="Image">
  <img loading="lazy" srcset="
    /images/blog/2020/ms-assetslink@1x.png,
    /images/blog/2020/ms-assetslink@2x.png 2x"
    src="/images/blog/2020/ms-assetslink@1x.png"
    alt="Mute Swan TWA Digital Asset Links failure"
    width="405"
    height="361.5">
</p>

Once that is sorted, the app is good to go!

A Google Developer account is required with a one-off $25 fee. There's a whole host of forms to complete in the Play Console. It took a few days (over a weekend) for my Mute Swan app to be approved.

## User Experience

Aside from the initial installation process there really isn't much difference between a PWA (via Chrome WebAPK) and a TWA app once launched.

The PWA splash screen uses the icon, colour, and app name from the [manifest file](https://developer.mozilla.org/en-US/docs/Web/Manifest). The TWA app only uses the icon by default. I'd assume this is entirely customisable if I were to dig around in the Android Studio project.

On first launch the user gets a notice at the bottom of the screen:

<p class="Image">
  <img loading="lazy" srcset="
    /images/blog/2020/ms-chrome@1x.png,
    /images/blog/2020/ms-chrome@2x.png 2x"
    src="/images/blog/2020/ms-chrome@1x.png"
    alt="Mute Swan TWA 'Running in Chrome' message"
    width="540"
    height="70">
</p>

I'm not sure what this achieves other than mild confusion.

A more lasting difference is that the TWA app adopts the dark-mode preference for the Android navigation bar below the app.

<p class="Image">
  <img loading="lazy" srcset="
    /images/blog/2020/ms-footer@1x.png,
    /images/blog/2020/ms-footer@2x.png 2x"
    src="/images/blog/2020/ms-footer@1x.png"
    alt="Mute Swan TWA and PWA differences"
    width="540"
    height="75">
</p>

What's interesting is that Chrome uses the same user session. Meaning cache storage between the PWA, TWA app, and visiting [MuteSwan](https://muteswan.dbushell.com) in the browser all share the same data on the device.

The Firefox PWA bookmark comes in 3rd place. It launches with a white screen and gets the light-mode nav bar.

## Thoughts

Ideally all browsers would work with the WebAPK approach and Google would allow PWAs to be listed in the app store.

For now, this approach only takes an afternoon.

As for **Mute Swan**, I've actually been dogfooding it for a few weeks now and plan to maintain it. It's free to use! Get in touch [@dbushell](https://dbushell.com/twitter/) if you care. I plan to release the source code once I clean it up.

## React Native?

My first idea was to bundle the app using [React Native](https://reactnative.dev/). It's cross-platform for both Android and iOS. I'll admit wishful thinking here in regards to shared components with the PWA. It's not quite as magic as I'd hope. I managed to get the app running by replacing most elements with a `<View/>` or `<Text/>`. All the Redux logic worked without change. Other code relying on a browser environment needed more drastic reimplementation (or would have — I gave up.)

I'd consider React Native if I was serious about a multi-platform app, or required native API integration.

## Related articles

* [Bundle a PWA as an Android App](/2020/03/05/bundle-a-pwa-as-an-android-app/)
* [Debugging a Todo App](/2020/03/27/debugging-a-todo-app/)
* [Bubblewrap Apps in Android Studio](/2020/06/01/bubblewrap-twa-pwa-apps-android-studio/)
* [PWA Encryption and Auto Sign-in](/2020/06/08/pwa-web-crypto-encryption-auto-sign-in-redux-persist/)

Last updated: June 2020.
