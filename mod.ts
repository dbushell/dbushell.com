import { Hono } from "@hono/hono";
import type { DConfig, DEnv, DHono } from "@src/types.ts";
import { middleware as csp_middleware } from "@src/middleware/csp.ts";
import { middleware as debug_middleware } from "@src/middleware/debug.ts";
import { middleware as redirect_middleware } from "@src/middleware/redirect.ts";
import { middleware as routes_middleware } from "@src/middleware/routes.ts";
import { middleware as static_middleware } from "@src/middleware/static.ts";
import { middleware as hypermore_middleware } from "@src/middleware/hypermore.ts";
import { encodeHash } from "@src/utils.ts";
import { rebuildCSS } from "@src/content/css.ts";
import { rebuildManifest } from "@src/content/manifest.ts";

const config: DConfig = {
  devMode: true,
  rootDir: new URL("./", import.meta.url),
  publicDir: "./public",
  routeDir: "./routes",
  templateDir: "./components",
  deployHash: await encodeHash(
    // Use build environment variable
    Deno.env.get("DEPLOY_HASH") ??
      // Use unique startup date
      Date.now().toString(),
  ),
};

await rebuildCSS(config.deployHash);
await rebuildManifest();

const app: DHono = new Hono<DEnv>();

debug_middleware(app, config);
redirect_middleware(app, config);
csp_middleware(app, config);
await hypermore_middleware(app, config);
routes_middleware(app, config);
static_middleware(app, config);

app.notFound((ctx) => {
  return ctx.text("Page Not Found", 404);
});

app.onError((err, ctx) => {
  console.error(err);
  return ctx.text("Internal Server Error", 500);
});

const options: Deno.ServeTcpOptions = {
  port: 7777,
  hostname: "localhost",
};

Deno.serve(options, (request, info) => {
  return app.fetch(request, {
    info,
    deployHash: config.deployHash,
  });
});
