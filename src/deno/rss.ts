import * as path from 'path';
import {Manifest, Props} from './types.ts';

const url = 'https://dbushell.com';

const template = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[dbushell.com]]></title>
    <description><![CDATA[David Bushell’s Web Design & Front-end Development Blog]]></description>
    <link>${url}</link>
    <generator>dbushell.com</generator>
    <lastBuildDate>{{lastBuildDate}}</lastBuildDate>
    <atom:link href="${url}/rss.xml" rel="self" type="application/rss+xml"/>
    <author><![CDATA[David Bushell]]></author>
    <language><![CDATA[en-GB]]></language>
    <webMaster><![CDATA[hi@dbushell.com (David Bushell)]]></webMaster>
{{entries}}</channel>
</rss>
`;

const entry = `<item>
<title><![CDATA[{{title}}]]></title>
<description><![CDATA[<p>{{description}}</p>]]></description>
<link>${url}{{link}}</link>
<guid isPermaLink="true">${url}{{link}}</guid>
<dc:creator><![CDATA[David Bushell]]></dc:creator>
<pubDate>{{pubDate}}</pubDate>
</item>
`;

export const render = (articles: Props[]) => {
  const entries = articles.slice(0, 20).map((item) => {
    let xml = entry;
    xml = xml.replace(`{{title}}`, item.title);
    xml = xml.replace(`{{description}}`, item.excerpt);
    xml = xml.replace(/{{link}}/g, item.href);
    xml = xml.replace(`{{pubDate}}`, item.date!.toUTCString());
    return xml;
  });
  let xml = template;
  xml = xml.replace(`{{lastBuildDate}}`, new Date().toUTCString());
  xml = xml.replace(`{{entries}}`, entries.join(''));
  return xml;
};

export const publish = async (buildDir: string, manifest: Manifest) => {
  const now = performance.now();
  await Deno.writeTextFile(
    path.join(buildDir, `rss.xml`),
    render(
      Object.values(manifest.routes).filter(
        (item) => item.date && item.container === 'article'
      )
    )
  );
  console.log(`✹ Published RSS in ${Math.round(performance.now() - now)}ms`);
};
