import * as fs from "@std/fs";
import * as path from "@std/path";
import { serveDir } from "@std/http/file-server";
import type { DConfig, DHono } from "../types.ts";

export const middleware = (hono: DHono, config: DConfig) => {
  const public_dir = path.resolve(
    config.rootDir.pathname,
    config.publicDir,
  );
  if (fs.existsSync(public_dir) === false) {
    console.warn(`Missing public directory: "${public_dir}"`);
    return;
  }
  hono.use("/*", async (ctx, next) => {
    const response = await serveDir(ctx.req.raw, {
      fsRoot: public_dir,
      quiet: true,
    });
    if (response.status === 304) {
      return response;
    }
    if (response.ok) {
      ctx.res = response;
    }
    await next();
  });
};
