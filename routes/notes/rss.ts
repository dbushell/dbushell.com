import type {DinoHandle} from 'dinossr';
import type {Data} from '@src/types.ts';
import {manifest} from '@src/manifest.ts';
import {replace, striptags} from '@src/shared.ts';

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
  body = replace(body, `{{url}}`, url.href);
  body = replace(body, `{{lastBuildDate}}`, notes[0].date.toUTCString());
  for (const [key, value] of Object.entries(meta)) {
    body = body.replaceAll(`{{meta.${key}}}`, value);
  }

  const entries = notes.map((note) => {
    let xml = entry;
    let description = striptags(note.body);
    description = replace(description, '<', '&lt;');
    description = replace(description, '>', '&gt;');
    const guid = new URL(note.href, meta.url);
    xml = replace(xml, `{{description}}`, description);
    xml = replace(xml, `{{html}}`, note.body);
    xml = replace(xml, `{{link}}`, guid.href);
    xml = replace(xml, `{{guid}}`, guid.href);
    xml = replace(xml, `{{pubDate}}`, note.date.toUTCString());
    return xml;
  });

  body = replace(body, `{{entries}}`, entries.join(''));

  return new Response(body, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'content-length': body.length.toString()
    }
  });
};
