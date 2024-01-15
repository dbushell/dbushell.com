import * as path from 'path';
import {Manifest, Props} from './types.ts';

const template = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{{entries}}
</urlset>
`;

const entry = `<url>
  <loc>https://dbushell.com{{href}}</loc>
  <lastmod>${new Date().toISOString()}</lastmod>
  <changefreq>{{changefreq}}</changefreq>
  <priority>{{priority}}</priority>
</url>
`;

export const locations = (manifest: Manifest) => {
  const locations = Object.values(manifest.routes);
  // Sort for readability
  locations
    .reverse()
    .sort(
      (a, b) => Number.parseFloat(a.priority) - Number.parseFloat(b.priority)
    );
  return locations;
};

export const render = (locations: Props[]) => {
  locations.reverse();
  const entries = locations.map((item) => {
    if (item.href === '/404/') {
      return '';
    }
    let xml = entry;
    for (const [key, value] of Object.entries(item)) {
      xml = xml.replace(`{{${key}}}`, value);
    }
    return xml;
  });
  return template.replace(`{{entries}}`, entries.join(''));
};

export const publish = async (buildDir: string, manifest: Manifest) => {
  const now = performance.now();

  await Deno.writeTextFile(
    path.join(buildDir, `sitemap.xml`),
    render(Object.values(locations(manifest)))
  );
  console.log(
    `✹ Published Sitemap in ${Math.round(performance.now() - now)}ms`
  );
};
