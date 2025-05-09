import { assert } from "@std/assert";
import type { DConfig, DHono } from "../types.ts";

export const middleware = (hono: DHono, _config: DConfig) => {
  hono.use("/*", (ctx, next) => {
    const { url } = ctx.req;
    // Append trailing slashes
    if (url.endsWith("/") === false) {
      const parts = url.split("/");
      const last = parts.at(-1);
      assert(last?.length);
      // Ignore file extensions
      if (last.includes(".")) {
        return next();
      }
      // Ignore query strings
      if (last.includes("?")) {
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
