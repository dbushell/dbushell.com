import { Hono } from "@hono/hono";
import type { Config } from "@src/types.ts";
import { middleware as csp_middleware } from "@src/middleware/csp.ts";
import { middleware as debug_middleware } from "@src/middleware/debug.ts";
import { middleware as redirect_middleware } from "@src/middleware/redirect.ts";
import { middleware as static_middleware } from "@src/middleware/static.ts";

const config: Config = {
  dev_mode: true,
  root_dir: new URL("./", import.meta.url),
  public_dir: "./public",
};

const options: Deno.ServeTcpOptions = {
  port: 7777,
  hostname: "localhost",
};

const app = new Hono();

debug_middleware(app, config);
redirect_middleware(app, config);
csp_middleware(app, config);
static_middleware(app, config);

app.get("/hello/", (ctx) => {
  return ctx.text("Hello, World!");
});

app.notFound((ctx) => {
  return ctx.text("Page Not Found", 404);
});

app.onError((err, ctx) => {
  console.error(err);
  return ctx.text("Internal Server Error", 500);
});

Deno.serve(options, (request, _info) => {
  return app.fetch(request);
});
