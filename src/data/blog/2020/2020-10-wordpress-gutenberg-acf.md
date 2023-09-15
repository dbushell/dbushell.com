---
date: 2020-10-05 10:00:00+00:00
slug: wordpress-gutenberg-and-tips-for-acf-blocks
title: 'WordPress, Gutenberg, and Tips for ACF Blocks'
description: 'The one where I share quick tips for WordPress/ACF developers (after going off on a rant).'
---

In December 2018 [WordPress 5.0 launched](https://wordpress.org/news/2018/12/bebo/) with the addition of the already divisive **Gutenberg editor**. Gutenberg is a radical departure from the classic [WYSIWYG](https://en.wikipedia.org/wiki/WYSIWYG) editor but its purpose remains the same; to provide a UI that ultimately saves a big chunk of HTML representing the page content.

Gutenberg is a React-powered UI. The core editor provides "blocks" for common units of content. A paragraph is a block. So is a list, an image, and an embedded video – you get the point. Everything is a block.

I'd strongly recommend using the **ACF** ([Advanced Custom Fields](https://www.advancedcustomfields.com/)) plugin to develop custom blocks. It's easily the best WordPress plugin for developers. Especially for working with Gutenberg — I've a couple of quick tips below. But first, something resembling a rant. It's been many years since I've gone off on this blog so forgive me if I restrain myself.

## The Gutenberg Struggle

I've worked with WordPress for a long, long time, and extensively with Gutenberg pre and post its official launch. I also consider myself proficient in JavaScript and React. I say that to qualify my opinion but also to point out I'm invested in the success of WordPress.

**Gutenberg wasn't fit to launch and still isn't ready today.**

Sounds like a harsh take but it's far from an uncommon opinion. Gutenberg is not ready for users and decidedly "alpha" for developers. Documentation is fleeting. Bugs are everywhere. It's concerning how many searches have led me to unresolved GitHub issues dating back years. Some of the features and priorities are simply puzzling in light of what's missing.

Rant over.

I'd hate to disparage the hard work that has gone into Gutenberg but there are some serious issues with the direction Automattic has taken this project.

I've attempted to pen a more thoughtful blog post on this topic for weeks but frankly life is too short. I'd rather share helpful stuff. So like I said; use the [ACF plugin](https://www.advancedcustomfields.com/) to develop Gutenberg blocks. It's rarely financially viable to do it the native React way. I do hope that changes. I actually like what Gutenberg is trying to do. It just needed more time in the oven.

## A Quick Tip of ACF Developers

*Anyway*, here's my first tip. If you're using ACF to register blocks with [`acf_register_block_type`](https://www.advancedcustomfields.com/resources/acf_register_block_type/) you've probably provided a PHP template.

You can easily reuse that block outside of Gutenberg:

```php
// Render `custom-block` anywhere
acf_render_block(
    array(
    'id'   => uniqid('block_'),
    'name' => 'acf/custom-block',
    'data' => array(
      'text_field_name' => 'Hello world!'
    )
  )
);
```

With the `acf_render_block` function you can render ACF registered blocks in any WordPress template. This is handy to avoid duplicate code.

In this example I've registered a block named `custom-block`. ACF blocks are prefixed so with this function call it becomes `acf/custom-block`. The `id` isn't important it just needs to be unique starting with `block_`. The `data` array is important. This is data for the ACF fields. In the block template I might use the field like so:

```php
$text = get_field('text_field_name');
echo "<p>{$text}</p>";
```

There you go. An easy way to define reusable blocks for both Gutenberg and standard WordPress templating.

## A Bonus ACF Blocks Tip!

As I'm writing this on a Sunday morning and the football doesn't kick off for another hour here is a bonus tip! Registering each block individually becomes tedious the more you have. Why not register them all automatically?

I stick all my block templates in a theme directory like so:

```
wp-content/themes/custom-theme/blocks/custom-block.php
```

I actually use the directories `blocks` and `containers` for two block categories. That's a personally organisation preference.

In the block templates I add a leading PHP comment:

```php
<?php
/*
Block Name: Custom Block
Block Description: An example custom ACF block.
Post Types: post, page, custom-type
*/
```

Finally in the theme `functions.php` I add an `acf/init` action hook:

```php
add_action('acf/init', 'custom_acf_init');

function custom_acf_init() {
  // Get an array of theme PHP templates
  $theme = wp_get_theme();
  $files = $theme->get_files('php', 2, false);

  // Iterate over and ignore non-block templates
  foreach ($files as $filename => $filepath) {
    if (preg_match('#^partials/(block|container)s?/#', $filename, $matches) !== 1) {
      continue;
    }
    // Read the PHP comment meta data for the block
    $meta = get_file_data($filepath, array(
      'name'        => 'Block Name',
      'description' => 'Block Description',
      'post_types'  => 'Post Types',
      'mode'        => 'Block Mode',
      'align'       => 'Block Align'
    ));
    // Skip template if a name is not provided
    if (empty($meta['name'])) {
      continue;
    }
    // Convert the post types to an array (or use defaults)
    $post_types = array_filter(
      array_map('trim', explode(',', $meta['post_types']))
    );
    if (empty($post_types)) {
      $post_types = array('page', 'post');
    }
    // Register the ACF block using the meta data
    acf_register_block_type(array(
      'name'              => "{$matches[1]}_" . sanitize_title($meta['name']),
      'title'             => $meta['name'],
      'description'       => $meta['description'],
      'category'          => "theme_{$matches[1]}s",
      'post_types'        => $post_types,
      'render_template'   => $filepath,
      'supports'          => array(
        'align'           => boolval($meta['align']),
        'mode'            => $meta['mode'] !== 'false',
        'customClassName' => false
      ),
    ));
  }
}
```

The hook callback iterates over theme templates, reads the comment meta data, and registers each ACF block. When I create a new block I just write the template and it is registered automatically. You'll notice additional meta data can be used for the various `supports` config. Functionality here could be extended.

This is a real time saver and avoids a long list of similar `acf_register_block_type` calls.

WordPress Gutenberg development doesn't have to be painful. The core experience may be lacking, but plugins like ACF and a little ingenuity can pick up the slack.

Related posts from my blog:

* [WordPress Gutenberg Example Blocks](/2020/05/08/wordpress-gutenberg-react-acf-example-blocks/)
* [WordPress Gutenberg: React & Advanced Custom Fields (ACF)](/2020/04/24/wordpress-gutenberg-react-and-advanced-custom-fields/)
* [Docker, WordPress, and Portless Localhost Domains](/2020/02/07/docker-wordpress-portless-localhost-domains/)

Send me a tweet [@dbushell](https://twitter.com/dbushell) if you have similar tips.
