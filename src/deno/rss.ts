import * as path from 'path';
import {Manifest, Props} from './types.ts';

const url = 'https://dbushell.com';

const template = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="/assets/css/rss.xsl" type="text/xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>dbushell.com</title>
    <description>David Bushell’s Web Design &amp; Front-end Development Blog</description>
    <link>${url}</link>
    <generator>dbushell.com</generator>
    <lastBuildDate>{{lastBuildDate}}</lastBuildDate>
    <atom:link href="${url}/rss.xml" rel="self" type="application/rss+xml"/>
    <author>David Bushell</author>
    <language>en-GB</language>
{{entries}}</channel>
</rss>
`;

const entry = `<item>
<title>{{title}}</title>
<description>{{description}}</description>
<link>${url}{{link}}</link>
<guid isPermaLink="true">${url}{{link}}</guid>
<pubDate>{{pubDate}}</pubDate>
</item>
`;

const replace = (subject:string, search:string, replace = '', all = false) => {
  let parts = subject.split(search);
  if (parts.length === 1) return subject;
  if (!all) parts = [parts.shift()!, parts.join(search)];
  return parts.join(replace);
};

export const render = (articles: Props[]) => {
  const entries = articles.slice(0, 20).map((item) => {
    let xml = entry;
    xml = replace(xml, `{{title}}`, item.title);
    xml = replace(xml, `{{description}}`, item.excerpt);
    xml = replace(xml, `{{link}}`, item.href, true);
    xml = replace(xml, `{{pubDate}}`, item.date!.toUTCString());

    return xml;
  });
  let xml = template;
  xml = replace(xml, `{{lastBuildDate}}`,  new Date().toUTCString());
  xml = replace(xml, `{{entries}}`, entries.join(''));
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
