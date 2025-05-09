import * as fs from "@std/fs";
import * as path from "@std/path";
import type { DConfig, DHono } from "../types.ts";

const html_extensions = new Set([".html"]);
const js_extensions = new Set([".js", ".ts"]);

export const middleware = async (hono: DHono, config: DConfig) => {
  const routes_dir = path.resolve(
    config.rootDir.pathname,
    config.routesDir,
  );
  if (fs.existsSync(routes_dir) === false) {
    console.warn(`Missing routes directory: "${routes_dir}"`);
    return;
  }
  for await (
    const entry of fs.walk(routes_dir, {
      exts: [...html_extensions, ...js_extensions],
    })
  ) {
    const ext = path.extname(entry.path);

    // Handle middleware exports
    if (js_extensions.has(ext)) {
      const mod = await import(entry.path);
      if (typeof mod.middleware !== "function") {
        console.warn(`Missing route middleware: "${entry.path}"`);
        continue;
      }
      try {
        await Promise.resolve(mod.middleware(hono));
      } catch (err) {
        console.error(err);
        console.warn(`Bad route middleware: "${entry.path}"`);
      }
      continue;
    }
  }
};
