---
date: 2020-04-24 10:00:00+00:00
slug: wordpress-gutenberg-react-and-advanced-custom-fields
title: 'WordPress Gutenberg: React & Advanced Custom Fields (ACF)'
description: 'The one where I embrace the best of both worlds.'
---

The new WordPress Gutenberg editor has been in release for over a year. Post content is composed of "blocks". Everything is a block. From the humble paragraph to the more advanced gallery and video embed — all blocks.

There are two common methods to create Gutenberg blocks.

The first is to follow the [offical handbook](https://developer.wordpress.org/block-editor/tutorials/block-tutorial/writing-your-first-block-type/). Blocks and the Gutenberg editor itself are written in JavaScript/React at their core. While I consider myself proficient in this area it's still hard work. The process requires Babel compilation. The documentation is lacking. A single — hard to debug — error can bring down the entire editor.

I've written a lot of Gutenberg React but my preferred method is...

## Advanced Custom Fields

The [ACF plugin](https://www.advancedcustomfields.com/) is one of the few WordPress plugins that doesn't make me cry. ACF allows me to register blocks with the usual ACF interface and a PHP template. All the Gutenberg stuff is handle for me.

This is very nice. If you don't use ACF, you're missing out.

But what if I wanted to combine a native Gutenberg block with an ACF block? Let's say I want to make a **"Feature Video"** block. It includes an embedded video and some content to the side. Along with a few options to configure styles.

A single block that renders like this:

<p class="Image">
  <img loading="lazy" srcset="
    /images/blog/2020/gutenberg-acf-2@1x.png,
    /images/blog/2020/gutenberg-acf-2@2x.png 2x"
    src="/images/blog/2020/gutenberg-acf-2@1x.png"
    alt="Preview for an example Gutenberg block with React and Advanced Custom Fields"
    width="750"
    height="289">
</p>

Gutenberg provides an embed block with a single caption. These are extremely user-friendly. Users just paste a YouTube link — not even embed code — and WordPress does the rest. However it lacks the additional fields I require.

ACF does have an [oEmbed](https://www.advancedcustomfields.com/resources/oembed/) field but it isn't half as nice. For the sake of this demo I've deciding it's not good enough (it is, I just wanted a simple example).

Neither method allows me to create the **Feature Video** block to my satisfaction.

What if I could combine both methods like this:

<p class="Image">
  <img loading="lazy" srcset="
    /images/blog/2020/gutenberg-acf-1@1x.png,
    /images/blog/2020/gutenberg-acf-1@2x.png 2x"
    src="/images/blog/2020/gutenberg-acf-1@1x.png"
    alt="Editor UI for an example Gutenberg block with React and Advanced Custom Fields"
    width="793"
    height="556">
</p>

In the screenshot above I have a single Gutenberg block that combines a native video embed with ACF fields that I can configured.

The best of both worlds.

## How I created the Feature Video block

The trick to my **Feature Video** block is [block templates](https://developer.wordpress.org/block-editor/developers/block-api/block-templates/) — but I'll get to that later.

First I created an [ACF block](https://www.advancedcustomfields.com/resources/acf_register_block_type/) to handle the custom fields.

```php
acf_register_block_type(
  array(
    'name'     => 'feature-video-fields',
    'title'    => 'Feature Video Fields',
    'mode'     => 'edit',
    'category' => 'theme',
    'parent'   => array('feature-video'),
    'supports' => array(
      'align'    => false,
      'mode'     => false,
      'inserter' => false,
      'reusable' => false
    )
  )
);
```

I've omitted a render callback because this inner block has no preview. Note the `parent`, `inserter`, and `reusable` properties. This block is not intended to be used alone. It can only exist within a `feature-video` block.

Custom `category` values must be added via the [block categories filter](https://developer.wordpress.org/reference/hooks/block_categories/).

ACF is used as normal to assign fields to this block.

<p class="Image">
  <img loading="lazy" srcset="
    /images/blog/2020/gutenberg-acf-3@1x.png,
    /images/blog/2020/gutenberg-acf-3@2x.png 2x"
    src="/images/blog/2020/gutenberg-acf-3@1x.png"
    alt="Fields UI for an example Gutenberg block with React and Advanced Custom Fields"
    width="900"
    height="491">
</p>

### Block Templates

The parent **Feature Video** block is created with JavaScript:

```javascript
import {registerBlockType} from '@wordpress/blocks';
import {InnerBlocks} from '@wordpress/block-editor';
import {createElement} from '@wordpress/element';

registerBlockType('theme/feature-video', {
  title: 'Feature Video',
  category: 'theme',
  edit: props => {
    return createElement(InnerBlocks, {
      template: [
        ['core/embed', {}],
        ['acf/feature-video-fields', {}]
      ],
      templateLock: 'all'
    });
  },
  save: props => {
    return createElement(InnerBlocks.Content, {});
  }
});
```

The **edit** function returns a block template that composes the `core/embed` block with the `acf/feature-video-fields` block I just created. This composition acts as a single combined block for the user.

When inserted into the post content (via **save**) the fields block has no HTML render. (I will be using a PHP template for this.) Formatted for readability:

```html
<!-- wp:theme/feature-video -->

<!-- wp:embed {"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ","type":"video","providerNameSlug":"youtube"} -->
<figure class="wp-block-embed is-type-video is-provider-youtube"><div class="wp-block-embed__wrapper">
https://www.youtube.com/watch?v=dQw4w9WgXcQ
</div></figure>
<!-- /wp:embed -->

<!-- wp:acf/feature-video-fields {"id":"block_5ea289f31528c","name":"acf/feature-video-fields","data":{"heading":"Never Gonna Give You Up","introduction":"\u0022Never Gonna Give You Up\u0022 is a song recorded by British singer and songwriter Rick Astley, released as a single on 27 July 1987. It was written and produced by Stock Aitken Waterman. (Wikipedia)"}} /-->

<!-- /wp:theme/feature-video -->
```

To provide a template for **Feature Video** I add a render block filter:

```php
add_filter(
  'render_block',
  'render_feature_video_block'
  10, 2
);
```

And the hook callback:

```php
function render_feature_video_block($html, $block) {
  // Ignore other blocks
  if ($block['blockName'] !== 'theme/feature-video') {
    return $html;
  }
  // Include, capture, and return the block template
  ob_start();
  $path = locate_template("blocks/feature-video.php");
  include($path);
  $html = ob_get_contents();
  ob_end_clean();
  return $html;
}
```

The template path is relative to the WordPress theme. Within the template I can access both inner blocks.

HTML for the `core/embed` is already rendered by Gutenberg:

```php
// Get the `core/embed` HTML (<figure class="wp-block-embed ...)
$embed = $block['innerBlocks'][0]['innerHTML'];
```

To access the `acf/feature-video-fields` ACF values:

```php
$fields = $block['innerBlocks'][1];
// Get the block ID and use ACF function
$id = $fields['attrs']['id'];
$heading = get_field('heading', $id);
// Or via the nested `data` array
$heading = $fields['attrs']['data']['heading'];
```

With the template written my **Feature Video** block is complete.

## Taking it further (a preview)

You may have noticed something is missing. ACF Gutenberg blocks have a nice Edit/Preview toggle. My block only has an edit mode.

This functionality can be replicated without too much difficulty. Part of the solution is to add `BlockControls` to the `edit` function.

Something like:

```jsx
import {BlockControls} from '@wordpress/block-editor';
import {Button, Toolbar} from '@wordpress/components';

const MyBlockControls = props => {
  return (
    <BlockControls>
      <Toolbar>
        {props.isEditing ? (
          <Button label="Preview" icon="visibility" onClick={onClick} />
        ) : (
          <Button label="Edit" icon="edit" onClick={onClick} />
        )}
      </Toolbar>
    </BlockControls>
  );
};
```

This component can be used to toggle between the block template or preview.

I'll leave that as a homework exercise for now!

I do plan to add full example code to GitHub with this and more. It's possible to render the preview within an `<iframe>`. This is very helpful for scoping theme CSS and avoiding conflicts with the WordPress admin styles.

More on that when I have time...

## Update for May 2020

I've written a new article: ["WordPress Gutenberg Example Blocks"](/2020/05/08/wordpress-gutenberg-react-acf-example-blocks/).
