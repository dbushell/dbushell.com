import { DHono, DRoute } from "@src/types.ts";
import { manifest } from "@src/content/manifest.ts";

export const middleware = (hono: DHono, route: DRoute) => {
  const pattern = route.pattern.replace(/\/$/, "");
  hono.get(`${pattern}/:prefix/:slug/`, (ctx) => {
    const { prefix, slug } = ctx.req.param();
    const props = manifest.routes[`/${prefix}/${slug}/`];
    if (props === undefined) {
      return ctx.notFound();
    }
    return ctx.json({
      ...props,
      latest: manifest.latest,
    });
  });
};
