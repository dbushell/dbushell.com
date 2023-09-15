---
date: 2016-10-10 10:00:00+00:00
draft: false
slug: building-a-shopify-theme
template: single.html
portfolio: true
title: 'Building a Shopify Theme'
---

**Shopify** is an ecommerce platform that offers themeable store fronts online. I worked alongside the wonderful folks at [**Studio Tangerine**](http://studiotangerine.co.uk/) to develop a Shopify theme. I've documented interesting aspects of the process below.

![Shopify theme design](/images/blog/2016/shopifytheme-homepage-design.png)

## Getting started

If you're familiar with [my workflow](/2016/07/14/building-a-wordpress-theme/) it will be no surprised that I first translated the design into static HTML & CSS before worrying about integration. Like all good designs this one was very modular so I coded a single page of all components and patterns.

![Shopify front-end pattern library](/images/blog/2016/shopifytheme-pattern-library.png)

Building this page in the vein of a pattern library gave us the perfect opportunity to review the responsive design and interactive elements in the browser. Elements were tweaked and final decisions were made on things like the responsive navigation. I did preliminary browsering testing to ensure no major rendering issues — much easier to fix now than later!

## Setup and tools

[Theme development](https://help.shopify.com/themes/development/templates) for Shopify is well documented. The [Liquid reference](https://help.shopify.com/themes/liquid) is all I've needed to see what data objects and filters are available for each template.

I find it best to layout the initial templates and includes with placeholder content. Once the structure is in place I go back and integrate the real data.

Shopify themes comprise of six directories:

* `/assets/` — a flat directory of all images, CSS, and scripts
* `/templates/` – Liquid templates for all predefined Shopify pages
* `/layout/` – high level templates (often just one required)
* `/snippets/` – includes that can be reused across templates
* `/config/` — JSON data for configuration and theme settings
* `/locales/` – locale files for internationalization

Themes have to be developed and tested on the Shopify servers. This is not ideal but they do allow the creation of dev stores. A tool I've found useful is [grunt-shopify](https://github.com/wilr/grunt-shopify). It fits into my [existing workflow](/2016/07/12/new-origins/) and has a `watch` command to upload template changes. Shopify will even return Liquid validation errors as terminal notifications; no need to refresh the browser.

## Interactive baskets

When a customer clicks the "Add to Basket" button Shopify will take them to the checkout page by default. Shopify does however provide a JavaScript API that makes on-page interactivity a breeze to implement.

![Shopify theme - interactive 'add to basket'](/images/blog/2016/shopifytheme-addtobasket.gif)

![Shopify theme - interactive basket](/images/blog/2016/shopifytheme-basket.gif)

For this project I used [**Cart.js**](https://cartjs.org/) which is an API wrapper and library to manage products in the basket. The trick is to override the form submission and call `CartJS.addItem()` passing the product variant ID, quantity, and callbacks. The Shopify API returns product data or a variety of errors such as insufficient stock so the customer can be informed accordingly.

![Shopify theme - interactive basket](/images/blog/2016/shopifytheme-basket.png)

I'm using [**Mustache.js**](https://github.com/janl/mustache.js) for HTML templating. When Cart.js updates — new products added or items removed — the on-page basket is re-rendered. To do this I simply pass Mustache the HTML template and JSON data for the products.

The basket template exists within the document source for initial reference. An abbreviated example would look like this:

```markup
<script id="basket-template" type="text/x-mustache-template">
  {{# items }}
  <article class="basket-item">
    <a href="{{ url }}">{{ title }}</a>
  </article>
  {{/ items }}
  <!-- continued... -->
```

This method avoids heavy, manual DOM manipulation. Mustache generates all the HTML and updates a single element. For example:

```javascript
var template = $('#basket-template').html();
var html = Mustache.render(template, { 'items': CartJS.cart.items });
$('.basket-popup').html(html);
```

If the basket design changes we can just edit the template and not worry about the JavaScript. An event listener is bound to the root basket element for the "remove" buttons. On click the Cart.js items are updated which triggers the basket to be rendered again. Mustache is under 10kb; we don't need anything large like Angular or React to solve this problem.

## Getting fancy with variants

Products in Shopify can have up to three options and product variants are generated as combinations thereof. By default Shopify only displays a single `<select>` input to choose all available variants from:

![Shopify theme - default product option](/images/blog/2016/shopifytheme-product-options-1.png)

This isn't an ideal user experience, especially if there are hundreds of variants, so we're using a bit of JavaScript magic to break this field apart into multiple options:

![Shopify theme - advanced product options](/images/blog/2016/shopifytheme-product-options-2.png)

The product options for "Size" and "Colour" have a unique UI design. Any other options are renders as individual `<select>` inputs. The default input is hidden and its value is updated to match the variant chosen from these options.

**Although this approach offers a much more usable interface it can lead to issues if certain variants are not available.**

Say for example you have a "Small/Red" sweater, but "Medium/Red" is out of stock, and the "Large" size doesn't even come in that colour. In the original single input the "Medium/Red" option is disabled and "Large/Red" doesn't exist.

Our new interface doesn't account for this and it becomes quite the nightmare to figure out which options to disable. If the user selects "Medium" we could disable the "Red" option. But what if the user chooses the colour "Red" first, do we disable the "Medium" option, even if that's their preferred size?

*Amazon.co.uk* disables options from top to bottom. So in this example only colours available in the selected size are enabled. If a different colour is selected, the chosen size may be reset to nothing. This requires trial and error from the users to figure out which variants exist.

I've opted not to disable anything for simplicities sake. If users does try to add an unavailable variant to the basket they'll get an appropriate alert. This decision is helped by the fact that this store wont be managing stock levels on Shopify.

## Working with content

Building a Shopify theme is always a pleasant experience. The platform is very well documented and Liquid templates allow for a lot of design freedom.

It should be noted however that Shopify websites have a set formula with predefined templates. All stores follow the same format and you cant change the admin area (outside of theme settings). For example, each product has a single description:

![Shopify theme - editing product description](/images/blog/2016/shopifytheme-product-edit.png)

To achieve the accordion design for this content requires JavaScript:

![Shopify theme - product description as accordion design](/images/blog/2016/shopifytheme-product-description.png)

I used JavaScript to break apart the content by heading elements `<h1>` to `<h6>` before adding the expand/collapse to each section. This technique works fine on the front-end but the admin interface isn't as intuitive as it could be.

Similarly, pages are limited to one content area. To manage the hero carousel we can only provide fields within the theme settings (which are somewhat limited).

![Shopify theme - carousel settings](/images/blog/2016/shopifytheme-carousel-edit.png)

## Final thoughts

It's important to understand exactly what a Shopify website can do before choosing it as an ecommerce platform. It is very good at what it does and a joy to build for, but it's not a CMS with limitless potential. Still, I couldn't be more pleased when asked to build a theme.

If you're considering Shopify and need a designer and/or developer, [please get in touch](/contact/) and we can discuss the possibilities.
