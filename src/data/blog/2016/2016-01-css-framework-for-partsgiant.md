---
date: 2016-01-04 10:00:00+00:00
draft: false
slug: css-framework-for-partsgiant
template: single.html
portfolio: true
title: 'CSS Framework for Parts Giant'
---

## 2021 Update

I've completed a [new component library](/2021/07/01/new-component-library-for-parts-giant/) project that will replace this work.

## Original Article

**[Parts Giant](http://www.partsgiant.com/) is a soon to launch e-commerce store based in Michigan, USA.**

I was hired to build the Parts Giant front-end CSS framework and HTML templates. The work would be done in stages throughout the year. This required flexibility on my part and scalability in the codebase I developed.

I’ve always championed the idea of maintainable, future-proof coding practices. With this project I’d put my own ideas to the test by building upon work I’d done months before.

![Parts Giant Designs](/images/portfolio/partsgiant-designs.png)

## Stage 1: Responsive Website

To kick off the project Parts Giant provided 15 template designs and an interactive wireframe mock-up of the website.

I began by doing a ‘content’ or ‘component’ inventory. Basically, this means going through the design and itemising common elements and patterns. These can be coded once and reused across multiple templates (or used as a base for more advanced components).

I started coding the typographic elements. This is usually a simple task but a vital ingredient. The client gave me freedom to adapt the designs to ensure consistency. I documented each component with HTML examples to show structure and CSS class names. I find a [BEM](http://csswizardry.com/2015/08/bemit-taking-the-bem-naming-convention-a-step-further/)-like naming convention most usable.

![Button component - Parts Giant CSS Framework](/images/portfolio/partsgiant-buttons.png)

In the screenshots below you can see how the *Dropdown* component makes use of a *Button* (above). The basic *Dropdown* was inherited for more advanced versions like the cart preview. The *Dropdown* also exists as part of the *Search* component.

![Dropdown component - Parts Giant CSS Framework](/images/portfolio/partsgiant-dropdowns.png)

![Search component - Parts Giant CSS Framework](/images/portfolio/partsgiant-search.png)

The primitive components like the *Button* allowed for rapid development of similar use cases:

![Sorting component - Parts Giant CSS Framework](/images/portfolio/partsgiant-sorting.png)

Products are listed across the [Parts Giant](http://www.partsgiant.com/) website with varying amounts of content. I created one *Product* component whose children can be added or removed depending on use. The *Stars* and *Rating* sub-components were abstracted for use elsewhere.

![Product component - Parts Giant CSS Framework](/images/portfolio/partsgiant-products.png)

Whilst developing these components I documented them in a pattern library (or "front-end style guide" if you prefer that terminology).

To complete the library I identified common layout patterns. With these I could quickly piece together each template and insert the required components. Very little additional CSS was required for individual templates. In these cases I created larger component groups rather than applying unique styles to the page.

The result is a modular CSS framework with minimal repetition.

**The final CSS stylesheet was 147KB** (unminified and uncompressed). That's very small for such a large e-commerce website.

## Stage 2: Admin Interface

Later in the year I was asked by Parts Giant to build their admin interface that would be used to manage products, customers, orders, and other content. Another 15 template wireframes were provided. The design shared the style of the main website so it made sense to built upon the CSS framework I’d already developed.

![Parts Giant Admin Design](/images/portfolio/partsgiant-admin.png)

I decided to keep the admin styles as a separate add-on, rather than integrating back into the main CSS to avoid unnecessary file size on the user-facing pages.

**The final admin stylesheet was an additional 24KB** (on top of the 147KB base).

## Stage 3: Mobile Framework

Although I had developed the main website with a responsive and ’mobile-first’ approach it was decided that a dedicated mobile website would allow for a more tailored experience. This also gave us an opportunity to finely tune page speed and performance for smaller screens.

Usually I prefer one responsive website but for e-commerce I can understand the benefits of the mobile website approach.

![Parts Giant Mobile Design](/images/portfolio/partsgiant-mobile.png)

Like the first two stages Parts Giant sent me wireframes to build (around 20 this time). I branched of the main CSS framework and created a reduced version for mobile. Many of the smaller components are shared. Those not used on mobile were removed.

I coded each component as a [Sass](http://sass-lang.com/) include (in separate files) so nothing was duplicated. An update to the *Button* for example would update both the responsive and mobile frameworks.

**The entire mobile CSS framework was only 54KB**.

On the main website I'd used jQuery for interactive components. On mobile I removed this dependency; only 14KB of JavaScript was needed for the interactive components. All of which were progressively enhanced to ensure accessibility without JavaScript.

## Final Thoughts

It was a joy to work with Parts Giant and I look forward to any opportunity I may receive to work with them again. Most of the work I do is maintained by the website owner once the project is over. With this project it was a nice experience to jump back into my ‘old’ code and see for myself how usable my methods are. Thankfully, they work!

A big decision early on was to decide whether or not to build upon an existing 'framework' like [Bootstrap](http://getbootstrap.com/). As of v3.3.6 Bootstrap’s base CSS is 146KB alone — my final stylesheet was only 1KB larger. Had I built upon Bootstrap it would have been upwards of 250KB. It would also have been near impossible to achieve the 54KB slimline framework I developed for mobile.

Bootstrap is a good tool for prototyping but in my opinion, unnecessary and overly complicated for production. On the surface these starter frameworks look tempting, but honestly, from experience they really don't provide much of a head start. Even before visual design is applied too many decisions have been made in the HTML & CSS that require resetting. This bloats the code and is much harder to understand and maintain.

Documentation is very important for a project like this. But it can be overdone. As I developed components for Parts Giant I place them on a single web page to test. I added notes and code examples only for the less intuitive ones. Eventually I categorised them on multiple pages using the website navigation and layout patterns for better formatting.

Documentation wasn’t actually requested by the client (they were only expecting a few comments in the stylesheet). With my approach I was able to deliver something much more readable with very little overhead. What I delivered was simply a product of my process building the CSS framework.

[Looking for a developer/designer for your project? Get in touch!](/contact/)
