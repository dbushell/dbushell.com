import { DHono, DRoute } from "@src/types.ts";
import { manifest } from "@src/content/manifest.ts";

export const middleware = (hono: DHono, route: DRoute) => {
  const pattern = route.pattern.replace(/\/$/, "");
  hono.get(
    `${pattern}/:year{\\d+}/:month{\\d+}/:day{\\d+}/:slug/`,
    (ctx) => {
      const { year, month, day, slug } = ctx.req.param();
      const href = `/${year}/${month}/${day}/${slug}/`;

      const props = manifest.routes[href];
      if (props === undefined) {
        return ctx.notFound();
      }
      return ctx.json({
        ...props,
        latest: manifest.latest,
      });
    },
  );
};
