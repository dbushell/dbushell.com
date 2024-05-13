---
date: 2024-05-13 10:00:00+00:00
slug: modern-wordpress-an-update
title: 'Modern WordPress - an Update'
description: 'The one where I provide more context to my last blog post'
---

My last blog post — [*"Modern WordPress - Yikes!"*](/2024/05/07/modern-wordpress-themes-yikes/) — has gotten a lot of traction. What I've seen has largely been in agreement and sharing my pain. I did not enjoy writing it, even less so sharing it, but I felt it had to be said.

## Corrections

WordPress core contributor and theme developer [Jessica Lyschik](https://wp-social.net/@jessicalyschik/112415959501726951) was kind enough to reply on Mastodon:

> @dbushell I think there are some misunderstanding here: Viewport Width in patterns refers to the preview when inserting patterns and have no effect on the frontend.
>
> The reason patterns are not stored in the HTML files and are in PHP instead is that it enables pattern strings to be translateable.
>
> I agree that some parts could use some refinement or should have thought through a bit better.
>
> TT4 serves as a way of showcasing how things can be done in different ways. There‘s no right or wrong.

Going on to say:

> @dbushell I‘ve worked on TT4 with the environment that was given there. Most of the things you mention are not directly a cause of the theme but of the underlying architecture of Gutenberg itself.

I very much appreciate this feedback considering how strong my criticism was.

A few others, like [Hendrik Luehrsen](https://twitter.com/hluehrsen/status/1788823929055760705) on Twitter, also corrected me on the `Viewport Width` front matter property. On this [the docs say](https://developer.wordpress.org/themes/patterns/registering-patterns/#using-the-patterns-directory-to-register-patterns):

> **Viewport Width:** The width of the `<iframe>` viewport when previewing the pattern (in pixels).

My original article misrepresents this value as being directly related to CSS styling. I could argue there is a strong relationship to the presentation but I'll concede for the sake of strict correctness. I've no excuse not to have researched that thoroughly. I don't think this invalidates any of the issues I raised though.

Although I used the *Twenty Twenty-Four* theme as an example, my issues are indeed with the "underlying architecture of Gutenberg itself", as Jessica puts it. On reflection, I don't think I did a good enough job explaining that point. The flagship theme is just a symptom, not the cause. I think it's bad but I don't see how it could be better. I genuinely believe it is impossible to code a modern WordPress in any logical or maintainable way. Full-site editor templates are built upon Gutenberg. [Gutenberg is a hack](/2021/08/03/wordpress-has-a-gutenberg-problem/), not a framework.



## Alternatives

I tried with Gutenberg, I really did. The Gutenberg block editor was released in [version 5.0 December 2018](https://wordpress.org/documentation/wordpress-version/version-5-0/). For over five years I tried. I went all-in from day one. I've built dozens of bespoke WordPress themes fully embracing the block editor. **Gutenberg is a failed experiment.** The core architecture of WordPress is a broken, tangled, unmaintainable mess.

The obvious alternative to all this madness is to stick with PHP templates and the [Classic Editor](https://en-gb.wordpress.org/plugins/classic-editor/) plugin to disable Gutenberg entirely. Many people responding to my article did this a long time ago. For the first time ever, I've admitted defeat and installed this plugin on my latest project.

Some have suggestion [ClassicPress](https://www.classicpress.net/). With that I'd be concerned about plugin compatibility and security. WordPress is a big target for hackers, I don't know if I'd trust a fork.

Others have suggested theme builders like [Elementor](https://elementor.com) and [Bricks](https://bricksbuilder.io). Honestly, I hate these plugins. I don't want to code for proprietary frameworks. There is too much lock-in with non-transferable code and skills. To use an idiom, they "throw the baby out with the bathwater". Why even use WordPress at that point?

Yeah that is a good question, why am I even using WordPress?


