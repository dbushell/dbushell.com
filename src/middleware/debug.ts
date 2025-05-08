import type { Hono } from "@hono/hono";
import type { Config } from "@src/types.ts";

export const middleware = (hono: Hono, config: Config) => {
  if (config.dev_mode !== true) {
    return;
  }
  hono.use("/*", async (ctx, next) => {
    console.log(`[${ctx.req.method}] ${ctx.req.path}`);
    await next();
  });
};
