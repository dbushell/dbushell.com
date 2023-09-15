---
date: 2016-07-14 10:00:00+00:00
draft: false
slug: building-a-wordpress-theme
template: single.html
portfolio: true
title: 'Building a WordPress Theme'
---

I was delighted when [Base Creative](https://www.basecreative.co.uk/) asked me to help build a beautifully designed website on WordPress. It’s always a joy to work with Base Creative knowing that my role is made easier by the care and attention they deliver.

![Website design by Base Creative, London](/images/blog/2016/wordpress-bc-theme.png)

In this review I’ll showcase a few of the defining techniques and challenges that made this an interesting project to deliver. As usual I started with a static HTML build allowing me to focus on CSS and responsiveness in the browser.

* * *

## Responsive Patterns

Overall the design adapted nicely across devices. The “article” component, used for listings blog posts, proved most challenging to code. The screenshots below illustrate how articles are designed to sit within a grid, resize, and change layout across breakpoints.

![Blog article design by Base Creative, London](/images/blog/2016/wordpress-bc-articles.png)

Where possible I always aim to use standardised WordPress features. [**Post Thumbnails**](https://codex.wordpress.org/Post_Thumbnails) were the logical target for these article images. It’s important to avoid requiring multiple images because they make content management a chore.

Through experimentation in the browser I discovered the optimal image size to cover all breakpoints. CSS is used to effectively center and crop the image if its aspect ratio differs to that of its parent container. Flexbox is used in supported browsers for perfect alignment. It’s remarkably tricky otherwise to get those buttons aligned to the bottom of the box!

Building the the CSS and HTML templates first lead to a much easier process of deconstruction and reassembling into a WordPress theme.

## Moving to WordPress

For WordPress development I use [MAMP PRO](https://www.mamp.info/en/) because its fast to setup and manage local installs. To really make the most of WordPress as a **content management system** I find the [Advanced Custom Fields](https://www.advancedcustomfields.com/) plugin to be indispensable.

With ACF I’ll often create a general options page to configure content. The homepage design for this website has two featured articles. I provided options to show or hide as well as specify the exact content to be featured.

*When building a WordPress theme it’s important to consider all scenarios and provide safe defaults alongside more granular control for the author if they desire*.

![WordPress homepage options](/images/blog/2016/wordpress-bc-general-settings.png)

It’s debatable whether to show these fields on the general options page or when editing the homepage itself. Because there is similar featured content that appears across multiple templates I opted to keep all of these options in one place.

### Content Blocks

Some blog posts will lead with a YouTube video. To provide the necessary CMS fields and taxonomy I combined the standard WordPress [Post Formats](https://codex.wordpress.org/Post_Formats) with conditional ACF options:

![WordPress post formats](/images/blog/2016/wordpress-bc-video-format.png)

It would have been easier to simply expect the author to paste embed code within the main content editor. This is bad practice for several reasons:

1. There would be no clean way to identify video posts within templates or searches.
2. The editing experience is much friendlier when content is broken down into individual blocks with specific UI and instructions.
3. It is harder to validate and sanitise mixed content.

To output the video atop the single page template required little code:

```php
<?php
if (has_post_format('video')) {
  $code = video_embed_code(get_field('video-embed-code'));
  if (!empty($code)) echo $code;
}
the_content();
?>
```

The `video_embed_code()` function exists in the theme’s `function.php` and uses the WordPress function `wp_kses()` [(see docs)](https://codex.wordpress.org/Function_Reference/wp_kses) to help sanitise content by allowing only specific HTML elements and attributes — an `<iframe>` or `<video>` in this case.

## Infinite Scroll

Infinite scroll is super simple to implement for WordPress!

After some trial and error I settled on the aptly named, if a tad longwinded, [“Infinite Scroll and Load More Ajax Pagination”](https://wordpress.org/plugins/infinite-scroll-and-load-more-ajax-pagination/) plugin to do exactly what I needed (without the feature bloat that spoils many plugins).

For the infinite scroll to work you first implement the blog with standard “Previous” and “Next” pagination. At this stage blog pages are now perfectly **accessible** and **indexable**. Then you tell the plugin your CSS selectors:

![WordPress infinite scroll plugin settings](/images/blog/2016/wordpress-bc-infinite-scroll.png)

These selectors match the HTML structure I’ve used for blog listings and pagination:

```markup
<div class="grid grid--infinite">
  <div class="grid__item grid__item--infinite">
    <article class="article"> ... </article>
  </div>
  <!-- grid__item repeats per post -->
</div>
<div class="pagination">
  <a class="button button--pagination-prev" href="">Previous</a>
  <a class="button button--pagination-next" href="">Next</a>
</div>
```

The plugin uses JavaScript to replace the pagination with a customisable “More” button:

![WordPress infinite scroll loading](/images/blog/2016/wordpress-bc-infinite-load.gif)

When clicked, blog posts from previous pages are loaded and appended to the grid. There is of course an option to automatically load new articles on scroll for the true “infinite scroll” effect. Personally I prefer a button because unexpected changes that force the page to repaint can cause scroll lag and jumpiness on mobile.

This is a clean example of **progressive enhancement** in action.

## WP Admin

Once I’ve built a theme I’ll take time to ensure the WordPress admin area is presented as nicely as possible. One particularly nice touch is to give the content editor the same typographic style and web fonts as the theme.

![WordPress content editor](/images/blog/2016/wordpress-bc-editor.png)



In the theme’s `functions.php` this WordPress function loads CSS into the editor:

```php
add_editor_style('assets/css/editor.css');
```

To ensure the correct HTML classes are applied to typographic elements see [TinyMCE Custom Styles](https://codex.wordpress.org/TinyMCE_Custom_Styles). To load web fonts a TinyMCE plugin is used:

```php
add_filter('mce_external_plugins', 'my__mce_external_plugins');
function my__mce_external_plugins($plugins) {
  $plugins['webfonts'] = get_template_directory_uri().'/assets/js/admin/tinymce.webfonts.js';
  return $plugins;
}
```

And the TinyMCE plugin itself:

```javascript
(function() {
  tinymce.create('tinymce.plugins.webfonts', {
    init: function(ed, url) {
      ed.onPreInit.add(function(ed) {
        var doc = ed.getDoc(),
            script = doc.createElement('script'),
            js = 'WebFontConfig={google:{families:["Hind+Vadodara:500,300,400:latin","Volkhov:400italic:latin"]}},function(){var e=document.createElement("script");e.src="https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js",e.type="text/javascript",e.async="true";var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}();';
        script.type = 'text/javascript';
        script.appendChild(doc.createTextNode(js));
        doc.getElementsByTagName('head')[0].appendChild(script);
      });
    },
    getInfo: function() {
      return { };
    }
  });
  tinymce.PluginManager.add('webfonts', tinymce.plugins.webfonts);
})();
```

This example uses Google Fonts but it’s trivial to replace the JavaScript with that of Typekit or another service. (It’s basically creating a `<script>` element inside the TinyMCE iframe.)

## To Conclude

Hopefully that gives you a glimpse into my process. These are just a few of the interesting aspects that make up WordPress theme development. WordPress has a lot of conventions and knowing these leads to a more robust and compatible theme.

Thanks again to [**Base Creative**](https://www.basecreative.co.uk/) for involving me in this project. If you have a WordPress theme that needs designed or built — or both! — [please do get in touch](/contact/).
