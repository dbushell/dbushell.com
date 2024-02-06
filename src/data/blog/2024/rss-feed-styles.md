---
date: 2024-02-06 10:00:00+00:00
slug: rss-feed-styles
title: 'RSS Feed Styles'
description: 'The one where I style XML'
---

Now that I'm in my 15th year of blogging it's past time I spruced up [my RSS feed](/rss.xml). I've also launched [a new bookmark blog](/2024/01/24/cotton-coder/). Perfect time to revisit RSS.

For the last 15 years my RSS feed was an unreadable mess when viewed in a browser:

<figure class="Image">
  <img
    loading="lazy"
    src="/images/blog/2024/rss-mess.png"
    alt="screenshot of my unstyled feed"
    width="810"
    height="190">
    <figcaption>Unstyled RSS as seen in Firefox</figcaption>
</figure>

Obviously it's meant to be viewed in an RSS reader but those aren't so popular nowadays. Despite *Big Tech's* effort to eradicate RSS it remains a critical piece of the open web for syndicating content. I have no plans to let it be forgotton. Admittedly I almost forgot during the social media winter but now Twitter is dead and RSS lives on.

## RSS CSS

[XSLT](https://developer.mozilla.org/en-US/docs/Web/XSLT) — *"Extensible Stylesheet Language Transformations"* — is a mouthful. Basically for my purposes it can be used to render an XML document as an HTML page when viewed in a browser.

First I added an XML processing instruction to the top of my RSS feed. This references an XSL file that I created later.

```xml
<?xml version="1.0" encoding="utf-8"?>
<?xml-stylesheet href="/rss.xsl" type="text/xsl"?>
```

Next I created the XSL file:

```xml
<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="utf-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title><xsl:value-of select="/rss/channel/title"/></title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="stylesheet" href="/rss.css"/>
      </head>
      <body>
        <header>
          <h1><xsl:value-of select="/rss/channel/title"/></h1>
          <p><xsl:value-of select="/rss/channel/description"/></p>
        </header>
        <main>
          <xsl:for-each select="/rss/channel/item">
            <article>
              <h3>
                <a>
                  <xsl:attribute name="href">
                    <xsl:value-of select="link"/>
                  </xsl:attribute>
                  <xsl:value-of select="title"/>
                </a>
              </h3>
              <p><xsl:value-of select="description"/></p>
              <p><xsl:value-of select="pubDate"/></p>
            </article>
          </xsl:for-each>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
```

Above is a basic template. Feel free to use it!

Remember this is **XML** with nested **XHTML**. It's not **HTML** and therefore tags need to be closed like `<meta charset="utf-8"/>` (which is self-closing). Otherwise, XSL is composed as you would an HTML document using the special XSL elements for templating.

CSS can be added inline or in an external stylesheet like I have done.

Finally, the RSS feed needs to be served with the `content-type` header: `application/xml; charset=utf-8`. If you use `application/rss+xml` browsers may not render it.

Now my RSS feed looks like this in the browser:

<figure class="Image">
  <img
    loading="lazy"
    src="/images/blog/2024/rss-styles.png"
    alt="screenshot of my styled feed"
    width="760"
    height="530">
</figure>

That's a big improvement!

With this change browsers will no longer prompt users to open their RSS app. This is a reasonable trade-off in my opinion. People who know RSS and have reader apps installed can easily copy the feed URL. Those that don't — I suspect the majority — will see a pretty page and not a mess like before. Perhaps I need a message at the top explaining RSS? I've seen a few feeds do that.

It may be controversial that I don't put my entire blog content in the feed. I don't know why to be honest, I made the decision so long ago. What is your opinion? I'm on [Mastodon](https://fosstodon.org/@dbushell) and [Twitter](https://twitter.com/dbushell) (for now) let me know.

## Edge Cases

One minor issue is that [Firefox does not support](https://developer.mozilla.org/en-US/docs/Web/XSLT/Common_errors#missing_features) the `disable-output-escaping` attribute (and is more likely to [remove XSLT entirely](https://bugzilla.mozilla.org/show_bug.cgi?id=98168)). So using HTML in CDATA for descriptions will render as code in Firefox rather than the HTML. I simply opted to remove all CDATA. HTML entities like `&#8217;` for an apostrophe still work.
