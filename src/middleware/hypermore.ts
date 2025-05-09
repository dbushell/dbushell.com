import * as fs from "@std/fs";
import * as path from "@std/path";
import { componentName, Hypermore, JSONObject } from "@dbushell/hypermore";
import type { DConfig, DHono } from "../types.ts";

let hypermore: Hypermore;

export const middleware = async (hono: DHono, config: DConfig) => {
  hypermore = new Hypermore();
  const template_dir = path.resolve(
    config.rootDir.pathname,
    config.templateDir,
  );
  if (fs.existsSync(template_dir) === false) {
    const message = "Missing template directory";
    console.warn(`${message}: "${template_dir}"`);
    hono.use("/*", async (ctx, next) => {
      ctx.set("render", () => {
        return Promise.resolve(message);
      });
      await next();
    });
    return;
  }
  for await (
    const entry of fs.walk(template_dir, {
      exts: ["html"],
    })
  ) {
    const name = componentName(entry.name);
    if (hypermore.hasTemplate(name)) {
      console.warn(`Duplicate component: "${name}"`);
    } else {
      const html = await Deno.readTextFile(entry.path);
      hypermore.setTemplate(name, html);
    }
  }
  hono.use("/*", async (ctx, next) => {
    ctx.set("render", (html: string, props?: JSONObject) => {
      return hypermore.render(html, props ?? {}, {
        globalProps: {
          url: ctx.req.url,
          deployHash: config.deployHash,
        },
      });
    });
    await next();
  });
};
