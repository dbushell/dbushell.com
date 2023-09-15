---
date: 2016-09-01 10:00:00+00:00
draft: false
slug: colour-accessibility
template: single.html
title: 'Colour Accessibility'
---

"Accessiblity" isn't a scary word but many web folks shy away from it. Perhaps because the W3C guidelines are *a little* scary. The reality is **website accessibility affects us all**. Not just those of us who cross the threshold into a medically diagnosed condition.

["I want to see like the colour blind"](https://chrome.google.com/webstore/detail/i-want-to-see-like-the-co/jebeedfnielkcjlcokhiobodkjjpbjia) is a Chrome plugin that adjusts a website on the fly. (Technically it applies an SVG [colour matrix filter](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feColorMatrix) to the entire page.) You may also like the plugin [ChromeLens](http://chromelens.xyz/) which provides even more functionality.

I can see how my website might look with an absence of red perception:

![dbushell.com in protanopia and protanomaly modes](/images/blog/2016/colour-accessibility-dbushell.png)

In protanopia mode the contrast of my menu drops from [2.8](http://leaverou.github.io/contrast-ratio/#white-on-%23ff6680) to [2](http://leaverou.github.io/contrast-ratio/#white-on-%23bdbb7a) which isn't ideal. I'm not going to change my brand colour because of this but in future I'll avoid this combination for lengthier or more subtle text design. From this experiment I've learnt that contrast is a significant factor that is effected by colour blindness.

## Considerations

When I say *"website accessibility affects us all"*, I mean that there isn't a hard cut-off that indicates a person will not benefit from design that is done with accessibility in mind.

For example, if text contrast is not good enough for people with visual impairment, that suggests it is **only just** good enough for people without — and the line between those two groups is blurred (for lack of a better word). Whilst typing this blog post sunlight has started to stream through my window glaring off my monitor. This has rendered contrast lower and "good enough" for "normal eyes" is no longer cutting the mustard.

I don't profess to be the world's foremost expert but I do know that treating website accessibility as a minority concern is entirely the wrong way to think about it.
