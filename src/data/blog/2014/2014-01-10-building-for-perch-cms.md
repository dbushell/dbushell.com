---
date: 2014-01-10 08:37:56+00:00
excerpt: None
slug: building-for-perch-cms
template: single.html
title: Building for Perch CMS
---

[Perch CMS](http://grabaperch.com/) has been on my radar for a few years now and given the praise I continue to see I figured it was time to learn the ins and outs of Perch development.

![Perch logo](/images/blog/2014/perch-logo.png)

Perch is a very good CMS for both development ease and content editing. After spending a week with Perch I feel confident it can handle my typical client website and I look forward to using it in production soon. Here's my experience so far.

## A little background

WordPress has long been my CMS of choice. While the overall experience isn't the most polished it does offer unrivalled depth in resources and community. Given my years with the platform it's nigh impossible for me to become unstuck. What makes WordPress so good is that it quietly solves problems and offers so many little features you rarely notice are essential but miss if they don't exist. It's a hodgepodge for sure but it always gets the job done, one way or another.

I'm content with WordPress from a developer perspective, but for website owners the experience of content editing isn't great. It often requires a great deal of plugins and custom development to move beyond the traditional blog format. The resulting admin interface is disorganised and cluttered, an issue not helped by the recent [cosmetic changes](http://wordpress.org/news/2013/12/parker/) reducing the visual boundaries between components.

I've toyed with other platforms in the past but I've never found the right balance between development and editing. How does Perch fare?

## Working with Perch

Since I have static HTML templates and content for this website ([dbushell.com](/)) I decided to build a local version on Perch.

With Perch every page can either have its own unique template, or inherit from a master. These page templates can use includes as you might expect (they're written in PHP) so the first thing I did was separate the header and footer.

Content on a page is broken down into **editable regions**. Regions can be anything from a single element to a large component. I split my home page into four logical regions as outlined in the screenshot below:

![dbushell.com home page screenshot with editable regions outline](/images/blog/2014/home-page-regions.png)

In my home page template I replaced the hard-coded content with single functions to inform Perch of the four regions I've sensibly named 'Introduction', 'Image', 'Links', and 'Features'.

````php
<?php perch_content('Image'); ?>
````

Now when I edited the page in the Perch admin area I first select which region I want to edit. This is a tidy solution to avoid one big form:

![Region editing in Perch](/images/blog/2014/region-editing.png)

The first time a region is selected to edit you have to assign a partial template. It's within this template that each piece of content and its markup is defined for that region. For example, when I first edited my 'Image' region I selected a pre-defined partial template:

![Selecting a region template in Perch](/images/blog/2014/region-template-selection.png)

Once a partial template is assigned, and on subsequent region editing, Perch presents a form to edit content within that region:

![Editing region content with Perch](/images/blog/2014/region-content-editing.png)

The partial template used for this region looks like this:

````markup
<img src="<perch:content type="image" id="image" label="Image" />" alt="<perch:content type="text" id="alt" label="Description" required="true" title="true" />">
````

You can see the HTML `<img>` element with `src` and `alt` attributes. These attributes contain special [Template Tags](http://docs.grabaperch.com/docs/content/template-tags/) used to define the content within the region. It's these tags that Perch uses to generate the edit form. The type attributes tell Perch what form field to display. (It's even possible to define custom [Field Types](http://docs.grabaperch.com/docs/field-types/) for more complex data input.)

This 'Image' region is very simple but a region's template can contain as much HTML and pieces of content as required. Perch leaves it up to you to break a page down into sensible regions. After creating and assigning my 'Features' region template, Perch did a great job on the form:

![Editing a large content region with Perch](/images/blog/2014/large-region-editing.png)

Template tags act as placeholders for content and define the field required for input. They also have attributes that influence the admin interface such as the label, help text, and character limits.

I found this combination of regions and templates very intuitive and quick to build. There are no CMS constraints to worry about when designing page content. This is very different — and hugely refreshing — from my experience with WordPress which requires additional plugins like [Advanced Custom Fields](http://www.advancedcustomfields.com/) to do anything more complex than a single editable WYSIWYG area.

## Extending with Perch Apps

Perch can be extended with "Apps" that add a new section to the admin area to manage specific content. While pages are very generic with content defined by editable regions, apps can be more prescribed in their content structure and functionality. I'm not keen on the word "App" in this context but I won't lose sleep over it!

[The blog app](http://grabaperch.com/add-ons/apps/blog) is a good example:

![Perch Blog App](/images/blog/2014/blog-app.png)

The blog comes with a default set of templates as an example but blog content is not limited to these pages or their format. My website lists recent posts in the footer:

![dbushell.com footer blog design](/images/blog/2014/footer-blog-design.png)

This was very easy to implement in my global footer include:

````markup
<h2>From the blog…</h2>
<?php
perch_blog_custom(array(
    'count'      => 6,
    'sort-order' => 'DESC',
    'sort'       => 'postDateTime',
    'template'   => 'post_in_footer.html'
));
?>
````

Similar to how partial templates are assigned to regions, the blog app allowed me to define a template I named `post_in_footer.html` in which I have access to special template tags like `<perch:blog id="postTitle" />` within the HTML.

## No hidden code

One aspect of Perch that has delighted me is that I've never once had to compromise on markup to conform to a particular convention.

WordPress is particularly notorious for the amount of hard-coded HTML it likes to spew out. Often you either do it the WordPress way or reinvent the wheel. Take blog categories for example. WordPress templates can use [wp_list_categories()](http://codex.wordpress.org/Template_Tags/wp_list_categories) which takes up to **24 different arguments** to generate a big chunk of HTML. Real ugly. The alternative, which I prefer, is to use [get_categories()](http://codex.wordpress.org/Function_Reference/get_categories) which returns a PHP array.

Perch handles these situations a lot better. The blog app provides the function [perch_blog_categories()](http://docs.grabaperch.com/docs/blog/page-functions/perch-blog-categories/) which utilises a default partial template:

````markup
<perch:before>
<h3>Categories</h3>
<ul>
</perch:before>

    <li>
        <a href="archive.php?cat=<perch:blog id="categorySlug" />">
            <perch:blog id="categoryTitle" /> (<perch:blog id="qty" />)
        </a>
    </li>

<perch:after>
</ul>
</perch:after>
````

Perch is fully transparent. Wherever I'm listing categories I can opt to style this default template or create and specify my own. All the template variables are there too so I don't need to go hunting through documentation.

## Final thoughts

Perch is remarkably simple and flexible and I find the way that it handles templates to be very smart. With the core platform and blog app you have something that can compete with vanilla WordPress in my opinion. WordPress still wins on blogging functionality, and developing the templates really isn't too painful here, but when it comes to managing content for non-blog website design, Perch is a breath of fresh air.

Next up I'm going to look into developing a Perch app to manage a specific section of a website (a design portfolio for example). While this content could be managed with basic pages — maybe using repeatable regions or master templates — it seems to me that apps can offer a more tailored admin interface. I'll let you know how I get on!

Be sure to look at what [Perch](https://grabaperch.com/) offers yourself as it has a lot more functionality like search and forms I haven't covered here.
