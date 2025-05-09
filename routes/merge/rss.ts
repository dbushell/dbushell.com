import { DHono, DRoute } from "@src/types.ts";
import { manifest } from "@src/content/manifest.ts";
import { renderBookmark, renderNote, template } from "@src/content/rss.ts";

export const pattern = ".xml";

const meta = {
  name: "dbushell.com (all feeds)",
  author: "David Bushell",
  description: "David Bushell’s Blog + Notes combined feed",
  url: "https://dbushell.com",
};

const url = new URL("/rss.xml", meta.url);

export const middleware = (hono: DHono, route: DRoute) => {
  hono.get(route.pattern, (ctx) => {
    const { latest } = manifest;
    const { notes } = manifest.routes["/notes/"];

    if (!Array.isArray(latest) || !latest.length) {
      return ctx.notFound();
    }
    if (!Array.isArray(notes) || !notes.length) {
      return ctx.notFound();
    }

    const combined = [
      ...latest,
      ...notes.slice(0, 10),
    ].toSorted((a, b) => (b.date!.getTime() - a.date!.getTime()));

    let body = template;
    body = body.replace(`{{url}}`, () => url.href);
    body = body.replace(
      `{{lastBuildDate}}`,
      new Date(latest[0].date!).toUTCString(),
    );
    for (const [key, value] of Object.entries(meta)) {
      body = body.replaceAll(`{{meta.${key}}}`, () => value);
    }

    const entries = combined.map((entry) => {
      if ("title" in entry) {
        entry.body = manifest.routes[entry.href].body;
        return renderBookmark(entry, meta);
      }
      return renderNote(entry, meta);
    });
    body = body.replace(`{{entries}}`, () => entries.join(""));

    const bytes = new TextEncoder().encode(body);
    ctx.header("content-type", "application/xml; charset=utf-8");
    ctx.header("content-length", String(bytes.byteLength));
    return ctx.body(bytes);
  });
};
