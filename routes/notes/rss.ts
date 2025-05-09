import { DHono, DRoute } from "@src/types.ts";
import { manifest } from "@src/content/manifest.ts";
import { renderNote, template } from "@src/content/rss.ts";

export const pattern = ".xml";

const meta = {
  name: "dbushell.com (notes)",
  author: "David Bushell",
  description: "David Bushell’s Notes only feed",
  url: "https://dbushell.com/notes/",
};

const url = new URL("/rss.xml", meta.url);

export const middleware = (hono: DHono, route: DRoute) => {
  hono.get(route.pattern, (ctx) => {
    const { notes } = manifest.routes["/notes/"];

    if (!Array.isArray(notes) || !notes.length) {
      return ctx.notFound();
    }

    let body = template;
    body = body.replace(`{{url}}`, () => url.href);
    body = body.replace(
      `{{lastBuildDate}}`,
      notes[0].date.toUTCString(),
    );
    for (const [key, value] of Object.entries(meta)) {
      body = body.replaceAll(`{{meta.${key}}}`, value);
    }

    const entries = notes.map((note) => renderNote(note, meta));
    body = body.replace(`{{entries}}`, () => entries.join(""));

    const bytes = new TextEncoder().encode(body);
    ctx.header("content-type", "application/xml; charset=utf-8");
    ctx.header("content-length", String(bytes.byteLength));
    return ctx.body(bytes);
  });
};
