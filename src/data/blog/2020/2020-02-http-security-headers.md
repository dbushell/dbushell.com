---
date: 2020-02-28 10:00:00+00:00
slug: http-security-headers-and-inline-resources
title: 'HTTP Security Headers and Inline Resources'
description: 'The one where I figure out HTTP security headers and inline resources for my progressive web app.'
---

As it turns out, HTTPS is not the end-all to securing a website.

[Mozilla Observatory](https://observatory.mozilla.org/) and [Security Headers](https://securityheaders.com/) both scan HTTP headers and report back on adherence to, or lack thereof, best practices.

In my case _dbushell.com_ gets a big fat **"F"**. I'm hosting on GitHub Pages so there is not much I can do except use a `<meta>` tag (more on that later). [I am using Netlify](/2020/01/27/building-a-pwa-with-netlify-functions/) to host a few other websites&thinsp;/&thinsp;PWAs.

In testing I configured `netlify.toml` to add:

```toml
[[headers]]
  for = "/*"

  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Content-Security-Policy = "default-src 'self'; frame-ancestors 'none'"
```

These HTTP headers direct the browser as follows:

1. [X-Frame-Options](https://infosec.mozilla.org/guidelines/web_security#x-frame-options): disallow the site from being iframed
2. [X-XSS-Protection](https://infosec.mozilla.org/guidelines/web_security#x-xss-protection): add cross-site scripting protection (older browsers)
3. [X-Content-Type-Options](https://infosec.mozilla.org/guidelines/web_security#x-content-type-options): only load resources with a correct MIME type
4. [Content Security Policy](https://infosec.mozilla.org/guidelines/web_security#content-security-policy): whitelist where resources can be loaded from

CSP from what I understand is the new "standard" that overrides the first three headers. It provides nuance in directives for each type of resource.

Naturally, when I deployed this update and refreshed my PWA it was broken. There was no CSS being applied despite the CSS being right there; inlined within a `<style>` element. This was because the `default-src 'self'` directive only allows same domain sources and blocks inline. I could extend this to read:

```
default-src 'self'; style-src 'unsafe-inline';
```

As the directive suggests this is considered "unsafe". [Further research](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/style-src) suggests one of the safest and coolest options is to add a cryptographic hash:

```
default-src 'self'; style-src 'sha256-[hash]';
```

With this directive the inline css cannot be altered without breaking the hashed value. This includes any CSS changes I make. For a statically generated site the build process requires an additional step.

Easy enough to do in Node:

```javascript
const fs = require('fs');
const csso = require('csso');
const crypto = require('crypto');

// Read CSS source file
let css = fs.readFileSync(`stylesheet.css`);
// Minify the CSS for inlining
css = csso.minify(css.toString()).css;
// Generate the hash value
const hash = crypto
  .createHash('sha256')
  .update(css)
  .digest('base64');
```

From here the CSS is written within a style element `<style>${css}</style>` ensuring no additional whitespace between the tags. The CSP header is also updated with the new hash, for example:

```
style-src 'sha256-QpACKkYqaJasYCFZA51jC7LHJJVCHbb1h0Uc5eMvurQ=';
```

I'm not using a framework or templating engine so a rough find and replace suffices:

```javascript
let toml = fs.readFileSync(`netlify.toml`);
toml = toml.toString().replace(
  /style-src 'sha256-[^']+?'/,
  `style-src 'sha256-${hash}'`
);
fs.writeFileSync(`netlify.toml`, toml);
```

If I had multiple inline sources a more robust solution might be sensible to generate this header. With that my PWA is getting passing grades.

As for my website hosted on GitHub Pages I would need to use a meta tag:

```markup
<meta http-equiv="Content-Security-Policy" content=" ... ">
```

Which I have yet to implement. As of writing, my website has quite a lot of inline CSS, JavaScript, and SVG. Not to mention a few external CDN resources. It's going to take some thinking to implement CSP correctly.

Another task for the backlog then!
