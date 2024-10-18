import type { HyperHandle } from "@dbushell/hyperserve";
import { manifest } from "@src/manifest.ts";

export const pattern = ".xml";

const template = `<?xml version="1.0" encoding="utf-8"?>
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

export const GET: HyperHandle = () => {
  // Sort by priority for readability
  const locations = Object.values(manifest.routes);
  locations.reverse();
  locations.sort((a, b) =>
    Number.parseFloat(a.priority) - Number.parseFloat(b.priority)
  );
  locations.reverse();

  let body = template;
  const entries = locations.map((item) => {
    if (item.href === "/404/") {
      return "";
    }
    let xml = entry;
    for (const [key, value] of Object.entries(item)) {
      xml = xml.replace(`{{${key}}}`, () => value);
    }
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
