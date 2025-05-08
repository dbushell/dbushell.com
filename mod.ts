import { Hono } from "@hono/hono";
import type { DConfig, DEnv, DHono } from "./src/types.ts";
import { middleware as csp_middleware } from "./src/middleware/csp.ts";
import { middleware as debug_middleware } from "./src/middleware/debug.ts";
import { middleware as redirect_middleware } from "./src/middleware/redirect.ts";
import { middleware as static_middleware } from "./src/middleware/static.ts";
import { middleware as hypermore_middleware } from "./src/middleware/hypermore.ts";

const config: DConfig = {
  dev_mode: true,
  root_dir: new URL("./", import.meta.url),
  public_dir: "./public",
  template_dir: "./components",
};

const options: Deno.ServeTcpOptions = {
  port: 7777,
  hostname: "localhost",
};

const app: DHono = new Hono<DEnv>();

debug_middleware(app, config);
redirect_middleware(app, config);
csp_middleware(app, config);
static_middleware(app, config);
await hypermore_middleware(app, config);

app.get("/hello/", async (ctx) => {
  const html = await ctx.var.render(
    `<my-button href="/">Home</my-button>`,
  );
  return ctx.html(html);
});

app.notFound((ctx) => {
  return ctx.text("Page Not Found", 404);
});

app.onError((err, ctx) => {
  console.error(err);
  return ctx.text("Internal Server Error", 500);
});

Deno.serve(options, (request, info) => {
  return app.fetch(request, { info });
});
