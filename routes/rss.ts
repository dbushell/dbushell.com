import { DHono, DRoute } from "@src/types.ts";
import { manifest } from "@src/content/manifest.ts";
import { renderBookmark, template } from "@src/content/rss.ts";

export const pattern = ".xml";

const meta = {
  name: "dbushell.com (blog)",
  author: "David Bushell",
  description: "David Bushell’s Blog only feed",
  url: "https://dbushell.com/blog/",
};

const url = new URL("/rss.xml", meta.url);

export const middleware = (hono: DHono, route: DRoute) => {
  hono.get(route.pattern, (ctx) => {
    const { latest } = manifest;

    if (!Array.isArray(latest) || !latest.length) {
      return ctx.notFound();
    }

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
      bookmark.body = manifest.routes[bookmark.href].body;
      return renderBookmark(bookmark, meta);
    });
    body = body.replace(`{{entries}}`, () => entries.join(""));

    const bytes = new TextEncoder().encode(body);
    ctx.header("content-type", "application/xml; charset=utf-8");
    ctx.header("content-length", String(bytes.byteLength));
    return ctx.body(bytes);
  });
};
