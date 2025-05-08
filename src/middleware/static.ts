import type { Hono } from "@hono/hono";
import * as fs from "@std/fs";
import * as path from "@std/path";
import { serveDir } from "@std/http/file-server";
import type { Config } from "@src/types.ts";

export const middleware = (hono: Hono, config: Config) => {
  hono.use("/*", async (ctx, next) => {
    const public_dir = path.resolve(
      config.root_dir.pathname,
      config.public_dir,
    );
    if (fs.existsSync(public_dir) === false) {
      console.warn(`Missing public directory: "${public_dir}"`);
      return next();
    }
    const response = await serveDir(ctx.req.raw, {
      fsRoot: public_dir,
      quiet: true,
    });
    if (response.ok || response.status === 304) {
      return response;
    }
    await next();
  });
};
