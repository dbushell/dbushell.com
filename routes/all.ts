import { DHono } from "@src/types.ts";
import { toText } from "@std/streams";

export const middleware = (hono: DHono) => {
  hono.use("/*", async (ctx, next) => {
    await next();
    if (ctx.res.body === null) {
      return;
    }
    const content_type = ctx.res.headers.get("content-type");
    if (
      content_type?.includes("text/html") ||
      content_type?.includes("text/javascript")
    ) {
      let body = await toText(ctx.res.body);
      body = body.replaceAll("%DEPLOY_HASH%", () => ctx.env.deployHash);
      const bytes = new TextEncoder().encode(body);
      ctx.res = new Response(bytes);
      ctx.header("content-type", "content_type");
      ctx.header("content-length", String(bytes.byteLength));
    }
  });
};
