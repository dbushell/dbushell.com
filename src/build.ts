import * as fs from "@std/fs";
import * as path from "@std/path";
import { toText } from "@std/streams";
import { Node, parseHTML } from "@dbushell/hyperless";
import { assert } from "./utils.ts";
import type { DConfig, DHono } from "./types.ts";
import {
  clearIndex,
  type IndexPage,
  parseWords,
  writeIndex,
} from "./search/index.ts";

performance.mark("b-start");

import { manifest } from "./content/manifest.ts";

const buildPath = path.resolve(Deno.cwd(), "build");
const cachePath = path.join(Deno.cwd(), ".cache");

if (!(await fs.exists(cachePath))) {
  fs.ensureDir(cachePath);
}

const extra = [
  "/rss.xml",
  "/notes/rss.xml",
  "/merge/rss.xml",
  "/sitemap.xml",
  "/assets/scripts/head.js",
  "/sw.js",
];

export const build = async (hono: DHono, config: DConfig) => {
  const now = performance.now();
  console.log("Building...");

  // Clear build directory and copy static files
  await fs.emptyDir(buildPath);
  await fs.copy(config.publicDir, buildPath, { overwrite: true });

  // Add manifest routes and islands
  const routePaths = Object.keys(manifest.routes);
  manifest.notes.forEach((note) => {
    routePaths.push(note.href);
  });
  routePaths.push(...extra);

  // Add glossary terms
  for (const key of manifest.glossary.keys()) {
    routePaths.push(`/glossary/${key}.json`);
  }

  // Open stdout writer and hide cursor
  const writer = Deno.stdout.writable.getWriter();
  const encoder = new TextEncoder();
  if (Deno.stdout.isTerminal()) {
    await writer.write(encoder.encode("\x1b[?25l"));
  }

  let taskDone = 0;
  const taskEnd = async (key: string) => {
    taskDone++;
    if (!Deno.stdout.isTerminal()) {
      return;
    }
    const elapsed = (performance.now() - now).toFixed(2).padStart(7, " ");
    const total = routePaths.length.toString();
    const done = taskDone.toString().padStart(total.length, "0");
    key = key.slice(0, Deno.consoleSize().columns - 30);
    const message =
      `\r→ ${done}/${total} ${elapsed}ms \x1b[2m${key}\x1b[0m \x1b[0K`;
    await writer.write(encoder.encode(message));
  };

  // Fake request params
  const info: Deno.ServeHandlerInfo<Deno.Addr> = {
    completed: Promise.resolve(),
    remoteAddr: {
      transport: "tcp",
      hostname: "127.0.0.1",
      port: 8000,
    },
  };

  clearIndex();
  const search_pages: IndexPage[] = [];

  for (const key of routePaths) {
    let routePath = "index.html";
    if (key === "/404/") {
      routePath = "404.html";
    } else if (key !== "/") {
      routePath = key;
      if (key.endsWith("/")) {
        routePath += "index.html";
      }
    }
    routePath = path.join(buildPath, routePath);
    const url = new URL(key, "http://127.0.0.1:8000");
    const request = new Request(url);
    const response = await hono.fetch(request, {
      info,
      origin: config.origin,
      deployHash: config.deployHash,
      devMode: false,
    });
    if (response.status !== 200 || !response.body) {
      console.log(`\n${url.href}`);
      console.log(response);
      throw new Error(`[${response.status}] ${response.url}`);
    }
    await fs.ensureFile(routePath);
    if (extra.includes(key)) {
      await Deno.remove(routePath).catch(() => {});
    }
    const [tee1, tee2] = response.body.tee();
    await Deno.writeFile(routePath, tee1);

    // Write CSP header
    if (key === "/") {
      await Deno.writeTextFile(
        path.join(buildPath, "_headers"),
        `content-security-policy: ${
          response.headers.get("content-security-policy")
        }\n`,
      );
    }

    // Build search index
    if (/^\/\d{4}(\/|-)\d{2}\1\d{2}/.test(key)) {
      const hash = manifest.routes[key].hash;
      assert(hash);
      const text = await toText(tee2);
      let node: Node | null = parseHTML(text);
      node = node.find((n) => n.tag === "main");
      assert(node);
      search_pages.push([hash, key, manifest.routes[key].title]);
      parseWords(node, hash);
    } else {
      await tee2.cancel();
    }

    taskEnd(key);
  }

  // Clear progress and show cursor
  if (Deno.stdout.isTerminal()) {
    await writer.write(encoder.encode("\r\x1b[0K\x1b[?25h"));
  }
  writer.releaseLock();
  const ms = (performance.now() - now).toFixed(2);
  console.log(`Built ${taskDone} routes in ${ms}ms`);

  {
    performance.mark("s-start");
    await writeIndex(search_pages);
    performance.mark("s-end");
    const { duration } = performance.measure("s", "s-start", "s-end");
    console.log(`Search ${duration.toFixed(2)}ms`);
  }

  performance.mark("b-end");
  const { duration } = performance.measure("b", "b-start", "b-end");
  console.log(`Total ${duration.toFixed(2)}ms`);
};
