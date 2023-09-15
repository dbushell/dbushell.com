---
date: 2013-02-15 16:48:18+00:00
excerpt: None
slug: performance-varnish-cache-wordpress
template: single.html
title: Performance, Varnish Cache, WordPress
---

When it comes to website performance there's a lot we can do.

As designers it means finding a style that suits the Web as a medium; taking advantage of CSS, avoiding heavy raster graphics, etc etc. As front-end developers, well, [Harry Roberts'](http://csswizardry.com/2013/01/front-end-performance-for-web-designers-and-front-end-developers/) has a great round-up of techniques.

There's only so much we can do client-side. It's always a trade off. It all goes downhill after `<!DOCTYPE html>`. I like Mark Perkins' idea of a [responsive budget](http://clearleft.com/thinks/responsivedesignonabudget/).

## Before the browser

What many people in my position forget are the bottlenecks that exist server-side and across the Internet at large. Not much point minifying CSS if you're sharing some backwater server with a hundred others for five bucks a month.

A while ago I moved hosting to [Heart Internet VPS](http://www.heartinternet.co.uk/vps/). (Before they started sponsoring my blog `</disclaimer>`.) Media Temple's Grid hosting was terrible, but this was as much a move to consolidate my hosting and domains (away from GoDaddy).

With a new virtual server to play with I installed [Varnish Cache](https://www.varnish-cache.org/). Varnish sits in front of the web server and takes over port 80. That means when you hit a page on my site you're served pre-rendered HTML and cached assets by Varnish. You never normally reach the "AMP" part of the LAMP stack (Apache, MySQL, and PHP).

Here's a wonderful illustration from [Wiki Commons](http://en.wikipedia.org/wiki/File:Reverse_proxy_h2g2bob.svg):

![Reverse_proxy_h2g2bob](/images/blog/2013/Reverse_proxy_h2g2bob.svg)

Setting up Varnish required some hacking of Plesk and Apache. I went at it like a lumberjack. In my wisdom I made no record of what I did and I was drinking heavily. That means any day now I might have to hit the _"restore factory settings_" button.

Until that day comes, my website is lightning fast.

What I do know is blogged below for future reference:

## Varnish and WordPress

Varnish isn't plug-and-play. It comes with its own [configuration language](https://www.varnish-cache.org/docs/3.0/reference/vcl.html). This config file tells Varnish how to handle all requests and caching. To make Varnish play nicely with WordPress I borrowed heavily from [Donncha O Caoimh's](http://ocaoimh.ie/2011/08/09/speed-up-wordpress-with-apache-and-varnish/) work.

Basically you want to avoid caching the admin area and requests where a user has comments pending. I messed that part up. You may have noticed last year that comments in the moderation queue on my blog were visible to the whole world. Useful.

It's also worth pointing out that you cannot clear cached CSS no matter how hard you hit ⌘R — but then you shouldn't be making live edits via FTP anyway…

## A big refresh

My [new site design](/2013/02/04/a-new-home/) has a _"From the blog…"_ feature in the page footer. This caused me some concern because dynamic content and caching don't go hand in hand.

![latest articles on dbushell.com](/images/blog/2013/from-the-blog.png)

In WordPress you would normally create a template include like so:

````php
<?php
// include "From the blog..." section
get_template_part('blog.partial');
?>
````

Naming conventions aside, this is WordPress/PHP basics. But a big problem arises when I publish a new article. This include is on every page. Do I purge my entire website? That would mean every page has to be re-cached. It would be beneficial if I can purge this area alone. That's what [edge side includes](https://www.varnish-cache.org/trac/wiki/ESIfeatures) allow.

On my production server the code above is replaced with:

````markup
<esi:include src="<?php bloginfo('template_url'); ?>/blog.esi.php"/>
````

It's not quite that simple. Varnish needs a URL to hit to access this document fragment. If you were to try and access any PHP file in the WordPress theme directory it would likely throw an error. [Tim Broder](http://timbroder.com/2012/12/getting-started-with-varnish-edge-side-includes-and-wordpress.html) provides the answer:

````php
<?php
$cwd = getcwd();
$path = substr($cwd,0,strpos($cwd,'wp-content/'));
require($path . 'wp-blog-header.php');
?>
````

This ensures my latest posts [WP_Query](http://codex.wordpress.org/Class_Reference/WP_Query) can run when the template include is accessed independently of the theme. The next step is to let Varnish know when to clear the cache for certain URLs.

## Clearing the cache

In my WordPress theme `function.php` I have:

````php
function mytheme_purge_url($url)
{
    $c = curl_init($url);
    curl_setopt($c, CURLOPT_CUSTOMREQUEST, 'PURGE');
    curl_exec($c);
    curl_close($c);
}
````

Using cURL my blog can send a PURGE request to Varnish and clear the cache for a specific URL. From here it's just a matter of hooking into the right admin actions:

````php
add_action('save_post', 'mytheme_purge_post_cache');
add_action('deleted_post', 'mytheme_purge_post_cache');

function mytheme_purge_post_cache($post_ID)
{
    $url = get_permalink($post_ID);
    if ($url) {
        mytheme_purge_url($url);
        mytheme_purge_url(site_url('/blog/'));
        mytheme_purge_url(bloginfo('template_url') . '/blog.esi.php');
    }
}
````

Remember that Varnish needs to be configured to never cache the WordPress admin area (otherwise you'll never get past the login form). Now, after I save or delete a post the URLs for that post, the [blog index](/blog/), and the _"From the blog…"_ include are all purged. They are then cached again on the next request.

So there it is. Probably the biggest speed boost I've given my website. I apologise that my technical ineptitude means I haven't been able to write a full tutorial but I hope this proves useful to someone.

Maybe my future self.
