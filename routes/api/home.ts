import { DHono, DRoute } from "@src/types.ts";

export const middleware = (hono: DHono, route: DRoute) => {
  hono.get(route.pattern, (ctx) => {
    return ctx.json({
      welcome: "Hello, World!",
    });
  });
};
