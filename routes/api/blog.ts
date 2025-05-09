import { DHono, DRoute } from "@src/types.ts";
import { manifest } from "@src/content/manifest.ts";

export const middleware = (hono: DHono, route: DRoute) => {
  const pattern = route.pattern.replace(/\/$/, "");
  hono.get(`${pattern}/:page{\\d+}/`, (ctx) => {
    const { page } = ctx.req.param();
    let href = "";
    if (page === "1") {
      href = "/blog/";
    } else {
      href = `/blog/page/${[page]}/`;
    }
    const props = manifest.routes[href];
    if (props === undefined) {
      return ctx.notFound();
    }
    return ctx.json({
      ...props,
      latest: manifest.latest,
    });
  });
};
