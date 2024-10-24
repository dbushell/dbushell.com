import * as path from "@std/path";
import { debounce } from "@std/async";
import { Hyperserve } from "@dbushell/hyperserve";
import { middleware } from "@src/middleware.ts";
import { build } from "@src/build.ts";
import { rebuildCSS } from "@src/css.ts";
import { rebuildManifest } from "@src/manifest.ts";
import { manifest } from "@src/manifest.ts";
// Only required for live Deno server
Deno.env.set("SSR_API_KEY", Deno.env.get("SSR_API_KEY") ?? "1");

const DEV = Deno.args.includes("--dev");
const PROD = Deno.args.includes("--prod");
const BUILD = Deno.args.includes("--build");

if (PROD) {
  const server = (await import("./src/production.ts")).default;
  await server.finished;
  Deno.exit(0);
}

const dir = new URL("./", import.meta.url).pathname;
let ssr: Hyperserve;
let controller: AbortController;

const start = async () => {
  controller = new AbortController();

  ssr = new Hyperserve(dir, {
    dev: DEV || BUILD,
    static: "public",
    serve: {
      signal: controller.signal,
      hostname: "127.0.0.1",
      port: 8000,
    },
  });

  await ssr.init();

  ssr.router.use(middleware);

  ssr.router.onError = (error, request) => {
    console.log(request.url, error);
    return new Response(null, { status: 500 });
  };

  ssr.router.onNoMatch = async (request, platform) => {
    const url = new URL(request.url);
    if (
      // Avoid infinite loop
      url.pathname === "/404/" ||
      // Ignore non-HTML requests
      !request.headers.get("accept")?.includes("text/html")
    ) {
      return new Response(null, { status: 404 });
    }
    // Get 404 page render with headers
    const response = await ssr.router.handle(
      new Request(new URL("/404/", request.url), request),
      platform,
    );
    return new Response(response.body, { status: 404 });
  };

  ssr.router.get("*", async ({ response }) => {
    if (!(response instanceof Response)) {
      return response;
    }
    const contentType = response.headers.get("content-type");
    if (
      contentType?.includes("text/html") ||
      contentType?.includes("text/javascript")
    ) {
      let stylesHTML = "";
      for (const { css, hash } of manifest.styles) {
        stylesHTML += `<style data-hash="${hash}">${css}</style>\n`;
      }
      let body = await response.text();
      body = body.replaceAll("%DEPLOY_HASH%", ssr.deployHash);
      body = body.replace("%STYLES%", () => stylesHTML);
      response = new Response(body, response);
    }
    return response;
  });

  if (DEV) {
    // Rewrite relative URLs for local development
    ssr.router.get("*", async ({ response }) => {
      // Remove policy to allow inline syntax styles
      response?.headers.delete("content-security-policy");
      if (
        response?.ok &&
        response.body &&
        response.headers.get("content-type")?.startsWith("text/html")
      ) {
        let body = await response.text();
        body = body.replaceAll("https://dbushell.com/", "/");
        body = body.replaceAll('decoding="async"', 'decoding="sync"');
        body = body.replaceAll('fetchpriority="low"', 'fetchpriority="high"');
        body = body.replaceAll('loading="lazy"', 'loading="eager"');
        return new Response(body, response);
      }
    });
  }
};

await start();

await rebuildCSS(ssr!.deployHash);
await rebuildManifest();

if (BUILD) {
  await build(ssr!);
  Deno.exit(0);
}

const watcher = Deno.watchFs(dir);

const events = ["create", "modify", "remove"];
const directories = ["components", "routes", "server", "src"];

const update = debounce(async (ev: Deno.FsEvent) => {
  if (controller.signal.aborted) return;
  if (!events.includes(ev.kind)) return;
  let refresh = false;
  let data = false;
  let css = false;
  for (const evpath of ev.paths) {
    const dir = path.dirname(evpath.replace(Deno.cwd(), ""));
    if (!directories.includes(dir.split("/")[1])) continue;
    if (evpath.includes(".min.")) continue;
    if (dir.startsWith("/src/data")) data = true;
    if (dir.startsWith("/src/css")) css = true;
    refresh = true;
  }
  if (!refresh) return;
  controller.abort();
  await ssr.server.finished;
  if (css) await rebuildCSS(ssr.deployHash);
  if (css || data) await rebuildManifest();
  start();
}, 1000);

for await (const event of watcher) {
  update(event);
}
