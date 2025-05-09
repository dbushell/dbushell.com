import * as fs from "@std/fs";
import * as path from "@std/path";
import type { Node } from "@dbushell/hyperless";
import { JSONObject, parseHTML } from "@dbushell/hypermore";
import type { DConfig, DHono, DModule } from "../types.ts";
import { encodeHash } from "../utils.ts";

const html_extensions = new Set([".html"]);
const js_extensions = new Set([".js", ".ts"]);

/**
 * Execute code and return module exports
 * @param code JavaScript
 * @returns Module exports
 */
const importModule = async <T>(
  code: string,
  type = "text/typescript",
): Promise<T> => {
  const blob = new Blob([code], { type });
  const url = URL.createObjectURL(blob);
  const mod = await import(url);
  URL.revokeObjectURL(url);
  return mod as T;
};

/**
 * Import the module script from a route template
 * @param html Route template
 * @returns Route module
 */
const importRoute = async (
  html: string,
): Promise<[string, DModule]> => {
  const root = parseHTML(html);
  let script: Node | undefined;
  // Find the first top-level <script context="module">
  for (const node of root.children) {
    if (node.tag !== "script") continue;
    if (node.attributes.get("context") !== "module") continue;
    script = node;
    break;
  }
  // Return default if not found
  if (script === undefined) {
    return [html, {}];
  }
  // Extract script
  script.detach();
  const code = script.at(0)!.raw;
  // Import module and remove invalid exports
  const mod = {
    ...(await importModule<DModule>(code)),
  };
  if (typeof mod.pattern !== "string") {
    delete mod.pattern;
  }
  if (typeof mod.load !== "function") {
    delete mod.load;
  }
  return [root.toString(), mod];
};

export const middleware = async (hono: DHono, config: DConfig) => {
  const route_dir = path.resolve(
    config.rootDir.pathname,
    config.routeDir,
  );
  if (fs.existsSync(route_dir) === false) {
    console.warn(`Missing route directory: "${route_dir}"`);
    return;
  }

  const routes: { path: string; order: number; callback: () => void }[] = [];

  for await (
    const entry of fs.walk(route_dir, {
      exts: [...html_extensions, ...js_extensions],
    })
  ) {
    const ext = path.extname(entry.path);
    const hash = await encodeHash(entry.path);

    // Configure route pattern
    let pattern = "/" + path.relative(route_dir, entry.path);
    // Replace wildcards groups
    // pattern = pattern.replaceAll(/{([^\}]+?)}/g, "*");
    pattern = pattern.replaceAll("(all)", "*");
    // Replace non-capturing groups
    pattern = pattern.replaceAll(/\([^\)]+?\)\/?/g, "");
    // Replace named parameters
    pattern = pattern.replaceAll(/\[([^\]]+?)\]/g, ":$1");
    // Remove URL
    pattern = path.dirname(pattern);
    if (pattern.at(-1) !== "/" && pattern.at(-1) !== "*") {
      pattern += "/";
    }
    // Append filename if not index
    if (!/index\./.test(path.basename(entry.path))) {
      if (pattern.at(-1) !== "/") pattern += "/";
      pattern += path.basename(entry.path, ext) + "/";
    }

    // Handle middleware exports
    if (js_extensions.has(ext)) {
      const mod = await import(entry.path);
      if (typeof mod.middleware !== "function") {
        console.warn(`Missing route middleware: "${entry.path}"`);
        continue;
      }
      if (typeof mod.pattern === "string") {
        pattern = pattern.replace(/\/$/, "");
        pattern += mod.pattern;
      }

      const callback = async () => {
        try {
          await Promise.resolve(
            mod.middleware(hono, { hash, pattern }),
          );
        } catch (err) {
          console.error(err);
          console.warn(`Bad route middleware: "${entry.path}"`);
        }
      };
      routes.push({
        path: entry.path,
        order: mod.order ?? 0,
        callback,
      });
      continue;
    }

    // Handle template routes
    if (html_extensions.has(ext)) {
      try {
        let mod: DModule;
        let code = await Deno.readTextFile(entry.path);
        [code, mod] = await importRoute(code);
        // Append module export
        if (mod.pattern) {
          if (/^\.\w+$/.test(mod.pattern)) {
            pattern += mod.pattern;
          } else {
            pattern = path.join(pattern, mod.pattern);
          }
        }
        const callback = () => {
          hono.get(pattern, async (ctx, next) => {
            let props: JSONObject | undefined = {};
            if (mod.load) {
              props = await mod.load({
                ctx: ctx,
                fetch: (...props: Parameters<typeof fetch>) => {
                  const input = props[0];
                  if (typeof input === "string") {
                    if (input.startsWith("/")) {
                      props[0] = new URL(input, ctx.req.url);
                    }
                  }
                  return Promise.resolve(
                    hono.fetch(new Request(...props), ctx.env),
                  );
                },
              }) ?? undefined;
            }
            if (props === undefined) {
              return next();
            }
            const html = await ctx.render(
              code,
              props,
            );
            return ctx.html(html);
          });
        };
        routes.push({
          path: entry.path,
          order: mod.order ?? 0,
          callback,
        });
      } catch (err) {
        console.error(err);
        console.warn(`Bad route module: "${entry.path}"`);
      }
      continue;
    }
  }

  // Higher order middleware is applied first
  routes.sort((a, b) => b.order - a.order);
  for (const mod of routes) {
    try {
      Promise.resolve(mod.callback());
    } catch (err) {
      console.log(err);
      console.warn(`Bad route: "${mod.path}"`);
    }
  }
};
