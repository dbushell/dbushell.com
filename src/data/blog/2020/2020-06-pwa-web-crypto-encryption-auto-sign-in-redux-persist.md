---
date: 2020-06-08 10:00:00+00:00
slug: pwa-web-crypto-encryption-auto-sign-in-redux-persist
title: 'PWA Encryption and Auto Sign-in'
description: 'The one where paranoia gets the better of me.'
---

[**Mute Swan**](https://muteswan.dbushell.com/) is a progressive web app I've been coding for my own amusement. It's a playground for me to mess around with experimental web standards. Also to remind myself to buy milk.

<p class="Image">
  <img loading="lazy" srcset="
    /images/blog/2020/ms-v7a@1x.png,
    /images/blog/2020/ms-v7a@2x.png 2x"
    src="/images/blog/2020/ms-v7a@1x.png"
    alt="Mute Swan v7"
    width="360"
    height="300">
</p>

I've recently implemented hidden Dropbox backup and sync functionality. With that in place I decided that my grocery list was of the upmost secrecy. What if my Dropbox account was hacked?

## Encryption

Mute Swan uses [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) to persist state data between browser sessions.

I wrote an asynchronous wrapper for the `getItem` and `setItem` methods; encrypting and decrypting respectively. My encrypted local storage interface plugs into [Redux Persist](https://github.com/rt2zz/redux-persist)<sup>†</sup> as a custom storage engine.

Encryption is handled by the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto). I've used AES-GCM with a key generated from a SHA-256 hash of a text password.

I begin with the hashing function:

```javascript
async function sha256(value) {
  return await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(value)
  );
}
```

From that the `CryptoKey` is derived:

```javascript
async function getKey(password) {
  return await crypto.subtle.importKey(
    'raw',
    await sha256(password),
    {name: 'AES-GCM'},
    false,
    ['encrypt', 'decrypt']
  );
}

const key = await getKey('supersecretpassword');
```

With this key, text can be encoded and encrypted:

```javascript
const iv = crypto.getRandomValues(new Uint8Array(12));
const encrypted = await crypto.subtle.encrypt(
  {
    iv,
    name: 'AES-GCM'
  },
  key,
  new TextEncoder().encode('Buy milk?')
);
```

And later decrypted and decoded:

```javascript
let decrypted = await crypto.subtle.decrypt(
  {
    iv,
    name: 'AES-GCM'
  },
  key,
  encrypted
);

decrypted = new TextDecoder().decode(decrypted);

// Output should be: "Buy milk?"
console.log(decrypted);
```

Sounds secure, but the default password is stored right in the source code.

To use a custom password I need to request that before the Redux store can be configured. I mocked up a sign-in form to accept the password. In React I'm mounting the form component at a higher level prior to the Redux provider and persist gate.

## Auto sign-in

Requesting a password at the start of each session is an annoying experience. I briefly considered how safe it would be to store the password itself in local storage or a JavaScript cookie. Both are susceptible to cross-site scripting and lack any user management. Further research lead me to the [Credential Management API](https://developers.google.com/web/fundamentals/security/credential-management/retrieve-credentials).

#### Auto sign-in (the correct way)

Chrome provides the best auto sign-in experience. If enabled the password can be retrieved seamlessly without user interaction. A temporary notification pops up and passwords can be managed via the key button.

<p class="Image">
  <img loading="lazy" srcset="
    /images/blog/2020/ms-auto-sign-in@1x.png,
    /images/blog/2020/ms-auto-sign-in@2x.png 2x"
    src="/images/blog/2020/ms-auto-sign-in@1x.png"
    alt="Mute Swan v7 auto sign-in (Chrome)"
    width="478"
    height="160">
</p>

On Chrome Android the sign-in notification pops up below. The random sky blue is an interesting choice. I'd prefer if it would use the manifest theme colour.

<p class="Image">
  <img loading="lazy" srcset="
    /images/blog/2020/ms-auto-sign-in-android@1x.png,
    /images/blog/2020/ms-auto-sign-in-android@2x.png 2x"
    src="/images/blog/2020/ms-auto-sign-in-android@1x.png"
    alt="Mute Swan v7 auto sign-in (Android)"
    width="360"
    height="300">
</p>

Passwords can be stored programmatically:

```javascript
const data = new window.PasswordCredential(form);
window.navigator.credentials.store(data);
```

And retrieved silently:

```javascript
const data = await window.navigator.credentials.get({
  password: true,
  mediation: 'optional'
});
```

Works in Chrome-like browsers. Fails elsewhere. If the password cannot be retrieved via the method above, or is incorrect, I fall back to a sign-in form.

```markup
<input
  required
  autocomplete="current-password"
  type="password"
  name="password"
/>
```

Browsers will offer to save the password for future auto-completion.

#### Auto sign-in (the hack way)

If the browser doesn't cough up the password immediately the sign-in form is presented. The auto-completed password can be detected with an event:

```javascript
window.document.addEventListener(
  'input',
  (ev) => {
    if (
      ev.target.name === 'password' &&
      ev.inputType === 'insertReplacementText'
    ) {
      // Attempt auto sign-in by submitting the form...
    }
  },
  {once: true}
);
```

If this event is triggered the form can be submitted to attempt an "auto" sign-in. Only try this once because an incorrect password results in an infinite loop!

This method has noticeable latency and the form will appear briefly. I considered making the form invisible to avoid the UI flash. However, a timeout would be necessary to show the form again if auto-complete didn't occur, or was not detected. Such a delay seems like the greater evil.

<p class="Image">
  <img loading="lazy"
    src="/images/blog/2020/ms-v7-auto-sign-in-hack.gif"
    alt="Mute Swan v7 auto sign-in hack"
    width="360"
    height="200">
</p>

This feels very hacky but it works in Firefox.

### Fallback

Finally, if neither auto sign-in method works, or no password was saved, the form must be submitted manually by the user.

<p class="Image">
  <img loading="lazy" srcset="
    /images/blog/2020/ms-sign-in-form@1x.png,
    /images/blog/2020/ms-sign-in-form@2x.png 2x"
    src="/images/blog/2020/ms-sign-in-form@1x.png"
    alt="Mute Swan v7 sign-in form"
    width="296"
    height="105">
</p>

Safari is particularly hesitant to auto-fill for me. Hopefully browser support for credential management auto sign-in becomes standard.

## And so...

And so, my grocery list is now encrypted! The browser secures my password between sessions. Keys never leave internal JavaScript memory. Naturally, there's a more than zero percent chance I've done something wrong and my code is entirely exploitable. I'll continue to learn, test, and iterate.

At some point I do plan to publish Mute Swan on GitHub. A lot of the functionality is still hidden behind secret flags. It turns out that building user-friendly UI is incredibly time consuming!

## Related articles

- [Bundle a PWA as an Android App](/2020/03/05/bundle-a-pwa-as-an-android-app/)
- [Debugging a Todo App](/2020/03/27/debugging-a-todo-app/)
- [Bubblewrap Apps in Android Studio](/2020/06/01/bubblewrap-twa-pwa-apps-android-studio/)
- [PWA Encryption and Auto Sign-in](/2020/06/08/pwa-web-crypto-encryption-auto-sign-in-redux-persist/)

Last updated: June 2020.

* * *

💤† Redux Persist updates local storage asynchronously. There is some throttling going on but it basically updates after every state change. I ran some very primitive benchmarks and found that my encryption interface is plenty fast enough; milliseconds, if that.
