import type { Hono } from "@hono/hono";
import { assert } from "@std/assert";
import type { Config } from "@src/types.ts";

export const middleware = (hono: Hono, _config: Config) => {
  hono.use("/*", (ctx, next) => {
    const { url } = ctx.req;
    // Append trailing slashes
    if (url.endsWith("/") === false) {
      const parts = url.split("/");
      const last = parts.at(-1);
      assert(last?.length);
      // Ignore file extension paths
      if (last.includes(".")) {
        return next();
      }
      return Promise.resolve(
        ctx.newResponse(null, 308, {
          location: `${url}/`,
        }),
      );
    }
    return next();
  });
};
