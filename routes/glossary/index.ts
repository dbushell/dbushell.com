import { DHono, DRoute } from "@src/types.ts";
import { manifest } from "@src/content/manifest.ts";

export const middleware = (hono: DHono, route: DRoute) => {
  const pattern = route.pattern.replace(/\/$/, "");
  hono.get(`${pattern}/:term{.+\\.json}`, (ctx) => {
    const { term } = ctx.req.param();
    const key = term.replace(/\.json$/, "");
    const props = manifest.glossary.get(key);
    if (props === undefined) {
      return ctx.notFound();
    }
    return ctx.json({
      ...props,
    });
  });
};
