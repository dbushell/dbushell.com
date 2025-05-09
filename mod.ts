import { Hono } from "@hono/hono";
import * as path from "@std/path";
import { debounce } from "@std/async";
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
import { build } from "@src/build.ts";

const DEV = Deno.args.includes("--dev");
// const PROD = Deno.args.includes("--prod");
const BUILD = Deno.args.includes("--build");

// @todo Use .env file
Deno.env.set("ORIGIN", "https://dbushell.com");

const options: Deno.ServeTcpOptions = {
  port: 7777,
  hostname: "localhost",
};

const config: DConfig = {
  origin: new URL(
    Deno.env.get("ORIGIN") ?? `http://${options}:${options.port}`,
  ),
  devMode: DEV,
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

let controller: AbortController;

const start = async () => {
  const app: DHono = new Hono<DEnv>();
  controller = new AbortController();

  debug_middleware(app, config);
  redirect_middleware(app, config);
  csp_middleware(app, config);
  await hypermore_middleware(app, config);
  await routes_middleware(app, config);
  static_middleware(app, config);

  app.notFound(async (ctx) => {
    const response = await app.fetch(
      new Request(new URL("/404/", ctx.req.url)),
      ctx.env,
    );
    // @todo Fix 404 status?
    // return ctx.html(await response.text(), 404);
    return new Response(response.body, {
      status: 404,
      headers: response.headers,
    });
  });

  app.onError((err, ctx) => {
    console.error(err);
    return ctx.text("Internal Server Error", 500);
  });

  if (BUILD) {
    await build(app, config);
    Deno.exit(0);
  }

  Deno.serve({
    ...options,
    signal: controller.signal,
  }, (request, info) => {
    return app.fetch(request, {
      info,
      origin: config.origin,
      devMode: config.devMode,
      deployHash: config.deployHash,
    });
  });
};

await rebuildCSS(config.deployHash);
await rebuildManifest();
await start();

const watcher = Deno.watchFs(config.rootDir.pathname);

const events = [
  "create",
  "modify",
  "remove",
];

const directories = [
  "data",
  "components",
  "routes",
  "public/assets/css",
];

const update = debounce(async (ev: Deno.FsEvent) => {
  if (controller.signal.aborted) return;
  if (!events.includes(ev.kind)) return;
  let refresh = false;
  let data = false;
  let css = false;
  for (const event_path of ev.paths) {
    const dir = path.dirname(
      event_path.replace(config.rootDir.pathname, ""),
    );
    if (!directories.includes(dir.split("/")[0])) continue;
    if (event_path.includes(".min.")) continue;
    if (dir.startsWith("data/")) data = true;
    if (dir.startsWith("public/assets/css")) css = true;
    refresh = true;
  }
  if (refresh !== true) {
    return;
  }
  controller.abort();
  if (css) {
    await rebuildCSS(config.deployHash);
  }
  if (css || data) {
    await rebuildManifest();
  }
  start();
}, 1000);

for await (const event of watcher) {
  update(event);
}
