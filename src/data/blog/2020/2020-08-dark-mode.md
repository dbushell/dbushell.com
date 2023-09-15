---
date: 2020-08-10 10:00:00+00:00
slug: css-website-dark-mode
title: 'I’m Not Sure About Website Dark Mode'
description: 'The one where I mull over dark mode in website design and web standards.'
---
I'm a bit late to the party but [I added a dark mode](/2020/08/05/i-have-only-gone-and-redesigned-my-website-again/) toggle to my website. My new design launched this week and it defaults to light mode. The thing is, I'm not convinced the implementation in web browsers is ideal.

Dark mode is usually my software default. In macOS and Android I have it turned on at the system level. Nowadays most apps respect this setting and some provide their own option. Photoshop comes to mind doing this long before it was cool.

We can use CSS to adapt colours based on this preference:

```css
/* Light mode defaults */
:root {
  --color: black;
  --background: white;
}
/* Dark mode media query */
@media (prefers-color-scheme: dark) {
  :root {
    --color: white;
    --background: black;
  }
}
/* Define styles once */
body {
  color: var(--color);
  background: var(--background);
}
```

CSS custom properties are the ideal partner to code an adaptive theme. The same media query can be queried with JavaScript:

```javascript
const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
```

Easy.

So why am I hating on dark mode for websites, despite it being my app default?

I should note that some websites are designed dark by default. In those cases the same ideas would apply by providing an alternate light mode.

## Privacy

The first reason might seem a little unfair. I was going to say "browser support" because for the longest time I didn't think Firefox had it. [Browser coverage](https://caniuse.com/#feat=prefers-color-scheme) is actually over 80% including Firefox (since version 67). It just did not work for me because of this setting:

```
privacy.resistFingerprinting = true
```

When you [block fingerprinting in Firefox](https://blog.mozilla.org/firefox/how-to-block-fingerprinting-with-firefox/) the preferred colour scheme always returns `light`. That's unfortunate, but considering how insidious online tracking is I'm willing to make the trade-off. I have other web features blocked or disabled by default for the same reason. This may seem an unfair criticism but it ties into my next point.

## An Option

Some websites simply adapt to this preference and you might never know. In my research I found **Andy Clarke's** [Stuff & Nonsense](https://stuffandnonsense.co.uk/) does this and it's rather spiffing. It's one of the sites that nudged me towards implementing a dark mode myself.

Other websites — like my own as of writing — provide some sort of toggle interface. The struggle is that there's no standard way to do this. This leads to rather obscure interfaces. Look no further than my own lightbulb. I've embedded a GIF below because I'm likely to change this to be more intuitive.

![dbushell.com dark mode lightbulb toggle](/images/blog/2020/dbushell-2k20-lightbulb.gif)

What browsers need in my opinion are more granular controls per-website. Some sort of browser panel that exists outside of the web page. I think Andy's choice of respecting the system default is the right approach. But I'd also like the option. After implementing my own custom toggle it feels wrong. I thought it was cute. But cute is not always accessible.

## Branding

Finally, some of my uncertainty towards dark mode comes from a fear of change. Dark mode is a dramatic shift in appearance. My personal "brand" has always been light. You can't just invert the colours and be done with it. Although I've carefully chosen a colour scheme that I feel works I'm still reluctant to fully commit. It's a big addition to the brand.

I'd like to offer dark mode implementation for all client websites. When I think about past projects many of them don't have a consideration in their style guide for alternate colour schemes. This is not a responsibility to be taken lightly (pardon the pun) considering users may see this as the default.

So I remain unsure. I think we need:

* Improved browser support
* More consideration in brand design

What do you think? [@dbushell](https://twitter.com/dbushell). I'm leaning towards fully enabling my dark mode. Most visitors are here to read a blog article and it really benefits reading.
