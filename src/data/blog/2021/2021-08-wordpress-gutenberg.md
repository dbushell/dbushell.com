---
date: 2021-08-03 10:00:00+00:00
slug: wordpress-has-a-gutenberg-problem
title: 'Does WordPress Have a Gutenberg Problem?'
description: 'The one where I’m pushed to breaking point'
---

WordPress 5.8 shipped a few weeks ago. [Release notes](https://make.wordpress.org/core/2021/07/03/wordpress-5-8-field-guide/) should be an exciting read but these filled me with dread. The Gutenberg editor has been a constant thorn in my side. I vented a rather negative tweet that I've since deleted. I hope this blog post offers more reasoned criticism to explain my frustrations with WordPress.

WordPress began life as a simple [WYSIWYG](https://en.wikipedia.org/wiki/WYSIWYG) blog post editor.

<figure class="Image">
  <img
    loading="lazy"
    src="/images/blog/2021/wp-classic-editor@2x.png"
    alt="WordPress classic editor"
    width="505"
    height="105">
  <figcaption>The classic WYSIWYG editor.</figcaption>
</figure>

WYSIWYG content is saved as HTML in the database `post_content` field. Content is outputted in PHP templates using `the_content()` function. Many built-in WordPress features and plugins apply filters to `the_content` hook. The `wptexturize` filter for example adds smart quotes and other typography improvements.

Saving to HTML has obvious drawbacks. Modern CMS' prefer abstracted data models that store smaller more flexible units of content. [Craft CMS](https://craftcms.com/) and [Keystone](https://keystonejs.com/) are two built on this philosophy. Craft CMS encourages 'matrix' data compositions. Keystone also includes a WYSIWYG like document field, built with [Slate](https://www.slatejs.org/), that stores intermediary JSON.

In WordPress, the block-based [Gutenberg editor](https://wordpress.org/gutenberg/) shipped as default in late 2018 replacing the classic WYSIWYG. In theory it allows for a more expansive editing experience with user interface tailored to each block type.

<figure class="Image">
  <img
    loading="lazy"
    src="/images/blog/2021/wp-gutenberg-editor@2x.png"
    alt="WordPress Gutenberg editor"
    width="587"
    height="275">
  <figcaption>The new Gutenberg editor.</figcaption>
</figure>

Although Gutenberg looks fancy on the surface the data model underneath hasn't change. **Gutenberg blocks are still rendered down to HTML.**  All blocks are concatenated and stored in the same single `post_content` field as before.

The classic WYSIWYG renders a paragraph like this:

```html
<p class="has-large-font-size">This is a <strong>paragraph</strong>.</p>
```

A Gutenberg paragraph block is rendered like this:

```html
<!-- wp:paragraph {"fontSize":"large"} -->
<p class="has-large-font-size">This is a <strong>paragraph</strong>.</p>
<!-- /wp:paragraph -->
```

Each block is wrapped with HTML comments to define its type. The leading comment contains additional serialised JSON. Gutenberg is a React-based UI. It is this front-end JavaScript that is tasked with parsing the HTML/JSON.

> When the editor is interacting with blocks, these are stored in memory as data structures comprising a few basic properties and attributes. Upon saving a working post we serialise these data structures into a specific HTML structure and save the resultant string into the post_content property of the post in the WordPress database. When we load that post back into the editor we have to make the reverse transformation to build those data structures from the serialised format in HTML.
>
> <cite>[Parser Filters documentation](http://github.com/WordPress/gutenberg/blob/3da717b8d0ac7d7821fc6d0475695ccf3ae2829f/docs/reference-guides/filters/parser-filters.md)</cite>

So the useful data structure is transient in browser memory. The stored content is a mishmash based on a non-regular markup language.

## Hold up...

That is an absurdly obscure way to store and edit content!

So why does WordPress go through this rigmarole? As far as I understand, it's an effort to maintain compatibility with the old WYSIWYG post content. Themes and plugins can work with the `post_content` HTML and be none the wiser.

Gutenberg is evidently the future of WordPress. WP 5.8 introduced block-based [widget editing](https://make.wordpress.org/core/2021/06/29/block-based-widgets-editor-in-wordpress-5-8/) and [template editing](https://make.wordpress.org/core/2021/06/16/introducing-the-template-editor-in-wordpress-5-8/). Gutenberg is also an **absolutely monumental hack**. It's a clever hack for sure, but as the foundation for WordPress? I'm worried.

Gutenberg has so many problem to discuss it's overwhelming. I've drafted this blog post a dozen times over the last two years. The accessibility and usability concerns alone are numerous and frightening. The documentation that has been historically fleeting and lagged far behind shipped features. My primary frustrations relate to block templates and styles. Coding WordPress themes has become, quite frankly, a nightmare.

## Block Templates and Styles

Remember how Gutenberg works? **There is no separation of data and presentation.** Block templates *are* the data structure and they're duplicated throughout the database.

Let's say I want to change a block template. Web design tweaks are not unreasonable during and after theme development.

Block templates are defined in React code. So first I'd have to edit and recompile HTML-in-JavaScript. This act alone changes nothing. It has no effect on the HTML already in the database. To update that I'd have to open the Gutenberg editor in a web browser, allow the code to execute, and then re-save the content — and that's just for one instance. I'd have to manually edit multiple posts less the site look outdated in places.

That's the best case scenario.

As you might imagine, parsing HTML/JSON to extract data for React can be a bit of a delicate process. Early versions of Gutenberg would panic and throw a blank screen of death to the user on the slightest mismatch. This was eventually improved to only blank out individual blocks with an 'unsupported' error if something goes astray.

To help avoid errors Gutenberg blocks require a `deprecated` array that includes old template versions along with a `migrate` function. I'll leave you to imagine how readable that code becomes and how pleasant the testing and maintenance is (see [block deprecation](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-deprecation/)).

Gutenberg relies heavily on browser APIs so scripted server-side content edits would be impractical to say the least (if at all possible). Attempting to edit the HTML/JSON string directly without Gutenberg is a disaster waiting to happen.

I'd strongly advise using the [Advanced Custom Fields](https://www.advancedcustomfields.com/) plugin to build custom blocks. You can avoid React code entirely; ACF generates the editor UI. Blocks are stored as JSON-only (serialised in the HTML comment) and rendered with PHP (via `the_content` filter).

### WordPress Core Blocks

WordPress provides many built-in core blocks for typography, buttons, images, column layouts, etc. Core blocks provide their own HTML and CSS. You cannot edit core block templates. You can opt-out... if you want to make Gutenberg useless. You really do not want to attempt to disable and reinvent core blocks. You're basically stuck with front-end code that I'd describe as 'questionable' to be polite.

Adding a `core/button` block generates HTML like:

```html
<!-- wp:buttons -->
<div class="wp-block-buttons">
  <!-- wp:button {"textColor":"blue"} -->
  <div class="wp-block-button">
    <a href="/" class="wp-block-button__link has-blue-color has-text-color">
      Button Text
    </a>
  </div>
  <!-- /wp:button -->
</div>
<!-- /wp:buttons -->
```

WordPress includes a default stylesheet that includes statements such as:

```css
/* /wp-includes/css/dist/block-library/style.min.css?ver=5.8 */
.is-style-outline > .wp-block-button__link:not(.has-text-color),
.wp-block-button__link.is-style-outline:not(.has-text-color) {
  color: currentColor;
}
```

Followed by an inline `<style>` element for good measure:

```html
<style id='global-styles-inline-css'>
body {
  --wp--preset--color--blue: #0000ff;
}
.has-green-color {
  color: var(--wp--preset--color--blue) !important;
}
</style>
```

Preset colours can be defined in `theme.json` or `functions.php`. One of many examples of WordPress shipping half-baked Gutenberg features without clear direction.

There is no apparent methodology to the core blocks code. It's quite literally all over the place. The CSS specificity is out of control. The presence of an `!important` rule in 'themable' code is all but criminal.

It's practically impossible to apply an organisation's existing CSS framework to Gutenberg core blocks without refactoring the majority of it. Even coding a new design from scratch requires abandoning any "best practices" you adhere to. From my experience you just have to grit your teeth and write monstrous overrides to bludgeon the design into place.

I'm embarrassed by some of the code I have to delivery for WordPress themes. Here's the sad thing: **CSS should be a non-issue** with a logical templating system. Gutenberg in this regard is fundamentally flawed by design.

Now let's say I wanted to append an icon `<img>` to the `core/button` block and wrap the label with a `<span>` for convenient styling purposes. The HTML is already committed to the post content. I can't edit the React code for core blocks. I have to use a PHP filter:

```php
add_filter('render_block', 'my_render_block', 10, 2);

function my_render_block($html, $block) {
  if ($block['blockName'] === 'core/button') {
    $html = preg_replace(
      '#(<a[^>]*?>)(.*?)(</a>)#s',
      '$1<span>$2</span><img src="[...]">$3',
      $html
    );
  }
  return $html;
}
```

Isn't that just wonderful code? You might as well go full regular expression here. Gutenberg after all is built on the principle that HTML is suitable to parse this way.

In practice the `render_block` filter is only good for minor hacks.

Another workaround I've seen is to [redeclare core dynamic blocks](https://antistatique.net/en/blog/gutenberg-override-core-blocks-rendering). This forces them to save as JSON-only and adds the `render_callback` for a PHP template (similar to how ACF blocks work). An interesting possibility but future compatibility could be an issue and there's still a lot to reimplement.

Simply put there is no practical way to edit core block templates. It's a lost cause. Attempted to do so will leave you in tears. We're stuck with what WordPress provides. WordPress is also stuck because they can't exactly make meaningful updates without breaking sites.

## I give up...

This is the antithesis of how CMS templating should work.

I've tried for over two years now to adopt Gutenberg wholeheartedly. I'm exhausted trying to work around Gutenberg issues. The majority of developers I know simply disable it. Very telling that the [Classic Editor plugin](https://wordpress.org/plugins/classic-editor/) remains one of the most popular and highest rated plugins in the official directory.

All of these problems stem from what I dubbed earlier as a *"monumental hack."* That inescapable big blob of HTML post content that merges data and presentation. It's fragile, ugly, and unwieldy, and yet WordPress continues to adopt this further. With the new [full site editing](https://make.wordpress.org/core/2021/04/20/full-site-editing-go-no-go-next-steps/) feature — shipped in 5.8 — the entire page template between `<body>` tags is Gutenberg HTML/JSON in the database.

I don't know how anybody could look at Gutenberg and not balk. Who is it for? Are developer pains worth the supposed improvement to user experience? General opinion would suggest that the UX and accessibility are far bigger issues than anything I've bemoaned. I seriously wonder if any new developers are picking up WordPress.

If this is the future of WordPress, it's the beginning of the end.
