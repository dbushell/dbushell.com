import type { DConfig, DHono } from "../types.ts";

export const middleware = (hono: DHono, config: DConfig) => {
  if (config.devMode !== true) {
    return;
  }
  hono.use("/*", async (ctx, next) => {
    console.log(
      `[${ctx.req.method}] (${ctx.env.info.remoteAddr.hostname}) ${ctx.req.path}`,
    );
    await next();
  });
};
