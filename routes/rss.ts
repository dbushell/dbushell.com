import type { HyperHandle } from "@dbushell/hyperserve";
import { manifest } from "@src/manifest.ts";
import { Node, parseHTML, stripTags } from "@dbushell/hyperless";
import { escape, unescape } from "@std/html/entities";

export const pattern = ".xml";

const meta = {
  name: "dbushell.com",
  author: "David Bushell",
  description: "David Bushell’s Web Design &amp; Front-end Development Blog",
  url: "https://dbushell.com",
};

const url = new URL("/rss.xml", meta.url);

const template = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="/assets/css/rss.xsl" type="text/xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>{{meta.name}}</title>
    <description>{{meta.description}}</description>
    <link>{{meta.url}}</link>
    <lastBuildDate>{{lastBuildDate}}</lastBuildDate>
    <atom:link href="{{url}}" rel="self" type="application/rss+xml"/>
    <author>{{meta.author}}</author>
    <language>en-GB</language>
{{entries}}</channel>
</rss>
`;

const entry = `<item>
  <title>{{title}}</title>
  <description>{{description}}</description>
  <link>{{link}}</link>
  <guid isPermaLink="true">{{guid}}</guid>
  <pubDate>{{pubDate}}</pubDate>
  <content:encoded><![CDATA[{{html}}]]></content:encoded>
</item>
`;

export const GET: HyperHandle = () => {
  const { latest } = manifest;

  let body = template;
  body = body.replace(`{{url}}`, () => url.href);
  body = body.replace(
    `{{lastBuildDate}}`,
    new Date(latest[0].date!).toUTCString(),
  );
  for (const [key, value] of Object.entries(meta)) {
    body = body.replaceAll(`{{meta.${key}}}`, () => value);
  }

  const entries = latest.map((bookmark) => {
    let xml = entry;
    const pubDate = new Date(bookmark.date!).toUTCString();
    const guid = new URL(bookmark.href, meta.url);
    let excerpt = stripTags(bookmark.excerpt);
    excerpt = escape(unescape(excerpt));
    // Remove copy buttons
    const node = parseHTML(bookmark.body);
    const remove = new Set<Node>();
    node.traverse((n) => {
      if (n.tag === "button" && n.attributes.has("data-copy")) remove.add(n);
    });
    for (const n of remove) n.detach();
    xml = xml.replace(`{{title}}`, () => escape(unescape(bookmark.title)));
    xml = xml.replace(`{{description}}`, () => excerpt);
    xml = xml.replace(`{{html}}`, () => node.toString());
    xml = xml.replace(`{{link}}`, () => guid.href);
    xml = xml.replace(`{{guid}}`, () => guid.href);
    xml = xml.replace(`{{pubDate}}`, () => pubDate);
    return xml;
  });

  body = body.replace(`{{entries}}`, () => entries.join(""));

  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "content-length": body.length.toString(),
    },
  });
};
