import type {DinoHandle} from '@ssr/dinossr';
import type {Data} from '@src/types.ts';
import {manifest} from '@src/manifest.ts';
import {stripTags} from '@dbushell/hyperless';
import {escape, unescape} from '@std/html/entities';

export const pattern = '.xml';

const meta = {
  name: 'dbushell.com (microblog)',
  author: 'David Bushell',
  description: 'David Bushell’s Microblog',
  url: 'https://dbushell.com'
};

const url = new URL('/rss.xml', meta.url);

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
  <description>{{description}}</description>
  <link>{{link}}</link>
  <guid isPermaLink="true">{{guid}}</guid>
  <pubDate>{{pubDate}}</pubDate>
  <content:encoded><![CDATA[{{html}}]]></content:encoded>
</item>
`;

export const GET: DinoHandle<Data> = () => {
  const {notes} = manifest.routes['/notes/'];

  if (!notes) return;

  let body = template;
  body = body.replace(`{{url}}`, () => url.href);
  body = body.replace(`{{lastBuildDate}}`, notes[0].date.toUTCString());
  for (const [key, value] of Object.entries(meta)) {
    body = body.replaceAll(`{{meta.${key}}}`, value);
  }

  const entries = notes.map((note) => {
    let xml = entry;
    let description = stripTags(note.body);
    description = escape(unescape(description));
    const guid = new URL(note.href, meta.url);
    xml = xml.replace(`{{description}}`, () => description);
    xml = xml.replace(`{{html}}`, () => note.body);
    xml = xml.replace(`{{link}}`, () => guid.href);
    xml = xml.replace(`{{guid}}`, () => guid.href);
    xml = xml.replace(`{{pubDate}}`, () => note.date.toUTCString());
    return xml;
  });

  body = body.replace(`{{entries}}`, () => entries.join(''));

  return new Response(body, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'content-length': body.length.toString()
    }
  });
};
