import {
  escape,
  Node,
  parseHTML,
  stripTags,
  unescape,
} from "@dbushell/hyperless";
import { NoteProps, Props } from "./types.ts";

export type RssMeta = {
  name: string;
  author: string;
  description: string;
  url: string;
};

export const template = `<?xml version="1.0" encoding="UTF-8"?>
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

const note_entry = `<item>
  <description>{{description}}</description>
  <link>{{link}}</link>
  <guid isPermaLink="true">{{guid}}</guid>
  <pubDate>{{pubDate}}</pubDate>
  <content:encoded><![CDATA[{{html}}]]></content:encoded>
</item>
`;

const bookmark_entry = `<item>
  <title>{{title}}</title>
  <description>{{description}}</description>
  <link>{{link}}</link>
  <guid isPermaLink="true">{{guid}}</guid>
  <pubDate>{{pubDate}}</pubDate>
  <content:encoded><![CDATA[{{html}}]]></content:encoded>
</item>
`;

export const renderNote = (note: NoteProps, meta: RssMeta): string => {
  let xml = note_entry;
  const pubDate = note.date.toUTCString();
  const guid = new URL(note.href, meta.url);
  let desc = stripTags(note.body);
  desc = escape(unescape(desc));
  // Remove copy buttons
  const node = parseHTML(note.body);
  const remove = new Set<Node>();
  node.traverse((n) => {
    if (n.tag === "button" && n.attributes.has("data-copy")) remove.add(n);
  });
  for (const n of remove) n.detach();
  xml = xml.replace(`{{description}}`, () => desc);
  xml = xml.replace(`{{html}}`, () => node.toString());
  xml = xml.replace(`{{link}}`, () => guid.href);
  xml = xml.replace(`{{guid}}`, () => guid.href);
  xml = xml.replace(`{{pubDate}}`, () => pubDate);
  return xml;
};

export const renderBookmark = (bookmark: Props, meta: RssMeta): string => {
  let xml = bookmark_entry;
  const pubDate = new Date(bookmark.date!).toUTCString();
  const guid = new URL(bookmark.href, meta.url);
  let desc = stripTags(bookmark.excerpt);
  desc = escape(unescape(desc));
  // Remove copy buttons
  const node = parseHTML(bookmark.body);
  const remove = new Set<Node>();
  node.traverse((n) => {
    if (n.tag === "button" && n.attributes.has("data-copy")) remove.add(n);
  });
  for (const n of remove) n.detach();
  xml = xml.replace(`{{title}}`, () => escape(unescape(bookmark.title)));
  xml = xml.replace(`{{description}}`, () => desc);
  xml = xml.replace(`{{html}}`, () => node.toString());
  xml = xml.replace(`{{link}}`, () => guid.href);
  xml = xml.replace(`{{guid}}`, () => guid.href);
  xml = xml.replace(`{{pubDate}}`, () => pubDate);
  return xml;
};
