---
date: 2020-05-08 10:00:00+00:00
slug: wordpress-gutenberg-react-acf-example-blocks
title: 'WordPress Gutenberg Example Blocks'
description: 'The one where I share a few examples without a lot of boilerplate.'
---

Following [my last article](/2020/04/24/wordpress-gutenberg-react-and-advanced-custom-fields/) I've published a new GitHub repo:

[WordPress Gutenberg Example Blocks](https://github.com/dbushell/dbushell-gutenberg-example)

In there I've coded examples of Gutenberg block development wrapped up in a tidy WordPress plugin you can try out.

I start with the most basic block possible. I follow with iterations of more advanced functionality. I've kept the boilerplate and dependencies to a bare minimum to keep the important stuff prominent. Then I go a bit crazy and experiment with ideas.

I've outline a few of the blocks below. See the [project documentation](https://github.com/dbushell/dbushell-gutenberg-example/blob/master/README.md) for more information. Keep watch for future additions.

## 01 - Basic

<p class="Image">
  <img loading="lazy" srcset="
    /images/blog/2020/gutenberg-01-basic@1x.png,
    /images/blog/2020/gutenberg-01-basic@2x.png 2x"
    src="/images/blog/2020/gutenberg-01-basic@1x.png"
    alt="A basic Gutenberg block example"
    width="688"
    height="156">
</p>

The first example is the most basic of Gutenberg blocks created with React. The editor and front-end render the same uneditable content. The block has no functionality.

## 02 - Text Control

<p class="Image">
  <img loading="lazy" srcset="
    /images/blog/2020/gutenberg-02-text-control@1x.png,
    /images/blog/2020/gutenberg-02-text-control@2x.png 2x"
    src="/images/blog/2020/gutenberg-02-text-control@1x.png"
    alt="A Gutenberg block example with a Text Control"
    width="688"
    height="188">
</p>

The second example takes the basic block and makes the content editable. The Gutenberg editor renders a [text control](https://github.com/WordPress/gutenberg/tree/master/packages/components/src/text-control) that updates the related [block attribute](https://developer.wordpress.org/block-editor/developers/block-api/block-attributes/). The front-end renders the block using the `text` attribute value.

## 03 - ACF

<p class="Image">
  <img loading="lazy"
    src="/images/blog/2020/gutenberg-03-acf.gif"
    alt="A Gutenberg block example registered with the ACF plugin"
    width="650"
    height="166">
</p>

The third example takes a detour away from React. It uses the [Advanced Custom Fields (ACF) plugin](https://www.advancedcustomfields.com/) to register the block with PHP.

## 04 - Preview Mode

<p class="Image">
  <img loading="lazy"
    src="/images/blog/2020/gutenberg-04-preview-mode.gif"
    alt="A Gutenberg block example with an edit/preview toggle"
    width="650"
    height="182">
</p>

The fourth example — inspired by ACF — moves back to React and adds an edit/preview toggle to the text control block. This allows the front-end block render to be visible in the Gutenberg editor.

## And More!

See the [blocks and WordPress plugin](https://github.com/dbushell/dbushell-gutenberg-example) for further examples and documentation. I plan to update it every so often with more ideas. My preference is to use ACF for block development. Unless I have special requirements, the ease-of-use for multiple developers is a major benefit.
